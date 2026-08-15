import { useState } from "react";
import { useNavigate } from "react-router-dom";

function PostJobPage() {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    level: "fresher",
    tech: "",
    location: "",
    postedDay: "Monday",
  });
  const [status, setStatus] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("Posting...");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tech: formData.tech.split(",").map((t) => t.trim()), // "Java, Spring" -> ["Java", "Spring"]
        }),
      });

      if (!response.ok) throw new Error("Failed to post job");

      setStatus("Job posted successfully!");
      setFormData({ title: "", company: "", level: "fresher", tech: "", location: "", postedDay: "Monday" });
    } catch (err) {
      console.error(err);
      setStatus("Something went wrong. Try again.");
    }
  }

  return (
    <div className="container">
      <h2 className="section-title">Post a Job</h2>
      <form onSubmit={handleSubmit} className="job-form">
        <input name="title" placeholder="Job Title" value={formData.title} onChange={handleChange} required />
        <input name="company" placeholder="Company" value={formData.company} onChange={handleChange} required />

        <select name="level" value={formData.level} onChange={handleChange}>
          <option value="fresher">Fresher</option>
          <option value="experienced">Experienced</option>
        </select>

        <input name="tech" placeholder="Tech stack (comma separated, e.g. Java, Spring Boot)" value={formData.tech} onChange={handleChange} required />
        <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />

        <select name="postedDay" value={formData.postedDay} onChange={handleChange}>
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>

        <button type="submit" className="apply-btn">Post Job</button>
      </form>
      {status && <p className="job-meta">{status}</p>}
    </div>
  );
}

export default PostJobPage;