// index.js
const express = require('express');
const bodyParser = require('body-parser');
const neo4j = require('neo4j-driver');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const driver = neo4j.driver(
  'neo4j+s://c8a0a9ad.databases.neo4j.io',
  neo4j.auth.basic('neo4j', 'OPZzBvAPjVFVol7h79DwGZL_uASFAnkJgNQ3Gj4m4KU')
);

app.post('/query', async (req, res) => {
  const { cypher, params } = req.body;
  const session = driver.session({ database: 'neo4j' }); // AURA 必須指定資料庫名稱
  try {
    const result = await session.run(cypher, params || {});
    const records = result.records.map(record => record.toObject());
    res.json({ success: true, data: records });
  } catch (error) {
    console.error('Neo4j 錯誤：', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    await session.close();
  }
});

app.get('/', (req, res) => {
  res.send('Neo4j proxy is running.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
