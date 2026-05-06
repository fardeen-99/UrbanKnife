import app from "./src/app.js";
import connectDB from "./src/config/database.js";
// import {seedProducts} from "./src/utils/Seed.js";

connectDB();
// seedProducts()
app.listen(3000,()=>{
    console.log(`Server is running on port 3000`);
})