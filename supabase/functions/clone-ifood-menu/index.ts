import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Product {
  name: string;
  description: string;
  price: number;
  image?: string;
}

interface Category {
  name: string;
  products: Product[];
}

interface MenuData {
  categories: Category[];
  restaurantName?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check - require admin role
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Não autorizado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify JWT and check admin role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Token inválido' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check admin role using the has_role function via RPC
    const { data: isAdmin, error: roleError } = await supabaseAdmin.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });

    if (roleError || !isAdmin) {
      return new Response(
        JSON.stringify({ success: false, error: 'Acesso restrito a administradores' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL é obrigatória' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl não está configurado. Configure o conector nas configurações do projeto.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format URL
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    // Use Firecrawl to scrape the page with JSON extraction
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: formattedUrl,
        formats: ['markdown', 'extract'],
        extract: {
          prompt: `Extract the restaurant menu from this iFood page. For each category, list all products with their names, descriptions, prices, AND image URLs.
            Look for product images in img tags, background-image styles, or data attributes near each product.
            Return the data in this exact format:
            {
              "restaurantName": "Name of the restaurant",
              "categories": [
                {
                  "name": "Category name",
                  "products": [
                    {
                      "name": "Product name",
                      "description": "Product description",
                      "price": 29.90,
                      "image": "https://full-url-to-product-image.jpg"
                    }
                  ]
                }
              ]
            }
            IMPORTANT: 
            - Make sure prices are numbers (not strings). If a price is not found, use 0.
            - Extract the FULL image URL for each product (usually from static-images.ifood.com.br or similar CDN).
            - If no image is found for a product, omit the image field or set it to null.
            - Extract all categories and products you can find on the page.`
        },
        onlyMainContent: false,
        waitFor: 3000, // Wait for dynamic content to load
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({ success: false, error: data.error || `Erro ao acessar o iFood: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract the JSON data from the response
    let menuData: MenuData = { categories: [] };
    
    // Check for extract result first (structured data)
    const extractResult = data.data?.extract || data.extract;
    if (extractResult) {
      menuData = extractResult;
    } else {
      // Fallback: try to parse from markdown
      const markdown = data.data?.markdown || data.markdown;
      if (markdown) {
        menuData = parseMenuFromMarkdown(markdown);
      }
    }

    // Validate and clean the data
    if (menuData.categories && Array.isArray(menuData.categories)) {
      menuData.categories = menuData.categories.map(category => ({
        name: String(category.name || 'Sem categoria').trim(),
        products: (category.products || []).map(product => ({
          name: String(product.name || '').trim(),
          description: String(product.description || '').trim(),
          price: typeof product.price === 'number' ? product.price : parsePrice(String(product.price || '0')),
          image: product.image,
        })).filter(p => p.name) // Remove products without name
      })).filter(c => c.products.length > 0); // Remove empty categories
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: menuData 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Falha ao clonar cardápio';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function parsePrice(priceStr: string): number {
  // Remove currency symbols and convert to number
  const cleaned = priceStr.replace(/[R$\s]/g, '').replace(',', '.').trim();
  const price = parseFloat(cleaned);
  return isNaN(price) ? 0 : price;
}

function parseMenuFromMarkdown(markdown: string): MenuData {
  const categories: Category[] = [];
  const lines = markdown.split('\n');
  
  let currentCategory: Category | null = null;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Detect category headers (usually marked with ## or bold)
    if (trimmedLine.startsWith('## ') || trimmedLine.startsWith('**') || trimmedLine.startsWith('# ')) {
      const categoryName = trimmedLine.replace(/^[#*\s]+/, '').replace(/\*+$/, '').trim();
      if (categoryName && categoryName.length > 1 && categoryName.length < 100) {
        if (currentCategory && currentCategory.products.length > 0) {
          categories.push(currentCategory);
        }
        currentCategory = { name: categoryName, products: [] };
      }
    }
    
    // Try to detect products (lines with prices)
    const priceMatch = trimmedLine.match(/R\$\s*([\d,.]+)/);
    if (priceMatch && currentCategory) {
      const price = parsePrice(priceMatch[1]);
      const productText = trimmedLine.replace(/R\$\s*[\d,.]+/, '').trim();
      
      if (productText && productText.length > 1) {
        // Split name and description if possible
        const parts = productText.split(/[-–—:]/).map(p => p.trim());
        currentCategory.products.push({
          name: parts[0] || productText,
          description: parts.slice(1).join(' ').trim(),
          price: price,
        });
      }
    }
  }
  
  // Don't forget the last category
  if (currentCategory && currentCategory.products.length > 0) {
    categories.push(currentCategory);
  }
  
  return { categories };
}
