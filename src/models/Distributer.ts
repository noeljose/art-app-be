import mongo from "mongoose"

const DistributerSchema = new mongo.Schema({

    name : {
        type : String,
        required: true
    },
    
    phone : {
        type : String,
        required: true
    },
    
    email : {
        type : String,
        required: true
    },

    password : {
        type : String,
        required: true
    },

    address : {
        type : String,
        required: true
    },

    basePrice: {
        type : Number,
        required: true
    },

    deliveryPrice: {
        type : Number,
        required: true
    },


    active : {
        type : Boolean,
        default : false
    },

})

const Distributer =  mongo.model("Distributer", DistributerSchema )

export default Distributer