import {Redis} from 'ioredis'
import configure from './config.js'

const redis=new Redis({
    host:configure.redis_host,
    port:configure.redis_port,
    password:configure.redis_password,
 
})

redis.on("connect",()=>{
    console.log("Connected to Redis");
})

redis.on("error",(error)=>{
    console.log(error);
})

export default redis