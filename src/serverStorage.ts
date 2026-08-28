import fs from 'fs';
import path from 'path';

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

function getStorageDir(): string {
  // If running in Vercel or Lambda serverless environment, use /tmp directly
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT) {
    const tmpDir = path.join('/tmp', 'korom_ticketing_data');
    try {
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
      return tmpDir;
    } catch {
      return '/tmp';
    }
  }

  try {
    const defaultDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(defaultDir)) {
      fs.mkdirSync(defaultDir, { recursive: true });
    }
    return defaultDir;
  } catch {
    const tmpDir = path.join('/tmp', 'korom_ticketing_data');
    try {
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
      return tmpDir;
    } catch {
      return '/tmp';
    }
  }
}

const STORAGE_DIR = getStorageDir();
const SETTINGS_FILE = path.join(STORAGE_DIR, 'payhero_settings.json');
const ORDERS_FILE = path.join(STORAGE_DIR, 'payhero_orders.json');

export function loadPersistedSettings(defaultSettings: AdminSettings): AdminSettings {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const raw = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        channelId: parsed.channelId || defaultSettings.channelId || '11026',
        apiKey: parsed.apiKey || defaultSettings.apiKey || '',
        apiUsername: parsed.apiUsername || defaultSettings.apiUsername || '',
        apiPassword: parsed.apiPassword || defaultSettings.apiPassword || '',
        eventStatus: parsed.eventStatus || defaultSettings.eventStatus || 'On Sale',
      };
    }
  } catch (err) {
    console.warn('[Storage] Could not load persisted settings:', err);
  }
  return defaultSettings;
}

export function savePersistedSettings(settings: AdminSettings): boolean {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[Storage] Error saving settings to disk:', err);
    return false;
  }
}

export function loadPersistedOrders(seedOrders: TransactionOrder[]): Map<string, TransactionOrder> {
  const map = new Map<string, TransactionOrder>();
  // Add seed orders first
  seedOrders.forEach((o) => map.set(o.reference, o));

  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        parsed.forEach((ord: TransactionOrder) => {
          if (ord && ord.reference) {
            map.set(ord.reference, ord);
          }
        });
      }
    }
  } catch (err) {
    console.warn('[Storage] Could not load persisted orders:', err);
  }
  return map;
}

export function savePersistedOrders(ordersStore: Map<string, TransactionOrder>): boolean {
  try {
    const ordersList = Array.from(ordersStore.values());
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(ordersList, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[Storage] Error saving orders to disk:', err);
    return false;
  }
}
