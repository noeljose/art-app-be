export type response =  {
    status: boolean,
    message: string,
    data?: object | array,
    backError? : any
}

export type product = {
    title : string,
    image : string,   
    category : string,
    subCategory :  string
        
}

export type marketeer = {
    name? : string,
    phone? : string,
    email? : string,
    password? : string,
    active? : boolean
}