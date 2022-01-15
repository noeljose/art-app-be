import {Request, Response, NextFunction} from "express"
import jwt from "jsonwebtoken"
import {response} from "./types"


//Token Validator
export async function validate_token(req:Request, res:Response, next:NextFunction){
    // console.log(__filename);
    
    // let response: response = {
    //     status : false,
    //     message : "API ACCESS DENIED"
    // }

    // try {      
    //     let bare_token:any = (req.headers.authorization)!.split(" ")
    //     let token = bare_token[bare_token.length-1]
    //     if (typeof token == 'string') {
            
    //          jwt.verify(token, process.env.JWT_PASS!, (error:any, decoded:any)=>{
    //             if (error) {throw error}  
    //             req.body.auth_payload = decoded
    //         })
    //     }
    // } catch (error) {           
    //     return res.json(response)
    // }

    next()
}


