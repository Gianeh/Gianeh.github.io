// Load projects data from JSON file
async function loadProjects() {
  try {
    const response = await fetch('../projects.json');
    if (!response.ok) {
      throw new Error(`Failed to load projects: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.projects || [];
  } catch (error) {
    console.error('Error loading projects:', error);
    return []; // Return empty array in case of error
  }
}

// Function to initialize the timeline
async function initializeTimeline() {
  const timelineContainer = document.getElementById('projects-timeline');
  
  // Clear any existing content
  timelineContainer.innerHTML = '';
  
  try {
    // Load projects from JSON
    const projects = await loadProjects();
    
    if (projects.length === 0) {
      timelineContainer.innerHTML = '<p class="no-projects">No projects found. Add some using the project manager.</p>';
      return;
    }
    
    // Sort projects by date (newest first)
    projects.sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('-'));
      const dateB = new Date(b.date.split('/').reverse().join('-'));
      return dateB - dateA;
    });
    
    // Create and append project nodes
    projects.forEach(project => {
      const projectNode = createProjectNode(project);
      timelineContainer.appendChild(projectNode);
    });
  } catch (error) {
    console.error('Error initializing timeline:', error);
    timelineContainer.innerHTML = '<p class="error">Error loading projects. Please try again later.</p>';
  }
}

// Function to create a project node
function createProjectNode(project) {
  const node = document.createElement('div');
  node.className = 'timeline-node';
  node.id = project.id;
  
  // Add project type as a class for potential filtering
  if (project.type) {
    node.classList.add(`type-${project.type}`);
  }
  
  // Create date element
  const dateElement = document.createElement('div');
  dateElement.className = 'timeline-date';
  dateElement.textContent = project.date;
  
  // Create content container
  const contentElement = document.createElement('div');
  contentElement.className = 'timeline-content';
  
  // Create project preview
  const previewElement = document.createElement('div');
  previewElement.className = 'project-preview';
  
  // Add title
  const titleElement = document.createElement('h3');
  titleElement.textContent = project.title;
  previewElement.appendChild(titleElement);
  
  // Add description
  const descriptionElement = document.createElement('p');
  descriptionElement.textContent = project.description;
  previewElement.appendChild(descriptionElement);
  
  // Add technologies if available
  if (project.technologies && project.technologies.length > 0) {
    const techContainer = document.createElement('div');
    techContainer.className = 'project-technologies';
    
    const techLabel = document.createElement('span');
    techLabel.className = 'tech-label';
    techLabel.textContent = 'Technologies: ';
    techContainer.appendChild(techLabel);
    
    const techList = document.createElement('span');
    techList.className = 'tech-list';
    techList.textContent = project.technologies.join(', ');
    techContainer.appendChild(techList);
    
    previewElement.appendChild(techContainer);
  }
  
  // Add first image if available
  if (project.images && project.images.length > 0) {
    const imageContainer = document.createElement('div');
    imageContainer.className = 'project-image';
    
    const image = document.createElement('img');
    image.src = project.images[0];
    image.alt = project.title;
    
    imageContainer.appendChild(image);
    previewElement.appendChild(imageContainer);
  }
  
  // Create details container
  const detailsElement = document.createElement('div');
  detailsElement.className = 'project-details';
  
  // Create markdown content container
  const markdownElement = document.createElement('div');
  markdownElement.className = 'markdown-content';
  markdownElement.setAttribute('data-file', project.markdown);
  
  detailsElement.appendChild(markdownElement);
  
  // Add external link if available
  if (project.link) {
    const linkContainer = document.createElement('div');
    linkContainer.className = 'project-link';
    
    const link = document.createElement('a');
    link.href = project.link;
    link.target = '_blank';
    link.textContent = 'View Project';
    
    linkContainer.appendChild(link);
    detailsElement.appendChild(linkContainer);
  }
  
  // Add event listener for expanding/collapsing
  previewElement.addEventListener('click', () => toggleProjectDetails(node, project.markdown));
  
  // Assemble the node
  contentElement.appendChild(previewElement);
  contentElement.appendChild(detailsElement);
  
  node.appendChild(dateElement);
  node.appendChild(contentElement);
  
  return node;
}

// Function to toggle project details
async function toggleProjectDetails(node, markdownPath) {
  // Toggle expanded class
  node.classList.toggle('expanded');
  
  const detailsElement = node.querySelector('.project-details');
  const markdownElement = node.querySelector('.markdown-content');
  
  console.log("Toggle clicked for", markdownPath);
  console.log("Node expanded:", node.classList.contains('expanded'));
  
  // If expanding and content not yet loaded
  if (node.classList.contains('expanded')) {
    // Make sure details are visible
    detailsElement.style.maxHeight = '2000px';
    detailsElement.style.opacity = '1';
    detailsElement.style.paddingTop = '15px';
    
    if (!markdownElement.innerHTML) {
      try {
        console.log("Fetching content from", markdownPath);
        // Fetch markdown content
        const response = await fetch(markdownPath);
        if (!response.ok) {
          throw new Error(`Error loading file: ${response.statusText}`);
        }
        
        const text = await response.text();
        console.log("Content loaded, length:", text.length);
        
        // Parse markdown and insert content
        markdownElement.innerHTML = marked.parse(text);
        
        // Process any additional images in the project
        const project = await getProjectById(node.id);
        if (project && project.images && project.images.length > 1) {
          const imageGallery = document.createElement('div');
          imageGallery.className = 'image-gallery';
          
          // Skip the first image as it's already in the preview
          for (let i = 1; i < project.images.length; i++) {
            const imgContainer = document.createElement('div');
            imgContainer.className = 'gallery-image';
            
            const img = document.createElement('img');
            img.src = project.images[i];
            img.alt = `${project.title} - Image ${i+1}`;
            
            imgContainer.appendChild(img);
            imageGallery.appendChild(imgContainer);
          }
          
          if (imageGallery.children.length > 0) {
            markdownElement.appendChild(document.createElement('hr'));
            markdownElement.appendChild(imageGallery);
          }
        }
      } catch (error) {
        console.error("Error:", error);
        markdownElement.innerHTML = `<p>Error loading content: ${error.message}</p>`;
      }
    }
  } else {
    // Explicitly collapse when toggled off
    detailsElement.style.maxHeight = '0';
    detailsElement.style.opacity = '0';
    detailsElement.style.paddingTop = '0';
  }
}

// Helper function to get project by ID
async function getProjectById(projectId) {
  const projects = await loadProjects();
  return projects.find(p => p.id === projectId);
}

// Function to populate the technology dropdown
async function populateTechDropdown() {
  const projects = await loadProjects();
  const techSet = new Set();
  
  // Collect all unique technologies
  projects.forEach(project => {
    if (project.technologies && Array.isArray(project.technologies)) {
      project.technologies.forEach(tech => {
        techSet.add(tech);
      });
    }
  });
  
  // Sort technologies alphabetically
  const technologies = Array.from(techSet).sort();
  
  // Populate the dropdown
  const techDropdown = document.getElementById('project-tech');
  
  // Clear existing options except the first one
  while (techDropdown.options.length > 1) {
    techDropdown.remove(1);
  }
  
  // Add technology options
  technologies.forEach(tech => {
    const option = document.createElement('option');
    option.value = tech;
    option.textContent = tech;
    techDropdown.appendChild(option);
  });
}

// New function: populate the Type dropdown dynamically from projects data
async function populateTypeDropdown() {
  const projects = await loadProjects();
  const typeSet = new Set();
  
  // Collect unique project types
  projects.forEach(project => {
    if (project.type) {
      typeSet.add(project.type);
    }
  });
  
  // Sort types alphabetically
  const types = Array.from(typeSet).sort();
  
  // Populate the dropdown for type filtering
  const typeDropdown = document.getElementById('project-type');
  
  // Clear existing options
  typeDropdown.innerHTML = "";
  
  // Add "All Types" option
  const allOption = document.createElement('option');
  allOption.value = "";
  allOption.textContent = "All Types";
  typeDropdown.appendChild(allOption);
  
  // Add type options
  types.forEach(type => {
    const option = document.createElement('option');
    option.value = type;
    option.textContent = type;
    typeDropdown.appendChild(option);
  });
}

// Function to filter by type (called from HTML)
function filterByType() {
  const typeSelect = document.getElementById('project-type');
  const selectedType = typeSelect.value;
  
  if (selectedType) {
    filterProjectsByType(selectedType);
  } else {
    initializeTimeline(); // Reset to show all projects
  }
}

// Function to filter by technology (called from HTML)
function filterByTechnology() {
  const techSelect = document.getElementById('project-tech');
  const selectedTech = techSelect.value;
  
  if (selectedTech) {
    filterProjectsByTechnology(selectedTech);
  } else {
    initializeTimeline(); // Reset to show all projects
  }
}

// Function to reset all filters
function resetFilters() {
  document.getElementById('project-type').value = '';
  document.getElementById('project-tech').value = '';
  initializeTimeline();
}

// Implementation of filter functions
async function filterProjectsByType(type) {
  const projects = await loadProjects();
  const filteredProjects = type ? projects.filter(p => p.type === type) : projects;
  
  const timelineContainer = document.getElementById('projects-timeline');
  timelineContainer.innerHTML = '';
  
  if (filteredProjects.length === 0) {
    timelineContainer.innerHTML = `<p class="no-projects">No projects found with type: ${type}</p>`;
    return;
  }
  
  // Sort projects by date (newest first)
  filteredProjects.sort((a, b) => {
    const dateA = new Date(a.date.split('/').reverse().join('-'));
    const dateB = new Date(b.date.split('/').reverse().join('-'));
    return dateB - dateA;
  });
  
  filteredProjects.forEach(project => {
    const projectNode = createProjectNode(project);
    timelineContainer.appendChild(projectNode);
  });
}

// Function to filter projects by technology
async function filterProjectsByTechnology(tech) {
  const projects = await loadProjects();
  const filteredProjects = tech 
    ? projects.filter(p => p.technologies && p.technologies.some(t => t.toLowerCase() === tech.toLowerCase()))
    : projects;
  
  const timelineContainer = document.getElementById('projects-timeline');
  timelineContainer.innerHTML = '';
  
  if (filteredProjects.length === 0) {
    timelineContainer.innerHTML = `<p class="no-projects">No projects found with technology: ${tech}</p>`;
    return;
  }
  
  // Sort projects by date (newest first)
  filteredProjects.sort((a, b) => {
    const dateA = new Date(a.date.split('/').reverse().join('-'));
    const dateB = new Date(b.date.split('/').reverse().join('-'));
    return dateB - dateA;
  });
  
  filteredProjects.forEach(project => {
    const projectNode = createProjectNode(project);
    timelineContainer.appendChild(projectNode);
  });
}

// Initialize the timeline and populate dropdowns when the page loads
window.addEventListener('load', async () => {
  await initializeTimeline();
  populateTechDropdown();
  populateTypeDropdown();
});
