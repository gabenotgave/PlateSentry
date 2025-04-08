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
                {/* <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script> */}
                <Footer />
            </div>
        </>
    )
}

export default MainLayout;