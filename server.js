/********************************************************************************
*  WEB322 – Assignment 04
*  
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
*  
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*  
*  Name: Paramvir Singh  Student ID: 112124243  Date: July 4, 2025
*  Published URL: 
********************************************************************************/

const express = require("express");
const path = require("path");
const projectData = require("./modules/projects");

const app = express();
const PORT = process.env.PORT || 8080;

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Serve static CSS/JS/images
app.use(express.static(path.join(__dirname, 'public')));

// Home route
app.get("/", (req, res) => {
  res.render("home", { page: "/" });
});

// About route
app.get("/about", (req, res) => {
  res.render("about", { page: "/about" });
});

// Initialize project data first
projectData.initialize().then(() => {

  /** 
   * /solutions/projects
   * With optional sector filtering
   */
  app.get("/solutions/projects", async (req, res) => {
    try {
      let projects = await projectData.getAllProjects();
      const sector = req.query.sector;

      if (sector) {
        projects = projects.filter(p => p.sector === sector);
        if (projects.length === 0) {
          return res.status(404).render("404", {
            page: '',
            message: `No projects found for sector "${sector}".`
          });
        }
      }

      res.render("projects", { 
        page: "/solutions/projects",
        projects 
      });

    } catch (err) {
      console.error(err);
      res.status(500).render("404", {
        page: '',
        message: "Server error while retrieving projects."
      });
    }
  });

  /**
   * /solutions/projects/:id
   * Show single project detail
   */
  app.get("/solutions/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await projectData.getProjectById(id);

      if (!project) {
        return res.status(404).render("404", {
          page: '',
          message: `No project found with ID ${id}.`
        });
      }

      res.render("project", { 
        page: '', 
        project 
      });

    } catch (err) {
      console.error(err);
      res.status(500).render("404", {
        page: '',
        message: "Server error while retrieving the project."
      });
    }
  });

  /**
   * Catch-all 404 for undefined routes
   */
  app.use((req, res) => {
    res.status(404).render("404", {
      page: '',
      message: "The page you are looking for does not exist."
    });
  });

  // Start server
  app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
  });

}).catch((err) => {
  console.error("Failed to initialize project data:", err);
});
