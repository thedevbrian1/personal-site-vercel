import { redirect } from "react-router";
import { createSBClient } from "~/.server/supabase";
import type { Route } from "./+types/logout";
import {
  commitSession,
  getSession,
  setSuccessMessage,
} from "~/.server/session";

export async function action({ request }: Route.ActionArgs) {
  let { supabase, headers } = await createSBClient(request);

  let session = await getSession(request.headers.get("Cookie"));

  let { error } = await supabase.auth.signOut();

  setSuccessMessage(session, "Logged out successfully!");

  let allHeaders = {
    ...Object.fromEntries(headers.entries()),
    "Set-Cookie": await commitSession(session),
  };

  return redirect("/login", { headers: allHeaders });
}
