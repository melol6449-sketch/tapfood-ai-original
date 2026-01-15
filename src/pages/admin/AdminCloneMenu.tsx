import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ClonedProduct {
  name: string;
  description: string;
  price: number;
  image?: string;
}

interface ClonedCategory {
  name: string;
  products: ClonedProduct[];
}

interface CloneResult {
  categories: ClonedCategory[];
  restaurantName?: string;
}

export default function AdminCloneMenu() {
  const [ifoodUrl, setIfoodUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<string>("");
  const [result, setResult] = useState<CloneResult | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const validateIfoodUrl = (url: string): boolean => {
    // Accept various iFood URL formats
    const patterns = [
      /ifood\.com\.br/,
      /ifood\.com/,
    ];
    return patterns.some(pattern => pattern.test(url));
  };

  const handleClone = async () => {
    if (!ifoodUrl.trim()) {
      toast({
        title: "URL obrigatória",
        description: "Por favor, insira o link do cardápio do iFood.",
        variant: "destructive",
      });
      return;
    }

    if (!validateIfoodUrl(ifoodUrl)) {
      toast({
        title: "URL inválida",
        description: "Por favor, insira um link válido do iFood.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setProgress("Conectando ao iFood...");
    setResult(null);

    try {
      setProgress("Extraindo dados do cardápio...");
      
      const { data, error } = await supabase.functions.invoke('clone-ifood-menu', {
        body: { url: ifoodUrl },
      });

      if (error) {
        throw new Error(error.message || "Erro ao clonar cardápio");
      }

      if (!data.success) {
        throw new Error(data.error || "Não foi possível extrair o cardápio");
      }

      setResult(data.data);
      setProgress("Cardápio extraído com sucesso!");
      
      toast({
        title: "Cardápio extraído!",
        description: `Encontradas ${data.data.categories?.length || 0} categorias. Clique em "Importar" para adicionar ao seu cardápio.`,
      });

    } catch (error) {
      console.error('Error cloning menu:', error);
      toast({
        title: "Erro na clonagem",
        description: error instanceof Error ? error.message : "Não foi possível clonar o cardápio. Verifique o link e tente novamente.",
        variant: "destructive",
      });
      setProgress("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async () => {
    if (!result?.categories?.length) return;

    setIsLoading(true);
    setProgress("Importando categorias e produtos...");

    try {
      let totalProductsInserted = 0;
      let totalProductsUpdated = 0;
      let totalCategoriesCreated = 0;

      // Sempre busque o estado atual do banco para evitar duplicar categorias/produtos
      const { data: existingCategories, error: categoriesError } = await supabase
        .from("menu_categories")
        .select("id,name,position");

      if (categoriesError) throw categoriesError;

      const categoryMap = new Map(
        (existingCategories || []).map((c) => [c.name.toLowerCase(), c])
      );

      let nextCategoryPosition =
        Math.max(...(existingCategories || []).map((c) => c.position), -1) + 1;

      for (const category of result.categories) {
        setProgress(`Processando categoria "${category.name}"...`);

        const normalizedCategoryName = category.name.trim();
        const categoryKey = normalizedCategoryName.toLowerCase();

        let categoryId = categoryMap.get(categoryKey)?.id;

        // 1) Criar categoria se não existir
        if (!categoryId) {
          const { data: newCategory, error: createCategoryError } = await supabase
            .from("menu_categories")
            .insert({
              name: normalizedCategoryName,
              icon: "🍽️",
              position: nextCategoryPosition,
            })
            .select("id,name,position")
            .single();

          if (createCategoryError) throw createCategoryError;

          categoryId = newCategory.id;
          categoryMap.set(categoryKey, newCategory);
          nextCategoryPosition += 1;
          totalCategoriesCreated += 1;
        }

        // 2) Buscar produtos existentes dessa categoria para atualizar ao invés de duplicar
        const { data: existingProducts, error: productsFetchError } = await supabase
          .from("menu_products")
          .select("id,name")
          .eq("category_id", categoryId);

        if (productsFetchError) throw productsFetchError;

        const productMap = new Map(
          (existingProducts || []).map((p) => [p.name.toLowerCase(), p])
        );

        const productsToInsert: Array<{
          category_id: string;
          name: string;
          description: string;
          price: number;
          image: string | null;
          position: number;
        }> = [];

        const productsToUpdate: Array<{ id: string; data: any }> = [];

        category.products.forEach((product, index) => {
          const normalizedProductName = product.name.trim();
          const productKey = normalizedProductName.toLowerCase();

          const image = product.image?.trim() ? product.image.trim() : null;

          const payload = {
            category_id: categoryId,
            name: normalizedProductName,
            description: (product.description || "").trim(),
            price: Number(product.price) || 0,
            image,
            position: index,
          };

          const existing = productMap.get(productKey);
          if (existing) {
            productsToUpdate.push({ id: existing.id, data: payload });
          } else {
            productsToInsert.push(payload);
          }
        });

        // 3) Inserir novos produtos em lote
        if (productsToInsert.length > 0) {
          const { data: inserted, error: insertError } = await supabase
            .from("menu_products")
            .insert(productsToInsert)
            .select("id");

          if (insertError) throw insertError;
          totalProductsInserted += inserted?.length || 0;
        }

        // 4) Atualizar produtos existentes (evita duplicação quando clonar novamente)
        if (productsToUpdate.length > 0) {
          const updatePromises = productsToUpdate.map(({ id, data }) =>
            supabase.from("menu_products").update(data).eq("id", id)
          );
          const results = await Promise.all(updatePromises);
          const updateErrors = results
            .map((r) => r.error)
            .filter(Boolean) as Array<{ message: string }>;

          if (updateErrors.length) {
            throw new Error(updateErrors[0].message);
          }

          totalProductsUpdated += productsToUpdate.length;
        }
      }

      toast({
        title: "Importação concluída!",
        description: `${totalCategoriesCreated} categorias criadas, ${totalProductsInserted} produtos adicionados e ${totalProductsUpdated} produtos atualizados.`,
      });

      // Redireciona para a Gestão de Cardápio para o admin ver imediatamente as imagens/itens.
      navigate("/admin/cardapio", { replace: true });

    } catch (error) {
      console.error("Error importing menu:", error);
      toast({
        title: "Erro na importação",
        description:
          error instanceof Error
            ? error.message
            : "Ocorreu um erro ao importar o cardápio.",
        variant: "destructive",
      });
      setProgress("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6 bg-background">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clonagem de Cardápio</h1>
          <p className="text-muted-foreground mt-1">
            Importe seu cardápio do iFood automaticamente
          </p>
        </div>

        {/* Instructions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ExternalLink className="w-5 h-5" />
              Como clonar seu cardápio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>1. Acesse o iFood e copie o link da página do seu restaurante</p>
            <p>2. Cole o link no campo abaixo</p>
            <p>3. Clique em "Clonar Cardápio" e aguarde a extração</p>
            <p>4. Revise os dados e clique em "Importar" para adicionar ao seu cardápio</p>
          </CardContent>
        </Card>

        {/* Clone Form */}
        <Card>
          <CardHeader>
            <CardTitle>Link do iFood</CardTitle>
            <CardDescription>
              Cole o link do cardápio público do seu restaurante no iFood
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Input
                placeholder="https://www.ifood.com.br/delivery/cidade/restaurante/..."
                value={ifoodUrl}
                onChange={(e) => setIfoodUrl(e.target.value)}
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={handleClone} 
                disabled={isLoading || !ifoodUrl.trim()}
                className="min-w-[140px]"
              >
                {isLoading && !result ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Clonando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Clonar Cardápio
                  </>
                )}
              </Button>
            </div>

            {progress && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                )}
                <span>{progress}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Preview */}
        {result && result.categories && result.categories.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Prévia do Cardápio</CardTitle>
                <CardDescription>
                  {result.restaurantName && `${result.restaurantName} - `}
                  {result.categories.length} categorias encontradas
                </CardDescription>
              </div>
              <Button onClick={handleImport} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Importando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Importar Cardápio
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[400px] overflow-y-auto">
              {result.categories.map((category, catIndex) => (
                <div key={catIndex} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2">
                    {category.name} ({category.products.length} itens)
                  </h3>
                  <div className="space-y-2">
                    {category.products.slice(0, 5).map((product, prodIndex) => (
                      <div key={prodIndex} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{product.name}</span>
                        <span className="font-medium">
                          R$ {product.price.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    ))}
                    {category.products.length > 5 && (
                      <p className="text-xs text-muted-foreground">
                        +{category.products.length - 5} itens...
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {result && (!result.categories || result.categories.length === 0) && (
          <Card>
            <CardContent className="py-8 text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">
                Nenhum item encontrado
              </h3>
              <p className="text-sm text-muted-foreground">
                Não foi possível extrair itens do cardápio. Verifique se o link está correto.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
