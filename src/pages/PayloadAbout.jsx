import { useEffect, useState } from "react";
import "./About.css";


const technologies = [
  {
    name: "React",
    logo: "⚛",
    role: "Frontend",
    category: "Frontend Library",
    description:
      "React is the main frontend library used to build the interactive web interface of the system.",
    details:
      "React is responsible for displaying the website interface and organizing the application into reusable components. The application is divided into pages, navigation elements, cards, article windows, and other reusable interface components.",
    purpose:
      "React provides the presentation layer of the system. It receives data from backend APIs and displays the resulting content to users.",
    connection:
      "React connects to backend services through HTTP APIs. It receives article information, media, and structured content from the connected CMS services.",
  },

  {
    name: "Vite",
    logo: "⚡",
    role: "Build Tool",
    category: "Development & Build",
    description:
      "Vite is the development server and build tool used to run and prepare the React application.",
    details:
      "Vite provides a fast development environment for the React application. It processes JavaScript and CSS files and prepares optimized frontend assets for deployment.",
    purpose:
      "Its purpose is to provide a fast development workflow and an efficient production build process.",
    connection:
      "Vite works with React, JavaScript, and CSS to develop and build the frontend application.",
  },

  {
    name: "JavaScript",
    logo: "JS",
    role: "Language",
    category: "Programming Language",
    description:
      "JavaScript provides the logic, interaction, state management, and dynamic functionality of the web application.",
    details:
      "JavaScript controls application behavior such as opening articles, searching posts, communicating with APIs, handling user interactions, and updating the interface.",
    purpose:
      "JavaScript makes the website interactive and allows the frontend to process information received from backend services.",
    connection:
      "React components use JavaScript for application logic while JavaScript also handles communication between the frontend and backend APIs.",
  },

  {
    name: "CSS",
    logo: "#",
    role: "Design",
    category: "Interface Design",
    description:
      "CSS controls the visual appearance, layout, responsiveness, animations, and glass-style interface of the website.",
    details:
      "CSS transforms the functional React components into the visual interface. It controls the Bento layout, glassmorphism cards, spacing, typography, responsive behavior, hover effects, article windows, and mobile presentation.",
    purpose:
      "CSS separates visual presentation from application logic and provides a consistent design system across the application.",
    connection:
      "React generates the interface structure while CSS controls how the interface looks and behaves visually.",
  },

  {
    name: "PayloadCMS",
    logo: "◆",
    role: "CMS / API",
    category: "Headless CMS",
    description:
      "PayloadCMS is the content management system used to manage structured articles, media, users, and application content.",
    details:
      "PayloadCMS provides an administrative interface for managing structured content while also exposing that content through APIs. Articles and media can be created and maintained without directly modifying the React frontend source code.",
    purpose:
      "Its purpose is to separate content management from the presentation layer. This allows content to be updated through the CMS while the React application consumes the resulting API data dynamically.",
    connection:
      "PayloadCMS communicates with PostgreSQL for persistent data storage and exposes the content through its API. React consumes this API and presents the content to website visitors.",
  },

  {
    name: "PostgreSQL",
    logo: "🐘",
    role: "Database",
    category: "Relational Database",
    description:
      "PostgreSQL is the relational database used by PayloadCMS to persist structured application data.",
    details:
      "PostgreSQL stores structured information such as posts, titles, descriptions, categories, authors, statuses, dates, relationships, users, and other CMS-managed records.",
    purpose:
      "The database provides persistent storage so application content remains available after services restart.",
    connection:
      "PayloadCMS acts as the content management and API layer while PostgreSQL provides the underlying persistent storage.",
  },

  {
    name: "Docker",
    logo: "◉",
    role: "Containers",
    category: "Container Platform",
    description:
      "Docker is used to package and isolate the services that make up the backend infrastructure.",
    details:
      "Docker allows services to operate inside separate containers with their own dependencies and configurations. This makes it possible to manage PayloadCMS, PostgreSQL, and other backend services independently.",
    purpose:
      "Docker provides service isolation, consistent environments, simplified deployment, and easier infrastructure management.",
    connection:
      "Docker hosts the backend services inside the Ubuntu server environment. Containers communicate through Docker networking while remaining isolated from the host system.",
  },

  {
    name: "Nginx",
    logo: "N",
    role: "Web Server",
    category: "Web Server / Reverse Proxy",
    description:
      "Nginx can serve the frontend application and act as a reverse proxy between users and backend services.",
    details:
      "Nginx receives incoming HTTP requests and can serve the built React application or forward API requests to backend services.",
    purpose:
      "Its purpose is to provide a controlled entry point for web traffic and separate public-facing requests from internal backend services.",
    connection:
      "Nginx can serve the React frontend while forwarding API requests to services such as PayloadCMS and other backend applications.",
  },

  {
    name: "Node.js",
    logo: "JS",
    role: "Backend",
    category: "JavaScript Runtime",
    description:
      "Node.js provides a JavaScript runtime environment for server-side applications and backend services.",
    details:
      "Node.js allows JavaScript applications to run outside the browser. It can be used for API services, backend processing, utility services, and server-side operations.",
    purpose:
      "Its purpose is to provide a server-side JavaScript environment capable of handling requests and backend operations.",
    connection:
      "Node.js services can communicate with the React frontend, PayloadCMS, databases, and other backend services through APIs.",
  },

  {
    name: "Flask",
    logo: "F",
    role: "Backend",
    category: "Python Web Framework",
    description:
      "Flask is a lightweight Python web framework used to create backend APIs and server-side functionality.",
    details:
      "Flask provides a simple Python framework for HTTP routes and APIs. It can handle custom backend processing, business logic, utility endpoints, and services separate from the CMS.",
    purpose:
      "Its purpose is to provide a flexible Python backend layer for functionality that does not belong directly inside React or the CMS.",
    connection:
      "React can communicate with Flask through HTTP requests while Flask can communicate with other backend services as required.",
  },

  {
    name: "Ubuntu",
    logo: "U",
    role: "Operating System",
    category: "Linux Server",
    description:
      "Ubuntu provides the Linux server environment where the backend infrastructure and containerized services operate.",
    details:
      "Ubuntu provides the operating system, networking, filesystem, user management, security tools, and command-line environment required to operate the backend infrastructure.",
    purpose:
      "Its purpose is to provide a stable server environment where Docker and backend services can run.",
    connection:
      "Ubuntu serves as the host environment for Docker and the backend services inside the virtual machine.",
  },

  {
    name: "VirtualBox",
    logo: "V",
    role: "Virtualization",
    category: "Virtual Machine Platform",
    description:
      "VirtualBox is used to create and run the Ubuntu virtual machine that hosts the backend environment.",
    details:
      "VirtualBox provides a virtual computer with its own operating system, network configuration, storage, CPU, and memory allocation.",
    purpose:
      "Its purpose is to isolate the backend server environment from the main Windows system.",
    connection:
      "VirtualBox hosts Ubuntu, and Ubuntu runs Docker and the backend services inside that virtual environment.",
  },
];


function PayloadAbout() {

  const [
    selectedTechnology,
    setSelectedTechnology,
  ] = useState(null);

  const [
    technologyMenuOpen,
    setTechnologyMenuOpen,
  ] = useState(false);

  const [
    technologySection,
    setTechnologySection,
  ] = useState("article");


  /* =========================================================
     OPEN TECHNOLOGY
  ========================================================= */

  function openTechnology(
    technology
  ) {

    if (!technology) {
      return;
    }

    setSelectedTechnology(
      technology
    );

    setTechnologySection(
      "article"
    );

    setTechnologyMenuOpen(
      false
    );
  }


  /* =========================================================
     CLOSE TECHNOLOGY
  ========================================================= */

  function closeTechnology() {

    setSelectedTechnology(
      null
    );

    setTechnologyMenuOpen(
      false
    );

    setTechnologySection(
      "article"
    );
  }


  /* =========================================================
     BODY SCROLL + ESCAPE
  ========================================================= */

  useEffect(() => {

    if (!selectedTechnology) {

      document.body.style.overflow =
        "";

      return undefined;
    }

    document.body.style.overflow =
      "hidden";


    function handleKeyDown(event) {

      if (
        event.key === "Escape"
      ) {

        setSelectedTechnology(
          null
        );

        setTechnologyMenuOpen(
          false
        );

        setTechnologySection(
          "article"
        );
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

      document.body.style.overflow =
        "";
    };

  }, [
    selectedTechnology,
  ]);


  const payloadTechnologyIndex =
    technologies.findIndex(
      (technology) =>
        technology.name ===
        "PayloadCMS"
    );


  return (
    <section className="about-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <div className="about-hero">

        <span className="eyebrow">
          SYSTEM ARCHITECTURE
        </span>

        <h1>
          About
          <br />
          <span>the system.</span>
        </h1>

        <p>
          This website combines modern frontend technologies,
          APIs, containers, databases, and multiple content
          management systems into one connected application.
        </p>

      </div>


      {/* =====================================================
          DATA FLOW
      ===================================================== */}

      <div className="architecture-card">

        <div className="architecture-heading">

          <span className="eyebrow">
            DATA FLOW
          </span>

          <h2>
            Everything is connected.
          </h2>

        </div>


        <div className="architecture-flow">

          <div className="architecture-node-container">

            <span className="architecture-number">
              01
            </span>

            <div className="architecture-node">
              Terminal
            </div>

            <p>
              Content Upload
            </p>

          </div>


          <div className="architecture-arrow">
            →
          </div>


          <div className="architecture-node-container">

            <span className="architecture-number">
              02
            </span>

            <div className="architecture-node">
              API
            </div>

            <p>
              Data Processing
            </p>

          </div>


          <div className="architecture-arrow">
            →
          </div>


          <div className="architecture-node-container">

            <span className="architecture-number">
              03
            </span>

            <div className="architecture-node">
              PayloadCMS
            </div>

            <p>
              Content Management
            </p>

          </div>


          <div className="architecture-arrow">
            →
          </div>


          <div className="architecture-node-container">

            <span className="architecture-number">
              04
            </span>

            <div className="architecture-node">
              PostgreSQL
            </div>

            <p>
              Data Storage
            </p>

          </div>


          <div className="architecture-arrow">
            →
          </div>


          <div className="architecture-node-container">

            <span className="architecture-number">
              05
            </span>

            <div className="architecture-node">
              React
            </div>

            <p>
              Web Interface
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          TECHNOLOGY SECTION
      ===================================================== */}

      <div className="technology-section">

        <div className="section-heading">

          <div>

            <span className="eyebrow">
              TECHNOLOGY STACK
            </span>

            <h2>
              Built with modern tools.
            </h2>

          </div>


          <p>
            Every technology has a specific role in the
            complete system architecture. Click a technology
            to learn how it works and how it connects to the
            rest of the system.
          </p>

        </div>


        {/* =================================================
            TECHNOLOGY GRID
        ================================================= */}

        <div className="technology-grid">

          {technologies.map(
            (
              technology,
              index
            ) => (

              <article
                className={`technology-card technology-${index}`}
                key={
                  technology.name
                }
                onClick={() =>
                  openTechnology(
                    technology
                  )
                }
                role="button"
                tabIndex={0}
                onKeyDown={(
                  event
                ) => {

                  if (
                    event.key ===
                      "Enter" ||
                    event.key ===
                      " "
                  ) {

                    event.preventDefault();

                    openTechnology(
                      technology
                    );
                  }

                }}
              >

                <div className="technology-top">

                  <div className="technology-logo">
                    {
                      technology.logo
                    }
                  </div>

                  <span>
                    {
                      technology.role
                    }
                  </span>

                </div>


                <div className="technology-content">

                  <h3>
                    {
                      technology.name
                    }
                  </h3>

                  <p>
                    {
                      technology.description
                    }
                  </p>

                  <div className="technology-open">
                    VIEW DETAILS →
                  </div>

                </div>


                <div className="technology-number">
                  {String(
                    index + 1
                  ).padStart(
                    2,
                    "0"
                  )}
                </div>

              </article>

            )
          )}

        </div>

      </div>


      {/* =====================================================
          SERVER ENVIRONMENT
      ===================================================== */}

      <div className="developer-section">

        <div className="developer-heading">

          <span className="eyebrow">
            SERVER ENVIRONMENT
          </span>

          <h2>
            The infrastructure behind the system.
          </h2>

          <p>
            The backend environment uses virtualization,
            Linux, containers, databases, and server software
            to provide a stable environment for the application's
            services.
          </p>

        </div>


        <div className="developer-grid">

          <article
            className="developer-card"
            onClick={() =>
              openTechnology(
                technologies.find(
                  (technology) =>
                    technology.name ===
                    "Ubuntu"
                )
              )
            }
          >

            <span className="developer-number">
              11
            </span>

            <div className="developer-logo">
              U
            </div>

            <div>

              <span>
                OPERATING SYSTEM
              </span>

              <h3>
                Ubuntu
              </h3>

              <p>
                Linux server environment for the backend.
              </p>

            </div>

            <strong>
              →
            </strong>

          </article>


          <article
            className="developer-card"
            onClick={() =>
              openTechnology(
                technologies.find(
                  (technology) =>
                    technology.name ===
                    "VirtualBox"
                )
              )
            }
          >

            <span className="developer-number">
              12
            </span>

            <div className="developer-logo">
              V
            </div>

            <div>

              <span>
                VIRTUALIZATION
              </span>

              <h3>
                VirtualBox
              </h3>

              <p>
                Virtual machine platform hosting Ubuntu.
              </p>

            </div>

            <strong>
              →
            </strong>

          </article>

        </div>

      </div>


      {/* =====================================================
          TECHNOLOGY ARTICLE OVERLAY
      ===================================================== */}

      {selectedTechnology && (

        <div
          className="about-article-overlay"
          onClick={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {
              closeTechnology();
            }

          }}
        >

          <article
            className="about-article-window"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* =================================================
                TOPBAR
            ================================================= */}

            <header className="about-article-topbar">

              <button
                className="about-back-button"
                onClick={
                  closeTechnology
                }
              >
                ← Contents
              </button>


              <div className="about-article-topbar-title">
                {
                  selectedTechnology.role
                }
              </div>


              <button
                className="about-article-menu-button"
                onClick={() =>
                  setTechnologyMenuOpen(
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

            {technologyMenuOpen && (

              <div className="about-article-menu">

                <button
                  className={
                    technologySection ===
                    "article"
                      ? "selected"
                      : ""
                  }
                  onClick={() => {

                    setTechnologySection(
                      "article"
                    );

                    setTechnologyMenuOpen(
                      false
                    );

                  }}
                >
                  <span>
                    01
                  </span>

                  Overview
                </button>


                <button
                  className={
                    technologySection ===
                    "system"
                      ? "selected"
                      : ""
                  }
                  onClick={() => {

                    setTechnologySection(
                      "system"
                    );

                    setTechnologyMenuOpen(
                      false
                    );

                  }}
                >
                  <span>
                    02
                  </span>

                  System Role
                </button>


                <div className="about-menu-divider" />


                <button
                  onClick={
                    closeTechnology
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

            <div className="about-article-scroll">

              {/* =================================================
                  OVERVIEW
              ================================================= */}

              {technologySection ===
                "article" && (

                <article className="about-article-content">

                  <div className="about-article-heading">

                    <span className="eyebrow">
                      {
                        selectedTechnology.category
                      }
                    </span>


                    <h1>
                      {
                        selectedTechnology.name
                      }
                    </h1>


                    <p className="about-article-excerpt">
                      {
                        selectedTechnology.description
                      }
                    </p>


                    <div className="about-article-meta">

                      <span>
                        ROLE
                      </span>

                      <strong>
                        {
                          selectedTechnology.role
                        }
                      </strong>


                      <span>
                        TECHNOLOGY{" "}
                        {String(
                          technologies.findIndex(
                            (technology) =>
                              technology.name ===
                              selectedTechnology.name
                          ) + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </span>

                    </div>

                  </div>


                  <div className="about-article-divider" />


                  <div className="about-article-body">

                    <h2>
                      What is{" "}
                      {
                        selectedTechnology.name
                      }?
                    </h2>

                    <p>
                      {
                        selectedTechnology.details
                      }
                    </p>


                    <h2>
                      Purpose
                    </h2>

                    <p>
                      {
                        selectedTechnology.purpose
                      }
                    </p>


                    <div className="about-info-panel">

                      <span className="eyebrow">
                        SYSTEM ROLE
                      </span>

                      <h3>
                        {
                          selectedTechnology.role
                        }
                      </h3>

                      <p>
                        {
                          selectedTechnology.description
                        }
                      </p>

                    </div>


                    <h2>
                      Connection to the System
                    </h2>

                    <p>
                      {
                        selectedTechnology.connection
                      }
                    </p>


                    <div className="about-connection-panel">

                      <div className="about-connection-title">
                        HOW IT CONNECTS
                      </div>


                      <div className="about-connection-flow">

                        <span>
                          {
                            selectedTechnology.name
                          }
                        </span>

                        <strong>
                          →
                        </strong>

                        <span>
                          System Services
                        </span>

                        <strong>
                          →
                        </strong>

                        <span>
                          Web Interface
                        </span>

                      </div>

                    </div>


                    <h2>
                      Why it matters
                    </h2>

                    <p>
                      Each technology in this system has a
                      specific responsibility. The complete
                      application works because these
                      technologies operate together instead
                      of functioning as isolated components.
                    </p>


                    <p>
                      Understanding the role{" "}
                      <strong>
                        {
                          selectedTechnology.name
                        }
                      </strong>{" "}
                      helps explain how the entire system is
                      structured, how information moves between
                      services, and how the final web interface
                      becomes available to users.
                    </p>

                  </div>

                </article>

              )}


              {/* =================================================
                  SYSTEM ROLE
              ================================================= */}

              {technologySection ===
                "system" && (

                <div className="about-system-page">

                  <div className="about-system-header">

                    <span className="eyebrow">
                      SYSTEM ARCHITECTURE
                    </span>

                    <h1>
                      {
                        selectedTechnology.name
                      }
                    </h1>

                    <p>
                      Where this technology belongs in the
                      complete system.
                    </p>

                  </div>


                  <div className="about-system-card">

                    <span className="eyebrow">
                      PRIMARY ROLE
                    </span>

                    <h2>
                      {
                        selectedTechnology.role
                      }
                    </h2>

                    <p>
                      {
                        selectedTechnology.purpose
                      }
                    </p>

                  </div>


                  <div className="about-system-card">

                    <span className="eyebrow">
                      CONNECTION
                    </span>

                    <h2>
                      Part of a connected architecture
                    </h2>

                    <p>
                      {
                        selectedTechnology.connection
                      }
                    </p>

                  </div>


                  <div className="about-system-flow">

                    <div>

                      <span>
                        01
                      </span>

                      <strong>
                        {
                          selectedTechnology.name
                        }
                      </strong>

                      <small>
                        Selected Technology
                      </small>

                    </div>


                    <div className="flow-arrow">
                      →
                    </div>


                    <div>

                      <span>
                        02
                      </span>

                      <strong>
                        Backend Services
                      </strong>

                      <small>
                        Processing
                      </small>

                    </div>


                    <div className="flow-arrow">
                      →
                    </div>


                    <div>

                      <span>
                        03
                      </span>

                      <strong>
                        Web Interface
                      </strong>

                      <small>
                        User Experience
                      </small>

                    </div>

                  </div>

                </div>

              )}

            </div>

          </article>

        </div>

      )}

    </section>
  );
}

export default PayloadAbout;