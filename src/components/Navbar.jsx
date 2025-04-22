import React from "react";
import logo from "../pics/logo.png";
import user from "../pics/user.png";
import dropdown from "../pics/dropdown.png"
import styles from "./Navbar.module.css";
import { NavLink } from 'react-router-dom';
import { useState,useRef, useEffect } from "react";
import "./profile.css"

const Navbar = () => {
    const [loggedIn, setLoggedIn] = useState(true);
    const username = "CyberOpsUser";
    const [showMenu, setShowMenu] = useState(false);
       
  
    const dropdownRef = useRef(null);
    
   
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        
        if (showMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showMenu]);


    const toggleMenu = () => {
        console.log("Toggle menu clicked, current state:", showMenu);
        setShowMenu(prev => !prev);
      };

    const handleLogin = () => setLoggedIn(true);
    const handleLogout = () => {
        console.log("Logging out");
        setLoggedIn(false);
        setShowMenu(false);
    };
    return (
        <div className={styles.navbar}>
            <div className={styles.logoItem}>
                <img className={styles.img} src={logo} alt="Let's find you a buddy" />
                <div className={styles.logoItem}>CyberOps</div>
            </div>
            <div className={styles.tagLine}>
                {loggedIn ? (
                    <div className="profile-container" ref={dropdownRef} onClick={toggleMenu}>
                        <div className="profile-name">
                            <img className="usericon" src={user} />
                            {username}
                            <img className="usericon" src={dropdown} />
                        </div>
                        {showMenu && (
                            <div className="dropdown-menu">
                                <div className="menu-item" onClick={(e) => { e.stopPropagation(); handleLogout(); }}>Logout</div>
                                <div className="menu-item" onClick={(e) => { e.stopPropagation(); alert('History clicked'); }}>History</div>
                            </div>
                        )}
                    </div>
                ) : (
                    "Keep your data SAFE!"
                )}
            </div>
            <div className={styles.aTag}>
                <NavLink to="/" className={styles.navlink}>Home</NavLink>
                <NavLink to="/about" className={styles.navlink}>About</NavLink>
                <NavLink to="/contact" className={styles.navlink}>Contact</NavLink>
            </div>
        </div>
    );
};

export default Navbar;
