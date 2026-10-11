import React, { useEffect, useRef } from 'react';

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  lineWidth: number;
  r: number;
  g: number;
  b: number;
}

interface ClickSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  r: number;
  g: number;
  b: number;
}

export const InteractiveCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse coordinates
    const mouse = { x: -1000, y: -1000, radius: 150 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    // Arrays for interactive liquid effects
    let shockwaves: Shockwave[] = [];
    let sparks: ClickSpark[] = [];

    // Helper to get active theme rgb
    const getBrandRgb = () => {
      const rootStyle = getComputedStyle(document.documentElement);
      const brandRgb = rootStyle.getPropertyValue('--color-brand').trim() || '99 102 241';
      const parts = brandRgb.split(' ').map(Number);
      return {
        r: parts[0] || 99,
        g: parts[1] || 102,
        b: parts[2] || 241,
      };
    };

    // Pointer down handler for click shockwave & spark motes
    const handlePointerDown = (e: PointerEvent) => {
      const { r, g, b } = getBrandRgb();
      const px = e.clientX;
      const py = e.clientY;

      // Primary liquid shockwave ring
      shockwaves.push({
        x: px,
        y: py,
        radius: 4,
        maxRadius: 100,
        alpha: 0.75,
        lineWidth: 2.5,
        r,
        g,
        b,
      });

      // Secondary smaller reverberation ring
      shockwaves.push({
        x: px,
        y: py,
        radius: 2,
        maxRadius: 65,
        alpha: 0.5,
        lineWidth: 1.5,
        r: Math.min(255, r + 30),
        g: Math.min(255, g + 30),
        b: Math.min(255, b + 30),
      });

      // Radiating click spark particles
      const sparkCount = 12;
      for (let i = 0; i < sparkCount; i++) {
        const angle = (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 0.4;
        const speed = Math.random() * 2.8 + 1.2;
        const maxLife = Math.floor(Math.random() * 25) + 20;
        sparks.push({
          x: px,
          y: py,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 2 + 1,
          alpha: 1,
          life: maxLife,
          maxLife,
          r,
          g,
          b,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('pointerdown', handlePointerDown);

    // Particle nodes for ambient grid
    const particleCount = Math.min(Math.floor((width * height) / 22000), 65);
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        size: Math.random() * 1.6 + 0.8,
        alpha: Math.random() * 0.45 + 0.2,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const { r, g, b } = getBrandRgb();

      // 1. Ambient mouse fluid cursor glow
      if (mouse.x > 0 && mouse.y > 0) {
        const glowRadius = 140;
        const grad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          glowRadius
        );
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.06)`);
        grad.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, 0.02)`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(
          mouse.x - glowRadius,
          mouse.y - glowRadius,
          glowRadius * 2,
          glowRadius * 2
        );
      }

      // 2. Liquid shockwave rings
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += (sw.maxRadius - sw.radius) * 0.12 + 1.2;
        sw.alpha *= 0.92;
        sw.lineWidth *= 0.95;

        if (sw.alpha < 0.02 || sw.radius >= sw.maxRadius) {
          shockwaves.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${sw.r}, ${sw.g}, ${sw.b}, ${sw.alpha})`;
        ctx.lineWidth = Math.max(0.5, sw.lineWidth);
        ctx.stroke();
      }

      // 3. Click spark motes
      for (let i = sparks.length - 1; i >= 0; i--) {
        const sp = sparks[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vx *= 0.92;
        sp.vy *= 0.92;
        sp.life--;
        sp.alpha = (sp.life / sp.maxLife) * 0.85;

        if (sp.life <= 0 || sp.alpha < 0.02) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${sp.r}, ${sp.g}, ${sp.b}, ${sp.alpha})`;
        ctx.shadowColor = `rgba(${sp.r}, ${sp.g}, ${sp.b}, 0.5)`;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 4. Update and draw background floating particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse gentle repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x += (dx / dist) * force * 1.8;
          p.y += (dy / dist) * force * 1.8;
        }

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.6})`;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist2 = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist2 < 110) {
            const lineAlpha = (1 - dist2 / 110) * 0.12;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1] opacity-75"
      aria-hidden="true"
    />
  );
};
