const ADMIN_EMAIL = "admin@glowupnutrition.pl";
const ADMIN_PASSWORD = "admin123";
const BACKEND_URL = "http://localhost:9000";

async function getToken() {
    try {
        const response = await fetch(`${BACKEND_URL}/auth/user/emailpass`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
        });

        if (!response.ok) throw new Error(`Auth failed: ${response.statusText}`);
        const data = await response.json();
        return data.token;
    } catch (e) {
        console.error(`Error getting token: ${e.message}`);
        process.exit(1);
    }
}

async function getSalesChannelId(token) {
    try {
        const response = await fetch(`${BACKEND_URL}/admin/sales-channels`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error(`Get Sales Channels failed: ${response.statusText}`);
        const data = await response.json();
        const channels = data.sales_channels || [];
        if (!channels.length) {
            console.error("No sales channels found!");
            process.exit(1);
        }
        return channels[0].id;
    } catch (e) {
        console.error(`Error getting sales channel: ${e.message}`);
        process.exit(1);
    }
}

async function createProduct(token, salesChannelId) {
    const productData = {
        title: "GlowUp Whey Protein - Czekolada",
        handle: "glowup-whey-protein-chocolate",
        description: "Wysokobiałkowa odżywka serwatkowa o smaku czekoladowym. 25g białka na porcję. Idealna dla osób aktywnych fizycznie, wspierająca regenerację mięśni i budowę masy mięśniowej.",
        subtitle: "Odżywka białkowa premium - 900g",
        status: "published",
        is_giftcard: false,
        discountable: true,
        weight: 900,
        material: "WPC 80%",
        options: [
            {
                title: "Smak",
                values: ["Czekolada"]
            }
        ],
        variants: [
            {
                title: "Czekolada - 900g",
                sku: "GLOWUP-WHEY-CHOC-900",
                barcode: "5901234567890",
                manage_inventory: true,
                options: {
                    Smak: "Czekolada"
                },
                prices: [
                    {
                        amount: 12900, // 129.00 PLN
                        currency_code: "pln"
                    }
                ]
            }
        ],
        sales_channels: [
            { id: salesChannelId }
        ]
    };

    try {
        console.log("Creating product...");
        const response = await fetch(`${BACKEND_URL}/admin/products`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Create Product failed: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        const product = data.product;
        console.log(`✅ Product created: ${product.title} (ID: ${product.id})`);

    } catch (e) {
        console.error(`Error creating product: ${e.message}`);
        process.exit(1);
    }
}

async function main() {
    const token = await getToken();
    const scId = await getSalesChannelId(token);
    await createProduct(token, scId);
}

main();
