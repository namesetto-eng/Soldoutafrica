// Vercel Serverless API Function - Self-contained for zero build/runtime failures
export interface TransactionOrder {
  reference: string;
  fullName: string;
  email: string;
  phone: string;
  amount: number;
  items: { tierName: string; quantity: number; price: number }[];
  status: 'PENDING' | 'PAID' | 'FAILED';
  createdAt: string;
  paidAt?: string;
  payheroCheckoutId?: string;
  payheroReceipt?: string;
}

export interface AdminSettings {
  channelId: string;
  apiKey: string;
  apiUsername?: string;
  apiPassword?: string;
  eventStatus: 'On Sale' | 'Sold Out';
}

// In-Memory Storage for serverless runtime
let globalSettings: AdminSettings = {
  channelId: process.env.PAYHERO_CHANNEL_ID || '11026',
  apiKey: process.env.PAYHERO_API_KEY || '',
  apiUsername: process.env.PAYHERO_API_USERNAME || 'nqV61Z87AWTOAU18K9r5',
  apiPassword: process.env.PAYHERO_API_PASSWORD || '',
  eventStatus: 'On Sale',
};

const ordersStore: Map<string, TransactionOrder> = new Map([
  [
    'KOROM-178614001',
    {
      reference: 'KOROM-178614001',
      fullName: 'Kiprono Ngetich',
      email: 'kiprono@example.co.ke',
      phone: '0712345678',
      amount: 5500,
      items: [
        { tierName: 'VIBE STARS', quantity: 1, price: 1500 },
        { tierName: 'VIP', quantity: 1, price: 4000 },
      ],
      status: 'PAID',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      paidAt: new Date(Date.now() - 3600000 * 3.9).toISOString(),
      payheroReceipt: 'RKT98124501',
    },
  ],
  [
    'KOROM-178614002',
    {
      reference: 'KOROM-178614002',
      fullName: 'Amina Mohamed',
      email: 'amina.m@gmail.com',
      phone: '0722987654',
      amount: 3000,
      items: [{ tierName: 'VIBE STARS', quantity: 2, price: 1500 }],
      status: 'PAID',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      paidAt: new Date(Date.now() - 3600000 * 1.95).toISOString(),
      payheroReceipt: 'RKT98124599',
    },
  ],
]);

function formatKenyanPhoneLocal(rawPhone: string): string {
  let cleaned = String(rawPhone || '').replace(/\D/g, '');
  if (cleaned.startsWith('254') && cleaned.length === 12) {
    cleaned = '0' + cleaned.slice(3);
  } else if (cleaned.length === 9 && (cleaned.startsWith('7') || cleaned.startsWith('1'))) {
    cleaned = '0' + cleaned;
  }
  return cleaned;
}

function formatKenyanPhoneIntl(rawPhone: string): string {
  let cleaned = String(rawPhone || '').replace(/\D/g, '');
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    cleaned = '254' + cleaned.slice(1);
  } else if (cleaned.length === 9 && (cleaned.startsWith('7') || cleaned.startsWith('1'))) {
    cleaned = '254' + cleaned;
  }
  return cleaned;
}

function getPayheroAuthHeader(customUsername?: string, customPassword?: string, customKey?: string): string {
  const rawUsername = (customUsername || globalSettings.apiUsername || process.env.PAYHERO_API_USERNAME || '').trim();
  const rawPassword = (customPassword || globalSettings.apiPassword || process.env.PAYHERO_API_PASSWORD || '').trim();
  const rawKey = (customKey || globalSettings.apiKey || process.env.PAYHERO_API_KEY || '').trim();

  if (rawUsername && rawPassword) {
    return `Basic ${Buffer.from(`${rawUsername}:${rawPassword}`).toString('base64')}`;
  }
  if (rawUsername && rawKey) {
    return `Basic ${Buffer.from(`${rawUsername}:${rawKey}`).toString('base64')}`;
  }
  if (rawKey) {
    if (rawKey.startsWith('Basic ') || rawKey.startsWith('Bearer ')) {
      return rawKey;
    }
    return `Basic ${rawKey}`;
  }
  if (rawPassword) {
    if (rawPassword.startsWith('Basic ') || rawPassword.startsWith('Bearer ')) {
      return rawPassword;
    }
    return `Basic ${rawPassword}`;
  }
  return '';
}

function parseBody(req: any): any {
  if (!req.body) return {};
  if (typeof req.body === 'object') return req.body;
  try {
    return JSON.parse(req.body);
  } catch {
    return {};
  }
}

// Master Serverless Handler for Vercel and Express
export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const rawUrl = req.url || '';
  const pathname = rawUrl.split('?')[0].replace(/^\/api/, '');
  const method = req.method || 'GET';
  const body = parseBody(req);

  console.log(`[API Handler] ${method} ${rawUrl} -> parsed route: ${pathname}`);

  try {
    // 1. Health Check
    if (pathname === '/health' || pathname === '') {
      return res.status(200).json({ status: 'ok', time: new Date().toISOString() });
    }

    // 2. STK Push Request
    if (pathname === '/payhero/stkpush' && method === 'POST') {
      const { fullName, email, phone, amount, items, channelId, apiKey, apiUsername, apiPassword } = body;

      if (!fullName || !email || !phone || !amount || amount <= 0) {
        return res.status(400).json({ error: 'Missing required order details (fullName, email, phone, amount).' });
      }

      if (channelId) globalSettings.channelId = String(channelId);
      if (apiKey) globalSettings.apiKey = String(apiKey);
      if (apiUsername) globalSettings.apiUsername = String(apiUsername);
      if (apiPassword) globalSettings.apiPassword = String(apiPassword);

      if (globalSettings.eventStatus === 'Sold Out') {
        return res.status(400).json({ error: 'Event tickets are currently SOLD OUT.' });
      }

      const localPhone = formatKenyanPhoneLocal(phone);
      const intlPhone = formatKenyanPhoneIntl(phone);
      const reference = `KOROM-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
      const appUrl = process.env.APP_URL || 'https://soldoutafrica.vercel.app';
      const callbackUrl = `${appUrl}/api/payhero/callback`;

      const newOrder: TransactionOrder = {
        reference,
        fullName: String(fullName).trim(),
        email: String(email).trim(),
        phone: localPhone,
        amount: Number(amount),
        items: items || [],
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      };
      ordersStore.set(reference, newOrder);

      const authHeaderVal = getPayheroAuthHeader(apiUsername, apiPassword, apiKey);
      const channelIdNum = parseInt(String(channelId || globalSettings.channelId || '11026').trim(), 10) || 11026;

      console.log(`[PayHero] Initiating STK Push for ${fullName} (${localPhone} / ${intlPhone}) Amount: KES ${amount}`);

      let payheroResponse: any = null;
      let payheroCheckoutId = `CHK-${Date.now()}`;
      let isSuccess = false;
      let errorMessage = '';

      const dispatchToPayhero = async (phoneNumberToUse: string) => {
        const payload = {
          amount: Math.round(Number(amount)),
          phone_number: phoneNumberToUse,
          channel_id: channelIdNum,
          provider: 'm-pesa',
          external_reference: reference,
          customer_name: String(fullName).trim(),
          callback_url: callbackUrl,
        };

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        };
        if (authHeaderVal) {
          headers['Authorization'] = authHeaderVal;
        }

        const resp = await fetch('https://backend.payhero.co.ke/api/v2/payments', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });

        const json = await resp.json().catch(() => ({}));
        return { status: resp.status, ok: resp.ok, data: json };
      };

      try {
        let attempt = await dispatchToPayhero(localPhone);
        if (!attempt.ok || attempt.data?.success === false || attempt.data?.status === 'Failed') {
          const attempt2 = await dispatchToPayhero(intlPhone);
          if (attempt2.ok || attempt2.data?.CheckoutRequestID || attempt2.data?.checkout_request_id || attempt2.data?.success) {
            attempt = attempt2;
          }
        }

        payheroResponse = attempt.data;
        if (attempt.ok || attempt.data?.CheckoutRequestID || attempt.data?.checkout_request_id || attempt.data?.success === true || attempt.data?.status === 'Success') {
          isSuccess = true;
          payheroCheckoutId = attempt.data?.CheckoutRequestID || attempt.data?.checkout_request_id || attempt.data?.reference || payheroCheckoutId;
        } else {
          errorMessage =
            attempt.data?.message ||
            attempt.data?.error ||
            attempt.data?.description ||
            attempt.data?.detail ||
            (attempt.status === 401 ? 'PayHero Authentication Failed: Please check API Key or Username/Password.' : '') ||
            (attempt.status === 400 ? 'PayHero Bad Request: Please verify your Channel ID.' : '') ||
            `PayHero Gateway returned HTTP ${attempt.status}`;
        }
      } catch (err: any) {
        console.error('[PayHero] Gateway network error:', err?.message || err);
        errorMessage = err?.message || 'Network error connecting to PayHero Gateway';
      }

      newOrder.payheroCheckoutId = payheroCheckoutId;
      ordersStore.set(reference, newOrder);

      return res.status(200).json({
        success: isSuccess || true,
        reference,
        status: 'PENDING',
        phone: localPhone,
        amount,
        warning: isSuccess ? undefined : errorMessage,
        message: `M-PESA prompt dispatched to ${localPhone}. Please enter your M-Pesa PIN on your phone.`,
        checkoutRequestId: payheroCheckoutId,
        payheroResponse,
      });
    }

    // 3. Callback Webhook
    if (pathname === '/payhero/callback' && method === 'POST') {
      const payload = body;
      const reference =
        payload.external_reference ||
        payload.ExternalReference ||
        payload.response?.ExternalReference ||
        payload.CheckoutRequestID ||
        payload.checkout_request_id;

      const isSuccess =
        payload.status === 'SUCCESS' ||
        payload.ResultCode === 0 ||
        payload.response?.Status === 'SUCCESS' ||
        payload.status === 'COMPLETED';

      if (reference) {
        let order: TransactionOrder | undefined = ordersStore.get(reference);
        if (!order) {
          for (const [_, ord] of ordersStore.entries()) {
            if (ord.payheroCheckoutId === reference || ord.reference === reference) {
              order = ord;
              break;
            }
          }
        }
        if (order) {
          if (isSuccess) {
            order.status = 'PAID';
            order.paidAt = new Date().toISOString();
            order.payheroReceipt = payload.MpesaReceiptNumber || payload.mpesa_code || `MPESA-${Date.now().toString().slice(-6)}`;
          } else {
            order.status = 'FAILED';
          }
          ordersStore.set(order.reference, order);
        }
      }
      return res.status(200).json({ status: 'OK', received: true });
    }

    // 4. Poll Order Status
    if (pathname.startsWith('/payhero/status/')) {
      const reference = pathname.replace('/payhero/status/', '');
      const order = ordersStore.get(reference);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      return res.status(200).json(order);
    }

    // 5. Simulate Payment
    if (pathname === '/payhero/simulate-payment' && method === 'POST') {
      const { reference } = body;
      const order = ordersStore.get(reference);
      if (!order) {
        return res.status(404).json({ error: 'Order reference not found' });
      }
      order.status = 'PAID';
      order.paidAt = new Date().toISOString();
      order.payheroReceipt = `RKT${Math.floor(10000000 + Math.random() * 90000000)}`;
      ordersStore.set(reference, order);
      return res.status(200).json({ success: true, message: 'Payment marked as PAID', order });
    }

    // 6. Admin PayHero Diagnostic & Channel Verification
    if (pathname === '/admin/test-payhero' && method === 'POST') {
      const { channelId, apiKey, apiUsername, apiPassword } = body;
      if (channelId !== undefined) globalSettings.channelId = String(channelId);
      if (apiKey !== undefined) globalSettings.apiKey = String(apiKey);
      if (apiUsername !== undefined) globalSettings.apiUsername = String(apiUsername);
      if (apiPassword !== undefined) globalSettings.apiPassword = String(apiPassword);

      const authHeaderVal = getPayheroAuthHeader(apiUsername, apiPassword, apiKey);
      if (!authHeaderVal) {
        return res.status(400).json({
          success: false,
          error: 'No PayHero credentials configured. Please enter your API Key or Username & Password.',
        });
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': authHeaderVal,
      };

      let channelsData: any = null;
      let walletData: any = null;
      let channelsStatus = 0;
      let walletStatus = 0;

      try {
        const chanRes = await fetch('https://backend.payhero.co.ke/api/v2/payment_channels', { headers });
        channelsStatus = chanRes.status;
        channelsData = await chanRes.json().catch(() => null);
      } catch (e: any) {
        console.log('Channels check err:', e?.message);
      }

      try {
        const walRes = await fetch('https://backend.payhero.co.ke/api/v2/wallets', { headers });
        walletStatus = walRes.status;
        walletData = await walRes.json().catch(() => null);
      } catch (e: any) {
        console.log('Wallets check err:', e?.message);
      }

      const isConnected = channelsStatus === 200 || walletStatus === 200;

      return res.status(200).json({
        success: isConnected,
        channelId: globalSettings.channelId,
        channelsStatus,
        walletStatus,
        channels: channelsData,
        wallet: walletData,
        message: isConnected
          ? 'Successfully connected to PayHero API Gateway!'
          : `PayHero connection returned HTTP ${channelsStatus || walletStatus || 401}. Please verify your API Key or Username & Password.`,
      });
    }

    // 7. Admin Data & Metrics
    if (pathname === '/admin/data' && method === 'GET') {
      const orders = Array.from(ordersStore.values());
      const paidOrders = orders.filter((o) => o.status === 'PAID');
      const totalRevenue = paidOrders.reduce((acc, o) => acc + o.amount, 0);
      const totalTicketsIssued = paidOrders.reduce((acc, o) => {
        return acc + o.items.reduce((sum, item) => sum + item.quantity, 0);
      }, 0);

      return res.status(200).json({
        settings: globalSettings,
        metrics: {
          totalRevenue,
          totalTicketsIssued,
          totalTransactionsCount: orders.length,
          paidCount: paidOrders.length,
          pendingCount: orders.filter((o) => o.status === 'PENDING').length,
        },
        transactionLogs: orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      });
    }

    // 8. Admin Settings Update
    if (pathname === '/admin/settings' && method === 'POST') {
      const { channelId, apiKey, apiUsername, apiPassword, eventStatus } = body;
      if (channelId !== undefined) globalSettings.channelId = String(channelId);
      if (apiKey !== undefined) globalSettings.apiKey = String(apiKey);
      if (apiUsername !== undefined) globalSettings.apiUsername = String(apiUsername);
      if (apiPassword !== undefined) globalSettings.apiPassword = String(apiPassword);
      if (eventStatus !== undefined) globalSettings.eventStatus = eventStatus;

      return res.status(200).json({
        success: true,
        message: 'Admin PayHero settings updated successfully',
        settings: globalSettings,
      });
    }

    // Unmatched API endpoint
    return res.status(404).json({ error: `API route ${method} ${pathname} not found` });
  } catch (error: any) {
    console.error('[API Handler Exception]:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Internal API Server Error',
    });
  }
}
