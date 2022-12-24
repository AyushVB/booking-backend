import mongoose from "mongoose"

// connect database function

const connectDb=(DB_URL)=>{
    try {   
        const DB_OPTIONS={
            useNewUrlParser:true
        }
        mongoose.set('strictQuery',false)
        mongoose.connect(DB_URL,DB_OPTIONS)
        console.log("connected successfully on mongoDB Atlas ....")       
    } catch (error) {
        console.log(error)
    }
}

// export 
export default connectDb