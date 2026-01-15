import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle, MapPin, User, Phone, CreditCard, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { useRestaurantSettings } from "@/hooks/useRestaurantSettings";
import { toast } from "sonner";
import { PixPaymentScreen } from "./PixPaymentScreen";

const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres").max(100, "Nome muito longo"),
  phone: z.string().trim().min(10, "Telefone inválido").max(20, "Telefone muito longo"),
  address: z.string().trim().min(5, "Endereço deve ter pelo menos 5 caracteres").max(200, "Endereço muito longo"),
  paymentMethod: z.string().min(1, "Selecione uma forma de pagamento"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CheckoutDialog({ open, onOpenChange }: CheckoutDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [showPixScreen, setShowPixScreen] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData | null>(null);
  const { items, total, clearCart } = useCart();
  const { settings } = useRestaurantSettings();

  const paymentMethods = settings?.payment_methods || ["Dinheiro", "Pix", "Cartão"];

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      paymentMethod: "",
    },
  });

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const submitOrder = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast.error("Seu carrinho está vazio");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems = items.map((item) => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error } = await supabase.from("orders").insert({
        customer_name: data.name,
        customer_phone: data.phone,
        customer_address: data.address,
        payment_method: data.paymentMethod,
        items: orderItems,
        total: total,
        status: "pending",
      });

      if (error) throw error;

      setOrderComplete(true);
      setShowPixScreen(false);
      clearCart();
      form.reset();
      toast.success("Pedido realizado com sucesso!");
    } catch {
      toast.error("Erro ao realizar pedido. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: CheckoutFormData) => {
    // Check if PIX was selected and PIX key is configured
    const isPixPayment = data.paymentMethod.toLowerCase() === "pix";
    const hasPixKey = settings?.pix_key && settings.pix_key.trim() !== "";

    if (isPixPayment && hasPixKey) {
      // Save form data and show PIX screen
      setFormData(data);
      setShowPixScreen(true);
    } else {
      // Submit order directly
      await submitOrder(data);
    }
  };

  const handlePixConfirm = async () => {
    if (formData) {
      await submitOrder(formData);
    }
  };

  const handleBackFromPix = () => {
    setShowPixScreen(false);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setOrderComplete(false);
      setShowPixScreen(false);
      setFormData(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {showPixScreen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBackFromPix}
                className="h-8 w-8"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            {orderComplete
              ? "Pedido Confirmado!"
              : showPixScreen
              ? "Pagamento PIX"
              : "Finalizar Pedido"}
          </DialogTitle>
        </DialogHeader>

        {orderComplete ? (
          <div className="py-8 text-center">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Obrigado pelo seu pedido!</h3>
            <p className="text-muted-foreground mb-6">
              Seu pedido foi recebido e está sendo preparado.
            </p>
            <Button onClick={handleClose} className="w-full">
              Voltar ao Menu
            </Button>
          </div>
        ) : showPixScreen && settings?.pix_key ? (
          <PixPaymentScreen
            pixKey={settings.pix_key}
            pixKeyType={settings.pix_key_type || "random"}
            total={total}
            onConfirm={handlePixConfirm}
            isSubmitting={isSubmitting}
          />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Nome
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Telefone
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 00000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Endereço de Entrega
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Rua, número, bairro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Forma de Pagamento
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="grid grid-cols-3 gap-2"
                      >
                        {paymentMethods.map((method) => (
                          <div key={method}>
                            <RadioGroupItem
                              value={method}
                              id={method}
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor={method}
                              className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer text-sm"
                            >
                              {method}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="border-t pt-4">
                <div className="flex items-center justify-between text-lg font-bold mb-4">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Confirmar Pedido"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
