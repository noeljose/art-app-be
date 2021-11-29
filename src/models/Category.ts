import mongo from "mongoose"

const CategorySchema = new mongo.Schema({

    category : {
        type : String,
        required: true
    },

    subCategory : [{
        type : String,
        required: true
    }]
})

const Category =  mongo.model("Category", CategorySchema )

export default Category