import logo from "../assets/logo10.png";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Nav = () => {
    const [open, setOpen] = useState(true);

    return (
        <nav className="navbar navbar-expand-lg bg-primary mb-5" data-bs-theme="dark">
            <div className="container-fluid justify-content-center">
                <a className="navbar-brand" href="">
                    <img width="400" src={logo} />
                </a>
            </div>
        </nav>
    )
}

export default Nav;