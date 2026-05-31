import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const StyledCursorDot = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 16px;
  height: 22px;
  pointer-events: none;
  z-index: 10000;
  transition: filter 0.15s ease;
  filter: drop-shadow(0 0 3px rgba(255, 215, 0, 0.5));
  image-rendering: pixelated;

  svg {
    width: 100%;
    height: 100%;
  }

  &.hovering {
    filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.8));
  }
`;

const StyledTrail = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 6px;
  height: 6px;
  background: #ffd700;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: screen;
  opacity: 0;
`;

const rippleExpand = keyframes`
  0% { transform: translate(-50%, -50%) scale(0); opacity: 0.7; }
  100% { transform: translate(-50%, -50%) scale(5); opacity: 0; }
`;
const rippleExpand2 = keyframes`
  0% { transform: translate(-50%, -50%) scale(0); opacity: 0.35; }
  100% { transform: translate(-50%, -50%) scale(8); opacity: 0; }
`;

const StyledRipple = styled.div`
  position: fixed;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1.5px solid #ffd700;
  pointer-events: none;
  z-index: 9999;
  animation: ${rippleExpand} 0.75s ease-out forwards;
`;
const StyledRippleOuter = styled.div`
  position: fixed;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(255, 215, 0, 0.3);
  pointer-events: none;
  z-index: 9998;
  animation: ${rippleExpand2} 1s ease-out forwards;
`;

const TouchRippleSystem = () => {
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    const handleTouch = e => {
      const touch = e.touches[0];
      const id = Date.now() + Math.random();
      setRipples(prev => [...prev, { id, x: touch.clientX, y: touch.clientY }]);
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== id));
      }, 1000);
    };

    window.addEventListener('touchstart', handleTouch, { passive: true });
    return () => window.removeEventListener('touchstart', handleTouch);
  }, []);

  return (
    <>
      {ripples.map(r => (
        <React.Fragment key={r.id}>
          <StyledRipple style={{ left: r.x, top: r.y }} />
          <StyledRippleOuter style={{ left: r.x, top: r.y }} />
        </React.Fragment>
      ))}
    </>
  );
};

const TRAIL_COUNT = 5;

const Cursor = () => {
  const dotRef = useRef(null);
  const trailRefs = useRef([]);
  const mousePos = useRef({ x: -100, y: -100 });
  const trailPositions = useRef(Array.from({ length: TRAIL_COUNT }, () => ({ x: -100, y: -100 })));
  const rafId = useRef(null);
  const isTouchDevice = useRef(false);

  useEffect(() => {
    // Don't show custom cursor on touch devices
    isTouchDevice.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice.current) {return;}

    // Hide default cursor
    document.body.style.cursor = 'none';

    const handleMouseOver = e => {
      const target = e.target;
      // Cheap structural check only — no getComputedStyle, which forced a
      // synchronous layout reflow on every single mouseover and caused jank.
      const isClickable =
        typeof target.closest === 'function' &&
        target.closest(
          'a, button, [role="button"], input, textarea, select, label, [data-clickable]',
        );

      if (dotRef.current) {
        dotRef.current.classList.toggle('hovering', !!isClickable);
      }
    };

    const animate = () => {
      const { x, y } = mousePos.current;

      // Move main dot instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }

      // Trail follows with increasing delay
      let settled = true;
      for (let i = 0; i < TRAIL_COUNT; i++) {
        const speed = 0.15 - i * 0.02; // Each trail dot is slower
        const prev = i === 0 ? mousePos.current : trailPositions.current[i - 1];

        const dx = prev.x - trailPositions.current[i].x;
        const dy = prev.y - trailPositions.current[i].y;
        trailPositions.current[i].x += dx * speed;
        trailPositions.current[i].y += dy * speed;
        if (Math.abs(dx) > 0.3 || Math.abs(dy) > 0.3) {
          settled = false;
        }

        const el = trailRefs.current[i];
        if (el) {
          const pos = trailPositions.current[i];
          el.style.transform = `translate(${pos.x - 3}px, ${pos.y - 3}px)`;
          el.style.opacity = `${0.4 - i * 0.07}`;
          // Each trail dot gets smaller
          const size = 6 - i * 0.8;
          el.style.width = `${size}px`;
          el.style.height = `${size}px`;
        }
      }

      // Pause the loop once the trail has caught up to the cursor. handleMouseMove
      // restarts it on the next move, so we stop repainting while idle.
      if (settled) {
        rafId.current = null;
        return;
      }
      rafId.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = e => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      // Wake the animation loop if it paused itself while the cursor was idle.
      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(animate);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    rafId.current = requestAnimationFrame(animate);

    // Add cursor:none to all interactive elements too
    const style = document.createElement('style');
    style.textContent = '*, *:hover { cursor: none !important; }';
    document.head.appendChild(style);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      if (rafId.current) {cancelAnimationFrame(rafId.current);}
      document.body.style.cursor = '';
      document.head.removeChild(style);
    };
  }, []);

  // On touch/mobile: render ripple system instead
  if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
    return <TouchRippleSystem />;
  }

  return (
    <>
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <StyledTrail
          key={i}
          ref={el => {
            trailRefs.current[i] = el;
          }}
        />
      ))}
      <StyledCursorDot ref={dotRef}>
        <svg viewBox="0 0 16 22" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges">
          {/* Pixel art cursor — old school RPG sword pointer */}
          {/* Blade */}
          <rect x="1" y="0" width="2" height="2" fill="#ffd700" />
          <rect x="2" y="2" width="2" height="2" fill="#ffd700" />
          <rect x="3" y="4" width="2" height="2" fill="#ffd700" />
          <rect x="4" y="6" width="2" height="2" fill="#ffe44d" />
          <rect x="5" y="8" width="2" height="2" fill="#ffe44d" />
          <rect x="6" y="10" width="2" height="2" fill="#ffd700" />
          {/* Guard */}
          <rect x="3" y="12" width="2" height="2" fill="#b8860b" />
          <rect x="5" y="12" width="2" height="2" fill="#daa520" />
          <rect x="7" y="12" width="2" height="2" fill="#daa520" />
          <rect x="9" y="12" width="2" height="2" fill="#b8860b" />
          {/* Handle */}
          <rect x="7" y="14" width="2" height="2" fill="#8b6914" />
          <rect x="8" y="16" width="2" height="2" fill="#b8860b" />
          <rect x="9" y="18" width="2" height="2" fill="#8b6914" />
          {/* Outline pixels for depth */}
          <rect x="0" y="0" width="1" height="2" fill="#b89a00" />
          <rect x="3" y="0" width="1" height="2" fill="#b89a00" />
          <rect x="1" y="2" width="1" height="2" fill="#b89a00" />
          <rect x="4" y="2" width="1" height="2" fill="#b89a00" />
        </svg>
      </StyledCursorDot>
    </>
  );
};

export default Cursor;
