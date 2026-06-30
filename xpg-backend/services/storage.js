const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

let supabase = null;
function getClient() {
  if (!supabase && supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabaseUrl && supabaseKey ? supabase : null;
}

const memStore = { orders: [], transactions: [] };

let useSupabase = true;

async function withFallback(supabaseFn, memFn) {
  const client = getClient();
  if (client && useSupabase) {
    try {
      return await supabaseFn(client);
    } catch (err) {
      if (err.code === 'PGRST205' || err.message?.includes('relation') || err.message?.includes('does not exist')) {
        console.warn('Supabase tables not found — falling back to in-memory storage');
        useSupabase = false;
      } else {
        throw err;
      }
    }
  }
  return memFn();
}

async function createOrder(itemName, amount) {
  return withFallback(
    async (client) => {
      const { data, error } = await client
        .from('orders')
        .insert({ item_name: itemName, amount })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    () => {
      const order = {
        order_id: crypto.randomUUID(),
        item_name: itemName,
        amount,
        status: 'pending',
        created_at: new Date().toISOString()
      };
      memStore.orders.push(order);
      return order;
    }
  );
}

async function getOrder(orderId) {
  return withFallback(
    async (client) => {
      const { data, error } = await client
        .from('orders')
        .select()
        .eq('order_id', orderId)
        .single();
      if (error) return null;
      return data;
    },
    () => memStore.orders.find(o => o.order_id === orderId) || null
  );
}

async function updateOrderStatus(orderId, status) {
  return withFallback(
    async (client) => {
      const { data, error } = await client
        .from('orders')
        .update({ status })
        .eq('order_id', orderId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    () => {
      const order = memStore.orders.find(o => o.order_id === orderId);
      if (order) order.status = status;
      return order;
    }
  );
}

async function createTransaction(orderId, xenditId, invoiceUrl) {
  return withFallback(
    async (client) => {
      const { data, error } = await client
        .from('transactions')
        .insert({ order_id: orderId, xendit_id: xenditId, invoice_url: invoiceUrl })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    () => {
      const tx = {
        tx_id: crypto.randomUUID(),
        order_id: orderId,
        xendit_id: xenditId,
        invoice_url: invoiceUrl,
        created_at: new Date().toISOString()
      };
      memStore.transactions.push(tx);
      return tx;
    }
  );
}

async function getTransactionByOrder(orderId) {
  return withFallback(
    async (client) => {
      const { data, error } = await client
        .from('transactions')
        .select()
        .eq('order_id', orderId)
        .single();
      if (error) return null;
      return data;
    },
    () => memStore.transactions.find(t => t.order_id === orderId) || null
  );
}

module.exports = { createOrder, getOrder, updateOrderStatus, createTransaction, getTransactionByOrder };
