import { createBlob } from '@netlify/blobs';

export default async (req, context) => {
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.startsWith("multipart/form-data")) {
    return new Response("Unsupported Media Type", { status: 415 });
  }

  const formData = await req.formData();
  const file = formData.get("screenshot");

  if (!file) {
    return new Response("No file uploaded", { status: 400 });
  }

  const bookingId = formData.get("bookingId") || "unknown";
  const blobName = `screenshots/${bookingId}-${Date.now()}.jpg`;

  const blob = await createBlob({
    name: blobName,
    content: await file.arrayBuffer(),
    contentType: file.type,
  });

  return new Response(JSON.stringify({ status: "success", url: blob.url }), {
    headers: { "Content-Type": "application/json" },
  });
};
