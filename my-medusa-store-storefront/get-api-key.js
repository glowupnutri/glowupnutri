const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://localhost:5432/medusa_glowup',
});

async function getKeys() {
    try {
        await client.connect();
        const res = await client.query("SELECT * FROM api_key WHERE type = 'publishable'");
        console.log('Publishable Keys:', res.rows);
    } catch (err) {
        console.error('Error executing query', err);
    } finally {
        await client.end();
    }
}

getKeys();
