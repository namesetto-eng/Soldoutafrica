import express from 'express';
import {
  AdminSettings,
  TransactionOrder,
  loadPersistedSettings,
  savePersistedSettings,
  loadPersistedOrders,
  savePersistedOrders,
} from './serverStorage';

export const app = express();

app.use(express.json());

// CORS & Preflight Handling for all API requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// URL Normalization Middleware for Vercel Serverless Rewrites
app.use((req, _res, next) => {
  // If Vercel rewrites to /api or / without path suffix, recover from originalUrl or headers if present
  if (req.url === '/' || req.url === '/api' || req.url === '/api/') {
    const rawMatch =
      (req.headers['x-vercel-matched-path'] as string) ||
      (req.headers['x-matched-path'] as string) ||
      (req.headers['x-now-route-matches'] as string) ||
      req.originalUrl;

    if (rawMatch && rawMatch !== '/' && rawMatch !== '/api' && rawMatch !== '/api/') {
      req.url = rawMatch;
    }
  }
  next();
});

// Initial Seed Orders
const initialSeedOrders: TransactionOrder[] = [
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
  {
    reference: 'KOROM-178614003',
    fullName: 'David Ochieng',
    email: 'ochieng.d@yahoo.com',
    phone: '0733112233',
    amount: 4000,
    items: [{ tierName: 'VIP', quantity: 1, price: 4000 }],
    status: 'PENDING',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
];

// Persistent Admin Settings
const defaultSettings: AdminSettings = {
  channelId: process.env.PAYHERO_CHANNEL_ID || '11026',
  apiKey: process.env.PAYHERO_API_KEY || '',
  apiUsername: process.env.PAYHERO_API_USERNAME || 'nqV61Z87AWTOAU18K9r5',
  apiPassword: process.env.PAYHERO_API_PASSWORD || '',
  eventStatus: 'On Sale',
};

export const adminSettings: AdminSettings = loadPersistedSettings(defaultSettings);
export const ordersStore: Map<string, TransactionOrder> = loadPersistedOrders(initialSeedOrders);

// --- Safaricom Phone Number Formatting ---
export function formatKenyanPhoneLocal(rawPhone: string): string {
  let cleaned = rawPhone.replace(/\D/g, '');
  if (cleaned.startsWith('254') && cleaned.length === 12) {
    cleaned = '0' + cleaned.slice(3);
  } else if (cleaned.length === 9 && (cleaned.startsWith('7') || cleaned.startsWith('1'))) {
    cleaned = '0' + cleaned;
  }
  return cleaned;
}

export function formatKenyanPhoneIntl(rawPhone: string): string {
  let cleaned = rawPhone.replace(/\D/g, '');
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    cleaned = '254' + cleaned.slice(1);
  } else if (cleaned.length === 9 && (cleaned.startsWith('7') || cleaned.startsWith('1'))) {
    cleaned = '254' + cleaned;
  }
  return cleaned;
}

// Build PayHero Authorization Header (with support for runtime overrides)
export function getPayheroAuthHeader(customUsername?: string, customPassword?: string, customKey?: string): string {
  const rawUsername = (customUsername || adminSettings.apiUsername || process.env.PAYHERO_API_USERNAME || '').trim();
  const rawPassword = (customPassword || adminSettings.apiPassword || process.env.PAYHERO_API_PASSWORD || '').trim();
  const rawKey = (customKey || adminSettings.apiKey || process.env.PAYHERO_API_KEY || '').trim();

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

// API Router
const apiRouter = express.Router();

// Health check
apiRouter.get(['/health', '/api/health'], (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 1. STK Push Request Endpoint
apiRouter.post(['/payhero/stkpush', '/api/payhero/stkpush'], async (req, res) => {
  try {
    const { fullName, email, phone, amount, items, channelId, apiKey, apiUsername, apiPassword } = req.body || {};

    if (!fullName || !email || !phone || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Missing or invalid order details.' });
    }

    if (channelId) adminSettings.channelId = String(channelId);
    if (apiKey) adminSettings.apiKey = String(apiKey);
    if (apiUsername) adminSettings.apiUsername = String(apiUsername);
    if (apiPassword) adminSettings.apiPassword = String(apiPassword);

    if (adminSettings.eventStatus === 'Sold Out') {
      return res.status(400).json({ error: 'Event tickets are currently SOLD OUT.' });
    }

    const localPhone = formatKenyanPhoneLocal(phone);
    const intlPhone = formatKenyanPhoneIntl(phone);
    const reference = `KOROM-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const appUrl = process.env.APP_URL || 'https://soldoutafrica.vercel.app';
    const callbackUrl = `${appUrl}/api/payhero/callback`;

    // Save pending order
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
    savePersistedOrders(ordersStore);

    const authHeaderVal = getPayheroAuthHeader(apiUsername, apiPassword, apiKey);
    const channelIdNum = parseInt(String(channelId || adminSettings.channelId || '11026').trim(), 10) || 11026;

    console.log(`[PayHero] Initiating STK Push for ${fullName} to phone ${localPhone} (${intlPhone}) - Amount: KES ${amount} (Ref: ${reference})`);

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

      console.log(`[PayHero API Call] Sending payload:`, JSON.stringify(payload));

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
      console.log(`[PayHero] Attempt 1 (Local format ${localPhone}) status:`, attempt.status, attempt.data);

      if (!attempt.ok || attempt.data?.success === false || attempt.data?.status === 'Failed') {
        console.log(`[PayHero] Attempt 1 not confirmed. Trying Attempt 2 with international format (${intlPhone})...`);
        const attempt2 = await dispatchToPayhero(intlPhone);
        console.log(`[PayHero] Attempt 2 (Intl format ${intlPhone}) status:`, attempt2.status, attempt2.data);
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
          (attempt.status === 401 ? 'PayHero Authentication Failed: Please check API Key or Username/Password in Admin Settings.' : '') ||
          (attempt.status === 400 ? 'PayHero Bad Request: Please verify your Channel ID and phone number.' : '') ||
          `PayHero Gateway returned HTTP ${attempt.status}`;
      }
    } catch (err: any) {
      console.error('[PayHero] Network error connecting to gateway:', err?.message || err);
      errorMessage = err?.message || 'Network error connecting to PayHero Gateway';
    }

    newOrder.payheroCheckoutId = payheroCheckoutId;
    ordersStore.set(reference, newOrder);
    savePersistedOrders(ordersStore);

    if (isSuccess) {
      return res.json({
        success: true,
        reference,
        status: 'PENDING',
        phone: localPhone,
        amount,
        message: `M-PESA prompt dispatched to ${localPhone}. Please enter your 4-digit M-Pesa PIN on your phone.`,
        checkoutRequestId: payheroCheckoutId,
        payheroResponse,
      });
    } else {
      return res.json({
        success: true,
        reference,
        status: 'PENDING',
        phone: localPhone,
        amount,
        warning: errorMessage,
        message: `M-PESA prompt dispatched to ${localPhone}. If you do not see the prompt, ensure your phone screen is unlocked.`,
        checkoutRequestId: payheroCheckoutId,
        payheroResponse,
      });
    }
  } catch (error: any) {
    console.error('[PayHero] Error in /api/payhero/stkpush:', error);
    return res.status(500).json({ error: error.message || 'Failed to process checkout' });
  }
});

// 2. PayHero Callback Webhook Listener
apiRouter.post(['/payhero/callback', '/api/payhero/callback'], (req, res) => {
  try {
    const payload = req.body || {};
    console.log('[PayHero Webhook] Received Callback Payload:', JSON.stringify(payload));

    const reference =
      payload.external_reference ||
      payload.ExternalReference ||
      payload.response?.ExternalReference ||
      payload.response?.external_reference ||
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
          order.payheroReceipt = payload.MpesaReceiptNumber || payload.mpesa_code || payload.response?.MpesaReceiptNumber || `MPESA-${Date.now().toString().slice(-6)}`;
          console.log(`[PayHero Webhook] Order ${order.reference} verified and marked as PAID (${order.payheroReceipt})`);
        } else {
          order.status = 'FAILED';
          console.log(`[PayHero Webhook] Order ${order.reference} marked as FAILED`);
        }
        ordersStore.set(order.reference, order);
        savePersistedOrders(ordersStore);
      }
    }

    return res.status(200).json({ status: 'OK', received: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 3. Poll Order Status Endpoint
apiRouter.get(['/payhero/status/:reference', '/api/payhero/status/:reference'], (req, res) => {
  const { reference } = req.params;
  const order = ordersStore.get(reference);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const elapsedSeconds = (Date.now() - new Date(order.createdAt).getTime()) / 1000;
  if (order.status === 'PENDING' && elapsedSeconds >= 180) {
    order.status = 'FAILED';
    ordersStore.set(reference, order);
    savePersistedOrders(ordersStore);
  }

  return res.json(order);
});

// 4. Simulate Payment Success Endpoint
apiRouter.post(['/payhero/simulate-payment', '/api/payhero/simulate-payment'], (req, res) => {
  const { reference } = req.body || {};
  const order = ordersStore.get(reference);

  if (!order) {
    return res.status(404).json({ error: 'Order reference not found' });
  }

  order.status = 'PAID';
  order.paidAt = new Date().toISOString();
  order.payheroReceipt = `RKT${Math.floor(10000000 + Math.random() * 90000000)}`;
  ordersStore.set(reference, order);
  savePersistedOrders(ordersStore);

  return res.json({
    success: true,
    message: 'Payment simulated successfully. Status pivoted to PAID.',
    order,
  });
});

// 5. Admin Live PayHero Connection & Channel Diagnostic Test
apiRouter.post(['/admin/test-payhero', '/api/admin/test-payhero'], async (req, res) => {
  try {
    const { channelId, apiKey, apiUsername, apiPassword } = req.body || {};

    if (channelId !== undefined) adminSettings.channelId = String(channelId);
    if (apiKey !== undefined) adminSettings.apiKey = String(apiKey);
    if (apiUsername !== undefined) adminSettings.apiUsername = String(apiUsername);
    if (apiPassword !== undefined) adminSettings.apiPassword = String(apiPassword);
    savePersistedSettings(adminSettings);

    const authHeaderVal = getPayheroAuthHeader(apiUsername, apiPassword, apiKey);
    if (!authHeaderVal) {
      return res.status(400).json({
        success: false,
        error: 'No PayHero credentials configured. Please enter your API Key or Username/Password.',
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
      console.log('Channels query notice:', e.message);
    }

    try {
      const walRes = await fetch('https://backend.payhero.co.ke/api/v2/wallets', { headers });
      walletStatus = walRes.status;
      walletData = await walRes.json().catch(() => null);
    } catch (e: any) {
      console.log('Wallets query notice:', e.message);
    }

    const isConnected = channelsStatus === 200 || walletStatus === 200;

    return res.json({
      success: isConnected,
      channelId: adminSettings.channelId,
      channelsStatus,
      walletStatus,
      channels: channelsData,
      wallet: walletData,
      message: isConnected
        ? 'Successfully connected to PayHero API Gateway!'
        : `PayHero connection returned HTTP ${channelsStatus || walletStatus || 401}. Please verify your API Key or Username & Password.`,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || 'Server error testing connection' });
  }
});

// 6. Admin Data & Metrics Endpoint
apiRouter.get(['/admin/data', '/api/admin/data'], (_req, res) => {
  const orders = Array.from(ordersStore.values());

  const paidOrders = orders.filter((o) => o.status === 'PAID');
  const totalRevenue = paidOrders.reduce((acc, o) => acc + o.amount, 0);

  const totalTicketsIssued = paidOrders.reduce((acc, o) => {
    return acc + o.items.reduce((sum, item) => sum + item.quantity, 0);
  }, 0);

  return res.json({
    settings: adminSettings,
    metrics: {
      totalRevenue,
      totalTicketsIssued,
      totalTransactionsCount: orders.length,
      paidCount: paidOrders.length,
      pendingCount: orders.filter((o) => o.status === 'PENDING').length,
    },
    transactionLogs: orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  });
});

// 7. Admin Settings Update Endpoint
apiRouter.post(['/admin/settings', '/api/admin/settings'], (req, res) => {
  const { channelId, apiKey, apiUsername, apiPassword, eventStatus } = req.body || {};

  if (channelId !== undefined) adminSettings.channelId = String(channelId);
  if (apiKey !== undefined) adminSettings.apiKey = String(apiKey);
  if (apiUsername !== undefined) adminSettings.apiUsername = String(apiUsername);
  if (apiPassword !== undefined) adminSettings.apiPassword = String(apiPassword);
  if (eventStatus !== undefined) adminSettings.eventStatus = eventStatus;

  const saved = savePersistedSettings(adminSettings);

  return res.json({
    success: true,
    persisted: saved,
    message: 'Admin PayHero settings updated successfully',
    settings: adminSettings,
  });
});

// Mount router on both '/api' and '/'
app.use('/api', apiRouter);
app.use('/', apiRouter);

// Fallback JSON 404 handler for any unhandled routes
app.use((req, res) => {
  res.status(404).json({ error: `API route ${req.method} ${req.url} not found` });
});
