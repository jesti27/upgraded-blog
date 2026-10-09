
import "./CMSSelector.css";

function CMSSelector({ onNavigate }) {
  return (
    <section className="cms-page">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="cms-page-header">

        <div className="cms-page-label">
          <span className="cms-page-line"></span>
          CONTENT MANAGEMENT SYSTEM
        </div>

        <h1>
          Choose your
          <br />
          <span>CMS.</span>
        </h1>

        <p>
          Select a content management system to access
          its connected content, projects, and resources.
        </p>

      </div>


      {/* ==================================================
          CMS CARDS
      ================================================== */}

      <div className="cms-choice-grid">


        {/* ==================================================
            DIRECTUS
        ================================================== */}

        <button
          className="cms-choice-card"
          onClick={() => onNavigate("directus")}
        >

          <div className="cms-choice-top">

            <span>
              01
            </span>

            <span className="cms-choice-arrow">
              ↗
            </span>

          </div>


          <div className="cms-choice-icon">
            D
          </div>


          <div className="cms-choice-content">

            <span className="cms-choice-label">
              CMS
            </span>

            <h2>
              Directus
            </h2>

            <p>
              Access the Directus-powered content
              management system and its connected posts.
            </p>

          </div>


          <div className="cms-choice-status">

            <span className="cms-choice-dot"></span>

            Connected

          </div>

        </button>


        {/* ==================================================
            STRAPI
        ================================================== */}

        <button
          className="cms-choice-card"
          onClick={() => onNavigate("strapi")}
        >

          <div className="cms-choice-top">

            <span>
              02
            </span>

            <span className="cms-choice-arrow">
              ↗
            </span>

          </div>


          <div className="cms-choice-icon">
            S
          </div>


          <div className="cms-choice-content">

            <span className="cms-choice-label">
              CMS
            </span>

            <h2>
              Strapi
            </h2>

            <p>
              Access the Strapi-powered content
              management system and its connected posts.
            </p>

          </div>


          <div className="cms-choice-status">

            <span className="cms-choice-dot"></span>

            Connected

          </div>

        </button>


        {/* ==================================================
            PAYLOAD
        ================================================== */}

        <button
          className="cms-choice-card"
          onClick={() => onNavigate("payload")}
        >

          <div className="cms-choice-top">

            <span>
              03
            </span>

            <span className="cms-choice-arrow">
              ↗
            </span>

          </div>


          <div className="cms-choice-icon">
            P
          </div>


          <div className="cms-choice-content">

            <span className="cms-choice-label">
              CMS
            </span>

            <h2>
              Payload
            </h2>

            <p>
              Access the Payload-powered content
              management system and its connected posts.
            </p>

          </div>


          <div className="cms-choice-status">

            <span className="cms-choice-dot"></span>

            Connected

          </div>

        </button>

      </div>


      {/* ==================================================
          FOOTER INFO
      ================================================== */}

      <div className="cms-page-footer">

        <span>
          JV PROJECTS
        </span>

        <span>
          3 CONTENT MANAGEMENT SYSTEMS
        </span>

      </div>

    </section>
  );
}

export default CMSSelector;

