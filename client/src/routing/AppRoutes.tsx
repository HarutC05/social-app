import { Routes, Route } from "react-router-dom";
import { ROUTES } from "./routes";
import PrivateRoute from "./PrivateRoute";
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
import SearchResults from "../pages/Search/SearchResults";
import SettingsPage from "../pages/Settings/Settings";

import type { JSX } from "react";

export default function AppRoutes(): JSX.Element {
    return (
        <Routes>
            <Route
                path={ROUTES.HOME}
                element={
                    <PrivateRoute>
                        <Layout isHomePage>
                            <HomePage />
                        </Layout>
                    </PrivateRoute>
                }
            />
            <Route
                path={ROUTES.POST}
                element={
                    <PrivateRoute>
                        <Layout>
                            <PostPage />
                        </Layout>
                    </PrivateRoute>
                }
            />
            <Route
                path={ROUTES.USER_PROFILE}
                element={
                    <PrivateRoute>
                        <Layout>
                            <ProfilePage />
                        </Layout>
                    </PrivateRoute>
                }
            />
            <Route
                path="/search"
                element={
                    <PrivateRoute>
                        <Layout>
                            <SearchResults />
                        </Layout>
                    </PrivateRoute>
                }
            />
            <Route
                path={ROUTES.ABOUT}
                element={
                    <Layout>
                        <AboutUsPage />
                    </Layout>
                }
            />
            <Route
                path={ROUTES.HELP}
                element={
                    <Layout>
                        <HelpPage />
                    </Layout>
                }
            />
            <Route
                path={ROUTES.CONTACT}
                element={
                    <Layout>
                        <ContactPage />
                    </Layout>
                }
            />
            <Route
                path={ROUTES.LOGIN}
                element={
                    <Layout showHeader={false}>
                        <LoginPage />
                    </Layout>
                }
            />
            <Route
                path={ROUTES.REGISTER}
                element={
                    <Layout showHeader={false}>
                        <RegisterPage />
                    </Layout>
                }
            />
            <Route
                path={ROUTES.FORGOT_PASSWORD}
                element={
                    <Layout showHeader={false} showFooter={false}>
                        <ForgotPasswordPage />
                    </Layout>
                }
            />
            <Route
                path={ROUTES.MY_PROFILE}
                element={
                    <PrivateRoute>
                        <Layout>
                            <MyProfilePage />
                        </Layout>
                    </PrivateRoute>
                }
            />
            <Route
                path={ROUTES.EDIT_PROFILE}
                element={
                    <PrivateRoute>
                        <Layout>
                            <EditProfile />
                        </Layout>
                    </PrivateRoute>
                }
            />
            <Route
                path={ROUTES.CREATE_POST}
                element={
                    <PrivateRoute>
                        <Layout>
                            <CreatePostPage />
                        </Layout>
                    </PrivateRoute>
                }
            />
            <Route
                path={ROUTES.SETTINGS}
                element={
                    <PrivateRoute>
                        <Layout>
                            <SettingsPage />
                        </Layout>
                    </PrivateRoute>
                }
            />
            <Route
                path={ROUTES.USER_PROFILE}
                element={
                    <PrivateRoute>
                        <Layout>
                            <ProfilePage />
                        </Layout>
                    </PrivateRoute>
                }
            />
        </Routes>
    );
}
