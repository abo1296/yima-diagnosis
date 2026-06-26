"use client";

import { useState, useEffect } from "react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [leads, setLeads] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const a = sessionStorage.getItem("admin_auth");
      if (a === "yima2024") setAuthed(true);
    }
  }, []);

  const handleLogin = () => {
    if (password === "yima2024") {
      setAuthed(true);
      sessionStorage.setItem("admin_auth", "yima2024");
      fetchLogs();
    }
  };

  const fetchLogs = () => {
    setLeads("线索已存入。在 Cloudflare 控制台 → Workers & Pages → yima-diagnosis → Logs 中查看实时日志。\n\n每条线索格式：[LEAD] 手机号 行业 门店数 得分 等级");
  };

  if (!authed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-5" style={{ background: "#0a0a0f" }}>
        <div className="max-w-sm w-full">
          <h1 className="text-xl font-bold mb-4 text-center" style={{ color: "#e0e0e0" }}>管理员登录</h1>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="输入密码"
            className="w-full px-4 py-3 rounded-xl text-sm mb-3" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e0e0e0" }} />
          <button onClick={handleLogin}
            className="w-full py-3 rounded-xl text-sm font-semibold" style={{ background: "#c0392b", color: "white" }}>
            登录
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-5 py-8" style={{ background: "#0a0a0f" }}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-xl font-bold mb-2" style={{ color: "#e0e0e0" }}>咨询线索管理</h1>
        <p className="text-sm mb-6" style={{ color: "#888" }}>以下为提交记录。密码: yima2024</p>
        <pre className="text-sm whitespace-pre-wrap rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)", color: "#888", border: "1px solid rgba(255,255,255,0.06)" }}>
          {leads || "加载中..."}
        </pre>
        <p className="text-xs mt-4" style={{ color: "#666" }}>
          查看方式：
          <br />1. Cloudflare 控制台 → Workers & Pages → yima-diagnosis → Logs
          <br />2. 或在环境变量配置 LEADS_WEBHOOK_URL（飞书/钉钉 webhook）实时推送
        </p>
      </div>
    </div>
  );
}
