import "dotenv/config"
import express ,{Request, Response, NextFunction, Application} from "express"
import mongo from "mongoose"
import products from "./routes/product"

const app: Application = express()
//ROUTES
app.use("/products", products)

//MIDDLEWARES
app.use(express.json())

mongo.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lgzgs.mongodb.net/artpoint?retryWrites=true&w=majority`)

.then(()=> {console.log("connected")})
.catch( () => {console.log("Somthing went wrong, Try again later")})


app.get("/", (req, res)=> {
    res.send("WELCOME TO THE PROJECT API")
})

app.listen(process.env.PORT)
