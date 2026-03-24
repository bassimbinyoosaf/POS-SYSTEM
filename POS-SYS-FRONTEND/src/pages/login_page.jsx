import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLoader from "../components/ui/AppLoader";
import api from "../api/axios";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [shake, setShake] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showEye, setShowEye] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const validate = () => {
    const newErrors = {};

    if (!email) newErrors.email = "Email is required";
    else if (!emailRegex.test(email)) newErrors.email = "Enter a valid email";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");

    const validationErrors = validate();
    setErrors(validationErrors);
    setTouched({ email: true, password: true });

    if (Object.keys(validationErrors).length !== 0) {
      triggerShake();
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token);

      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1500);

    } catch (err) {
      setTimeout(() => {
        setLoading(false);
        setAuthError(
          err.response?.data?.message || "Invalid email or password"
        );
        triggerShake();
      }, 800);
    }
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    setErrors(validate());
  };

  const inputStyle = (field) =>
    `mt-2 w-full h-12 sm:h-11 px-4 border rounded-lg outline-none transition
     ${
       touched[field] && errors[field]
         ? "border-red-400 focus:ring-red-200 focus:border-red-400"
         : "border-gray-300 focus:ring-indigo-500/30 focus:border-indigo-500"
     }`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#eef2f7] px-4 py-10 sm:py-0">

      {/* HEADER */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" stroke="white" strokeWidth="1.6"/>
            <path d="M12 21V12" stroke="white" strokeWidth="1.6"/>
            <path d="M20 7.5L12 12L4 7.5" stroke="white" strokeWidth="1.6"/>
          </svg>
        </div>

        <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-900">
          POS Manager
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Sign in to manage your machines
        </p>
      </div>

      {/* CARD */}
      <div className={`w-full max-w-[420px] mx-4 sm:mx-0 bg-white border border-gray-200 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.08)] px-6 sm:px-10 py-7 sm:py-8 ${shake ? "shake" : ""}`}>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur("email")}
              className={inputStyle("email")}
            />
            {touched.email && errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setShowEye(e.target.value.length > 0);
                }}
                onBlur={() => handleBlur("password")}
                className={inputStyle("password") + " pr-12"}
              />

              {showEye && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setShowPassword(prev => !prev)}
                    className="text-gray-400 hover:text-indigo-600 transition duration-200"
                  >
                    {showPassword ? (
                      /* Eye Off */
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M3 3L21 21" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                        <path d="M10.6 10.6A2 2 0 0013.4 13.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                        <path
                          d="M9.9 4.24A10.94 10.94 0 0112 4c7 0 10 8 10 8a17.6 17.6 0 01-2.3 3.3M6.5 6.5C3.7 8.3 2 12 2 12s3 8 10 8c1.3 0 2.5-.3 3.6-.7"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                        />
                      </svg>
                    ) : (
                      /* Eye */
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M2 12S5 4 12 4s10 8 10 8-3 8-10 8S2 12 2 12Z"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        />
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7"/>
                      </svg>
                    )}
                  </button>
                </div>
              )}
            </div>

            {touched.password && errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* AUTH ERROR */}
          {authError && !loading && (
            <div className="bg-red-100 text-red-600 text-sm px-4 py-2 rounded-lg border border-red-300 animate-fadeIn">
              {authError}
            </div>
          )}

          {/* BUTTON */}
          <button
            disabled={loading}
            className={`w-full h-11 rounded-lg text-white font-semibold transition shadow-md
              bg-gradient-to-r from-indigo-500 to-indigo-600
              ${loading ? "opacity-70 cursor-not-allowed" : "hover:brightness-110 active:scale-[0.99]"}`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>
      </div>

      {/* LOADER */}
      {loading && <AppLoader text="Signing you in..." />}

    </div>
  );
}