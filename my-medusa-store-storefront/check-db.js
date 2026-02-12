const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://localhost:5432/medusa_glowup',
});

async function checkData() {
    try {
        await client.connect();
        const users = await client.query("SELECT id, email FROM \"user\""); // Table name is usually lowercase 'user' in Postgres but might be reserved key word so quoting. In Medusa v2 it might be 'auth_user' or similar. 
        // Medusa v2 uses 'auth_identity' and 'user' in the User Module. 
        // Let's list tables first if unsure, but 'user' is likely.

        console.log('Users:', users.rows);

        // Also check price_set and price
        // In Medusa v2, we have price_set, price_set_rule_type, price, price_rule
        const prices = await client.query("SELECT * FROM price LIMIT 5");
        console.log('Prices:', prices.rows);

    } catch (err) {
        console.error('Error executing query', err);
    } finally {
        await client.end();
    }
}

checkData();
