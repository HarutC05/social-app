import { useState } from "react";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import { usernameIcon } from "../../assets/icons/usernameIcon";
import { emailIcon } from "../../assets/icons/emailIcon";
import { messageIcon } from "../../assets/icons/messageIcon";
import classNames from "./contactPage.module.css";
import type { JSX } from "react";

export default function ContactPage(): JSX.Element {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
    };

    return (
        <div className={classNames.container}>
            <h1 className={classNames.title}>Contact Us</h1>
            <form className={classNames.form} onSubmit={handleSubmit}>
                <Input
                    icon={usernameIcon}
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <Input
                    icon={emailIcon}
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <Input
                    icon={messageIcon}
                    as="textarea"
                    name="message"
                    placeholder="Your Message..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                />

                <Button type="submit">SEND MESSAGE</Button>
            </form>
        </div>
    );
}
