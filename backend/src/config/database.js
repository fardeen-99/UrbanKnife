import mongoose from 'mongoose'
import configure from './config.js'

async function ConnectToDB(){
    try {
        await mongoose.connect(configure.mongo_uri)
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
    }
}

export default ConnectToDB