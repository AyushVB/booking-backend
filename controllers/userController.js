import userModel from '../models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import transporter from "../config/emailConfig.js"

dotenv.config()

class userController{
    static userRegistration=async (req,res)=>{
        const {name,email,password,password_confirmation,tc}=req.body
        const user=await userModel.findOne({email:email})
        if(user){
            res.status(409).send({"status":"failed","message":"Email Id Already Exists..."})
        }
        else{
            if(!(name && email && password && password_confirmation && tc)){
                res.status(400).send({"status":"failed","message":"All filed are required...."})
            }
            else{
                if(password!==password_confirmation){
                    res.status(401).send({"status":"failed","message":"password and confirm_password doesn't match...."})
                }
                else{
                    try {
                        const salt=await bcrypt.genSalt(12)
                        const hashPassword=await bcrypt.hash(password,salt)

                        const newUser=new userModel({
                            name:name,
                            email:email,
                            password:hashPassword,
                            tc:tc
                        })
                        await newUser.save()

                        // JWT create
                        const saved_user=await userModel.findOne({email:email})
                        const token=jwt.sign({userID:saved_user._id},process.env.JWT_SECRET_KEY,{expiresIn:'5d'})
                        res.status(201).send({"status":"success","message":"Registration successfully...","token":token})
                    } 
                    catch (error) {
                        res.status(400).send({"status":"failed","message":"Unable to register...."})
                    }

                }
            }
        }
    }
    static userLogin=async (req,res)=>{
        const {email,password}=req.body
        if(!(email && password)){
            res.status(400).send({"status":"failed","message":"All filed are required...."})
        }
        else{
            try {
                const user=await userModel.findOne({email:email})
                if(!user){
                    res.status(400).send({"status":"failed","message":"You are not registered user..."})
                }
                else{
                    const ismatch=await bcrypt.compare(password,user.password)
                    if(!(ismatch && (user.email===email))){
                        res.status(400).send({"status":"failed","message":"Email or Password is invalid..."})
                    }
                    else{
                        // JWT create
                        const token=await jwt.sign({userID:user._id},process.env.JWT_SECRET_KEY,{expiresIn:'5d'})

                        res.send({"status":"success","message":"login successfully...","token":token})
                    }
                }
            }
            catch (error) {
                res.status(400).send({"status":"failed","message":"Unable to login...."})
            }
        }
    }
    static changeUserPassword=async (req,res)=>{
        const {password,password_confirmation}=req.body
        if(!(password && password_confirmation)){
            res.status(400).send({"status":"failed","message":"All filed are required...."})
        }
        else{
            if(password !== password_confirmation){
                res.status(401).send({"status":"failed","message":"password and confirm_password doesn't match...."})
            }
            else{
                const salt=await bcrypt.genSalt(12)
                const hashPassword=await bcrypt.hash(password,salt)
                await userModel.findByIdAndUpdate(req.user._id,{$set:{password:hashPassword}})
                res.send({"status":"success","message":"password change successfully...."})
            }
        }
    }
    static loggedUser=async (req,res)=>{
        res.send({"user":req.user})
    }
    static sendUserPasswordResetEmail=async (req,res)=>{
        const{email}=req.body
        if(!email){
            res.send({"status":"failed","message":"email field is required..."})
        }
        else{
            const user=await userModel.findOne({email:email})
            if(!user){
                res.send({"status":"failed","message":"email doesnt exists"})        
            }
            else{
                const secret=user._id+process.env.JWT_SECRET_KEY
                const token=jwt.sign({userID:user._id},secret,{expiresIn:'15m'})
                const link=`http://localhost:3000/api/user/reset/${user._id}/${token}`
                console.log(`frontend link where we reset password : ${link}`)

                // sent email 
                const info=transporter.sendMail({
                    from:process.env.EMAIL_FROM,
                    to:user.email,
                    subject:"API-Password Reset Link",
                    html:`<a href=${link}>click here</a>to reset your password`
                })
                res.send({"status":"success","message":"password reset email is sent....please check email.. ","info":info})
            }
        }
    }
    static userPasswordReset=async (req,res)=>{
        const{password,password_confirmation}=req.body
        const{id,token}=req.params
        const user=await userModel.findById(id)
        const secret=user._id+process.env.JWT_SECRET_KEY
        try {
            jwt.verify(token,secret)
            if(!(password && password_confirmation)){
                res.send({"status":"failed","message":"All fields are required"})    
            }
            else{ 
                if(password!==password_confirmation){
                    res.send({"status":"failed","message":"New password and confirm new password doesn't match"})        
                }
                else{
                    const salt=await bcrypt.genSalt(10)
                    const hashPassword=await bcrypt.hash(password,salt)
                    await userModel.findByIdAndUpdate(user._id,{$set:{password:hashPassword}})
                    res.send({"status":"success","message":"password reset successfully..."})
                }
            }
            
        } catch (error) {
            console.log(error)
            res.send({"status":"failed","message":"Invalid token"}) 
        }
    }
}

// export
export default userController