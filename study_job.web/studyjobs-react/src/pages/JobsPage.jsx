import { useState, useEffect } from "react";
import JobCard from "../components/jobCard";

function getTodayName() {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[new Date().getDay()];
}

function JobsPage() {
  const [jobs, setJobs] = useState([]); //used to store the jobs and update about jobs
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    fetch("/jobs.json")
      .then((response) => response.json())
      .then((data) => {
        const today = getTodayName();
        setJobs(data);
      })
      .catch((error) => console.error("Failed to load jobs:", error));
  }, []);

  const visibleJobs =
    activeFilter === "all"
      ? jobs
      : jobs.filter((job) => job.tech[0].toLowerCase() === activeFilter);

  return (
    <div className="container">
      <h2 className="section-title">Today's Job Vacancies</h2>
      <div className="filter-bar">
        {["all", "java", "python"].map((filter) => (
          <button
            key={filter}
            className={`filter-btn ${activeFilter === filter ? "active" : ""}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter === "all" ? "All" : filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>
      <section className="job-list">
        {visibleJobs.map((job) => (
          <JobCard job={job} key={job.title} />
        ))}
      </section>
    </div>
  );
}

export default JobsPage;
