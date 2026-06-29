"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";

export default function AdminGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const ok = localStorage.getItem("trend_admin_auth") === "true";
    setAllowed(ok);
    setReady(true);
    if (!ok) {
      const next = encodeURIComponent(window.location.pathname);
      window.history.replaceState(null, "", `/admin/login?next=${next}`);
    }
  }, []);

  if (!ready) {
    return <div className="admin-loading">جار التحميل...</div>;
  }

  if (!allowed) {
    return (
      <div className="admin-login">
        <div className="login-box">
          <div className="login-logo"><span>Trend</span><small>Admin Panel</small></div>
          <h2>تسجيل الدخول مطلوب</h2>
          <p>افتح صفحة تسجيل الدخول للدخول للوحة التحكم.</p>
          <Link className="primaryBtn" href="/admin/login">تسجيل الدخول</Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
