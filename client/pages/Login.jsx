import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { useSettings } from "../hooks/useSettings"; 

const Login = () => {
    const { data: settings } = useSettings();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        // Auto-handle "admin" shorthand
        const emailToSend = username.toLowerCase() === "admin" ? "admin@lumina.studio" : username;

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: emailToSend, password }),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("isLoggedIn", "true");

                if (rememberMe) {
                    localStorage.setItem("rememberMe", "true");
                }
                navigate("/admin-dashboard");
            } else {
                setError(data.error || "Login failed");
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
            <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Left Section - Login Form */}
                <div className="p-8 lg:p-12 flex flex-col justify-center bg-white order-last lg:order-last">
                    <div className="space-y-8">
                        {/* Heading */}
                        <div className="text-center lg:text-left">
                            <h1 className="text-4xl font-bold text-gray-900 mb-3">Login</h1>
                            <p className="text-gray-600">Enter your credentials to get in</p>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleLogin} className="space-y-6">
                            {/* Username Field */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="admin@studio.com"
                                    autoComplete="username"
                                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-gold-500 text-gray-700 placeholder-gray-500"
                                    required
                                />
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="•••••••"
                                        autoComplete="current-password"
                                        className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-gold-500 text-gray-700 placeholder-gray-500 pr-12"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition p-1"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        title={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Remember Me */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="rememberMe"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 text-gold-600 rounded focus:ring-2 focus:ring-gold-500 cursor-pointer"
                                />
                                <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700 cursor-pointer">
                                    Remember me
                                </label>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                className="w-full bg-gold-500 hover:bg-gold-600 text-white font-semibold py-3 rounded-lg transition duration-200"
                            >
                                Login
                            </button>
                        </form>

                        {/* Sign Up Link */}
                        <div className="text-center">
                            <p className="text-gray-600 text-sm">
                                Not a member?{" "}
                                <Link to="/register" className="font-semibold text-gray-900 hover:text-purple-600">
                                    Create an account
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Section - Left-side Hero (Image/Illustration) */}
                <div
                    className="hidden lg:flex relative p-8 items-center justify-center overflow-hidden order-first lg:order-first bg-cover bg-center"
                    style={{ backgroundImage: `url(${settings?.backgroundImage || '/assets/img/slider/hero6.jpg'})` }}
                >
                    <div className="absolute inset-0 bg-black opacity-40" />

                    {/* Hero Content */}
                    <div className="relative z-10 flex flex-col items-center justify-center text-center text-white h-full w-full px-8">
                        {/* App Logo Image */}
                        <div className="mb-8">
                            {settings?.primaryLogo ? (
                                <img src={settings.primaryLogo} alt={`${settings.businessName || 'Logo'}`} className="w-40 h-40 object-contain drop-shadow-xl rounded-md bg-white/10 p-2" />
                            ) : (
                                <img src="/assets/img/logo.PNG" alt="Logo" className="w-40 h-40 object-contain drop-shadow-xl rounded-md bg-white/10 p-2" />
                            )}
                        </div>

                        <h2 className="text-3xl font-bold leading-tight mb-2">
                            Capture moments, create memories
                        </h2>
                        <p className="text-lg opacity-90 max-w-xs">
                            Manage your photography studio with ease
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
