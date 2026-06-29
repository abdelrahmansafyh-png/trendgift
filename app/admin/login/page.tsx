"use client";

import { useState } from "react";
import Link from "next/link";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "trend2024";

export default function AdminLoginPage() {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  const login = () => {
    if (pw === ADMIN_PASSWORD) {
      localStorage.setItem("trend_admin_auth", "true");
      const params = new URLSearchParams(window.location.search);
      window.location.href = params.get("next") || "/admin";
      return;
    }
    setError(true);
  };

  return (
    <div className="admin-login">
      <div className="login-box">
        <div className="login-logo"><span>Trend</span><small>Admin Panel</small></div>
        <h2>تسجيل الدخول</h2>
        <p>ادخل كلمة سر لوحة التحكم.</p>
        <input
          type="password"
          placeholder="كلمة السر"
          value={pw}
          onChange={(e) => { setPw(e.target.value); setError(false); }}
          onKeyDown={(e) => e.key === "Enter" && login()}
          className={error ? "input-error" : ""}
          autoFocus
        />
        {error && <p className="error-msg">كلمة السر غير صحيحة</p>}
        <button className="primaryBtn" onClick={login}>دخول</button>
        <Link href="/" className="back-link">← الرجوع للموقع</Link>
        <small className="login-hint">كلمة السر الافتراضية: trend2024 ويمكن تغييرها من .env.local عبر NEXT_PUBLIC_ADMIN_PASSWORD</small>
      </div>
    </div>
  );
}
