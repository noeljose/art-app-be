require("dotenv").config()
const express = require("express")
const app = express()
const mongo = require("mongoose")

const products = require("./routes/product.js")

//ROUTES
app.use("/products", products)

mongo.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lgzgs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)

//REMOVE IN PROD
.then( msg => console.log("connected"))
.catch(err => console.log("Somthing went wrong, Try again later"))


app.get("/", (req, res)=> {
    res.send("WELCOME TO THE PROJECT API")
})

app.listen(process.env.PORT)
