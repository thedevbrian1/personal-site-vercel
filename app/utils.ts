import imageUrlBuilder from "@sanity/image-url";

let builder = imageUrlBuilder({ projectId: "23v8vwns", dataset: "production" });

export function urlFor(source) {
  return builder.image(source);
}
