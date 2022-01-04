import mongo from "mongoose"

const OrderSchema = new mongo.Schema({

    product_id : {
        type : String,
        required: true
    },
    
    order_placed_by : {
        type : String,
        required: true
    },
    
    order_processed_by : {
        type : String,
        required: true
    },

    status : {
        type : Number,
        required: true
    },

    subCategory : {
        type : String,
        required: true
    }
})

const Order =  mongo.model("Order", OrderSchema )

export default Order