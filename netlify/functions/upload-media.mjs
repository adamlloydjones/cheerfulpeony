// netlify/functions/upload-media.mjs
import { blobs } from "@netlify/blobs";
import { withAuth } from './_auth.js';

export default async (request) => {
  if (request.method !== "POST") {
    return Response.json({ error: "Use POST" }, { status: 405 });
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return Response.json({ error: "Expected multipart/form-data" }, { status: 400 });
  }

  const form = await request.formData();
  const file = form.get("file");

  if (!file || typeof file === "string") {
    return Response.json({ error: "Missing file" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  const store = blobs();
  const key = `uploads/${Date.now()}-${file.name}`;

  await store.set(key, bytes, {
    contentType: file.type,
    metadata: { originalName: file.name }
  });

  const url = store.getPublicUrl(key);

  return Response.json({ url });
};
