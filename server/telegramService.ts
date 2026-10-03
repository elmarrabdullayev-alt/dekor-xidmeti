import type { Request, Response } from 'express';

// Server-side environment variables ONLY - NEVER exposed to client/browser
export function getTelegramConfig() {
  const rawToken = process.env.TELEGRAM_BOT_TOKEN || '';
  const rawChatId = process.env.TELEGRAM_CHAT_ID || '';

  // Clean surrounding whitespace and optional quotes
  const botToken = rawToken.trim().replace(/^["']|["']$/g, '');
  const chatId = rawChatId.trim().replace(/^["']|["']$/g, '');

  return { botToken, chatId };
}

export interface QuotePayload {
  name: string;
  phone: string;
  service?: string;
  eventType?: string;
  eventDate?: string;
  date?: string;
  location?: string;
  venue?: string;
  guestCount?: string | number;
  budget?: string;
  message?: string;
  notes?: string;
  decorName?: string;
  pagePath?: string;
  pageTitle?: string;
  timestamp?: string;
  honeypot?: string;
}

// In-memory rate limiting map: max 10 requests per 10 minutes per IP
interface RateLimitEntry {
  count: number;
  resetAt: number;
}
const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up expired rate limits periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(ip);
    }
  }
}, 10 * 60 * 1000);

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxRequests = 10;

  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (entry.count >= maxRequests) {
    return true;
  }

  entry.count += 1;
  return false;
}

// Escape HTML special characters for Telegram HTML mode
function escapeHtml(text: string): string {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Flexible Azerbaijani & international phone validation
function isValidPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
  const digitsOnly = cleaned.replace(/\D/g, '');
  // Must contain between 7 and 16 digits
  if (digitsOnly.length < 7 || digitsOnly.length > 16) return false;
  return true;
}

// Format submission timestamp in Baku Timezone (UTC+4)
function formatBakuTimestamp(date: Date = new Date()): string {
  try {
    return new Intl.DateTimeFormat('az-AZ', {
      timeZone: 'Asia/Baku',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date);
  } catch {
    return date.toISOString().replace('T', ' ').substring(0, 19);
  }
}

export function isTelegramConfigured(): boolean {
  const { botToken, chatId } = getTelegramConfig();
  return Boolean(botToken && chatId);
}

export async function sendTelegramQuoteNotification(payload: QuotePayload): Promise<{
  success: boolean;
  httpStatus?: number;
  apiOk?: boolean;
  safeError?: string;
}> {
  const { botToken, chatId } = getTelegramConfig();
  const configPresent = Boolean(botToken && chatId);

  console.log(`[quote] telegram config present: ${configPresent}`);

  if (!configPresent) {
    console.warn('[quote] telegram error: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not configured');
    return {
      success: false,
      safeError: 'TELEGRAM_CONFIG_MISSING',
    };
  }

  const name = payload.name?.trim();
  const phone = payload.phone?.trim();
  const service = (payload.service || payload.eventType || payload.decorName)?.trim();
  const eventDate = (payload.eventDate || payload.date)?.trim();
  const location = (payload.location || payload.venue)?.trim();
  const guestCount = payload.guestCount ? String(payload.guestCount).trim() : '';
  const budget = payload.budget?.trim();
  const message = (payload.message || payload.notes)?.trim();
  const pagePath = payload.pagePath?.trim();
  const pageTitle = payload.pageTitle?.trim();
  const timestamp = payload.timestamp?.trim() || formatBakuTimestamp();

  // Build Telegram HTML message strictly according to requirements:
  // Only include lines that actually have values; do NOT send undefined, null or empty lines.
  const lines: string[] = ['🔔 <b>Yeni Təklif Sorğusu</b>\n'];

  if (name) lines.push(`👤 <b>Ad:</b> ${escapeHtml(name)}`);
  if (phone) lines.push(`📞 <b>Telefon:</b> ${escapeHtml(phone)}`);
  if (service) lines.push(`🎉 <b>Xidmət:</b> ${escapeHtml(service)}`);
  if (eventDate) lines.push(`📅 <b>Tarix:</b> ${escapeHtml(eventDate)}`);
  if (location) lines.push(`📍 <b>Məkan:</b> ${escapeHtml(location)}`);
  if (guestCount) lines.push(`👥 <b>Qonaq sayı:</b> ${escapeHtml(guestCount)}`);
  if (budget) lines.push(`💰 <b>Büdcə:</b> ${escapeHtml(budget)}`);
  if (message) lines.push(`💬 <b>Qeyd:</b> ${escapeHtml(message)}`);

  const sourceDetails: string[] = [];
  if (pagePath) sourceDetails.push(escapeHtml(pagePath));
  if (pageTitle) sourceDetails.push(`(${escapeHtml(pageTitle)})`);

  if (sourceDetails.length > 0) {
    lines.push(`\n🌐 <b>Mənbə:</b> ${sourceDetails.join(' ')}`);
  }
  lines.push(`🕒 <b>Göndərilmə vaxtı:</b> ${escapeHtml(timestamp)}`);

  const messageText = lines.join('\n');

  // Telegram API URL without exposing token in logs
  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  console.log('[quote] telegram request started');

  try {
    const res = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log(`[quote] telegram response status: ${res.status}`);

    const data = (await res.json().catch(() => null)) as any;
    const ok = Boolean(res.ok && data?.ok === true);

    console.log(`[quote] telegram ok: ${ok}`);

    if (!ok) {
      const description = data?.description || `HTTP ${res.status}`;
      console.error(`[quote] telegram error: status ${res.status}, description: ${description}`);
      return {
        success: false,
        httpStatus: res.status,
        apiOk: false,
        safeError: description,
      };
    }

    console.log('[quote] delivery success');
    return {
      success: true,
      httpStatus: res.status,
      apiOk: true,
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    console.error(`[quote] telegram error: ${err.message || 'Network/timeout'}`);
    return {
      success: false,
      httpStatus: 0,
      apiOk: false,
      safeError: 'TELEGRAM_NETWORK_OR_TIMEOUT',
    };
  }
}

// Direct server-side diagnostic test using identical credentials and sender mechanism
export async function runDirectTelegramTest(): Promise<{
  success: boolean;
  httpStatus: number;
  apiOk: boolean;
  safeError?: string;
  botConfigured: boolean;
  chatConfigured: boolean;
}> {
  const { botToken, chatId } = getTelegramConfig();
  const botConfigured = Boolean(botToken);
  const chatConfigured = Boolean(chatId);

  if (!botConfigured || !chatConfigured) {
    return {
      success: false,
      httpStatus: 0,
      apiOk: false,
      safeError: 'TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing in environment',
      botConfigured,
      chatConfigured,
    };
  }

  const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: '✅ DreamArt Telegram test',
        parse_mode: 'HTML',
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const data = (await res.json().catch(() => null)) as any;
    const apiOk = Boolean(res.ok && data?.ok === true);

    return {
      success: apiOk,
      httpStatus: res.status,
      apiOk,
      safeError: apiOk ? undefined : data?.description || `HTTP ${res.status}`,
      botConfigured,
      chatConfigured,
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    return {
      success: false,
      httpStatus: 0,
      apiOk: false,
      safeError: err.message || 'Network/timeout error',
      botConfigured,
      chatConfigured,
    };
  }
}

// Express route handler for POST /api/quote-request
export async function handleQuoteRequest(req: Request, res: Response) {
  try {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || '127.0.0.1';

    console.log('[quote] request received from IP:', ip);

    // 1. Rate Limiting Check
    if (isRateLimited(ip)) {
      console.warn('[quote] rate limit exceeded for IP:', ip);
      return res.status(429).json({
        success: false,
        error: 'Çox sayda sorğu göndərildi. Zəhmət olmasa bir neçə dəqiqə sonra yenidən cəhd edin.',
      });
    }

    const body: QuotePayload = req.body || {};

    // 2. Honeypot check: if bot filled hidden field, return silent success without dispatching
    if (body.honeypot && String(body.honeypot).trim().length > 0) {
      console.log(`[quote] discarded bot submission from IP ${ip} (honeypot caught)`);
      return res.json({
        success: true,
        message: 'Sorğunuz uğurla göndərildi. Komandamız sizinlə qısa zamanda əlaqə saxlayacaq.',
      });
    }

    // 3. Name validation
    const name = body.name?.trim();
    if (!name || name.length < 2) {
      console.warn('[quote] validation failed: missing or short name');
      return res.status(400).json({
        success: false,
        error: 'Zəhmət olmasa adınızı düzgün daxil edin (minimum 2 hərf).',
      });
    }

    // 4. Phone validation
    const phone = body.phone?.trim();
    if (!phone || !isValidPhone(phone)) {
      console.warn('[quote] validation failed: invalid phone format');
      return res.status(400).json({
        success: false,
        error: 'Zəhmət olmasa düzgün əlaqə nömrəsi daxil edin.',
      });
    }

    console.log('[quote] validation passed');

    // 5. Send to Telegram
    const dispatchResult = await sendTelegramQuoteNotification(body);

    if (!dispatchResult.success) {
      // Do NOT leak Telegram internals or server credentials to the user
      return res.status(500).json({
        success: false,
        error: 'Sorğu göndərilərkən problem yarandı. Zəhmət olmasa yenidən cəhd edin.',
      });
    }

    return res.json({
      success: true,
      message: 'Sorğunuz uğurla göndərildi. Komandamız sizinlə qısa zamanda əlaqə saxlayacaq.',
    });
  } catch (err: any) {
    console.error('[quote] server error:', err);
    return res.status(500).json({
      success: false,
      error: 'Sorğu göndərilərkən problem yarandı. Zəhmət olmasa yenidən cəhd edin.',
    });
  }
}
