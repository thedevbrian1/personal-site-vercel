import { redirect } from "react-router";
import { createSBClient } from "~/.server/supabase";
import type { Route } from "./+types/logout";

export async function action({ request }: Route.ActionArgs) {
  let { supabase, headers } = await createSBClient(request);
  let { error } = await supabase.auth.signOut();

  return redirect("/login", { headers });
}
