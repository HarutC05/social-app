import styles from "./homePage.module.css";
import HeroBanner from "./components/HeroBanner/HeroBanner";
import LeftPanel from "./components/LeftPanel/LeftPanel";
import RightPanel from "./components/RightPanel/RightPanel";
import Feed from "./components/Feed/Feed";

export default function HomePage() {
    return (
        <div className={styles.page}>
            <LeftPanel />
            <div className={styles.center}>
                <HeroBanner />
                <div className={styles.feed}>
                    <Feed />
                </div>
            </div>
            <RightPanel />
        </div>
    );
}
