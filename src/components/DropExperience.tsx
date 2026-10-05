"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { products, type Product } from "@/data/products";
import { generateWhatsAppLink } from "@/lib/whatsapp";

type Category = "all" | Product["category"];
type Side = "front" | "back";
const filters: { id: Category; label: string }[] = [{ id: "all", label: "TODAS" }, { id: "tshirt", label: "REMERAS" }, { id: "hoodie", label: "BUZOS" }];

function Garment({ product, side }: { product: Product; side: Side }) {
  const [imageUnavailable, setImageUnavailable] = useState(false);
  const image = side === "front" ? product.frontImage : product.backImage;
  useEffect(() => setImageUnavailable(false), [image]);
  if (!imageUnavailable) return <img className="garment-mockup" src={image} alt={`${product.name}, ${side === "front" ? "frente" : "dorso"}`} onError={() => setImageUnavailable(true)} onContextMenu={e => e.preventDefault()} onDragStart={e => e.preventDefault()} />;
  return <div className="garment tee" aria-label={`${product.name}, ${side}`}><div className="sleeve left" /><div className="sleeve right" /><div className="garment-body"><div className="neck" /><div className="print front"><span>{product.graphic}</span></div></div></div>;
}

export function DropExperience() {
  const [category, setCategory] = useState<Category>("all");
  const [index, setIndex] = useState(0);
  const [side, setSide] = useState<Side>("front");
  const [productDir, setProductDir] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const availableFilters = useMemo(() => filters.filter(f => f.id === "all" || products.some(p => p.category === f.id)), []);
  const visibleProducts = useMemo(() => category === "all" ? products : products.filter(p => p.category === category), [category]);
  const product = visibleProducts[index] ?? visibleProducts[0];

  const change = useCallback((direction: number) => {
    setProductDir(direction);
    setIndex(current => (current + direction + visibleProducts.length) % visibleProducts.length);
    setSide("front");
  }, [visibleProducts.length]);

  const flipGarment = useCallback(() => setSide(current => current === "front" ? "back" : "front"), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") change(1);
      if (e.key === "ArrowLeft") change(-1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [change]);

  function changeFilter(filter: Category) { setCategory(filter); setIndex(0); setSide("front"); }

  function onStageTouchStart(e: React.TouchEvent) {
    touchStart.current = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
  }
  function onStageTouchEnd(e: React.TouchEvent) {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) > Math.abs(dy)) {
      // horizontal → flip frente/dorso
      if (Math.abs(dx) > 32) flipGarment();
    } else {
      // vertical → cambiar modelo
      if (Math.abs(dy) > 32 && visibleProducts.length > 1) change(dy < 0 ? 1 : -1);
    }
  }

  const flipVariants = {
    enter: (dir: number) => ({ opacity: 0, rotateY: dir * -22, scale: 0.96, filter: "blur(3px)" }),
    center: { opacity: 1, rotateY: 0, scale: 1, filter: "blur(0px)" },
    exit: (dir: number) => ({ opacity: 0, rotateY: dir * 22, scale: 0.96, filter: "blur(3px)" }),
  };

  // Slide more aggressively so the model change is obvious
  const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 80, scale: 0.93, filter: "blur(6px)" }),
    center: { opacity: 1, x: 0, scale: 1, filter: "blur(0px)" },
    exit: (dir: number) => ({ opacity: 0, x: dir * -80, scale: 0.93, filter: "blur(6px)" }),
  };

  const flipDir = side === "back" ? 1 : -1;

  return (
    <section className="drop-shell">
      <header className="drop-header">
        <a href="#top" className="brand" aria-label="FCP por S4rt Studio">
          <img className="brand-fcp" src="/brand/fcp-logo.png" alt="FCP" />
          <span aria-hidden="true">x</span>
          <img className="brand-s4rt" src="/brand/s4rt-logo.png" alt="S4rt Studio" />
        </a>
        <nav className="filters" aria-label="Categorias">
          {availableFilters.map(filter => (
            <button key={filter.id} className={category === filter.id ? "active" : ""} onClick={() => changeFilter(filter.id)}>
              {filter.label}
            </button>
          ))}
        </nav>
        <p className="manifesto">NO ES SOLO ROPA<br />ES UNA DECLARACION</p>
      </header>

      <aside className="counter">
        <span>{String(index + 1).padStart(2, "0")}</span><i />
        <span>{String(visibleProducts.length).padStart(2, "0")}</span>
      </aside>

      <div className="stage" onTouchStart={onStageTouchStart} onTouchEnd={onStageTouchEnd}>
        <AnimatePresence mode="wait" custom={productDir}>
          <motion.div
            key={product.id}
            custom={productDir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ display: "contents" }}
          >
            <AnimatePresence mode="wait" custom={flipDir}>
              <motion.div
                key={`${product.id}-${side}`}
                className="garment-turn"
                custom={flipDir}
                variants={flipVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.38, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <Garment product={product} side={side} />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {visibleProducts.length > 1 && (
          <div className="stage-dots">
            {visibleProducts.map((_, i) => (
              <span key={i} className={i === index ? "dot active" : "dot"} />
            ))}
          </div>
        )}
      </div>

      <div className="view-switch" role="group" aria-label="Vista de la prenda">
        {(["front", "back"] as Side[]).map(view => (
          <button key={view} className={side === view ? "selected" : ""} onClick={() => setSide(view)}>
            {view === "front" ? "FRENTE" : "DORSO"}
          </button>
        ))}
      </div>

      <div className="product-detail">
        <AnimatePresence mode="wait">
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <p>{product.drop}</p>
            <h1>{product.name}</h1>
            <small>{product.edition}</small>
          </motion.div>
        </AnimatePresence>
        <a className="order" href={generateWhatsAppLink(product)} target="_blank" rel="noreferrer">
          ORDENAR <span aria-hidden="true">-&gt;</span>
        </a>
      </div>

      <footer className="drop-footer">
        {visibleProducts.length > 1 && (
          <div className="arrows">
            <button onClick={() => change(-1)} aria-label="Producto anterior">&#8592;</button>
            <button onClick={() => change(1)} aria-label="Producto siguiente">&#8594;</button>
          </div>
        )}
        <p>DISENADO PARA LAS<br />HORAS DE DESPUES.</p>
      </footer>
    </section>
  );
}
