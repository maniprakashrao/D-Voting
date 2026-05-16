import { Routes, Route, Navigate } from "react-router-dom"

// Auth Pages
import Login from "./pages/auth/Login"
import AuthCallback from "./pages/auth/AuthCallback"

// Organizer Pages
import Dashboard from "./pages/organization/Dashboard"
import CreateElection from "./pages/organization/CreateElection"
import AddCandidates from "./pages/organization/AddCandidates" 
import ResultsList from "./pages/organization/ResultsList"
import Results from "./pages/organization/Results"

// Student Pages
import EnterElection from "./pages/student/EnterElection"
import VerifyStudent from "./pages/student/VerifyStudent"
import Vote from "./pages/student/Vote" 
import Success from "./pages/student/Success" // Added this import

import ProtectedRoute from "./components/ProtectedRoute"

export default function App() {
  return (
    <Routes>
      {/* 1. DEFAULT REDIRECT */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* 2. PUBLIC AUTH ROUTES */}
      <Route path="/login" element={<Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* 3. ORGANIZER ROUTES (PROTECTED) */}
      <Route path="/org">
        <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="create-election" element={<ProtectedRoute><CreateElection /></ProtectedRoute>} />
        <Route path="results-list" element={<ProtectedRoute><ResultsList /></ProtectedRoute>} />
        <Route path="add-candidates/:id" element={<ProtectedRoute><AddCandidates /></ProtectedRoute>} />
        <Route path="results/:id" element={<ProtectedRoute><Results /></ProtectedRoute>} />
      </Route>

      {/* 4. STUDENT ROUTES (PROTECTED) */}
      <Route path="/student">
        <Route path="enter" element={<ProtectedRoute><EnterElection /></ProtectedRoute>} />
        
        {/* Verification page using :id for electionId */}
        <Route path="verify/:id" element={<ProtectedRoute><VerifyStudent /></ProtectedRoute>} />
        
        {/* Voting page using :electionId and :uid to match Vote.jsx params */}
        <Route path="vote/:electionId/:uid" element={<ProtectedRoute><Vote /></ProtectedRoute>} />

        {/* Success page added here */}
        <Route path="success" element={<ProtectedRoute><Success /></ProtectedRoute>} />
      </Route>

      {/* 5. CATCH-ALL 404 PAGE */}
      <Route 
        path="*" 
        element={
          <div style={{ padding: "100px 20px", textAlign: "center", fontFamily: "sans-serif" }}>
            <h1 style={{ fontSize: "4rem", fontWeight: "900", color: "#1e293b", margin: 0 }}>404</h1>
            <p style={{ color: "#64748b", fontSize: "1.2rem" }}>The page you're looking for doesn't exist.</p>
            <button 
              onClick={() => window.location.href = "/"} 
              style={{ 
                marginTop: "24px", 
                padding: "12px 24px", 
                backgroundColor: "#4f46e5", 
                color: "white", 
                border: "none", 
                borderRadius: "8px", 
                fontWeight: "600",
                cursor: "pointer" 
              }}
            >
              Back to Safety
            </button>
          </div>
        } 
      />
    </Routes>
  )
}