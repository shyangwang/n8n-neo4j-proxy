require('dotenv').config();
const express = require('express');
const neo4j = require('neo4j-driver');

const app = express();
app.use(express.json());

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
);

app.post('/query', async (req, res) => {
  const session = driver.session({ database: 'neo4j' });
  const { cypher, params } = req.body;
  try {
    const result = await session.run(cypher, params || {});
    const records = result.records.map(r => r.toObject());
    res.json({ records });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  } finally {
    await session.close();
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Proxy listening on port ${port}`));
