const DIRECTUS_URL =
  import.meta.env.VITE_DIRECTUS_URL ||
  "http://localhost:8055";

const POSTS_ENDPOINT =
  `${DIRECTUS_URL}/items/posts`;

// ========================================
// GET ALL POSTS
// ========================================
export async function getPosts() {
  const response = await fetch(
    `${POSTS_ENDPOINT}?sort=-date_created&fields=*`
  );

  if (!response.ok) {
    throw new Error(
      `Directus request failed: ${response.status}`
    );
  }

  const result = await response.json();

  return result.data || [];
}


// ========================================
// GET SINGLE POST
// ========================================
export async function getPost(id) {
  if (!id) {
    throw new Error("Post ID is required.");
  }

  const response = await fetch(
    `${POSTS_ENDPOINT}/${encodeURIComponent(id)}?fields=*`
  );

  if (!response.ok) {
    throw new Error(
      `Unable to fetch post: ${response.status}`
    );
  }

  const result = await response.json();

  return result.data;
}


// ========================================
// GET IMAGES CONNECTED TO A POST
// ========================================
export async function getPostImages(postId) {
  if (!postId) {
    return [];
  }

  const url =
    `${DIRECTUS_URL}/items/post_images` +
    `?filter[post][_eq]=${encodeURIComponent(postId)}` +
    `&fields=*.*`;

  console.log("----------------------------------------");
  console.log("DIRECTUS POST IMAGES REQUEST");
  console.log("Post ID:", postId);
  console.log("URL:", url);
  console.log("----------------------------------------");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Directus image request failed: ${response.status}`
    );
  }

  const result = await response.json();

  console.log(
    "DIRECTUS POST IMAGES RESPONSE:",
    result
  );

  const validImages = (result.data || []).filter(
    (item) =>
      item &&
      item.post_images &&
      item.post_images.id
  );

  console.log(
    `VALID IMAGES FOR POST ${postId}:`,
    validImages
  );

  return validImages;
}


// ========================================
// GET VIDEOS CONNECTED TO A POST
// ========================================
export async function getPostVideos(postId) {
  if (!postId) {
    return [];
  }

  const url =
    `${DIRECTUS_URL}/items/post_videos` +
    `?filter[post][_eq]=${encodeURIComponent(postId)}` +
    `&fields=*.*`;

  console.log("----------------------------------------");
  console.log("DIRECTUS POST VIDEOS REQUEST");
  console.log("Post ID:", postId);
  console.log("URL:", url);
  console.log("----------------------------------------");

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Directus video request failed: ${response.status}`
    );
  }

  const result = await response.json();

  console.log(
    "DIRECTUS POST VIDEOS RESPONSE:",
    result
  );

  const validVideos = (result.data || []).filter(
    (item) => {

      if (!item) {
        return false;
      }

      const file =
        item.post_videos ||
        item.video ||
        null;

      return (
        file &&
        file.id
      );
    }
  );

  console.log(
    `VALID VIDEOS FOR POST ${postId}:`,
    validVideos
  );

  return validVideos;
}


// ========================================
// GET DIRECTUS ASSET URL
// ========================================
export function getAssetUrl(file) {
  if (!file) {
    return "";
  }

  let fileId = "";

  // Directus returns just the file ID
  if (typeof file === "string") {
    fileId = file;
  }

  // Directus returns complete file object
  else if (
    typeof file === "object" &&
    file !== null
  ) {
    fileId =
      file.id ||
      file.file_id ||
      "";
  }

  if (!fileId) {
    return "";
  }

  // Already a complete URL
  if (
    fileId.startsWith("http://") ||
    fileId.startsWith("https://") ||
    fileId.startsWith("data:")
  ) {
    return fileId;
  }

  return `${DIRECTUS_URL}/assets/${fileId}`;
}


// ========================================
// GET COVER IMAGE URL
// ========================================
export function getImageUrl(image) {
  return getAssetUrl(image);
}


// ========================================
// DIRECTUS URL EXPORT
// ========================================
export { DIRECTUS_URL };