import { useState } from "react";
import { Copy, CheckCircle, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PixPaymentScreenProps {
  pixKey: string;
  pixKeyType: string;
  total: number;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function PixPaymentScreen({
  pixKey,
  pixKeyType,
  total,
  onConfirm,
  isSubmitting,
}: PixPaymentScreenProps) {
  const [copied, setCopied] = useState(false);

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const getPixKeyTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      cpf: "CPF",
      cnpj: "CNPJ",
      email: "E-mail",
      phone: "Telefone",
      random: "Chave aleatória",
    };
    return labels[type] || "Chave PIX";
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pixKey);
      setCopied(true);
      toast.success("Chave PIX copiada!");
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error("Erro ao copiar chave");
    }
  };

  // Generate a simple QR code using a public API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixKey)}`;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <QrCode className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-1">Pagamento via PIX</h3>
        <p className="text-muted-foreground">
          Escaneie o QR Code ou copie a chave PIX
        </p>
      </div>

      {/* QR Code */}
      <div className="flex justify-center">
        <div className="p-4 bg-white rounded-xl border">
          <img
            src={qrCodeUrl}
            alt="QR Code PIX"
            className="w-48 h-48"
          />
        </div>
      </div>

      {/* PIX Key */}
      <div className="bg-secondary rounded-xl p-4">
        <div className="text-center mb-3">
          <p className="text-sm text-muted-foreground mb-1">
            {getPixKeyTypeLabel(pixKeyType)}
          </p>
          <p className="font-mono text-sm break-all font-medium">{pixKey}</p>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
              Copiado!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copiar chave PIX
            </>
          )}
        </Button>
      </div>

      {/* Total */}
      <div className="bg-primary/5 rounded-xl p-4 text-center">
        <p className="text-sm text-muted-foreground mb-1">Valor a pagar</p>
        <p className="text-2xl font-bold text-primary">{formatPrice(total)}</p>
      </div>

      <Button
        onClick={onConfirm}
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Enviando pedido..." : "Já fiz o pagamento"}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Após realizar o pagamento, clique no botão acima para confirmar seu pedido.
      </p>
    </div>
  );
}
