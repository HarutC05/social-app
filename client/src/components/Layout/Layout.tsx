import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import profilePicture from "../../assets/images/profilePicture.jpeg";
import styles from "./layout.module.css";

type LayoutProps = {
    children: React.ReactNode;
    showHeader?: boolean;
    showFooter?: boolean;
    isAuthenticated: boolean;
    onLogout: () => void;
    isHomePage?: boolean;
};

export default function Layout({
    children,
    showHeader = true,
    showFooter = true,
    isAuthenticated,
    onLogout,
    isHomePage = false,
}: LayoutProps) {
    const containerClass = `${styles.layoutContainer} ${
        isHomePage ? styles.homeBackground : styles.defaultBackground
    }`;

    return (
        <div className={containerClass}>
            {showHeader && (
                <Header
                    avatarUrl={profilePicture}
                    isLoggedIn={isAuthenticated}
                    onLogout={onLogout}
                />
            )}
            <main className={styles.layoutMain}>
                <div className={styles.contentWrapper}>{children}</div>
            </main>
            {showFooter && <Footer />}
        </div>
    );
}
