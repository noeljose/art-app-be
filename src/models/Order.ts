import mongo from "mongoose"


const OrderDetails = new mongo.Schema({
    width : Number,
    height : Number,
    arcTop : Boolean,
    arcBottom : Boolean,
    varnish : Boolean,
    whiteCoat : Boolean,
    sandwich : Number,
    message : String
})

const OrderSchema = new mongo.Schema({

    product_id : {
        type : String,
        required: true
    },

    order_details : OrderDetails,
    
    order_placed_by : {
        type : String,
        required: true
    },
    
    order_processed_by : {
        type : String,
        required: true
    },

    shipping_address : {
        type : String,
        required: true
    },

    status : {
        type : Number,
        required: true
    },

    category : {
        type : String,
        required: true
    },

    subCategory : {
        type : String,
        required: true
    }
})

const Order =  mongo.model("Order", OrderSchema )

export default Order