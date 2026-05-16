import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../services/supabaseClient"

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const finishOAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return navigate("/login")

      const user = session.user

      const role =
        localStorage.getItem("oauth_role") || "student"
      const mode =
        localStorage.getItem("oauth_mode") || "signin"

      const { data: profile } = await supabase
        .from("user_profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      // SIGN UP WITH GOOGLE
      if (!profile && mode === "signup") {
        await supabase.from("user_profiles").insert({
          id: user.id,
          email: user.email,
          role,
        })

        cleanup()
        redirect(role)
        return
      }

      // SIGN IN WITH GOOGLE
      if (profile) {
        cleanup()
        redirect(profile.role)
        return
      }

      alert("Account not found. Please sign up.")
      cleanup()
      navigate("/login")
    }

    const redirect = (r) => {
      if (r === "organization") {
        navigate("/org/dashboard", { replace: true })
      } else {
        navigate("/student/enter", { replace: true })
      }
    }

    const cleanup = () => {
      localStorage.removeItem("oauth_role")
      localStorage.removeItem("oauth_mode")
    }

    finishOAuth()
  }, [navigate])

  return <p style={{ textAlign: "center", marginTop: 120 }}>Authenticating…</p>
}
