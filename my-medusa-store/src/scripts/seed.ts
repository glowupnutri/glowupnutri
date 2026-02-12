import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils";
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import {
  createApiKeysWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresStep,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";
import { ApiKey } from "../../.medusa/types/query-entry-points";

const updateStoreCurrencies = createWorkflow(
  "update-store-currencies",
  (input: {
    supported_currencies: { currency_code: string; is_default?: boolean }[];
    store_id: string;
  }) => {
    const normalizedInput = transform({ input }, (data) => {
      return {
        selector: { id: data.input.store_id },
        update: {
          supported_currencies: data.input.supported_currencies.map(
            (currency) => {
              return {
                currency_code: currency.currency_code,
                is_default: currency.is_default ?? false,
              };
            }
          ),
        },
      };
    });

    const stores = updateStoresStep(normalizedInput);

    return new WorkflowResponse(stores);
  }
);

export default async function seedDemoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);

  // ============================================
  // 1. STORE & SALES CHANNEL
  // ============================================
  logger.info("🛍️  Setting up GlowUp Nutrition store...");
  const [store] = await storeModuleService.listStores();
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [
          {
            name: "Default Sales Channel",
          },
        ],
      },
    });
    defaultSalesChannel = salesChannelResult;
  }

  // ============================================
  // 2. CURRENCY: PLN (Polish Zloty)
  // ============================================
  logger.info("💰 Setting up PLN currency...");
  await updateStoreCurrencies(container).run({
    input: {
      store_id: store.id,
      supported_currencies: [
        {
          currency_code: "pln",
          is_default: true,
        },
      ],
    },
  });

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  });

  // ============================================
  // 3. REGION: Polska
  // ============================================
  logger.info("🇵🇱 Creating Poland region...");
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Polska",
          currency_code: "pln",
          countries: ["pl"],
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  });
  const region = regionResult[0];
  logger.info("✅ Region Polska created.");

  // ============================================
  // 4. TAX REGION: Polska (23% VAT)
  // ============================================
  logger.info("📋 Setting up tax region...");
  await createTaxRegionsWorkflow(container).run({
    input: [
      {
        country_code: "pl",
        provider_id: "tp_system",
      },
    ],
  });

  // ============================================
  // 5. STOCK LOCATION: Magazyn GlowUp
  // ============================================
  logger.info("📦 Creating stock location...");
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "Magazyn GlowUp",
          address: {
            city: "Warszawa",
            country_code: "PL",
            address_1: "",
          },
        },
      ],
    },
  });
  const stockLocation = stockLocationResult[0];

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_location_id: stockLocation.id,
      },
    },
  });

  // Link stock location to fulfillment provider
  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  // ============================================
  // 6. SHIPPING PROFILE & FULFILLMENT SET
  // ============================================
  logger.info("🚚 Setting up shipping...");
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  });
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;

  if (!shippingProfile) {
    const { result: shippingProfileResult } =
      await createShippingProfilesWorkflow(container).run({
        input: {
          data: [
            {
              name: "Default Shipping Profile",
              type: "default",
            },
          ],
        },
      });
    shippingProfile = shippingProfileResult[0];
  }

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "Dostawa Polska",
    type: "shipping",
    service_zones: [
      {
        name: "Polska",
        geo_zones: [
          {
            country_code: "pl",
            type: "country",
          },
        ],
      },
    ],
  });

  // Link fulfillment set to stock location
  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: fulfillmentSet.id,
    },
  });

  // ============================================
  // 7. SHIPPING OPTIONS
  // ============================================
  logger.info("📮 Creating InPost Paczkomaty 24/7 shipping option...");
  await createShippingOptionsWorkflow(container).run({
    input: [
      // InPost Paczkomaty 24/7 — 14 PLN (1400 groszy)
      {
        name: "InPost Paczkomaty 24/7",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "InPost Paczkomaty",
          description: "Dostawa do paczkomatu InPost w 24h. Darmowa wysyłka powyżej 250 zł.",
          code: "inpost_paczkomat",
        },
        prices: [
          {
            currency_code: "pln",
            amount: 14,
          },
          {
            region_id: region.id,
            amount: 14,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
    ],
  });
  logger.info("✅ Shipping options created.");

  // ============================================
  // 8. LINK SALES CHANNEL TO STOCK LOCATION
  // ============================================
  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel[0].id],
    },
  });

  // ============================================
  // 9. PUBLISHABLE API KEY
  // ============================================
  logger.info("🔑 Setting up publishable API key...");
  let publishableApiKey: ApiKey | null = null;
  const { data } = await query.graph({
    entity: "api_key",
    fields: ["id"],
    filters: {
      type: "publishable",
    },
  });

  publishableApiKey = data?.[0];

  if (!publishableApiKey) {
    const {
      result: [publishableApiKeyResult],
    } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [
          {
            title: "GlowUp Storefront",
            type: "publishable",
            created_by: "",
          },
        ],
      },
    });

    publishableApiKey = publishableApiKeyResult as ApiKey;
  }

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel[0].id],
    },
  });

  logger.info("=".repeat(60));
  logger.info("🎉 GlowUp Nutrition store seeded successfully!");
  logger.info(`📮 Publishable API Key: ${publishableApiKey.id}`);
  logger.info(`🇵🇱 Region: Polska (PLN)`);
  logger.info(`🚚 Shipping: InPost Paczkomaty 24/7 — 14 PLN`);
  logger.info("=".repeat(60));
}
