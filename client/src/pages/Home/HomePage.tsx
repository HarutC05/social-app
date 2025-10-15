import styles from "./homePage.module.css";
import HeroBanner from "./components/HeroBanner/HeroBanner";
import LeftPanel from "./components/LeftPanel/LeftPanel";
import RightPanel from "./components/RightPanel/RightPanel";
import Feed from "./components/Feed/Feed";
import { useState } from "react";
import type { FeedFilters } from "./components/LeftPanel/LeftPanel";

export default function HomePage() {
    const [filters, setFilters] = useState<FeedFilters>({
        sort: "recent",
        images: false,
        tag: null,
        search: null,
    });

    return (
        <div className={styles.page}>
            <LeftPanel filters={filters} setFilters={setFilters} />
            <div className={styles.center}>
                <HeroBanner />
                <div className={styles.feed}>
                    <Feed filters={filters} />
                </div>
            </div>
            <RightPanel />
        </div>
    );
}
