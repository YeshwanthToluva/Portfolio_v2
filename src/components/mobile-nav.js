import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme, media } from '@styles';
const { colors, fonts } = theme;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const dotPop = keyframes`
  0% { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.4); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
`;

const StyledBar = styled.nav`
  display: none;
  ${media.tablet`
    display: flex;
    align-items: center;
    justify-content: space-around;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: rgba(10, 10, 10, 0.88);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-top: 1px solid rgba(255, 215, 0, 0.08);
    z-index: 10;
    padding: 0 8px;
    animation: ${fadeUp} 0.5s ease both;
    animation-delay: 200ms;
  `};
`;

const StyledItem = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 6px 4px;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
  flex: 1;
  min-height: 48px;
  -webkit-tap-highlight-color: transparent;
  color: rgba(255, 255, 255, 0.32);
  &.is-active {
    color: ${colors.green};
  }
  &:hover {
    color: rgba(255, 215, 0, 0.65);
    background: rgba(255, 215, 0, 0.04);
  }
  &:active {
    transform: scale(0.9);
  }
`;

const StyledIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const StyledDot = styled.span`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${colors.green};
  animation: ${dotPop} 0.3s ease forwards;
`;

const StyledLabel = styled.span`
  font-family: ${fonts.SFMono};
  font-size: 9px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  line-height: 1;
`;

const navItems = [
  {
    id: 'about',
    label: 'About',
    hash: '/#about',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
  {
    id: 'jobs',
    label: 'Work',
    hash: '/#jobs',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="10" y1="14" x2="14" y2="14" />
      </svg>
    ),
  },
  {
    id: 'projects',
    label: 'Projects',
    hash: '/#projects',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="12" y1="2" x2="12" y2="22" />
      </svg>
    ),
  },
  {
    id: 'certifications',
    label: 'Certs',
    hash: '/#certifications',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
      </svg>
    ),
  },
  {
    id: 'contact',
    label: 'Contact',
    hash: '/#contact',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
];

const MobileNav = () => {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {return;}

    const observers = [];
    const sectionIds = navItems.map(n => n.id);

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) {return;}
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {setActiveSection(id);}
        },
        { rootMargin: '-35% 0px -35% 0px', threshold: 0 },
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <StyledBar aria-label="Section navigation">
      {navItems.map(({ id, label, hash, icon }) => {
        const isActive = activeSection === id;
        return (
          <StyledItem key={id} href={hash} className={isActive ? 'is-active' : ''}>
            <StyledIcon>
              {icon}
              {isActive && <StyledDot />}
            </StyledIcon>
            <StyledLabel>{label}</StyledLabel>
          </StyledItem>
        );
      })}
    </StyledBar>
  );
};

export default MobileNav;
