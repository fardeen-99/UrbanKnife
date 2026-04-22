import {config} from "dotenv";

config();

if(!process.env.MONGO_URI){
    throw new Error("MONGO_URI is not defined");
}
if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET is not defined");
}
if(!process.env.GOOGLE_CLIENT_ID){
    throw new Error("GOOGLE_CLIENT_ID is not defined");
}
if(!process.env.GOOGLE_CLIENT_SECRET){
    throw new Error("GOOGLE_CLIENT_SECRET is not defined");
}
if(!process.env.BREVO_API_KEY){
    throw new Error("BREVO_API_KEY is not defined");
}
if(!process.env.USER_EMAIL){
    throw new Error("USER_EMAIL is not defined");
}
if(!process.env.REDIS_HOST){
    throw new Error("REDIS_HOST is not defined");
}
if(!process.env.REDIS_PORT){
    throw new Error("REDIS_PORT is not defined");
}
if(!process.env.REDIS_PASSWORD){
    throw new Error("REDIS_PASSWORD is not defined");
}


    const configure={
        // port:process.env.PORT,
        mongo_uri:process.env.MONGO_URI,
        jwt_secret:process.env.JWT_SECRET,
        node_env:process.env.NODE,
        google_client_id:process.env.GOOGLE_CLIENT_ID,
        google_client_secret:process.env.GOOGLE_CLIENT_SECRET,
        brevo_api_key:process.env.BREVO_API_KEY,
        user_email:process.env.USER_EMAIL,
        redis_host:process.env.REDIS_HOST,
        redis_port:process.env.REDIS_PORT,
        redis_password:process.env.REDIS_PASSWORD,
       
    }

export default configure