import styles from "./leftPanel.module.css";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../../routing/routes";
import type { Dispatch, SetStateAction } from "react";

export type FeedFilters = {
    sort?: "recent" | "popular";
    images?: boolean;
    tag?: string | null;
    search?: string | null;
};

interface Props {
    filters: FeedFilters;
    setFilters: Dispatch<SetStateAction<FeedFilters>>;
}

export default function LeftPanel({ filters, setFilters }: Props) {
    const toggleSort = (s: FeedFilters["sort"]) =>
        setFilters((f) => ({
            ...f,
            sort: f.sort === s ? undefined : s,
        }));

    const toggleImages = () => setFilters((f) => ({ ...f, images: !f.images }));

    const toggleTag = (tagValue: string) =>
        setFilters((f) => ({
            ...f,
            tag: f.tag === tagValue ? null : tagValue,
        }));

    const clearFilters = () =>
        setFilters({
            sort: undefined,
            images: false,
            tag: null,
            search: null,
        });

    return (
        <aside className={styles.container}>
            <div className={styles.card}>
                <h3 className={styles.heading}>Shortcuts</h3>
                <nav className={styles.nav}>
                    <Link to={ROUTES.HOME}>Home</Link>
                    <Link to={ROUTES.PROFILE}>Profile</Link>
                    <Link to={ROUTES.ABOUT}>About</Link>
                    <Link to={ROUTES.HELP}>Help</Link>
                </nav>
            </div>

            <div className={styles.card}>
                <h3 className={styles.heading}>Filters</h3>
                <div className={styles.tags}>
                    <button
                        className={`${styles.tag} ${
                            filters.sort === "popular" ? styles.active : ""
                        }`}
                        onClick={() => toggleSort("popular")}
                        type="button"
                    >
                        Popular
                    </button>
                    <button
                        className={`${styles.tag} ${
                            filters.sort === "recent" ? styles.active : ""
                        }`}
                        onClick={() => toggleSort("recent")}
                        type="button"
                    >
                        Recent
                    </button>
                    <button
                        className={`${styles.tag} ${
                            filters.images ? styles.active : ""
                        }`}
                        onClick={toggleImages}
                        type="button"
                    >
                        Images
                    </button>
                    <button
                        className={`${styles.tag} ${
                            filters.tag === "tutorial" ? styles.active : ""
                        }`}
                        onClick={() => toggleTag("tutorial")}
                        type="button"
                    >
                        Tutorials
                    </button>
                    <button
                        className={styles.clearBtn}
                        onClick={clearFilters}
                        type="button"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>
        </aside>
    );
}
