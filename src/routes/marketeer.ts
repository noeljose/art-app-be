import express, {Request, Response, Application, NextFunction} from "express"
import {response, product, marketeer} from "../types";
import jwt from "jsonwebtoken"
import cors from "cors"
import {validate_token} from "../functions"

const marketeerRoute: Application = express()

marketeerRoute.use(cors())

//MODELS
import Marketeer from "../models/Marketeer"
import Order from "../models/Order"

//Login
marketeerRoute.post("/login", async (req:Request, res:Response)=> {

  let email = req.body.email 
  let password = req.body.password
  

  let response:response = {
    status : false,
    message : "Unable to login, please check the login credentials!"
  }

  try {

    let loginCheck:any = 
    await Marketeer
    .find({email: req.body.email, password: req.body.password})
    .catch(()=>{throw new Error})
  
    !loginCheck[0].email ? response.message = 'This account does not exist.' : null;

    console.log(loginCheck);
    
  
      if (loginCheck[0].email  == email  && loginCheck[0].password == password) {
        
        let data:marketeer = {
      
          name: loginCheck[0].name,
          phone: loginCheck[0].phone,
          email: loginCheck[0].email,
        }
        
        let token = jwt.sign({...data, _id : loginCheck[0]._id, authority:'A2'}, process.env.JWT_PASS!, {
          expiresIn: '8h'
        })
    
        if (loginCheck.active == false) {
          response.message = "The account is not active at the moment, please contact your adminstrator"
        }else {
          response.status = true
          response.message = 'Login Successful'
          response.data = {
            name: loginCheck[0].name,
            phone: loginCheck[0].phone,
            email: loginCheck[0].email,  
            token : token
          }
        }
      }
  } catch (error) {
    response.message = "Error to login"
  }

  res.json(response)
})



//MIDDLEWARES

marketeerRoute.use(validate_token)
marketeerRoute.use((req:Request, res: Response, next: NextFunction )=>{
  let response:response = {
      status : false,
      message : "Insufficent Permissions"
    }

  if (req.body.auth_payload.authority == "A1" || req.body.auth_payload.authority == "A3") { 
      res.json(response)
  }
})





//update order status
marketeerRoute.post("/order_status", async (req:Request, res:Response)=> {
  let response:response = {
    status : false,
    message : "Unable to update the order status, please try later"
  }
  
  let order_id = req.body._id;
  let status = req.body.status

  try {
    if (req.body.auth_payload.authority != "A2") { throw new Error }

    if (typeof status != 'number') {
      throw `The status must be a number, but instead recieved status of type ${typeof status}`
    }
    await Order.findByIdAndUpdate(order_id, {$set : {
      status : status
    }})
    .then(()=>{
      response.status = true
      response.message = 'Order status updated successfully!'
    })
    .catch(()=>{throw 'somthing failed while updating the status, please try again!'})
  } catch (error) {
    
    if (typeof error == 'string') {

      response.status = false
      response.message = error
    }
  }

  res.json(response)

})


marketeerRoute.post("/my_jobs", async (req:Request, res:Response)=> {

  let response:response = {
    status : false,
    message : "Unable to fetch your jobs, please try later!"
  }
  let _id = req.body._id

  try {
    if (req.body.auth_payload.authority != "A3") { throw new Error }
    if (req.body.auth_payload._id != _id) { throw new Error }

    await Order.find({order_processed_by: _id})
    .then((data)=>{
      response.status = true
      response.message = "Bingo!"
      response.data = data
    })
    .catch(()=>{throw new Error})
  } catch (error) {
    response.status = false
    response.message = "Something went worng, please try again"
  }

  res.json(response)

})



export default marketeerRoute

