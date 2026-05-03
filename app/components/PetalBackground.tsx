"use client";

import { useEffect, useState } from "react";

interface Petal {
  id: number;
  left: string;
  width: string;
  height: string;
  duration: string;
  swayDuration: string;
  delay: string;
  rotate: string;
}

function makePetal(id: number): Petal {
  return {
    id,
    left: `${Math.random() * 100}%`,
    width: `${8 + Math.random() * 14}px`,
    height: `${10 + Math.random() * 16}px`,
    duration: `${10 + Math.random() * 14}s`,
    swayDuration: `${4 + Math.random() * 5}s`,
    delay: `${Math.random() * 18}s`,
    rotate: `${Math.random() * 60 - 30}deg`,
  };
}

export default function PetalBackground() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    setPetals(Array.from({ length: 18 }, (_, i) => makePetal(i)));
  }, []);

  return (
    <>
      {petals.map((p) => (
        <span
          key={p.id}
          className="petal"
          style={{
            left: p.left,
            width: p.width,
            height: p.height,
            animationDuration: `${p.duration}, ${p.swayDuration}`,
            animationDelay: `${p.delay}, ${p.delay}`,
            transform: `rotate(${p.rotate})`,
          }}
        />
      ))}
    </>
  );
}
