import { useEffect, useState, useCallback } from "react";
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

  const fetchOrders = useCallback(async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return;
    }

    // Parse items from JSONB
    const parsedOrders = (data || []).map((order) => ({
      ...order,
      items: order.items as unknown as OrderItem[],
      status: order.status as Order["status"],
    }));

    setOrders(parsedOrders);
    setLoading(false);
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: Order["status"]) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
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
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          // Add new order to the list
          const newOrder = {
            ...payload.new,
            items: payload.new.items as unknown as OrderItem[],
            status: payload.new.status as Order["status"],
          } as Order;
          
          setOrders((prev) => [newOrder, ...prev]);
          
          // Trigger notification callback
          if (onNewOrder) {
            onNewOrder();
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        (payload) => {
          const updatedOrder = {
            ...payload.new,
            items: payload.new.items as unknown as OrderItem[],
            status: payload.new.status as Order["status"],
          } as Order;
          
          setOrders((prev) =>
            prev.map((order) =>
              order.id === updatedOrder.id ? updatedOrder : order
            )
          );
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "orders" },
        (payload) => {
          setOrders((prev) =>
            prev.filter((order) => order.id !== payload.old.id)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOrders, onNewOrder]);

  return { orders, loading, updateOrderStatus, refetch: fetchOrders };
}
