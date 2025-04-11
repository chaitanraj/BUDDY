import React from "react";
import logo from "../pics/logo.png";
import styles from "./Navbar.module.css"; 
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    return (
        <div className={styles.navbar}>
            <div className={styles.logoItem}>
                <img className={styles.img} src={logo} alt="Let's find you a buddy" />
                <div className={styles.logoItem}>CyberOps</div>            
            </div>
            <div className={styles.tagLine}>
           Keep your data SAFE!</div>
            <div className={styles.aTag}>
                <NavLink to="/" className={styles.navlink}>Home</NavLink>
                <NavLink to="/about" className={styles.navlink}>About</NavLink>
                <NavLink to="/contact" className={styles.navlink}>Contact</NavLink>
            </div>
        </div>
    );
};

export default Navbar;
