import { createSBClient } from "~/.server/supabase";

export async function getUserByUserId(request: Request, userId: string) {
  let { supabase } = await createSBClient(request);
  let { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", userId);
  return { user };
}

export async function createUser(request: Request, userObj) {
  let { supabase, headers } = await createSBClient(request);

  let { data } = await supabase.auth.signUp({
    email: userObj.email,
    password: userObj.password,
  });

  console.log({ data });

  if (data.user?.identities?.length === 0) {
    throw new Response("Email already in use. Please try another one!", {
      status: 400,
      statusText: "Bad Request",
    });
  }

  let userId = data.user?.id;

  let { data: user } = await supabase
    .from("users")
    .insert([
      {
        name: userObj.userName,
        email: userObj.email,
        user_id: userId,
      },
    ])
    .select();

  return { user, headers };
}

export async function login(request: Request, email: string, password: string) {
  let { supabase, headers } = await createSBClient(request);
  let { data } = await supabase.auth.signInWithPassword({ email, password });

  return { data, headers };
}

export async function getUserNames(request: Request) {
  let { supabase } = await createSBClient(request);
  let { data } = await supabase.from("users").select("name");

  return { data };
}
