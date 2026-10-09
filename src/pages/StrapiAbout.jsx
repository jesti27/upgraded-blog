
import { useState } from "react";
import "./StrapiAbout.css";

function StrapiAbout({ onNavigate }) {
  const [selectedTech, setSelectedTech] = useState(null);

  const technologies = [
    {
      name: "React",
      category: "FRONTEND",
      icon: "⚛",
      description:
        "React is the main frontend library used to build the user interface of the entire multi-CMS system.",
      purpose:
        "React is responsible for displaying the pages, CMS sections, navigation, content, cards, modals, and interactive elements that users see.",
      systemRole:
        "React acts as the central presentation layer of the system. It connects the frontend interface to the different CMS platforms and displays their content in a unified website.",
      flow: [
        "React application starts",
        "User selects a CMS",
        "React loads the selected CMS interface",
        "Frontend requests content from the CMS API",
        "Returned data is processed",
        "React renders the content",
      ],
    },

    {
      name: "Vite",
      category: "BUILD TOOL",
      icon: "V",
      description:
        "Vite is the development and build tool used for the React frontend application.",
      purpose:
        "Vite provides the development server, fast module loading, hot updates, and production build process.",
      systemRole:
        "Vite prepares the React application during development and generates the optimized frontend files used for deployment.",
      flow: [
        "Developer starts Vite",
        "Vite loads the React application",
        "Source files are processed",
        "Modules are served to the browser",
        "Changes are updated instantly",
        "Production build generates optimized assets",
      ],
    },

    {
      name: "JavaScript",
      category: "PROGRAMMING",
      icon: "JS",
      description:
        "JavaScript provides the application logic used throughout the React frontend.",
      purpose:
        "JavaScript controls navigation, state, API requests, data processing, events, conditional rendering, and dynamic content.",
      systemRole:
        "JavaScript connects the different parts of the frontend together. It determines what content should be loaded, displayed, and updated based on user interaction.",
      flow: [
        "User performs an action",
        "JavaScript receives the event",
        "Application state is updated",
        "API request is performed when required",
        "Response data is processed",
        "Interface updates dynamically",
      ],
    },

    {
      name: "CSS",
      category: "STYLING",
      icon: "CSS",
      description:
        "CSS controls the complete visual presentation of the multi-CMS frontend.",
      purpose:
        "CSS provides layout, typography, spacing, responsive behavior, glass effects, cards, grids, animations, overlays, and visual hierarchy.",
      systemRole:
        "CSS creates a consistent visual system across Directus, Strapi, and Keystone while allowing each CMS section to maintain its own class namespace.",
      flow: [
        "React renders components",
        "CSS selectors target components",
        "Layout rules determine positioning",
        "Typography rules define hierarchy",
        "Responsive rules adapt the interface",
        "Browser renders the final visual interface",
      ],
    },

    {
      name: "Strapi",
      category: "CMS",
      icon: "S",
      description:
        "Strapi is the CMS used to manage structured content for the Strapi section of the system.",
      purpose:
        "Strapi provides the administration interface where content can be created, organized, stored, and delivered through an API.",
      systemRole:
        "Strapi acts as the content management layer for the Strapi side of the multi-CMS platform. React retrieves Strapi content and displays it through the frontend.",
      flow: [
        "Content is created in Strapi",
        "Strapi stores the content",
        "Strapi exposes the content through its API",
        "React sends an API request",
        "Strapi returns structured data",
        "React displays the content",
      ],
    },

    {
      name: "PostgreSQL",
      category: "DATABASE",
      icon: "PG",
      description:
        "PostgreSQL is the relational database used for structured data storage.",
      purpose:
        "PostgreSQL stores persistent records used by the CMS and backend services.",
      systemRole:
        "The database provides persistent storage beneath the CMS layer. CMS platforms use database records to store structured content and related information.",
      flow: [
        "CMS receives content",
        "CMS validates the data",
        "Database operation is performed",
        "PostgreSQL stores the record",
        "CMS retrieves the record when requested",
        "API delivers the data to React",
      ],
    },

    {
      name: "Docker",
      category: "CONTAINERIZATION",
      icon: "▣",
      description:
        "Docker provides isolated containers for the CMS, database, APIs, and supporting services.",
      purpose:
        "Docker packages applications and their dependencies into separate containers that can run consistently within the server environment.",
      systemRole:
        "Docker separates the backend components into manageable services and allows the CMS, database, and APIs to operate independently.",
      flow: [
        "Ubuntu starts Docker",
        "Docker loads the project configuration",
        "Containers are created",
        "CMS and services start",
        "Containers communicate through the network",
        "Application services become available",
      ],
    },

    {
      name: "Nginx",
      category: "WEB SERVER",
      icon: "N",
      description:
        "Nginx is used as part of the web server and reverse-proxy infrastructure.",
      purpose:
        "Nginx handles web traffic and can route requests toward the appropriate frontend or backend service.",
      systemRole:
        "Nginx forms part of the deployment layer between users and the application services.",
      flow: [
        "User sends a web request",
        "Request reaches Nginx",
        "Nginx evaluates the request",
        "Request is routed to the appropriate service",
        "Service generates a response",
        "Nginx returns the response",
      ],
    },

    {
      name: "Node.js",
      category: "RUNTIME",
      icon: "JS",
      description:
        "Node.js provides the runtime environment for JavaScript-based backend services.",
      purpose:
        "Node.js allows JavaScript code to run on the server for APIs and supporting backend functionality.",
      systemRole:
        "Node.js provides server-side JavaScript execution within the backend architecture.",
      flow: [
        "Node.js process starts",
        "Backend application loads",
        "Server listens for requests",
        "Request is processed",
        "Backend communicates with services",
        "Response is returned",
      ],
    },

    {
      name: "Flask",
      category: "BACKEND",
      icon: "F",
      description:
        "Flask is a Python web framework used for backend API functionality.",
      purpose:
        "Flask handles backend routes, request processing, and application-level API operations.",
      systemRole:
        "Flask provides a Python-based backend service that can process information between frontend requests and backend resources.",
      flow: [
        "Frontend sends request",
        "Flask receives the request",
        "Route determines the operation",
        "Backend processing occurs",
        "Required data is retrieved",
        "Flask returns a response",
      ],
    },

    {
      name: "Ubuntu",
      category: "SERVER OS",
      icon: "U",
      description:
        "Ubuntu provides the Linux server environment where the backend infrastructure operates.",
      purpose:
        "Ubuntu provides the operating system layer required to run Docker and the backend services.",
      systemRole:
        "Ubuntu acts as the host operating system for the containerized CMS, database, and API infrastructure.",
      flow: [
        "Ubuntu boots",
        "System services start",
        "Docker service starts",
        "Project containers are loaded",
        "Backend services become available",
        "Applications communicate through the server",
      ],
    },

    {
      name: "VirtualBox",
      category: "VIRTUALIZATION",
      icon: "VB",
      description:
        "VirtualBox provides the virtual machine environment used to run the Ubuntu server.",
      purpose:
        "VirtualBox creates an isolated virtual computer where Ubuntu can run independently from the Windows host.",
      systemRole:
        "VirtualBox provides the infrastructure layer that hosts the Ubuntu environment used by the backend stack.",
      flow: [
        "Windows host runs VirtualBox",
        "Virtual machine starts",
        "Ubuntu boots inside the VM",
        "Ubuntu starts Docker",
        "Containers start",
        "Backend environment becomes available",
      ],
    },
  ];

  const architectureFlow = [
    {
      number: "01",
      title: "React",
      description: "Frontend interface",
    },
    {
      number: "02",
      title: "API",
      description: "Content requests",
    },
    {
      number: "03",
      title: "Strapi",
      description: "Content management",
    },
    {
      number: "04",
      title: "PostgreSQL",
      description: "Data storage",
    },
  ];

  return (
    <section className="strapi-about-page">
      {/* =====================================================
          HERO
      ===================================================== */}

      <div className="strapi-about-hero">
        <div className="strapi-about-label">
          <span className="strapi-about-line"></span>
          ABOUT THE SYSTEM
        </div>

        <h1>
          One platform.
          <br />
          <span>Multiple systems.</span>
        </h1>

        <p>
          A multi-CMS content platform connecting React,
          Strapi, Directus, Keystone, APIs, databases,
          containerized services, and server infrastructure
          into one connected application.
        </p>
      </div>

      {/* =====================================================
          ARCHITECTURE
      ===================================================== */}

      <div className="strapi-architecture-card">
        <div className="strapi-architecture-heading">
          <div>
            <span className="strapi-eyebrow">
              STRAPI ARCHITECTURE
            </span>

            <h2>
              From content
              <br />
              to interface.
            </h2>
          </div>

          <p>
            The Strapi side follows a content delivery
            workflow where content is managed in Strapi,
            stored through the backend data layer, exposed
            through the API, and rendered by React.
          </p>
        </div>

        <div className="strapi-architecture-flow">
          {architectureFlow.map((item, index) => (
            <div
              className="strapi-architecture-flow-group"
              key={item.number}
            >
              <div className="strapi-architecture-node-container">
                <span className="strapi-architecture-number">
                  {item.number}
                </span>

                <div className="strapi-architecture-node">
                  <strong>{item.title}</strong>

                  <p>{item.description}</p>
                </div>
              </div>

              {index < architectureFlow.length - 1 && (
                <span className="strapi-architecture-arrow">
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================
          TECHNOLOGIES
      ===================================================== */}

      <div className="strapi-technology-section">
        <div className="strapi-section-heading">
          <div>
            <span className="strapi-eyebrow">
              TECHNOLOGY STACK
            </span>

            <h2>
              Everything
              <br />
              working together.
            </h2>
          </div>

          <p>
            Each technology has a specific responsibility
            within the system. Select a technology to view
            its role, purpose, contribution, and workflow.
          </p>
        </div>

        <div className="strapi-technology-grid">
          {technologies.map((tech, index) => (
            <button
              type="button"
              className={`strapi-technology-card strapi-technology-${index}`}
              key={tech.name}
              onClick={() => setSelectedTech(tech)}
            >
              <div className="strapi-technology-top">
                <span className="strapi-technology-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="strapi-technology-open">
                  ↗
                </span>
              </div>

              <div className="strapi-technology-icon">
                {tech.icon}
              </div>

              <div className="strapi-technology-content">
                <span className="strapi-technology-category">
                  {tech.category}
                </span>

                <h3>{tech.name}</h3>

                <p>{tech.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* =====================================================
          SYSTEM ENVIRONMENT
      ===================================================== */}

      <div className="strapi-developer-section">
        <div className="strapi-developer-heading">
          <div>
            <span className="strapi-eyebrow">
              SYSTEM ENVIRONMENT
            </span>

            <h2>
              Where the
              <br />
              system runs.
            </h2>
          </div>

          <p>
            The application uses a Windows development
            environment together with a virtualized Ubuntu
            server running the containerized backend stack.
          </p>
        </div>

        <div className="strapi-developer-grid">
          <div className="strapi-developer-card">
            <span className="strapi-developer-number">
              01
            </span>

            <div className="strapi-developer-logo">
              W
            </div>

            <span className="strapi-developer-label">
              HOST
            </span>

            <h3>Windows</h3>

            <p>
              Development and frontend environment.
            </p>
          </div>

          <div className="strapi-developer-card">
            <span className="strapi-developer-number">
              02
            </span>

            <div className="strapi-developer-logo">
              U
            </div>

            <span className="strapi-developer-label">
              SERVER OS
            </span>

            <h3>Ubuntu</h3>

            <p>
              Linux environment hosting the backend
              infrastructure.
            </p>
          </div>

          <div className="strapi-developer-card">
            <span className="strapi-developer-number">
              03
            </span>

            <div className="strapi-developer-logo">
              D
            </div>

            <span className="strapi-developer-label">
              CONTAINERS
            </span>

            <h3>Docker</h3>

            <p>
              Isolated services for CMS, database, and APIs.
            </p>
          </div>

          <div className="strapi-developer-card">
            <span className="strapi-developer-number">
              04
            </span>

            <div className="strapi-developer-logo">
              PG
            </div>

            <span className="strapi-developer-label">
              DATABASE
            </span>

            <h3>PostgreSQL</h3>

            <p>
              Persistent structured data storage.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          CMS ARCHITECTURE
      ===================================================== */}

      <div className="strapi-cms-section">
        <div className="strapi-cms-architecture-card">
          <span className="strapi-eyebrow">
            MULTI-CMS ARCHITECTURE
          </span>

          <h2>
            Different CMS.
            <br />
            Shared frontend.
          </h2>

          <p>
            Directus, Strapi, and Keystone are separate CMS
            environments connected through the overall React
            application architecture.
          </p>

          <div className="strapi-cms-flow">
            <div className="strapi-cms-flow-item">
              <span>01</span>
              <strong>Directus</strong>
              <small>Database-first CMS</small>
            </div>

            <div className="strapi-cms-flow-line">
              →
            </div>

            <div className="strapi-cms-flow-item active">
              <span>02</span>
              <strong>Strapi</strong>
              <small>API-first CMS</small>
            </div>

            <div className="strapi-cms-flow-line">
              →
            </div>

            <div className="strapi-cms-flow-item">
              <span>03</span>
              <strong>Keystone</strong>
              <small>Headless CMS</small>
            </div>

            <div className="strapi-cms-flow-line">
              →
            </div>

            <div className="strapi-cms-flow-item">
              <span>04</span>
              <strong>React</strong>
              <small>Unified interface</small>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          ARTICLE OVERLAY
      ===================================================== */}

      {selectedTech && (
        <div
          className="strapi-about-article-overlay"
          onClick={() => setSelectedTech(null)}
        >
          <article
            className="strapi-about-article-window"
            onClick={(event) => event.stopPropagation()}
          >
            {/* TOP BAR */}

            <div className="strapi-about-article-topbar">
              <div className="strapi-about-article-brand">
                <span className="strapi-article-brand-symbol">
                  J
                </span>

                <span>
                  STRAPI / ABOUT
                </span>
              </div>

              <button
                type="button"
                className="strapi-about-article-close"
                onClick={() => setSelectedTech(null)}
                aria-label="Close article"
              >
                ×
              </button>
            </div>

            {/* ARTICLE SCROLL */}

            <div className="strapi-about-article-scroll">
              {/* ARTICLE HEADER */}

              <div className="strapi-about-article-header">
                <div className="strapi-about-article-icon">
                  {selectedTech.icon}
                </div>

                <span className="strapi-eyebrow">
                  {selectedTech.category}
                </span>

                <h2>{selectedTech.name}</h2>

                <p>
                  {selectedTech.description}
                </p>
              </div>

              {/* ARTICLE BODY */}

              <div className="strapi-about-article-body">
                <section>
                  <span className="strapi-article-section-label">
                    01 — DESCRIPTION
                  </span>

                  <h3>
                    What is {selectedTech.name}?
                  </h3>

                  <p>
                    {selectedTech.description}
                  </p>
                </section>

                <section>
                  <span className="strapi-article-section-label">
                    02 — PURPOSE
                  </span>

                  <h3>
                    What is it used for?
                  </h3>

                  <p>
                    {selectedTech.purpose}
                  </p>
                </section>

                <section>
                  <span className="strapi-article-section-label">
                    03 — SYSTEM ROLE
                  </span>

                  <h3>
                    Why is it important to the system?
                  </h3>

                  <p>
                    {selectedTech.systemRole}
                  </p>
                </section>

                {/* CONNECTION FLOW */}

                <section className="strapi-article-flow-section">
                  <span className="strapi-article-section-label">
                    04 — SYSTEM FLOW
                  </span>

                  <h3>
                    How {selectedTech.name} works
                  </h3>

                  <p>
                    The following flow shows the role of{" "}
                    {selectedTech.name} inside the
                    application architecture.
                  </p>

                  <div className="strapi-article-system-flow">
                    {selectedTech.flow.map(
                      (step, index) => (
                        <div
                          className="strapi-article-flow-group"
                          key={`${selectedTech.name}-${index}`}
                        >
                          <div className="strapi-article-flow-node">
                            <span>
                              {String(index + 1).padStart(
                                2,
                                "0"
                              )}
                            </span>

                            <strong>{step}</strong>
                          </div>

                          {index <
                            selectedTech.flow.length - 1 && (
                            <div className="strapi-article-flow-arrow">
                              ↓
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </section>

                {/* SYSTEM CONNECTION */}

                <section className="strapi-article-connection-section">
                  <span className="strapi-article-section-label">
                    05 — CONNECTION
                  </span>

                  <h3>
                    Where it connects
                  </h3>

                  <div className="strapi-article-connection-card">
                    <div>
                      <span>TECHNOLOGY</span>
                      <strong>
                        {selectedTech.name}
                      </strong>
                    </div>

                    <span className="strapi-connection-arrow">
                      →
                    </span>

                    <div>
                      <span>SYSTEM</span>
                      <strong>
                        Multi-CMS Platform
                      </strong>
                    </div>
                  </div>
                </section>

                {/* END */}

                <div className="strapi-article-end">
                  <span>END OF ARTICLE</span>

                  <button
                    type="button"
                    onClick={() => setSelectedTech(null)}
                  >
                    Close Article
                    <span>×</span>
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}

export default StrapiAbout;

