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

function getSafeStoragePath(filename: string): string | null {
  try {
    const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT);
    const baseDir = isServerless ? '/tmp' : path.join(process.cwd(), 'data');
    if (!fs.existsSync(baseDir)) {
      try {
        fs.mkdirSync(baseDir, { recursive: true });
      } catch {
        return null;
      }
    }
    return path.join(baseDir, filename);
  } catch {
    return null;
  }
}

export function loadPersistedSettings(defaultSettings: AdminSettings): AdminSettings {
  try {
    const filePath = getSafeStoragePath('payhero_settings.json');
    if (filePath && fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
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
    console.warn('[Storage] Notice on loading settings:', err);
  }
  return defaultSettings;
}

export function savePersistedSettings(settings: AdminSettings): boolean {
  try {
    const filePath = getSafeStoragePath('payhero_settings.json');
    if (filePath) {
      fs.writeFileSync(filePath, JSON.stringify(settings, null, 2), 'utf-8');
      return true;
    }
  } catch (err) {
    console.warn('[Storage] Notice saving settings to disk:', err);
  }
  return false;
}

export function loadPersistedOrders(seedOrders: TransactionOrder[]): Map<string, TransactionOrder> {
  const map = new Map<string, TransactionOrder>();
  seedOrders.forEach((o) => map.set(o.reference, o));

  try {
    const filePath = getSafeStoragePath('payhero_orders.json');
    if (filePath && fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
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
    console.warn('[Storage] Notice on loading orders:', err);
  }
  return map;
}

export function savePersistedOrders(ordersStore: Map<string, TransactionOrder>): boolean {
  try {
    const filePath = getSafeStoragePath('payhero_orders.json');
    if (filePath) {
      const ordersList = Array.from(ordersStore.values());
      fs.writeFileSync(filePath, JSON.stringify(ordersList, null, 2), 'utf-8');
      return true;
    }
  } catch (err) {
    console.warn('[Storage] Notice saving orders to disk:', err);
  }
  return false;
}
