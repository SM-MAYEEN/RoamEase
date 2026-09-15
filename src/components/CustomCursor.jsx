import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [stars, setStars] = useState([]);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const lastTime = useRef(0);

  useEffect(() => {
    // মোবাইল ডিভাইস চেক
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    const handleMouseMove = (e) => {
      const { clientX: x, clientY: y } = e;
      setPos({ x, y });

      const now = Date.now();
      // প্রতি ৩০ মিলিসেকেন্ডে মাউসের চারপাশে ১টি করে তারা জেনারেট হবে
      if (now - lastTime.current > 30) {
        lastTime.current = now;
        
        const newStar = {
          id: `${now}-${Math.random()}`,
          x: x + (Math.random() - 0.5) * 20,
          y: y + (Math.random() - 0.5) * 20,
          size: Math.random() * 12 + 10,
          color: Math.random() > 0.4 ? '#34d399' : '#f59e0b', // Emerald or Amber
        };

        setStars((prev) => [...prev.slice(-25), newStar]);
      }

      // বাটন বা লিংকের ওপর হোভার ডিটেকশন
      const target = e.target;
      setIsHovered(!!target.closest('button, a, input, .cursor-pointer'));
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // পুরোনো তারা রিমুভ করার ইফেক্ট
  useEffect(() => {
    if (stars.length === 0) return;
    const timer = setTimeout(() => {
      setStars((prev) => prev.filter((s) => Date.now() - Number(s.id.split('-')[0]) < 600));
    }, 100);
    return () => clearTimeout(timer);
  }, [stars]);

  return (
    <>
      <style>{`
        @keyframes sparkleStar {
          0% {
            transform: scale(0.2) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: scale(1.2) rotate(90deg);
            opacity: 0.9;
          }
          100% {
            transform: scale(0) rotate(180deg);
            opacity: 0;
          }
        }
        .star-sparkle {
          animation: sparkleStar 0.6s ease-out forwards;
        }
      `}</style>

      {/* Main Mouse Dot */}
      <div
        className="pointer-events-none fixed z-[99999] -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-75"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: isHovered ? '28px' : '8px',
          height: isHovered ? '28px' : '8px',
          backgroundColor: isHovered ? 'rgba(52, 211, 153, 0.25)' : '#10b981',
          border: isHovered ? '1.5px solid #34d399' : 'none',
          boxShadow: '0 0 10px #10b981'
        }}
      />

      {/* Real-time 4-Pointed Stars Container */}
      <div className="pointer-events-none fixed inset-0 z-[99998] overflow-hidden">
        {stars.map((star) => (
          <svg
            key={star.id}
            viewBox="0 0 24 24"
            className="star-sparkle absolute"
            style={{
              left: `${star.x}px`,
              top: `${star.y}px`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              fill: star.color,
              filter: `drop-shadow(0 0 6px ${star.color})`
            }}
          >
            {/* 4-Pointed Star Shape */}
            <path d="M12 0C12 7 7 12 0 12C7 12 12 17 12 24C12 17 17 12 24 12C17 12 12 7 12 0Z" />
          </svg>
        ))}
      </div>
    </>
  );
}