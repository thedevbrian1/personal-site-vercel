import { Form, Link, redirect, useNavigation } from "react-router";
import { FormSpacer } from "~/components/FormSpacer";
import { ThreeDots } from "~/components/Icon";
import { Input } from "~/components/ui/input";
import type { Route } from "./+types/login";
import {
  badRequest,
  validateEmail,
  validatePassword,
} from "~/.server/validation";
import { login } from "~/models/user";

export async function action({ request }: Route.ActionArgs) {
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

  console.log({ data });

  return redirect("/", { headers });
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
              autoComplete="new-password"
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
