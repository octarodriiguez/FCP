import { WHATSAPP_NUMBER } from "@/config/config";
import type { Product } from "@/data/products";

export function generateWhatsAppLink(product: Product) {
  const message = `Hola! Estoy interesado en ${product.name}. Quisiera consultar disponibilidad y talles.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
