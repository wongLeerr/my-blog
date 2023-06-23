import React from "react";
import NavBar from 'components/Navbar'
import Footer from "components/Footer"

interface LayoutProps {
    children: React.ReactNode;
 }

const Layout = ({ children }:LayoutProps) => {
    return (
        <div>
            <NavBar></NavBar>
            <main>{children}</main>
            <Footer></Footer>
        </div>
            
    )
}

export default Layout