import express, {Request, Response, Application, NextFunction} from "express"
import {response, product, distributer} from "../types";
import jwt from "jsonwebtoken"
import cors from "cors"
import {validate_token} from "../functions"

const distributerRoute: Application = express()


//MIDDLEWARES
distributerRoute.use(cors())

//MODELS
import Distributer from "../models/Distributer"
import Order from "../models/Order";

//Login
distributerRoute.post("/login", async (req:Request, res:Response)=> {

  let email = req.body.email 
  let password = req.body.password
  let response:response = {
    status : false,
    message : "Unable to login, please check the login credentials!"
  }

  try {
    let loginCheck:any = 
    await Distributer
    .find({email: req.body.email, password: req.body.password})
    .catch(()=>{throw new Error})
  
    !loginCheck[0].email ? response.message = 'This account, does not exist.' : null;
    
      if (loginCheck[0].email  == email  && loginCheck[0].password == password) {
        
        let data:distributer = {
          name: loginCheck[0].name,
          phone: loginCheck[0].phone,
          email: loginCheck[0].email,  
          basePrice: loginCheck[0].basePrice
        }
        
        let token = 
        jwt.sign({...data, _id : loginCheck[0]._id, authority:'A3'}, process.env.JWT_PASS!,{ expiresIn: '8h'})
    
        if (loginCheck.active == false) 
        {response.message = "The account is not active at the moment, please contact your adminstrator"}

        else 
        {        
          response.status = true
          response.message = 'Login successful'
          response.data = {
            _id: loginCheck[0]._id,
            name: loginCheck[0].name,
            phone: loginCheck[0].phone,
            email: loginCheck[0].email,  
            address: loginCheck[0].address, 
            token : token
          }
        }

      }
  } 
  catch (error) {response.message = "Error to login"}


  res.json(response)
})





distributerRoute.post("/update" , async (req:Request, res:Response)=>{

  

  let response:response = {
    status : false,
    message : "Unable to update, please try later!"
  }

  let _id = req.body._id



  let data:distributer = {
    name: req.body.details.name,
    phone: req.body.details.phone,
    email: req.body.details.email,
    address : req.body.details.address
  }

  try {

    
    await Distributer.findByIdAndUpdate(_id, data)
    .then(function(res){ 
      response.status = true;
      response.message = "Data Updated successfully!";
      response.data = {
        name: res.name,
        email:res.email,
        phone: res.phone,
        address: res.address
      }
    })
    .catch(function(){
      throw new Error;
    })
  } catch (error) {
    response.message = "Error occured while updating, try again"
  }



  res.json(response)

})

distributerRoute.post("/update_password" , async (req:Request, res:Response)=>{

  

  let response:response = {
    status : false,
    message : "Unable to update the password, please try later!"
  }

  let _id = req.body._id
  let password = {
    new_password: req.body.new_password,
    old_password: req.body.old_password
  }

  try {

    await Distributer.findOneAndUpdate({_id, password: password.old_password},{
      $set:{
        password: password.new_password
      }
    })
    .then(function(res){ 
      response.status = true;
      response.message = "Password Updated successfully!";
    })
    .catch(function(){
      throw new Error;
    })
  } catch (error) {
    response.message = "Error occured while updating password, try again"
  }

  res.json(response)
})


distributerRoute.post("/read", async (req:Request, res:Response)=> {

  let response:response = {
    status : false,
    message : "Unable to fetch your account, please try later!"
  }
  let _id = req.body._id

  console.log(_id);
  

  try {

    await Distributer.findById(_id)
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

distributerRoute.post("/my_orders", async (req:Request, res:Response)=> {

  let response:response = {
    status : false,
    message : "Unable to fetch your orders, please try later!"
  }
  let _id = req.body._id

  try {


    await Order.find({order_placed_by: _id})
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


export default distributerRoute

