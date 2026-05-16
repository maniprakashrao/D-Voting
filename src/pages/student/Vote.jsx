import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { useParams, useNavigate } from "react-router-dom";

export default function Vote() {
  const { electionId, uid } = useParams();
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const initializePage = async () => {
      setLoading(true);
      await checkIfVoted();
      await loadCandidates();
      setLoading(false);
    };
    initializePage();
  }, [electionId, uid]);

  const checkIfVoted = async () => {
    const { data } = await supabase
      .from("votes")
      .select("id")
      .eq("election_id", electionId)
      .eq("student_uid", uid)
      .single();

    if (data) setHasVoted(true);
  };

  const loadCandidates = async () => {
    const { data } = await supabase
      .from("candidates")
      .select("*")
      .eq("election_id", electionId);

    setCandidates(data || []);
  };

  const submitVote = async () => {
    if (!selected) return;

    const confirmVote = window.confirm(
      "⚠ Final Confirmation\n\nYou can only vote once. Are you sure?"
    );

    if (!confirmVote) return;

    const { error } = await supabase.from("votes").insert({
      election_id: electionId,
      candidate_id: selected,
      student_uid: uid
    });

    if (error) {
      alert("Error: You have already voted in this election.");
      navigate("/student/enter");
      return;
    }

    navigate("/student/success");
  };

  if (loading) return <div style={styles.loader}>Verifying ballot access...</div>;

  if (hasVoted) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={{ fontSize: "50px" }}>🚫</div>
          <h2 style={{ fontSize: "24px", margin: "20px 0" }}>Already Voted</h2>
          <p style={{ color: "#64748b", marginBottom: "30px" }}>
            UID <strong>{uid}</strong> has already participated in this election.
          </p>
          <button onClick={() => navigate("/student/enter")} style={styles.primaryBtn}>
            Return to Portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.ballotBox}>
        <div style={styles.header}>
          <span style={styles.badge}>Official Ballot</span>
          <h2 style={styles.title}>Make Your Choice</h2>
          <p style={styles.uidLabel}>Student ID: <span style={{color: '#4f46e5', fontWeight: 'bold'}}>{uid}</span></p>
        </div>

        <div style={styles.list}>
          {candidates.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelected(c.id)}
              style={{
                ...styles.candidateCard,
                borderColor: selected === c.id ? "#4f46e5" : "#e2e8f0",
                backgroundColor: selected === c.id ? "#f5f3ff" : "white",
              }}
            >
              <div style={styles.avatar}>
                {c.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={styles.candName}>{c.name}</h3>
                <p style={styles.candPos}>{c.position}</p>
              </div>
              <div style={{
                ...styles.radio,
                backgroundColor: selected === c.id ? "#4f46e5" : "transparent",
                borderColor: selected === c.id ? "#4f46e5" : "#cbd5e1"
              }}>
                {selected === c.id && <div style={styles.radioInner} />}
              </div>
            </div>
          ))}
        </div>

        <button
          disabled={!selected}
          onClick={submitVote}
          style={{
            ...styles.submitBtn,
            backgroundColor: selected ? "#4f46e5" : "#cbd5e1",
            cursor: selected ? "pointer" : "not-allowed"
          }}
        >
          Confirm My Selection
        </button>
        <p style={styles.footerNote}>Your choice is final and cannot be altered after submission.</p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", backgroundColor: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "sans-serif" },
  ballotBox: { backgroundColor: "white", width: "100%", maxWidth: "500px", borderRadius: "24px", padding: "40px", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" },
  header: { textAlign: "center", marginBottom: "30px" },
  badge: { backgroundColor: "#eef2ff", color: "#4338ca", padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" },
  title: { fontSize: "28px", fontWeight: "800", color: "#1e293b", margin: "15px 0 5px 0" },
  uidLabel: { color: "#64748b", fontSize: "14px" },
  list: { display: "flex", flexDirection: "column", gap: "15px" },
  candidateCard: { display: "flex", alignItems: "center", padding: "18px", borderRadius: "16px", border: "2px solid", cursor: "pointer", transition: "0.2s" },
  avatar: { width: "45px", height: "45px", backgroundColor: "#f1f5f9", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginRight: "15px", fontWeight: "bold", color: "#475569" },
  candName: { margin: 0, fontSize: "18px", color: "#1e293b", fontWeight: "700" },
  candPos: { margin: 0, fontSize: "13px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" },
  radio: { width: "22px", height: "22px", borderRadius: "50%", border: "2px solid", display: "flex", alignItems: "center", justifyContent: "center" },
  radioInner: { width: "8px", height: "8px", backgroundColor: "white", borderRadius: "50%" },
  submitBtn: { width: "100%", marginTop: "30px", padding: "16px", borderRadius: "12px", color: "white", border: "none", fontSize: "16px", fontWeight: "bold", transition: "0.2s" },
  primaryBtn: { width: "100%", padding: "12px", backgroundColor: "#1e293b", color: "white", borderRadius: "10px", border: "none", fontWeight: "bold", cursor: "pointer" },
  footerNote: { textAlign: "center", color: "#94a3b8", fontSize: "12px", marginTop: "15px" },
  loader: { height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }
};