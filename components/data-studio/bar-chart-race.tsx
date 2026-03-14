import React, { useState, useEffect, useRef, useCallback } from 'react';

interface DataPoint {
  label: string;
  values: { [year: string]: number };
  color?: string;
}

interface BarChartRaceProps {
  title: string;
  subtitle?: string;
  data: DataPoint[];
  years: string[];
  topN?: number;
  colors?: string[];
  autoPlay?: boolean;
  intervalMs?: number;
}

const defaultColors = [
  '#059669', '#F59E0B', '#3B82F6', '#EF4444', '#8B5CF6',
  '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16',
  '#06B6D4', '#D946EF', '#FACC15', '#FB7185', '#22D3EE'
];

export default function BarChartRace({
  title,
  subtitle,
  data,
  years,
  topN = 10,
  colors = defaultColors,
  autoPlay = false,
  intervalMs = 800
}: BarChartRaceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentYear = years[currentIndex];

  const sortedData = useCallback(() => {
    return [...data]
      .map((d, i) => ({
        ...d,
        currentValue: d.values[currentYear] || 0,
        color: d.color || colors[i % colors.length]
      }))
      .sort((a, b) => b.currentValue - a.currentValue)
      .slice(0, topN);
  }, [data, currentYear, topN, colors]);

  const bars = sortedData();
  const maxValue = Math.max(...bars.map(b => b.currentValue), 1);

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev >= years.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    }
    return () => {
      if (animationRef.current) clearInterval(animationRef.current);
    };
  }, [isPlaying, years.length, intervalMs]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const reset = () => { setCurrentIndex(0); setIsPlaying(false); };
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentIndex(parseInt(e.target.value));
  };

  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-700/50 shadow-2xl" ref={containerRef}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
          {subtitle && <p className="text-slate-400 text-sm mt-1">{subtitle}</p>}
        </div>
        <div className="text-right">
          <div className="text-5xl font-black text-emerald-400 tabular-nums tracking-tight">
            {currentYear}
          </div>
          <p className="text-slate-500 text-xs mt-1">Year {currentIndex + 1} of {years.length}</p>
        </div>
      </div>

      {/* Bars */}
      <div className="space-y-2 mb-6">
        {bars.map((bar, i) => {
          const width = (bar.currentValue / maxValue) * 100;
          const isHovered = hoveredBar === bar.label;
          return (
            <div
              key={bar.label}
              className="flex items-center gap-3 group"
              onMouseEnter={() => setHoveredBar(bar.label)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              <div className="w-8 text-right text-sm font-bold text-slate-400 tabular-nums">
                {i + 1}
              </div>
              <div className="w-40 text-right text-sm font-medium text-slate-200 truncate" title={bar.label}>
                {bar.label}
              </div>
              <div className="flex-1 relative h-8 bg-slate-800/50 rounded-lg overflow-hidden">
                <div
                  className="h-full rounded-lg transition-all duration-500 ease-out flex items-center px-3"
                  style={{
                    width: `${Math.max(width, 2)}%`,
                    backgroundColor: bar.color,
                    opacity: isHovered ? 1 : 0.85,
                    transform: isHovered ? 'scaleY(1.1)' : 'scaleY(1)',
                    boxShadow: isHovered ? `0 0 20px ${bar.color}40` : 'none'
                  }}
                >
                  <span className="text-xs font-bold text-white whitespace-nowrap drop-shadow-md">
                    {bar.currentValue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center transition shadow-lg"
        >
          {isPlaying ? (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>
        <button
          onClick={reset}
          className="w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition"
          title="Reset"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 9a9 9 0 0115.6-6.4M20 15a9 9 0 01-15.6 6.4" />
          </svg>
        </button>
        <div className="flex-1">
          <input
            type="range"
            min={0}
            max={years.length - 1}
            value={currentIndex}
            onChange={handleSliderChange}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-slate-500">{years[0]}</span>
            <span className="text-[10px] text-slate-500">{years[years.length - 1]}</span>
          </div>
        </div>
      </div>

      {/* Hover tooltip */}
      {hoveredBar && (
        <div className="mt-4 p-3 bg-slate-800 rounded-lg border border-slate-600">
          <p className="text-sm font-bold text-white">{hoveredBar}</p>
          <p className="text-xs text-slate-400">
            {currentYear}: <span className="text-emerald-400 font-bold">
              {bars.find(b => b.label === hoveredBar)?.currentValue.toLocaleString()}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
