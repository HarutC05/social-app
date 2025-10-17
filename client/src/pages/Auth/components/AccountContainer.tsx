import { useState, type ChangeEvent, type FormEvent } from "react";
import { emailIcon } from "../../../assets/icons/emailIcon";
import { lockIcon } from "../../../assets/icons/lockIcon";
import { eyeOpenIcon, eyeClosedIcon } from "../../../assets/icons/eyeIcon";
import { usernameIcon } from "../../../assets/icons/usernameIcon";
import { confirmPasswordIcon } from "../../../assets/icons/confirmPasswordIcon";
import classNames from "./accountContainer.module.css";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import { useAuth } from "../../../hooks/useAuth";
import type { JSX } from "react/jsx-runtime";

interface AccountContainerProps {
    infoType: "login" | "register";
}

export default function AccountContainer({
    infoType,
}: AccountContainerProps): JSX.Element {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { login, register } = useAuth();

    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) =>
        setUsername(e.target.value);

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) =>
        setEmail(e.target.value);

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) =>
        setPassword(e.target.value);

    const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) =>
        setConfirmPassword(e.target.value);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        if (infoType === "register" && password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            if (infoType === "login") {
                await login({ email, password });
            } else {
                await register({ username, email, password });
            }
        } catch (err: unknown) {
            console.error("Auth failed:", err);

            let message = "Something went wrong";

            if (typeof err === "object" && err !== null && "message" in err) {
                // err is likely an Error thrown by useAuth.normalizeAndThrowError
                message = (err as any).message || message;
            } else if (
                typeof err === "object" &&
                err !== null &&
                "response" in err
            ) {
                const axiosErr = err as any;
                message =
                    axiosErr.response?.data?.message ||
                    axiosErr.message ||
                    message;
            }

            if (message === "Invalid refresh token")
                message = "Invalid credentials";

            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={classNames.container}>
            <h1 className={classNames.title}>
                {infoType === "login" ? "Login" : "Sign Up"}
            </h1>

            <form className={classNames.form} onSubmit={handleSubmit}>
                {infoType === "register" && (
                    <Input
                        icon={usernameIcon}
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Username"
                        value={username}
                        onChange={handleUsernameChange}
                        required
                    />
                )}

                <Input
                    icon={emailIcon}
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email ID"
                    value={email}
                    onChange={handleEmailChange}
                    required
                />

                <Input
                    icon={lockIcon}
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
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
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
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

                {error && <p className={classNames.error}>{error}</p>}

                <Button type="submit" disabled={isLoading}>
                    {isLoading
                        ? "Please wait..."
                        : infoType === "login"
                          ? "LOGIN"
                          : "SIGN UP"}
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
