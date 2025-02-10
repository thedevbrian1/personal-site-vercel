import {
  Link,
  NavLink,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "react-router";
import { getPosts } from "~/models/post.server";

export async function loader() {
  const posts = await getPosts();
  return posts;
}

export default function Posts() {
  const posts = useLoaderData();
  console.log({ posts });
  return (
    <main className="text-gray-300 mt-20 py-16 px-6 xl:px-0 md:max-w-2xl mx-auto">
      <h1 className="font-bold text-4xl">Articles</h1>
      <ul className="mt-8 space-y-4">
        {posts.map((post) => {
          function prefetchImage() {
            let img = new Image();
            img.src = `${post.mainImage?.asset.url}?w=640&auto=format&fit=crop`;
          }
          return (
            <PostCard
              key={post._id}
              href={post.slug.current}
              title={post.title}
              description={post.description}
              imgSrc={post.mainImage?.asset.url}
              createdAt={post.formattedCreatedAt}
              prefetchImage={prefetchImage}
            />
          );
        })}
      </ul>
    </main>
  );
}

function PostCard({
  href,
  title,
  description,
  imgSrc,
  createdAt,
  prefetchImage,
}) {
  return (
    <NavLink
      to={href}
      prefetch="intent"
      onMouseEnter={prefetchImage}
      onFocus={prefetchImage}
      viewTransition
      className="grid md:grid-cols-3 bg-brand-alt-blue rounded-lg hover:outline  hover:outline-[#feb465] transition ease-in-out duration-300 opacity-0 fade-in"
    >
      <img
        src={`${imgSrc}?w=295&auto=format&fit=crop`}
        alt=""
        className="w-full h-52 object-cover md:col-span-1 p-4 rounded-lg"
      />
      <div className="md:col-span-2 p-6">
        <h2 className="font-semibold text-lg lg:text-xl">{title}</h2>
        <p className="mt-2">
          <time dateTime={new Date(createdAt)}>{createdAt}</time>
        </p>
        <p className="mt-4 text-gray-400">{description}</p>
      </div>
    </NavLink>
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
          <h1 className="text-red-500 text-3xl">Error fetching posts</h1>
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
