import { createSBClient } from "~/.server/supabase";

export async function getUserByUserId(request: Request, userId: string) {
  let { supabase } = await createSBClient(request);
  let { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", userId);
  return { user };
}
