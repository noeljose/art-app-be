import mongo from "mongoose"

const MarketeerSchema = new mongo.Schema({

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

    active : {
        type : Boolean,
        default : false
    },

})

const Marketeer =  mongo.model("Marketeer", MarketeerSchema )

export default Marketeer