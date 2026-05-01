"use client";

import { useEffect, useState } from "react";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [userId, setUserId] = useState("");

  async function load() {
    if (!userId) return;

    const res = await fetch(
      "/.netlify/functions/list-scheduled-posts?pinterest_user_id=" + userId
    );
    const json = await res.json();
    setPosts(json.posts || []);
  }

  useEffect(() => {
    if (userId) load();
  }, [userId]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Scheduled Posts</h1>

      <input
        placeholder="Pinterest User ID"
        className="p-2 border mb-4 w-full"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />

      <button
        onClick={load}
        className="bg-gray-800 text-white px-4 py-2 rounded"
      >
        Refresh
      </button>

      <table className="w-full mt-6 border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Board</th>
            <th className="border p-2">Media</th>
            <th className="border p-2">Scheduled</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Pin ID</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((p: any) => (
            <tr key={p.id}>
              <td className="border p-2">{p.id}</td>
              <td className="border p-2">{p.board_id}</td>
              <td className="border p-2">
                <a href={p.media_url} target="_blank" className="text-blue-600">
                  image
                </a>
              </td>
              <td className="border p-2">{p.scheduled_at}</td>
              <td className="border p-2">{p.status}</td>
              <td className="border p-2">{p.pinterest_pin_id || ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
