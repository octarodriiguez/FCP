export type Product = {
  id: string;
  name: string;
  category: "tshirt" | "hoodie";
  drop: string;
  edition: string;
  stock: number;
  frontImage: string;
  backImage: string;
  available?: boolean;
  graphic: string;
};

export const products: Product[] = [
  {
    id: "ohfcp-aniversario",
    name: "OhFcp Aniversario",
    category: "tshirt",
    drop: "ANIVERSARIO FCP",
    edition: "STOCK LIMITADO",
    stock: 10,
    frontImage: "/products/ohFCP/ohFCP-aniversario-front.png",
    backImage: "/products/ohFCP/ohFCP-aniversario-back.png",
    available: true,
    graphic: "OH FCP"
  },
  {
    id: "aniversario-patente",
    name: "Aniversario Patente",
    category: "tshirt",
    drop: "ANIVERSARIO FCP",
    edition: "STOCK LIMITADO",
    stock: 10,
    frontImage: "/products/aniversario/aniversario-front.png",
    backImage: "/products/aniversario/aniversario-back.png",
    available: true,
    graphic: "ANIVERSARIO"
  },
  {
    id: "buzo-aniversario",
    name: "Buzo Aniversario",
    category: "hoodie",
    drop: "ANIVERSARIO FCP",
    edition: "STOCK LIMITADO",
    stock: 10,
    frontImage: "/products/buzoAniv/buzoAniv-front.png",
    backImage: "/products/buzoAniv/buzoAniv-back.png",
    available: true,
    graphic: "ANIVERSARIO"
  }
];
