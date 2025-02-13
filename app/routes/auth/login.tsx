import {
  Form,
  isRouteErrorResponse,
  Link,
  redirect,
  useNavigation,
} from "react-router";
import { FormSpacer } from "~/components/FormSpacer";
import { ErrorIcon, ThreeDots } from "~/components/Icon";
import { Input } from "~/components/ui/input";
import type { Route } from "./+types/login";
import {
  badRequest,
  validateEmail,
  validatePassword,
} from "~/.server/validation";
import { login } from "~/models/user";
import {
  commitSession,
  getSession,
  setSuccessMessage,
} from "~/.server/session";

export async function action({ request }: Route.ActionArgs) {
  let session = await getSession(request.headers.get("Cookie"));

  let formData = await request.formData();

  let email = String(formData.get("email"));
  let password = String(formData.get("password"));

  let fieldErrors = {
    email: validateEmail(email),
    password: validatePassword(password),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors });
  }

  let { data, headers } = await login(request, email, password);

  //   TODO:Show success toast

  if (data) {
    setSuccessMessage(session, "Logged in successfully!");
  }

  // TODO: Redirect to where the user was previously after logging in

  let allHeaders = {
    ...Object.fromEntries(headers.entries()),
    "Set-Cookie": await commitSession(session),
  };

  return redirect("/", { headers: allHeaders });
}

export default function Login({ actionData }: Route.ComponentProps) {
  let fieldErrors;

  if (
    actionData &&
    typeof actionData === "object" &&
    "fieldErrors" in actionData
  ) {
    fieldErrors = actionData.fieldErrors;
  }
  let navigation = useNavigation();
  let isSubmitting = navigation.state === "submitting";

  return (
    <main className="mt-32 px-6 md:max-w-lg mx-auto">
      <div className="border border-slate-500 bg-slightly-lighter-dark-blue rounded-xl px-6 py-10">
        <h1 className="text-2xl font-semibold font-heading">Login</h1>
        <Form method="post" className="mt-8 space-y-4">
          {/* <FormSpacer>
            <label htmlFor="username" className="flex gap-2 items-center">
              User name{" "}
              {fieldErrors?.userName ? (
                <span className="text-red-500 text-sm">
                  {fieldErrors.userName}
                </span>
              ) : null}
            </label>
            <Input
              type="text"
              id="username"
              name="username"
              placeholder="brianmwangi"
              className={`border border-gray-400 ${
                fieldErrors?.userName ? "border-red-500" : ""
              }  focus-visible:border-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition ease-in-out duration-300`}
            />
          </FormSpacer> */}
          <FormSpacer>
            <label htmlFor="email">
              Email{" "}
              {fieldErrors?.email ? (
                <span className="text-red-500 text-sm">
                  {fieldErrors.email}
                </span>
              ) : null}
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="brian@email.com"
              className={`border border-gray-400 ${
                fieldErrors?.email ? "border-red-500" : ""
              }  focus-visible:border-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition ease-in-out duration-300`}
            />
          </FormSpacer>
          <FormSpacer>
            <label htmlFor="password">
              Password{" "}
              {fieldErrors?.password ? (
                <span className="text-red-500 text-sm">
                  {fieldErrors.password}
                </span>
              ) : null}
            </label>
            <Input
              type="password"
              id="password"
              name="password"
              //   autoComplete="new-password"
              className={`border border-gray-400 ${
                fieldErrors?.password ? "border-red-500" : ""
              }  focus-visible:border-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition ease-in-out duration-300`}
            />
          </FormSpacer>
          <button
            type="submit"
            className="bg-gradient-to-r from-[#c94b4b] to-[#4b134f] hover:bg-gradient-to-r hover:from-[#4b134f] hover:to-[#c94b4b] active:scale-[.97] transition ease-in-out duration-200 w-full flex justify-center items-center min-h-14 py-3  rounded-lg font-bold lg:text-lg text-white"
          >
            {isSubmitting ? (
              <span className="w-10">
                <ThreeDots />
              </span>
            ) : (
              "Log in"
            )}
          </button>
        </Form>
        <Link
          to="/login"
          className="text-blue-300 hover:text-blue-500 underline inline-block mt-4 transition ease-in-out duration-300"
        >
          Already have an account? Log in instead
        </Link>
      </div>
    </main>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {
    console.error({ error });
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="flex flex-col items-center gap-4 text-gray-300">
          <div className="w-40">
            <ErrorIcon />
          </div>
          <h1 className="font-semibold text-3xl text-red-500">
            {error.status} {error.statusText}
          </h1>
          <p>{error.data}</p>
          <Link
            to="."
            prefetch="intent"
            className="px-4 py-2 rounded flex gap-1 text-white bg-gradient-to-r from-[#c94b4b] to-[#4b134f] hover:bg-gradient-to-r hover:from-[#4b134f] hover:to-[#c94b4b] active:scale-[.97] transition ease-in-out duration-300"
          >
            Try again
          </Link>
        </div>
      </div>
    );
  } else if (error instanceof Error) {
    console.error({ error });
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="flex flex-col items-center gap-4 px-6 xl:px-0">
          <div className="w-40">
            <ErrorIcon />
          </div>
          <h1 className="text-red-500 text-3xl">Error</h1>
          <p>{error.message}</p>
          <Link
            to="."
            prefetch="intent"
            className="px-4 py-2 rounded flex gap-1 text-white bg-gradient-to-r from-[#c94b4b] to-[#4b134f] hover:bg-gradient-to-r hover:from-[#4b134f] hover:to-[#c94b4b]"
          >
            Try again
          </Link>
        </div>
      </div>
    );
  }
}
