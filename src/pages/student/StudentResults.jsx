import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";

export default function StudentResults() {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWinners();
  }, []);

  async function fetchWinners() {
    // 1. Fetch all completed elections
    const { data: elections } = await supabase
      .from("elections")
      .select("*")
      .eq("status", "completed");

    if (!elections) return setLoading(false);

    const winnersList = [];

    for (const election of elections) {
      // 2. Fetch candidates and their vote counts
      const { data: candidates } = await supabase
        .from("candidates")
        .select("*, votes(count)")
        .eq("election_id", election.id);

      if (candidates && candidates.length > 0) {
        // 3. Find candidate with maximum votes
        const winner = candidates.reduce((prev, current) => 
          (prev.votes?.[0]?.count > current.votes?.[0]?.count) ? prev : current
        );

        winnersList.push({
          electionTitle: election.title,
          electionCode: election.election_code,
          ...winner
        });
      }
    }

    setWinners(winnersList);
    setLoading(false);
  }

  if (loading) return <div style={{padding: '50px', textAlign: 'center'}}>Calculating Results...</div>;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>🏆 Election Winners</h1>
      <p style={styles.subtitle}>View the winners of concluded elections.</p>

      <div style={styles.grid}>
        {winners.map((w, idx) => (
          <div key={idx} style={styles.card}>
            <div style={styles.winnerBadge}>WINNER</div>
            <h3>{w.name}</h3>
            <p style={styles.pos}>{w.position}</p>
            <hr style={styles.hr} />
            <p style={styles.electionInfo}>Election: <strong>{w.electionTitle}</strong></p>
            <p style={styles.electionInfo}>Code: <code>{w.electionCode}</code></p>
            <div style={styles.voteCount}>{w.votes[0].count} Votes Received</div>
          </div>
        ))}
      </div>
      {winners.length === 0 && <p style={{textAlign: 'center', color: '#64748b'}}>No results available yet.</p>}
    </div>
  );
}

const styles = {
  page: { padding: '40px', background: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' },
  title: { fontWeight: '900', color: '#1e293b', marginBottom: '10px' },
  subtitle: { color: '#64748b', marginBottom: '40px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  card: { background: 'white', padding: '30px', borderRadius: '20px', border: '1px solid #e2e8f0', position: 'relative', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
  winnerBadge: { position: 'absolute', top: '15px', right: '15px', background: '#fbbf24', color: '#78350f', fontSize: '0.7rem', fontWeight: 'bold', padding: '4px 10px', borderRadius: '5px' },
  pos: { color: '#4f46e5', fontWeight: 'bold', margin: '5px 0' },
  hr: { border: 'none', borderTop: '1px solid #f1f5f9', margin: '15px 0' },
  electionInfo: { fontSize: '0.9rem', color: '#64748b', margin: '5px 0' },
  voteCount: { marginTop: '15px', background: '#f0fdf4', color: '#166534', padding: '8px', borderRadius: '10px', textAlign: 'center', fontWeight: 'bold', fontSize: '0.9rem' }
};