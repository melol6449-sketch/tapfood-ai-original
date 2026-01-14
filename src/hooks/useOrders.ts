import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  payment_method: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "preparing" | "ready" | "delivered";
  created_at: string;
  updated_at: string;
}

export function useOrders(onNewOrder?: () => void) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const previousOrderIdsRef = useRef<Set<string>>(new Set());
  const isInitialLoadRef = useRef(true);

  const fetchOrders = useCallback(async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      return;
    }

    // Parse items from JSONB
    const parsedOrders = (data || []).map((order) => ({
      ...order,
      items: order.items as unknown as OrderItem[],
      status: order.status as Order["status"],
    }));

    // Check for new orders (only after initial load)
    if (!isInitialLoadRef.current && onNewOrder) {
      const currentIds = new Set(parsedOrders.map((o) => o.id));
      const previousIds = previousOrderIdsRef.current;
      
      // Check if there's a new order that wasn't in the previous set
      for (const id of currentIds) {
        if (!previousIds.has(id)) {
          onNewOrder();
          break;
        }
      }
    }

    // Update previous order IDs
    previousOrderIdsRef.current = new Set(parsedOrders.map((o) => o.id));
    isInitialLoadRef.current = false;

    setOrders(parsedOrders);
    setLoading(false);
  }, [onNewOrder]);

  const updateOrderStatus = async (orderId: string, newStatus: Order["status"]) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      console.error("Error updating order status:", error);
      return false;
    }

    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    return true;
  };

  useEffect(() => {
    fetchOrders();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("orders-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOrders]);

  return { orders, loading, updateOrderStatus, refetch: fetchOrders };
}
