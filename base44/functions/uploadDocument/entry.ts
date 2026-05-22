import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const startTime = Date.now();
  let userEmail = 'anonymous';

  try {
    const body = await req.json();
    const { filename, mimeType, base64Data, documentType } = body;

    if (!base64Data) {
      console.error('[uploadDocument] Missing base64Data for file:', filename);
      return Response.json({ error: 'Missing file data' }, { status: 400 });
    }

    // Default mimeType if missing
    const resolvedMime = mimeType || 'application/octet-stream';

    // Accept any image, PDF, or octet-stream; reject all others
    if (!resolvedMime.startsWith('image/') && resolvedMime !== 'application/pdf' && resolvedMime !== 'application/octet-stream') {
      console.error('[uploadDocument] Rejected file type:', resolvedMime, 'filename:', filename);
      return Response.json({ error: 'Invalid file type. Please upload an image or PDF.' }, { status: 400 });
    }

    // Decode base64 to binary
    let bytes;
    try {
      const binaryStr = atob(base64Data);
      bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
    } catch (decodeErr) {
      console.error('[uploadDocument] Base64 decode failed for file:', filename, decodeErr.message);
      return Response.json({ error: 'Invalid file data — could not decode.' }, { status: 400 });
    }

    if (bytes.length > 50 * 1024 * 1024) {
      console.warn('[uploadDocument] File too large:', bytes.length, 'bytes, filename:', filename);
      return Response.json({ error: 'File too large (max 50MB).' }, { status: 400 });
    }

    const blob = new Blob([bytes], { type: resolvedMime });
    const file = new File([blob], filename || 'upload', { type: resolvedMime });

    const base44 = createClientFromRequest(req);

    // Try to get user for logging (non-blocking — public applicants are not logged in)
    try {
      const user = await base44.auth.me();
      if (user?.email) userEmail = user.email;
    } catch (_) { /* unauthenticated upload — allowed for public applicants */ }

    console.info(`[uploadDocument] Uploading "${filename}" (${resolvedMime}, ${(bytes.length / 1024).toFixed(1)}KB) for user: ${userEmail}`);

    const { file_url } = await base44.asServiceRole.integrations.Core.UploadFile({ file });

    const elapsed = Date.now() - startTime;
    console.info(`[uploadDocument] SUCCESS — "${filename}" uploaded in ${elapsed}ms. URL: ${file_url}`);

    // Log to AuditLog entity for monitoring
    try {
      await base44.asServiceRole.entities.AuditLog.create({
        userEmail,
        userName: userEmail,
        action: 'document_uploaded',
        entityType: 'MerchantApplication',
        changes: {
          filename,
          mimeType: resolvedMime,
          fileSizeKB: Math.round(bytes.length / 1024),
          documentType: documentType || 'unknown',
          file_url,
          durationMs: elapsed
        },
        severity: 'low',
        status: 'success'
      });
    } catch (logErr) {
      console.warn('[uploadDocument] AuditLog write failed (non-fatal):', logErr.message);
    }

    return Response.json({ file_url });

  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error(`[uploadDocument] FAILED after ${elapsed}ms — ${error.message}`);

    // Log failure to AuditLog
    try {
      const base44 = createClientFromRequest(req);
      await base44.asServiceRole.entities.AuditLog.create({
        userEmail,
        action: 'document_upload_failed',
        entityType: 'MerchantApplication',
        changes: { error: error.message, durationMs: elapsed },
        severity: 'high',
        status: 'failed'
      });
    } catch (_) { /* best-effort */ }

    return Response.json({ error: error.message }, { status: 500 });
  }
});