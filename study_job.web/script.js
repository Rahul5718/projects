function getSavedJobs() {
  try {
    const rawData = localStorage.getItem("savedJobs"); // matches setSavedJobs' key
    if (!rawData || rawData === "undefined") {
      return [];
    }
    return JSON.parse(rawData);
  } catch (err) {
    localStorage.removeItem("savedJobs");
    return [];
  }
}

function setSavedJobs(savedList) {
  localStorage.setItem("savedJobs", JSON.stringify(savedList));
}

function renderJobs(jobs) {
  const jobList = document.querySelector(".job-list");
  jobList.innerHTML = "";
     const savedJobs = getSavedJobs()
  const jobsHTML = jobs
    .map(
      (job) =>{
          const isSaved = savedJobs.includes(job.title)

          const allTechs = job.tech.map((t)=>t.toLowerCase()).join(",")
          return `
    <article class="job-card" data-tech="${job.tech[0].toLowerCase()}">
      <div class="job-card-top">
        <h3 class="job-title">${job.title}</h3>
        <span class="job-level ${job.level}">${job.level}</span>
      </div>
      <p class="company">${job.company}</p>
      <p class="tech-stack">
        ${job.tech.map((t) => `<span class="tag">${t}</span>`).join("")}
      </p>
      <p class="job-meta">Posted: ${job.postedDay} · ${job.location}</p>
      <div class="card-actions">
        <a href="#" class="apply-btn">Apply Now</a>
        <button class="save-btn ${isSaved ? "saved" : ""}">${isSaved ? "★ Saved" : "☆ Save"}</button>
      </div>
    </article>
  `
     })
    .join("");

  jobList.innerHTML = jobsHTML;
}

function attachEventListeners() {
  // Apply buttons
  document.querySelectorAll(".apply-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const jobTitle = btn.closest(".job-card").querySelector(".job-title").textContent;
      alert(`You applied for: ${jobTitle}`);
    });
  });

  // Save buttons
 document.querySelectorAll(".save-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const jobTitle = btn.closest(".job-card").querySelector(".job-title").textContent;
    let savedJobs = getSavedJobs();

    if (savedJobs.includes(jobTitle)) {
      savedJobs = savedJobs.filter((title) => title !== jobTitle);
    } else {
      savedJobs.push(jobTitle);
    }

    setSavedJobs(savedJobs); // <-- this line was missing entirely

    btn.classList.toggle("saved");
    btn.textContent = btn.classList.contains("saved") ? "★ Saved" : "☆ Save";
  });
});

  // Filter buttons — now queried AFTER cards exist
  const filterButtons = document.querySelectorAll(".filter-btn");
  const jobCards = document.querySelectorAll(".job-card");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const selectedTech = btn.dataset.filter;

      jobCards.forEach((card) => {
        const cardTech = card.dataset.tech ? card.dataset.tech.split(","):[]
        if (selectedTech === "all" || cardTech === selectedTech) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });
}

// ---- The ONLY place that actually kicks things off ----
fetch("data/jobs.json")
  .then((response) => response.json())
  .then((jobs) => {
    const today = getTodayName();
    const todaysJobs = jobs.filter((job) => job.postedDay === today);
    if(todaysJobs.length >0){
     renderJobs(todaysJobs)
    }
    else {
      console.warn(`No jobs found for ${today}. Rendering all jobs instead.`);
      renderJobs(jobs);
    }
    // fixed
    attachEventListeners();
  })
  .catch((error) => console.error("Failed to load jobs:", error));

// Getting saved jobs (returns [] if nothing saved yet)

function getTodayName() {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[new Date().getDay()];
}