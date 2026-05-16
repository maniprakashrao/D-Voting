import { useState } from "react"
import { supabase } from "../../services/supabaseClient"

export default function JoinElection({ setElection }) {
  const [code,setCode]=useState("")

  const join = async () => {
    const { data } = await supabase
      .from("elections")
      .select("*")
      .eq("election_code", code)
      .single()

    setElection(data)
  }

  return (
    <>
      <input placeholder="Election Code"
        onChange={e=>setCode(e.target.value)} />
      <button onClick={join}>Join</button>
    </>
  )
}
