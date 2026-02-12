import { ExecArgs } from "@medusajs/framework/types";
import {
    ContainerRegistrationKeys,
    Modules,
} from "@medusajs/framework/utils";

export default async function setupStripeAndProduct({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const remoteLink = container.resolve(ContainerRegistrationKeys.LINK);
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    const regionModuleService = container.resolve(Modules.REGION);
    const productModuleService = container.resolve(Modules.PRODUCT);
    const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
    const inventoryModuleService = container.resolve(Modules.INVENTORY);
    const stockLocationModuleService = container.resolve(Modules.STOCK_LOCATION);
    const pricingModuleService = container.resolve(Modules.PRICING);

    // ============================================
    // 1. LINK STRIPE TO POLSKA REGION
    // ============================================
    logger.info("💳 Linking Stripe payment providers to Polska region...");

    const regions = await regionModuleService.listRegions({ name: "Polska" });
    if (!regions.length) {
        logger.error("❌ Region 'Polska' not found! Run seed.ts first.");
        return;
    }
    const region = regions[0];

    // Add Stripe, BLIK, and Przelewy24 payment providers to the region
    const paymentProviders = [
        "pp_stripe_stripe",
        "pp_stripe-blik_stripe",
        "pp_stripe-przelewy24_stripe",
        "pp_system_default",
    ];

    for (const providerId of paymentProviders) {
        try {
            await remoteLink.create({
                [Modules.REGION]: { region_id: region.id },
                [Modules.PAYMENT]: { payment_provider_id: providerId },
            });
            logger.info(`  ✅ Linked ${providerId}`);
        } catch (e: any) {
            if (e.message?.includes("already exists")) {
                logger.info(`  ⏭️  ${providerId} already linked`);
            } else {
                logger.warn(`  ⚠️  Could not link ${providerId}: ${e.message}`);
            }
        }
    }

    // ============================================
    // 2. CREATE TEST PRODUCT
    // ============================================
    logger.info("🧪 Creating test product...");

    // Check if test product already exists
    const existingProducts = await productModuleService.listProducts({
        handle: "glowup-whey-protein-chocolate",
    });

    if (existingProducts.length) {
        logger.info("  ⏭️  Test product already exists, skipping creation.");
        return;
    }

    // Get default sales channel
    const salesChannels = await salesChannelModuleService.listSalesChannels({
        name: "Default Sales Channel",
    });
    const salesChannel = salesChannels[0];

    // Get stock location
    const stockLocations = await stockLocationModuleService.listStockLocations({
        name: "Magazyn GlowUp",
    });
    const stockLocation = stockLocations[0];

    // Create product category
    let category;
    try {
        const categories =
            await productModuleService.listProductCategories({
                handle: "suplementy",
            });
        if (categories.length) {
            category = categories[0];
        } else {
            category = await productModuleService.createProductCategories({
                name: "Suplementy",
                handle: "suplementy",
                is_active: true,
            });
        }
    } catch (e) {
        logger.warn("  ⚠️  Could not create category, continuing without it.");
    }

    // Create product with variants
    const product = await productModuleService.createProducts({
        title: "GlowUp Whey Protein - Czekolada",
        handle: "glowup-whey-protein-chocolate",
        description:
            "Wysokobiałkowa odżywka serwatkowa o smaku czekoladowym. 25g białka na porcję. Idealna dla osób aktywnych fizycznie, wspierająca regenerację mięśni i budowę masy mięśniowej.",
        subtitle: "Odżywka białkowa premium - 900g",
        status: "published",
        is_giftcard: false,
        discountable: true,
        weight: 900,
        material: "WPC 80%",
        options: [
            {
                title: "Smak",
                values: ["Czekolada"],
            },
        ],
        variants: [
            {
                title: "Czekolada - 900g",
                sku: "GLOWUP-WHEY-CHOC-900",
                barcode: "5901234567890",
                manage_inventory: true,
                options: {
                    Smak: "Czekolada",
                },
            },
        ],
        ...(category ? { categories: [{ id: category.id }] } : {}),
    });

    logger.info(`  ✅ Product created: ${product.id}`);

    // ============================================
    // 3. SET PRODUCT PRICE
    // ============================================
    logger.info("💰 Setting product price...");

    const variant = product.variants[0];

    // Create a price set and link it to the variant
    const priceSet = await pricingModuleService.createPriceSets({
        prices: [
            {
                amount: 129,
                currency_code: "pln",
            },
        ],
    });

    // Link price set to variant
    await remoteLink.create({
        [Modules.PRODUCT]: { product_variant_id: variant.id },
        [Modules.PRICING]: { price_set_id: priceSet.id },
    });

    logger.info(`  ✅ Price set: 129,00 PLN`);

    // ============================================
    // 4. LINK PRODUCT TO SALES CHANNEL
    // ============================================
    logger.info("📺 Linking to sales channel...");

    await remoteLink.create({
        [Modules.PRODUCT]: { product_id: product.id },
        [Modules.SALES_CHANNEL]: { sales_channel_id: salesChannel.id },
    });

    logger.info(`  ✅ Linked to Default Sales Channel`);

    // ============================================
    // 5. SET INVENTORY
    // ============================================
    logger.info("📦 Setting inventory...");

    // Create inventory item
    const inventoryItem = await inventoryModuleService.createInventoryItems({
        sku: "GLOWUP-WHEY-CHOC-900",
        title: "GlowUp Whey Protein - Czekolada 900g",
    });

    // Link inventory to variant
    await remoteLink.create({
        [Modules.PRODUCT]: { product_variant_id: variant.id },
        [Modules.INVENTORY]: { inventory_item_id: inventoryItem.id },
    });

    // Create inventory level (stock at location)
    await inventoryModuleService.createInventoryLevels({
        inventory_item_id: inventoryItem.id,
        location_id: stockLocation.id,
        stocked_quantity: 100,
    });

    logger.info(`  ✅ Inventory: 100 units at ${stockLocation.name}`);

    // ============================================
    // DONE
    // ============================================
    logger.info("=".repeat(60));
    logger.info("🎉 Setup complete!");
    logger.info(`💳 Stripe linked to region: ${region.name}`);
    logger.info(`🧪 Test product: ${product.title} — 129,00 PLN`);
    logger.info(`📦 Inventory: 100 units`);
    logger.info("=".repeat(60));
}
