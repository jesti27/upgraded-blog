
import { useEffect, useState } from "react";
import { getStrapiPosts } from "../services/strapi";
import "./StrapiHome.css";

function StrapiHome({ onNavigate }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await getStrapiPosts();

        /*
        =====================================================
        STRAPI POSTS
        =====================================================

        Strapi Home only reads and displays posts.

        It does NOT:
        - create posts
        - upload posts
        - edit posts
        - delete posts
        - upload images
        - upload videos

        Post management is handled separately through Strapi.
        =====================================================
        */

        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Strapi Home error:", err);
        setError("Unable to load Strapi posts.");
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  /*
  =========================================================
  FEATURED POSTS
  =========================================================
  */

  const featuredPosts = posts;

  return (
    <section className="strapi-home-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <div className="strapi-home-hero">

        <div className="strapi-hero-label">
          <span className="strapi-hero-line"></span>
          SYSTEM PROJECTS
        </div>

        <h1>
          Build.
          <br />
          <span>Connect.</span>
          <br />
          Create.
        </h1>

        <p>
          A centralized platform for projects, technical
          documentation, experiments, and digital content
          powered by Strapi CMS.
        </p>

        <div className="strapi-hero-actions">

          <button
            className="strapi-primary-button"
            onClick={() => onNavigate("strapi-posts")}
          >
            Explore Posts
            <span>↗</span>
          </button>

          <button
            className="strapi-secondary-button"
            onClick={() => onNavigate("strapi-about")}
          >
            About System
          </button>

        </div>

      </div>

      {/* =====================================================
          BENTO CONTENT
      ===================================================== */}

      <div className="strapi-home-bento">

        {/* ===================================================
            INTRO CARD
        =================================================== */}

        <div className="strapi-bento-card strapi-intro-card">

          <div className="strapi-card-glow"></div>

          <span className="strapi-card-number">
            01
          </span>

          <div className="strapi-card-content">

            <span className="strapi-eyebrow">
              DIGITAL WORKSPACE
            </span>

            <h2>
              One system.
              <br />
              Multiple technologies.
            </h2>

            <p>
              Content is managed through Strapi CMS and
              displayed dynamically through the connected
              React application.
            </p>

          </div>

          <div className="strapi-card-icon">
            ✦
          </div>

        </div>

        {/* ===================================================
            FEATURED CARD
        =================================================== */}

        <div
          className="strapi-bento-card strapi-featured-card"
          onClick={() => onNavigate("strapi-posts")}
        >

          <div className="strapi-image-overlay"></div>

          <div className="strapi-fake-image"></div>

          <div className="strapi-card-content strapi-card-content-bottom">

            <span className="strapi-eyebrow">
              FEATURED
            </span>

            <h2>
              Explore the latest content
            </h2>

            <p>
              Browse all published technical articles
              and system projects.
            </p>

            <span className="strapi-card-arrow">
              ↗
            </span>

          </div>

        </div>

        {/* ===================================================
            STAT CARD
        =================================================== */}

        <div className="strapi-bento-card strapi-stat-card">

          <span className="strapi-card-number">
            02
          </span>

          <div>

            <span className="strapi-eyebrow">
              PUBLISHED
            </span>

            <div className="strapi-stat-number">
              {loading ? "—" : posts.length}
            </div>

            <p>
              Available posts
            </p>

          </div>

        </div>

        {/* ===================================================
            SYSTEM CARD
        =================================================== */}

        <div className="strapi-bento-card strapi-system-card">

          <div className="strapi-system-orbit">

            <span>R</span>
            <span>S</span>
            <span>P</span>

          </div>

          <div className="strapi-card-content strapi-card-content-bottom">

            <span className="strapi-eyebrow">
              CONNECTED SYSTEM
            </span>

            <h3>
              React + Strapi
            </h3>

            <p>
              Dynamic content delivery through the
              connected React and Strapi application stack.
            </p>

          </div>

        </div>

        {/* ===================================================
            LATEST POSTS CARD
        =================================================== */}

        <div className="strapi-bento-card strapi-latest-card">

          <div className="strapi-latest-header">

            <div>

              <span className="strapi-eyebrow">
                LATEST
              </span>

              <h3>
                Recent Content
              </h3>

            </div>

            <button
              onClick={() => onNavigate("strapi-posts")}
            >
              View all ↗
            </button>

          </div>

          <div className="strapi-latest-list">

            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (
              <div className="strapi-loading-message">
                Loading posts...
              </div>
            )}

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <div className="strapi-error-message">
                {error}
              </div>
            )}

            {/* =================================================
                EMPTY
            ================================================= */}

            {!loading &&
              !error &&
              featuredPosts.length === 0 && (
                <div className="strapi-empty-message">
                  No posts available yet.
                </div>
              )}

            {/* =================================================
                POSTS
            ================================================= */}

            {!loading &&
              !error &&
              featuredPosts.map((post, index) => {

                /*
                =================================================
                STRAPI RESPONSE COMPATIBILITY

                Supports:

                Strapi v4:
                post.attributes.title

                Strapi v5:
                post.title
                =================================================
                */

                const title =
                  post?.title ||
                  post?.attributes?.title ||
                  "Untitled Post";

                const id =
                  post?.id ||
                  post?.documentId ||
                  post?.attributes?.documentId ||
                  index;

                return (
                  <button
                    className="strapi-latest-item"
                    key={id}
                    onClick={() =>
                      onNavigate("strapi-posts")
                    }
                  >

                    <span className="strapi-latest-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="strapi-latest-title">
                      {title}
                    </span>

                    <span className="strapi-latest-arrow">
                      →
                    </span>

                  </button>
                );
              })}

          </div>

        </div>

      </div>

    </section>
  );
}

export default StrapiHome;

