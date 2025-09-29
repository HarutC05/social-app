import classNames from "./auth.module.css";
import { emailIcon } from "../../assets/icons/emailIcon";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import type { JSX } from "react";

export default function ForgotPassword(): JSX.Element {
    return (
        <div className={classNames.container}>
            <div
                style={{
                    width: "30%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <h1
                    style={{
                        fontFamily: "Open Sans, sans-serif",
                        fontSize: "2rem",
                        marginBottom: "1.5rem",
                        fontWeight: 100,
                        letterSpacing: "2px",
                        color: "#929292",
                    }}
                >
                    Forgot Password
                </h1>
                <p
                    style={{
                        marginBottom: "1.5rem",
                        textAlign: "center",
                        color: "#929292",
                    }}
                >
                    Enter your email address below and we’ll send you
                    instructions to reset your password.
                </p>
                <form
                    style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: "50px",
                        alignItems: "center",
                    }}
                >
                    <Input
                        icon={emailIcon}
                        type="email"
                        id="forgot-email"
                        name="email"
                        placeholder="Email ID"
                        required
                    />
                    <Button type="submit">SEND RESET LINK</Button>
                </form>
            </div>
        </div>
    );
}
