const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = 3000;

// MongoDB URI and Database details
const uri = "mongodb://localhost:27017";  // Assuming MongoDB is running locally
const dbName = "companiesDB";
let db, companiesCollection;

// Connect to MongoDB
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log("Connected to MongoDB");
    db = client.db(dbName);
    companiesCollection = db.collection("companies");
  })
  .catch(err => console.error("Failed to connect to MongoDB:", err));

// Middleware to serve static files
app.use(express.static('public'));

// Routes for performing queries

// Query 1: All companies whose name matches 'Babelgum'
app.get('/companies/babelgum', async (req, res) => {
  try {
    const query = { name: "Babelgum" };
    const projection = { name: 1 };
    const companies = await companiesCollection.find(query).project(projection).toArray();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Query 2: Companies with more than 5000 employees (Limit: 20, Sort by employees)
app.get('/companies/employees-more-than-5000', async (req, res) => {
  try {
    const query = { number_of_employees: { $gt: 5000 } };
    const companies = await companiesCollection.find(query)
      .sort({ number_of_employees: 1 })
      .limit(20)
      .toArray();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Query 3: Companies founded between 2000 and 2005 (Include only name and founded year)
app.get('/companies/founded-2000-2005', async (req, res) => {
  try {
    const query = { founded_year: { $gte: 2000, $lte: 2005 } };
    const projection = { name: 1, founded_year: 1 };
    const companies = await companiesCollection.find(query).project(projection).toArray();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Query 4: Companies with IPO valuation more than 100,000,000 and founded before 2010
app.get('/companies/ipo-more-than-100m', async (req, res) => {
  try {
    const query = { "ipo.valuation_amount": { $gt: 100000000 }, "founded_year": { $lt: 2010 } };
    const projection = { name: 1, ipo: 1 };
    const companies = await companiesCollection.find(query).project(projection).toArray();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Query 5: Companies with less than 1000 employees and founded before 2005 (Sort by number of employees, Limit 10)
app.get('/companies/employees-less-than-1000', async (req, res) => {
  try {
    const query = { number_of_employees: { $lt: 1000 }, founded_year: { $lt: 2005 } };
    const companies = await companiesCollection.find(query)
      .sort({ number_of_employees: 1 })
      .limit(10)
      .toArray();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// More queries can be added here as needed...

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
