
import React, { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ActProcess, Theme, Language } from '../types';
import { UI_TEXT, LONG_PRESS_MS, BREATHING_CYCLE_S } from '../constants';

interface HexagonVisualProps {
  selectedProcesses: ActProcess[];
  processes: ActProcess[];
  onToggleProcess: (process: ActProcess) => void;
  onLongPressProcess: (process: ActProcess) => void;
  isBreathing: boolean;
  toggleBreathing: () => void;
  highlightedProcessId: string | null;
  theme: Theme;
  lang: Language;
}

const CENTER = { x: 300, y: 300 };
const RADIUS = 200;
const NODE_RADIUS = 85; // Increased from 75

const getHexCorner = (index: number, radius: number) => {
  const angleDeg = 60 * index - 90;
  const angleRad = (Math.PI / 180) * angleDeg;
  return {
    x: CENTER.x + radius * Math.cos(angleRad),
    y: CENTER.y + radius * Math.sin(angleRad),
  };
};

const HexagonVisual: React.FC<HexagonVisualProps> = ({ 
    selectedProcesses, 
    processes, 
    onToggleProcess, 
    onLongPressProcess,
    isBreathing,
    toggleBreathing,
    highlightedProcessId,
    theme, 
    lang 
}) => {
  const t = UI_TEXT[lang];
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const orderedProcesses = useMemo(() => {
     const order = ['top', 'top-right', 'bottom-right', 'bottom', 'bottom-left', 'top-left'];
     return order.map(pos => processes.find(p => p.position === pos)!);
  }, [processes]);

  const points = orderedProcesses.map((_, i) => getHexCorner(i, RADIUS));
  const hexPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  // Handling Long Press
  const handlePointerDown = (process: ActProcess) => {
    longPressTimer.current = setTimeout(() => {
        onLongPressProcess(process);
        longPressTimer.current = null;
    }, LONG_PRESS_MS);
  };

  const handlePointerUp = (process: ActProcess) => {
    if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
        onToggleProcess(process); // Regular click
    }
  };

  const handlePointerLeave = () => {
      if (longPressTimer.current) {
          clearTimeout(longPressTimer.current);
          longPressTimer.current = null;
      }
  };

  // Connection Line Logic
  let connectionLine = null;
  if (selectedProcesses.length === 2) {
      const idx1 = orderedProcesses.findIndex(p => p.id === selectedProcesses[0].id);
      const idx2 = orderedProcesses.findIndex(p => p.id === selectedProcesses[1].id);
      if (idx1 !== -1 && idx2 !== -1) {
          connectionLine = { p1: points[idx1], p2: points[idx2], color1: selectedProcesses[0].color, color2: selectedProcesses[1].color };
      }
  }

  const centerCircleFill = theme === 'dark' ? '#fff' : '#1e293b';
  // Ensure center text has high contrast
  const centerTextColor = theme === 'dark' ? '#fff' : '#1e293b';
  
  // Progress Ring Data (Mocked for visual demonstration)
  const progressSegments = orderedProcesses.map((_, i) => ({
      startAngle: (i * 60) - 90,
      endAngle: (i * 60) - 30, // 60 degree segments with gap
      color: orderedProcesses[i].color,
      active: true // Show all as active for 'streak' demo, or vary opacity
  }));

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
      const start = {
          x: x + radius * Math.cos(Math.PI * startAngle / 180),
          y: y + radius * Math.sin(Math.PI * startAngle / 180)
      };
      const end = {
          x: x + radius * Math.cos(Math.PI * endAngle / 180),
          y: y + radius * Math.sin(Math.PI * endAngle / 180)
      };
      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
      return [
          "M", start.x, start.y, 
          "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y
      ].join(" ");
  };

  // Breathing Animation Variant (4-4-4-4 pattern = 16s total)
  // Scale Up (4s) -> Hold (4s) -> Scale Down (4s) -> Hold (4s)
  const breathingVariants: Variants = {
      idle: { scale: 1, opacity: 1 },
      breathe: {
          scale: [1, 1.1, 1.1, 1, 1],
          opacity: [1, 0.9, 0.9, 1, 1],
          transition: {
              duration: BREATHING_CYCLE_S,
              times: [0, 0.25, 0.5, 0.75, 1], // 0-4s, 4-8s, 8-12s, 12-16s
              repeat: Infinity,
              ease: "easeInOut"
          }
      }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-visible pointer-events-none">
      
      {/* Breathing Prompt */}
      <AnimatePresence>
          {!isBreathing && selectedProcesses.length === 0 && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={toggleBreathing}
                className={`absolute top-[48%] z-20 text-[11px] tracking-widest font-bold opacity-80 cursor-pointer hover:opacity-100 transition-opacity pointer-events-auto italic ${theme === 'dark' ? 'text-rose-300' : 'text-[#800020]'}`}
                style={{ transform: 'translateY(40px)' }}
            >
                {t.breathePrompt}
            </motion.div>
          )}
      </AnimatePresence>

      <svg width="650" height="650" viewBox="0 0 600 600" className="z-10 w-full max-w-[650px] h-auto aspect-square filter drop-shadow-2xl overflow-visible pointer-events-none">
        <defs>
            <linearGradient id="synergyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                {connectionLine && (
                    <>
                        <stop offset="0%" stopColor={connectionLine.color1} />
                        <stop offset="100%" stopColor={connectionLine.color2} />
                    </>
                )}
            </linearGradient>
            <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>

        {/* Global Breathing Container */}
        <motion.g
            variants={breathingVariants}
            animate={isBreathing ? "breathe" : "idle"}
            className="origin-center"
            style={{ transformOrigin: '300px 300px' }}
        >

            {/* Progress Ring */}
            <g className="opacity-30">
                {progressSegments.map((seg, i) => (
                    <path
                        key={`prog-${i}`}
                        d={describeArc(CENTER.x, CENTER.y, RADIUS + 100, seg.startAngle + 2, seg.endAngle - 2)}
                        fill="none"
                        stroke={seg.color}
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                ))}
            </g>

            {/* Dynamic Background Circle */}
            <motion.circle 
                cx={CENTER.x} 
                cy={CENTER.y} 
                initial={{ r: 0 }}
                animate={{ r: selectedProcesses.length > 0 ? 100 : 0, opacity: selectedProcesses.length > 0 ? 0.05 : 0 }}
                fill={centerCircleFill}
            />

            {/* Center Text (Interactive for Breathing) */}
            <g 
                onClick={toggleBreathing} 
                className="cursor-pointer group pointer-events-auto"
                onPointerEnter={() => {}} // dummy to allow pointer events
            >
                {/* Invisible Hit Area */}
                <circle cx={CENTER.x} cy={CENTER.y} r={60} fill="transparent" />
                
                <text 
                    x={CENTER.x} 
                    y={CENTER.y} 
                    textAnchor="middle" 
                    dominantBaseline="middle" 
                    fill={centerTextColor} 
                    fontSize="13" 
                    fontWeight="bold"
                    className="pointer-events-none transition-opacity duration-300 group-hover:opacity-80"
                    style={{ textShadow: theme === 'dark' ? '0 0 10px rgba(255,255,255,0.5)' : 'none' }}
                >
                    <tspan x={CENTER.x} dy="-0.5em">{isBreathing ? t.stopBreathe : t.centerLine1}</tspan>
                    <tspan x={CENTER.x} dy="1.2em">{isBreathing ? '' : t.centerLine2}</tspan>
                </text>
            </g>

            {/* Spokes */}
            {points.map((p, i) => (
                <motion.line
                    key={`line-center-${i}`}
                    x1={CENTER.x}
                    y1={CENTER.y}
                    x2={p.x}
                    y2={p.y}
                    stroke={orderedProcesses[i].color}
                    strokeWidth="1"
                    strokeOpacity={theme === 'dark' ? 0.3 : 0.4}
                />
            ))}

            {/* Hex Outline */}
            <path
                d={hexPath}
                fill="transparent"
                stroke={theme === 'dark' ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
                strokeWidth="2"
            />

            {/* Synergy Connection Line */}
            {connectionLine && (
                <motion.line
                    x1={connectionLine.p1.x}
                    y1={connectionLine.p1.y}
                    x2={connectionLine.p2.x}
                    y2={connectionLine.p2.y}
                    stroke="url(#synergyGradient)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    filter="url(#glow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                />
            )}

            {/* Nodes */}
            {orderedProcesses.map((process, i) => {
                const p = points[i];
                const isSelected = selectedProcesses.some(sp => sp.id === process.id);
                const isHighlighted = highlightedProcessId === process.id;
                
                // Dimming Logic:
                const isDimmed = highlightedProcessId 
                    ? !isHighlighted
                    : (selectedProcesses.length > 0 && !isSelected);
                
                let connectorEnd = null;
                if (isSelected && selectedProcesses.length === 1) {
                    const isLeft = process.position.includes('left') || process.position === 'top';
                    connectorEnd = { x: isLeft ? -100 : 700, y: p.y };
                }

                const isActive = isSelected || isHighlighted;

                const nodeFillOpacity = isActive ? 0.1 : (theme === 'dark' ? 0.1 : 0.2);
                const textColor = isActive 
                    ? (theme === 'dark' ? process.color : process.color) 
                    : (theme === 'dark' ? process.color : '#1e293b');

                const textWeight = isActive ? 'font-black' : (theme === 'dark' ? 'font-bold' : 'font-extrabold');

                return (
                    <g 
                        key={process.id} 
                        onPointerDown={() => handlePointerDown(process)}
                        onPointerUp={() => handlePointerUp(process)}
                        onPointerLeave={handlePointerLeave}
                        style={{ cursor: 'pointer', touchAction: 'none' }} 
                        className="transition-opacity duration-500 pointer-events-auto"
                        opacity={isDimmed ? 0.2 : 1}
                    >
                        <AnimatePresence>
                            {connectorEnd && (
                                <motion.line
                                    x1={p.x}
                                    y1={p.y}
                                    x2={connectorEnd.x}
                                    y2={connectorEnd.y}
                                    stroke={process.color}
                                    strokeWidth={2}
                                    strokeDasharray="4 4"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 0.5 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                />
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {isActive && (
                                <>
                                    <motion.circle
                                        cx={p.x}
                                        cy={p.y}
                                        r={NODE_RADIUS + 15}
                                        stroke={process.color}
                                        strokeWidth={1}
                                        fill="transparent"
                                        initial={{ scale: 0.8, opacity: 0.8 }}
                                        animate={{ scale: 1.1, opacity: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                    <motion.circle
                                        cx={p.x}
                                        cy={p.y}
                                        r={NODE_RADIUS + 10}
                                        stroke={process.color}
                                        strokeWidth={1}
                                        fill="transparent"
                                        initial={{ scale: 0.8, opacity: 1 }}
                                        animate={{ scale: 1.05, opacity: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                    />
                                </>
                            )}
                        </AnimatePresence>

                        <motion.circle
                            cx={p.x}
                            cy={p.y}
                            r={NODE_RADIUS}
                            fill={process.color}
                            fillOpacity={nodeFillOpacity}
                            stroke={process.color}
                            strokeWidth={isActive ? 4 : (theme === 'dark' ? 1 : 0)} 
                            whileHover={{ 
                                scale: 1.1,
                                fillOpacity: nodeFillOpacity + 0.2, // increased opacity on hover
                                filter: "drop-shadow(0px 0px 8px rgba(255,255,255,0.5))", // enhanced glow
                                cursor: 'pointer'
                            }}
                            whileTap={{ scale: 0.95 }}
                            animate={{ 
                                scale: isActive ? 1.1 : 1,
                                strokeWidth: isActive ? 4 : (theme === 'dark' ? 1.5 : 0),
                                fillOpacity: nodeFillOpacity,
                                filter: isActive ? "url(#glow)" : "drop-shadow(0px 4px 6px rgba(0,0,0,0.1))"
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        />
                        
                        <foreignObject 
                            x={p.x - NODE_RADIUS + 8} 
                            y={p.y - NODE_RADIUS + 8} 
                            width={(NODE_RADIUS * 2) - 16} 
                            height={(NODE_RADIUS * 2) - 16} 
                            className="pointer-events-none"
                        >
                            <div className="w-full h-full flex items-center justify-center text-center px-1">
                                <motion.span 
                                    animate={{ scale: isActive ? 1.05 : 1 }}
                                    className={`text-[13px] md:text-[15px] ${textWeight} leading-tight drop-shadow-sm select-none break-words`}
                                    style={{ color: textColor }}
                                >
                                    {process.title}
                                </motion.span>
                            </div>
                        </foreignObject>
                    </g>
                );
            })}
        </motion.g>
      </svg>
    </div>
  );
};

export default HexagonVisual;
