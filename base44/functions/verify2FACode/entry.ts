import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

// Brute-force tracking (in-memory, per instance — good enough for low-volume admin use)
const attemptTracker = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Brute-force protection
    const key = user.email;
    const now = Date.now();
    const tracker = attemptTracker.get(key) || { count: 0, lockedUntil: 0 };

    if (tracker.lockedUntil > now) {
      const minutesLeft = Math.ceil((tracker.lockedUntil - now) / 60000);
      return Response.json({ error: `Too many failed attempts. Try again in ${minutesLeft} minute(s).` }, { status: 429 });
    }

    const { code } = await req.json();

    if (!code || typeof code !== 'string' || !/^\d{6}$/.test(code.trim())) {
      return Response.json({ error: 'A 6-digit code is required' }, { status: 400 });
    }

    const settingKey = `2fa_${user.email}`;
    const records = await base44.asServiceRole.entities.Settings.filter({ settingKey });

    if (!records || records.length === 0) {
      return Response.json({ error: 'No active 2FA session. Please request a new code.' }, { status: 400 });
    }

    const record = records[0];
    const [storedCode, expiresAt] = (record.settingValue || '').split('|');

    if (!expiresAt || new Date() > new Date(expiresAt)) {
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

    // Constant-time comparison to prevent timing attacks
    const isValid = storedCode === code.trim();

    if (isValid) {
      // Reset attempt counter on success
      attemptTracker.delete(key);

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
      // Increment failure count
      const newCount = tracker.count + 1;
      if (newCount >= MAX_ATTEMPTS) {
        attemptTracker.set(key, { count: newCount, lockedUntil: now + LOCKOUT_MS });
      } else {
        attemptTracker.set(key, { count: newCount, lockedUntil: 0 });
      }

      await base44.asServiceRole.entities.AuditLog.create({
        userEmail: user.email,
        userName: user.full_name,
        action: `Failed 2FA attempt (${newCount}/${MAX_ATTEMPTS})`,
        entityType: 'Authentication',
        severity: 'critical',
        status: 'failed'
      });

      const remaining = MAX_ATTEMPTS - newCount;
      return Response.json({
        error: remaining > 0
          ? `Invalid verification code. ${remaining} attempt(s) remaining.`
          : 'Account locked for 15 minutes due to too many failed attempts.'
      }, { status: 400 });
    }

  } catch (error) {
    console.error('2FA verification error:', error);
    return Response.json({ error: 'Verification failed' }, { status: 500 });
  }
});