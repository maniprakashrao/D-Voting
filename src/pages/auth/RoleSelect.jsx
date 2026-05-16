import { supabase } from "../../services/supabaseClient"

export default function RoleSelect() {

  const chooseRole = async role => {
    const { data } = await supabase.auth.getUser()

    await supabase.from("user_roles").insert({
      user_id: data.user.id,
      role
    })

    localStorage.setItem("user_role", role)

    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center px-4">

      <div className="bg-white w-full max-w-md p-10 rounded-xl shadow-xl text-center">

        <h2 className="text-2xl font-bold mb-2 text-indigo-700">
          Choose Your Portal
        </h2>

        <p className="text-gray-600 mb-8">
          Select how you want to continue
        </p>

        <button
          onClick={() => chooseRole("organization")}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg mb-4 transition"
        >
          Organization Portal
        </button>

        <button
          onClick={() => chooseRole("student")}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition"
        >
          Student Portal
        </button>

        <p className="text-xs text-gray-500 mt-6">
          You can change role later by logging out
        </p>

      </div>
    </div>
  )
}
