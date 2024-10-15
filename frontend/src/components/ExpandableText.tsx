"use client";
import React, { useState } from "react";
import clsx from "clsx";
import { IconChevronDown, IconChevronUp } from "./Icons";

interface ExpandTextProps {
  text: string;
  className?: string;
  truncateLength?: number;
  initialExpanded?: boolean;
}

const ExpandText: React.FC<ExpandTextProps> = ({
  text,
  className,
  truncateLength = 200, // Default truncate length
  initialExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + "...";
  };

  return (
    <>
      <pre
        className={clsx(
          "leading-relaxed whitespace-pre-wrap font-sans my-4",
          className
        )}
      >
        {isExpanded ? text : truncateText(text, truncateLength)}
      </pre>

      <div className="text-center my-4">
        <button
          className="btn btn-ghost"
          onClick={() => setIsExpanded((old) => !old)}
          aria-expanded={isExpanded} // Accessibility feature
        >
          {isExpanded ? "View Less" : "View More"}
          {isExpanded ? (
            <IconChevronUp className="inline ml-2" />
          ) : (
            <IconChevronDown className="inline ml-2" />
          )}
        </button>
      </div>
    </>
  );
};

export default ExpandText;
