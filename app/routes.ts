import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("posts", "routes/posts.tsx"),
  route("posts/:slug", "routes/post.tsx"),
  route("signup", "routes/auth/signup.tsx"),
  route("login", "routes/auth/login.tsx"),
  route("logout", "routes/auth/logout.ts"),
  route("auth/confirm", "routes/auth/confirm.ts"),
] satisfies RouteConfig;
