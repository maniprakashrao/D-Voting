import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import OrgLayout from "./OrgLayout";

export default function ResultsList() {
  const navigate = useNavigate();
  const [completedElections, setCompletedElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompleted();
  }, []);

  const fetchCompleted = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Get Org ID
    const { data: org } = await supabase.from("organizations").select("id").eq("email", user.email).single();

    if (org) {
      const { data: elections } = await supabase
        .from("elections")
        .select("*")
        .eq("organization_id", org.id)
        .lt("end_time", new Date().toISOString()) // Only get elections where end_time is less than now
        .order("end_time", { ascending: false });

      setCompletedElections(elections || []);
    }
    setLoading(false);
  };

  return (
    <OrgLayout>
      <div style={{ padding: '60px 80px', maxWidth: '1200px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '10px' }}>Election Results</h1>
        <p style={{ color: '#64748b', marginBottom: '40px' }}>View final standings and winner data for completed sessions.</p>

        {loading ? <p>Loading...</p> : (
          <div>
            {completedElections.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', background: 'white', borderRadius: '20px', border: '2px dashed #e2e8f0' }}>
                No completed elections found yet.
              </div>
            ) : (
              completedElections.map((e) => (
                <div key={e.id} style={cardStyle}>
                  <div>
                    <h3 style={{ margin: 0, fontWeight: "800" }}>{e.title}</h3>
                    <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0" }}>Ended on: {new Date(e.end_time).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => navigate("/org/results/" + e.id)} style={btnView}>
                    View Final Results 🏆
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </OrgLayout>
  );
}

const cardStyle = { background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #eef2f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' };
const btnView = { padding: '12px 24px', borderRadius: '10px', background: '#4f46e5', color: 'white', fontWeight: '700', border: 'none', cursor: 'pointer' };