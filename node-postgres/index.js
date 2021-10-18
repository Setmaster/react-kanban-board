const express = require("express");
const app = express();
const cors = require("cors");
const port = 5000;

const pool = require("./db");

// middleware
app.use(cors());
app.use(express.json()); //req.body

// ROUTES

app.get("/", async (req, res) => {
  // console.log("Backendddddd connected");
  try {
    const allDrivers = await pool.query("SELECT * FROM drivers");
    res.json(allDrivers.rows);
  } catch (err) {
    console.log(err.message);
  }
});

app.get("/orders", async(req,res)=>{
  try {
    const allOrders = await pool.query("SELECT * FROM orders");
    res.json(allOrders.rows)
  } catch (err) {
    console.log(err.message);
  }
})


app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
