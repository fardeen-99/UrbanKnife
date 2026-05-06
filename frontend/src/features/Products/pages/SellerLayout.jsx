import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Footer from "./Footer";
import SellerHeader from "./SellerHeader";

const SellerLayout=()=>{
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div>
            <SellerHeader />
            <Outlet />  
            <Footer />
        </div>
    )
}
export default SellerLayout