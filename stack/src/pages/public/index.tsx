import { useEffect, useState } from "react";
import axios from "axios";

export default function PublicSpace() {
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState("");

  // TEMP user (will connect auth later)
  const userId = "temp-user-id";

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/post");
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createPost = async () => {
    if (!content) return;

    try {
      await axios.post("http://localhost:5000/post", {
        userId,
        content,
      });
      setContent("");
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Public Space</h2>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share something..."
        style={{ width: "100%", height: "80px" }}
      />

      <br />
      <button onClick={createPost}>Post</button>

      <hr />

      {posts.map((post) => (
        <div key={post._id}>
          <p>{post.content}</p>
          <small>{new Date(post.createdAt).toLocaleString()}</small>
          <hr />
        </div>
      ))}
    </div>
  );
}
