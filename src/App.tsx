/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { ShoppingCart, Plus, Minus, Send, MapPin, User, CreditCard, Trash2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'sonner';

interface Option {
  id: string;
  name: string;
  price: number;
}

interface Preference {
  id: string;
  name: string;
  options: string[];
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  options?: Option[];
  preferences?: Preference[];
  removableIngredients?: string[];
}

interface CartItem extends Product {
  cartId: string;
  quantity: number;
  selectedOptions: Option[];
  selectedPreferences: Record<string, string>;
  removedIngredients: string[];
  basePrice: number;
}

const BURGER_ADDITIONS: Option[] = [
  { id: 'add-bife', name: 'Bife Hambúrguer', price: 3.00 },
  { id: 'add-picanha', name: 'Bife de Picanha', price: 4.00 },
  { id: 'add-queijo', name: 'Queijo', price: 3.00 },
  { id: 'add-presunto', name: 'Presunto', price: 3.00 },
  { id: 'add-bacon', name: 'Bacon', price: 3.00 },
  { id: 'add-calabresa', name: 'Calabresa', price: 3.00 },
];

const DEFAULT_FOOD_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&h=300&q=80";

const PRODUCTS: Product[] = [
  // --- BURGUERS ---
  {
    id: 1,
    name: "01 MISTO QUENTE",
    description: "Pão de hambúrguer, presunto e queijo",
    price: 10.00,
    category: "Burguers",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=400&h=300&q=80",
    removableIngredients: ["Presunto", "Queijo"],
    options: BURGER_ADDITIONS
  },
  {
    id: 2,
    name: "02 HAMBÚRGUER",
    description: "Pão, bife, banana, milho, batata, alface e tomate",
    price: 10.00,
    category: "Burguers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&h=300&q=80",
    removableIngredients: ["Bife", "Banana", "Milho", "Batata", "Alface", "Tomate"],
    options: BURGER_ADDITIONS
  },
  {
    id: 3,
    name: "03 BACON BURGUER",
    description: "Pão, bife, bacon, banana, milho, batata palha e salada",
    price: 12.00,
    category: "Burguers",
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=400&h=300&q=80",
    removableIngredients: ["Bife", "Bacon", "Banana", "Milho", "Batata Palha", "Salada"],
    options: BURGER_ADDITIONS
  },
  {
    id: 4,
    name: "04 EGGS BURGUER",
    description: "Pão, bife, ovo, banana, milho, batata palha e salada",
    price: 12.00,
    category: "Burguers",
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=400&h=300&q=80",
    removableIngredients: ["Bife", "Ovo", "Banana", "Milho", "Batata Palha", "Salada"],
    options: BURGER_ADDITIONS
  },
  {
    id: 5,
    name: "05 X BURGUER",
    description: "Pão, bife, calabresa, queijo, banana, milho, batata palha e salada",
    price: 12.00,
    category: "Burguers",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=400&h=300&q=80",
    removableIngredients: ["Bife", "Calabresa", "Queijo", "Banana", "Milho", "Batata Palha", "Salada"],
    options: BURGER_ADDITIONS
  },
  {
    id: 6,
    name: "06 X EGGS BURGUER",
    description: "Pão, bife, queijo, ovo, banana, milho, batata palha e salada",
    price: 14.00,
    category: "Burguers",
    image: "https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?auto=format&fit=crop&w=400&h=300&q=80",
    removableIngredients: ["Bife", "Queijo", "Ovo", "Banana", "Milho", "Batata Palha", "Salada"],
    options: BURGER_ADDITIONS
  },
  {
    id: 7,
    name: "07 X BACON",
    description: "Pão, bife, queijo, bacon, banana, milho, batata palha e salada",
    price: 18.00,
    category: "Burguers",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=400&h=300&q=80",
    removableIngredients: ["Bife", "Queijo", "Bacon", "Banana", "Milho", "Batata Palha", "Salada"],
    options: BURGER_ADDITIONS
  },
  {
    id: 8,
    name: "08 X EGGS BACON",
    description: "Pão, bife, queijo, ovo, bacon, banana, milho, batata palha e salada",
    price: 20.00,
    category: "Burguers",
    image: "https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?auto=format&fit=crop&w=400&h=300&q=80",
    removableIngredients: ["Bife", "Queijo", "Ovo", "Bacon", "Banana", "Milho", "Batata Palha", "Salada"],
    options: BURGER_ADDITIONS
  },
  {
    id: 9,
    name: "09 X PRESBURGUER",
    description: "Pão, bife, queijo, presunto, banana, milho, batata palha e salada",
    price: 14.00,
    category: "Burguers",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&h=300&q=80",
    removableIngredients: ["Bife", "Queijo", "Presunto", "Banana", "Milho", "Batata Palha", "Salada"],
    options: BURGER_ADDITIONS
  },
  {
    id: 10,
    name: "10 X EGGS PRESBURGUER",
    description: "Pão, bife, queijo, ovo, presunto, banana, milho, batata palha e salada",
    price: 17.00,
    category: "Burguers",
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=400&h=300&q=80",
    removableIngredients: ["Bife", "Queijo", "Ovo", "Presunto", "Banana", "Milho", "Batata Palha", "Salada"],
    options: BURGER_ADDITIONS
  },
  {
    id: 11,
    name: "11 X CALABRESA",
    description: "Pão, bife, calabresa, queijo, ovo, cebola, banana, milho, batata palha e salada",
    price: 22.00,
    category: "Burguers",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&h=300&q=80",
    removableIngredients: ["Bife", "Calabresa", "Queijo", "Ovo", "Cebola", "Banana", "Milho", "Batata Palha", "Salada"],
    options: BURGER_ADDITIONS
  },
  {
    id: 12,
    name: "12 X TOTAL",
    description: "Pão, bife, presunto, queijo, ovo, bacon, banana, milho, batata palha e salada",
    price: 24.00,
    category: "Burguers",
    image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=400&h=300&q=80",
    removableIngredients: ["Bife", "Presunto", "Queijo", "Ovo", "Bacon", "Banana", "Milho", "Batata Palha", "Salada"],
    options: BURGER_ADDITIONS
  },

  // --- BURGUERS ESPECIAIS ---
  {
    id: 13,
    name: "13 X CALABRESA ESPECIAL",
    description: "Pão, bife, calabresa, queijo, presunto, ovo, bacon, cebola, picles, banana, milho, batata palha e salada",
    price: 26.00,
    category: "Burguers Especiais",
    image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=400&h=300&q=80",
    removableIngredients: ["Bife", "Calabresa", "Queijo", "Presunto", "Ovo", "Bacon", "Cebola", "Picles", "Banana", "Milho", "Batata Palha", "Salada"],
    options: BURGER_ADDITIONS
  },
  {
    id: 14,
    name: "14 X FRAN",
    description: "Pão, bife de hambúrguer, bife de frango, queijo, ovo, banana, milho, batata palha e salada",
    price: 18.00,
    category: "Burguers Especiais",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&h=300&q=80",
    removableIngredients: ["Bife", "Frango", "Queijo", "Ovo", "Banana", "Milho", "Batata Palha", "Salada"],
    options: BURGER_ADDITIONS
  },
  {
    id: 15,
    name: "15 X FRAN EGGS BACON",
    description: "Pão, bife de hambúrguer, bife de frango, queijo, ovo, bacon, banana, milho, batata palha e salada",
    price: 25.00,
    category: "Burguers Especiais",
    image: "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?auto=format&fit=crop&w=400&h=300&q=80",
    removableIngredients: ["Bife", "Frango", "Queijo", "Ovo", "Bacon", "Banana", "Milho", "Batata Palha", "Salada"],
    options: BURGER_ADDITIONS
  },
  {
    id: 16,
    name: "16 X FILÉ",
    description: "Pão, bife de filé, queijo, banana, milho, batata palha e salada (Acompanha fritas)",
    price: 20.00,
    category: "Burguers Especiais",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=400&h=300&q=80",
    removableIngredients: ["Filé", "Queijo", "Banana", "Milho", "Batata Palha", "Salada"],
    options: BURGER_ADDITIONS
  },
  {
    id: 17,
    name: "17 X FILÉ BACON",
    description: "Pão, bife de filé, queijo, bacon, banana, milho, batata palha e salada (Acompanha fritas)",
    price: 25.00,
    category: "Burguers Especiais",
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=400&h=300&q=80",
    removableIngredients: ["Filé", "Queijo", "Bacon", "Banana", "Milho", "Batata Palha", "Salada"],
    options: BURGER_ADDITIONS
  },
  {
    id: 18,
    name: "18 X FILÉ EGGS BACON",
    description: "Pão, bife de filé, queijo, ovo, bacon, banana, milho, batata palha e salada (Acompanha fritas)",
    price: 28.00,
    category: "Burguers Especiais",
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=400&h=300&q=80",
    removableIngredients: ["Filé", "Queijo", "Ovo", "Bacon", "Banana", "Milho", "Batata Palha", "Salada"],
    options: BURGER_ADDITIONS
  },
  {
    id: 19,
    name: "19 X TUDO FILÉ",
    description: "Pão, bife de filé, queijo, presunto, ovo, bacon, banana, milho, batata palha e salada (Acompanha fritas)",
    price: 30.00,
    category: "Burguers Especiais",
    image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=400&h=300&q=80",
    removableIngredients: ["Filé", "Queijo", "Presunto", "Ovo", "Bacon", "Banana", "Milho", "Batata Palha", "Salada"],
    options: BURGER_ADDITIONS
  },
  {
    id: 20,
    name: "20 AMERICANO DUPLO",
    description: "Pão, 2 bife, 2 queijo, 2 presunto, 2 ovos, banana e salada",
    price: 26.00,
    category: "Burguers Especiais",
    image: "https://images.unsplash.com/photo-1586816001966-79b736744398?auto=format&fit=crop&w=400&h=300&q=80",
    removableIngredients: ["Bife", "Queijo", "Presunto", "Ovo", "Banana", "Salada"],
    options: BURGER_ADDITIONS
  },
  {
    id: 21,
    name: "21 X TOTAL DUPLO",
    description: "Pão, 2 bife, 2 presunto, 2 queijo, 2 ovos, 2 porções de bacon, banana, milho, batata palha (Acompanha fritas)",
    price: 30.00,
    category: "Burguers Especiais",
    image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=400&h=300&q=80",
    removableIngredients: ["Bife", "Presunto", "Queijo", "Ovo", "Bacon", "Banana", "Milho", "Batata Palha"],
    options: BURGER_ADDITIONS
  },
  {
    id: 22,
    name: "22 DA CASA",
    description: "Pão, picanha, hambúrguer, frango, filé, queijo, bacon, catupiry, banana, milho, batata palha e salada (Acompanha fritas)",
    price: 40.00,
    category: "Burguers Especiais",
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=400&h=300&q=80",
    removableIngredients: ["Picanha", "Hambúrguer", "Frango", "Filé", "Queijo", "Bacon", "Catupiry", "Banana", "Milho", "Batata Palha", "Salada"],
    options: BURGER_ADDITIONS
  },
  {
    id: 23,
    name: "23 X FILÉ MODÃO",
    description: "Pão, bacon, 2 queijo, presunto, 2 filé mignon, 2 bife de frango, ovo, banana, milho, batata palha, salada (Acompanha fritas)",
    price: 40.00,
    category: "Burguers Especiais",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=400&h=300&q=80",
    removableIngredients: ["Bacon", "Queijo", "Presunto", "Filé Mignon", "Frango", "Ovo", "Banana", "Milho", "Batata Palha", "Salada"],
    options: BURGER_ADDITIONS
  },

  // --- MACARRÃO NA CHAPA ---
  {
    id: 24,
    name: "Macarrão Palmito com Bacon",
    description: "Macarrão na chapa com palmito e bacon",
    price: 20.00,
    category: "Macarrão na Chapa",
    image: "https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=400&h=300&q=80",
    preferences: [
      { id: 'size', name: 'Tamanho', options: ['Pequeno (R$ 20,00)', 'Grande (R$ 25,00)'] }
    ]
  },
  {
    id: 25,
    name: "Macarrão Bolonhesa",
    description: "Macarrão na chapa à bolonhesa",
    price: 20.00,
    category: "Macarrão na Chapa",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=400&h=300&q=80",
    preferences: [
      { id: 'size', name: 'Tamanho', options: ['Pequeno (R$ 20,00)', 'Grande (R$ 25,00)'] }
    ]
  },
  {
    id: 26,
    name: "Macarrão Frango e Calabresa",
    description: "Macarrão na chapa com frango e calabresa",
    price: 20.00,
    category: "Macarrão na Chapa",
    image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&w=400&h=300&q=80",
    preferences: [
      { id: 'size', name: 'Tamanho', options: ['Pequeno (R$ 20,00)', 'Grande (R$ 25,00)'] }
    ]
  },

  // --- PORÇÕES ---
  {
    id: 27,
    name: "Porção Batata Frita",
    description: "Batata frita crocante",
    price: 20.00,
    category: "Porções",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=400&h=300&q=80",
    preferences: [
      { id: 'size', name: 'Tamanho', options: ['Pequena (R$ 20,00)', 'Grande (R$ 35,00)'] }
    ]
  },
  {
    id: 28,
    name: "Porção Frango com Fritas",
    description: "Frango frito com batata frita",
    price: 55.00,
    category: "Porções",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&h=300&q=80",
    preferences: [
      { id: 'size', name: 'Tamanho', options: ['Pequena (R$ 55,00)', 'Grande (R$ 90,00)'] }
    ]
  },
  {
    id: 29,
    name: "Porção Carne de Boi com Fritas",
    description: "Carne de boi acebolada com batata frita",
    price: 55.00,
    category: "Porções",
    image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=400&h=300&q=80",
    preferences: [
      { id: 'size', name: 'Tamanho', options: ['Pequena (R$ 55,00)', 'Grande (R$ 90,00)'] }
    ]
  },
  {
    id: 30,
    name: "Porção Filé de Tilápia com Fritas",
    description: "Filé de tilápia empanado com batata frita",
    price: 55.00,
    category: "Porções",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=400&h=300&q=80",
    preferences: [
      { id: 'size', name: 'Tamanho', options: ['Pequena (R$ 55,00)', 'Grande (R$ 90,00)'] }
    ]
  },

  // --- PANQUECAS ---
  {
    id: 31,
    name: "Panqueca de Frango",
    description: "Panqueca recheada com frango",
    price: 20.00,
    category: "Panquecas",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?auto=format&fit=crop&w=400&h=300&q=80",
    preferences: [
      { id: 'side', name: 'Acompanhamento', options: ['Sem Arroz (R$ 20,00)', 'Com Arroz (R$ 24,00)'] }
    ]
  },
  {
    id: 32,
    name: "Panqueca de Carne com Bacon",
    description: "Panqueca recheada com carne e bacon",
    price: 20.00,
    category: "Panquecas",
    image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=400&h=300&q=80",
    preferences: [
      { id: 'side', name: 'Acompanhamento', options: ['Sem Arroz (R$ 20,00)', 'Com Arroz (R$ 24,00)'] }
    ]
  },

  // --- PIZZAS ---
  {
    id: 33,
    name: "Pizza Portuguesa",
    description: "Molho, muçarela, presunto, cebola, pimentão, tomate, calabresa, ovos, palmito, azeitonas, orégano",
    price: 34.00,
    category: "Pizzas",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&h=300&q=80",
    preferences: [
      { id: 'size', name: 'Tamanho', options: ['Pequena (R$ 34,00)', 'Média (R$ 48,00)', 'Grande (R$ 62,00)'] }
    ]
  },
  {
    id: 34,
    name: "Pizza Mineira",
    description: "Molho, muçarela, peito de frango, lombo canadense, cebola, pimentão, tomate, ovos, bacon, champignon, orégano",
    price: 34.00,
    category: "Pizzas",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&h=300&q=80",
    preferences: [
      { id: 'size', name: 'Tamanho', options: ['Pequena (R$ 34,00)', 'Média (R$ 48,00)', 'Grande (R$ 63,00)'] }
    ]
  },
  {
    id: 35,
    name: "Pizza Calabresa",
    description: "Molho, muçarela, calabresa, cebola, azeitonas, orégano",
    price: 31.00,
    category: "Pizzas",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=400&h=300&q=80",
    preferences: [
      { id: 'size', name: 'Tamanho', options: ['Pequena (R$ 31,00)', 'Média (R$ 44,00)', 'Grande (R$ 58,00)'] }
    ]
  },
  {
    id: 36,
    name: "Pizza Calabresa com Catupiry",
    description: "Molho, muçarela, calabresa, tomates em cubos, catupiry, orégano",
    price: 33.00,
    category: "Pizzas",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=400&h=300&q=80",
    preferences: [
      { id: 'size', name: 'Tamanho', options: ['Pequena (R$ 33,00)', 'Média (R$ 47,00)', 'Grande (R$ 60,00)'] }
    ]
  },
  {
    id: 37,
    name: "Pizza Pepperoni",
    description: "Molho, muçarela, fatias de pepperoni, pimentão, azeitonas, orégano",
    price: 34.00,
    category: "Pizzas",
    image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=400&h=300&q=80",
    preferences: [
      { id: 'size', name: 'Tamanho', options: ['Pequena (R$ 34,00)', 'Média (R$ 48,00)', 'Grande (R$ 63,00)'] }
    ]
  },
  {
    id: 38,
    name: "Pizza Frango",
    description: "Molho, muçarela, peito de frango, catupiry, azeitonas, orégano",
    price: 32.00,
    category: "Pizzas",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&h=300&q=80",
    preferences: [
      { id: 'size', name: 'Tamanho', options: ['Pequena (R$ 32,00)', 'Média (R$ 47,00)', 'Grande (R$ 60,00)'] }
    ]
  },
  {
    id: 39,
    name: "Pizza Quatro Queijos",
    description: "Molho, muçarela, provolone, parmesão, catupiry, azeitonas, orégano",
    price: 35.00,
    category: "Pizzas",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&h=300&q=80",
    preferences: [
      { id: 'size', name: 'Tamanho', options: ['Pequena (R$ 35,00)', 'Média (R$ 50,00)', 'Grande (R$ 60,00)'] }
    ]
  },
  {
    id: 40,
    name: "Pizza Le Toth",
    description: "Molho, muçarela, presunto, tomate, calabresa, bacon, ovos, palmito, azeitonas, orégano",
    price: 34.00,
    category: "Pizzas",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&h=300&q=80",
    preferences: [
      { id: 'size', name: 'Tamanho', options: ['Pequena (R$ 34,00)', 'Média (R$ 48,00)', 'Grande (R$ 64,00)'] }
    ]
  },
  {
    id: 41,
    name: "Pizza Moda da Casa",
    description: "Molho, muçarela, presunto, tomate, cebola, pepperoni, uvas passas, abacaxi, azeitonas, orégano",
    price: 34.00,
    category: "Pizzas",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&h=300&q=80",
    preferences: [
      { id: 'size', name: 'Tamanho', options: ['Pequena (R$ 34,00)', 'Média (R$ 48,00)', 'Grande (R$ 63,00)'] }
    ]
  },
  {
    id: 42,
    name: "Pizza Moda da Casa Especial",
    description: "Molho, muçarela, lombo canadense, catupiry, banana, cebola, tomate, pepperoni, uvas passas, abacaxi, azeitonas, orégano",
    price: 36.00,
    category: "Pizzas",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&h=300&q=80",
    preferences: [
      { id: 'size', name: 'Tamanho', options: ['Pequena (R$ 36,00)', 'Média (R$ 50,00)', 'Grande (R$ 65,00)'] }
    ]
  },

  // --- BEBIDAS ---
  {
    id: 43,
    name: "Suco Natural",
    description: "Abacaxi, Maracujá, Manga, Goiaba, Acerola, Graviola, Cupuaçu",
    price: 9.00,
    category: "Bebidas",
    image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=400&h=300&q=80",
    preferences: [
      { id: 'flavor', name: 'Sabor', options: ['Abacaxi', 'Abacaxi c/ Hortelã', 'Maracujá', 'Manga', 'Goiaba', 'Acerola', 'Graviola', 'Cupuaçu'] },
      { id: 'size', name: 'Tamanho', options: ['Pequeno (R$ 9,00)', 'Grande (R$ 18,00)'] }
    ]
  },
  {
    id: 44,
    name: "Vitamina",
    description: "Maracujá, Acerola, Graviola, Manga, Morango, Cacau, Goiaba, Abacaxi",
    price: 11.00,
    category: "Bebidas",
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=400&h=300&q=80",
    preferences: [
      { id: 'flavor', name: 'Sabor', options: ['Maracujá', 'Acerola', 'Graviola', 'Manga', 'Morango', 'Cacau', 'Goiaba', 'Abacaxi'] },
      { id: 'size', name: 'Tamanho', options: ['500ml (R$ 11,00)', '1 Litro (R$ 21,00)'] }
    ]
  },
  {
    id: 45,
    name: "Refrigerante 2L",
    description: "Coca-Cola ou Guaraná",
    price: 15.00,
    category: "Bebidas",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&h=300&q=80",
    preferences: [
      { id: 'flavor', name: 'Sabor', options: ['Coca-Cola (R$ 15,00)', 'Guaraná (R$ 13,00)'] }
    ]
  },
  {
    id: 46,
    name: "Refrigerante 1L",
    description: "Coca-Cola, Pet ou Retornável",
    price: 12.00,
    category: "Bebidas",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&h=300&q=80",
    preferences: [
      { id: 'type', name: 'Tipo', options: ['Coca-Cola', 'Pet', 'Retornável'] }
    ]
  },
  {
    id: 47,
    name: "Refrigerante Lata",
    description: "350ml",
    price: 7.00,
    category: "Bebidas",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&h=300&q=80",
  },
  {
    id: 48,
    name: "Refrigerante 600ml",
    description: "Garrafa 600ml",
    price: 10.00,
    category: "Bebidas",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&h=300&q=80",
  },
  {
    id: 49,
    name: "Monster",
    description: "Energético Monster",
    price: 13.00,
    category: "Bebidas",
    image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=400&h=300&q=80",
  },
  {
    id: 50,
    name: "Água Mineral",
    description: "Com ou sem gás",
    price: 3.00,
    category: "Bebidas",
    image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=400&h=300&q=80",
    preferences: [
      { id: 'type', name: 'Tipo', options: ['Sem Gás (R$ 3,00)', 'Com Gás (R$ 4,00)'] }
    ]
  }
];

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState('Pix');
  const [changeFor, setChangeFor] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Customization State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [tempOptions, setTempOptions] = useState<Option[]>([]);
  const [tempPreferences, setTempPreferences] = useState<Record<string, string>>({});
  const [tempRemovals, setTempRemovals] = useState<string[]>([]);

  const total = useMemo(() => {
    return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [cart]);

  const openCustomization = (product: Product) => {
    setSelectedProduct(product);
    setTempOptions([]);
    setTempRemovals([]);
    const initialPrefs: Record<string, string> = {};
    product.preferences?.forEach(p => {
      initialPrefs[p.id] = p.options[0]; // Default to first
    });
    setTempPreferences(initialPrefs);
    setIsModalOpen(true);
  };

  const addToCart = (product: Product, options: Option[] = [], preferences: Record<string, string> = {}, removals: string[] = []) => {
    let finalPrice = product.price;
    
    // Adjust price based on preferences (e.g., Size)
    Object.values(preferences).forEach((value: string) => {
      const match = value.match(/R\$ (\d+,\d+)/);
      if (match) {
        finalPrice = parseFloat(match[1].replace(',', '.'));
      }
    });

    const optionPrice = options.reduce((acc, opt) => acc + opt.price, 0);
    finalPrice += optionPrice;
    
    // Create a unique ID for this specific configuration
    const configString = JSON.stringify({ 
      id: product.id, 
      options: options.map(o => o.id).sort(), 
      preferences,
      removals: removals.sort()
    });
    const cartId = btoa(configString);

    setCart(prev => {
      const existing = prev.find(item => item.cartId === cartId);
      if (existing) {
        return prev.map(item => 
          item.cartId === cartId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { 
        ...product, 
        cartId, 
        quantity: 1, 
        selectedOptions: options, 
        selectedPreferences: preferences,
        removedIngredients: removals,
        basePrice: product.price,
        price: finalPrice 
      }];
    });
    setIsModalOpen(false);
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.cartId === cartId) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const clearItem = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const sendWhatsApp = () => {
    if (cart.length === 0) {
      toast.error("Adicione itens ao carrinho!");
      return;
    }
    if (!name || !address) {
      toast.error("Preencha seu nome e endereço completo!");
      return;
    }

    let message = `*Novo Pedido - Lanchonete Express*\n\n`;
    message += `*Cliente:* ${name}\n`;
    message += `*Endereço:* ${address}\n`;
    message += `--------------------------\n`;
    
    cart.forEach(item => {
      message += `• ${item.quantity}x ${item.name}\n`;
      if (item.removedIngredients.length > 0) {
        message += `  _RETIRAR: ${item.removedIngredients.join(', ')}_\n`;
      }
      if (item.selectedOptions.length > 0) {
        message += `  _ADICIONAIS: ${item.selectedOptions.map(o => o.name).join(', ')}_\n`;
      }
      Object.entries(item.selectedPreferences).forEach(([key, val]) => {
        const prefName = item.preferences?.find(p => p.id === key)?.name || key;
        message += `  _${prefName}: ${val}_\n`;
      });
      message += `  Subtotal: R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });

    message += `--------------------------\n`;
    message += `*Total:* R$ ${total.toFixed(2)}\n`;
    message += `*Forma de Pagamento:* ${payment}`;

    if (payment === 'Dinheiro' && changeFor) {
      const changeVal = parseFloat(changeFor.replace(',', '.'));
      if (!isNaN(changeVal)) {
        message += `\n*Troco para:* R$ ${changeVal.toFixed(2)}`;
        if (changeVal > total) {
          message += ` (Troco: R$ ${(changeVal - total).toFixed(2)})`;
        }
      }
    }

    const phone = "5511999999999"; // Substitua pelo seu número real
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
    
    // Show success message and clear cart
    setShowSuccess(true);
    setCart([]);
    setName('');
    setAddress('');
    setChangeFor('');
  };

  const currentModalPrice = useMemo(() => {
    if (!selectedProduct) return 0;
    
    let base = selectedProduct.price;
    Object.values(tempPreferences).forEach((value: string) => {
      const match = value.match(/R\$ (\d+,\d+)/);
      if (match) {
        base = parseFloat(match[1].replace(',', '.'));
      }
    });

    const optPrice = tempOptions.reduce((acc, o) => acc + o.price, 0);
    return base + optPrice;
  }, [selectedProduct, tempOptions, tempPreferences]);

  const categories = useMemo(() => {
    return Array.from(new Set(PRODUCTS.map(p => p.category)));
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 pb-12">
      <Toaster position="top-center" richColors />
      {/* Header */}
      <header className="bg-red-600 text-white py-12 px-4 shadow-xl relative overflow-hidden">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-2">
            🍔 Lanchonete Express
          </h1>
          <p className="text-red-100 font-medium tracking-wide">
            O melhor lanche da cidade na sua casa!
          </p>
        </motion.div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] text-9xl">🍔</div>
          <div className="absolute bottom-[-10%] right-[-5%] text-9xl">🍟</div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-8">
        {/* Menu Section */}
        {categories.map(category => (
          <section key={category} className="mb-12">
            <div className="flex items-center gap-3 mb-8 border-b-4 border-red-500 pb-2">
              <h2 className="text-3xl font-black uppercase italic tracking-tight">{category}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PRODUCTS.filter(p => p.category === category).map((product) => (
                <motion.div 
                  key={product.id}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden flex flex-col sm:flex-row"
                >
                  <div className="w-full sm:w-32 h-32 sm:h-auto shrink-0">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_FOOD_IMAGE;
                      }}
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg leading-tight mb-1">{product.name}</h3>
                      <p className="text-stone-500 text-sm mb-2">{product.description}</p>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-green-600 font-black text-xl">
                        R$ {product.price.toFixed(2)}
                      </span>
                      <button 
                        onClick={() => openCustomization(product)}
                        className="bg-red-500 text-white p-2 rounded-xl hover:bg-red-600 transition-colors shadow-md active:scale-95 flex items-center gap-2 px-3"
                      >
                        <Plus size={18} />
                        <span className="text-xs font-bold uppercase">Adicionar</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ))}

        {/* Cart Section */}
        <section className="mb-12 bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-stone-100">
          <div className="flex items-center gap-3 mb-6">
            <ShoppingCart className="text-red-600" size={28} />
            <h2 className="text-2xl font-black uppercase italic">Seu Pedido</h2>
          </div>

          <div className="space-y-4 mb-8">
            <AnimatePresence mode="popLayout">
              {cart.length === 0 ? (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-stone-400 italic text-center py-8"
                >
                  Seu carrinho está vazio...
                </motion.p>
              ) : (
                cart.map((item) => (
                  <motion.div 
                    key={item.cartId}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex flex-col pb-4 border-b border-stone-100"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex-1">
                        <h4 className="font-bold">{item.name}</h4>
                        {item.removedIngredients.length > 0 && (
                          <p className="text-red-400 text-[10px] uppercase font-bold">
                            RETIRAR: {item.removedIngredients.join(', ')}
                          </p>
                        )}
                        {item.selectedOptions.length > 0 && (
                          <p className="text-stone-400 text-[10px] uppercase font-bold">
                            + {item.selectedOptions.map(o => o.name).join(', ')}
                          </p>
                        )}
                        {Object.entries(item.selectedPreferences).map(([key, val]) => (
                          <p key={key} className="text-stone-400 text-[10px] uppercase font-bold">
                            • {val}
                          </p>
                        ))}
                      </div>
                      <span className="font-bold text-stone-900 w-24 text-right">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <p className="text-stone-500 text-xs">R$ {item.price.toFixed(2)} cada</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center bg-stone-100 rounded-lg p-1">
                          <button 
                            onClick={() => updateQuantity(item.cartId, -1)}
                            className="p-1 hover:bg-white rounded-md transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.cartId, 1)}
                            className="p-1 hover:bg-white rounded-md transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button 
                          onClick={() => clearItem(item.cartId)}
                          className="text-stone-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          <div className="flex justify-between items-center pt-4 border-t-2 border-stone-100">
            <span className="text-xl font-bold text-stone-500">Total do Pedido</span>
            <motion.span 
              key={total}
              initial={{ scale: 1.1, color: "#16a34a" }}
              animate={{ scale: 1, color: "#16a34a" }}
              className="text-3xl font-black"
            >
              R$ {total.toFixed(2)}
            </motion.span>
          </div>
        </section>

        {/* Checkout Section */}
        <section className="bg-white p-6 md:p-8 rounded-3xl shadow-lg border border-stone-100">
          <h2 className="text-2xl font-black uppercase italic mb-6">Finalizar Pedido</h2>
          <div className="grid grid-cols-1 gap-6">
            <div className="relative">
              <User className="absolute left-3 top-3 text-stone-400" size={20} />
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu Nome" 
                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-stone-400" size={20} />
              <input 
                type="text" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Endereço Completo (Rua, Número, Bairro)" 
                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="relative">
              <CreditCard className="absolute left-3 top-3 text-stone-400" size={20} />
              <select 
                value={payment}
                onChange={(e) => {
                  setPayment(e.target.value);
                  if (e.target.value !== 'Dinheiro') setChangeFor('');
                }}
                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none appearance-none transition-all"
              >
                <option value="Pix">Pix</option>
                <option value="Cartão de Crédito/Débito">Cartão (Levar maquininha)</option>
                <option value="Dinheiro">Dinheiro</option>
              </select>
            </div>

            <AnimatePresence>
              {payment === 'Dinheiro' && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-stone-400 font-bold">R$</span>
                    <input 
                      type="text" 
                      value={changeFor}
                      onChange={(e) => setChangeFor(e.target.value)}
                      placeholder="Troco para quanto?" 
                      className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                    />
                    <p className="text-xs text-stone-400 mt-1 ml-1 italic">Deixe em branco se não precisar de troco.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={sendWhatsApp}
              className="mt-4 bg-green-500 text-white font-black text-lg py-4 rounded-2xl hover:bg-green-600 transition-all shadow-lg flex items-center justify-center gap-3"
            >
              <Send size={24} />
              ENVIAR PEDIDO VIA WHATSAPP
            </motion.button>
          </div>
        </section>
      </main>

      {/* Customization Modal */}
      <AnimatePresence>
        {isModalOpen && selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="h-48 shrink-0 relative">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_FOOD_IMAGE;
                  }}
                />
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 bg-white/80 backdrop-blur p-2 rounded-full hover:bg-white transition-colors"
                >
                  <Minus size={20} className="rotate-45" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <h3 className="text-2xl font-black uppercase italic mb-2">{selectedProduct.name}</h3>
                <p className="text-stone-500 text-sm mb-6">{selectedProduct.description}</p>

                {selectedProduct.removableIngredients && selectedProduct.removableIngredients.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-black text-xs uppercase tracking-widest text-stone-400 mb-3">Retirar Ingredientes</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.removableIngredients.map(ing => {
                        const isRemoved = tempRemovals.includes(ing);
                        return (
                          <button
                            key={ing}
                            onClick={() => {
                              setTempRemovals(prev => 
                                isRemoved ? prev.filter(i => i !== ing) : [...prev, ing]
                              );
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-2 ${
                              isRemoved 
                                ? 'bg-red-50 border-red-500 text-red-600 shadow-sm' 
                                : 'bg-stone-50 border-stone-200 text-stone-500 hover:border-stone-300'
                            }`}
                          >
                            {isRemoved && <Minus size={12} />}
                            {ing}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selectedProduct.preferences?.map(pref => (
                  <div key={pref.id} className="mb-6">
                    <h4 className="font-black text-xs uppercase tracking-widest text-stone-400 mb-3">{pref.name}</h4>
                    <div className="flex flex-wrap gap-2">
                      {pref.options.map(opt => (
                        <button
                          key={opt}
                          onClick={() => setTempPreferences(prev => ({ ...prev, [pref.id]: opt }))}
                          className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                            tempPreferences[pref.id] === opt 
                              ? 'bg-red-500 border-red-500 text-white shadow-md' 
                              : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {selectedProduct.options && selectedProduct.options.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-black text-xs uppercase tracking-widest text-stone-400 mb-3">Adicionais</h4>
                    <div className="space-y-2">
                      {selectedProduct.options.map(opt => {
                        const isSelected = tempOptions.some(o => o.id === opt.id);
                        return (
                          <button
                            key={opt.id}
                            onClick={() => {
                              setTempOptions(prev => 
                                isSelected ? prev.filter(o => o.id !== opt.id) : [...prev, opt]
                              );
                            }}
                            className={`w-full flex justify-between items-center p-4 rounded-2xl border-2 transition-all ${
                              isSelected 
                                ? 'bg-red-50 border-red-200 border-red-500 text-red-900' 
                                : 'bg-stone-50 border-stone-100 text-stone-600 hover:border-stone-200'
                            }`}
                          >
                            <span className="font-bold">{opt.name}</span>
                            <span className="font-black text-green-600">+ R$ {opt.price.toFixed(2)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-stone-400 uppercase">Total do Item</span>
                  <span className="text-2xl font-black text-green-600">R$ {currentModalPrice.toFixed(2)}</span>
                </div>
                <button 
                  onClick={() => addToCart(selectedProduct, tempOptions, tempPreferences, tempRemovals)}
                  className="flex-1 bg-red-500 text-white font-black py-4 rounded-2xl hover:bg-red-600 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  ADICIONAR AO CARRINHO
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="max-w-4xl mx-auto px-4 text-center text-stone-400 text-sm">
        <p>© 2026 Lanchonete Express. Todos os direitos reservados.</p>
      </footer>

      {/* Success Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.5, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md"
            >
              <CheckCircle2 size={80} className="text-green-500 mx-auto mb-6" />
              <h2 className="text-4xl font-black uppercase italic mb-4">Pedido Enviado!</h2>
              <p className="text-stone-500 text-lg mb-8">
                Seu pedido foi encaminhado para o nosso WhatsApp. 
                <br />
                <span className="font-bold text-red-600">Obrigado pela preferência!</span>
              </p>
              <button 
                onClick={() => setShowSuccess(false)}
                className="bg-red-600 text-white font-black px-8 py-4 rounded-2xl hover:bg-red-700 transition-all shadow-lg uppercase tracking-wider"
              >
                Voltar ao Menu
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
