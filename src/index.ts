import "dotenv/config"
import express ,{Request, Response, NextFunction, Application} from "express"
import mongo from "mongoose"
import cors from "cors"
import jwt from "jsonwebtoken"
import {validate_token} from "./functions"


const app: Application = express()

//MIDDLEWARES
app.use(express.json())
app.use(cors())

app.get("/token", async (req, res)=>{
    res.send(jwt.sign(JSON.stringify({
        name: "name",
        phone: "phone",
        email: "email",  
        basePrice: "basePrice",
        _id : "_id", 
        authority:"A2"
    }), process.env.JWT_PASS!))
})




//Routes
import products from "./routes/product"
import admin from "./routes/admin"
import distributer from "./routes/distributer"
import order from "./routes/orders"
import marketeer  from "./routes/marketeer"


//ROUTES

app.use("/admin", admin)
app.use("/distributer", distributer)
app.use("/marketeer", marketeer)
app.use("/order", order)
app.use("/products", products)


mongo.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lgzgs.mongodb.net/artpoint?retryWrites=true&w=majority`)
.then(()=> {console.log("connected")})
.catch( () => {console.log("Somthing went wrong, Try again later")})


app.get("/", (req, res)=> {
    res.send("WELCOME TO THE PROJECT API")
})



app.listen(process.env.PORT, ()=>{console.log('running at http://127.0.0.1:'+process.env.PORT)})
