"use client";

import { useState } from "react";

export default function PinterestPosts() {
  const [userId, setUserId] = useState("");
  const [posts, setPosts] = useState([]);

  async function load() {
    const res = await fetch(
      "/.netlify/functions/list-scheduled-posts?pinterest_user_id=" + userId
    );
    const json = await res.json();
    setPosts(json.posts || []);
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Scheduled Posts</h1>

      <div className="flex gap-4">
        <input
          placeholder="Pinterest User ID"
          className="p-2 border rounded flex-1"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button
          onClick={load}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-black"
        >
          Load
        </button>
      </div>

      <table className="w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
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
                <a href={p.media_url} target="_blank" className="text-blue-600 underline">
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
