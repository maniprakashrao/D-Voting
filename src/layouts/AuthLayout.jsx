export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-indigo-800 flex justify-center items-center px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg">
        {children}
      </div>
    </div>
  )
}
