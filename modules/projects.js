const projectData = require("../data/projectData");
const sectorData = require("../data/sectorData");

let projects = [];

function initialize() {
  return new Promise((resolve, reject) => {
    try {
      projects = projectData.map(proj => {
        const sector = sectorData.find(sec => sec.id === proj.sector_id);
        return {
          ...proj,
          sector: sector ? sector.sector_name : "Unknown"
        };
      });
      resolve();
    } catch (err) {
      reject("Failed to initialize projects");
    }
  });
}

function getAllProjects() {
  return Promise.resolve(projects);
}

function getProjectById(projectId) {
  return new Promise((resolve, reject) => {
    const proj = projects.find(p => p.id === projectId);
    proj ? resolve(proj) : reject("Project not found");
  });
}

function getProjectsBySector(sector) {
  return new Promise((resolve, reject) => {
    const matches = projects.filter(p =>
      p.sector.toLowerCase().includes(sector.toLowerCase())
    );
    matches.length ? resolve(matches) : reject("No projects found for that sector");
  });
}

module.exports = { initialize, getAllProjects, getProjectById, getProjectsBySector };
