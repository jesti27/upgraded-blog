import { useEffect, useMemo, useState } from "react";
import { getPosts } from "../services/payload";
import "./Posts.css";

const PAYLOAD_URL =
  import.meta.env.VITE_PAYLOAD_URL ||
  "http://localhost:7777";


/* =========================================================
   PAYLOAD MEDIA URL
========================================================= */

function getMediaUrl(media) {
  if (!media) {
    return "";
  }

  if (typeof media === "string") {
    if (
      media.startsWith("http://") ||
      media.startsWith("https://") ||
      media.startsWith("data:")
    ) {
      return media;
    }

    return `${PAYLOAD_URL}${media.startsWith("/") ? "" : "/"}${media}`;
  }

  if (media.url) {
    if (
      media.url.startsWith("http://") ||
      media.url.startsWith("https://")
    ) {
      return media.url;
    }

    return `${PAYLOAD_URL}${media.url.startsWith("/") ? "" : "/"}${media.url}`;
  }

  if (media.filename) {
    return `${PAYLOAD_URL}/media/${media.filename}`;
  }

  return "";
}


/* =========================================================
   MEDIA INFORMATION
========================================================= */

function getMediaTitle(media, fallback) {
  if (!media) {
    return fallback;
  }

  return (
    media.title ||
    media.alt ||
    media.filename ||
    fallback
  );
}


/* =========================================================
   LEXICAL TEXT
========================================================= */

function getLexicalText(node) {
  if (!node) {
    return "";
  }

  if (typeof node === "string") {
    return node;
  }

  if (node.text) {
    return node.text;
  }

  if (Array.isArray(node.children)) {
    return node.children
      .map((child) => getLexicalText(child))
      .join(" ");
  }

  return "";
}


/* =========================================================
   LEXICAL NODE RENDERER
========================================================= */

function renderLexicalNode(node, index = 0) {
  if (!node) {
    return null;
  }

  const children = Array.isArray(node.children)
    ? node.children
    : [];

  const childContent = children.map(
    (child, childIndex) =>
      renderLexicalNode(
        child,
        `${index}-${childIndex}`
      )
  );

  switch (node.type) {

    /* -------------------------------------------------------
       ROOT
    ------------------------------------------------------- */

    case "root":
      return (
        <div key={index}>
          {childContent}
        </div>
      );


    /* -------------------------------------------------------
       PARAGRAPH
    ------------------------------------------------------- */

    case "paragraph":
      return (
        <p key={index}>
          {childContent}
        </p>
      );


    /* -------------------------------------------------------
       HEADINGS
    ------------------------------------------------------- */

    case "heading": {
      const tag =
        node.tag === "h1" ||
        node.tag === "h2" ||
        node.tag === "h3" ||
        node.tag === "h4" ||
        node.tag === "h5" ||
        node.tag === "h6"
          ? node.tag
          : "h2";

      const HeadingTag = tag;

      return (
        <HeadingTag key={index}>
          {childContent}
        </HeadingTag>
      );
    }


    /* -------------------------------------------------------
       QUOTE
    ------------------------------------------------------- */

    case "quote":
      return (
        <blockquote key={index}>
          {childContent}
        </blockquote>
      );


    /* -------------------------------------------------------
       LIST
    ------------------------------------------------------- */

    case "list": {
      const listType =
        node.listType === "number"
          ? "ol"
          : "ul";

      const ListTag = listType;

      return (
        <ListTag key={index}>
          {childContent}
        </ListTag>
      );
    }


    /* -------------------------------------------------------
       LIST ITEM
    ------------------------------------------------------- */

    case "listitem":
      return (
        <li key={index}>
          {childContent}
        </li>
      );


    /* -------------------------------------------------------
       LINE BREAK
    ------------------------------------------------------- */

    case "linebreak":
      return <br key={index} />;


    /* -------------------------------------------------------
       CODE
    ------------------------------------------------------- */

    case "code":
      return (
        <div
          className="code-block"
          key={index}
        >
          <code>
            {getLexicalText(node)}
          </code>
        </div>
      );


    /* -------------------------------------------------------
       LINK
    ------------------------------------------------------- */

    case "link": {
      const url =
        node.fields?.url ||
        node.url ||
        "#";

      return (
        <a
          key={index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {childContent}
        </a>
      );
    }


    /* -------------------------------------------------------
       TEXT
    ------------------------------------------------------- */

    case "text": {
      let value = node.text || "";

      /*
       * Lexical formatting:
       * 1 = bold
       * 2 = italic
       * 8 = underline
       */

      if (node.format & 1) {
        value = <strong>{value}</strong>;
      }

      if (node.format & 2) {
        value = <em>{value}</em>;
      }

      if (node.format & 8) {
        value = <u>{value}</u>;
      }

      return (
        <span key={index}>
          {value}
        </span>
      );
    }


    /* -------------------------------------------------------
       DEFAULT
    ------------------------------------------------------- */

    default:
      if (children.length > 0) {
        return (
          <div key={index}>
            {childContent}
          </div>
        );
      }

      return null;
  }
}


/* =========================================================
   LEXICAL CONTENT
========================================================= */

function renderPayloadContent(content) {
  if (!content) {
    return null;
  }

  /*
   * Payload Lexical object
   */

  if (
    typeof content === "object" &&
    content.root
  ) {
    return renderLexicalNode(
      content.root
    );
  }

  /*
   * Payload may occasionally return
   * serialized JSON as a string.
   */

  if (typeof content === "string") {
    try {
      const parsed =
        JSON.parse(content);

      if (parsed?.root) {
        return renderLexicalNode(
          parsed.root
        );
      }
    } catch {
      /*
       * Not JSON.
       * Render as normal text.
       */
    }

    return (
      <p>
        {content}
      </p>
    );
  }

  return null;
}


/* =========================================================
   PLAIN TEXT FOR EXCERPT / SEARCH
========================================================= */

function getContentText(content) {
  if (!content) {
    return "";
  }

  if (typeof content === "string") {
    try {
      const parsed =
        JSON.parse(content);

      return getLexicalText(parsed);
    } catch {
      return content;
    }
  }

  return getLexicalText(content);
}


/* =========================================================
   PAYLOAD CATEGORY
========================================================= */

function getCategory(post) {
  if (!post) {
    return "ARTICLE";
  }

  if (
    typeof post.category === "string"
  ) {
    return post.category;
  }

  if (
    post.category &&
    typeof post.category === "object"
  ) {
    return (
      post.category.name ||
      post.category.title ||
      post.category.label ||
      "ARTICLE"
    );
  }

  return (
    post.categoryName ||
    "ARTICLE"
  );
}


/* =========================================================
   PAYLOAD AUTHOR
========================================================= */

function getAuthor(post) {
  if (!post) {
    return "Jeremiah V. Estillore";
  }

  if (
    typeof post.author === "string"
  ) {
    return post.author;
  }

  if (
    post.author &&
    typeof post.author === "object"
  ) {
    return (
      post.author.name ||
      post.author.username ||
      post.author.email ||
      "Jeremiah V. Estillore"
    );
  }

  return (
    post.authorName ||
    "Jeremiah V. Estillore"
  );
}


/* =========================================================
   POST DATE
========================================================= */

function getPostDate(post) {
  return (
    post?.publishedAt ||
    post?.date ||
    post?.createdAt ||
    post?.updatedAt ||
    ""
  );
}


/* =========================================================
   COVER IMAGE
========================================================= */

function getCoverImage(post) {
  if (!post) {
    return null;
  }

  return (
    post.coverImage ||
    post.image ||
    post.featuredImage ||
    post.thumbnail ||
    null
  );
}


/* =========================================================
   EXCERPT
========================================================= */

function getExcerpt(post) {
  if (post?.excerpt) {
    return post.excerpt;
  }

  const text =
    getContentText(
      post?.content
    )
      .replace(/\s+/g, " ")
      .trim();

  if (!text) {
    return "";
  }

  if (text.length <= 150) {
    return text;
  }

  return `${text.substring(0, 150)}...`;
}


/* =========================================================
   DATE FORMAT
========================================================= */

function formatDate(date) {
  if (!date) {
    return "Published";
  }

  const parsed =
    new Date(date);

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return "Published";
  }

  return parsed.toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
}


/* =========================================================
   RELATED IMAGES
========================================================= */

function getPostImages(post) {
  if (!post) {
    return [];
  }

  const images =
    post.images ||
    post.postImages ||
    post.articleImages ||
    [];

  if (Array.isArray(images)) {
    return images;
  }

  return [];
}


/* =========================================================
   RELATED VIDEOS
========================================================= */

function getPostVideos(post) {
  if (!post) {
    return [];
  }

  const videos =
    post.videos ||
    post.postVideos ||
    post.articleVideos ||
    [];

  if (Array.isArray(videos)) {
    return videos;
  }

  return [];
}


/* =========================================================
   PAYLOAD POSTS PAGE
========================================================= */

function PayloadPosts() {

  const [posts, setPosts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [selectedPost, setSelectedPost] =
    useState(null);

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

  async function loadPosts() {
    try {
      setLoading(true);
      setError("");

      const data =
        await getPosts();

      setPosts(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error(
        "Failed to load Payload posts:",
        err
      );

      setError(
        "Unable to load posts."
      );

      setPosts([]);

    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    loadPosts();

    return () => {
      document.body.style.overflow =
        "";
    };
  }, []);


  /* =========================================================
     ESCAPE KEY
  ========================================================= */

  useEffect(() => {

    function handleKeyDown(event) {

      if (
        event.key === "Escape"
      ) {

        if (previewImage) {
          setPreviewImage(null);
          return;
        }

        if (selectedPost) {
          closePost();
        }

      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };

  }, [
    selectedPost,
    previewImage,
  ]);


  /* =========================================================
     FILTERED POSTS
  ========================================================= */

  const filteredPosts =
    useMemo(() => {

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
            getContentText(
              post.content
            );

          const category =
            getCategory(post);

          const author =
            getAuthor(post);

          return `
            ${title}
            ${excerpt}
            ${content}
            ${category}
            ${author}
          `
            .toLowerCase()
            .includes(query);
        }
      );

    }, [
      posts,
      search,
    ]);


  /* =========================================================
     OPEN POST
  ========================================================= */

  function openPost(post) {

    setSelectedPost(post);

    setArticleSection(
      "article"
    );

    setMenuOpen(false);

    setPreviewImage(null);

    document.body.style.overflow =
      "hidden";
  }


  /* =========================================================
     CLOSE POST
  ========================================================= */

  function closePost() {

    setSelectedPost(null);

    setMenuOpen(false);

    setPreviewImage(null);

    setArticleSection(
      "article"
    );

    document.body.style.overflow =
      "";
  }


  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <section className="posts-page">

      <div className="posts-page-content">

        {/* =================================================
            HEADER
        ================================================= */}

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


        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="posts-toolbar">

          <div className="search-box">

            <span className="search-icon">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
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


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="posts-state">

            <div className="loader"></div>

            <span>
              Loading posts...
            </span>

          </div>
        )}


        {/* =================================================
            ERROR
        ================================================= */}

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


        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading &&
          !error &&
          filteredPosts.length === 0 && (
            <div className="posts-state">

              <div className="empty-icon">
                ◇
              </div>

              <span>
                No posts found.
              </span>

            </div>
          )}


        {/* =================================================
            POSTS GRID
        ================================================= */}

        {!loading &&
          !error &&
          filteredPosts.length > 0 && (

            <div className="posts-grid">

              {filteredPosts.map(
                (post, index) => {

                  const coverImage =
                    getMediaUrl(
                      getCoverImage(
                        post
                      )
                    );

                  return (
                    <article
                      className="post-card"
                      key={
                        post.id ||
                        post.slug ||
                        index
                      }
                      onClick={() =>
                        openPost(post)
                      }
                    >

                      <div className="post-card-image">

                        {coverImage ? (
                          <img
                            src={coverImage}
                            alt={
                              post.title ||
                              "Post cover"
                            }
                            loading="lazy"
                            onError={(event) => {
                              event.currentTarget.style.display =
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
                          {getExcerpt(
                            post
                          )}
                        </p>

                        <div className="post-meta">

                          <span>
                            {formatDate(
                              getPostDate(
                                post
                              )
                            )}
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


        {/* =================================================
            ARTICLE MODAL
        ================================================= */}

        {selectedPost && (

          <div
            className="article-overlay"
            onClick={(event) => {

              if (
                event.target ===
                event.currentTarget
              ) {
                closePost();
              }

            }}
          >

            <article
              className="article-window"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              {/* =================================================
                  TOP BAR
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
                      (previous) =>
                        !previous
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


                    <div className="article-divider"></div>


                    <div className="article-body">

                      {selectedPost.content ? (

                        <div className="content-rendered">

                          {renderPayloadContent(
                            selectedPost.content
                          )}

                        </div>

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

                      </div>

                    </div>


                    {getPostImages(
                      selectedPost
                    ).length === 0 && (

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


                    {getPostImages(
                      selectedPost
                    ).length > 0 && (

                      <div className="article-images-grid">

                        {getPostImages(
                          selectedPost
                        ).map(
                          (
                            item,
                            index
                          ) => {

                            const media =
                              item?.image ||
                              item?.media ||
                              item;

                            const imageUrl =
                              getMediaUrl(
                                media
                              );

                            if (!imageUrl) {
                              return null;
                            }

                            const imageTitle =
                              getMediaTitle(
                                media,
                                `Article image ${
                                  index + 1
                                }`
                              );

                            return (
                              <article
                                className="article-image-card"
                                key={
                                  item?.id ||
                                  media?.id ||
                                  index
                                }
                              >

                                <button
                                  className="article-image-button"
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

                                  <span className="image-view-label">
                                    View Image ↗
                                  </span>

                                </button>


                                <div className="article-image-info">

                                  <span className="image-file-type">
                                    IMAGE
                                  </span>

                                  <h3>
                                    {
                                      imageTitle
                                    }
                                  </h3>

                                  <p>
                                    {
                                      media?.filename ||
                                      "Payload media"
                                    }
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

                      </div>

                    </div>


                    {getPostVideos(
                      selectedPost
                    ).length === 0 && (

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


                    {getPostVideos(
                      selectedPost
                    ).length > 0 && (

                      <div className="article-videos-grid">

                        {getPostVideos(
                          selectedPost
                        ).map(
                          (
                            item,
                            index
                          ) => {

                            const media =
                              item?.video ||
                              item?.media ||
                              item;

                            const videoUrl =
                              getMediaUrl(
                                media
                              );

                            if (!videoUrl) {
                              return null;
                            }

                            const videoTitle =
                              getMediaTitle(
                                media,
                                `Tutorial Video ${
                                  index + 1
                                }`
                              );

                            const videoType =
                              media?.mimeType ||
                              media?.type ||
                              "video/mp4";

                            return (
                              <article
                                className="article-video-card"
                                key={
                                  item?.id ||
                                  media?.id ||
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
                                      media?.filename ||
                                      "Payload video"
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
                    onClick={(event) =>
                      event.stopPropagation()
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

export default PayloadPosts;