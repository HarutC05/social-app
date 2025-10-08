import styles from "./input.module.css";
import type {
    JSX,
    ReactNode,
    InputHTMLAttributes,
    TextareaHTMLAttributes,
} from "react";

interface Props {
    icon?: JSX.Element | ReactNode;
    children?: JSX.Element | JSX.Element[] | ReactNode;
    className?: string;
    as?: "input" | "textarea";
}

type InputProps<T extends "input" | "textarea"> = Props &
    (T extends "input"
        ? InputHTMLAttributes<HTMLInputElement>
        : TextareaHTMLAttributes<HTMLTextAreaElement>);

export default function Input<T extends "input" | "textarea" = "input">({
    icon,
    children,
    className,
    as,
    ...inputProps
}: InputProps<T> & { as?: T }): JSX.Element {
    if (as === "textarea") {
        return (
            <div className={`${styles.inputContainer} ${className ?? ""}`}>
                {icon}
                <textarea
                    {...(inputProps as TextareaHTMLAttributes<HTMLTextAreaElement>)}
                    className={styles.input}
                >
                    {children}
                </textarea>
            </div>
        );
    }

    return (
        <div className={`${styles.inputContainer} ${className ?? ""}`}>
            {icon}
            <input
                {...(inputProps as InputHTMLAttributes<HTMLInputElement>)}
                className={styles.input}
            />
            {children && <span className={styles.extra}>{children}</span>}
        </div>
    );
}
