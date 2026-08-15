import { useState, useEffect } from "react";

function jobCard({ job }) {
  const [isSaved, setIsSaved] = useState(false);

  // On first render, check localStorage to see if this job was already saved
  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
    setIsSaved(savedJobs.includes(job.title));
  }, [job.title]);

  function toggleSave() {
    const savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
    let updated;

    if (savedJobs.includes(job.title)) {
      updated = savedJobs.filter((title) => title !== job.title);
    } else {
      updated = [...savedJobs, job.title];
    }

    localStorage.setItem("savedJobs", JSON.stringify(updated));
    setIsSaved(!isSaved); // this line triggers the re-render
  }

  return (
    <article className="job-card" data-tech={job.tech[0].toLowerCase()}>
      <div className="job-card-top">
        <h3 className="job-title">{job.title}</h3>
        <span className={`job-level ${job.level}`}>{job.level}</span>
      </div>
      <p className="company">{job.company}</p>
      <p className="tech-stack">
        {job.tech.map((t) => (
          <span className="tag" key={t}>{t}</span>
        ))}
      </p>
      <p className="job-meta">Posted: {job.postedDay} · {job.location}</p>
      <div className="card-actions">
        <a href="#" className="apply-btn" onClick={(e) => {
          e.preventDefault();
          alert(`You applied for: ${job.title}`);
        }}>
          Apply Now
        </a>
        <button className={`save-btn ${isSaved ? "saved" : ""}`} onClick={toggleSave}>
          {isSaved ? "★ Saved" : "☆ Save"}
        </button>
      </div>
    </article>
  );
}

export default jobCard;