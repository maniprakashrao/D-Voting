import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../services/supabaseClient"
import OrgLayout from "./OrgLayout"

export default function CreateElection() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", section: "", description: "", start: "", end: "" });
  const [loading, setLoading] = useState(false);

  const createElection = async () => {
    if (!form.title || !form.section || !form.start || !form.end) return alert("Fill all fields");
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Get Org ID using your column 'email'
      const { data: org, error: orgError } = await supabase
        .from("organizations")
        .select("id")
        .eq("email", user.email)
        .single();

      if (orgError || !org) throw new Error("Please run the SQL script to create your Organization profile first.");

      const { data, error } = await supabase
        .from("elections")
        .insert({
          title: form.title,
          section: form.section,
          description: form.description,
          start_time: new Date(form.start).toISOString(),
          end_time: new Date(form.end).toISOString(),
          election_code: "VOTE-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
          organization_id: org.id
        })
        .select().single();

      if (error) throw error;
      navigate(`/org/add-candidates/${data.id}`);

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <OrgLayout>
      <div style={{ padding: "60px 80px", maxWidth: "900px" }}>
        <h1>Create Election</h1>
        <div style={{ background: "white", padding: "40px", borderRadius: "24px", border: "1px solid #e2e8f0" }}>
          <label>Election Title</label>
          <input style={inputStyle} onChange={e => setForm({...form, title: e.target.value})} />
          <label>Section</label>
          <input style={inputStyle} onChange={e => setForm({...form, section: e.target.value})} />
          <div style={{ display: "flex", gap: "20px" }}>
            <input type="datetime-local" style={inputStyle} onChange={e => setForm({...form, start: e.target.value})} />
            <input type="datetime-local" style={inputStyle} onChange={e => setForm({...form, end: e.target.value})} />
          </div>
          <button onClick={createElection} disabled={loading} style={btnPrimary}>
            {loading ? "Processing..." : "Continue to Add Candidates"}
          </button>
        </div>
      </div>
    </OrgLayout>
  )
}
const inputStyle = { width: "100%", padding: "14px", borderRadius: "12px", border: "1.5px solid #e2e8f0", marginBottom: "20px" };
const btnPrimary = { width: "100%", background: "#2563eb", color: "white", padding: "16px", borderRadius: "12px", border: "none", fontWeight: "800", cursor: "pointer" };