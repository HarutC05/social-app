import { useState } from "react";
import { emailIcon } from "../../../assets/icons/emailIcon";
import { lockIcon } from "../../../assets/icons/lockIcon";
import { eyeOpenIcon, eyeClosedIcon } from "../../../assets/icons/eyeIcon";
import { usernameIcon } from "../../../assets/icons/usernameIcon";
import { confirmPasswordIcon } from "../../../assets/icons/confirmPasswordIcon";
import classNames from "./accountContainer.module.css";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import type { JSX } from "react";

interface AccountContainerProps {
    infoType: "login" | "register";
}

export default function AccountContainer({
    infoType,
}: AccountContainerProps): JSX.Element {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className={classNames.container}>
            <h1 className={classNames.title}>
                {infoType === "login" ? "Login" : "Sign Up"}
            </h1>
            <form className={classNames.form}>
                {infoType === "register" && (
                    <Input
                        icon={usernameIcon}
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Username"
                        required
                    />
                )}

                <Input
                    icon={emailIcon}
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email ID"
                    required
                />

                <Input
                    icon={lockIcon}
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Password"
                    required
                >
                    <span
                        className={classNames.eyeIcon}
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ cursor: "pointer" }}
                    >
                        {showPassword ? eyeOpenIcon : eyeClosedIcon}
                    </span>
                </Input>

                {infoType === "register" && (
                    <Input
                        icon={confirmPasswordIcon}
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        required
                    >
                        <span
                            className={classNames.eyeIcon}
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                            style={{ cursor: "pointer" }}
                        >
                            {showConfirmPassword ? eyeOpenIcon : eyeClosedIcon}
                        </span>
                    </Input>
                )}

                {infoType === "login" && (
                    <div className={classNames.optionsRow}>
                        <label className={classNames.rememberMe}>
                            <input
                                type="checkbox"
                                className={classNames.checkbox}
                            />
                            Remember Me
                        </label>
                        <a
                            href="/forgot-password"
                            className={classNames.forgotPassword}
                        >
                            Forgot Password?
                        </a>
                    </div>
                )}

                <Button type="submit">
                    {infoType === "login" ? "LOGIN" : "SIGN UP"}
                </Button>
            </form>

            <div className={classNames.switchAuth}>
                {infoType === "login" ? (
                    <p>
                        Don’t have an account?{" "}
                        <a href="/register" className={classNames.switchLink}>
                            Sign Up
                        </a>
                    </p>
                ) : (
                    <p>
                        Already have an account?{" "}
                        <a href="/login" className={classNames.switchLink}>
                            Login
                        </a>
                    </p>
                )}
            </div>
        </div>
    );
}
