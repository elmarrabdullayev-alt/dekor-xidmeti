export interface SendQuoteData {
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
  honeypot?: string;
  pagePath?: string;
  pageTitle?: string;
}

export interface QuoteResponse {
  success: boolean;
  message: string;
}

const SUCCESS_MESSAGE = 'Sorğunuz uğurla göndərildi. Komandamız sizinlə qısa zamanda əlaqə saxlayacaq.';
const DEFAULT_ERROR_MESSAGE = 'Sorğu göndərilərkən problem yarandı. Zəhmət olmasa yenidən cəhd edin.';

export async function sendQuoteRequest(data: SendQuoteData): Promise<QuoteResponse> {
  try {
    const pagePath =
      data.pagePath ||
      (typeof window !== 'undefined' ? window.location.pathname + window.location.search : '');
    const pageTitle =
      data.pageTitle ||
      (typeof document !== 'undefined' ? document.title : '');

    const payload = {
      ...data,
      pagePath,
      pageTitle,
    };

    const res = await fetch('/api/quote-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json().catch(() => null);

    if (!res.ok || !result || result.success === false) {
      return {
        success: false,
        message: result?.error || DEFAULT_ERROR_MESSAGE,
      };
    }

    return {
      success: true,
      message: result.message || SUCCESS_MESSAGE,
    };
  } catch (err) {
    console.error('[Quote Service Submission Error]:', err);
    return {
      success: false,
      message: DEFAULT_ERROR_MESSAGE,
    };
  }
}
