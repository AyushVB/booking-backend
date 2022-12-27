import bookingModel from '../models/bookingLog.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

class bookingController{
    static reservingSeat=async (req,res)=>{
        const {seatNo}=req.body
        const vallid=await bookingModel.findOne({seatNo:seatNo})
        if(vallid){
            res.status(409).send({"status":"failed","message":"Seat is already booked or reserved..."})
        }
        else{
            if(seatNo && seatNo<=0 && seatNo>500){
                res.status(401).send({"status":"failed","message":"seat no is not vallid...."})
            }
            else{
                const newBookedSeat=new bookingModel({
                    id:req.user._id,
                    seatNo:seatNo,
                    confirmSeatProcess:false
                })
                await newBookedSeat.save()
                const saved_user=await bookingModel.findOne({seatNo:seatNo})
                const secret=saved_user._id+process.env.JWT_SECRET_KEY
                const token=jwt.sign({userID:saved_user._id,seatNo:seatNo},secret,{expiresIn:'15m'})
                res.status(201).send({"status":"success","message":"seat reserve successfully...","token":token})
            }
        }
        
    }
    static confirmationOfBooking=async (req,res)=>{
        const{verify}=req.body
        const{id,token}=req.params
        const seat=await bookingModel.findById(id)
        if(!seat){
            res.send({"status":"failed","message":"Seat is not reserve...."})
        }
        else{
            const secret=id+process.env.JWT_SECRET_KEY
            try {
                jwt.verify(token,secret)
                if(!verify){
                    await bookingModel.findByIdAndDelete(id)
                    res.send({"status":"failed","message":"Seat is not confirme"})  
                }
                else{
                    await bookingModel.findByIdAndUpdate(seat._id,{$set:{confirmSeatProcess:true}})
                    res.send({"status":"success","message":"Seat is confirme"})  
                }
                
            } catch (error) {
                await bookingModel.findByIdAndDelete(id)
                console.log(error)
                res.send({"status":"failed","message":"Invalid token"}) 
            }
        }
        
        
    }
}

// export
export default bookingController