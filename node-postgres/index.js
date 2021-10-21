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

app.put("/orders/:id", async(req,res)=>{
try {
  const {id} = req.params;
  const {driver_id} = req.body;
  const updateOrders = await pool.query("UPDATE orders SET driver_id= $1 WHERE id=$2", [driver_id, id])
  // console.log("reqqqqqqq: ", req.body);
  res.json("Updated orderrrrrs")
} catch (error) {
  console.log(error);
}
})

app.put("/assigned/:id", async(req,res)=>{
  try {
    const{id} = req.params;
    const{assigned} = req.body;
    const assignedStatus = await pool.query("UPDATE orders SET assigned=$1 WHERE id=$2", [assigned, id])

    // console.log("reqqqqqqq: ", req.body);
  res.json("Assigned orderrrrrs")
  } catch (error) {
    console.log(error);
  }
})

app.put("/cost/:id", async(req,res)=>{
  try {
    const{id} = req.params;
    const{cost} = req.body;
    const updateCost = await pool.query("UPDATE orders SET cost=$1 WHERE id=$2", [cost, id])

    // console.log("reqqqqqqq: ", req.body);
  res.json("Updated cost")
  } catch (error) {
    console.log(error);
  }
})

app.put("/revenue/:id", async(req,res)=>{
  try {
    const{id} = req.params;
    const{revenue_amount} = req.body;
    const updateRevenue = await pool.query("UPDATE orders SET revenue_amount=$1 WHERE id=$2", [revenue_amount, id])

    // console.log("reqqqqqqq: ", req.body);
    res.json("Updated revenue")
  } catch (error) {
    console.log(error);
  }
})


app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
