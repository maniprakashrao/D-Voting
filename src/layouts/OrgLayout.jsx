import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

export default function OrgLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/org/dashboard", icon: "📊" },
    { name: "Create Election", path: "/org/create-election", icon: "➕" },
    { name: "Election Results", path: "/org/results-list", icon: "🏆" },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      {/* SIDEBAR */}
      <div style={{ width: "280px", background: "white", borderRight: "1px solid #e2e8f0", padding: "30px 20px", display: "flex", flexDirection: "column" }}>
        <h2 style={{ fontWeight: "900", fontSize: "1.5rem", marginBottom: "40px", color: "#2563eb" }}>D-VOTING</h2>
        
        <nav style={{ flex: 1 }}>
          {menuItems.map((item) => (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                padding: "14px 20px",
                borderRadius: "12px",
                cursor: "pointer",
                marginBottom: "8px",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                background: location.pathname === item.path ? "#eff6ff" : "transparent",
                color: location.pathname === item.path ? "#2563eb" : "#64748b",
                transition: "0.2s"
              }}
            >
              <span>{item.icon}</span> {item.name}
            </div>
          ))}
        </nav>

        <button onClick={handleLogout} style={{ padding: "12px", color: "#ef4444", fontWeight: "700", border: "none", background: "none", cursor: "pointer", textAlign: "left" }}>
          🚪 Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {children}
      </div>
    </div>
  );
}