import express, {Request, Response, Application} from "express"
import {response, product, distributer, orderType} from "../types";
import jwt from "jsonwebtoken"

const order: Application = express()

//MIDDLEWARES
order.use(express.json())

//MODELS
import Order from "../models/Order"

//Routes
order.post("/place", async (req:Request, res: Response) =>{

    let response:response = {
        status : false,
        message : "Unable to Place order"
      }

    let data: orderType = {
        product_id : req.body.product_id,
        order_details : {
            width :     req.body.order_details.width ,
            height :    req.body.order_details.height ,
            arcTop :    req.body.order_details.arcTop ,
            arcBottom : req.body.order_details.arcBottom ,
            varnish :   req.body.order_details.varnish ,
            whiteCoat : req.body.order_details.whiteCoat ,
            sandwich :  req.body.order_details.sandwich ,
            message :   req.body.order_details.message
        },
        order_placed_by : req.body.order_placed_by,
        order_processed_by :req.body.order_processed_by,
        shipping_address :  req.body.shipping_address,
        status : 0,
        category : req.body.category,
        subCategory :  req.body.subCategory
    }

    try {
        
       let ord =  await Order.create(data)
        .then(()=>{
            response.status = true
            response.message = "Order Placed Successfully"
        }).
        catch(() => { throw new Error})

    } catch (error) {
        
        response.message = "Somthing went wrong while placing the order!"
    }

    res.json(response)

})




export default order

