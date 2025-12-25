import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Sidebar() {
  const [open, setOpen] = useState(true);
  const { t } = useTranslation();

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed left-4 top-20 z-50 bg-primary text-white p-3 rounded-xl shadow-lg transition hover:bg-secondary"
        aria-label="Toggle Sidebar"
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        className={`bg-secondary text-white w-64 min-h-screen fixed left-0 top-16 z-40 transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <ul className="p-6 space-y-4 text-lg font-medium">
          <li>
            <Link
              to="/dashboard"
              className="flex items-center gap-3 hover:bg-primary p-3 rounded-xl transition"
            >
              🏠 {t("dashboard")}
            </Link>
          </li>

          <li>
            <Link
              to="/submit"
              className="flex items-center gap-3 hover:bg-primary p-3 rounded-xl transition"
            >
              ➕ {t("newIssue")}
            </Link>
          </li>

          <li>
            <Link
              to="/admin"
              className="flex items-center gap-3 hover:bg-primary p-3 rounded-xl transition"
            >
              👨‍💼 {t("adminDashboard")}
            </Link>
          </li>

          <li>
            <Link
              to="/public"
              className="flex items-center gap-3 hover:bg-primary p-3 rounded-xl transition"
            >
              📊 {t("publicDashboard")}
             
            </Link>
          </li>

          <li>
            <Link
              to="/VillageAdminDashboard"
              className="flex items-center gap-3 hover:bg-primary p-3 rounded-xl transition"
            >
              👨‍💼 {t("VillageAdminDashboard")}
            </Link>
          </li>
          
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
