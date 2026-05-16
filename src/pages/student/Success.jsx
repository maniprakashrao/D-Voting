import { useNavigate } from "react-router-dom";

export default function Success() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.icon}>✅</div>
        <h1 style={styles.title}>Vote Submitted!</h1>
        <p style={styles.text}>
          Thank you for participating. Your vote has been securely recorded in the system.
        </p>
        <button 
          onClick={() => navigate("/student/enter")} 
          style={styles.button}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0fdf4' },
  card: { background: 'white', padding: '50px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', textAlign: 'center', maxWidth: '400px' },
  icon: { fontSize: '60px', marginBottom: '20px' },
  title: { fontSize: '24px', fontWeight: '800', color: '#16a34a', marginBottom: '10px' },
  text: { color: '#64748b', lineHeight: '1.6', marginBottom: '30px' },
  button: { width: '100%', padding: '14px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }
};