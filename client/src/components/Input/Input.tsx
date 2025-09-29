import styles from "./input.module.css";
import type {
    InputHTMLAttributes,
    TextareaHTMLAttributes,
    JSX,
    ReactNode,
} from "react";

interface Props {
    icon?: JSX.Element | ReactNode;
    children?: JSX.Element | JSX.Element[] | ReactNode;
    className?: string;
    as?: "input" | "textarea";
}

type CombinedProps = Props &
    InputHTMLAttributes<HTMLInputElement> &
    TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function Input({
    icon,
    children,
    className,
    as = "input",
    ...inputProps
}: CombinedProps): JSX.Element {
    const Element = as;

    return (
        <div className={`${styles.inputContainer} ${className ?? ""}`}>
            {icon}
            <Element {...inputProps} className={styles.input} />
            {children}
        </div>
    );
}
