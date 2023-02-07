import jwt from 'jsonwebtoken'
import userModel from '../models/user.js'
import dotenv from 'dotenv'
dotenv.config()

const checkUserAuth=async (req,res,next)=>{
    const{authorization}=req.headers
    if(!(authorization && authorization.startsWith('Bearer'))){
        res.status(401).send({"status":"failed","message":"Unauthorized user...."})
    }
    else{
        try {
            const token=authorization.split(' ')[1]
            const{userID}= jwt.verify(token,process.env.JWT_SECRET_KEY)
            req.user=await userModel.findById(userID).select('-password')
            next()
        } catch (error) {
            res.status(403).send({"status":"failed","message":"Authentication refused..."})
        }
    }
}

// export
export default checkUserAuth