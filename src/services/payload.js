const PAYLOAD_URL = (
  import.meta.env.VITE_PAYLOAD_URL || "http://localhost:7777"
).replace(/\/$/, "");

/* =========================================================
   PAYLOAD API HELPER
========================================================= */

async function payloadFetch(endpoint) {
  const response = await fetch(`${PAYLOAD_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(
      `Payload API error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

/* =========================================================
   POSTS
========================================================= */

export async function getPosts() {
  const data = await payloadFetch(
    "/api/posts?limit=100&sort=-publishedAt&depth=2"
  );

  return data?.docs || [];
}

/* =========================================================
   SINGLE POST
========================================================= */

export async function getPost(id) {
  if (!id) {
    throw new Error("Post ID is required.");
  }

  const data = await payloadFetch(`/api/posts/${id}?depth=2`);

  return data;
}

/* =========================================================
   MEDIA URL
========================================================= */

export function getMediaUrl(media) {
  if (!media) {
    return "";
  }

  /*
    Payload can return only a media ID.
    Example:
    "1"
  */
  if (typeof media === "string") {
    return `${PAYLOAD_URL}/api/media/file/${media}`;
  }

  /*
    Payload populated media object.

    Example:
    {
      id: 1,
      filename: "tsLogo.jfif",
      url: "/api/media/file/tsLogo.jfif",
      mimeType: "image/jpeg"
    }
  */
  if (typeof media === "object") {
    /*
      If Payload already gives us a URL,
      use that URL directly.
    */
    if (media.url) {
      /*
        Absolute URL:
        https://example.com/image.jpg
      */
      if (/^https?:\/\//i.test(media.url)) {
        return media.url;
      }

      /*
        Relative Payload URL:
        /api/media/file/tsLogo.jfif

        becomes:
        http://localhost:7777/api/media/file/tsLogo.jfif
      */
      return `${PAYLOAD_URL}${
        media.url.startsWith("/") ? media.url : `/${media.url}`
      }`;
    }

    /*
      Fallback when Payload gives us a filename
      but no URL.
    */
    if (media.filename) {
      return `${PAYLOAD_URL}/api/media/file/${media.filename}`;
    }
  }

  return "";
}

/* =========================================================
   COVER IMAGE
========================================================= */

export function getPostImage(post) {
  if (!post) {
    return "";
  }

  /*
    Payload's actual Posts field is:
    coverImage

    Put coverImage FIRST so the correct Payload
    cover image is always used.
  */
  const image =
    post.coverImage ||
    post.image ||
    post.featuredImage ||
    post.cover ||
    null;

  return getMediaUrl(image);
}

/* =========================================================
   CATEGORY
========================================================= */

export function getPostCategory(post) {
  if (!post?.category) {
    return "";
  }

  if (typeof post.category === "string") {
    return post.category;
  }

  return (
    post.category.name ||
    post.category.title ||
    post.category.label ||
    ""
  );
}

/* =========================================================
   AUTHOR
========================================================= */

export function getPostAuthor(post) {
  if (!post?.author) {
    return "";
  }

  if (typeof post.author === "string") {
    return post.author;
  }

  return (
    post.author.name ||
    post.author.username ||
    post.author.email ||
    ""
  );
}

/* =========================================================
   DATE
========================================================= */

export function getPostDate(post) {
  if (!post) {
    return "";
  }

  return (
    post.publishedAt ||
    post.createdAt ||
    post.date_created ||
    ""
  );
}

/* =========================================================
   PAYLOAD BASE URL
========================================================= */

export { PAYLOAD_URL };