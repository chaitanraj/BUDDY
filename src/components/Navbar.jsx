import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../pics/logo.png";
import user from "../pics/user.png";
import dropdown from "../pics/dropdown.png";
import styles from "./Navbar.module.css";
import "./profile.css";

const Navbar = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState(null);
    const loggedIn = !!username;

    useEffect(() => {
        const updateUsername = () => {
            const storedUsername = localStorage.getItem("username");
            setUsername(storedUsername);
        };

        updateUsername(); // On first load

        // Listen for changes (even across tabs)
        window.addEventListener("storage", updateUsername);

        // Also re-check when this page updates (like after login)
        const interval = setInterval(updateUsername, 500);

        return () => {
            window.removeEventListener("storage", updateUsername);
            clearInterval(interval);
        };
    }, []);


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

    const handleLogout = () => {
        console.log("Logging out");
        localStorage.removeItem("username");
        setUsername(null);
        setShowMenu(false);
        navigate("/");
        window.location.reload();
    };

    return (
        <div className={styles.navbar}>
            <div className={styles.logoItem}>
                <img className={styles.img} src={logo} alt="CyberOps Logo" />
                <div className={styles.logoItem}>CyberOps</div>
            </div>

            <div className={styles.tagLine}>
                {loggedIn ? (
                    <div className="profile-container" ref={dropdownRef} onClick={toggleMenu}>
                        <div className="profile-name">
                            <img className="usericon" src={user} alt="user" />
                            {username}
                            <img className="usericon" src={dropdown} alt="dropdown" />
                        </div>
                        {showMenu && (
                            <div className="dropdown-menu">
                                <div className="menu-item" onClick={(e) => { e.stopPropagation(); handleLogout(); }}>Logout</div>
                                <div className="menu-item" onClick={(e) => { e.stopPropagation(); navigate("/result") }}>Check URL</div>
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
