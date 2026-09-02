const DIRECTUS_URL =
  import.meta.env.VITE_DIRECTUS_URL || "/directus";

export async function getPosts() {
  const url =
    `${DIRECTUS_URL}/items/posts` +
    `?fields=*,image.*` +
    `&filter[published][_eq]=true` +
    `&sort=-date_created`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Directus error: ${response.status}`);
  }

  const result = await response.json();

  return result.data;
}

export async function getPostBySlug(slug) {
  const url =
    `${DIRECTUS_URL}/items/posts` +
    `?fields=*,image.*` +
    `&filter[slug][_eq]=${encodeURIComponent(slug)}` +
    `&filter[published][_eq]=true`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Directus error: ${response.status}`);
  }

  const result = await response.json();

  return result.data?.[0] || null;
}

export function getImageUrl(image) {
  if (!image) {
    return null;
  }

  const id =
    typeof image === "string"
      ? image
      : image.id;

  return `${DIRECTUS_URL}/assets/${id}`;
}