import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

export default function StudentSidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>Student Portal</h2>
      <nav style={styles.nav}>
        <Link to="/student/dashboard" style={styles.link}>📊 My Elections</Link>
        <Link to="/student/join" style={styles.link}>🔑 Join Election</Link>
      </nav>
      <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
    </div>
  );
}

const styles = {
  sidebar: { width: '250px', height: '100vh', background: '#1e293b', color: 'white', padding: '30px', display: 'flex', flexDirection: 'column' },
  logo: { fontSize: '20px', marginBottom: '40px', fontWeight: '800', color: '#3b82f6' },
  nav: { display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 },
  link: { color: '#94a3b8', textDecoration: 'none', fontWeight: '600', fontSize: '15px' },
  logoutBtn: { padding: '10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }
};