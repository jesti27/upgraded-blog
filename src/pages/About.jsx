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
      "React is responsible for displaying the website interface and organizing the application into reusable components. Instead of creating every page as one large file, React allows the interface to be divided into smaller components such as Home, Posts, About, navigation elements, cards, and article windows.",
    purpose:
      "React provides the presentation layer of the system. It receives data from backend APIs and Directus, processes that data inside the frontend, and displays the resulting content to the user.",
    connection:
      "React connects to the backend services through APIs. It receives article information, images, and other content from Directus and presents them through the web interface.",
  },

  {
    name: "Vite",
    logo: "⚡",
    role: "Build Tool",
    category: "Development & Build",
    description:
      "Vite is the development server and build tool used to run and prepare the React application.",
    details:
      "Vite provides a fast development environment for the React application. It starts the frontend development server, processes JavaScript and CSS files, and prepares the application for production deployment.",
    purpose:
      "Its main purpose is to make frontend development faster and provide an efficient build process when the website is ready to be deployed.",
    connection:
      "Vite works directly with React, JavaScript, and CSS. During development it serves the application, while during production it generates optimized frontend files that can be served by a web server.",
  },

  {
    name: "JavaScript",
    logo: "JS",
    role: "Language",
    category: "Programming Language",
    description:
      "JavaScript provides the logic, interaction, state management, and dynamic functionality of the web application.",
    details:
      "JavaScript is the programming language used by the frontend application. It controls application behavior such as opening articles, searching posts, communicating with APIs, handling user interaction, and updating the interface without requiring a complete page reload.",
    purpose:
      "JavaScript makes the website interactive and allows the frontend to communicate with backend services and process the data returned by APIs.",
    connection:
      "React uses JavaScript to implement components and application logic. JavaScript also handles API requests between the React interface and backend services such as Directus.",
  },

  {
    name: "CSS",
    logo: "#",
    role: "Design",
    category: "Interface Design",
    description:
      "CSS controls the visual appearance, layout, responsiveness, animations, and glass-style interface of the website.",
    details:
      "CSS is responsible for transforming the functional React components into the visual interface. It controls the Bento grid, glassmorphism cards, spacing, typography, responsive layouts, hover effects, animations, article windows, and mobile presentation.",
    purpose:
      "CSS separates the visual presentation from the application's logic and provides a consistent design system across the website.",
    connection:
      "CSS works together with React components and Vite. React generates the interface structure while CSS determines how those components look and behave visually.",
  },

  {
    name: "Directus",
    logo: "◆",
    role: "CMS / API",
    category: "Headless CMS",
    description:
      "Directus is the content management system used to manage articles, images, videos, and structured content.",
    details:
      "Directus provides a visual content management interface while also exposing the stored content through an API. Administrators can create and manage articles, upload media, organize content, and control structured data without directly editing the frontend source code.",
    purpose:
      "Its main purpose is to separate content management from the frontend application. This allows content to be updated without rebuilding the entire React interface.",
    connection:
      "Directus communicates with PostgreSQL for data storage and exposes the content through an API. React consumes this API and displays the content to website visitors.",
  },

  {
    name: "PostgreSQL",
    logo: "🐘",
    role: "Database",
    category: "Relational Database",
    description:
      "PostgreSQL is the relational database used to persist the structured content managed through Directus.",
    details:
      "PostgreSQL stores structured information such as articles, titles, descriptions, categories, authors, status values, dates, relationships, and references to uploaded files.",
    purpose:
      "The database provides persistent storage so that content remains available even when the application or server is restarted.",
    connection:
      "Directus acts as the content management layer while PostgreSQL acts as the underlying data storage layer. React does not directly manage database records; it receives processed data through the Directus API.",
  },

  {
    name: "Docker",
    logo: "◉",
    role: "Containers",
    category: "Container Platform",
    description:
      "Docker is used to package and isolate the different services that make up the system.",
    details:
      "Docker allows services to run inside separate containers with their own dependencies and configurations. This makes it easier to manage services such as Directus and PostgreSQL without installing every dependency directly into the Ubuntu host system.",
    purpose:
      "Docker provides service isolation, consistent environments, easier deployment, and simpler infrastructure management.",
    connection:
      "Docker hosts the backend services inside the Ubuntu environment. Containers can communicate with each other through Docker networking while remaining separated from the host operating system.",
  },

  {
    name: "Nginx",
    logo: "N",
    role: "Web Server",
    category: "Web Server / Reverse Proxy",
    description:
      "Nginx is used as a web server and can act as a reverse proxy between users and backend services.",
    details:
      "Nginx receives incoming HTTP requests and can serve the frontend application or forward requests to backend services. It provides a central entry point for the deployed system.",
    purpose:
      "Its purpose is to handle web traffic efficiently and provide a controlled connection between the public-facing frontend and backend services.",
    connection:
      "Nginx can serve the built React application while forwarding API requests to backend services. This creates a cleaner architecture between the browser and internal services.",
  },

  {
    name: "Node.js",
    logo: "JS",
    role: "Backend",
    category: "JavaScript Runtime",
    description:
      "Node.js provides a JavaScript runtime environment for server-side applications and API services.",
    details:
      "Node.js allows JavaScript code to run outside the browser. It can be used to create backend services, API endpoints, utility services, and server-side processing for the system.",
    purpose:
      "Its purpose is to provide a server-side JavaScript environment capable of handling requests and backend operations.",
    connection:
      "Node.js can communicate with the React frontend through APIs and can also communicate with other backend services, databases, and external systems.",
  },

  {
    name: "Flask",
    logo: "F",
    role: "Backend",
    category: "Python Web Framework",
    description:
      "Flask is a lightweight Python web framework used to create backend APIs and server-side functionality.",
    details:
      "Flask provides a simple framework for creating HTTP routes and APIs using Python. It can be used for backend processing, custom endpoints, business logic, and services that are separate from the CMS.",
    purpose:
      "Its purpose is to provide a flexible Python-based backend layer for functionality that does not belong directly inside the React frontend or CMS.",
    connection:
      "React can communicate with Flask through HTTP requests. Flask can process those requests and return data through API responses.",
  },

  {
    name: "Ubuntu",
    logo: "U",
    role: "Operating System",
    category: "Linux Server",
    description:
      "Ubuntu provides the Linux server environment where the backend infrastructure and containerized services operate.",
    details:
      "Ubuntu is the operating system used as the server environment. It provides the Linux kernel, networking, filesystem, user management, security tools, and command-line environment required to operate the backend infrastructure.",
    purpose:
      "Its purpose is to provide a stable server environment where Docker and backend services can run continuously.",
    connection:
      "Ubuntu serves as the host environment for Docker and the backend services. VirtualBox provides the virtual machine in which Ubuntu operates.",
  },

  {
    name: "VirtualBox",
    logo: "V",
    role: "Virtualization",
    category: "Virtual Machine Platform",
    description:
      "VirtualBox is used to create and run the Ubuntu virtual machine that hosts the backend environment.",
    details:
      "VirtualBox provides a virtual computer running on the physical server. The virtual machine can have its own operating system, network configuration, storage, CPU, and memory allocation.",
    purpose:
      "Its purpose is to isolate the backend server environment from the main Windows system while still allowing the systems to communicate through the network.",
    connection:
      "VirtualBox hosts the Ubuntu virtual machine. Ubuntu then runs Docker and the backend services inside that virtual environment.",
  },
];

function About() {
  const [selectedTechnology, setSelectedTechnology] = useState(null);
  const [technologyMenuOpen, setTechnologyMenuOpen] = useState(false);
  const [technologySection, setTechnologySection] = useState("article");

  const openTechnology = (technology) => {
    setSelectedTechnology(technology);
    setTechnologySection("article");
    setTechnologyMenuOpen(false);
  };

  const closeTechnology = () => {
    setSelectedTechnology(null);
    setTechnologyMenuOpen(false);
    setTechnologySection("article");
  };

  // =====================================================
  // MODAL SCROLL LOCK + ESCAPE KEY
  // =====================================================
  useEffect(() => {
    if (!selectedTechnology) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedTechnology(null);
        setTechnologyMenuOpen(false);
        setTechnologySection("article");
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedTechnology]);

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
          APIs, containers, databases, and content management
          into one connected system.
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
              Directus
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

          {technologies.map((tech, index) => (

            <article
              className={`technology-card technology-${index}`}
              key={tech.name}
              onClick={() => openTechnology(tech)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {

                if (
                  event.key === "Enter" ||
                  event.key === " "
                ) {
                  event.preventDefault();
                  openTechnology(tech);
                }

              }}
            >

              <div className="technology-top">

                <div className="technology-logo">
                  {tech.logo}
                </div>

                <span>
                  {tech.role}
                </span>

              </div>


              <div className="technology-content">

                <h3>
                  {tech.name}
                </h3>

                <p>
                  {tech.description}
                </p>

                <div className="technology-open">
                  VIEW DETAILS →
                </div>

              </div>


              <div className="technology-number">
                {String(index + 1).padStart(2, "0")}
              </div>

            </article>

          ))}

        </div>

      </div>


      {/* =====================================================
          DEVELOPER / SERVER SECTION
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
            Linux, containers, and server software to provide
            a stable environment for the application's services.
          </p>

        </div>


        <div className="developer-grid">

          <article
            className="developer-card"
            onClick={() =>
              openTechnology(
                technologies.find(
                  (tech) => tech.name === "Ubuntu"
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
                  (tech) => tech.name === "VirtualBox"
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

            if (event.target === event.currentTarget) {
              closeTechnology();
            }

          }}
        >

          <article
            className="about-article-window"
            onClick={(event) => event.stopPropagation()}
          >

            {/* =================================================
                ARTICLE TOPBAR
            ================================================= */}

            <header className="about-article-topbar">

              <button
                className="about-back-button"
                onClick={closeTechnology}
              >
                ← Contents
              </button>


              <div className="about-article-topbar-title">
                {selectedTechnology.role}
              </div>


              <button
                className="about-article-menu-button"
                onClick={() =>
                  setTechnologyMenuOpen(
                    (previous) => !previous
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
                    technologySection === "article"
                      ? "selected"
                      : ""
                  }
                  onClick={() => {

                    setTechnologySection("article");
                    setTechnologyMenuOpen(false);

                  }}
                >
                  <span>
                    01
                  </span>

                  Overview
                </button>


                <button
                  className={
                    technologySection === "system"
                      ? "selected"
                      : ""
                  }
                  onClick={() => {

                    setTechnologySection("system");
                    setTechnologyMenuOpen(false);

                  }}
                >
                  <span>
                    02
                  </span>

                  System Role
                </button>


                <div className="about-menu-divider" />


                <button
                  onClick={closeTechnology}
                >
                  <span>
                    ×
                  </span>

                  Close
                </button>

              </div>

            )}


            {/* =================================================
                ARTICLE SCROLL
            ================================================= */}

            <div className="about-article-scroll">

              {/* =================================================
                  OVERVIEW TAB
              ================================================= */}

              {technologySection === "article" && (

                <article className="about-article-content">

                  <div className="about-article-heading">

                    <span className="eyebrow">
                      {selectedTechnology.category}
                    </span>


                    <h1>
                      {selectedTechnology.name}
                    </h1>


                    <p className="about-article-excerpt">
                      {selectedTechnology.description}
                    </p>


                    <div className="about-article-meta">

                      <span>
                        ROLE
                      </span>

                      <strong>
                        {selectedTechnology.role}
                      </strong>


                      <span>
                        TECHNOLOGY{" "}
                        {String(
                          technologies.findIndex(
                            (tech) =>
                              tech.name ===
                              selectedTechnology.name
                          ) + 1
                        ).padStart(2, "0")}
                      </span>

                    </div>

                  </div>


                  <div className="about-article-divider" />


                  <div className="about-article-body">

                    <h2>
                      What is {selectedTechnology.name}?
                    </h2>

                    <p>
                      {selectedTechnology.details}
                    </p>


                    <h2>
                      Purpose
                    </h2>

                    <p>
                      {selectedTechnology.purpose}
                    </p>


                    <div className="about-info-panel">

                      <span className="eyebrow">
                        SYSTEM ROLE
                      </span>

                      <h3>
                        {selectedTechnology.role}
                      </h3>

                      <p>
                        {selectedTechnology.description}
                      </p>

                    </div>


                    <h2>
                      Connection to the System
                    </h2>

                    <p>
                      {selectedTechnology.connection}
                    </p>


                    <div className="about-connection-panel">

                      <div className="about-connection-title">
                        HOW IT CONNECTS
                      </div>


                      <div className="about-connection-flow">

                        <span>
                          {selectedTechnology.name}
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
                        {selectedTechnology.name}
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
                  SYSTEM ROLE TAB
              ================================================= */}

              {technologySection === "system" && (

                <div className="about-system-page">

                  <div className="about-system-header">

                    <span className="eyebrow">
                      SYSTEM ARCHITECTURE
                    </span>

                    <h1>
                      {selectedTechnology.name}
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
                      {selectedTechnology.role}
                    </h2>

                    <p>
                      {selectedTechnology.purpose}
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
                      {selectedTechnology.connection}
                    </p>

                  </div>


                  <div className="about-system-flow">

                    <div>

                      <span>
                        01
                      </span>

                      <strong>
                        {selectedTechnology.name}
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

export default About;