import express, {Request, Response, Application} from "express"
import {response, product, marketeer, distributer} from "../types";
import {empty} from "../lib/common"
import multer, {} from "multer"
import { v4 as uuid } from "uuid"
import cors from "cors"
import {validate_token} from "../functions"

const admin: Application = express()

//MIDDLEWARES
admin.use(cors())
// admin.use(validate_token)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './images/')
    },
    filename: (req, file, cb) => {
      const {
        originalname
      } = file
  
      let finalName = () => {
        // let ext = originalname.split(".")
        return `${uuid()}.jpg`
      }
  
      let file_name = finalName()
      req.body.customFileUploadName = file_name
  
      cb(null, file_name)
    },
})


const upload = multer({ storage: storage })

//MODELS
import Marketeer from "../models/Marketeer";
import Distributer from "../models/Distributer"
import Order from "../models/Order"


//CREATE SALESMAN
admin.post("/marketeer/create", async (req:Request, res:Response)=>{
  let response:response = {
    status : false,
    message : "Somthing went wrong!"
  }

  let data:marketeer = {
    name : req.body.name,
    phone : req.body.phone,
    email : req.body.email,
    password : req.body.password
  }

  try {
    await Marketeer.create(data).catch((error:any) => {throw new Error})
    response.status = true
    response.message = "Sales person creation successful"
  } catch (error:any) {
    response.status = false
    response.message = "Sales person creation failed!"
  }

  res.json(response)

})

//UPDATE SALESMAN
admin.post("/marketeer/update", async (req:Request, res:Response)=>{
  let response:response = {
    status : false,
    message : "Somthing went wrong"
  }

  let _id = req.body._id;
  let data:marketeer = {
    name : req.body.name,
    phone : req.body.phone,
    email : req.body.email,
    active : req.body.active
  }

  try {
    await Marketeer.findByIdAndUpdate(_id, data).catch((error:any) => {throw new Error})
    response.status = true
    response.message = "Sales person data updation successful"
  } catch (error:any) {
    response.status = false
    response.message = "Sales person data updation failed!"
  }

  res.json(response)

})

//READ SALESMAN
admin.post("/marketeer/read", async (req:Request, res:Response)=>{
  let response:response = {
    status : false,
    message : "Somthing went wrong"
  }

  let limit = req.body.limit || 1;
  let skip = req.body.skip || 0;

  try {

    let partData = await Marketeer.find().limit(limit).skip(skip).catch((error:any) => {throw new Error})
    let count = await Marketeer.find().countDocuments()

    response.status = true
    response.message = "Data fetched successfully"
    response.data = {
      marketeers : partData,
      count : count
    }

  } catch (error) {
    response.status = false
    response.message = "Data fetch failed!"
  }

  res.json(response)
})

//ASSIGN SALESMAN
admin.post("/marketeer/assign", async (req:Request, res:Response)=>{
  let response:response = {
    status : false,
    message : "Somthing went wrong"
  }

  let marketeer_id = req.body.marketeer_id
  let order_id = req.body.order_id

  try {
    await Order.findByIdAndUpdate(
      order_id, 
      {
        $set: {order_processed_by: marketeer_id, status: 1 }
      })

    .then(()=>{
      response.status = true
      response.message = "Sales person assigned successfully"

    })
    .catch((error:any) => {throw new Error})
  } catch (error) {
    response.status = false
    response.message = "Sales person assign failed!"
  }

  res.json(response)
})
//READ SALESMAN SINGLE
admin.post("/marketeer/read/:id", async (req:Request, res:Response)=>{
  let response:response = {
    status : false,
    message : "Somthing went wrong"
  }

  let _id = req.params.id

  try {
    await Marketeer.findById(_id)
    .then((data)=>{
      response.status = true
      response.message = "Sales person fetched successfully"
      response.data = data
    })
    .catch((error:any) => {throw new Error})
  } catch (error) {
    response.status = false
    response.message = "Sales person fetch failed!"
  }

  res.json(response)
})

//DELETE SALESMAN
admin.post("/marketeer/delete", async (req:Request, res:Response)=>{
  let response:response = {
    status : false,
    message : "Somthing went wrong"
  }

  let _id = req.body._id

  try {
    await Marketeer.findByIdAndDelete(_id)
    .then((data)=>{
      response.status = true
      response.message = "Sales person deleted successfully"
    })
    .catch((error:any) => {throw new Error})
  } catch (error) {
    response.status = false
    response.message = "Sales person deleted failed!"
  }

  res.json(response)
})

//CREATE DISTRIBUTER
admin.post("/distributer/create", async (req:Request, res:Response)=>{
  let response:response = {
    status : false,
    message : "Somthing went wrong!"
  }

  let data:distributer = {
    name : req.body.name,
    phone : req.body.phone,
    email : req.body.email,
    password : req.body.password,
    basePrice : req.body.basePrice,
    deliveryPrice : req.body.deliveryPrice,
    address: "No address Provided yet"
    
  }

  req.body.address?data.address = req.body.address: null;



  try {
    await Distributer.create(data).catch((error:any) => {console.log(error);
    throw new Error})
    response.status = true
    response.message = "Distributer creation successful"
  } catch (error:any) {
    response.status = false
    response.message = "Distributer creation failed!"
  }

  res.json(response)

})

//UPDATE DISTRIBUTER
admin.post("/distributer/update", async (req:Request, res:Response)=>{
  let response:response = {
    status : false,
    message : "Somthing went wrong"
  }

  let _id = req.body._id;
  let data:distributer = {
    name : req.body.name,
    phone : req.body.phone,
    email : req.body.email,
    active : req.body.active,
    basePrice : req.body.basePrice,
    deliveryPrice : req.body.deliveryPrice,
    address : req.body.address
  }

  try {
    await Distributer.findByIdAndUpdate(_id, data).catch((error:any) => {throw new Error})
    response.status = true
    response.message = "Distributer data updation successful"
  } catch (error:any) {
    response.status = false
    response.message = "Distributer data updation failed!"
  }

  res.json(response)

})

//READ DISTRIBUTER
admin.post("/distributer/read", async (req:Request, res:Response)=>{
  let response:response = {
    status : false,
    message : "Somthing went wrong"
  }

  let limit = req.body.limit || 1;
  let skip = req.body.skip || 0;

  try {

    let partData = await Distributer.find().limit(limit).skip(skip).catch((error:any) => {throw new Error})
    let count = await Distributer.find().countDocuments()

    response.status = true
    response.message = "Data fetched successfully"
    response.data = {
      distributer : partData,
      count : count
    }

  } catch (error) {
    response.status = false
    response.message = "Data fetch failed!"
  }

  res.json(response)
})

//READ DISTRIBUTER SINGLE
admin.post("/distributer/read/:id", async (req:Request, res:Response)=>{
  let response:response = {
    status : false,
    message : "Somthing went wrong"
  }

  let _id = req.params.id

  try {
    await Distributer.findById(_id)
    .then((data)=>{
      response.status = true
      response.message = "Distributer fetched successfully"
      response.data = data
    })
    .catch((error:any) => {throw new Error})
  } catch (error) {
    response.status = false
    response.message = "Distributer fetch failed!"
  }

  res.json(response)
})

//DELETE DISTRIBUTER
admin.post("/distributer/delete", async (req:Request, res:Response)=>{
  let response:response = {
    status : false,
    message : "Somthing went wrong"
  }

  let _id = req.body._id

  try {
    await Distributer.findByIdAndDelete(_id)
    .then((data)=>{
      response.status = true
      response.message = "Distributer deleted successfully"
    })
    .catch((error:any) => {throw new Error})
  } catch (error) {
    response.status = false
    response.message = "Distributer deleted failed!"
  }

  res.json(response)
})


export default admin
