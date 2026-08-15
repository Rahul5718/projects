import { useState, useEffect } from "react";
import JobCard from "../components/JobCard";

function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    fetch("/jobs.json")
      .then((response) => response.json())
      .then((allJobs) => {
        const savedTitles = JSON.parse(localStorage.getItem("savedJobs")) || [];
        const filtered = allJobs.filter((job) => savedTitles.includes(job.title));
        setSavedJobs(filtered);
      })
      .catch((error) => console.error("Failed to load jobs:", error));
  }, []);

  return (
    <div className="container">
      <h2 className="section-title">Your Saved Jobs</h2>

      {savedJobs.length === 0 ? (
        <p className="job-meta">You haven't saved any jobs yet.</p>
      ) : (
        <section className="job-list">
          {savedJobs.map((job) => (
            <JobCard job={job} key={job.title} />
          ))}
        </section>
      )}
    </div>
  );
}

export default SavedJobsPage;