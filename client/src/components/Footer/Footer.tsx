import { Link } from "react-router-dom";
import styles from "./footer.module.css";
import { ROUTES } from "../../routing/routes";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function Footer() {
    const { isAuthenticated } = useAuth();

    return (
        <footer className={styles.container}>
            <div className={styles.links}>
                {isAuthenticated && <Link to={ROUTES.HOME}>Home</Link>}
                <Link to={ROUTES.ABOUT}>About Us</Link>
                {isAuthenticated && <Link to={ROUTES.MY_PROFILE}>Profile</Link>}
                <Link to={ROUTES.HELP}>Help</Link>
                <Link to={ROUTES.CONTACT}>Contact</Link>
            </div>

            <div className={styles.social}>
                <Facebook size={16} />
                <Twitter size={16} />
                <Instagram size={16} />
                <Linkedin size={16} />
            </div>

            <div className={styles.copy}>
                &copy; {new Date().getFullYear()} Nova. All rights reserved.
            </div>
        </footer>
    );
}
