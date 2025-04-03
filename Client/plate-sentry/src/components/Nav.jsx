import logo from "../assets/logo2.png";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Nav = () => {
    const [open, setOpen] = useState(true);

    return (
        <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
            <div className="container-fluid justify-content-center">
                <a className="navbar-brand" href="#">
                    <img width="150" src={logo} />
                </a>
            </div>
        </nav>
    )
}

export default Nav;