import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { supabase } from "../../services/supabaseClient"

export default function VerifyStudent() {
  const { id } = useParams() // Election ID from URL
  const navigate = useNavigate()
  const [uid, setUid] = useState("")
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState({ show: false, message: "", type: "error" })

  const proceed = async () => {
    // 1. Basic validation
    if (!uid || uid.trim().length < 3) {
      setModal({ show: true, message: "Please enter your Student Roll Number.", type: "error" })
      return
    }

    setLoading(true)
    const cleanUid = uid.trim().toUpperCase()

    try {
      // 2. CHECK SQL TABLE: Has this student voted?
      const { data: existingVote, error } = await supabase
        .from("votes")
        .select("id")
        .eq("election_id", id)
        .eq("student_uid", cleanUid)
        .single()

      // 3. IF VOTE EXISTS: Show Access Denied Modal
      if (existingVote) {
        setModal({ 
          show: true, 
          message: `UID ${cleanUid} has already cast a vote in this election. You cannot vote twice.`, 
          type: "denied" 
        })
        setLoading(false)
        return
      }

      // 4. SUCCESS: No previous vote found, go to ballot
      navigate(`/student/vote/${id}/${cleanUid}`)

    } catch (err) {
      // If no row is found, it throws an error code 'PGRST116'. We ignore this as it means they CAN vote.
      if (err.code === 'PGRST116' || !err) {
         navigate(`/student/vote/${id}/${cleanUid}`)
      } else {
        setModal({ show: true, message: "Error connecting to database. Try again.", type: "error" })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      {/* LEFT SIDE: RULES */}
      <div style={styles.left}>
        <div style={styles.badge}>Step 2: ID Verification</div>
        <h1 style={styles.title}>Identification</h1>
        <p style={styles.subtitle}>Our system ensures integrity by verifying your ID against the election records.</p>
        
        <div style={styles.guideContainer}>
          <div style={styles.guideItem}>
            <span style={styles.icon}>🔒</span>
            <div>
              <h4 style={styles.itemTitle}>One-Vote Policy</h4>
              <p style={styles.itemText}>Once your UID is logged, you cannot re-enter the voting portal.</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: INPUT */}
      <div style={styles.right}>
        <div style={styles.card}>
          <div style={styles.cardIcon}>👤</div>
          <h2 style={{ fontWeight: '800', marginBottom: '10px' }}>Enter Student ID</h2>
          <p style={{ color: '#64748b', marginBottom: '30px' }}>Provide your unique Roll Number</p>
          
          <input 
            style={styles.input} 
            placeholder="e.g. 24H51A66ED" 
            value={uid}
            disabled={loading}
            onChange={(e) => setUid(e.target.value.toUpperCase())}
          />

          <button 
            onClick={proceed} 
            disabled={loading} 
            style={{...styles.btn, opacity: loading ? 0.7 : 1}}
          >
            {loading ? "Verifying..." : "Verify & Start Voting"}
          </button>
        </div>
      </div>

      {/* MODAL SYSTEM */}
      {modal.show && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={{fontSize: '3rem', marginBottom: '10px'}}>
              {modal.type === "denied" ? "🚫" : "🛑"}
            </div>
            <h3>{modal.type === "denied" ? "Already Voted" : "Error"}</h3>
            <p style={{color: '#64748b', margin: '15px 0'}}>{modal.message}</p>
            <button 
              onClick={() => {
                setModal({ ...modal, show: false });
                if (modal.type === "denied") navigate("/student/enter");
              }} 
              style={styles.closeBtn}
            >
              {modal.type === "denied" ? "Return Home" : "Go Back"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { display: 'flex', height: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' },
  left: { flex: 1.2, padding: '80px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'white' },
  right: { flex: 0.8, display: 'flex', alignItems: 'center', justifyContent: 'center', borderLeft: '1px solid #e2e8f0' },
  badge: { background: '#fef3c7', color: '#92400e', padding: '6px 14px', borderRadius: '100px', fontSize: '13px', fontWeight: 'bold', width: 'fit-content', marginBottom: '20px' },
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
}