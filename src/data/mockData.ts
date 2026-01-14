export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  available: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: { productId: string; quantity: number; productName: string; price: number }[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  createdAt: Date;
}

export interface Restaurant {
  name: string;
  logo: string;
  address: string;
  phone: string;
  whatsapp: string;
  isOpen: boolean;
  openingHours: {
    [key: string]: { open: string; close: string } | null;
  };
  paymentMethods: string[];
}

export const restaurant: Restaurant = {
  name: "Burger House",
  logo: "",
  address: "Rua das Flores, 123 - Centro, São Paulo - SP",
  phone: "(11) 99999-9999",
  whatsapp: "5511999999999",
  isOpen: true,
  openingHours: {
    "Segunda": { open: "11:00", close: "23:00" },
    "Terça": { open: "11:00", close: "23:00" },
    "Quarta": { open: "11:00", close: "23:00" },
    "Quinta": { open: "11:00", close: "23:00" },
    "Sexta": { open: "11:00", close: "00:00" },
    "Sábado": { open: "11:00", close: "00:00" },
    "Domingo": { open: "12:00", close: "22:00" },
  },
  paymentMethods: ["Dinheiro", "PIX", "Cartão de Crédito", "Cartão de Débito"],
};

export const categories: Category[] = [
  { id: "1", name: "Hambúrgueres", icon: "🍔" },
  { id: "2", name: "Porções", icon: "🍟" },
  { id: "3", name: "Bebidas", icon: "🥤" },
  { id: "4", name: "Sobremesas", icon: "🍨" },
];

export const products: Product[] = [
  {
    id: "1",
    name: "X-Burguer Clássico",
    description: "Pão brioche, hambúrguer 180g, queijo cheddar, alface, tomate e molho especial",
    price: 28.90,
    image: "",
    categoryId: "1",
    available: true,
  },
  {
    id: "2",
    name: "X-Bacon Supreme",
    description: "Pão brioche, hambúrguer 180g, bacon crocante, queijo, cebola caramelizada",
    price: 34.90,
    image: "",
    categoryId: "1",
    available: true,
  },
  {
    id: "3",
    name: "X-Salada Fit",
    description: "Pão integral, hambúrguer 150g, queijo branco, rúcula, tomate e molho de iogurte",
    price: 26.90,
    image: "",
    categoryId: "1",
    available: true,
  },
  {
    id: "4",
    name: "Double Cheese",
    description: "Pão brioche, 2 hambúrgueres 120g, dobro de queijo cheddar, picles e molho especial",
    price: 42.90,
    image: "",
    categoryId: "1",
    available: true,
  },
  {
    id: "5",
    name: "Batata Frita Grande",
    description: "Batata frita crocante com sal e temperos",
    price: 18.90,
    image: "",
    categoryId: "2",
    available: true,
  },
  {
    id: "6",
    name: "Onion Rings",
    description: "Anéis de cebola empanados e fritos",
    price: 22.90,
    image: "",
    categoryId: "2",
    available: true,
  },
  {
    id: "7",
    name: "Coca-Cola 350ml",
    description: "Refrigerante Coca-Cola lata",
    price: 6.90,
    image: "",
    categoryId: "3",
    available: true,
  },
  {
    id: "8",
    name: "Suco Natural 500ml",
    description: "Suco de laranja, limão ou maracujá",
    price: 9.90,
    image: "",
    categoryId: "3",
    available: true,
  },
  {
    id: "9",
    name: "Milkshake",
    description: "Milkshake de chocolate, morango ou baunilha",
    price: 16.90,
    image: "",
    categoryId: "4",
    available: true,
  },
  {
    id: "10",
    name: "Brownie com Sorvete",
    description: "Brownie de chocolate quente com sorvete de creme",
    price: 19.90,
    image: "",
    categoryId: "4",
    available: true,
  },
];

export const orders: Order[] = [
  {
    id: "1001",
    customerName: "João Silva",
    customerPhone: "(11) 98888-1234",
    items: [
      { productId: "1", quantity: 2, productName: "X-Burguer Clássico", price: 28.90 },
      { productId: "5", quantity: 1, productName: "Batata Frita Grande", price: 18.90 },
      { productId: "7", quantity: 2, productName: "Coca-Cola 350ml", price: 6.90 },
    ],
    total: 90.50,
    status: "pending",
    createdAt: new Date(Date.now() - 10 * 60000),
  },
  {
    id: "1002",
    customerName: "Maria Santos",
    customerPhone: "(11) 97777-5678",
    items: [
      { productId: "2", quantity: 1, productName: "X-Bacon Supreme", price: 34.90 },
      { productId: "9", quantity: 1, productName: "Milkshake", price: 16.90 },
    ],
    total: 51.80,
    status: "preparing",
    createdAt: new Date(Date.now() - 25 * 60000),
  },
  {
    id: "1003",
    customerName: "Pedro Oliveira",
    customerPhone: "(11) 96666-9012",
    items: [
      { productId: "4", quantity: 1, productName: "Double Cheese", price: 42.90 },
      { productId: "6", quantity: 1, productName: "Onion Rings", price: 22.90 },
      { productId: "8", quantity: 1, productName: "Suco Natural 500ml", price: 9.90 },
    ],
    total: 75.70,
    status: "ready",
    createdAt: new Date(Date.now() - 45 * 60000),
  },
];

export const whatsappSettings = {
  autoReplyEnabled: true,
  welcomeMessage: "Olá! 👋 Bem-vindo ao Burger House! Como posso ajudar você hoje?",
  awayMessage: "Desculpe, estamos fechados no momento. Nosso horário de funcionamento é de Segunda a Domingo. Volte em breve!",
  orderConfirmation: "Pedido recebido! ✅ Em breve entraremos em contato para confirmar.",
};
