// netlify/functions/upload-screenshot.js
import { blobs } from '@netlify/blobs';
import multiparty from 'multiparty';
import fs from 'fs/promises';

export const config = {
  bodyParser: false
};

export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ status: "error", message: "Only POST allowed" }), { status: 405 });
  }

  const form = new multiparty.Form();

  const parsed = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

  const bookingId = parsed.fields.bookingId?.[0];
  const file = parsed.files.screenshot?.[0];

  if (!bookingId || !file) {
    return new Response(JSON.stringify({ status: "error", message: "Missing bookingId or file" }), { status: 400 });
  }

  const fileBuffer = await fs.readFile(file.path);
  const blobStore = blobs();

  await blobStore.set(`screenshots/${bookingId}.jpg`, fileBuffer, {
    contentType: file.headers['content-type']
  });

  return new Response(JSON.stringify({ status: "success" }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};
