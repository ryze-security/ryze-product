"use client"; 

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

interface NavHeaderProps {
  data: {
    id: number;
    label: string;
    icon: React.ReactNode;
  }[];
  stepChangefn?: (stepId: number) => void;
  currentStep?: number;
}

function NavHeader(props: NavHeaderProps) {
  const { data, stepChangefn, currentStep } = props;
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <ul
      className="relative mx-auto flex w-fit rounded-full border border-white bg-black p-1"
      onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
    >
      {data.map((item) => (
        <Tab key={item.id} setPosition={setPosition} stepChangefn={stepChangefn} itemId={item.id} isActive={currentStep === item.id}>
          <div className="flex items-center gap-2">
            {item.icon}
            <span>{item.label}</span>
          </div>
        </Tab>
      ))}

      <Cursor position={position} />
    </ul>
  );
}

const Tab = ({
  children,
  setPosition,
  itemId,
  isActive,
  stepChangefn,
}: {
  children: React.ReactNode;
  setPosition: any;
  itemId?: number;
  stepChangefn?: (stepId: number) => void;
  isActive?: boolean;
}) => {
  const ref = useRef<HTMLLIElement>(null);
  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;

        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          width,
          opacity: 1,
          left: ref.current.offsetLeft,
        });
      }}
      onClick={()=> {stepChangefn(itemId)}}
      className={`relative z-10 block cursor-pointer px-3 py-1.5 text-xs text-white md:px-5 md:py-3 md:text-base ${isActive ? "bg-violet-500 opacity-100 rounded-full" : "opacity-70 hover:opacity-100"}  transition-opacity duration-100`}
    >
      {children}
    </li>
  );
};

const Cursor = ({ position }: { position: any }) => {
  return (
    <motion.li
      animate={position}
      className="absolute z-0 h-7 rounded-full bg-violet-500 md:h-12"
    />
  );
};

export default NavHeader;
