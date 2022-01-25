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
        required: false
    },

    shipping_address : {
        type : String,
        required: false
    },

    status : {
        type : Number,
        required: true
    },

    category : {
        type : String,
        required:false
    },

    subCategory : {
        type : String,
        required: false
    }
})

const Order =  mongo.model("Order", OrderSchema )

export default Order