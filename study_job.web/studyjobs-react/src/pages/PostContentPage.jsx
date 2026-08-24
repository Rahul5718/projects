import { useState } from "react";

function PostContentPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    author: "",
  });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) {
      setStatus("Please select a file first.");
      return;
    }
    setStatus("Uploading...");

    try {
      // Step A: upload the file itself
      const uploadData = new FormData();
      uploadData.append("file", file);

      const uploadRes = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
        method: "POST",
        body: uploadData, // no Content-Type header - browser sets it automatically for FormData
      });
      const uploadResult = await uploadRes.json();

      // Step B: save the post with the returned URL
      const postRes = await fetch(`${import.meta.env.VITE_API_URL}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          mediaUrl: uploadResult.url,
          mediaType: uploadResult.type === "video" ? "video" : "image",
        }),
      });

      if (!postRes.ok) throw new Error("Failed to save post");

      setStatus("Posted successfully!");
      setFormData({ title: "", description: "", category: "", author: "" });
      setFile(null);
    } catch (err) {
      console.error(err);
      setStatus("Something went wrong. Try again.");
    }
  }

  return (
    <div className="container">
      <h2 className="section-title">Post Study Content</h2>
      <form onSubmit={handleSubmit} className="job-form">
        <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
        <input name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
        <input name="category" placeholder="Category (e.g. Python, React)" value={formData.category} onChange={handleChange} required />
        <input name="author" placeholder="Your name" value={formData.author} onChange={handleChange} />
        <input type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files[0])} required />
        <button type="submit" className="apply-btn">Post</button>
      </form>
      {status && <p className="job-meta">{status}</p>}
    </div>
  );
}

export default PostContentPage;