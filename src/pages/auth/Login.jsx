import { useState } from "react"
import { supabase } from "../../services/supabaseClient"
import { useNavigate } from "react-router-dom"
import "../../App.css"

// --- Icons ---
const MailIcon = () => (
  <svg className="input-icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 0-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

const LockIcon = () => (
  <svg className="input-icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

export default function Login() {
  const navigate = useNavigate()

  const [role, setRole] = useState("student") 
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mode, setMode] = useState("signin")
  const [loading, setLoading] = useState(false)

  const handleEmailAuth = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      alert("Please enter both email and password")
      return
    }
    setLoading(true)
    try {
      if (mode === "signin") {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        
        const userRole = data.user.user_metadata?.role;
        
        if (userRole === "organization" || userRole === "organizer") {
          navigate("/org/dashboard", { replace: true })
        } else {
          navigate("/student/dashboard", { replace: true })
        }
        return
      }

      // --- SIGN UP LOGIC ---
      const { data, error } = await supabase.auth.signUp({
          email, 
          password,
          options: { 
            emailRedirectTo: window.location.origin + "/login",
            data: { 
              role: role === "organization" ? "organizer" : "student" 
            }
          },
      })
      if (error) throw error
      
      if (data.user) {
        await supabase.from("user_profiles").insert({
            id: data.user.id, 
            email: data.user.email, 
            role: role === "organization" ? "organizer" : "student",
        })
      }
      
      alert("Account created successfully! You can now log in.")
      setMode("signin")
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { 
        redirectTo: window.location.origin + "/auth/callback",
        data: {
          role: role === "organization" ? "organizer" : "student"
        }
      },
    })
  }

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <div className="grid-bg"></div>
        <div className="left-content">
          <div className="brand">
            <div className="shield">🛡️</div>
            <h2>D-Voting</h2>
          </div>
          <h1>The future of <br /><span>democratic integrity.</span></h1>
          <p className="description">Secure digital voting with verified identity and encrypted records.</p>
        </div>
      </div>

      <div className="login-right">
        <div className="form-box">
          {/* Auth Tabs (Sign In / Sign Up) */}
          <div className="auth-tabs" style={styles.tabContainer}>
            <button
              className={`tab-btn ${mode === "signin" ? "active" : ""}`}
              onClick={() => setMode("signin")}
              style={{ ...styles.tabBtn, background: mode === "signin" ? "#fff" : "transparent", color: mode === "signin" ? "#2563eb" : "#64748b" }}
            > Sign In </button>
            <button
              className={`tab-btn ${mode === "signup" ? "active" : ""}`}
              onClick={() => setMode("signup")}
              style={{ ...styles.tabBtn, background: mode === "signup" ? "#fff" : "transparent", color: mode === "signup" ? "#2563eb" : "#64748b" }}
            > Sign Up </button>
          </div>

          <h2 style={styles.heading}>{mode === "signin" ? "Welcome back" : "Create Account"}</h2>
          <p style={styles.subtitle}>{mode === "signin" ? "Enter your credentials to continue" : "Join the secure voting network"}</p>

          {/* Role Switcher (Student / Organizer) */}
          <div className="role-switch" style={styles.roleSwitch}>
            <div
              className="role-active"
              style={{
                left: role === "student" ? "4px" : "calc(50% - 4px)",
                background: role === "student" ? "#2563eb" : "#4f46e5",
              }}
            />
            <button 
                type="button" 
                onClick={() => setRole("student")} 
                className={role === "student" ? "active-text" : ""}
                style={{ zIndex: 2 }}
            >
                Student
            </button>
            <button 
                type="button" 
                onClick={() => setRole("organization")} 
                className={role === "organization" ? "active-text" : ""}
                style={{ zIndex: 2 }}
            >
                Organizer
            </button>
          </div>

          <form onSubmit={handleEmailAuth}>
            <div className="input-group">
                <label style={styles.label}>Email</label>
                <div className="input-box" style={styles.inputBox}>
                <MailIcon />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@email.com" />
                </div>
            </div>

            <div className="input-group">
                <label style={styles.label}>Password</label>
                <div className="input-box" style={styles.inputBox}>
                <LockIcon />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                </div>
            </div>

            <button type="submit" className="login-btn" disabled={loading} style={styles.loginBtn}>
                {loading ? "Processing..." : mode === "signin" ? "Sign In →" : "Create Account →"}
            </button>
          </form>

          <div className="divider" style={{ margin: '1.5rem 0' }}>OR CONTINUE WITH</div>

          <button className="social-btn" onClick={loginWithGoogle} style={styles.socialBtn}>
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" style={{ width: '18px' }} />
            Google
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  tabContainer: { display: 'flex', marginBottom: '2rem', background: '#f1f5f9', padding: '5px', borderRadius: '12px', position: 'relative' },
  tabBtn: { flex: 1, padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: '0.3s' },
  heading: { fontSize: '1.8rem', color: '#1e293b', marginBottom: '0.5rem', textAlign: 'left' },
  subtitle: { color: '#64748b', marginBottom: '2rem', textAlign: 'left' },
  roleSwitch: { marginBottom: '1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', position: 'relative', display: 'flex', borderRadius: '12px', padding: '4px' },
  label: { fontWeight: '700', color: '#64748b', fontSize: '12px', display: 'block', marginBottom: '8px', textAlign: 'left' },
  inputBox: { borderRadius: '10px', border: '1px solid #e2e8f0', position: 'relative' },
  loginBtn: { borderRadius: '14px', padding: '16px', fontSize: '1rem', background: '#2563eb', marginTop: '1rem', width: '100%', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: '700' },
  socialBtn: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#fff', color: '#1e293b', cursor: 'pointer', fontWeight: '600' }
}