import React, { useEffect, useRef } from 'react';

export default function StarBackground({ darkMode }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // উইন্ডো রিসাইজ হ্যান্ডলার
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // তারা (Stars) জেনারেট করা
    const starCount = 120;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random(),
      speed: Math.random() * 0.015 + 0.005,
      direction: Math.random() > 0.5 ? 1 : -1,
      driftY: Math.random() * 0.15 + 0.05
    }));

    // অ্যানিমেশন লুপ
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach((star) => {
        // টুইঙ্কল বা মিটমিট করার লজিক
        star.alpha += star.speed * star.direction;
        if (star.alpha > 0.95 || star.alpha < 0.1) {
          star.direction *= -1;
        }

        // মৃদু ওপর-নিচে ড্রিফট লজিক
        star.y -= star.driftY;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);

        if (darkMode) {
          // ডার্ক মোডে গোল্ডেন ও এমারেল্ড-হোয়াইট তারা
          ctx.fillStyle = `rgba(220, 252, 231, ${Math.max(0.1, star.alpha)})`;
          ctx.shadowBlur = star.radius * 4;
          ctx.shadowColor = 'rgba(52, 211, 153, 0.6)';
        } else {
          // লাইট মোডে সফট গ্রে-টিন্ট পার্টিকেল
          ctx.fillStyle = `rgba(16, 185, 129, ${Math.max(0.05, star.alpha * 0.3)})`;
          ctx.shadowBlur = 0;
        }

        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [darkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
    />
  );
}