import styles from "./helpPage.module.css";

export default function HelpPage() {
    return (
        <div className={styles.container}>
            <h1>Help & Support</h1>
            <p>
                Welcome to the Help & Support page. Here you can find answers to
                frequently asked questions, troubleshooting guides, and contact
                information for further assistance.
            </p>

            <section className={styles.faq}>
                <h2>Frequently Asked Questions</h2>
                <ul>
                    <li>
                        <strong>How do I reset my password?</strong> – You can
                        reset your password by clicking “Forgot Password” on the
                        login page.
                    </li>
                    <li>
                        <strong>How do I edit my profile?</strong> – Go to “My
                        Profile” from the dropdown menu in the header.
                    </li>
                    <li>
                        <strong>How do I contact support?</strong> – Use the
                        contact form on the Contact page or email us directly at
                        support@nova.com.
                    </li>
                </ul>
            </section>
        </div>
    );
}
