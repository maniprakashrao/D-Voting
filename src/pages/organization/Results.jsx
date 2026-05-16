import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import OrgLayout from "./OrgLayout";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import confetti from "canvas-confetti";

export default function Results() {
  const { id } = useParams();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasCelebrated, setHasCelebrated] = useState(false);

  useEffect(() => {
    loadData();
    const sub = supabase
      .channel("live-results")
      .on("postgres_changes", { 
        event: "INSERT", 
        schema: "public", 
        table: "votes", 
        filter: `election_id=eq.${id}` 
      }, () => loadData())
      .subscribe();
    return () => supabase.removeChannel(sub);
  }, [id]);

  const loadData = async () => {
    const { data: elect } = await supabase.from("elections").select("*").eq("id", id).single();
    const { data: cand } = await supabase.from("candidates").select("*").eq("election_id", id);
    const { data: vts } = await supabase.from("votes").select("*").eq("election_id", id);
    
    setElection(elect);
    setCandidates(cand || []);
    setVotes(vts || []);
    setLoading(false);
  };

  const getVoteCount = (cid) => votes.filter(v => v.candidate_id === cid).length;
  const now = new Date();
  const isEnded = election ? now > new Date(election.end_time) : false;

  const getWinner = () => {
    if (candidates.length === 0 || votes.length === 0) return null;
    return candidates.reduce((prev, current) => 
      (getVoteCount(prev.id) > getVoteCount(current.id)) ? prev : current
    );
  };

  const winner = isEnded ? getWinner() : null;

  useEffect(() => {
    if (isEnded && !hasCelebrated && votes.length > 0) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#10b981', '#f59e0b']
      });
      setHasCelebrated(true);
    }
  }, [isEnded, votes.length, hasCelebrated]);

  const pieData = candidates.map(c => ({ name: c.name, value: getVoteCount(c.id) }));
  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  if (loading || !election) {
    return (
      <OrgLayout>
        <div style={{ padding: '100px', textAlign: 'center' }}>Loading Results...</div>
      </OrgLayout>
    );
  }

  return (
    <OrgLayout>
      {/* MAIN WRAPPER: Added overflowY: 'auto' to ensure the whole page scrolls */}
      <div style={{ 
        padding: "40px", 
        maxWidth: "1100px", 
        margin: "0 auto", 
        fontFamily: "sans-serif",
        height: "calc(100vh - 40px)", 
        overflowY: "auto" 
      }}>
        
        {/* WINNER BANNER */}
        {isEnded && winner && (
          <div style={cheerContainer}>
            <div style={{ fontSize: '3rem' }}>🏆</div>
            <div style={{ flex: 1, marginLeft: '20px' }}>
              <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '900', color: '#1e1b4b' }}>
                {winner.name.toUpperCase()} WON!
              </h1>
              <p style={{ margin: 0, color: '#4338ca', fontWeight: '600' }}>{winner.position}</p>
            </div>
            <div style={votePill}>{getVoteCount(winner.id)} Total Votes</div>
          </div>
        )}

        {/* CHARTS SECTION */}
        <div style={{ display: 'grid', gridTemplateColumns: isEnded ? '1fr 1fr' : '1fr', gap: '30px' }}>
          <div style={cardStyle}>
            <p style={labelStyle}>Total Participation</p>
            <h2 style={{ fontSize: '4.5rem', fontWeight: '900', color: '#4f46e5', margin: 0 }}>{votes.length}</h2>
            <p style={{ color: '#64748b' }}>Votes synced in real-time</p>
          </div>

          {isEnded && (
            <div style={cardStyle}>
              <h3 style={{ marginBottom: '20px', fontWeight: '800' }}>Vote Distribution</h3>
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={pieData} innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* LIVE STANDINGS TABLE WITH INTERNAL SCROLL */}
        <div style={{ ...cardStyle, marginTop: '30px', padding: 0, overflow: 'hidden' }}>
          <div style={tableHeader}>
            <h3 style={{ margin: 0, fontWeight: '800' }}>Live Standings</h3>
          </div>

          {/* INTERNAL SCROLL: Set a fixed height and enable vertical scroll */}
          <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8fafc', position: 'sticky', top: 0, zIndex: 10 }}>
                <tr>
                  <th style={thStyle}>Candidate & Votes</th>
                  <th style={thStyle}>Position</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map(c => (
                  <tr key={c.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: '700' }}>{c.name}</span>
                        {isEnded && (
                          <span style={inlineVoteBadge}>
                            {getVoteCount(c.id)} votes
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={tdStyle}>{c.position}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      {isEnded ? (
                        winner?.id === c.id ? <span style={winnerBadge}>WINNER</span> : "Finalized"
                      ) : (
                        <span style={{ color: '#cbd5e1' }}>Counting...</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </OrgLayout>
  );
}

// STYLES
const cheerContainer = { background: 'linear-gradient(90deg, #eef2ff 0%, #ffffff 100%)', padding: '25px', borderRadius: '20px', border: '1px solid #c7d2fe', display: 'flex', alignItems: 'center', marginBottom: '30px' };
const votePill = { background: '#4f46e5', color: 'white', padding: '8px 18px', borderRadius: '100px', fontWeight: '800' };
const cardStyle = { background: 'white', padding: '30px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' };
const labelStyle = { textTransform: 'uppercase', color: '#64748b', fontWeight: '800', fontSize: '0.75rem', letterSpacing: '1px' };
const tableHeader = { padding: '20px 30px', borderBottom: '1px solid #f1f5f9', background: '#fff' };
const thStyle = { padding: '15px 30px', textAlign: 'left', color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase' };
const tdStyle = { padding: '15px 30px', color: '#1e293b', fontSize: '0.9rem' };
const inlineVoteBadge = { background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 'bold' };
const winnerBadge = { color: '#4f46e5', fontWeight: '900', fontSize: '0.8rem' };