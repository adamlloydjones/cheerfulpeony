"use client";

import { useState } from "react";

export default function SchedulePinterest() {
  const [status, setStatus] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  async function uploadFile(file: File) {
    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/.netlify/functions/upload-media", {
      method: "POST",
      body: form,
    });

    const json = await res.json();
    setImageUrl(json.url);
  }

  async function submit(e: any) {
    e.preventDefault();
    const form = new FormData(e.target);

    const res = await fetch("/.netlify/functions/create-scheduled-post", {
      method: "POST",
      body: JSON.stringify({
        pinterest_user_id: form.get("pinterest_user_id"),
        board_id: form.get("board_id"),
        media_url: imageUrl,
        title: form.get("title"),
        description: form.get("description"),
        scheduled_at: form.get("scheduled_at"),
      }),
      headers: { "Content-Type": "application/json" },
    });

    const json = await res.json();
    setStatus(JSON.stringify(json, null, 2));
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Schedule a Pinterest Post</h1>

      <form onSubmit={submit} className="bg-white border rounded-lg p-6 shadow-sm space-y-4">
        <input name="pinterest_user_id" placeholder="Pinterest User ID" className="w-full p-2 border rounded" />
        <input name="board_id" placeholder="Board ID" className="w-full p-2 border rounded" />

        <div className="space-y-2">
          <label className="block font-medium">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => uploadFile(e.target.files?.[0] as File)}
            className="w-full p-2 border rounded"
          />

          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview"
              className="w-32 h-32 object-cover rounded border"
            />
          )}
        </div>

        <input name="title" placeholder="Title" className="w-full p-2 border rounded" />
        <textarea name="description" placeholder="Description" className="w-full p-2 border rounded" />
        <input name="scheduled_at" placeholder="2026-05-01T10:00:00Z" className="w-full p-2 border rounded" />

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Schedule Post
        </button>
      </form>

      {status && (
        <pre className="bg-gray-100 p-4 rounded text-sm">{status}</pre>
      )}
    </div>
  );
}
