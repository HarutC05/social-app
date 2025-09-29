import styles from "./button.module.css";
import type { ButtonHTMLAttributes, JSX } from "react";

export default function Button(
    props: ButtonHTMLAttributes<HTMLButtonElement>
): JSX.Element {
    const { children, className, ...rest } = props;
    return (
        <button {...rest} className={`${styles.button} ${className ?? ""}`}>
            {children}
        </button>
    );
}
