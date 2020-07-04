import React, { Component } from 'react'; 
import {
    Navbar, 
    NavbarBrand
} from "reactstrap"; 

const icon = (
    <span class="logo">
        <img src="../../public/defaultIcon.png" />
    </span>
)
export class AppNavbar extends Component {
    render() {
        return (
            <div>
               <Navbar variant="light" expand="sm" className = "mb-5" style={{backgroundColor: "#05264c"}}>
                    <NavbarBrand href ="/" style={{color: "#F4F6F8",}}>NUS SU-CAP Simulator</NavbarBrand>
                </Navbar> 
            </div>
        )
    }
}

export default AppNavbar
