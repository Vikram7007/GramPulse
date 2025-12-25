import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { notifySuccess, notifyError } from "../components/NotificationToast";
import { useTranslation } from "react-i18next";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

function Register() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [village, setVillage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async () => {
    if (!name || !mobile || !password || !village) {
      notifyError(t("error.fillFields"));
      return;
    }

    if (mobile.length !== 10) {
      notifyError(t("error.invalidMobile"));
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/register`, {
        name,
        mobile,
        password,
        village,
      });

      const { token, user } = res.data;

      login(user, token);
      notifySuccess(`${t("welcome")}, ${user.name}! 🏡`);
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.msg || "Registration failed";
      notifyError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-200 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-primary">
            {t("appName")}
          </h1>
          <p className="text-gray-600 mt-2">{t("tagline")}</p>
        </div>

        <h2 className="text-2xl font-semibold text-center mb-8">
          {t("register")}
        </h2>

        <div className="space-y-6">
          <input
            type="text"
            placeholder={t("fullName")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-4 border-2 border-gray-300 rounded-xl text-lg focus:border-primary transition"
            disabled={loading}
          />

          <input
            type="text"
            placeholder={t("mobile")}
            value={mobile}
            onChange={(e) =>
              setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            maxLength="10"
            className="w-full p-4 border-2 border-gray-300 rounded-xl text-lg focus:border-primary transition"
            disabled={loading}
          />

          <input
            type="password"
            placeholder={t("password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 border-2 border-gray-300 rounded-xl text-lg focus:border-primary transition"
            disabled={loading}
          />

          <input
            type="text"
            placeholder={t("villageName")}
            value={village}
            onChange={(e) => setVillage(e.target.value)}
            className="w-full p-4 border-2 border-gray-300 rounded-xl text-lg focus:border-primary transition"
            disabled={loading}
          />

          <button
            onClick={handleRegister}
            disabled={loading}
            className={`w-full py-4 rounded-xl text-xl font-bold text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary hover:bg-secondary shadow-lg"
            }`}
          >
            {loading ? t("registering") : t("register")}
          </button>
        </div>

        <p className="text-center mt-8 text-gray-600">
          {t("haveAccount")}{" "}
          <span
            onClick={() => navigate("/")}
            className="text-primary font-bold cursor-pointer hover:underline"
          >
            {t("login")}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;