import express, {Request, Response, Application} from "express"
import {response, product, marketeer} from "../types";
import {empty} from "../lib/common"
import multer, {} from "multer"
import { v4 as uuid } from "uuid"

const admin: Application = express()

//MIDDLEWARES

admin.use(express.json())

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



//CREATE SALESMAN
admin.post("/marketeer/create", async (req:Request, res:Response)=>{
  let response:response = {
    status : false,
    message : "Somthing Went Wrong!"
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
    message : "Somthing Went Wrong"
  }

  let _id = req.body._id;
  let data:marketeer = {
    name : req.body.name,
    phone : req.body.phone,
    email : req.body.email
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
    message : "Somthing Went Wrong"
  }

  let limit = req.body.limit || 1;
  let skip = req.body.skip || 0;

  try {

    let partData = await Marketeer.find().limit(limit).skip(skip).catch((error:any) => {throw new Error})
    let count = await Marketeer.find().countDocuments()

    response.status = true
    response.message = "Data Fetched Successfully"
    response.data = {
      marketeers : partData,
      count : count
    }

  } catch (error) {
    response.status = false
    response.message = "Data Fetch failed!"
  }

  res.json(response)
})

//READ SALESMAN SINGLE
admin.post("/marketeer/read/:id", async (req:Request, res:Response)=>{
  let response:response = {
    status : false,
    message : "Somthing Went Wrong"
  }

  let _id = req.body._id

  try {
    await Marketeer.findById(_id)
    .then((data)=>{
      response.status = true
      response.message = "Sales Person Fetched Successfully"
      response.data = data
    })
    .catch((error:any) => {throw new Error})
  } catch (error) {
    response.status = false
    response.message = "Sales Person Fetch failed!"
  }

  res.json(response)
})

//DELETE SALESMAN
admin.post("/marketeer/delete", async (req:Request, res:Response)=>{
  let response:response = {
    status : false,
    message : "Somthing Went Wrong"
  }

  let _id = req.body._id

  try {
    await Marketeer.findByIdAndDelete(_id)
    .then((data)=>{
      response.status = true
      response.message = "Sales Person Deleted Successfully"
    })
    .catch((error:any) => {throw new Error})
  } catch (error) {
    response.status = false
    response.message = "Sales Person Deleted failed!"
  }

  res.json(response)
})


export default admin
