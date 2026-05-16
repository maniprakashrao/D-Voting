import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import OrgLayout from "./OrgLayout";

export default function AddCandidates() {
  const { id } = useParams(); // This gets the ID from the URL
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [description, setDescription] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true); // Start as true
  const [btnLoading, setBtnLoading] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchInitialData();
    }
  }, [id]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Election Details
      const { data: electData, error: electError } = await supabase
        .from("elections")
        .select("*")
        .eq("id", id)
        .single();
      
      if (electError) throw electError;
      setElection(electData);

      // 2. Fetch Existing Candidates
      const { data: candData, error: candError } = await supabase
        .from("candidates")
        .select("*")
        .eq("election_id", id)
        .order("created_at", { ascending: true });

      if (candError) throw candError;
      setCandidates(candData || []);

    } catch (err) {
      console.error("Error loading page:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const addCandidate = async () => {
    if (!name || !position) return alert("Name and position required");
    setBtnLoading(true);
    const { data, error } = await supabase
      .from("candidates")
      .insert({ election_id: id, name, position, description: description || null })
      .select().single();

    if (!error) {
      setCandidates(prev => [...prev, data]);
      setName(""); setPosition(""); setDescription("");
    }
    setBtnLoading(false);
  };

  // Prevent white screen if still loading
  if (loading) {
    return (
      <OrgLayout>
        <div style={{ padding: "100px", textAlign: "center" }}>
          <h2>Loading Election Details...</h2>
        </div>
      </OrgLayout>
    );
  }

  return (
    <OrgLayout>
      <div style={{ padding: "60px 80px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "40px" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "900" }}>Add Candidates</h1>
          <p>Election: <span style={{ color: "#2563eb", fontWeight: "700" }}>{election?.title}</span></p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "400px 1fr", gap: "40px" }}>
          {/* FORM CARD */}
          <div style={cardStyle}>
            <h2 style={{ marginBottom: "20px" }}>New Candidate</h2>
            <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" />
            <input style={inputStyle} value={position} onChange={e => setPosition(e.target.value)} placeholder="Position" />
            <button onClick={addCandidate} disabled={btnLoading} style={btnPrimary}>
              {btnLoading ? "Saving..." : "Add Candidate"}
            </button>
          </div>

          {/* CANDIDATES LIST */}
          <div style={cardStyle}>
             {candidates.length === 0 ? <p>No candidates added yet.</p> : (
               candidates.map(c => (
                 <div key={c.id} style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                   <strong>{c.name}</strong> - {c.position}
                 </div>
               ))
             )}
             <button onClick={() => setShowCodeModal(true)} style={btnSuccess}>Finish Setup</button>
          </div>
        </div>
      </div>

      {showCodeModal && (
        <div style={modalOverlay}>
          <div style={modalContent}>
             <h2>Election Code</h2>
             <div style={codeBox}>{election?.election_code}</div>
             <button onClick={() => navigate("/org/dashboard")} style={btnPrimary}>Go to Dashboard</button>
          </div>
        </div>
      )}
    </OrgLayout>
  );
}

// Styles (Ensure these match your previous designs)
const cardStyle = { background: "white", padding: "30px", borderRadius: "20px", border: "1px solid #e2e8f0" };
const inputStyle = { width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "15px" };
const btnPrimary = { background: "#2563eb", color: "white", padding: "14px", borderRadius: "10px", width: "100%", cursor: "pointer", border: "none", fontWeight: "bold" };
const btnSuccess = { background: "#10b981", color: "white", padding: "14px", borderRadius: "10px", width: "100%", cursor: "pointer", border: "none", marginTop: "20px" };
const modalOverlay = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" };
const modalContent = { background: "white", padding: "40px", borderRadius: "24px", textAlign: "center" };
const codeBox = { background: "#f1f5f9", padding: "20px", fontSize: "2rem", fontWeight: "bold", margin: "20px 0" };