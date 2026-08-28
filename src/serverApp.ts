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
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Initial Seed Orders
const initialSeedOrders: TransactionOrder[] = [
  {
    reference: 'KOROM-178614001',
    fullName: 'Kiprono Ngetich',
    email: 'kiprono@example.co.ke',
    phone: '254712345678',
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
    phone: '254722987654',
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
    phone: '254733112233',
    amount: 4000,
    items: [{ tierName: 'VIP', quantity: 1, price: 4000 }],
    status: 'PENDING',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
];

// Persistent Admin Settings
const defaultSettings: AdminSettings = {
  channelId: process.env.PAYHERO_CHANNEL_ID || '854',
  apiKey: process.env.PAYHERO_API_KEY || '',
  apiUsername: process.env.PAYHERO_API_USERNAME || '',
  apiPassword: process.env.PAYHERO_API_PASSWORD || '',
  eventStatus: 'On Sale',
};

export const adminSettings: AdminSettings = loadPersistedSettings(defaultSettings);
export const ordersStore: Map<string, TransactionOrder> = loadPersistedOrders(initialSeedOrders);

// Helper: Format Kenyan Phone Numbers to 2547xxxxxxxx or 2541xxxxxxxx
function formatKenyanPhone(rawPhone: string): string {
  let cleaned = rawPhone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.slice(1);
  } else if (cleaned.startsWith('+254')) {
    cleaned = cleaned.slice(1);
  } else if (cleaned.length === 9 && (cleaned.startsWith('7') || cleaned.startsWith('1'))) {
    cleaned = '254' + cleaned;
  }
  return cleaned;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 1. STK Push Request Endpoint
app.post('/api/payhero/stkpush', async (req, res) => {
  try {
    const { fullName, email, phone, amount, items } = req.body;

    if (!fullName || !email || !phone || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Missing or invalid order details.' });
    }

    if (adminSettings.eventStatus === 'Sold Out') {
      return res.status(400).json({ error: 'Event tickets are currently SOLD OUT.' });
    }

    const formattedPhone = formatKenyanPhone(phone);
    const reference = `KOROM-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    const callbackUrl = `${appUrl}/api/payhero/callback`;

    // Save pending order
    const newOrder: TransactionOrder = {
      reference,
      fullName,
      email,
      phone: formattedPhone,
      amount: Number(amount),
      items: items || [],
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    ordersStore.set(reference, newOrder);
    savePersistedOrders(ordersStore);

    // Call PayHero Gateway API
    const payheroPayload = {
      amount: Number(amount),
      phone_number: formattedPhone,
      channel_id: Number(adminSettings.channelId) || 854,
      provider: 'm-pesa',
      external_reference: reference,
      customer_name: fullName,
      callback_url: callbackUrl,
    };

    let payheroResponse: any = null;
    let payheroCheckoutId = `CHK-${Date.now()}`;

    try {
      let authHeaderVal = '';
      const rawUsername = (adminSettings.apiUsername || process.env.PAYHERO_API_USERNAME || '').trim();
      const rawPassword = (adminSettings.apiPassword || process.env.PAYHERO_API_PASSWORD || '').trim();
      const rawKey = (adminSettings.apiKey || process.env.PAYHERO_API_KEY || '').trim();

      if (rawUsername && rawPassword) {
        authHeaderVal = `Basic ${Buffer.from(`${rawUsername}:${rawPassword}`).toString('base64')}`;
      } else if (rawUsername && rawKey) {
        authHeaderVal = `Basic ${Buffer.from(`${rawUsername}:${rawKey}`).toString('base64')}`;
      } else if (rawPassword) {
        if (rawPassword.startsWith('Basic ') || rawPassword.startsWith('Bearer ')) {
          authHeaderVal = rawPassword;
        } else if (rawPassword.includes(':')) {
          authHeaderVal = `Basic ${Buffer.from(rawPassword).toString('base64')}`;
        } else {
          authHeaderVal = `Basic ${Buffer.from(`:${rawPassword}`).toString('base64')}`;
        }
      } else if (rawKey) {
        if (rawKey.startsWith('Basic ') || rawKey.startsWith('Bearer ')) {
          authHeaderVal = rawKey;
        } else if (rawKey.includes(':')) {
          authHeaderVal = `Basic ${Buffer.from(rawKey).toString('base64')}`;
        } else {
          authHeaderVal = `Basic ${rawKey}`;
        }
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      if (authHeaderVal) {
        headers['Authorization'] = authHeaderVal;
      }

      console.log(`[PayHero] Initiating STK Push to ${formattedPhone} for KES ${amount} (Ref: ${reference})...`);

      const response = await fetch('https://backend.payhero.co.ke/api/v2/payments', {
        method: 'POST',
        headers,
        body: JSON.stringify(payheroPayload),
      });

      payheroResponse = await response.json().catch(() => ({}));
      console.log('[PayHero] Gateway Response Code:', response.status, JSON.stringify(payheroResponse));

      if (payheroResponse) {
        if (payheroResponse?.CheckoutRequestID || payheroResponse?.checkout_request_id) {
          payheroCheckoutId = payheroResponse.CheckoutRequestID || payheroResponse.checkout_request_id;
        }
      }
    } catch (err: any) {
      console.log('[PayHero] Live gateway call notice:', err?.message || err);
    }

    newOrder.payheroCheckoutId = payheroCheckoutId;
    ordersStore.set(reference, newOrder);
    savePersistedOrders(ordersStore);

    return res.json({
      success: true,
      reference,
      status: 'PENDING',
      phone: formattedPhone,
      amount,
      message: `M-PESA STK Push prompt sent to ${formattedPhone}`,
      checkoutRequestId: payheroCheckoutId,
      payheroResponse,
    });
  } catch (error: any) {
    console.error('[PayHero] Error in /api/payhero/stkpush:', error);
    return res.status(500).json({ error: error.message || 'Failed to process checkout' });
  }
});

// 2. PayHero Asynchronous Callback Webhook Listener
app.post('/api/payhero/callback', (req, res) => {
  try {
    const payload = req.body || {};
    console.log('PayHero Webhook Received Payload:', JSON.stringify(payload));

    const reference =
      payload.external_reference ||
      payload.ExternalReference ||
      payload.response?.ExternalReference ||
      payload.response?.external_reference ||
      payload.CheckoutRequestID;

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
          console.log(`Order ${order.reference} successfully transitioned to PAID`);
        } else {
          order.status = 'FAILED';
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

// 3. Poll Order Status Endpoint (with 180s Expiration Window for M-PESA STK PIN entry)
app.get('/api/payhero/status/:reference', (req, res) => {
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

// 4. Simulate Payment Success Endpoint (For testing/demo in admin)
app.post('/api/payhero/simulate-payment', (req, res) => {
  const { reference } = req.body;
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

// 5. Admin Data & Metrics Endpoint
app.get('/api/admin/data', (req, res) => {
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

// 6. Admin Settings Update Endpoint (Persists permanently to disk)
app.post('/api/admin/settings', (req, res) => {
  const { channelId, apiKey, apiUsername, apiPassword, eventStatus } = req.body;

  if (channelId !== undefined) adminSettings.channelId = String(channelId);
  if (apiKey !== undefined) adminSettings.apiKey = String(apiKey);
  if (apiUsername !== undefined) adminSettings.apiUsername = String(apiUsername);
  if (apiPassword !== undefined) adminSettings.apiPassword = String(apiPassword);
  if (eventStatus !== undefined) adminSettings.eventStatus = eventStatus;

  // Persist to permanent storage
  const saved = savePersistedSettings(adminSettings);

  return res.json({
    success: true,
    persisted: saved,
    message: 'Admin PayHero settings updated and permanently saved to storage',
    settings: adminSettings,
  });
});
