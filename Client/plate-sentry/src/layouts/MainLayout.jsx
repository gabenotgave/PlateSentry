import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";

const MainLayout = () => {
    return (
        <>
            <Nav />
            <div className="container mt-4 content">
                <Outlet />
            </div>
        </>
    )
}

export default MainLayout;