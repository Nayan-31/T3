const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema(
    {
        title : {
            type : String,
            required : true,
            trim : true
        },
        description : {
            type : String,
            default : ""
        },
        boardId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Board',
            required : true
        },
        listId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'List',
            required : true
        },
        position : {
            type : Number,
            required : true,
            default : 0
        }
    },{
        timestamps : true
    }
)

const Card = mongoose.model("Card" , cardSchema)

module.exports = Card