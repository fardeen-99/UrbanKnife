import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import CartDrawer from "../../Cart/components/CartDrawer";

const AppLayout = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <CartDrawer />
            <main className="flex-1 flex flex-col w-full">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default AppLayout;