import { data, Form, Link, useNavigation } from "react-router";
import { FormSpacer } from "~/components/FormSpacer";
import { Input } from "~/components/ui/input";
import type { Route } from "./+types/signup";
import {
  badRequest,
  validateEmail,
  validateName,
  validatePassword,
} from "~/.server/validation";
import { createUser, getUserNames } from "~/models/user";
import { ThreeDots } from "~/components/Icon";
import { CircleCheckBig } from "lucide-react";
import subscribeStyles from "~/styles/subscribe.css?url";
import { useEffect, useRef } from "react";

export function links() {
  return [
    {
      rel: "stylesheet",
      href: subscribeStyles,
    },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  let formData = await request.formData();

  let userName = String(formData.get("username"));
  let email = String(formData.get("email"));
  let password = String(formData.get("password"));

  let fieldErrors = {
    userName: validateName(userName),
    email: validateEmail(email),
    password: validatePassword(password),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors });
  }

  // Check if username exists first

  let { data: users } = await getUserNames(request);

  let userNames = users?.map((item) => item.name);

  if (userNames?.includes(userName.trim())) {
    throw new Response("Name already in use. Please try another one.", {
      status: 400,
    });
  }

  let userObj = {
    userName,
    email,
    password,
  };

  let { user, headers } = await createUser(request, userObj);

  if (user.length > 0) {
    return data(user[0].id, { headers });
  }

  return data({ ok: true }, { headers });
}

export default function Signup({ actionData }: Route.ComponentProps) {
  let fieldErrors, id;

  if (
    actionData &&
    typeof actionData === "object" &&
    "fieldErrors" in actionData
  ) {
    fieldErrors = actionData.fieldErrors;
  } else if (typeof actionData === "number") {
    id = actionData;
  }

  let formRef = useRef(null);

  let navigation = useNavigation();
  let isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (!isSubmitting) {
      formRef?.current.reset();
    }
  }, [isSubmitting]);

  return (
    <main className="mt-32 px-6 md:max-w-lg mx-auto">
      <div className="border border-slate-500 bg-slightly-lighter-dark-blue rounded-xl px-6 py-10">
        <div className="subscribe">
          <div aria-hidden={!!id}>
            <h1 className="text-2xl font-semibold font-heading">Signup</h1>
            <Form method="post" ref={formRef} className="mt-8 space-y-4">
              <FormSpacer>
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
              </FormSpacer>
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
                  "Sign up"
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
          <div aria-hidden={!id} className="text-center">
            <div className="flex justify-center text-green-400">
              <CircleCheckBig className="w-96" />
            </div>
            <h2 className="font-semibold font-heading text-3xl lg:text-5xl mt-4">
              Success!
            </h2>
            <p className="mt-4">
              Check your email inbox for a link to activate your account.
            </p>
            <div className="mt-8 has-[:active]:scale-[0.97] transition ease-out duration-300">
              <Link
                to="."
                preventScrollReset
                className="bg-gradient-to-r from-[#c94b4b] to-[#4b134f] hover:bg-gradient-to-r hover:from-[#4b134f] hover:to-[#c94b4b] active:scale-[.97] transition ease-in-out duration-200  rounded-lg px-6 py-3"
              >
                Start over
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
