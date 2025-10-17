import { useState } from "react";
import Sidebar from "./components/SideBar/Sidebar";
import ChangePassword from "./components/ChangePassword/ChangePassword";
import DeleteAccount from "./components/DeleteAccount/DeleteAccount";
import styles from "./settings.module.css";

export default function SettingsPage() {
    const [selectedSection, setSelectedSection] = useState("changePassword");

    const renderSection = () => {
        switch (selectedSection) {
            case "changePassword":
                return <ChangePassword />;
            case "deleteAccount":
                return <DeleteAccount />;
            default:
                return <div>Select a section</div>;
        }
    };

    return (
        <div className={styles.container}>
            <Sidebar selected={selectedSection} onSelect={setSelectedSection} />
            <div className={styles.content}>{renderSection()}</div>
        </div>
    );
}
