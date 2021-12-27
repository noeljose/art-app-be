import express, {Request, Response, Application} from "express"
import {response, product, distributer} from "../types";
import jwt from "jsonwebtoken"

const distributer: Application = express()

//MIDDLEWARES
distributer.use(express.json())

//MODELS
import Distributer from "../models/Distributer"

//Login
distributer.post("/login", async (req:Request, res:Response)=> {

  let response:response = {
    status : false,
    message : "Unable to login, please check the login credentials!"
  }

  let loginCheck:any = await Distributer.find({email: req.body.email, password: req.body.password})
 
  !loginCheck ? response.message = 'This Account Does Not Exist.' : null
  
  if (loginCheck.email == req.body.email && loginCheck.password == req.body.password) {
    let data:distributer = {
      name: loginCheck.name,
      phone: loginCheck.phone,
      email: loginCheck.email,  
      basePrice: loginCheck.basePrice
    }
    let token = jwt.sign(JSON.stringify({...data, authority:'A3'}), process.env.JWTPASS!, {
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

export default distributer

