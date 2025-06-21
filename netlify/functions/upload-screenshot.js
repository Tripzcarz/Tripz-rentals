import { blobs } from '@netlify/blobs';

export default async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ status: 'error', message: 'Method not allowed' });
    }

    const contentType = req.headers['content-type'];
    const bookingId = req.headers['x-booking-id'];

    if (!bookingId || !contentType.includes('multipart/form-data')) {
      return res.status(400).json({ status: 'error', message: 'Invalid data' });
    }

    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }

    const fileBuffer = Buffer.concat(chunks);

    // ✅ Add blob upload logic
    const store = blobs();
    await store.set(`screenshots/${bookingId}.jpg`, fileBuffer, {
      contentType: contentType
    });

    console.log(`✅ Screenshot uploaded: screenshots/${bookingId}.jpg`);
    return res.status(200).json({ status: 'success' });

  } catch (err) {
    console.error('❌ Upload error:', err);
    return res.status(500).json({ status: 'error', message: 'Upload failed' });
  }
};
