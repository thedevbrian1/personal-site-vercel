import { createCookieSessionStorage, type Session } from "react-router";

export let { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "__3r14n_session",
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      path: "/",
      sameSite: "lax",
      secrets: [process.env.SESSION_SECRET],
      secure: true,
    },
  });

export function setSuccessMessage(session: Session, message: string) {
  session.flash("toastMessage", { message, type: "success" });
}
