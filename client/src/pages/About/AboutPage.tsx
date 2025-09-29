import styles from "./aboutPage.module.css";

export default function AboutUsPage() {
    return (
        <div className={styles.container}>
            <h1>About Us</h1>
            <p>
                Welcome to our platform! We aim to provide a seamless experience
                for users to connect, share, and explore content. Our mission is
                to empower communities and foster collaboration in a safe and
                user-friendly environment.
            </p>
            <p>
                Our team is dedicated to continuous improvement, innovative
                solutions, and providing top-notch support for all our users.
            </p>
        </div>
    );
}
