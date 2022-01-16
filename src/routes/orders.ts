import express, {Request, Response, Application, NextFunction} from "express"
import {response, product, distributer, orderType} from "../types";
import jwt from "jsonwebtoken"
import cors from "cors"
import {validate_token} from "../functions"

const order: Application = express()

//MIDDLEWARES
order.use(cors())

//MODELS
import Order from "../models/Order"

//Routes
order.post("/place", async (req:Request, res: Response) =>{

    let response:response = {
        status : false,
        message : "Unable to place order"
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
            response.message = "Order placed successfully"
        }).
        catch(() => { throw new Error})

    } catch (error) {
        
        response.message = "Somthing went wrong while placing the order!"
    }

    res.json(response)

})


order.post("/list", async (req:Request, res: Response) =>{

    let response:response = {
        status : false,
        message : "Unable to list order"
    }

    let limit = req.body.limit
    let skip = req.body.skip


    let query:any = {
        name: {$regex: req.body.search_query , $options : "i"}
    }

    !req.body.search_query? query.name = "" : null
    req.body.category? query.category = req.body.category :null
    req.body.subCategory? query.subCategory = req.body.subCategory :null
   
    try {
        await Order.find(query)
        .then(result => {
            response.data = result
        }).catch(error => {
            throw new Error;
        })
    } catch (error) {
        response.message = "Somthing went wrong while fetching the orders!"
    }
    res.json(response)

})

order.post("/read", async (req:Request, res: Response) =>{

    let response:response = {
        status : false,
        message : "Unable to read allorder"
    }

    let limit = req.body.limit
    let skip = req.body.skip

    try {
        await Order.find()
        .then(result => {
            response.data = result
        }).catch(error => {
            throw new Error;
        })
    } catch (error) {
        response.message = "Somthing went wrong while fetching the orders!"
    }
    res.json(response)

})

order.post("/single_order_view", async (req:Request, res: Response)=>{
    let order_id = req.body.order_id

    let response:response = {
        status : false,
        message : "Unable to find the order"
    }

    try {

        await Order.findById(order_id)
        .then(result => response.data = result)
        .catch(error => {throw new Error})
        
    } catch (error) {
        response.message = "Somthing went wrong while fetching the order!"
    }

    res.json(response)
})

export default order

