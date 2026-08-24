import { useState, useEffect } from "react";

function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [activeCategory , setActiveCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")


  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/posts`)
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Failed to load posts:", err));
  }, []);

   const categories = ["all", ...new Set(posts.map((p) => p.category.toLowerCase()))]

  const visiblePosts = posts
    .filter((post)=>
    activeCategory === "all" ? true: post.category.toLowerCase()=== activeCategory)
    .filter((post)=>
    post.title.toLowerCase().includes(searchTerm.toLocaleLowerCase()))

  return (
    <div className="container">
      <h2 className="section-title">Study Feed</h2>
       <input
        type="text"
        placeholder="Search by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <div className="filter-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>
      
      <section className="feed-list">
        {posts.map((post) => (
          <article key={post._id} className="post-card">
            <span className="tag">{post.category}</span>
            <h3 className="job-title">{post.title}</h3>
            {post.mediaType === "image" ? (
              <img src={post.mediaUrl} alt={post.title} className="post-media" />
            ) : (
              <video src={post.mediaUrl} controls className="post-media" />
            )}
            <p className="job-meta">{post.description}</p>
            <p className="job-meta">By {post.author}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

export default FeedPage;