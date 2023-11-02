import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Outlet } from "react-router-dom";

// Simple header
function Header() {
    return(
        <>
            <h1>TrackXpress</h1>
            <Outlet/>
        </>
    )
};

export default Header;