import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import SellerHeader from "./SellerHeader";

const SellerLayout=()=>{
    return (
        <div>
            <SellerHeader />
            <Outlet />  
            <Footer />
        </div>
    )
}
export default SellerLayout