import { redirect, type LoaderFunctionArgs } from "react-router";
import { type EmailOtpType } from "@supabase/supabase-js";
import { createSBClient } from "~/.server/supabase";

export async function loader({ request }: LoaderFunctionArgs) {
  const requestUrl = new URL(request.url);
  const token_hash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type") as EmailOtpType | null;
  const next = requestUrl.searchParams.get("next") || "/";
  const headers = new Headers();

  if (token_hash && type) {
    let { supabase } = await createSBClient(request);

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      return redirect(next, { headers });
    }
  }

  // return the user to an error page with instructions
  return redirect("/auth/auth-code-error", { headers });
}
