import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { notifySuccess, notifyError } from "../components/NotificationToast";
import { useTranslation } from "react-i18next";
import api from "../utils/api"; // <--- api.js मधून import कर (withCredentials सह)

function Login() {
  const { t } = useTranslation();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth(); // login function जो फक्त user data save करेल

  const handleLogin = async () => {
    if (!mobile || !password) {
      notifyError(t("error.fillFields") || "कृपया सगळे fields भरा");
      return;
    }

    if (mobile.length !== 10) {
      notifyError(t("error.invalidMobile") || "मोबाईल १० अंकाचा असावा");
      return;
    }

    setLoading(true);

    try {
      // api.js मधून withCredentials: true असल्याने cookie automatic receive होईल
      const res = await api.post("/auth/login", {
        mobile,
        password,
      });

      // Backend आता फक्त user data पाठवतो (token cookie मध्ये आहे)
      const { user } = res.data;

      // AuthContext मध्ये फक्त user save कर (token cookie मध्ये आहे)
      login(user); // token parameter नाही

      notifySuccess(`${t("welcome") || "स्वागत आहे"}, ${user.name}! 🏡`);
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.msg || "Login failed, try again";
      notifyError(msg);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-200 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md transform transition hover:scale-[1.02]">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-primary tracking-wide">
            {t("appName")}
          </h1>
          <p className="text-gray-600 mt-2">{t("tagline")}</p>
        </div>

        <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">
          {t("login")}
        </h2>

        <div className="space-y-6">
          <input
            type="text"
            placeholder={t("mobile")}
            value={mobile}
            onChange={(e) =>
              setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            className="w-full p-4 border-2 border-gray-300 rounded-xl text-lg focus:outline-none focus:border-primary transition"
            maxLength="10"
            disabled={loading}
          />

          <input
            type="password"
            placeholder={t("password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 border-2 border-gray-300 rounded-xl text-lg focus:outline-none focus:border-primary transition"
            disabled={loading}
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full py-4 rounded-xl text-xl font-bold text-white transition transform hover:scale-105 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary hover:bg-secondary shadow-lg"
            }`}
          >
            {loading ? t("loggingIn") : t("login")}
          </button>
        </div>

        <p className="text-center mt-8 text-gray-600">
          {t("noAccount")}{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-primary font-bold cursor-pointer hover:underline"
          >
            {t("register")}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;