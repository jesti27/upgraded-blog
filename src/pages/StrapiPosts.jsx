
import { useEffect, useState } from "react";
import "./StrapiPosts.css";

const STRAPI_URL =
  import.meta.env.VITE_STRAPI_URL ||
  "http://localhost:1337";

function StrapiPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedPost, setSelectedPost] = useState(null);

  const [selectedPostImages, setSelectedPostImages] =
    useState([]);
  const [imagesLoading, setImagesLoading] =
    useState(false);
  const [imagesError, setImagesError] =
    useState("");

  const [selectedPostVideos, setSelectedPostVideos] =
    useState([]);
  const [videosLoading, setVideosLoading] =
    useState(false);
  const [videosError, setVideosError] =
    useState("");

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [articleSection, setArticleSection] =
    useState("article");

  const [search, setSearch] =
    useState("");

  const [previewImage, setPreviewImage] =
    useState(null);

  /* =========================================================
     STRAPI HELPERS
  ========================================================= */

  function getStrapiData(item) {
    if (!item) {
      return {};
    }

    return item.attributes || item;
  }

  function getPostId(post) {
    if (!post) {
      return "";
    }

    return (
      post.id ||
      post.documentId ||
      post.attributes?.id ||
      post.attributes?.documentId ||
      ""
    );
  }

  function getMediaData(media) {
    if (!media) {
      return null;
    }

    if (media.data) {
      if (Array.isArray(media.data)) {
        return media.data.map((item) =>
          getMediaData(item)
        );
      }

      return getMediaData(media.data);
    }

    if (media.attributes) {
      return {
        id:
          media.id ||
          media.documentId ||
          media.attributes.id ||
          media.attributes.documentId,

        ...media.attributes,
      };
    }

    return media;
  }

  /* =========================================================
     GET MEDIA ID
  ========================================================= */

  function getMediaId(media) {
    if (!media) {
      return "";
    }

    const normalized =
      getMediaData(media);

    if (
      !normalized ||
      Array.isArray(normalized)
    ) {
      return "";
    }

    return String(
      normalized.id ||
      normalized.documentId ||
      ""
    );
  }

  function getMediaUrl(media) {
    if (!media) {
      return "";
    }

    const normalized =
      getMediaData(media);

    if (!normalized) {
      return "";
    }

    if (Array.isArray(normalized)) {
      return "";
    }

    const url =
      normalized.url ||
      normalized.formats?.large?.url ||
      normalized.formats?.medium?.url ||
      normalized.formats?.small?.url ||
      normalized.formats?.thumbnail?.url ||
      "";

    if (!url) {
      return "";
    }

    if (
      url.startsWith("http://") ||
      url.startsWith("https://")
    ) {
      return url;
    }

    return `${STRAPI_URL}${url}`;
  }

  function getMediaTitle(
    media,
    fallback = "Media"
  ) {
    if (!media) {
      return fallback;
    }

    const normalized =
      getMediaData(media);

    if (
      !normalized ||
      Array.isArray(normalized)
    ) {
      return fallback;
    }

    return (
      normalized.alternativeText ||
      normalized.name ||
      normalized.filename ||
      normalized.caption ||
      fallback
    );
  }

  function getMediaType(media) {
    if (!media) {
      return "";
    }

    const normalized =
      getMediaData(media);

    if (
      !normalized ||
      Array.isArray(normalized)
    ) {
      return "";
    }

    return (
      normalized.mime ||
      normalized.type ||
      ""
    );
  }

  function getMediaFileName(media) {
    if (!media) {
      return "";
    }

    const normalized =
      getMediaData(media);

    if (
      !normalized ||
      Array.isArray(normalized)
    ) {
      return "";
    }

    return (
      normalized.name ||
      normalized.filename ||
      ""
    );
  }

  /* =========================================================
     ESCAPE HTML
  ========================================================= */

  function escapeHtml(text = "") {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /* =========================================================
     STRAPI INLINE CHILDREN
  ========================================================= */

  function renderInlineChildren(children = []) {
    if (!Array.isArray(children)) {
      return "";
    }

    return children
      .map((child) => {
        if (!child) {
          return "";
        }

        if (typeof child === "string") {
          return escapeHtml(child);
        }

        if (child.type === "link") {
          const linkText =
            renderInlineChildren(
              child.children
            );

          const url =
            child.url || "";

          return `
            <a
              href="${escapeHtml(url)}"
              target="_blank"
              rel="noopener noreferrer"
            >
              ${linkText}
            </a>
          `;
        }

        let text =
          escapeHtml(
            child.text || ""
          );

        if (child.bold) {
          text =
            `<strong>${text}</strong>`;
        }

        if (child.italic) {
          text =
            `<em>${text}</em>`;
        }

        if (child.underline) {
          text =
            `<u>${text}</u>`;
        }

        if (child.strikethrough) {
          text =
            `<del>${text}</del>`;
        }

        if (child.code) {
          text =
            `<code>${text}</code>`;
        }

        return text;
      })
      .join("");
  }

  /* =========================================================
     STRAPI BLOCK CONTENT → HTML
  ========================================================= */

  function renderStrapiBlocks(blocks = []) {
    if (!Array.isArray(blocks)) {
      return "";
    }

    return blocks
      .map((block) => {
        if (!block) {
          return "";
        }

        const type =
          block.type || "";

        /* =====================================================
           PARAGRAPH
        ===================================================== */

        if (type === "paragraph") {
          const content =
            renderInlineChildren(
              block.children
            );

          if (!content.trim()) {
            return `
              <div class="strapi-content-space"></div>
            `;
          }

          return `
            <p>${content}</p>
          `;
        }

        /* =====================================================
           HEADING
        ===================================================== */

        if (type === "heading") {
          const level =
            Number(block.level) || 2;

          const safeLevel =
            Math.min(
              Math.max(level, 1),
              6
            );

          return `
            <h${safeLevel}>
              ${renderInlineChildren(
                block.children
              )}
            </h${safeLevel}>
          `;
        }

        /* =====================================================
           QUOTE
        ===================================================== */

        if (type === "quote") {
          return `
            <blockquote>
              ${renderInlineChildren(
                block.children
              )}
            </blockquote>
          `;
        }

        /* =====================================================
           CODE
        ===================================================== */

        if (type === "code") {
          const code =
            Array.isArray(
              block.children
            )
              ? block.children
                  .map(
                    (child) =>
                      child?.text || ""
                  )
                  .join("")
              : "";

          return `
            <div class="strapi-code-block">
              <code>${escapeHtml(
                code
              )}</code>
            </div>
          `;
        }

        /* =====================================================
           LIST
        ===================================================== */

        if (type === "list") {
          const listType =
            block.format === "ordered"
              ? "ol"
              : "ul";

          const items =
            Array.isArray(
              block.children
            )
              ? block.children
                  .map((item) => {
                    if (!item) {
                      return "";
                    }

                    const itemContent =
                      renderInlineChildren(
                        item.children
                      );

                    return `
                      <li>
                        ${itemContent}
                      </li>
                    `;
                  })
                  .join("")
              : "";

          return `
            <${listType}>
              ${items}
            </${listType}>
          `;
        }

        /* =====================================================
           IMAGE
        ===================================================== */

        if (type === "image") {
          const image =
            block.image || block;

          const imageUrl =
            getMediaUrl(image);

          if (!imageUrl) {
            return "";
          }

          const imageTitle =
            getMediaTitle(
              image,
              "Article image"
            );

          return `
            <figure class="strapi-inline-image">
              <img
                src="${escapeHtml(
                  imageUrl
                )}"
                alt="${escapeHtml(
                  imageTitle
                )}"
                loading="lazy"
              />

              <figcaption>
                ${escapeHtml(
                  imageTitle
                )}
              </figcaption>
            </figure>
          `;
        }

        /* =====================================================
           LIST ITEM
        ===================================================== */

        if (type === "list-item") {
          return `
            <li>
              ${renderInlineChildren(
                block.children
              )}
            </li>
          `;
        }

        /* =====================================================
           FALLBACK
        ===================================================== */

        if (
          Array.isArray(
            block.children
          )
        ) {
          const content =
            renderInlineChildren(
              block.children
            );

          if (content.trim()) {
            return `
              <p>${content}</p>
            `;
          }
        }

        return "";
      })
      .join("");
  }

  /* =========================================================
     GET CONTENT TEXT
  ========================================================= */

  function getContentText(content) {
    if (!content) {
      return "";
    }

    if (typeof content === "string") {
      return content;
    }

    if (Array.isArray(content)) {
      return content
        .map((block) => {
          if (!block) {
            return "";
          }

          if (
            Array.isArray(
              block.children
            )
          ) {
            return block.children
              .map(
                (child) =>
                  child?.text || ""
              )
              .join(" ");
          }

          return "";
        })
        .join(" ");
    }

    if (typeof content === "object") {
      if (
        Array.isArray(
          content.blocks
        )
      ) {
        return getContentText(
          content.blocks
        );
      }

      if (
        Array.isArray(
          content.children
        )
      ) {
        return content.children
          .map(
            (child) =>
              child?.text || ""
          )
          .join(" ");
      }
    }

    return "";
  }

  /* =========================================================
     LOAD POSTS
  ========================================================= */

  useEffect(() => {
    loadPosts();

    return () => {
      document.body.style.overflow =
        "auto";
    };
  }, []);

  async function loadPosts() {
    try {
      setLoading(true);
      setError("");

      const response =
        await fetch(
          `${STRAPI_URL}/api/posts?populate=*`
        );

      if (!response.ok) {
        throw new Error(
          `Strapi request failed: ${response.status}`
        );
      }

      const result =
        await response.json();

      const data =
        Array.isArray(result?.data)
          ? result.data
          : [];

      setPosts(data);
    } catch (err) {
      console.error(
        "Failed to load Strapi posts:",
        err
      );

      setError(
        "Unable to load Strapi posts."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =========================================================
     LOAD IMAGES
  ========================================================= */

  async function loadPostImages(
    postId,
    post = null
  ) {
    if (!postId) {
      setSelectedPostImages([]);
      return;
    }

    try {
      setImagesLoading(true);
      setImagesError("");
      setSelectedPostImages([]);

      const response =
        await fetch(
          `${STRAPI_URL}/api/post-images?filters[post][id][$eq]=${encodeURIComponent(
            postId
          )}&populate=*`
        );

      if (!response.ok) {
        throw new Error(
          `Strapi images request failed: ${response.status}`
        );
      }

      const result =
        await response.json();

      const data =
        Array.isArray(result?.data)
          ? result.data
          : [];

      /* =====================================================
         GET POST COVER IMAGE
      ===================================================== */

      const postData =
        getStrapiData(
          post || selectedPost
        );

      const coverImage =
        postData.image ||
        postData.cover ||
        postData.coverImage ||
        postData.thumbnail ||
        null;

      const coverImageId =
        getMediaId(coverImage);

      const coverImageUrl =
        getMediaUrl(coverImage);

      /* =====================================================
         REMOVE COVER IMAGE FROM ARTICLE IMAGES
      ===================================================== */

      const filteredImages =
        data.filter((item) => {
          const image =
            getImageFromItem(item);

          if (!image) {
            return false;
          }

          const imageId =
            getMediaId(image);

          const imageUrl =
            getMediaUrl(image);

          /*
            Compare the actual Strapi media ID.
          */

          if (
            coverImageId &&
            imageId &&
            coverImageId === imageId
          ) {
            return false;
          }

          /*
            URL fallback.
          */

          if (
            coverImageUrl &&
            imageUrl &&
            coverImageUrl === imageUrl
          ) {
            return false;
          }

          return true;
        });

      setSelectedPostImages(
        filteredImages
      );
    } catch (err) {
      console.error(
        "Failed to load Strapi post images:",
        err
      );

      setImagesError(
        "Unable to load images for this article."
      );
    } finally {
      setImagesLoading(false);
    }
  }

  /* =========================================================
     LOAD VIDEOS
  ========================================================= */

  async function loadPostVideos(postId) {
    if (!postId) {
      setSelectedPostVideos([]);
      return;
    }

    try {
      setVideosLoading(true);
      setVideosError("");
      setSelectedPostVideos([]);

      const response =
        await fetch(
          `${STRAPI_URL}/api/post-videos?filters[post][id][$eq]=${encodeURIComponent(
            postId
          )}&populate=*`
        );

      if (!response.ok) {
        throw new Error(
          `Strapi videos request failed: ${response.status}`
        );
      }

      const result =
        await response.json();

      const data =
        Array.isArray(result?.data)
          ? result.data
          : [];

      setSelectedPostVideos(data);
    } catch (err) {
      console.error(
        "Failed to load Strapi post videos:",
        err
      );

      setVideosError(
        "Unable to load videos for this article."
      );
    } finally {
      setVideosLoading(false);
    }
  }

  /* =========================================================
     OPEN ARTICLE
  ========================================================= */

  function openPost(post) {
    setSelectedPost(post);

    setArticleSection("article");
    setMenuOpen(false);
    setPreviewImage(null);

    setSelectedPostImages([]);
    setSelectedPostVideos([]);

    setImagesError("");
    setVideosError("");

    document.body.style.overflow =
      "hidden";

    const postId =
      getPostId(post);

    loadPostImages(
      postId,
      post
    );

    loadPostVideos(
      postId
    );
  }

  /* =========================================================
     CLOSE ARTICLE
  ========================================================= */

  function closePost() {
    setSelectedPost(null);

    setSelectedPostImages([]);
    setSelectedPostVideos([]);

    setImagesError("");
    setVideosError("");

    setMenuOpen(false);
    setPreviewImage(null);

    document.body.style.overflow =
      "auto";
  }

  /* =========================================================
     FILTER POSTS
  ========================================================= */

  function filteredPosts() {
    if (!search.trim()) {
      return posts;
    }

    const query =
      search.toLowerCase().trim();

    return posts.filter((post) => {
      const data =
        getStrapiData(post);

      const title =
        data.title || "";

      const excerpt =
        data.excerpt || "";

      const content =
        getContentText(
          data.content
        );

      const category =
        data.category?.name ||
        data.category?.data
          ?.attributes?.name ||
        data.category ||
        "";

      const author =
        data.author?.name ||
        data.author?.data
          ?.attributes?.name ||
        data.author ||
        "";

      return `${title} ${excerpt} ${content} ${category} ${author}`
        .toLowerCase()
        .includes(query);
    });
  }

  /* =========================================================
     EXCERPT
  ========================================================= */

  function getExcerpt(content = "") {
    const clean =
      getContentText(content)
        .replace(/<[^>]*>/g, "")
        .replace(/[#*_>`]/g, "")
        .replace(/\s+/g, " ")
        .trim();

    if (clean.length <= 150) {
      return clean;
    }

    return `${clean.substring(
      0,
      150
    )}...`;
  }

  /* =========================================================
     CLEAN ARTICLE CONTENT
  ========================================================= */

  function cleanArticleContent(content = "") {
    if (
      content === null ||
      content === undefined
    ) {
      return "";
    }

    /* =====================================================
       STRAPI RICH TEXT ARRAY
    ===================================================== */

    if (Array.isArray(content)) {
      return renderStrapiBlocks(content);
    }

    /* =====================================================
       STRAPI CONTENT OBJECT
    ===================================================== */

    if (typeof content === "object") {
      if (
        Array.isArray(
          content.blocks
        )
      ) {
        return renderStrapiBlocks(
          content.blocks
        );
      }

      if (
        Array.isArray(
          content.children
        )
      ) {
        return renderStrapiBlocks([
          content,
        ]);
      }

      return "";
    }

    /* =====================================================
       STRING CONTENT
    ===================================================== */

    if (typeof content !== "string") {
      return "";
    }

    if (!content.trim()) {
      return "";
    }

    /* =====================================================
       HTML CONTENT
    ===================================================== */

    const containsHtml =
      /<\/?[a-z][\s\S]*>/i.test(
        content
      );

    if (containsHtml) {
      const parser =
        new DOMParser();

      const doc =
        parser.parseFromString(
          content,
          "text/html"
        );

      doc
        .querySelectorAll(
          "script, style, iframe, object, embed"
        )
        .forEach(
          (element) => {
            element.remove();
          }
        );

      doc
        .querySelectorAll("pre")
        .forEach((pre) => {
          const code =
            pre.querySelector("code");

          if (!code) {
            return;
          }

          const wrapper =
            doc.createElement("div");

          wrapper.className =
            "strapi-code-block";

          const languageMatch =
            code.className.match(
              /language-([a-zA-Z0-9_-]+)/
            );

          const language =
            languageMatch
              ? languageMatch[1]
              : "";

          if (language) {
            const label =
              doc.createElement(
                "span"
              );

            label.className =
              "strapi-code-language";

            label.textContent =
              language;

            wrapper.appendChild(
              label
            );
          }

          const codeElement =
            doc.createElement(
              "code"
            );

          codeElement.textContent =
            code.textContent;

          wrapper.appendChild(
            codeElement
          );

          pre.replaceWith(wrapper);
        });

      return doc.body.innerHTML;
    }

    /* =====================================================
       MARKDOWN / PLAIN TEXT
    ===================================================== */

    const lines =
      content.split("\n");

    let html = "";

    let insideCodeBlock =
      false;

    let codeContent = "";

    let codeLanguage = "";

    lines.forEach((line) => {
      const trimmed =
        line.trim();

      if (
        trimmed.startsWith("```")
      ) {
        if (!insideCodeBlock) {
          insideCodeBlock = true;

          codeContent = "";

          codeLanguage =
            trimmed
              .replace(
                /^```/,
                ""
              )
              .trim();
        } else {
          insideCodeBlock = false;

          html += `
            <div class="strapi-code-block">
              ${
                codeLanguage
                  ? `
                    <span class="strapi-code-language">
                      ${escapeHtml(
                        codeLanguage
                      )}
                    </span>
                  `
                  : ""
              }

              <code>${escapeHtml(
                codeContent
              )}</code>
            </div>
          `;

          codeContent = "";
          codeLanguage = "";
        }

        return;
      }

      if (insideCodeBlock) {
        codeContent +=
          `${line}\n`;

        return;
      }

      if (!trimmed) {
        html += `
          <div class="strapi-content-space"></div>
        `;

        return;
      }

      if (
        trimmed.startsWith("###")
      ) {
        html += `
          <h3>
            ${escapeHtml(
              trimmed.replace(
                /^###\s*/,
                ""
              )
            )}
          </h3>
        `;

        return;
      }

      if (
        trimmed.startsWith("##")
      ) {
        html += `
          <h2>
            ${escapeHtml(
              trimmed.replace(
                /^##\s*/,
                ""
              )
            )}
          </h2>
        `;

        return;
      }

      if (
        trimmed.startsWith("#")
      ) {
        html += `
          <h1>
            ${escapeHtml(
              trimmed.replace(
                /^#\s*/,
                ""
              )
            )}
          </h1>
        `;

        return;
      }

      html += `
        <p>
          ${escapeHtml(line)}
        </p>
      `;
    });

    if (insideCodeBlock) {
      html += `
        <div class="strapi-code-block">

          ${
            codeLanguage
              ? `
                <span class="strapi-code-language">
                  ${escapeHtml(
                    codeLanguage
                  )}
                </span>
              `
              : ""
          }

          <code>${escapeHtml(
            codeContent
          )}</code>

        </div>
      `;
    }

    return html;
  }

  /* =========================================================
     DATE
  ========================================================= */

  function formatDate(date) {
    if (!date) {
      return "Published";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "Published";
    }

    return parsedDate.toLocaleDateString(
      undefined,
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  }

  /* =========================================================
     CATEGORY
  ========================================================= */

  function getCategory(post) {
    const data =
      getStrapiData(post);

    return (
      data.category?.name ||
      data.category?.data
        ?.attributes?.name ||
      data.category ||
      "ARTICLE"
    );
  }

  /* =========================================================
     AUTHOR
  ========================================================= */

  function getAuthor(post) {
    const data =
      getStrapiData(post);

    return (
      data.author?.name ||
      data.author?.data
        ?.attributes?.name ||
      data.author ||
      "Admin: Esti"
    );
  }

  /* =========================================================
     POST COVER IMAGE
  ========================================================= */

  function getPostCoverImage(post) {
    const data =
      getStrapiData(post);

    const possibleImage =
      data.image ||
      data.cover ||
      data.coverImage ||
      data.thumbnail;

    return getMediaUrl(
      possibleImage
    );
  }

  /* =========================================================
     POST DATE
  ========================================================= */

  function getPostDate(post) {
    const data =
      getStrapiData(post);

    return (
      data.publishedAt ||
      data.date_created ||
      data.createdAt ||
      data.updatedAt ||
      ""
    );
  }

  /* =========================================================
     IMAGE ITEM
  ========================================================= */

  function getImageFromItem(item) {
    const data =
      getStrapiData(item);

    return (
      data.image ||
      data.images ||
      data.post_images ||
      data.media ||
      null
    );
  }

  /* =========================================================
     VIDEO ITEM
  ========================================================= */

  function getVideoFromItem(item) {
    const data =
      getStrapiData(item);

    return (
      data.video ||
      data.videos ||
      data.post_videos ||
      data.media ||
      null
    );
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section className="strapi-posts-page">

      <div className="strapi-posts-page-content">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <header className="strapi-posts-header">

          <div className="strapi-posts-header-content">

            <span className="strapi-posts-eyebrow">
              CONTENT LIBRARY
            </span>

            <h1>
              Posts<span>.</span>
            </h1>

            <p>
              Explore all published system projects,
              documentation, and technical articles.
            </p>

          </div>

          <div className="strapi-post-count">

            <span>
              POSTS
            </span>

            <strong>
              {posts.length}
            </strong>

          </div>

        </header>

        {/* =====================================================
            TOOLBAR
        ===================================================== */}

        <div className="strapi-posts-toolbar">

          <div className="strapi-search-box">

            <span className="strapi-search-icon">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

            {search && (
              <button
                className="strapi-search-clear"
                onClick={() =>
                  setSearch("")
                }
                aria-label="Clear search"
              >
                ×
              </button>
            )}

          </div>

          <button
            className="strapi-refresh-button"
            onClick={loadPosts}
            disabled={loading}
          >
            ↻ Refresh
          </button>

        </div>

        {/* =====================================================
            LOADING
        ===================================================== */}

        {loading && (
          <div className="strapi-posts-state">

            <div className="strapi-loader"></div>

            <span>
              Loading posts...
            </span>

          </div>
        )}

        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && !loading && (
          <div className="strapi-posts-state strapi-error">

            <span>
              {error}
            </span>

            <button
              onClick={loadPosts}
            >
              Try again
            </button>

          </div>
        )}

        {/* =====================================================
            EMPTY
        ===================================================== */}

        {!loading &&
          !error &&
          filteredPosts().length === 0 && (
            <div className="strapi-posts-state">

              <div className="strapi-empty-icon">
                ◇
              </div>

              <span>
                No posts found.
              </span>

            </div>
          )}

        {/* =====================================================
            POSTS GRID
        ===================================================== */}

        {!loading &&
          !error &&
          filteredPosts().length > 0 && (

          <div className="strapi-posts-grid">

            {filteredPosts().map(
              (post, index) => {

                const data =
                  getStrapiData(post);

                const coverImage =
                  getPostCoverImage(
                    post
                  );

                return (
                  <article
                    className="strapi-post-card"
                    key={
                      getPostId(post) ||
                      index
                    }
                    onClick={() =>
                      openPost(post)
                    }
                  >

                    <div className="strapi-post-card-image">

                      {coverImage ? (
                        <img
                          src={coverImage}
                          alt={
                            data.title ||
                            "Post cover"
                          }
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <div className="strapi-post-card-image-empty">
                          <span>
                            ◈
                          </span>
                        </div>
                      )}

                    </div>

                    <div className="strapi-post-card-overlay"></div>

                    <div className="strapi-post-card-top">

                      <span className="strapi-post-number">
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <span className="strapi-post-category">
                        {getCategory(
                          post
                        )}
                      </span>

                    </div>

                    <div className="strapi-post-card-content">

                      <h2>
                        {data.title ||
                          "Untitled Post"}
                      </h2>

                      <p>
                        {data.excerpt
                          ? data.excerpt
                          : getExcerpt(
                              data.content
                            )}
                      </p>

                      <div className="strapi-post-meta">

                        <span>
                          {getPostDate(
                            post
                          )
                            ? new Date(
                                getPostDate(
                                  post
                                )
                              ).toLocaleDateString()
                            : "Published"}
                        </span>

                        <span className="strapi-post-open">
                          Read article ↗
                        </span>

                      </div>

                    </div>

                  </article>
                );
              }
            )}

          </div>
        )}

        {/* =====================================================
            ARTICLE MODAL
        ===================================================== */}

        {selectedPost && (

          <div
            className="strapi-article-overlay"
            onClick={(e) => {
              if (
                e.target ===
                e.currentTarget
              ) {
                closePost();
              }
            }}
          >

            <article
              className="strapi-article-window"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* =================================================
                  TOP BAR
              ================================================= */}

              <header className="strapi-article-topbar">

                <button
                  className="strapi-back-button"
                  onClick={closePost}
                >
                  ← Contents
                </button>

                <div className="strapi-article-topbar-title">
                  {getCategory(
                    selectedPost
                  )}
                </div>

                <button
                  className="strapi-article-menu-button"
                  onClick={() =>
                    setMenuOpen(
                      !menuOpen
                    )
                  }
                >
                  ☰ Menu
                </button>

              </header>

              {/* =================================================
                  MENU
              ================================================= */}

              {menuOpen && (

                <div className="strapi-article-menu">

                  <button
                    className={
                      articleSection ===
                      "article"
                        ? "selected"
                        : ""
                    }
                    onClick={() => {
                      setArticleSection(
                        "article"
                      );
                      setMenuOpen(
                        false
                      );
                    }}
                  >
                    <span>
                      ◈
                    </span>

                    Article
                  </button>

                  <button
                    className={
                      articleSection ===
                      "images"
                        ? "selected"
                        : ""
                    }
                    onClick={() => {
                      setArticleSection(
                        "images"
                      );
                      setMenuOpen(
                        false
                      );
                    }}
                  >
                    <span>
                      ▧
                    </span>

                    Images
                  </button>

                  <button
                    className={
                      articleSection ===
                      "videos"
                        ? "selected"
                        : ""
                    }
                    onClick={() => {
                      setArticleSection(
                        "videos"
                      );
                      setMenuOpen(
                        false
                      );
                    }}
                  >
                    <span>
                      ▶
                    </span>

                    Videos
                  </button>

                  <div className="strapi-menu-divider"></div>

                  <button
                    onClick={
                      closePost
                    }
                  >
                    <span>
                      ×
                    </span>

                    Close
                  </button>

                </div>
              )}

              {/* =================================================
                  SCROLL
              ================================================= */}

              <div className="strapi-article-scroll">

                {/* =================================================
                    ARTICLE
                ================================================= */}

                {articleSection ===
                  "article" && (

                  <article className="strapi-article-content">

                    <div className="strapi-article-heading">

                      <span className="strapi-eyebrow">
                        {getCategory(
                          selectedPost
                        )}
                      </span>

                      <h1>
                        {getStrapiData(
                          selectedPost
                        ).title ||
                          "Untitled Post"}
                      </h1>

                      {getStrapiData(
                        selectedPost
                      ).excerpt && (
                        <p className="strapi-article-excerpt">
                          {
                            getStrapiData(
                              selectedPost
                            ).excerpt
                          }
                        </p>
                      )}

                      <div className="strapi-article-meta">

                        <span>
                          {formatDate(
                            getPostDate(
                              selectedPost
                            )
                          )}
                        </span>

                        <span>
                          •
                        </span>

                        <span>
                          {getAuthor(
                            selectedPost
                          )}
                        </span>

                      </div>

                    </div>

                    <div className="strapi-article-divider"></div>

                    <div className="strapi-article-body">

                      {getStrapiData(
                        selectedPost
                      ).content ? (

                        <div
                          className="strapi-content-rendered"
                          dangerouslySetInnerHTML={{
                            __html:
                              cleanArticleContent(
                                getStrapiData(
                                  selectedPost
                                ).content
                              ),
                          }}
                        />

                      ) : (

                        <div className="strapi-article-no-content">

                          <span>
                            ◇
                          </span>

                          <p>
                            No article content
                            available.
                          </p>

                        </div>

                      )}

                    </div>

                  </article>
                )}

                {/* =================================================
                    IMAGES
                ================================================= */}

                {articleSection ===
                  "images" && (

                  <section className="strapi-article-media-page">

                    <div className="strapi-media-header">

                      <div className="strapi-media-header-copy">

                        <span className="strapi-eyebrow">
                          MEDIA
                        </span>

                        <h1>
                          Images
                        </h1>

                        <p>
                          Images connected to this
                          article.
                        </p>

                      </div>

                      <div className="strapi-media-header-actions">

                        <button
                          className="strapi-media-action-button"
                          onClick={() =>
                            setArticleSection(
                              "article"
                            )
                          }
                        >
                          ← Article
                        </button>

                        <button
                          className="strapi-media-action-button"
                          onClick={() =>
                            loadPostImages(
                              getPostId(
                                selectedPost
                              ),
                              selectedPost
                            )
                          }
                          disabled={
                            imagesLoading
                          }
                        >
                          ↻ Refresh
                        </button>

                      </div>

                    </div>

                    {imagesLoading && (

                      <div className="strapi-media-status">

                        <div className="strapi-loader"></div>

                        <p>
                          Loading images...
                        </p>

                      </div>

                    )}

                    {imagesError &&
                      !imagesLoading && (

                      <div className="strapi-media-status strapi-error">

                        <span>
                          {imagesError}
                        </span>

                        <button
                          onClick={() =>
                            loadPostImages(
                              getPostId(
                                selectedPost
                              ),
                              selectedPost
                            )
                          }
                        >
                          Try again
                        </button>

                      </div>

                    )}

                    {!imagesLoading &&
                      !imagesError &&
                      selectedPostImages.length ===
                        0 && (

                      <div className="strapi-media-empty">

                        <div className="strapi-media-empty-icon">
                          ▧
                        </div>

                        <h3>
                          No Images Yet
                        </h3>

                        <p>
                          There are no images
                          connected to this
                          article.
                        </p>

                      </div>

                    )}

                    {!imagesLoading &&
                      !imagesError &&
                      selectedPostImages.length >
                        0 && (

                      <div className="strapi-article-images-grid">

                        {selectedPostImages.map(
                          (item, index) => {

                            const image =
                              getImageFromItem(
                                item
                              );

                            const imageUrl =
                              getMediaUrl(
                                image
                              );

                            if (!imageUrl) {
                              return null;
                            }

                            const imageTitle =
                              getMediaTitle(
                                image,
                                `Article image ${
                                  index + 1
                                }`
                              );

                            const imageType =
                              getMediaType(
                                image
                              ) ||
                              "IMAGE";

                            const imageFileName =
                              getMediaFileName(
                                image
                              ) ||
                              "Strapi file";

                            return (

                              <article
                                className="strapi-article-image-card"
                                key={
                                  getPostId(
                                    item
                                  ) ||
                                  index
                                }
                              >

                                <button
                                  className="strapi-article-image-button"
                                  onClick={() =>
                                    setPreviewImage({
                                      url:
                                        imageUrl,
                                      title:
                                        imageTitle,
                                    })
                                  }
                                  aria-label={`View ${imageTitle}`}
                                >

                                  <img
                                    src={
                                      imageUrl
                                    }
                                    alt={
                                      imageTitle
                                    }
                                    loading="lazy"
                                  />

                                  <span className="strapi-image-view-label">
                                    View Image ↗
                                  </span>

                                </button>

                                <div className="strapi-article-image-info">

                                  <span className="strapi-image-file-type">
                                    {imageType}
                                  </span>

                                  <h3>
                                    {imageTitle}
                                  </h3>

                                  <p>
                                    {imageFileName}
                                  </p>

                                </div>

                              </article>
                            );
                          }
                        )}

                      </div>
                    )}

                  </section>
                )}

                {/* =================================================
                    VIDEOS
                ================================================= */}

                {articleSection ===
                  "videos" && (

                  <section className="strapi-article-media-page">

                    <div className="strapi-media-header">

                      <div className="strapi-media-header-copy">

                        <span className="strapi-eyebrow">
                          MEDIA
                        </span>

                        <h1>
                          Videos
                        </h1>

                        <p>
                          Videos connected to this
                          article.
                        </p>

                      </div>

                      <div className="strapi-media-header-actions">

                        <button
                          className="strapi-media-action-button"
                          onClick={() =>
                            setArticleSection(
                              "article"
                            )
                          }
                        >
                          ← Article
                        </button>

                        <button
                          className="strapi-media-action-button"
                          onClick={() =>
                            loadPostVideos(
                              getPostId(
                                selectedPost
                              )
                            )
                          }
                          disabled={
                            videosLoading
                          }
                        >
                          ↻ Refresh
                        </button>

                      </div>

                    </div>

                    {videosLoading && (

                      <div className="strapi-media-status">

                        <div className="strapi-loader"></div>

                        <p>
                          Loading videos...
                        </p>

                      </div>

                    )}

                    {videosError &&
                      !videosLoading && (

                      <div className="strapi-media-status strapi-error">

                        <span>
                          {videosError}
                        </span>

                        <button
                          onClick={() =>
                            loadPostVideos(
                              getPostId(
                                selectedPost
                              )
                            )
                          }
                        >
                          Try again
                        </button>

                      </div>

                    )}

                    {!videosLoading &&
                      !videosError &&
                      selectedPostVideos.length ===
                        0 && (

                      <div className="strapi-media-empty">

                        <div className="strapi-media-empty-icon">
                          ▶
                        </div>

                        <h3>
                          No Videos Yet
                        </h3>

                        <p>
                          There are no videos
                          connected to this
                          article.
                        </p>

                      </div>

                    )}

                    {!videosLoading &&
                      !videosError &&
                      selectedPostVideos.length >
                        0 && (

                      <div className="strapi-article-videos-grid">

                        {selectedPostVideos.map(
                          (item, index) => {

                            const video =
                              getVideoFromItem(
                                item
                              );

                            const videoUrl =
                              getMediaUrl(
                                video
                              );

                            if (!videoUrl) {
                              return null;
                            }

                            const itemData =
                              getStrapiData(
                                item
                              );

                            const videoTitle =
                              itemData.title ||
                              getMediaTitle(
                                video,
                                `Tutorial Video ${
                                  index + 1
                                }`
                              );

                            const videoDescription =
                              itemData.description ||
                              "Tutorial video connected to this article.";

                            const videoType =
                              getMediaType(
                                video
                              ) ||
                              "video/mp4";

                            const videoFileName =
                              getMediaFileName(
                                video
                              ) ||
                              "Strapi video";

                            return (

                              <article
                                className="strapi-article-video-card"
                                key={
                                  getPostId(
                                    item
                                  ) ||
                                  index
                                }
                              >

                                <div className="strapi-article-video-player">

                                  <video
                                    controls
                                    preload="metadata"
                                    playsInline
                                  >
                                    <source
                                      src={
                                        videoUrl
                                      }
                                      type={
                                        videoType
                                      }
                                    />

                                    Your browser does not
                                    support the video element.
                                  </video>

                                </div>

                                <div className="strapi-article-video-info">

                                  <span className="strapi-video-file-type">
                                    {videoType}
                                  </span>

                                  <h3>
                                    {videoTitle}
                                  </h3>

                                  <p>
                                    {videoDescription}
                                  </p>

                                  <div className="strapi-video-file-name">
                                    {videoFileName}
                                  </div>

                                </div>

                              </article>
                            );
                          }
                        )}

                      </div>
                    )}

                  </section>
                )}

              </div>

              {/* =================================================
                  IMAGE PREVIEW
              ================================================= */}

              {previewImage && (

                <div
                  className="strapi-image-preview-overlay"
                  onClick={() =>
                    setPreviewImage(null)
                  }
                >

                  <button
                    className="strapi-preview-close"
                    onClick={() =>
                      setPreviewImage(null)
                    }
                    aria-label="Close image"
                  >
                    ×
                  </button>

                  <div
                    className="strapi-image-preview-content"
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                  >

                    <img
                      src={
                        previewImage.url
                      }
                      alt={
                        previewImage.title
                      }
                    />

                    <p>
                      {
                        previewImage.title
                      }
                    </p>

                  </div>

                </div>

              )}

            </article>

          </div>

        )}

      </div>

    </section>
  );
}

export default StrapiPosts;

