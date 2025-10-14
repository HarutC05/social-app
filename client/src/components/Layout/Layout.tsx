import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import styles from "./layout.module.css";
import { useAuth } from "../../hooks/useAuth";
import type { JSX } from "react/jsx-runtime";

type LayoutProps = {
    children: React.ReactNode;
    showHeader?: boolean;
    showFooter?: boolean;
    isHomePage?: boolean;
};

export default function Layout({
    children,
    showHeader = true,
    showFooter = true,
    isHomePage = false,
}: LayoutProps): JSX.Element {
    const { logout } = useAuth();

    const containerClass = `${styles.layoutContainer} ${
        isHomePage ? styles.homeBackground : styles.defaultBackground
    }`;

    return (
        <div className={containerClass}>
            {showHeader && <Header onLogout={logout ?? (() => {})} />}
            <main className={styles.layoutMain}>
                <div className={styles.contentWrapper}>{children}</div>
            </main>
            {showFooter && <Footer />}
        </div>
    );
}
