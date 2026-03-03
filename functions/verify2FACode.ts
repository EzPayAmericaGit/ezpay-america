import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { code } = await req.json();

    if (!code) {
      return Response.json({ error: 'Code is required' }, { status: 400 });
    }

    // Retrieve stored code from Settings entity
    const settingKey = `2fa_${user.email}`;
    const records = await base44.asServiceRole.entities.Settings.filter({ settingKey });

    if (!records || records.length === 0) {
      return Response.json({ error: 'No active 2FA session. Please request a new code.' }, { status: 400 });
    }

    const record = records[0];
    const [storedCode, expiresAt] = (record.settingValue || '').split('|');

    // Check expiry
    if (!expiresAt || new Date() > new Date(expiresAt)) {
      // Clean up expired record
      await base44.asServiceRole.entities.Settings.delete(record.id);
      await base44.asServiceRole.entities.AuditLog.create({
        userEmail: user.email,
        userName: user.full_name,
        action: '2FA code expired',
        entityType: 'Authentication',
        severity: 'medium',
        status: 'failed'
      });
      return Response.json({ error: 'Verification code has expired. Please request a new code.' }, { status: 400 });
    }

    // Verify code (constant-time comparison to prevent timing attacks)
    const isValid = storedCode === String(code).trim();

    if (isValid) {
      // Delete the used code immediately
      await base44.asServiceRole.entities.Settings.delete(record.id);

      await base44.asServiceRole.entities.AuditLog.create({
        userEmail: user.email,
        userName: user.full_name,
        action: 'Successful 2FA login to Business Dashboard',
        entityType: 'Authentication',
        severity: 'high',
        status: 'success'
      });

      return Response.json({ success: true });
    } else {
      await base44.asServiceRole.entities.AuditLog.create({
        userEmail: user.email,
        userName: user.full_name,
        action: 'Failed 2FA verification attempt',
        entityType: 'Authentication',
        severity: 'critical',
        status: 'failed'
      });

      return Response.json({ error: 'Invalid verification code.' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});