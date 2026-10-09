import { useState } from "react";

import CMSSelector from "./pages/CMSSelector";

import Home from "./pages/Home";
import Posts from "./pages/Posts";
import About from "./pages/About";

import StrapiHome from "./pages/StrapiHome";
import StrapiPosts from "./pages/StrapiPosts";
import StrapiAbout from "./pages/StrapiAbout";

import PayloadHome from "./pages/PayloadHome";
import PayloadPosts from "./pages/PayloadPosts";
import PayloadAbout from "./pages/PayloadAbout";

import "./App.css";

function App() {
  // ========================================
  // INITIAL PAGE
  // ========================================

  const [page, setPage] = useState("cms");

  // ========================================
  // NAVIGATION
  // ========================================

  const navigate = (newPage) => {
    setPage(newPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="app">

      {/* ==================================================
          CMS SELECTOR
      ================================================== */}

      {page === "cms" && (
        <CMSSelector
          onNavigate={navigate}
        />
      )}


      {/* ==================================================
          DIRECTUS SYSTEM
          HOME / POSTS / ABOUT
      ================================================== */}

      {(page === "directus" ||
        page === "posts" ||
        page === "about") && (

        <div className="cms-system">

          {/* ==================================================
              DIRECTUS HEADER
          ================================================== */}

          <header className="site-header">

            <div className="nav-container">

              {/* BRAND */}

              <button
                className="brand"
                onClick={() => navigate("cms")}
                aria-label="Back to CMS selector"
              >

                <span className="brand-symbol">
                  J
                </span>

                <span className="brand-text">
                  <strong>
                    JV
                  </strong>

                  <small>
                    PROJECTS
                  </small>
                </span>

              </button>


              {/* DIRECTUS NAVIGATION */}

              <nav className="main-nav">

                <button
                  className={`nav-link ${
                    page === "directus"
                      ? "active"
                      : ""
                  }`}
                  onClick={() => navigate("directus")}
                >
                  Home
                </button>

                <button
                  className={`nav-link ${
                    page === "posts"
                      ? "active"
                      : ""
                  }`}
                  onClick={() => navigate("posts")}
                >
                  Posts
                </button>

                <button
                  className={`nav-link ${
                    page === "about"
                      ? "active"
                      : ""
                  }`}
                  onClick={() => navigate("about")}
                >
                  About
                </button>

                <button
                  className="nav-link"
                  onClick={() => navigate("cms")}
                >
                  CMS
                </button>

              </nav>


              {/* DIRECTUS STATUS */}

              <div className="nav-status">

                <span className="status-dot"></span>

                <span>
                  DIRECTUS
                </span>

              </div>

            </div>

          </header>


          {/* ==================================================
              DIRECTUS PAGE CONTENT
          ================================================== */}

          <main className="page-container">

            {page === "directus" && (
              <Home
                onNavigate={navigate}
              />
            )}

            {page === "posts" && (
              <Posts
                onNavigate={navigate}
              />
            )}

            {page === "about" && (
              <About
                onNavigate={navigate}
              />
            )}

          </main>


          {/* ==================================================
              DIRECTUS FOOTER
          ================================================== */}

          <footer className="site-footer">

            <div className="footer-grid">

              {/* FOOTER BRAND */}

              <div>

                <div className="footer-logo">

                  <span className="brand-symbol">
                    J
                  </span>

                  <span>
                    JV PROJECTS
                  </span>

                </div>

                <p className="footer-description">
                  A modern multi-container content platform
                  built with modern web technologies.
                </p>

              </div>


              {/* FOOTER LINKS */}

              <div className="footer-links">

                <button
                  onClick={() => navigate("cms")}
                >
                  CMS Selector
                </button>

                <button
                  onClick={() => navigate("directus")}
                >
                  Directus
                </button>

                <button
                  onClick={() => navigate("posts")}
                >
                  Posts
                </button>

                <button
                  onClick={() => navigate("about")}
                >
                  About
                </button>

              </div>


              {/* CMS */}

              <div className="developer">

                <span>
                  CMS
                </span>

                <strong>
                  Directus
                </strong>

              </div>

            </div>


            {/* FOOTER BOTTOM */}

            <div className="footer-bottom">

              <span>
                © 2026 JV Projects
              </span>

              <span>
                Directus CMS
              </span>

            </div>

          </footer>

        </div>
      )}


      {/* ==================================================
          STRAPI SYSTEM
          HOME / POSTS / ABOUT
      ================================================== */}

      {(page === "strapi" ||
        page === "strapi-posts" ||
        page === "strapi-about") && (

        <div className="cms-system">

          {/* ==================================================
              STRAPI HEADER
          ================================================== */}

          <header className="site-header">

            <div className="nav-container">

              {/* BRAND */}

              <button
                className="brand"
                onClick={() => navigate("cms")}
                aria-label="Back to CMS selector"
              >

                <span className="brand-symbol">
                  J
                </span>

                <span className="brand-text">

                  <strong>
                    JV
                  </strong>

                  <small>
                    PROJECTS
                  </small>

                </span>

              </button>


              {/* STRAPI NAVIGATION */}

              <nav className="main-nav">

                <button
                  className={`nav-link ${
                    page === "strapi"
                      ? "active"
                      : ""
                  }`}
                  onClick={() => navigate("strapi")}
                >
                  Home
                </button>

                <button
                  className={`nav-link ${
                    page === "strapi-posts"
                      ? "active"
                      : ""
                  }`}
                  onClick={() => navigate("strapi-posts")}
                >
                  Posts
                </button>

                <button
                  className={`nav-link ${
                    page === "strapi-about"
                      ? "active"
                      : ""
                  }`}
                  onClick={() => navigate("strapi-about")}
                >
                  About
                </button>

                <button
                  className="nav-link"
                  onClick={() => navigate("cms")}
                >
                  CMS
                </button>

              </nav>


              {/* STRAPI STATUS */}

              <div className="nav-status">

                <span className="status-dot"></span>

                <span>
                  STRAPI
                </span>

              </div>

            </div>

          </header>


          {/* ==================================================
              STRAPI PAGE CONTENT
          ================================================== */}

          <main className="page-container">

            {page === "strapi" && (
              <StrapiHome
                onNavigate={navigate}
              />
            )}

            {page === "strapi-posts" && (
              <StrapiPosts
                onNavigate={navigate}
              />
            )}

            {page === "strapi-about" && (
              <StrapiAbout
                onNavigate={navigate}
              />
            )}

          </main>


          {/* ==================================================
              STRAPI FOOTER
          ================================================== */}

          <footer className="site-footer">

            <div className="footer-grid">

              {/* FOOTER BRAND */}

              <div>

                <div className="footer-logo">

                  <span className="brand-symbol">
                    J
                  </span>

                  <span>
                    JV PROJECTS
                  </span>

                </div>

                <p className="footer-description">
                  A modern multi-container content platform
                  built with modern web technologies.
                </p>

              </div>


              {/* FOOTER LINKS */}

              <div className="footer-links">

                <button
                  onClick={() => navigate("cms")}
                >
                  CMS Selector
                </button>

                <button
                  onClick={() => navigate("strapi")}
                >
                  Home
                </button>

                <button
                  onClick={() => navigate("strapi-posts")}
                >
                  Posts
                </button>

                <button
                  onClick={() => navigate("strapi-about")}
                >
                  About
                </button>

              </div>


              {/* CMS */}

              <div className="developer">

                <span>
                  CMS
                </span>

                <strong>
                  Strapi
                </strong>

              </div>

            </div>


            {/* FOOTER BOTTOM */}

            <div className="footer-bottom">

              <span>
                © 2026 JV Projects
              </span>

              <span>
                Strapi CMS
              </span>

            </div>

          </footer>

        </div>
      )}


      {/* ==================================================
          PAYLOAD CMS SYSTEM
          HOME / POSTS / ABOUT
      ================================================== */}

      {(page === "payload" ||
        page === "payload-posts" ||
        page === "payload-about") && (

        <div className="cms-system">

          {/* ==================================================
              PAYLOAD HEADER
          ================================================== */}

          <header className="site-header">

            <div className="nav-container">

              {/* BRAND */}

              <button
                className="brand"
                onClick={() => navigate("cms")}
                aria-label="Back to CMS selector"
              >

                <span className="brand-symbol">
                  J
                </span>

                <span className="brand-text">

                  <strong>
                    JV
                  </strong>

                  <small>
                    PROJECTS
                  </small>

                </span>

              </button>


              {/* PAYLOAD NAVIGATION */}

              <nav className="main-nav">

                <button
                  className={`nav-link ${
                    page === "payload"
                      ? "active"
                      : ""
                  }`}
                  onClick={() => navigate("payload")}
                >
                  Home
                </button>

                <button
                  className={`nav-link ${
                    page === "payload-posts"
                      ? "active"
                      : ""
                  }`}
                  onClick={() => navigate("payload-posts")}
                >
                  Posts
                </button>

                <button
                  className={`nav-link ${
                    page === "payload-about"
                      ? "active"
                      : ""
                  }`}
                  onClick={() => navigate("payload-about")}
                >
                  About
                </button>

                <button
                  className="nav-link"
                  onClick={() => navigate("cms")}
                >
                  CMS
                </button>

              </nav>


              {/* PAYLOAD STATUS */}

              <div className="nav-status">

                <span className="status-dot"></span>

                <span>
                  PAYLOAD
                </span>

              </div>

            </div>

          </header>


          {/* ==================================================
              PAYLOAD PAGE CONTENT
          ================================================== */}

          <main className="page-container">

            {page === "payload" && (
              <PayloadHome
                onNavigate={navigate}
              />
            )}

            {page === "payload-posts" && (
              <PayloadPosts
                onNavigate={navigate}
              />
            )}

            {page === "payload-about" && (
              <PayloadAbout
                onNavigate={navigate}
              />
            )}

          </main>


          {/* ==================================================
              PAYLOAD FOOTER
          ================================================== */}

          <footer className="site-footer">

            <div className="footer-grid">

              {/* FOOTER BRAND */}

              <div>

                <div className="footer-logo">

                  <span className="brand-symbol">
                    J
                  </span>

                  <span>
                    JV PROJECTS
                  </span>

                </div>

                <p className="footer-description">
                  A modern multi-container content platform
                  built with modern web technologies.
                </p>

              </div>


              {/* FOOTER LINKS */}

              <div className="footer-links">

                <button
                  onClick={() => navigate("cms")}
                >
                  CMS Selector
                </button>

                <button
                  onClick={() => navigate("payload")}
                >
                  Home
                </button>

                <button
                  onClick={() => navigate("payload-posts")}
                >
                  Posts
                </button>

                <button
                  onClick={() => navigate("payload-about")}
                >
                  About
                </button>

              </div>


              {/* CMS */}

              <div className="developer">

                <span>
                  CMS
                </span>

                <strong>
                  PayloadCMS
                </strong>

              </div>

            </div>


            {/* FOOTER BOTTOM */}

            <div className="footer-bottom">

              <span>
                © 2026 JV Projects
              </span>

              <span>
                PayloadCMS
              </span>

            </div>

          </footer>

        </div>
      )}

    </div>
  );
}

export default App;