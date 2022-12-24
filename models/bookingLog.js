import { ObjectID } from "bson"
import mongoose from "mongoose"

// Defination of schema
const bookingSchema=new mongoose.Schema({
    id:{type:ObjectID,required:true},
    seatNo:{type:Number,required:true},
    confirmSeatProcess:{type:Boolean,required:true}
})

// Model
const bookingModel=mongoose.model("booked",bookingSchema)

// export 
export default bookingModel