import classNames from "./auth.module.css";
import AccountContainer from "./components/AccountContainer";

export default function LoginPage() {
    return (
        <>
            <div className={classNames.container}>
                <AccountContainer infoType="login" />
            </div>
        </>
    );
}
