import { useEffect, useState } from "react";
import axios from "axios";

export default function PublicSpace() {
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState(""); // "image" or "video"

  // TEMP user id, replace with real auth later
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
    if (!content && !mediaUrl) {
      alert("Please add content or media");
      return;
    }

    try {
      await axios.post("http://localhost:5000/post", {
        userId,
        content,
        mediaUrl,
        mediaType,
      });
      setContent("");
      setMediaUrl("");
      setMediaType("");
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  // Handle file upload (for demo we assume URL input)
  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setMediaUrl(url);
    if (url.match(/\.(jpeg|jpg|gif|png)$/)) setMediaType("image");
    else if (url.match(/\.(mp4|mov|avi)$/)) setMediaType("video");
    else setMediaType("");
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
        placeholder="Write something..."
        style={{ width: "100%", height: "80px" }}
      />

      <br />
      <input
        type="text"
        placeholder="Enter image or video URL"
        value={mediaUrl}
        onChange={handleMediaChange}
        style={{ width: "100%", marginTop: "10px" }}
      />

      <br />
      <button onClick={createPost} style={{ marginTop: "10px" }}>
        Post
      </button>

      <hr />

      {posts.map((post) => (
        <div key={post._id} style={{ marginBottom: "20px" }}>
          <p>{post.content}</p>
          {post.mediaType === "image" && (
            <img src={post.mediaUrl} alt="media" style={{ maxWidth: "300px" }} />
          )}
          {post.mediaType === "video" && (
            <video width="320" height="240" controls>
              <source src={post.mediaUrl} />
              Your browser does not support the video tag.
            </video>
          )}
          <small>{new Date(post.createdAt).toLocaleString()}</small>
          <hr />
        </div>
      ))}
    </div>
  );
}
