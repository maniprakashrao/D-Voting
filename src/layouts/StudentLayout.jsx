import { Outlet } from "react-router-dom";
import StudentSidebar from "../components/StudentSidebar"; // Adjust path as needed

export default function StudentLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <StudentSidebar />
      <main style={{ flex: 1, marginLeft: "260px", padding: "20px", background: "#f1f5f9" }}>
        <Outlet />
      </main>
    </div>
  );
}