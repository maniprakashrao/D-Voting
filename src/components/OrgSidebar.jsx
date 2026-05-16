import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

export default function OrgSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div style={styles.sidebar}>
      <div>
        <h2 style={styles.logo}>VOTE<span style={{color: '#3b82f6'}}>ORG</span></h2>
        <nav style={styles.nav}>
          <Link 
            to="/org/dashboard" 
            style={{...styles.link, color: isActive('/org/dashboard') ? '#fff' : '#94a3b8'}}
          >
            🏠 Dashboard
          </Link>
          <Link 
            to="/org/create" 
            style={{...styles.link, color: isActive('/org/create') ? '#fff' : '#94a3b8'}}
          >
            ➕ Create Election
          </Link>
        </nav>
      </div>
      
      <div style={styles.footer}>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  sidebar: { 
    width: '260px', 
    height: '100vh', 
    background: '#0f172a', 
    color: 'white', 
    padding: '40px 20px', 
    display: 'flex', 
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'fixed',
    left: 0,
    top: 0
  },
  logo: { 
    fontSize: '24px', 
    fontWeight: '900', 
    letterSpacing: '1px', 
    marginBottom: '50px', 
    textAlign: 'center' 
  },
  nav: { display: 'flex', flexDirection: 'column', gap: '20px' },
  link: { 
    textDecoration: 'none', 
    fontSize: '16px', 
    fontWeight: '600', 
    transition: '0.2s',
    padding: '10px 15px',
    borderRadius: '8px'
  },
  footer: { borderTop: '1px solid #1e293b', paddingTop: '20px' },
  logoutBtn: { 
    width: '100%', 
    padding: '12px', 
    background: '#ef4444', 
    color: 'white', 
    border: 'none', 
    borderRadius: '10px', 
    fontWeight: 'bold', 
    cursor: 'pointer' 
  }
};