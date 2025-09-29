import { Routes, Route } from "react-router-dom";
import { ROUTES } from "./routes";
import { PrivateRoute } from "./PrivateRoute";

import Layout from "../components/Layout/Layout";

import HomePage from "../pages/Home/HomePage";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import MyProfilePage from "../pages/MyProfile/MyProfilePage";
import EditProfile from "../pages/MyProfile/EditProfile";
import PostPage from "../pages/Post/PostPage";
import ForgotPasswordPage from "../pages/Auth/ForgotPasswordPage";
import AboutUsPage from "../pages/About/AboutPage";
import ContactPage from "../pages/Contact/ContactPage";
import HelpPage from "../pages/Help/HelpPage";
import CreatePostPage from "../pages/CreatePost/CreatePost";

interface AppRoutesProps {
    isAuthenticated: boolean;
    onLogout: () => void;
}

const AppRoutes = ({ isAuthenticated, onLogout }: AppRoutesProps) => {
    return (
        <Routes>
            {/* ---------- Public Pages ---------- */}
            <Route
                path={ROUTES.HOME}
                element={
                    <Layout
                        isAuthenticated={isAuthenticated}
                        onLogout={onLogout}
                        isHomePage={true}
                    >
                        <HomePage />
                    </Layout>
                }
            />
            <Route
                path={ROUTES.POST}
                element={
                    <Layout
                        isAuthenticated={isAuthenticated}
                        onLogout={onLogout}
                    >
                        <PostPage />
                    </Layout>
                }
            />
            <Route
                path={ROUTES.PROFILE}
                element={
                    <Layout
                        isAuthenticated={isAuthenticated}
                        onLogout={onLogout}
                    >
                        <ProfilePage />
                    </Layout>
                }
            />
            <Route
                path={ROUTES.ABOUT}
                element={
                    <Layout
                        isAuthenticated={isAuthenticated}
                        onLogout={onLogout}
                    >
                        <AboutUsPage />
                    </Layout>
                }
            />
            <Route
                path={ROUTES.HELP}
                element={
                    <Layout
                        isAuthenticated={isAuthenticated}
                        onLogout={onLogout}
                    >
                        <HelpPage />
                    </Layout>
                }
            />
            <Route
                path={ROUTES.CONTACT}
                element={
                    <Layout
                        isAuthenticated={isAuthenticated}
                        onLogout={onLogout}
                    >
                        <ContactPage />
                    </Layout>
                }
            />
            {/* ---------- Auth Pages ---------- */}
            <Route
                path={ROUTES.LOGIN}
                element={
                    <Layout
                        showHeader={false}
                        showFooter={false}
                        isAuthenticated={isAuthenticated}
                        onLogout={onLogout}
                    >
                        <LoginPage />
                    </Layout>
                }
            />
            <Route
                path={ROUTES.REGISTER}
                element={
                    <Layout
                        showHeader={false}
                        showFooter={false}
                        isAuthenticated={isAuthenticated}
                        onLogout={onLogout}
                    >
                        <RegisterPage />
                    </Layout>
                }
            />
            <Route
                path={ROUTES.FORGOT_PASSWORD}
                element={
                    <Layout
                        showHeader={false}
                        showFooter={false}
                        isAuthenticated={isAuthenticated}
                        onLogout={onLogout}
                    >
                        <ForgotPasswordPage />
                    </Layout>
                }
            />
            {/* ---------- Private Pages ---------- */}
            <Route
                path={ROUTES.MY_PROFILE}
                element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                        <Layout
                            isAuthenticated={isAuthenticated}
                            onLogout={onLogout}
                        >
                            <MyProfilePage />
                        </Layout>
                    </PrivateRoute>
                }
            />
            <Route
                path={ROUTES.EDIT_PROFILE}
                element={
                    <PrivateRoute isAuthenticated={isAuthenticated}>
                        <Layout
                            isAuthenticated={isAuthenticated}
                            onLogout={onLogout}
                        >
                            <EditProfile />
                        </Layout>
                    </PrivateRoute>
                }
            />
            <Route
                path={ROUTES.CREATE_POST}
                element={
                    <Layout
                        isAuthenticated={isAuthenticated}
                        onLogout={onLogout}
                        isHomePage={false}
                    >
                        <CreatePostPage />
                    </Layout>
                }
            />
        </Routes>
    );
};

export default AppRoutes;
