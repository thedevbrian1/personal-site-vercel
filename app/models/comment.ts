import { createSBClient } from "~/.server/supabase";

export async function getPostComments(request: Request, postId: string) {
  let { supabase } = await createSBClient(request);

  let { data: comments } = await supabase
    .from("comments")
    .select("id, content, users(name)")
    .eq("post_id", postId)
    .order("id", { ascending: false });

  return comments;
}

export async function createComment(request: Request, commentObj) {
  let { supabase, headers } = await createSBClient(request);
  let { data: comment } = await supabase
    .from("comments")
    .insert([
      {
        content: commentObj.content,
        post_id: commentObj.postId,
        user_id: commentObj.userId,
      },
    ])
    .select();

  return { comment, headers };
}
