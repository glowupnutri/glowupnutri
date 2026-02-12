import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { createInventoryItemsWorkflow, linkSalesChannelsToStockLocationWorkflow } from "@medusajs/medusa/core-flows";

export default async function fixData({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    const link = container.resolve(ContainerRegistrationKeys.LINK);
    const pricingModule = container.resolve(Modules.PRICING);

    logger.info("🔧 Starting Cloud Data Fix Script...");

    // 1. Find Product & Variant
    const { data: products } = await query.graph({
        entity: "product",
        fields: ["id", "title", "variants.id", "variants.sku", "variants.title"],
        filters: { handle: "glowup-whey-protein-chocolate" },
    });

    if (!products.length) {
        logger.error("❌ Product not found!");
        return;
    }

    const product = products[0];
    const variant = product.variants[0];
    logger.info(`✅ Found Product: ${product.title}`);
    logger.info(`✅ Found Variant: ${variant.title} (${variant.id})`);

    // 2. Fix Price - Robust Strategy
    logger.info("💰 Injecting Price...");

    // Check if variant has a price set
    const { data: variantData } = await query.graph({
        entity: "product_variant",
        fields: ["price_set.id"],
        filters: { id: variant.id }
    });

    let priceSetId = variantData[0].price_set?.id;

    if (!priceSetId) {
        logger.info("⚠️ No Price Set found. Creating one...");
        // Create a price set using the Pricing Module directly
        const priceSet = await pricingModule.createPriceSets({
            prices: [
                {
                    amount: 129,
                    currency_code: "pln",
                }
            ]
        });
        priceSetId = priceSet.id;
        logger.info(`✅ Price Set created: ${priceSetId}`);

        // Link Price Set to Variant
        await link.create({
            [Modules.PRODUCT]: {
                variant_id: variant.id,
            },
            [Modules.PRICING]: {
                price_set_id: priceSetId,
            },
        });
        logger.info("✅ Price Set linked to Variant.");
    } else {
        logger.info(`✅ Found existing Price Set ID: ${priceSetId}. Updating Price...`);
        // addPriceSetsPrices or addPrices ? In recent versions it is addPrices with object
        await pricingModule.upsertPriceSets([{
            id: priceSetId,
            prices: [
                {
                    amount: 129,
                    currency_code: "pln",
                }
            ]
        }]);
        logger.info("✅ Price 129 PLN updated.");
    }


    // 3. Fix Inventory
    logger.info("📦 Fixing Inventory...");

    // Check if inventory item exists
    const { data: inventoryLinks } = await query.graph({
        entity: "product_variant",
        fields: ["inventory_items.inventory_item_id"],
        filters: { id: variant.id }
    });

    let inventoryItemId = inventoryLinks[0]?.inventory_items?.[0]?.inventory_item_id;

    if (!inventoryItemId) {
        logger.info("⚠️ No Inventory Item found. Creating one...");
        const { result } = await createInventoryItemsWorkflow(container).run({
            input: {
                items: [{
                    sku: variant.sku || "GLOWUP-WHEY-CHOC-900",
                    title: variant.title,
                    requires_shipping: true
                }]
            }
        });
        inventoryItemId = result[0].id;

        // Link it
        await link.create({
            [Modules.PRODUCT]: {
                variant_id: variant.id,
            },
            [Modules.INVENTORY]: {
                inventory_item_id: inventoryItemId,
            },
        });
        logger.info("✅ Inventory Item created and linked.");
    } else {
        logger.info(`✅ Inventory Item already exists: ${inventoryItemId}`);
    }

    // 4. Add Stock Level
    // We need a Location. Get default location.
    const stockLocationModule = container.resolve(Modules.STOCK_LOCATION);
    const locations = await stockLocationModule.listStockLocations({});
    const location = locations[0];

    if (!location) {
        logger.error("❌ No Stock Location found!");
        return;
    }
    logger.info(`Found Location: ${location.name} (${location.id})`);

    // Add inventory level using Inventory Module Service directly might be easier or workflow
    const inventoryModule = container.resolve(Modules.INVENTORY);
    try {
        await inventoryModule.createInventoryLevels([{
            inventory_item_id: inventoryItemId,
            location_id: location.id,
            stocked_quantity: 100,
            incoming_quantity: 0
        }]);
        logger.info("✅ Stock Level set to 100.");
    } catch (e) {
        // If level exists, update it
        await inventoryModule.updateInventoryLevels([{
            inventory_item_id: inventoryItemId,
            location_id: location.id,
            stocked_quantity: 100
        }]);
        logger.info("✅ Stock Level updated to 100.");
    }

    // 5. Ensure Location is linked to Sales Channel
    const salesChannelModule = container.resolve(Modules.SALES_CHANNEL);
    const [sc] = await salesChannelModule.listSalesChannels({ name: "Default Sales Channel" });

    if (sc) {
        await linkSalesChannelsToStockLocationWorkflow(container).run({
            input: {
                id: location.id,
                add: [sc.id],
            },
        });
        logger.info("✅ Sales Channel linked to Stock Location.");
    }

    logger.info("🚀 Fix Complete!");
}
