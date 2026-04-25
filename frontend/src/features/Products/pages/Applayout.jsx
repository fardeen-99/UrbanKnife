import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../auth/hooks/auth.hook";
import Footer from "./Footer";
import Header from "./Header";

const AppLayout = () => {
    const { HandleGetme } = useAuth();

    useEffect(() => {
        HandleGetme();
    }, []);
    return (
        <div>
            <Header />
            <Outlet />
            <Footer />
        </div>
    );
};

export default AppLayout;