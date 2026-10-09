import { useEffect, useState } from "react";
import {
  getPosts,
  getPostImages,
  getPostVideos,
  getAssetUrl,
  getImageUrl,
} from "../services/directus";
import "./Posts.css";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedPost, setSelectedPost] = useState(null);

  /* =========================================================
     IMAGES
  ========================================================= */

  const [selectedPostImages, setSelectedPostImages] =
    useState([]);

  const [imagesLoading, setImagesLoading] =
    useState(false);

  const [imagesError, setImagesError] =
    useState("");

  /* =========================================================
     VIDEOS
  ========================================================= */

  const [selectedPostVideos, setSelectedPostVideos] =
    useState([]);

  const [videosLoading, setVideosLoading] =
    useState(false);

  const [videosError, setVideosError] =
    useState("");

  /* =========================================================
     ARTICLE
  ========================================================= */

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [articleSection, setArticleSection] =
    useState("article");

  const [search, setSearch] =
    useState("");

  const [previewImage, setPreviewImage] =
    useState(null);

  /* =========================================================
     LOAD POSTS
  ========================================================= */

  useEffect(() => {
    loadPosts();

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  async function loadPosts() {
    try {
      setLoading(true);
      setError("");

      const data = await getPosts();

      setPosts(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        "Failed to load posts:",
        err
      );

      setError(
        "Unable to load posts."
      );
    } finally {
      setLoading(false);
    }
  }

  /* =========================================================
     LOAD IMAGES CONNECTED TO POST
  ========================================================= */

  async function loadPostImages(postId) {
    if (!postId) {
      setSelectedPostImages([]);
      return;
    }

    try {
      setImagesLoading(true);
      setImagesError("");
      setSelectedPostImages([]);

      const data =
        await getPostImages(postId);

      setSelectedPostImages(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        "Failed to load post images:",
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
     LOAD VIDEOS CONNECTED TO POST
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

      const data =
        await getPostVideos(postId);

      console.log(
        "VIDEOS LOADED FOR POST:",
        postId,
        data
      );

      setSelectedPostVideos(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        "Failed to load post videos:",
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

    setArticleSection(
      "article"
    );

    setMenuOpen(false);

    setPreviewImage(null);

    setSelectedPostImages([]);
    setSelectedPostVideos([]);

    setImagesError("");
    setVideosError("");

    document.body.style.overflow =
      "hidden";

    loadPostImages(post.id);

    loadPostVideos(post.id);
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
      search
        .toLowerCase()
        .trim();

    return posts.filter(
      (post) => {
        const title =
          post.title || "";

        const excerpt =
          post.excerpt || "";

        const content =
          post.content || "";

        const category =
          post.category?.name ||
          post.category ||
          "";

        return `${title} ${excerpt} ${content} ${category}`
          .toLowerCase()
          .includes(query);
      }
    );
  }

  /* =========================================================
     EXCERPT
  ========================================================= */

  function getExcerpt(
    content = ""
  ) {
    const clean =
      String(content)
        .replace(
          /<[^>]*>/g,
          ""
        )
        .replace(
          /[#*_>`]/g,
          ""
        )
        .replace(
          /\s+/g,
          " "
        )
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
     ESCAPE HTML
  ========================================================= */

  function escapeHtml(
    text = ""
  ) {
    return String(text)
      .replace(
        /&/g,
        "&amp;"
      )
      .replace(
        /</g,
        "&lt;"
      )
      .replace(
        />/g,
        "&gt;"
      )
      .replace(
        /"/g,
        "&quot;"
      )
      .replace(
        /'/g,
        "&#039;"
      );
  }

  /* =========================================================
     CLEAN ARTICLE CONTENT
  ========================================================= */

  function cleanArticleContent(
    content = ""
  ) {
    if (
      !content ||
      !String(content).trim()
    ) {
      return "";
    }

    content = String(content);

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
            pre.querySelector(
              "code"
            );

          if (!code) {
            return;
          }

          const wrapper =
            doc.createElement(
              "div"
            );

          wrapper.className =
            "code-block";

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
              "code-language";

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

          pre.replaceWith(
            wrapper
          );
        });

      return doc.body.innerHTML;
    }

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
        trimmed.startsWith(
          "```"
        )
      ) {
        if (
          !insideCodeBlock
        ) {
          insideCodeBlock =
            true;

          codeContent = "";

          codeLanguage =
            trimmed
              .replace(
                /^```/,
                ""
              )
              .trim();
        } else {
          insideCodeBlock =
            false;

          html += `
            <div class="code-block">
              ${
                codeLanguage
                  ? `
                    <span class="code-language">
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
          <div class="content-space"></div>
        `;

        return;
      }

      if (
        trimmed.startsWith(
          "###"
        )
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
        trimmed.startsWith(
          "##"
        )
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
        trimmed.startsWith(
          "#"
        )
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
          ${escapeHtml(
            line
          )}
        </p>
      `;
    });

    if (insideCodeBlock) {
      html += `
        <div class="code-block">
          ${
            codeLanguage
              ? `
                <span class="code-language">
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

    return new Date(
      date
    ).toLocaleDateString(
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
    return (
      post?.category?.name ||
      post?.category ||
      "ARTICLE"
    );
  }

  /* =========================================================
     IMAGE URL
  ========================================================= */

  function getPostImageUrl(
    image
  ) {
    if (!image) {
      return "";
    }

    try {
      return getImageUrl(
        image
      );
    } catch {
      return "";
    }
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section className="posts-page">

      {/* =====================================================
          PAGE CONTENT
      ===================================================== */}

      <div className="posts-page-content">

        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <header className="posts-header">

          <div className="posts-header-content">

            <span className="posts-eyebrow">
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

          <div className="post-count">

            <span>
              POSTS
            </span>

            <strong>
              {posts.length}
            </strong>

          </div>

        </header>


        {/* =====================================================
            SEARCH TOOLBAR
        ===================================================== */}

        <div className="posts-toolbar">

          <div className="search-box">

            <span className="search-icon">
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
                className="search-clear"
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
            className="refresh-button"
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
          <div className="posts-state">

            <div className="loader"></div>

            <span>
              Loading posts...
            </span>

          </div>
        )}


        {/* =====================================================
            ERROR
        ===================================================== */}

        {error &&
          !loading && (
            <div className="posts-state error">

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
          filteredPosts().length ===
            0 && (
            <div className="posts-state">

              <div className="empty-icon">
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
          filteredPosts().length >
            0 && (

          <div className="posts-grid">

            {filteredPosts().map(
              (
                post,
                index
              ) => {

                const coverImage =
                  getPostImageUrl(
                    post.image
                  );

                return (
                  <article
                    className="post-card"
                    key={
                      post.id ||
                      index
                    }
                    onClick={() =>
                      openPost(
                        post
                      )
                    }
                  >

                    <div className="post-card-image">

                      {coverImage ? (
                        <img
                          src={
                            coverImage
                          }
                          alt={
                            post.title ||
                            "Post cover"
                          }
                          loading="lazy"
                          onError={(
                            e
                          ) => {
                            e.currentTarget.style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <div className="post-card-image-empty">

                          <span>
                            ◈
                          </span>

                        </div>
                      )}

                    </div>


                    <div className="post-card-overlay"></div>


                    <div className="post-card-top">

                      <span className="post-number">
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <span className="post-category">
                        {getCategory(
                          post
                        )}
                      </span>

                    </div>


                    <div className="post-card-content">

                      <h2>
                        {post.title ||
                          "Untitled Post"}
                      </h2>

                      <p>
                        {post.excerpt
                          ? post.excerpt
                          : getExcerpt(
                              post.content
                            )}
                      </p>

                      <div className="post-meta">

                        <span>
                          {post.date_created
                            ? new Date(
                                post.date_created
                              ).toLocaleDateString()
                            : "Published"}
                        </span>

                        <span className="post-open">
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
            className="article-overlay"
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
              className="article-window"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* =================================================
                  ARTICLE TOP BAR
              ================================================= */}

              <header className="article-topbar">

                <button
                  className="back-button"
                  onClick={
                    closePost
                  }
                >
                  ← Contents
                </button>

                <div className="article-topbar-title">
                  {getCategory(
                    selectedPost
                  )}
                </div>

                <button
                  className="article-menu-button"
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
                  ARTICLE MENU
              ================================================= */}

              {menuOpen && (

                <div className="article-menu">

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


                  <div className="menu-divider"></div>


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
                  SCROLL AREA
              ================================================= */}

              <div className="article-scroll">

                {/* =================================================
                    ARTICLE
                ================================================= */}

                {articleSection ===
                  "article" && (

                  <article className="article-content">

                    <div className="article-heading">

                      <span className="eyebrow">
                        {getCategory(
                          selectedPost
                        )}
                      </span>

                      <h1>
                        {selectedPost.title ||
                          "Untitled Post"}
                      </h1>

                      {selectedPost.excerpt && (
                        <p className="article-excerpt">
                          {
                            selectedPost.excerpt
                          }
                        </p>
                      )}

                      <div className="article-meta">

                        <span>
                          {formatDate(
                            selectedPost.date_created
                          )}
                        </span>

                        <span>
                          •
                        </span>

                        <span>
                          {selectedPost.author ||
                            "Jeremiah V. Estillore"}
                        </span>

                      </div>

                    </div>


                    <div className="article-divider"></div>


                    <div className="article-body">

                      {selectedPost.content ? (

                        <div
                          className="content-rendered"
                          dangerouslySetInnerHTML={{
                            __html:
                              cleanArticleContent(
                                selectedPost.content
                              ),
                          }}
                        />

                      ) : (

                        <div className="article-no-content">

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

                  <section className="article-media-page">

                    <div className="media-header">

                      <div className="media-header-copy">

                        <span className="eyebrow">
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


                      <div className="media-header-actions">

                        <button
                          className="media-action-button"
                          onClick={() =>
                            setArticleSection(
                              "article"
                            )
                          }
                        >
                          ← Article
                        </button>

                        <button
                          className="media-action-button"
                          onClick={() =>
                            loadPostImages(
                              selectedPost.id
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

                      <div className="media-status">

                        <div className="loader"></div>

                        <p>
                          Loading images...
                        </p>

                      </div>

                    )}


                    {imagesError &&
                      !imagesLoading && (

                      <div className="media-status error">

                        <span>
                          {
                            imagesError
                          }
                        </span>

                        <button
                          onClick={() =>
                            loadPostImages(
                              selectedPost.id
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

                      <div className="media-empty">

                        <div className="media-empty-icon">
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

                      <div className="article-images-grid">

                        {selectedPostImages.map(
                          (
                            item,
                            index
                          ) => {

                            const file =
                              item?.post_images ||
                              item?.image ||
                              item;

                            if (!file) {
                              return null;
                            }

                            const fileId =
                              file.id ||
                              file.file_id;

                            if (!fileId) {
                              return null;
                            }

                            const imageUrl =
                              getAssetUrl(
                                fileId
                              );

                            const imageTitle =
                              file.title ||
                              file.filename_download ||
                              `Article image ${
                                index + 1
                              }`;

                            return (

                              <article
                                className="article-image-card"
                                key={
                                  item.id ||
                                  fileId ||
                                  index
                                }
                              >

                                <button
                                  className="article-image-button"
                                  onClick={() =>
                                    setPreviewImage(
                                      {
                                        url:
                                          imageUrl,
                                        title:
                                          imageTitle,
                                      }
                                    )
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

                                  <span className="image-view-label">
                                    View Image ↗
                                  </span>

                                </button>


                                <div className="article-image-info">

                                  <span className="image-file-type">
                                    {file.type ||
                                      "IMAGE"}
                                  </span>

                                  <h3>
                                    {
                                      imageTitle
                                    }
                                  </h3>

                                  <p>
                                    {file.filename_download ||
                                      "Directus file"}
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

                  <section className="article-media-page">

                    <div className="media-header">

                      <div className="media-header-copy">

                        <span className="eyebrow">
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


                      <div className="media-header-actions">

                        <button
                          className="media-action-button"
                          onClick={() =>
                            setArticleSection(
                              "article"
                            )
                          }
                        >
                          ← Article
                        </button>

                        <button
                          className="media-action-button"
                          onClick={() =>
                            loadPostVideos(
                              selectedPost.id
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

                      <div className="media-status">

                        <div className="loader"></div>

                        <p>
                          Loading videos...
                        </p>

                      </div>

                    )}


                    {videosError &&
                      !videosLoading && (

                      <div className="media-status error">

                        <span>
                          {
                            videosError
                          }
                        </span>

                        <button
                          onClick={() =>
                            loadPostVideos(
                              selectedPost.id
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

                      <div className="media-empty">

                        <div className="media-empty-icon">
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

                      <div className="article-videos-grid">

                        {selectedPostVideos.map(
                          (
                            item,
                            index
                          ) => {

                            const file =
                              item?.post_videos ||
                              item?.video ||
                              item;

                            if (!file) {
                              return null;
                            }

                            const fileId =
                              file.id ||
                              file.file_id;

                            if (!fileId) {
                              return null;
                            }

                            const videoUrl =
                              getAssetUrl(
                                fileId
                              );

                            const videoTitle =
                              file.title ||
                              file.filename_download ||
                              `Tutorial Video ${
                                index + 1
                              }`;

                            const videoType =
                              file.type ||
                              "video/mp4";

                            return (

                              <article
                                className="article-video-card"
                                key={
                                  item.id ||
                                  fileId ||
                                  index
                                }
                              >

                                <div className="article-video-player">

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


                                <div className="article-video-info">

                                  <span className="video-file-type">
                                    {
                                      videoType
                                    }
                                  </span>

                                  <h3>
                                    {
                                      videoTitle
                                    }
                                  </h3>

                                  <p>
                                    Tutorial video
                                    connected to this
                                    article.
                                  </p>

                                  <div className="video-file-name">
                                    {
                                      file.filename_download ||
                                      "Directus video"
                                    }
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
                  className="image-preview-overlay"
                  onClick={() =>
                    setPreviewImage(
                      null
                    )
                  }
                >

                  <button
                    className="preview-close"
                    onClick={() =>
                      setPreviewImage(
                        null
                      )
                    }
                    aria-label="Close image"
                  >
                    ×
                  </button>


                  <div
                    className="image-preview-content"
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

export default Posts;