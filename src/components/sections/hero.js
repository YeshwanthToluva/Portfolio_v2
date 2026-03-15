import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { email } from '@config';
import styled, { keyframes } from 'styled-components';
import { theme, mixins, media, Section } from '@styles';
const { colors, fontSizes, fonts, navDelay, loaderDelay } = theme;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;
const btnPulse = keyframes`
  0%, 100% { box-shadow: 0 0 5px ${colors.green}, 0 0 15px rgba(255,215,0,0.3); }
  50% { box-shadow: 0 0 15px ${colors.green}, 0 0 40px rgba(255,215,0,0.4), 0 0 60px rgba(255,215,0,0.1); }
`;
const cursorBlink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

const StyledContainer = styled(Section)`
  ${mixins.flexCenter};
  flex-direction: row; align-items: center;
  min-height: 100vh; position: relative; overflow: hidden;
  ${media.tablet`flex-direction: column; padding-top: 150px;`};
`;
const StyledLeftContent = styled.div`
  flex: 1.1; display: flex; flex-direction: column; justify-content: center; z-index: 2;
  div { width: 100%; }
`;
const StyledRightContent = styled.div`
  flex: 0.9; position: relative; height: 400px; z-index: 1; overflow: hidden;
  margin-top: -120px;
  ${media.desktop`height: 350px; margin-top: -80px;`};
  ${media.tablet`width: 100%; height: 280px; margin-top: 0;`};
  ${media.phablet`display: none;`};
`;
const StyledSpotlight = styled.div`
  position: absolute; pointer-events: none; width: 600px; height: 600px; border-radius: 50%;
  background: radial-gradient(circle at center, rgba(255,215,0,0.06) 0%, rgba(255,215,0,0.02) 30%, transparent 70%);
  transform: translate(-50%, -50%); z-index: 0;
`;
const StyledOverline = styled.h1`
  color: ${colors.green}; margin: 0 0 20px 3px; font-size: ${fontSizes.md};
  font-family: ${fonts.SFMono}; font-weight: normal; position: relative; z-index: 1;
  ${media.desktop`font-size: ${fontSizes.sm};`};
  ${media.tablet`font-size: ${fontSizes.smish};`};
`;
const StyledTitle = styled.h2`
  font-size: 80px; line-height: 1.1; margin: 0; position: relative; z-index: 1;
  background: linear-gradient(90deg, ${colors.lightestSlate} 0%, ${colors.green} 25%, ${colors.white} 50%, ${colors.green} 75%, ${colors.lightestSlate} 100%);
  background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text; animation: ${shimmer} 5s linear infinite;
  ${media.desktop`font-size: 70px;`}; ${media.tablet`font-size: 60px;`};
  ${media.phablet`font-size: 50px;`}; ${media.phone`font-size: 40px;`};
`;
const StyledSubtitle = styled.h3`
  font-size: 55px; line-height: 1.1; color: ${colors.slate}; position: relative; z-index: 1; min-height: 130px;
  ${media.desktop`font-size: 45px; min-height: 110px;`};
  ${media.tablet`font-size: 40px; min-height: 100px;`};
  ${media.phablet`font-size: 35px; min-height: 85px;`};
  ${media.phone`font-size: 28px; min-height: 70px;`};
`;
const StyledCursor = styled.span`
  color: ${colors.green}; animation: ${cursorBlink} 0.8s step-end infinite; font-weight: 200;
`;
const StyledDescription = styled.div`
  margin-top: 25px; max-width: 500px; position: relative; z-index: 1;
  a { ${mixins.inlineLink}; }
`;
const StyledEmailLink = styled.a`
  ${mixins.bigButton}; margin-top: 50px; position: relative; z-index: 1;
  animation: ${btnPulse} 3s ease-in-out infinite;
  &:hover { animation: none; box-shadow: 0 0 20px ${colors.green}, 0 0 50px rgba(255,215,0,0.4); background-color: rgba(255,215,0,0.1); }
`;

const phrases = [
  'I build & automate infrastructure.',
  'I love Linux and distro hopping.',
  'I love AI agents and orchestration.',
];

// ─── FULL-STAGE NARRATIVE ANIMATION ───
// Single viewport. Each stage takes the FULL frame, slides in/out like a camera pan.
const WorkflowAnimation = () => {
  const svgRef = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) {return;}
    started.current = true;

    const run = async () => {
      let g;
      try { g = await import('gsap'); } catch (e) { return; }
      const gsap = g.default || g;
      if (!svgRef.current) {return;}
      const svg = svgRef.current;
      const $ = s => svg.querySelector(s);
      const $$ = s => svg.querySelectorAll(s);

      // Reveal SVG now that GSAP will control visibility
      svg.style.visibility = 'visible';

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

      // ═══ RESET ALL ═══
      tl.set($('#termStage'), { x: 0, opacity: 1 })
        .set($('#cloudStage'), { x: 500, opacity: 1 })
        .set($('#agentStage'), { x: 500, opacity: 1 })
        .set($$('.tl'), { opacity: 0 })
        .set($('#termCursor'), { opacity: 0 })
        .set($('#termPulse'), { scale: 0, opacity: 0, transformOrigin: '460 200' })
        .set($('#exitLine'), { strokeDashoffset: 500 })
        .set($('#entryLine'), { strokeDashoffset: 500 })
        .set($$('.cb'), { strokeDashoffset: 100 })
        .set($$('.cn'), { opacity: 0, scale: 0, transformOrigin: 'center' })
        .set($$('.cpulse'), { opacity: 0 })
        .set($('#cloudPulseRing'), { scale: 0, opacity: 0, transformOrigin: '270 160' })
        .set($('#exitLine2'), { strokeDashoffset: 500 })
        .set($$('.wn'), { opacity: 0, scale: 0, transformOrigin: 'center' })
        .set($$('.wl'), { strokeDashoffset: 200, opacity: 0 })
        .set($$('.wp'), { opacity: 0, scale: 0, transformOrigin: 'center' })
        .set($$('.wcheck'), { opacity: 0 })
        .set($('#resultLine'), { strokeDashoffset: 100 })
        .set($('#robotStage'), { x: 500, opacity: 1 })
        .set($('#robotBody'), { opacity: 0, scale: 0, transformOrigin: '250 180' })
        .set($('#eyeL'), { opacity: 0 })
        .set($('#eyeR'), { opacity: 0 })
        .set($('#eyeRwink'), { scaleY: 1, transformOrigin: 'center' })
        .set($('#robotMouth'), { opacity: 0 })
        .set($('#robotAntenna'), { opacity: 0 })
        .set($('#robotPowerRing'), { scale: 0, opacity: 0, transformOrigin: '250 180' })
        .set($('#robotSparkle'), { opacity: 0, scale: 0, transformOrigin: 'center' })
        .set($('#robotCheckG'), { opacity: 0, scale: 0, transformOrigin: 'center' })
        .set($('#exitLine3'), { strokeDashoffset: 200 })
        .set($('#entryLine3'), { strokeDashoffset: 200 });

      // ═══════════════════════════════
      // STAGE 1: TERMINAL (full frame)
      // ═══════════════════════════════
      // Terminal cursor blinks
      tl.to($('#termCursor'), { opacity: 1, duration: 0.3 })
        // Lines type in one by one
        .to($$('.tl'), { opacity: 1, duration: 0.08, stagger: 0.35, ease: 'none' })
        // Pause to read
        .to({}, { duration: 0.4 })
        // Pulse radiates from right edge
        .to($('#termPulse'), { scale: 8, opacity: 0.4, duration: 0.5, ease: 'power2.out' })
        .to($('#termPulse'), { scale: 15, opacity: 0, duration: 0.4, ease: 'power2.out' })
        // Exit line shoots right
        .to($('#exitLine'), { strokeDashoffset: 0, duration: 0.4, ease: 'power2.in' })
        // Terminal slides LEFT out of frame
        .to($('#termStage'), { x: -500, duration: 0.7, ease: 'power3.inOut' })
        // Cloud slides IN from right simultaneously
        .to($('#cloudStage'), { x: 0, duration: 0.7, ease: 'power3.inOut' }, '<');

      // ═══════════════════════════════
      // STAGE 2: CLOUD (full frame)
      // ═══════════════════════════════
      // Entry line draws in
      tl.to($('#entryLine'), { strokeDashoffset: 0, duration: 0.3, ease: 'power2.out' })
        // Cloud hub pulses
        .to($('#cloudPulseRing'), { scale: 3, opacity: 0.3, duration: 0.4, ease: 'power2.out' })
        .to($('#cloudPulseRing'), { scale: 5, opacity: 0, duration: 0.3, ease: 'power2.out' })
        // Branch lines shoot out
        .to($$('.cb'), { strokeDashoffset: 0, duration: 0.3, stagger: 0.06, ease: 'power2.out' })
        // Nodes pop in
        .to($$('.cn'), { opacity: 1, scale: 1, duration: 0.2, stagger: 0.04, ease: 'back.out(3)' })
        // Nodes pulse (processing)
        .to($$('.cn'), { scale: 1.15, duration: 0.15, stagger: 0.03, ease: 'power2.out' })
        .to($$('.cn'), { scale: 1, duration: 0.2, stagger: 0.03, ease: 'power2.inOut' })
        // Pulse particles become visible (they auto-animate via SVG animateMotion)
        .to($$('.cpulse'), { opacity: 1, duration: 0.2, ease: 'power2.out' })
        .to({}, { duration: 0.8 })
        // Hide pulses before exit
        .to($$('.cpulse'), { opacity: 0, duration: 0.2, ease: 'power2.in' })
        // Exit line shoots right
        .to($('#exitLine2'), { strokeDashoffset: 0, duration: 0.3, ease: 'power2.in' })
        // Cloud slides LEFT, Agent slides IN
        .to($('#cloudStage'), { x: -500, duration: 0.7, ease: 'power3.inOut' })
        .to($('#agentStage'), { x: 0, duration: 0.7, ease: 'power3.inOut' }, '<');

      // ═══════════════════════════════════
      // STAGE 3: AGENTIC WORKFLOW (full frame)
      // n8n-style with Bézier curves
      // ═══════════════════════════════════
      // Nodes pop in with stagger — trigger first, then fan out
      tl.to($$('.wn'), { opacity: 1, scale: 1, duration: 0.3, stagger: 0.07, ease: 'back.out(2.5)' })
        // Bézier connection lines draw
        .to($$('.wl'), { strokeDashoffset: 0, opacity: 0.6, duration: 0.5, stagger: 0.04, ease: 'power2.out' }, '-=0.2')
        // Data pulses flow through nodes
        .to($$('.wp'), { opacity: 1, scale: 1, duration: 0.15, stagger: 0.1, ease: 'power2.out' })
        .to($$('.wp'), { opacity: 0.3, scale: 0.8, duration: 0.3, stagger: 0.1, ease: 'power2.in' }, '+=0.2')
        // Check marks appear on completed nodes
        .to($$('.wcheck'), { opacity: 1, duration: 0.15, stagger: 0.08, ease: 'power2.out' })
        // Exit line from deploy node
        .to($('#exitLine3'), { strokeDashoffset: 0, duration: 0.3, ease: 'power2.in' }, '+=0.3')
        // Agent slides LEFT, Robot slides IN
        .to($('#agentStage'), { x: -500, duration: 0.7, ease: 'power3.inOut' })
        .to($('#robotStage'), { x: 0, duration: 0.7, ease: 'power3.inOut' }, '<');

      // ═══════════════════════════════
      // STAGE 4: ROBOT — AI Agent Done
      // ═══════════════════════════════
      // Entry line from left
      tl.to($('#entryLine3'), { strokeDashoffset: 0, duration: 0.3, ease: 'power2.out' })
        // Robot body appears
        .to($('#robotBody'), { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' })
        // Antenna pops up
        .to($('#robotAntenna'), { opacity: 1, duration: 0.2, ease: 'power2.out' })
        // Power-on ring
        .to($('#robotPowerRing'), { scale: 4, opacity: 0.4, duration: 0.4, ease: 'power2.out' })
        .to($('#robotPowerRing'), { scale: 8, opacity: 0, duration: 0.4, ease: 'power2.out' })
        // Eyes light up
        .to($('#eyeL'), { opacity: 1, duration: 0.2, ease: 'power2.out' })
        .to($('#eyeR'), { opacity: 1, duration: 0.2, ease: 'power2.out' }, '-=0.15')
        // Mouth appears (smile)
        .to($('#robotMouth'), { opacity: 1, duration: 0.2, ease: 'power2.out' })
        // Hold — robot is alive
        .to({}, { duration: 0.5 })
        // WINK — right eye closes then opens
        .to($('#eyeRwink'), { scaleY: 0.1, duration: 0.12, ease: 'power2.in' })
        .to({}, { duration: 0.25 })
        .to($('#eyeRwink'), { scaleY: 1, duration: 0.15, ease: 'back.out(2)' })
        // Sparkle appears
        .to($('#robotSparkle'), { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(3)' }, '-=0.1')
        // Checkmark
        .to($('#robotCheckG'), { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' })
        // Hold the moment
        .to({}, { duration: 2 })
        // Fade everything
        .to($('#robotStage'), { opacity: 0, duration: 0.6, ease: 'power2.inOut' });
    };

    const t = setTimeout(run, 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <svg ref={svgRef} viewBox="0 0 500 400" preserveAspectRatio="xMidYMid meet"
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, visibility: 'hidden' }}>
      <defs>
        <filter id="g1"><feGaussianBlur stdDeviation="2.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <filter id="g2"><feGaussianBlur stdDeviation="4" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <filter id="g3"><feGaussianBlur stdDeviation="7" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>

      {/* ════════════════════════════════
           STAGE 1: TERMINAL (fills frame)
         ════════════════════════════════ */}
      <g id="termStage">
        {/* Terminal window chrome */}
        <rect x="40" y="60" width="420" height="260" rx="8" fill="none" stroke="#ffd700" strokeWidth="1.5" filter="url(#g1)" />
        {/* Title bar */}
        <line x1="40" y1="85" x2="460" y2="85" stroke="rgba(255,215,0,0.3)" strokeWidth="0.5" />
        {/* Window dots */}
        <circle cx="60" cy="73" r="4" fill="none" stroke="rgba(255,215,0,0.4)" strokeWidth="1" />
        <circle cx="75" cy="73" r="4" fill="none" stroke="rgba(255,215,0,0.4)" strokeWidth="1" />
        <circle cx="90" cy="73" r="4" fill="none" stroke="rgba(255,215,0,0.4)" strokeWidth="1" />
        {/* Title */}
        <text x="250" y="77" textAnchor="middle" fill="rgba(255,215,0,0.35)" fontSize="9" fontFamily="monospace">yesh@arch ~</text>

        {/* Terminal content — each line appears via GSAP */}
        <text x="60" y="110" fill="#ffd700" fontSize="11" fontFamily="monospace" className="tl" opacity="0">
          <tspan fill="rgba(255,215,0,0.5)">$</tspan> terraform init
        </text>
        <text x="60" y="130" fill="rgba(255,215,0,0.5)" fontSize="10" fontFamily="monospace" className="tl" opacity="0">Initializing provider plugins...</text>
        <text x="60" y="150" fill="rgba(255,215,0,0.5)" fontSize="10" fontFamily="monospace" className="tl" opacity="0">
          <tspan fill="#ffd700">✓</tspan> Terraform has been initialized
        </text>
        <text x="60" y="178" fill="#ffd700" fontSize="11" fontFamily="monospace" className="tl" opacity="0">
          <tspan fill="rgba(255,215,0,0.5)">$</tspan> terraform apply --auto-approve
        </text>
        <text x="60" y="198" fill="rgba(255,215,0,0.5)" fontSize="10" fontFamily="monospace" className="tl" opacity="0">aws_instance.web: Creating...</text>
        <text x="60" y="218" fill="rgba(255,215,0,0.5)" fontSize="10" fontFamily="monospace" className="tl" opacity="0">aws_eks_cluster.main: Creating...</text>
        <text x="60" y="238" fill="rgba(255,215,0,0.5)" fontSize="10" fontFamily="monospace" className="tl" opacity="0">
          <tspan fill="#ffd700">✓</tspan> Apply complete! Resources: 12 added
        </text>
        <text x="60" y="266" fill="#ffd700" fontSize="11" fontFamily="monospace" className="tl" opacity="0">
          <tspan fill="rgba(255,215,0,0.5)">$</tspan> → sending to cloud_
        </text>

        {/* Blinking cursor */}
        <rect id="termCursor" x="265" y="255" width="8" height="14" fill="#ffd700" opacity="0">
          <animate attributeName="opacity" values="0;1;0;1;0;1;0" dur="1.5s" repeatCount="indefinite" begin="0.5s" />
        </rect>

        {/* Pulse ring from right edge */}
        <circle id="termPulse" cx="460" cy="200" r="5" fill="none" stroke="#ffd700" strokeWidth="1.5" opacity="0" />

        {/* Exit data line — shoots to the right edge */}
        <line id="exitLine" x1="460" y1="200" x2="520" y2="200"
          stroke="#ffd700" strokeWidth="2.5" filter="url(#g2)"
          strokeDasharray="500" strokeDashoffset="500" />
      </g>

      {/* ════════════════════════════════
           STAGE 2: CLOUD HUB (fills frame)
         ════════════════════════════════ */}
      <g id="cloudStage">
        {/* Entry line from left → into port */}
        <line id="entryLine" x1="-20" y1="165" x2="148" y2="165"
          stroke="#ffd700" strokeWidth="2.5" filter="url(#g2)"
          strokeDasharray="500" strokeDashoffset="500" />

        {/* Entry port — circular connector on left of cloud */}
        <circle cx="155" cy="165" r="7" fill="rgba(255,215,0,0.08)" stroke="#ffd700" strokeWidth="1.5" filter="url(#g1)" />
        <circle cx="155" cy="165" r="3" fill="#ffd700" filter="url(#g2)" opacity="0.6" />

        {/* ── LARGE CLOUD SHAPE ── */}
        {/* Outer glow aura */}
        <ellipse cx="270" cy="150" rx="120" ry="70" fill="none" stroke="rgba(255,215,0,0.04)" strokeWidth="30" filter="url(#g3)" />
        {/* Main cloud outline — clean, large, rounded bumps */}
        <path d="M160,185 C155,155 175,125 210,118 C225,95 260,85 280,100 C300,82 335,90 345,112 C370,115 385,135 380,160 C390,180 375,198 350,200 L190,200 C165,200 155,195 160,185 Z"
          fill="rgba(255,215,0,0.03)" stroke="#ffd700" strokeWidth="2" filter="url(#g2)" />
        {/* Inner ring for depth */}
        <path d="M178,183 C175,162 190,140 215,135 C228,118 255,110 272,120 C288,108 315,114 322,130 C340,132 350,148 347,165 C353,178 343,190 325,192 L200,192 C182,192 175,190 178,183 Z"
          fill="none" stroke="rgba(255,215,0,0.15)" strokeWidth="0.8" />

        {/* AWS logo text inside */}
        <text x="270" y="148" textAnchor="middle" fill="#ffd700" fontSize="14" fontFamily="monospace" fontWeight="bold" opacity="0.7">AWS</text>
        <text x="270" y="165" textAnchor="middle" fill="rgba(255,215,0,0.4)" fontSize="8" fontFamily="monospace">cloud compute</text>

        {/* Blinking status indicators */}
        <circle cx="215" cy="175" r="2" fill="#ffd700">
          <animate attributeName="opacity" values="0.3;0.9;0.3" dur="1.1s" repeatCount="indefinite" />
        </circle>
        <circle cx="245" cy="178" r="2" fill="#ffd700">
          <animate attributeName="opacity" values="0.5;1;0.5" dur="0.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="295" cy="178" r="2" fill="#ffd700">
          <animate attributeName="opacity" values="0.2;0.7;0.2" dur="1.4s" repeatCount="indefinite" />
        </circle>
        <circle cx="325" cy="175" r="2" fill="#ffd700">
          <animate attributeName="opacity" values="0.4;0.9;0.4" dur="1s" repeatCount="indefinite" />
        </circle>

        {/* Pulse ring from center */}
        <circle id="cloudPulseRing" cx="270" cy="160" r="12" fill="none" stroke="#ffd700" strokeWidth="1.5" opacity="0" />

        {/* ── BÉZIER BRANCHES radiating from bottom of cloud ── */}
        <path className="cb" d="M210,200 C200,230 160,250 120,270" fill="none" stroke="#ffd700" strokeWidth="1.2" filter="url(#g1)" strokeDasharray="100" strokeDashoffset="100" />
        <path className="cb" d="M240,200 C235,235 215,260 195,285" fill="none" stroke="#ffd700" strokeWidth="1.2" filter="url(#g1)" strokeDasharray="100" strokeDashoffset="100" />
        <path className="cb" d="M270,200 C270,240 270,265 270,295" fill="none" stroke="#ffd700" strokeWidth="1.2" filter="url(#g1)" strokeDasharray="100" strokeDashoffset="100" />
        <path className="cb" d="M300,200 C305,235 325,260 345,285" fill="none" stroke="#ffd700" strokeWidth="1.2" filter="url(#g1)" strokeDasharray="100" strokeDashoffset="100" />
        <path className="cb" d="M335,200 C345,230 380,250 415,270" fill="none" stroke="#ffd700" strokeWidth="1.2" filter="url(#g1)" strokeDasharray="100" strokeDashoffset="100" />

        {/* Service nodes at branch ends */}
        <g className="cn" opacity="0">
          <circle cx="120" cy="273" r="8" fill="rgba(255,215,0,0.08)" stroke="#ffd700" strokeWidth="1.2" filter="url(#g1)" />
          <text x="120" y="276" textAnchor="middle" fill="#ffd700" fontSize="6.5" fontFamily="monospace">EC2</text>
        </g>
        <g className="cn" opacity="0">
          <circle cx="195" cy="288" r="8" fill="rgba(255,215,0,0.08)" stroke="#ffd700" strokeWidth="1.2" filter="url(#g1)" />
          <text x="195" y="291" textAnchor="middle" fill="#ffd700" fontSize="6.5" fontFamily="monospace">EKS</text>
        </g>
        <g className="cn" opacity="0">
          <circle cx="270" cy="298" r="8" fill="rgba(255,215,0,0.08)" stroke="#ffd700" strokeWidth="1.2" filter="url(#g1)" />
          <text x="270" y="301" textAnchor="middle" fill="#ffd700" fontSize="5.5" fontFamily="monospace">Lambda</text>
        </g>
        <g className="cn" opacity="0">
          <circle cx="345" cy="288" r="8" fill="rgba(255,215,0,0.08)" stroke="#ffd700" strokeWidth="1.2" filter="url(#g1)" />
          <text x="345" y="291" textAnchor="middle" fill="#ffd700" fontSize="6.5" fontFamily="monospace">S3</text>
        </g>
        <g className="cn" opacity="0">
          <circle cx="415" cy="273" r="8" fill="rgba(255,215,0,0.08)" stroke="#ffd700" strokeWidth="1.2" filter="url(#g1)" />
          <text x="415" y="276" textAnchor="middle" fill="#ffd700" fontSize="6.5" fontFamily="monospace">VPC</text>
        </g>

        {/* ── PULSE PARTICLES traveling cloud → nodes ── */}
        {/* Each follows its branch path */}
        <circle className="cpulse" r="3" fill="#ffd700" filter="url(#g2)" opacity="0">
          <animateMotion dur="1.5s" repeatCount="indefinite" begin="0.5s">
            <mpath href="#cpPath0" />
          </animateMotion>
          <animate attributeName="opacity" values="0;0.9;0.9;0" dur="1.5s" repeatCount="indefinite" begin="0.5s" />
        </circle>
        <circle className="cpulse" r="3" fill="#ffd700" filter="url(#g2)" opacity="0">
          <animateMotion dur="1.8s" repeatCount="indefinite" begin="0.8s">
            <mpath href="#cpPath1" />
          </animateMotion>
          <animate attributeName="opacity" values="0;0.8;0.8;0" dur="1.8s" repeatCount="indefinite" begin="0.8s" />
        </circle>
        <circle className="cpulse" r="3" fill="#ffd700" filter="url(#g2)" opacity="0">
          <animateMotion dur="1.4s" repeatCount="indefinite" begin="0.3s">
            <mpath href="#cpPath2" />
          </animateMotion>
          <animate attributeName="opacity" values="0;0.9;0.9;0" dur="1.4s" repeatCount="indefinite" begin="0.3s" />
        </circle>
        <circle className="cpulse" r="3" fill="#ffd700" filter="url(#g2)" opacity="0">
          <animateMotion dur="1.7s" repeatCount="indefinite" begin="1s">
            <mpath href="#cpPath3" />
          </animateMotion>
          <animate attributeName="opacity" values="0;0.8;0.8;0" dur="1.7s" repeatCount="indefinite" begin="1s" />
        </circle>
        <circle className="cpulse" r="3" fill="#ffd700" filter="url(#g2)" opacity="0">
          <animateMotion dur="1.6s" repeatCount="indefinite" begin="0.6s">
            <mpath href="#cpPath4" />
          </animateMotion>
          <animate attributeName="opacity" values="0;0.9;0.9;0" dur="1.6s" repeatCount="indefinite" begin="0.6s" />
        </circle>
        {/* Hidden paths for animateMotion */}
        <path id="cpPath0" d="M210,200 C200,230 160,250 120,270" fill="none" stroke="none" />
        <path id="cpPath1" d="M240,200 C235,235 215,260 195,285" fill="none" stroke="none" />
        <path id="cpPath2" d="M270,200 C270,240 270,265 270,295" fill="none" stroke="none" />
        <path id="cpPath3" d="M300,200 C305,235 325,260 345,285" fill="none" stroke="none" />
        <path id="cpPath4" d="M335,200 C345,230 380,250 415,270" fill="none" stroke="none" />

        {/* Exit port on right side of cloud */}
        <circle cx="385" cy="165" r="7" fill="rgba(255,215,0,0.08)" stroke="#ffd700" strokeWidth="1.5" filter="url(#g1)" />
        <circle cx="385" cy="165" r="3" fill="#ffd700" filter="url(#g2)" opacity="0.6" />

        {/* Exit line right from port */}
        <line id="exitLine2" x1="392" y1="165" x2="520" y2="165"
          stroke="#ffd700" strokeWidth="2.5" filter="url(#g2)"
          strokeDasharray="500" strokeDashoffset="500" />
      </g>

      {/* ════════════════════════════════════
           STAGE 3: AGENTIC WORKFLOW (full frame)
           n8n-style with Bézier curves
         ════════════════════════════════════ */}
      <g id="agentStage">
        {/* ── TRIGGER NODE (left) ── */}
        <g className="wn" opacity="0">
          <rect x="30" y="170" width="70" height="40" rx="10" fill="rgba(255,215,0,0.06)" stroke="#ffd700" strokeWidth="1.5" filter="url(#g1)" />
          <text x="65" y="188" textAnchor="middle" fill="#ffd700" fontSize="7" fontFamily="monospace">⚡ Trigger</text>
          <text x="65" y="200" textAnchor="middle" fill="rgba(255,215,0,0.4)" fontSize="6" fontFamily="monospace">webhook</text>
        </g>

        {/* ── RAG NODE ── */}
        <g className="wn" opacity="0">
          <rect x="160" y="100" width="70" height="40" rx="10" fill="rgba(255,215,0,0.06)" stroke="#ffd700" strokeWidth="1.5" filter="url(#g1)" />
          <text x="195" y="118" textAnchor="middle" fill="#ffd700" fontSize="7" fontFamily="monospace">📄 RAG</text>
          <text x="195" y="130" textAnchor="middle" fill="rgba(255,215,0,0.4)" fontSize="6" fontFamily="monospace">retrieval</text>
        </g>

        {/* ── LLM NODE (center, larger) ── */}
        <g className="wn" opacity="0">
          <rect x="160" y="230" width="70" height="40" rx="10" fill="rgba(255,215,0,0.06)" stroke="#ffd700" strokeWidth="1.5" filter="url(#g1)" />
          <text x="195" y="248" textAnchor="middle" fill="#ffd700" fontSize="7" fontFamily="monospace">🧠 LLM</text>
          <text x="195" y="260" textAnchor="middle" fill="rgba(255,215,0,0.4)" fontSize="6" fontFamily="monospace">inference</text>
        </g>

        {/* ── AGENT / TOOLS NODE ── */}
        <g className="wn" opacity="0">
          <rect x="300" y="140" width="70" height="40" rx="10" fill="rgba(255,215,0,0.06)" stroke="#ffd700" strokeWidth="1.5" filter="url(#g1)" />
          <text x="335" y="158" textAnchor="middle" fill="#ffd700" fontSize="7" fontFamily="monospace">🔧 Tools</text>
          <text x="335" y="170" textAnchor="middle" fill="rgba(255,215,0,0.4)" fontSize="6" fontFamily="monospace">execute</text>
        </g>

        {/* ── MONITOR NODE ── */}
        <g className="wn" opacity="0">
          <rect x="300" y="230" width="70" height="40" rx="10" fill="rgba(255,215,0,0.06)" stroke="#ffd700" strokeWidth="1.5" filter="url(#g1)" />
          <text x="335" y="248" textAnchor="middle" fill="#ffd700" fontSize="7" fontFamily="monospace">📊 Monitor</text>
          <text x="335" y="260" textAnchor="middle" fill="rgba(255,215,0,0.4)" fontSize="6" fontFamily="monospace">observe</text>
        </g>

        {/* ── DEPLOY / RESULT NODE ── */}
        <g className="wn" opacity="0">
          <rect x="420" y="175" width="70" height="40" rx="10" fill="rgba(255,215,0,0.08)" stroke="#ffd700" strokeWidth="2" filter="url(#g2)" />
          <text x="455" y="193" textAnchor="middle" fill="#ffd700" fontSize="7" fontFamily="monospace">🚀 Deploy</text>
          <text x="455" y="205" textAnchor="middle" fill="rgba(255,215,0,0.4)" fontSize="6" fontFamily="monospace">result</text>
        </g>

        {/* ── BÉZIER CONNECTIONS (n8n style) ── */}
        {/* Trigger → RAG */}
        <path className="wl" d="M100,185 C130,185 140,120 160,120" fill="none" stroke="#ffd700" strokeWidth="1.2" strokeDasharray="200" strokeDashoffset="200" opacity="0" filter="url(#g1)" />
        {/* Trigger → LLM */}
        <path className="wl" d="M100,195 C130,195 140,250 160,250" fill="none" stroke="#ffd700" strokeWidth="1.2" strokeDasharray="200" strokeDashoffset="200" opacity="0" filter="url(#g1)" />
        {/* RAG → Tools */}
        <path className="wl" d="M230,120 C265,120 275,160 300,160" fill="none" stroke="#ffd700" strokeWidth="1.2" strokeDasharray="200" strokeDashoffset="200" opacity="0" filter="url(#g1)" />
        {/* LLM → Tools */}
        <path className="wl" d="M230,245 C265,245 275,165 300,165" fill="none" stroke="#ffd700" strokeWidth="1.2" strokeDasharray="200" strokeDashoffset="200" opacity="0" filter="url(#g1)" />
        {/* LLM → Monitor */}
        <path className="wl" d="M230,255 C260,255 280,250 300,250" fill="none" stroke="#ffd700" strokeWidth="1.2" strokeDasharray="200" strokeDashoffset="200" opacity="0" filter="url(#g1)" />
        {/* RAG → LLM (feedback) */}
        <path className="wl" d="M190,140 C190,170 190,210 190,230" fill="none" stroke="rgba(255,215,0,0.4)" strokeWidth="0.8" strokeDasharray="200" strokeDashoffset="200" opacity="0" />
        {/* Tools → Deploy */}
        <path className="wl" d="M370,160 C395,160 410,185 420,190" fill="none" stroke="#ffd700" strokeWidth="1.2" strokeDasharray="200" strokeDashoffset="200" opacity="0" filter="url(#g1)" />
        {/* Monitor → Deploy */}
        <path className="wl" d="M370,250 C395,250 410,205 420,200" fill="none" stroke="#ffd700" strokeWidth="1.2" strokeDasharray="200" strokeDashoffset="200" opacity="0" filter="url(#g1)" />

        {/* ── DATA FLOW PULSES ── */}
        <circle className="wp" cx="130" cy="150" r="4" fill="#ffd700" filter="url(#g2)" opacity="0" />
        <circle className="wp" cx="130" cy="220" r="4" fill="#ffd700" filter="url(#g2)" opacity="0" />
        <circle className="wp" cx="265" cy="140" r="4" fill="#ffd700" filter="url(#g2)" opacity="0" />
        <circle className="wp" cx="265" cy="210" r="4" fill="#ffd700" filter="url(#g2)" opacity="0" />
        <circle className="wp" cx="395" cy="180" r="4" fill="#ffd700" filter="url(#g2)" opacity="0" />
        <circle className="wp" cx="395" cy="220" r="4" fill="#ffd700" filter="url(#g2)" opacity="0" />

        {/* ── SUCCESS CHECKMARKS on nodes ── */}
        <circle className="wcheck" cx="96" cy="174" r="6" fill="rgba(0,180,0,0.8)" opacity="0" />
        <text className="wcheck" x="96" y="177" textAnchor="middle" fill="white" fontSize="8" fontFamily="monospace" opacity="0">✓</text>

        <circle className="wcheck" cx="226" cy="104" r="6" fill="rgba(0,180,0,0.8)" opacity="0" />
        <text className="wcheck" x="226" y="107" textAnchor="middle" fill="white" fontSize="8" fontFamily="monospace" opacity="0">✓</text>

        <circle className="wcheck" cx="226" cy="234" r="6" fill="rgba(0,180,0,0.8)" opacity="0" />
        <text className="wcheck" x="226" y="237" textAnchor="middle" fill="white" fontSize="8" fontFamily="monospace" opacity="0">✓</text>

        <circle className="wcheck" cx="366" cy="144" r="6" fill="rgba(0,180,0,0.8)" opacity="0" />
        <text className="wcheck" x="366" y="147" textAnchor="middle" fill="white" fontSize="8" fontFamily="monospace" opacity="0">✓</text>

        <circle className="wcheck" cx="366" cy="234" r="6" fill="rgba(0,180,0,0.8)" opacity="0" />
        <text className="wcheck" x="366" y="237" textAnchor="middle" fill="white" fontSize="8" fontFamily="monospace" opacity="0">✓</text>

        <circle className="wcheck" cx="486" cy="179" r="6" fill="rgba(0,180,0,0.8)" opacity="0" />
        <text className="wcheck" x="486" y="182" textAnchor="middle" fill="white" fontSize="8" fontFamily="monospace" opacity="0">✓</text>

        {/* Exit line from deploy node → right edge */}
        <line id="exitLine3" x1="490" y1="195" x2="540" y2="195"
          stroke="#ffd700" strokeWidth="2.5" filter="url(#g2)"
          strokeDasharray="200" strokeDashoffset="200" />

        {/* Stage label */}
        <text x="250" y="30" textAnchor="middle" fill="rgba(255,215,0,0.15)" fontSize="8" fontFamily="monospace" letterSpacing="0.15em">AGENTIC WORKFLOW</text>
      </g>

      {/* ════════════════════════════════════
           STAGE 4: ROBOT — AI Agent Complete
         ════════════════════════════════════ */}
      <g id="robotStage">
        {/* Entry line from left */}
        <line id="entryLine3" x1="-20" y1="195" x2="170" y2="195"
          stroke="#ffd700" strokeWidth="2.5" filter="url(#g2)"
          strokeDasharray="200" strokeDashoffset="200" />

        {/* Stage label */}
        <text x="250" y="30" textAnchor="middle" fill="rgba(255,215,0,0.15)" fontSize="8" fontFamily="monospace" letterSpacing="0.15em">AI AGENT</text>

        <g id="robotBody">
          {/* ── HEAD ── */}
          <rect x="200" y="110" width="100" height="80" rx="18" fill="rgba(255,215,0,0.04)" stroke="#ffd700" strokeWidth="2" filter="url(#g2)" />

          {/* ── ANTENNA ── */}
          <g id="robotAntenna" opacity="0">
            <line x1="250" y1="110" x2="250" y2="85" stroke="#ffd700" strokeWidth="1.5" />
            <circle cx="250" cy="80" r="5" fill="rgba(255,215,0,0.15)" stroke="#ffd700" strokeWidth="1.5" filter="url(#g1)" />
            <circle cx="250" cy="80" r="2" fill="#ffd700" filter="url(#g2)">
              <animate attributeName="opacity" values="0.4;1;0.4" dur="1.2s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* ── EYES ── */}
          {/* Left eye */}
          <g id="eyeL" opacity="0">
            <circle cx="228" cy="145" r="8" fill="rgba(255,215,0,0.08)" stroke="#ffd700" strokeWidth="1.5" filter="url(#g1)" />
            <circle cx="228" cy="145" r="4" fill="#ffd700" filter="url(#g2)" />
          </g>
          {/* Right eye (with wink wrapper) */}
          <g id="eyeR" opacity="0">
            <g id="eyeRwink">
              <circle cx="272" cy="145" r="8" fill="rgba(255,215,0,0.08)" stroke="#ffd700" strokeWidth="1.5" filter="url(#g1)" />
              <circle cx="272" cy="145" r="4" fill="#ffd700" filter="url(#g2)" />
            </g>
          </g>

          {/* ── MOUTH (smile arc) ── */}
          <path id="robotMouth" d="M235,168 Q250,180 265,168" fill="none" stroke="#ffd700" strokeWidth="1.5" strokeLinecap="round" filter="url(#g1)" opacity="0" />

          {/* ── BODY ── */}
          <rect x="215" y="200" width="70" height="60" rx="10" fill="rgba(255,215,0,0.03)" stroke="#ffd700" strokeWidth="1.5" filter="url(#g1)" />
          {/* Chest indicator */}
          <circle cx="250" cy="225" r="8" fill="rgba(255,215,0,0.06)" stroke="#ffd700" strokeWidth="1" filter="url(#g1)" />
          <circle cx="250" cy="225" r="3" fill="#ffd700" filter="url(#g2)" opacity="0.5">
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.5s" repeatCount="indefinite" />
          </circle>

          {/* ── ARMS ── */}
          {/* Left arm */}
          <line x1="215" y1="215" x2="190" y2="235" stroke="#ffd700" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="187" cy="238" r="4" fill="rgba(255,215,0,0.06)" stroke="#ffd700" strokeWidth="1" />
          {/* Right arm */}
          <line x1="285" y1="215" x2="310" y2="235" stroke="#ffd700" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="313" cy="238" r="4" fill="rgba(255,215,0,0.06)" stroke="#ffd700" strokeWidth="1" />

          {/* ── LEGS ── */}
          <line x1="235" y1="260" x2="235" y2="285" stroke="#ffd700" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="265" y1="260" x2="265" y2="285" stroke="#ffd700" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="225" y="283" width="20" height="6" rx="3" fill="rgba(255,215,0,0.06)" stroke="#ffd700" strokeWidth="1" />
          <rect x="255" y="283" width="20" height="6" rx="3" fill="rgba(255,215,0,0.06)" stroke="#ffd700" strokeWidth="1" />
        </g>

        {/* ── POWER-ON RING ── */}
        <circle id="robotPowerRing" cx="250" cy="180" r="8" fill="none" stroke="#ffd700" strokeWidth="1.5" opacity="0" />

        {/* ── SPARKLE (top-right of robot) ── */}
        <g id="robotSparkle" opacity="0">
          {/* 4-point star */}
          <line x1="320" y1="100" x2="320" y2="120" stroke="#ffd700" strokeWidth="1.5" strokeLinecap="round" filter="url(#g1)" />
          <line x1="310" y1="110" x2="330" y2="110" stroke="#ffd700" strokeWidth="1.5" strokeLinecap="round" filter="url(#g1)" />
          <line x1="313" y1="103" x2="327" y2="117" stroke="#ffd700" strokeWidth="1" strokeLinecap="round" filter="url(#g1)" />
          <line x1="327" y1="103" x2="313" y2="117" stroke="#ffd700" strokeWidth="1" strokeLinecap="round" filter="url(#g1)" />
          {/* Smaller sparkle */}
          <line x1="340" y1="125" x2="340" y2="135" stroke="#ffd700" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          <line x1="335" y1="130" x2="345" y2="130" stroke="#ffd700" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
        </g>

        {/* ── SUCCESS CHECK ── */}
        <g id="robotCheckG" opacity="0">
          <circle cx="250" cy="330" r="14" fill="rgba(255,215,0,0.08)" stroke="#ffd700" strokeWidth="2" filter="url(#g2)" />
          <path d="M241,330 L247,336 L260,322" fill="none" stroke="#ffd700" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#g1)" />
          <text x="250" y="356" textAnchor="middle" fill="#ffd700" fontSize="9" fontFamily="monospace">task complete</text>
        </g>
      </g>
    </svg>
  );
};

// ─── HERO ───
const Hero = ({ data }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const containerRef = useRef(null);
  const phraseIndex = useRef(0);
  const charIndex = useRef(0);
  const isDeleting = useRef(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!isMounted) {return;}
    const tick = () => {
      const current = phrases[phraseIndex.current];
      if (!isDeleting.current) {
        charIndex.current++;
        setTypedText(current.slice(0, charIndex.current));
        if (charIndex.current === current.length) {
          timeoutRef.current = setTimeout(() => { isDeleting.current = true; tick(); }, 2000);
          return;
        }
        timeoutRef.current = setTimeout(tick, 60);
      } else {
        charIndex.current--;
        setTypedText(current.slice(0, charIndex.current));
        if (charIndex.current === 0) {
          isDeleting.current = false;
          phraseIndex.current = (phraseIndex.current + 1) % phrases.length;
          timeoutRef.current = setTimeout(tick, 400);
          return;
        }
        timeoutRef.current = setTimeout(tick, 30);
      }
    };
    const startDelay = setTimeout(tick, 800);
    return () => { clearTimeout(startDelay); if (timeoutRef.current) {clearTimeout(timeoutRef.current);} };
  }, [isMounted]);

  const handleMouseMove = useCallback(e => {
    if (!containerRef.current) {return;}
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);
  const handleMouseLeave = useCallback(() => setMousePos({ x: -1000, y: -1000 }), []);

  const { frontmatter, html } = data[0].node;
  const one = () => <StyledOverline style={{ transitionDelay: '100ms' }}>{frontmatter.title}</StyledOverline>;
  const two = () => <StyledTitle style={{ transitionDelay: '200ms' }}>{frontmatter.name}.</StyledTitle>;
  const three = () => <StyledSubtitle style={{ transitionDelay: '300ms' }}>{typedText}<StyledCursor>|</StyledCursor></StyledSubtitle>;
  const four = () => <StyledDescription style={{ transitionDelay: '400ms' }} dangerouslySetInnerHTML={{ __html: html }} />;
  const five = () => <div style={{ transitionDelay: '500ms' }}><StyledEmailLink href={`mailto:${email}`}>{frontmatter.buttonText}</StyledEmailLink></div>;
  const items = [one, two, three, four, five];

  return (
    <StyledContainer ref={containerRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <StyledSpotlight style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }} />
      <StyledLeftContent>
        <TransitionGroup component={null}>
          {isMounted && items.map((item, i) => (
            <CSSTransition key={i} classNames="fadeup" timeout={loaderDelay}>{item}</CSSTransition>
          ))}
        </TransitionGroup>
      </StyledLeftContent>
      <StyledRightContent>
        <WorkflowAnimation />
      </StyledRightContent>
    </StyledContainer>
  );
};

Hero.propTypes = { data: PropTypes.array.isRequired };
export default Hero;
