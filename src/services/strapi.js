const STRAPI_URL =
  import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";

export async function getStrapiPosts() {
  const response = await fetch(
    `${STRAPI_URL}/api/posts?populate=*`
  );

  if (!response.ok) {
    throw new Error(
      `Strapi request failed: ${response.status}`
    );
  }

  const result = await response.json();

  return result.data || [];
}

export function getStrapiMediaUrl(url) {
  if (!url) return "";

  if (url.startsWith("http")) {
    return url;
  }

  return `${STRAPI_URL}${url}`;
}