
//My custom types


export type response =  {
    status: boolean,
    message: string,
    data?: object | array,
    backError? : any,
    metadata?: any
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

export type distributer = {  
    name?: string,
    phone?: string,
    email?: string,  
    password?: string,
    address? : string,
    basePrice?: number,
    deliveryPrice?: number,
    active?: boolean
}

export type orderType = {
    product_id? : string,
    order_details? : {
        width? : number,
        height? : number,
        arcTop? : boolean,
        arcBottom? : boolean,
        varnish? : boolean,
        whiteCoat? : boolean,
        sandwich? : number,
        message? : string
    },
    order_placed_by? : string,
    order_processed_by? :string,
    shipping_address? :  string,
    status? : number,
    category?: string,
    subCategory? :  string
}