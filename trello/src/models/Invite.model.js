const mongoose = require('mongoose')

const inviteSchema = new mongoose.Schema(
    {
        boardId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Board',
            required : true
        },
        email : {
            type : String ,
            required : true
        },
        token : {
            type : String,
            required : true,
            unique : true
        },
        expiresAt : {
            type : Date,
            required : true
        },
        accepted : {
            type : Boolean,
            default : false
        }
    },{
        timestamps : true
    }
)

const Invite = mongoose.model(
    "Invite",
    inviteSchema
) 

module.exports = Invite