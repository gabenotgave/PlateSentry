import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

const MainLayout = () => {
    return (
        <>
            <Nav />
            <div className="container mt-4 content">
                <div className="card mb-4">
                    <div className="card-body mb-3 mt-3">
                        {/* <div class="alert alert-secondary small" role="alert">
                            This is a school project and should only be used for educational and presentation purposes.
                        </div> */}
                        <Outlet />
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}

export default MainLayout;