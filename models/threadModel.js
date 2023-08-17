const mongoose = require("mongoose")


const threadSchema = mongoose.Schema({
    participants:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]
},{
    timestamps:true
})

const Thread = mongoose.model('Thread',threadSchema)
module.exports = Thread