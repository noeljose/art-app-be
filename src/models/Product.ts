import mongo from "mongoose"

const ProductSchema = new mongo.Schema({

    title : {
        type : String,
        required: true
    },
    
    image : {
        type : String,
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

const Product =  mongo.model("Product", ProductSchema )

export default Product