import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import CartDrawer from "../../Cart/components/CartDrawer";

const AppLayout = () => {
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