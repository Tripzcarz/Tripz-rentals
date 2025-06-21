import { blob } from '@netlify/blobs';

export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const contentType = req.headers.get("content-type");
  if (!contentType || !contentType.includes("multipart/form-data")) {
    return new Response("Invalid content type", { status: 400 });
  }

  const formData = await req.formData();
  const file = formData.get("screenshot");
  const bookingId = formData.get("bookingId") || "unknown";

  if (!file || typeof file.name !== "string") {
    return new Response("No file uploaded", { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await blob.set(`screenshots/${bookingId}_${file.name}`, buffer, {
    contentType: file.type
  });

  return new Response(JSON.stringify({ status: "success" }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};
