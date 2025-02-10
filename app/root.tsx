import {
  data,
  Form,
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router";
import { useRef, useEffect, useState } from "react";
import type { Route } from "./+types/root";
import tailwindStyles from "./styles/app.css?url";
import animationStyles from "./styles/animation.css?url";
import { useSpinDelay } from "spin-delay";

import { honeypot } from "./.server/honeypot";
import { HoneypotProvider, HoneypotInputs } from "remix-utils/honeypot/react";
import { Facebook, LinkedIn, ThreeDots, Twitter } from "./components/Icon";
import { FormSpacer } from "./components/FormSpacer";
import Input from "./components/Input";
import Nav from "./components/Nav";

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: tailwindStyles },
  { rel: "stylesheet", href: animationStyles },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    href: "https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Source+Sans+3:wght@300;400;600&display=swap",
    rel: "stylesheet",
  },
];

export async function loader() {
  return data({ honeypotInputProps: honeypot.getInputProps() });
}

export function Layout({ children }: { children: React.ReactNode }) {
  let { honeypotInputProps } = useLoaderData();
  let [href, setHref] = useState("");

  let navigation = useNavigation();
  let isLoading = navigation.state === "loading" && !navigation.formMethod;

  let showLoadingState = useSpinDelay(isLoading, {
    delay: 150,
    minDuration: 500,
  });

  const navLinks = [
    {
      name: "Home",
      path: "/",
      id: 1,
    },
    {
      name: "Projects",
      path: "/#projects",
      id: 2,
    },
    {
      name: "Contact me",
      path: "/#contact",
      id: 3,
    },
    {
      name: "About",
      path: "/#about",
      id: 4,
    },
    {
      name: "Blog",
      path: "/posts",
      id: 5,
    },
  ];

  useEffect(() => {
    let isMobileDevice =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    let phoneNumber = "+254710162152";
    if (isMobileDevice) {
      setHref(`whatsapp://send?phone=${phoneNumber}`);
    } else {
      setHref(`https://web.whatsapp.com/send?phone=${phoneNumber}`);
    }
  }, []);
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-dark-blue text-body-white">
        <HoneypotProvider {...honeypotInputProps}>
          <header className="flex justify-between items-center absolute top-0 left-0 right-0 z-10 pt-8 px-6 lg:pl-12 lg:pr-16">
            {/* 
            TODO:
            LOGO ideas:
              - Make logo my name and it should glow
              - Make first letter of my name flicker like a faulty bulb
          */}
            <Link to="/">
              <h1 className="font-heading text-white uppercase">
                Brian Mwangi
              </h1>
            </Link>
            <Nav navLinks={navLinks} />
          </header>
          {children}
          <Footer />
          <div className="fixed bottom-10 right-5 md:right-10">
            <a href={href} target="_blank" className="group">
              <img
                src="/whatsapp.svg"
                alt="WhatsApp icon"
                loading="lazy"
                className="w-6 h-6 md:w-8 md:h-8 group-hover:scale-105 transition-transform duration-300 ease-in-out "
              />
            </a>
          </div>
        </HoneypotProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

function Footer() {
  let actionData = useActionData();
  let navigation = useNavigation();

  let isSubmitting = navigation.state === "submitting";

  let nameRef = useRef(null);
  let emailRef = useRef(null);
  let mounted = useRef(false);

  useEffect(() => {
    if (actionData?.fieldErrors.name && mounted.current) {
      nameRef.current?.focus();
    } else if (actionData?.fieldErrors.email && mounted.current) {
      emailRef.current?.focus();
    }

    mounted.current = true;
  }, [actionData]);

  return (
    <footer className="relative">
      <div className="w-36 h-36 lg:w-44 lg:h-44 absolute -left-20 lg:-left-36 top-10 bg-brand-orange blur-3xl bg-opacity-20 rounded-full" />
      <div
        id="footer"
        className="px-6 md:px-12 xl:px-0 xl:max-w-5xl mx-auto mt-16 md:mt-32"
      >
        <div className="flex justify-between">
          <h2 className="font-heading text-white uppercase">Social media</h2>
          <div className="flex gap-3">
            <a
              href="https://www.linkedin.com/in/brian-mwangi-9b01651a1/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Find me on LinkedIn"
            >
              <LinkedIn />
            </a>
            <a
              href="https://twitter.com/_3R14N_"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow me on X"
            >
              <Twitter />
            </a>
            <a
              href="https://www.facebook.com/brayo.notnice"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow me on Facebook"
            >
              <Facebook />
            </a>
          </div>
        </div>
        <div className="bg-slightly-lighter-dark-blue rounded-xl border border-slate-500 mt-10">
          <div className="grid md:grid-cols-2 gap-5 px-5 py-10">
            <div className="lg:self-center opacity-0 fade-in">
              <h2 className="text-white font-heading font-bold text-xl lg:text-3xl">
                Sign up for the newsletter
              </h2>
              <p className="font-body text-body-white lg:text-lg mt-2 lg:mt-4">
                Receive interesting tips and articles in real time. You can
                unsubscribe at any time.
              </p>
            </div>
            <div className="md:w-3/4 lg:w-auto opacity-0 fade-in">
              <Form method="post" className="xl:max-w-sm">
                <HoneypotInputs />
                <fieldset className="grid gap-3">
                  <FormSpacer>
                    <label htmlFor="name" className="text-body-white">
                      Name
                      {actionData?.fieldErrors?.name ? (
                        <span className="text-red-500 ml-2" id="name-error">
                          {actionData.fieldErrors.name}
                        </span>
                      ) : (
                        <>&nbsp;</>
                      )}
                    </label>
                    <Input
                      ref={nameRef}
                      type="text"
                      name="name"
                      id="name"
                      placeholder="John Doe"
                      ariaDescribedBy="name-error"
                    />
                  </FormSpacer>
                  <FormSpacer>
                    <label htmlFor="subscribe" className="text-body-white">
                      Email
                      {actionData?.fieldErrors ? (
                        <span className="text-red-500 ml-2" id="email-error">
                          {actionData?.fieldErrors?.email}
                        </span>
                      ) : (
                        <>&nbsp;</>
                      )}
                    </label>

                    <Input
                      ref={emailRef}
                      type="email"
                      name="email"
                      id="subscribe"
                      placeholder="johndoe@gmail.com"
                      ariaDescribedBy="email-error"
                    />
                  </FormSpacer>

                  <button
                    id="subscribeBtn"
                    type="submit"
                    name="_action"
                    value="subscribe"
                    aria-live="assertive"
                    // onMouseEnter={handleHover}
                    className=" bg-gradient-to-r from-[#c94b4b] to-[#4b134f] hover:bg-gradient-to-r hover:from-[#4b134f] hover:to-[#c94b4b] transition ease-in-out duration-200 w-full py-3 px-auto  rounded-lg font-bold lg:text-lg flex justify-center text-white group"
                  >
                    {isSubmitting ? (
                      <div className="w-10" aria-label="submitting">
                        <ThreeDots />
                      </div>
                    ) : (
                      "Submit"
                    )}
                  </button>
                </fieldset>
                {actionData?.formError ? (
                  <p className="text-red-500 mt-4">{actionData.formError}</p>
                ) : null}
              </Form>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-[#533D55] text-body-white font-body flex justify-center mt-10 py-3">
        Copyright &copy; {new Date().getFullYear()}
      </div>
    </footer>
  );
}
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
