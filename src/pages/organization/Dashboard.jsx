import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../services/supabaseClient"
import OrgLayout from "./OrgLayout"

export default function Dashboard() {
  const navigate = useNavigate()
  const [past, setPast] = useState([])
  const [active, setActive] = useState([])
  const [upcoming, setUpcoming] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadElections()
  }, [])

  const loadElections = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Step 1: Get Org ID
      const { data: org } = await supabase
        .from("organizations")
        .select("id")
        .eq("email", user.email)
        .single()

      if (org) {
        // Step 2: Fetch elections linked to this Org
        const { data: elections } = await supabase
          .from("elections")
          .select("*")
          .eq("organization_id", org.id)
          .order('created_at', { ascending: false })

        const now = new Date()
        const p = [], a = [], u = []

        elections?.forEach(e => {
          const start = new Date(e.start_time);
          const end = new Date(e.end_time);
          if (now < start) u.push(e); // Upcoming
          else if (now > end) p.push(e); // Past
          else a.push(e); // Live
        })

        setPast(p); setActive(a); setUpcoming(u);
      }
    } catch (err) {
      console.error("Integration Error:", err)
    } finally {
      setLoading(false)
    }
  }

  const renderCard = (e, status) => {
    const color = status === 'active' ? '#10b981' : (status === 'upcoming' ? '#3b82f6' : '#94a3b8')
    return (
      <div key={e.id} style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '4px', height: '44px', background: color, borderRadius: '10px' }}></div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>{e.title}</h3>
            <span style={{ fontSize: '12px', color: '#64748b' }}>CODE: {e.election_code} | {e.section}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate("/org/results/" + e.id)} style={btnResults}>
            {status === 'past' ? 'View Results' : 'Stats'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <OrgLayout>
      <div style={pageWrapper}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontWeight: '900', fontSize: '2.5rem' }}>Dashboard</h1>
            <button onClick={() => navigate("/org/create-election")} style={btnCreate}>+ New Election</button>
          </div>

          {loading ? <p>Syncing Database...</p> : (
            <>
              <div style={statsGrid}>
                <StatBox label="Scheduled" count={upcoming.length} />
                <StatBox label="Live Now" count={active.length} />
                <StatBox label="Completed" count={past.length} />
              </div>

              <section style={sectionStyle}>
                <h2 style={sectionHeader}>Live Elections</h2>
                {active.length === 0 ? <EmptyState text="No live elections." /> : active.map(e => renderCard(e, 'active'))}
              </section>

              <section style={sectionStyle}>
                <h2 style={sectionHeader}>Scheduled</h2>
                {upcoming.length === 0 ? <EmptyState text="No scheduled elections." /> : upcoming.map(e => renderCard(e, 'upcoming'))}
              </section>

              <section style={sectionStyle}>
                <h2 style={sectionHeader}>History</h2>
                {past.length === 0 ? <EmptyState text="No history found." /> : past.map(e => renderCard(e, 'past'))}
              </section>
            </>
          )}
        </div>
      </div>
    </OrgLayout>
  )
}

// STYLES
const pageWrapper = { height: '100vh', overflowY: 'auto', padding: '40px 60px', backgroundColor: '#f8fafc' };
const statsGrid = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '50px' };
const sectionStyle = { marginBottom: '40px' };
const cardStyle = { background: 'white', padding: '24px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', marginBottom: '16px', border: '1px solid #eef2f6' };
const btnResults = { padding: '10px 20px', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', fontWeight: '700', cursor: 'pointer' };
const btnCreate = { background: '#2563eb', color: 'white', padding: '14px 28px', borderRadius: '12px', border: 'none', fontWeight: '800', cursor: 'pointer' };
const sectionHeader = { fontSize: '0.8rem', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', marginBottom: '15px' };
const StatBox = ({ label, count }) => (
  <div style={{ background: 'white', padding: '30px', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
    <div style={{ fontSize: '2.5rem', fontWeight: '900' }}>{count}</div>
    <div style={{ color: '#94a3b8', fontWeight: '700' }}>{label}</div>
  </div>
);
const EmptyState = ({ text }) => <div style={{ padding: '20px', color: '#94a3b8', border: '1px dashed #e2e8f0', borderRadius: '12px', textAlign: 'center' }}>{text}</div>;