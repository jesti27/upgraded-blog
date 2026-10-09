import { useEffect, useState } from "react";
import { getPosts } from "../services/payload";
import "./Home.css";

function PayloadHome({ onNavigate }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadPosts() {
      try {
        setLoading(true);
        setError("");

        const data = await getPosts();

        if (!mounted) {
          return;
        }

        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load Payload posts:", err);

        if (mounted) {
          setError("Unable to load posts.");
          setPosts([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadPosts();

    return () => {
      mounted = false;
    };
  }, []);

  const featuredPosts = posts;

  return (
    <section className="home-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <div className="home-hero">

        <div className="hero-label">
          <span className="hero-line"></span>
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
          documentation, experiments, and digital content.
        </p>

        <div className="hero-actions">

          <button
            className="primary-button"
            onClick={() => onNavigate("payload-posts")}
          >
            Explore Posts
            <span>↗</span>
          </button>

          <button
            className="secondary-button"
            onClick={() => onNavigate("payload-about")}
          >
            About System
          </button>

        </div>

      </div>


      {/* =====================================================
          BENTO GRID
      ===================================================== */}

      <div className="home-bento">

        {/* =================================================
            INTRO CARD
        ================================================= */}

        <div className="bento-card intro-card">

          <div className="card-glow"></div>

          <span className="card-number">
            01
          </span>

          <div className="card-content">

            <span className="eyebrow">
              DIGITAL WORKSPACE
            </span>

            <h2>
              One system.
              <br />
              Multiple technologies.
            </h2>

            <p>
              Content is managed through the connected
              Payload backend and displayed dynamically
              on the web.
            </p>

          </div>

          <div className="card-icon">
            ✦
          </div>

        </div>


        {/* =================================================
            FEATURED POST
        ================================================= */}

        <div
          className="bento-card featured-card"
          onClick={() => onNavigate("payload-posts")}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (
              event.key === "Enter" ||
              event.key === " "
            ) {
              event.preventDefault();
              onNavigate("payload-posts");
            }
          }}
        >

          <div className="image-overlay"></div>

          <div className="fake-image image-one"></div>

          <div className="card-content bottom">

            <span className="eyebrow">
              FEATURED
            </span>

            <h2>
              Explore the latest content
            </h2>

            <p>
              Browse all published technical articles
              and system projects.
            </p>

            <span className="card-arrow">
              ↗
            </span>

          </div>

        </div>


        {/* =================================================
            POSTS COUNT
        ================================================= */}

        <div className="bento-card stat-card">

          <span className="card-number">
            02
          </span>

          <div>

            <span className="eyebrow">
              PUBLISHED
            </span>

            <div className="stat-number">
              {loading ? "—" : posts.length}
            </div>

            <p>
              Available posts
            </p>

          </div>

        </div>


        {/* =================================================
            SYSTEM CARD
        ================================================= */}

        <div className="bento-card system-card">

          <div className="system-orbit">
            <span>R</span>
            <span>P</span>
            <span>P</span>
          </div>

          <div className="card-content bottom">

            <span className="eyebrow">
              CONNECTED SYSTEM
            </span>

            <h3>
              React + Payload
            </h3>

            <p>
              Dynamic content delivery through the
              connected React and Payload application stack.
            </p>

          </div>

        </div>


        {/* =================================================
            LATEST CONTENT
        ================================================= */}

        <div className="bento-card latest-card">

          <div className="latest-header">

            <div>

              <span className="eyebrow">
                LATEST
              </span>

              <h3>
                Recent Content
              </h3>

            </div>

            <button
              onClick={() =>
                onNavigate("payload-posts")
              }
            >
              View all ↗
            </button>

          </div>


          <div className="latest-list">

            {/* LOADING */}

            {loading && (
              <div className="loading-message">
                Loading posts...
              </div>
            )}


            {/* ERROR */}

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}


            {/* EMPTY */}

            {!loading &&
              !error &&
              featuredPosts.length === 0 && (
                <div className="empty-message">
                  No posts available yet.
                </div>
              )}


            {/* POSTS */}

            {!loading &&
              !error &&
              featuredPosts.map((post, index) => (

                <button
                  className="latest-item"
                  key={post.id || index}
                  onClick={() =>
                    onNavigate("payload-posts")
                  }
                >

                  <span className="latest-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="latest-title">
                    {post.title || "Untitled Post"}
                  </span>

                  <span className="latest-arrow">
                    →
                  </span>

                </button>

              ))}

          </div>

        </div>

      </div>

    </section>
  );
}

export default PayloadHome;