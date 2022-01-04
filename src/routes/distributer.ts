import express, {Request, Response, Application} from "express"
import {response, product, distributer} from "../types";
import jwt from "jsonwebtoken"

const distributerRoute: Application = express()

//MIDDLEWARES
distributerRoute.use(express.json())

//MODELS
import Distributer from "../models/Distributer"

//Login
distributerRoute.post("/login", async (req:Request, res:Response)=> {

  let response:response = {
    status : false,
    message : "Unable to login, please check the login credentials!"
  }

  let loginCheck:any = await Distributer.find({email: req.body.email, password: req.body.password})

  !loginCheck ? response.message = 'This Account Does Not Exist.' : null

    if (loginCheck[0].email == req.body.email && loginCheck[0].password == req.body.password) {
      
      let data:distributer = {
        name: loginCheck[0].name,
        phone: loginCheck[0].phone,
        email: loginCheck[0].email,  
        basePrice: loginCheck[0].basePrice
      }
      
      let token = jwt.sign({...data, authority:'A3'}, process.env.JWT_PASS!, {
        expiresIn: '8h'
      })
  
      if (loginCheck.active == false) {
        response.message = "The account is not active at the moment, please contact your adminstrator"
      }else {
        response.status = true
        response.message = 'Login Successful'
        response.data = {
          token : token
        }
      }
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
      response.message = "Data Updated Successfully!";
    })
    .catch(function(){
      throw new Error;
    })
  } catch (error) {
    response.message = "Error Occured while updating, try again"
  }



  res.json(response)

})


export default distributerRoute

