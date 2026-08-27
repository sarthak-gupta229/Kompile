// ASCII Rain — Originkit (converted to plain JSX)
import { useEffect, useRef } from "react";

const DEFAULTS = {
  headColor: "#FFFFFF",
  trailColor: "#F7FF00",
  glyphSize: 20,
  speed: 6,
  angle: 0,
  density: 50,
  trail: 23,
  glyphs: "ｱｲｳｴｵｶｷｸ0123456789ABCDEFｸｿﾝ",
  shuffle: true,
  shuffleGlyphs: "ｱｲｳｴｵｶｷｸ0123456789ABCDEFｸｿﾝ",
};

const MIN_BURNOUT = 0.75;
const CROSSING_SHARE = 0.35;
const MIN_RELEASE = 0.3;
const MAX_RELEASE = 0.8;

function DigitalRainBase({
  headColor = DEFAULTS.headColor,
  trailColor = DEFAULTS.trailColor,
  glyphSize = DEFAULTS.glyphSize,
  speed = DEFAULTS.speed,
  angle = DEFAULTS.angle,
  density = DEFAULTS.density,
  trail = DEFAULTS.trail,
  glyphs = DEFAULTS.glyphs,
  shuffle = DEFAULTS.shuffle,
  shuffleGlyphs = DEFAULTS.shuffleGlyphs,
  style,
}) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrapEl = wrapRef.current;
    const canvasEl = canvasRef.current;
    if (!wrapEl || !canvasEl) return;
    const ctx = canvasEl.getContext("2d");
    if (!ctx) return;

    const source = shuffle
      ? shuffleGlyphs || DEFAULTS.shuffleGlyphs
      : glyphs || DEFAULTS.glyphs;
    const chars = [...source];
    const pick = () => chars[Math.floor(Math.random() * chars.length)];
    const rad = (angle * Math.PI) / 180;
    const rate = speed * glyphSize;
    const gap = glyphSize * (1 + (50 - density) / 12);
    const tailLength = Math.max(1, Math.round(trail));

    let alive = true;
    let raf = 0;
    let last = 0;
    let w = 0, h = 0, span = 0, cols = 0;
    let columns = [];

    function spawn(y) {
      return {
        y,
        rate: rate * (0.75 + Math.random() * 0.5),
        burnout:
          Math.random() < CROSSING_SHARE
            ? Infinity
            : MIN_BURNOUT + Math.random() * (1 - MIN_BURNOUT),
        alpha: 1,
        chars: Array.from({ length: tailLength }, pick),
      };
    }

    function nextRelease() {
      return span * (MIN_RELEASE + Math.random() * (MAX_RELEASE - MIN_RELEASE));
    }

    function layout() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = wrapEl.clientWidth || 360;
      h = wrapEl.clientHeight || 320;
      canvasEl.width = Math.round(w * dpr);
      canvasEl.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      span = Math.hypot(w, h);
      cols = Math.max(1, Math.ceil(span / gap));
      columns = Array.from({ length: cols }, () => ({
        streams: [spawn(Math.random() * span)],
        releaseAt: nextRelease(),
      }));
    }

    function draw(dt) {
      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(rad);
      ctx.font = `${glyphSize}px ui-monospace, Menlo, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const lead = tailLength * glyphSize;

      for (let i = 0; i < cols; i++) {
        const column = columns[i];
        const x = -span / 2 + i * gap + gap / 2;

        for (const stream of column.streams) {
          stream.y += stream.rate * dt;
          const travelled = stream.y / span;
          if (stream.burnout !== Infinity && travelled > stream.burnout) {
            stream.alpha -= dt * 1.5;
          }
          if (shuffle && Math.random() < 0.25) {
            stream.chars[Math.floor(Math.random() * stream.chars.length)] = pick();
          }

          const headY = -span / 2 + stream.y;
          const columnAlpha = Math.max(0, Math.min(1, stream.alpha));

          for (let j = 0; j < tailLength; j++) {
            const y = headY - j * glyphSize;
            if (y < -span / 2 - glyphSize || y > span / 2 + glyphSize) continue;
            const taper = j === 0 ? 1 : 1 - j / tailLength;
            ctx.globalAlpha = columnAlpha * taper;
            ctx.fillStyle = j === 0 ? headColor : trailColor;
            ctx.fillText(stream.chars[j], x, y);
          }
        }

        column.streams = column.streams.filter(
          (stream) => stream.alpha > 0 && stream.y - lead <= span
        );

        const newest = column.streams[column.streams.length - 1];
        if (!newest || newest.y >= column.releaseAt) {
          column.streams.push(spawn(-lead));
          column.releaseAt = nextRelease();
        }
      }

      ctx.globalAlpha = 1;
      ctx.restore();
    }

    function loop(time) {
      if (!alive) return;
      const dt = last ? Math.min((time - last) / 1000, 0.05) : 1 / 60;
      last = time;
      draw(dt);
      raf = requestAnimationFrame(loop);
    }

    layout();

    let ro = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(layout);
      ro.observe(wrapEl);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro?.disconnect();
    };
  }, [headColor, trailColor, glyphSize, speed, angle, density, trail, glyphs, shuffle, shuffleGlyphs]);

  return (
    <div
      ref={wrapRef}
      style={{ position: "relative", overflow: "hidden", ...style }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
}

// Originkit preset — orange trail, compact glyphs
const presetProps = {
  trailColor: "#F64900",
  glyphSize: 10,
  trail: 18,
};

export default function DigitalRain(props) {
  return <DigitalRainBase {...presetProps} {...props} />;
}
