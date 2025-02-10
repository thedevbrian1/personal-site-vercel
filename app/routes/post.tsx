import {
  Form,
  Link,
  data,
  isRouteErrorResponse,
  useActionData,
  useLoaderData,
  useNavigation,
  useRouteError,
} from "react-router";
import { useEffect, useState } from "react";
import { PortableText } from "@portabletext/react";
import { getPost } from "../models/post.server";
import {
  ArrowLeftIcon,
  CheckIcon,
  ClipboardIcon,
  ErrorIcon,
  SpaceIllustration,
  ThreeDots,
} from "../components/Icon";

import ReactPlayer from "react-player/youtube";
import Lowlight from "react-lowlight";
import javascript from "highlight.js/lib/languages/javascript";
import "highlight.js/styles/night-owl.css";

import { urlFor } from "~/utils";
import { FormSpacer } from "~/components/FormSpacer";
import Input from "~/components/Input";
import {
  badRequest,
  validateMessage,
  validateName,
} from "~/.server/validation";
import { getUser } from "~/.server/supabase";

Lowlight.registerLanguage("js", javascript);

export function headers({ loaderHeaders }) {
  return { "Cache-Control": loaderHeaders.get("Cache-Control") };
}

export function meta({ data }) {
  return [
    { title: data[0].title },
    {
      name: "description",
      content: data[0].description,
    },
  ];
}
export async function loader({ params, request }) {
  const post = await getPost(params.slug);

  return data(post);
}

export async function action({ request }) {
  let formData = await request.formData();
  let userName = formData.get("username");
  let comment = formData.get("comment");

  let fieldErrors = {
    userName: validateName(userName),
    comment: validateMessage(comment),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors });
  }

  //   Write comment to DB

  let { user, headers } = await getUser(request);
  if (!user) {
    throw new Response("You need to be logged in to proceed", { status: 400 });
  }
  return data({ ok: true }, { headers });
}

const components = {
  types: {
    image: ({ value }) => (
      <img
        src={`${urlFor(value.asset)}`}
        alt=""
        className="revealing-image max-w-xs lg:max-w-sm mx-auto aspect-[4/3] object-contain"
      />
    ),
    // FIXME: Video not showing
    // videoBlogPost: ({ value }) => {
    //     console.log({ value });
    //     return (
    //         <MuxPlayer
    //             playbackId={value.video.asset.playbackId}
    //             metadata={value.title ? { video_title: value.title } : undefined}
    //         />
    //         // <MuxVideo
    //         //     playbackId={value.video.asset.playbackId}
    //         //     metadata={value.title ? { video_title: value.title } : undefined}
    //         //     controls
    //         //     autoPlay
    //         //     muted
    //         // />

    //     )
    // },
    customImage: ({ value }) => (
      <img
        src={`${urlFor(value.image)}`}
        alt=""
        className="revealing-image max-w-xs lg:max-w-sm mx-auto aspect-[4/3] object-contain"
      />
    ),
    code: Code,
    youtube: ({ value }) => {
      if (!value || !value.url) {
        return null;
      }
      let { url } = value;
      return (
        <div className="aspect-video">
          <ReactPlayer url={url} width="100%" height="100%" />
        </div>
      );
    },
  },
  block: {
    h2: ({ children }) => <h2 className="text-gray-300">{children}</h2>,
    h3: ({ children }) => <h3 className="text-gray-300">{children}</h3>,
    h4: ({ children }) => <h4 className="text-gray-300">{children}</h4>,
  },
  marks: {
    link: ({ value, children }) => {
      let target = (value?.href || "").startsWith("http")
        ? "_blank"
        : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === "_blank" && "noindex nofollow noreferrer noopener"}
          className="text-brand-orange"
        >
          {children}
        </a>
      );
    },
    strong: ({ children }) => (
      <strong className="text-gray-300">{children}</strong>
    ),
  },
};

function Code({ value }) {
  const [isCopied, setIsCopied] = useState(false);

  function copyToClipboard() {
    navigator.clipboard
      .writeText(value.code)
      .then(() => setIsCopied(true))
      .catch((error) => {
        console.log({ error });
      });
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      copyToClipboard();
    }
  }

  useEffect(() => {
    let timeoutId;
    if (isCopied) {
      timeoutId = setTimeout(() => setIsCopied(false), 3000);
    }
    return () => clearTimeout(timeoutId);
  }, [isCopied]);

  return (
    <div className="relative" tabIndex="0" onKeyDown={handleKeyDown}>
      {isCopied ? (
        <span
          className="absolute top-5 right-6 flex gap-1 items-center text-green-500 transition ease-in-out duration-300"
          title="Copied"
          aria-label="Copied"
          onClick={() => setIsCopied(false)}
        >
          Copied <CheckIcon />
        </span>
      ) : (
        <span
          className="absolute top-6 right-6 transition ease-in-out duration-300"
          title="Copy to clipboard"
          aria-label="Copy to clipboard"
          onClick={() => copyToClipboard()}
        >
          <ClipboardIcon />
        </span>
      )}
      <Lowlight language="js" value={value.code} />
    </div>
  );
}

export default function Post() {
  const post = useLoaderData();

  let actionData = useActionData();
  let navigation = useNavigation();

  let isSubmitting = navigation.state === "submitting";

  let comments = [
    {
      userName: "Brian",
      comment: "Great article! Keep educating us!",
    },
    {
      userName: "Mwangi",
      comment: "A very insightful post",
    },
    {
      userName: "Doe",
      comment: "What a brilliant young man!",
    },
  ];
  return (
    <main className="mt-20 py-16 px-6  max-w-3xl 2xl:max-w-3xl mx-auto text-gray-300">
      <div className="ml-2 md:ml-6">
        <Link
          to="/posts"
          prefetch="intent"
          className="flex gap-1 hover:underline transition ease-in-out duration-300"
        >
          <ArrowLeftIcon />
          Back to articles
        </Link>
      </div>
      <article className="prose text-gray-300 prose-code:text-gray-300 mt-8">
        <div className="px-2 md:px-6">
          <h1 className="text-gray-300">{post[0].title}</h1>
          <p>
            <time dateTime={new Date(post[0].formattedCreatedAt)}>
              {post[0].formattedCreatedAt}
              {/* TODO: Estimate reading time */}
            </time>{" "}
            -- 2 min read
          </p>
        </div>
        <img
          src={`${post[0].mainImage?.asset.url}?w=640&auto=format&fit=crop`}
          alt={post[0].altText}
          className="aspect-video w-full object-cover"
        />
        <div className="px-2 md:px-6">
          <PortableText value={post[0].body} components={components} />
        </div>
      </article>

      <section className="md:max-w-lg">
        <h2 className="font-semibold text-lg">Comments ({comments.length})</h2>
        <div className="mt-4">
          {comments.length === 0 ? (
            <div className="flex flex-col items-center">
              <div className="w-24">
                <SpaceIllustration />
              </div>
              <p className="text-gray-400 mt-4">No comments yet</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {comments.map((item) => (
                <li className="bg-[#35363e] p-6 rounded-lg">
                  <div className="flex gap-2 items-center">
                    <span className="w-10 h-10 rounded-full font-semibold bg-brand-orange text-white grid place-items-center">
                      {item.userName.charAt(0)}
                    </span>
                    <p className="font-semibold">{item.userName}</p>
                  </div>
                  <div className="mt-4 text-gray-300/80">{item.comment}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <h3 className="mt-8 font-semibold text-lg">Add a comment</h3>
        <Form method="post" className="mt-4">
          <FormSpacer>
            <label htmlFor="username" className="text-body-white">
              User name{" "}
              {/* {actionData?.fieldErrors.userName ? (
                <span className="text-red-500 ml-2" id="message-error">
                  {actionData.fieldErrors.userName}
                </span>
              ) : (
                <>&nbsp;</>
              )} */}
            </label>
            <Input
              type="text"
              name="username"
              id="username"
              fieldError={actionData?.fieldErrors?.userName}
            />
          </FormSpacer>
          <FormSpacer>
            <label htmlFor="comment">
              Comment{" "}
              {/* {actionData?.fieldErrors.comment ? (
                <span className="text-red-500 ml-2" id="message-error">
                  {actionData.fieldErrors.comment}
                </span>
              ) : (
                <>&nbsp;</>
              )} */}
            </label>
            <Input
              type="textarea"
              id="comment"
              name="comment"
              fieldError={actionData?.fieldErrors?.comment}
            />
          </FormSpacer>
          <button
            disabled={isSubmitting}
            className="bg-gradient-to-r from-[#c94b4b] to-[#4b134f] hover:bg-gradient-to-r hover:from-[#4b134f] hover:to-[#c94b4b] active:scale-[.97] transition ease-in-out duration-200 w-full flex justify-center py-3  rounded-lg font-bold lg:text-lg text-white"
          >
            {isSubmitting ? (
              <div className="w-10" aria-label="submitting">
                <ThreeDots />
              </div>
            ) : (
              "Comment"
            )}
          </button>
        </Form>
      </section>
    </main>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

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
            className="px-4 py-2 rounded flex gap-1 text-white bg-gradient-to-r from-[#c94b4b] to-[#4b134f] hover:bg-gradient-to-r hover:from-[#4b134f] hover:to-[#c94b4b]"
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
          <h1 className="text-red-500 text-3xl">Error fetching post</h1>
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
