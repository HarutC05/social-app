import classNames from "./auth.module.css";
import AccountContainer from "./components/AccountContainer";

export default function Register() {
    return (
        <div className={classNames.container}>
            <AccountContainer infoType="register" />
        </div>
    );
}
