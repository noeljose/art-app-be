import express, {Request, Response, Application} from "express"
import {response, product, distributer} from "../types";
import jwt from "jsonwebtoken"

const distributerRoute: Application = express()

//MIDDLEWARES


//MODELS
import Distributer from "../models/Distributer"

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

    console.log(loginCheck);
    
  
      if (loginCheck[0].email  == email  && loginCheck[0].password == password) {
        
        let data:distributer = {
      
          name: loginCheck[0].name,
          phone: loginCheck[0].phone,
          email: loginCheck[0].email,  
          basePrice: loginCheck[0].basePrice
        }
        
        let token = jwt.sign({...data, _id : loginCheck[0]._id, authority:'A3'}, process.env.JWT_PASS!, {
          expiresIn: '8h'
        })
    
        if (loginCheck.active == false) {
          response.message = "The account is not active at the moment, please contact your adminstrator"
        }else {
          response.status = true
          response.message = 'Login successful'
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
    console.log(error);
    
  }



  res.json(response)
})


distributerRoute.post("/update" , async (req:Request, res:Response)=>{
  let response:response = {
    status : false,
    message : "Unable to update, please try later!"
  }

  let _id = req.body._id


  let data:distributer = {
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    address : req.body.address
  }

  try {
    
    Distributer.findByIdAndUpdate(_id, data)
    .then(function(){ 
      response.status = true;
      response.message = "Data Updated successfully!";
    })
    .catch(function(){
      throw new Error;
    })
  } catch (error) {
    response.message = "Error occured while updating, try again"
  }



  res.json(response)

})



distributerRoute.post("/read", async (req:Request, res:Response)=> {

  let response:response = {
    status : false,
    message : "Unable to fetch your account, please try later!"
  }
  let _id = req.body._id

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


export default distributerRoute

