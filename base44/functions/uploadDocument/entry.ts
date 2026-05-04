import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const { filename, mimeType, base64Data } = await req.json();

    if (!base64Data || !mimeType) {
      return Response.json({ error: 'Missing file data' }, { status: 400 });
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'image/webp'];
    if (!validTypes.includes(mimeType)) {
      return Response.json({ error: 'Invalid file type.' }, { status: 400 });
    }

    // Decode base64 to binary
    const binaryStr = atob(base64Data);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mimeType });
    const file = new File([blob], filename || 'upload', { type: mimeType });

    if (file.size > 10 * 1024 * 1024) {
      return Response.json({ error: 'File too large (max 10MB).' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);
    const { file_url } = await base44.asServiceRole.integrations.Core.UploadFile({ file });

    return Response.json({ file_url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});