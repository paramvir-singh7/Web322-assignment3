/********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*  Name: Paramvir Singh Student ID: 112124243 Date: 2025-06-12
*  Published URL: __________________________
********************************************************************************/

const express = require("express");
const path = require("path");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

const projectService = require("./modules/projects");

// Serve static files from public folder (like main.css)
app.use(express.static("public"));

// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/home.html"));
});

// About route
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/about.html"));
});

// Projects (with optional sector filter)
app.get("/solutions/projects", (req, res) => {
  const sector = req.query.sector;
  if (sector) {
    projectService.getProjectsBySector(sector)
      .then(data => res.json(data))
      .catch(err => res.status(404).send(err));
  } else {
    projectService.getAllProjects()
      .then(data => res.json(data))
      .catch(err => res.status(404).send(err));
  }
});

// Project by ID
app.get("/solutions/projects/:id", (req, res) => {
  projectService.getProjectById(req.params.id)
    .then(data => res.json(data))
    .catch(err => res.status(404).send(err));
});

// 404 - must be last
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "/views/404.html"));
});

// Start server
projectService.initialize().then(() => {
  app.listen(HTTP_PORT, () => {
    console.log("Server listening on: " + HTTP_PORT);
  });
}).catch(err => {
  console.log("Error initializing project service:", err);
});
