import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [activeElections, setActiveElections] = useState([]);
  const [pastWinners, setPastWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    // 1. Fetch Active Elections
    const { data: active } = await supabase
      .from("elections")
      .select("*")
      .eq("status", "active");

    // 2. Fetch Completed Elections to find Winners
    const { data: completed } = await supabase
      .from("elections")
      .select("*")
      .eq("status", "completed")
      .limit(3); // Show only top 3 recent results

    const winnerData = [];
    if (completed) {
      for (const election of completed) {
        const { data: candidates } = await supabase
          .from("candidates")
          .select("*, votes(count)")
          .eq("election_id", election.id);
        
        if (candidates && candidates.length > 0) {
          const winner = candidates.reduce((prev, curr) => 
            (prev.votes[0].count > curr.votes[0].count) ? prev : curr
          );
          winnerData.push({ ...winner, electionTitle: election.title, code: election.election_code });
        }
      }
    }

    setActiveElections(active || []);
    setPastWinners(winnerData);
    setLoading(false);
  }

  return (
    <div style={styles.container}>
      {/* SECTION 1: SIDEBAR NAVIGATION */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>D-VOTING</div>
        <nav style={styles.nav}>
          <div style={styles.navItemActive}>📊 Dashboard</div>
          <div style={styles.navItem} onClick={() => navigate("/student/enter")}>🗳️ Cast Vote</div>
          <div style={styles.navItem} onClick={() => navigate("/student/results")}>🏆 All Results</div>
        </nav>
      </aside>

      <main style={styles.main}>
        {/* SECTION 2: WELCOME HEADER */}
        <header style={styles.header}>
          <h1>Student Dashboard</h1>
          <p>Welcome to your central voting hub.</p>
        </header>

        {/* SECTION 3: ACTIVE ELECTIONS (VOTING AREA) */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>🔥 Live Elections</h2>
          <div style={styles.grid}>
            {activeElections.map(el => (
              <div key={el.id} style={styles.card}>
                <span style={styles.liveBadge}>LIVE</span>
                <h3>{el.title}</h3>
                <p>Code: <strong>{el.election_code}</strong></p>
                <button onClick={() => navigate("/student/enter")} style={styles.voteBtn}>
                  Vote Now
                </button>
              </div>
            ))}
            {activeElections.length === 0 && <p>No active elections at the moment.</p>}
          </div>
        </section>

        {/* SECTION 4: RECENT WINNERS (RESULTS PREVIEW) */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>🎉 Recent Winners</h2>
          <div style={styles.grid}>
            {pastWinners.map((win, i) => (
              <div key={i} style={styles.winnerCard}>
                <div style={styles.winnerInfo}>
                  <p style={styles.winnerLabel}>{win.electionTitle}</p>
                  <h4 style={styles.winnerName}>{win.name}</h4>
                  <p style={styles.winnerPos}>{win.position}</p>
                </div>
                <div style={styles.winnerStats}>
                  <span style={styles.voteCount}>{win.votes[0].count} votes</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' },
  sidebar: { width: '250px', background: '#0f172a', color: 'white', padding: '40px 20px' },
  logo: { fontSize: '1.5rem', fontWeight: '900', color: '#6366f1', marginBottom: '50px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '15px' },
  navItem: { padding: '12px', borderRadius: '10px', cursor: 'pointer', color: '#94a3b8', transition: '0.3s' },
  navItemActive: { padding: '12px', borderRadius: '10px', background: '#1e293b', color: 'white', fontWeight: 'bold' },
  main: { flex: 1, padding: '40px' },
  header: { marginBottom: '40px' },
  section: { marginBottom: '50px' },
  sectionTitle: { fontSize: '1.25rem', fontWeight: '800', marginBottom: '20px', color: '#1e293b' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' },
  card: { background: 'white', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', position: 'relative' },
  liveBadge: { position: 'absolute', top: '15px', right: '15px', background: '#ef4444', color: 'white', fontSize: '0.7rem', padding: '4px 8px', borderRadius: '5px', fontWeight: 'bold' },
  voteBtn: { width: '100%', marginTop: '20px', padding: '12px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
  winnerCard: { background: 'white', padding: '20px', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  winnerLabel: { fontSize: '0.75rem', color: '#6366f1', fontWeight: 'bold', margin: 0 },
  winnerName: { fontSize: '1.1rem', margin: '5px 0' },
  winnerPos: { fontSize: '0.85rem', color: '#64748b', margin: 0 },
  winnerStats: { textAlign: 'right' },
  voteCount: { background: '#f0fdf4', color: '#166534', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }
};