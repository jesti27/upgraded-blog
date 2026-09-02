
import { useEffect, useState } from "react";

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8055/items/posts")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        return response.json();
      })
      .then((data) => {
        setPosts(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to load posts.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <h1>Loading posts...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <div>
      <h1>My Blog</h1>

      {posts.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
          <p>Category: {post.category}</p>
          <p>Author: {post.author}</p>
        </article>
      ))}
    </div>
  );
}

export default App;
