import { useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function EnterElection() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ show: false, message: "" });
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (!code) return setModal({ show: true, message: "Please enter the election code." });
    setLoading(true);

    // Fetch election by code from database
    const { data, error } = await supabase
      .from("elections")
      .select("*")
      .eq("election_code", code.trim().toUpperCase())
      .single();

    if (error || !data) {
      setModal({ show: true, message: "Invalid Code: No election found with this ID." });
      setLoading(false);
      return;
    }

    // Time validation
    const now = new Date();
    if (now < new Date(data.start_time) || now > new Date(data.end_time)) {
      setModal({ show: true, message: "Access Denied: This election is not currently active." });
      setLoading(false);
      return;
    }

    navigate(`/student/verify/${data.id}`);
  };

  return (
    <div style={styles.container}>
      {/* LEFT SIDE: GUIDELINES SECTION */}
      <div style={styles.left}>
        <div style={styles.badge}>Student Portal</div>
        <h1 style={styles.title}>Digital Voting Guidelines</h1>
        <p style={styles.subtitle}>Please follow these rules to ensure a fair and secure election.</p>
        
        <div style={styles.guideContainer}>
          <div style={styles.guideItem}>
            <span style={styles.icon}>🔒</span>
            <div>
              <h4 style={styles.itemTitle}>Anonymity Guaranteed</h4>
              <p style={styles.itemText}>Your personal identity is decoupled from your vote choice.</p>
            </div>
          </div>
          <div style={styles.guideItem}>
            <span style={styles.icon}>👤</span>
            <div>
              <h4 style={styles.itemTitle}>One Vote Per Student</h4>
              <p style={styles.itemText}>The system prevents double-voting by tracking your unique ID.</p>
            </div>
          </div>
          <div style={styles.guideItem}>
            <span style={styles.icon}>⚖️</span>
            <div>
              <h4 style={styles.itemTitle}>Final Submission</h4>
              <p style={styles.itemText}>Once you confirm your ballot, it cannot be changed or retracted.</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: ENTRY SECTION */}
      <div style={styles.right}>
        <div style={styles.card}>
          <div style={styles.cardIcon}>🗳️</div>
          <h2 style={{ fontWeight: '800', marginBottom: '10px' }}>Join Election</h2>
          <p style={{ color: '#64748b', marginBottom: '30px' }}>Enter the unique code provided to you.</p>
          
          <input 
            style={styles.input} 
            placeholder="VOTE-XXXX" 
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
          />

          <button onClick={handleVerify} disabled={loading} style={styles.btn}>
            {loading ? "Verifying..." : "Continue to Ballot"}
          </button>
        </div>
      </div>

      {/* POP-UP MODAL (The custom alert) */}
      {modal.show && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={{fontSize: '3rem', marginBottom: '10px'}}>⚠️</div>
            <h3 style={{margin: 0}}>Election Alert</h3>
            <p style={{color: '#64748b', margin: '15px 0'}}>{modal.message}</p>
            <button 
              onClick={() => setModal({ ...modal, show: false })} 
              style={styles.closeBtn}
            >
              Understand
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { display: 'flex', height: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' },
  left: { flex: 1.2, padding: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'white' },
  right: { flex: 0.8, display: 'flex', alignItems: 'center', justifyContent: 'center', borderLeft: '1px solid #e2e8f0' },
  badge: { background: '#e0e7ff', color: '#4338ca', padding: '6px 14px', borderRadius: '100px', fontSize: '13px', fontWeight: 'bold', width: 'fit-content', marginBottom: '20px' },
  title: { fontSize: '3.5rem', fontWeight: '900', color: '#0f172a', margin: '0 0 10px 0' },
  subtitle: { fontSize: '1.1rem', color: '#64748b', marginBottom: '50px' },
  guideContainer: { display: 'flex', flexDirection: 'column', gap: '25px' },
  guideItem: { display: 'flex', gap: '20px', alignItems: 'flex-start' },
  icon: { fontSize: '1.5rem', background: '#f1f5f9', padding: '10px', borderRadius: '12px' },
  itemTitle: { margin: '0 0 5px 0', fontWeight: '800', color: '#1e293b' },
  itemText: { margin: 0, color: '#64748b', fontSize: '0.95rem' },
  card: { width: '85%', maxWidth: '420px', textAlign: 'center', padding: '40px', background: 'white' },
  cardIcon: { fontSize: '3rem', marginBottom: '20px' },
  input: { width: '100%', padding: '20px', fontSize: '1.5rem', textAlign: 'center', borderRadius: '15px', border: '2px solid #e2e8f0', marginBottom: '25px', fontWeight: 'bold', outlineColor: '#4f46e5' },
  btn: { width: '100%', padding: '20px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { background: 'white', padding: '40px', borderRadius: '30px', textAlign: 'center', width: '90%', maxWidth: '400px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' },
  closeBtn: { background: '#1e293b', color: 'white', padding: '12px 30px', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }
};