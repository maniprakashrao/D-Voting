import { supabase } from "./supabaseClient"

export const createElection = async ({
  title,
  section,
  startTime,
  endTime
}) => {

  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user

  // get organization id
  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("email", user.email)
    .single()

  const electionCode =
    "ELEC-" + Math.random().toString(36).substring(2, 8).toUpperCase()

  return await supabase.from("elections").insert({
    organization_id: org.id,
    title,
    section,
    election_code: electionCode,
    start_time: startTime,
    end_time: endTime
  })
}
