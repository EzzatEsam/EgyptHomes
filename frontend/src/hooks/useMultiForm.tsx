"use client";

import { useState } from "react";
import { ReactElement } from "react";

export function UseMultiForm(children: ReactElement[]) {
  const [currentIdx, setCurrentIdx] = useState(0);

  const next = () => {
    setCurrentIdx((prev) => (prev < children.length - 1 ? prev + 1 : prev));
  };
  const prev = () => {
    setCurrentIdx((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return { currentIdx, current: children[currentIdx], next, prev };
}
