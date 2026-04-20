import { useEffect } from 'react';
import { useThemeStore } from '../store/useThemeStore';

// ── 3-D point on unit sphere ──────────────────────────────────────────────────
type Pt = { ox: number; oy: number; oz: number };
type Projected = { sx: number; sy: number; sz: number; scale: number };

// Fibonacci sphere — even distribution of N points on a unit sphere
function fibSphere(n: number): Pt[] {
  const pts: Pt[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = phi * i;
    pts.push({ ox: Math.cos(t) * r, oy: y, oz: Math.sin(t) * r });
  }
  return pts;
}

export default function VantaBackground() {
  const isDark = useThemeStore((s) => s.isDark);

  useEffect(() => {
    // ── Canvas ──────────────────────────────────────────────────────────────
    const canvas = document.createElement('canvas');
    canvas.id = 'cv-globe-bg';
    Object.assign(canvas.style, {
      position: 'fixed', top: '0', left: '0',
      width: '100vw', height: '100vh',
      zIndex: '999', display: 'block', pointerEvents: 'none',
    });
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d')!;
    let animId: number;
    let w = canvas.width  = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    // ── Sphere geometry ─────────────────────────────────────────────────────
    const N   = 200;
    const pts = fibSphere(N);

    const CONNECT_THRESHOLD = Math.cos(0.32);
    const pairs: [number, number][] = [];
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dot = pts[i].ox * pts[j].ox + pts[i].oy * pts[j].oy + pts[i].oz * pts[j].oz;
        if (dot > CONNECT_THRESHOLD) pairs.push([i, j]);
      }
    }

    // ── Rotation state ──────────────────────────────────────────────────────
    let rotX =  0.25;
    let rotY =  0;
    let velX =  0.00020;
    let velY =  0.00045;

    const AUTO_VX =  0.00020;
    const AUTO_VY =  0.00045;

    // ── Mouse ───────────────────────────────────────────────────────────────
    let mx = -9999, my = -9999;
    const onMove  = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    const onLeave = () => { mx = -9999; my = -9999; };
    const onResize = () => {
      w = canvas.width  = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', onResize);

    // ── Colors ──────────────────────────────────────────────────────────────
    const CR = isDark ? [143, 190, 126] : [61, 122, 48];

    function dotC(a: number)  { return `rgba(${CR[0]},${CR[1]},${CR[2]},${a.toFixed(3)})`; }
    function lineC(a: number) { return `rgba(${CR[0]},${CR[1]},${CR[2]},${a.toFixed(3)})`; }

    // ── 3-D helpers ─────────────────────────────────────────────────────────
    function rotate(p: Pt): { x: number; y: number; z: number } {
      const cx = Math.cos(rotY), sx = Math.sin(rotY);
      const x1 =  p.ox * cx + p.oz * sx;
      const z1 = -p.ox * sx + p.oz * cx;
      const y1 =  p.oy;
      const cy = Math.cos(rotX), sy = Math.sin(rotX);
      const y2 =  y1 * cy - z1 * sy;
      const z2 =  y1 * sy + z1 * cy;
      return { x: x1, y: y2, z: z2 };
    }

    function project(p: { x: number; y: number; z: number }, R: number): Projected {
      const FOV   = 3.2;
      const scale = FOV / (FOV + p.z + 1);
      const cx    = w / 2, cy = h / 2;
      return {
        sx: cx + p.x * R * scale,
        sy: cy + p.y * R * scale,
        sz: p.z,
        scale,
      };
    }

    // ── Draw ────────────────────────────────────────────────────────────────
    function draw() {
      ctx.clearRect(0, 0, w, h);

      const R = Math.min(w, h) * 0.52; // bigger globe

      const cx = w / 2, cy = h / 2;
      const targetVY = mx > 0 ? (mx - cx) / w * 0.006 : AUTO_VY;
      const targetVX = my > 0 ? (my - cy) / h * 0.003 : AUTO_VX;
      velY += (targetVY - velY) * 0.04;
      velX += (targetVX - velX) * 0.04;
      rotY += velY;
      rotX += velX;

      const T: ({ x: number; y: number; z: number } & Projected)[] = pts.map(p => {
        const r = rotate(p);
        return { ...r, ...project(r, R) };
      });

      // Lines
      ctx.lineWidth = 0.6;
      for (const [i, j] of pairs) {
        const a = T[i], b = T[j];
        if (a.sz < -0.5 && b.sz < -0.5) continue;
        const avgZ = (a.sz + b.sz) * 0.5;
        const vis  = Math.max(0, (avgZ + 1) * 0.5);
        ctx.strokeStyle = lineC(vis * (isDark ? 0.28 : 0.22));
        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy);
        ctx.lineTo(b.sx, b.sy);
        ctx.stroke();
      }

      // Dots
      for (const p of T) {
        const vis    = Math.max(0, (p.sz + 1) * 0.5);
        const radius = 0.8 + vis * 2.0;
        const alpha  = 0.15 + vis * (isDark ? 0.72 : 0.60);

        if (vis > 0.6) {
          ctx.shadowBlur  = 4 + vis * 6;
          ctx.shadowColor = dotC(vis * 0.5);
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = dotC(alpha);
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', onResize);
      canvas.parentNode?.removeChild(canvas);
    };
  }, [isDark]);

  return null;
}
