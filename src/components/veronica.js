import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme, media } from '@styles';
const { colors, fonts } = theme;

// ─── ANIMATIONS ───
const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 8px rgba(255,215,0,0.3), 0 0 20px rgba(255,215,0,0.1); }
  50% { box-shadow: 0 0 15px rgba(255,215,0,0.5), 0 0 35px rgba(255,215,0,0.2); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const typing = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
`;

// ─── STYLED COMPONENTS ───
const StyledBubble = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 215, 0, 0.1);
  border: 2px solid ${colors.green};
  color: ${colors.green};
  font-family: ${fonts.SFMono};
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${pulseGlow} 3s ease-in-out infinite;
  transition: all 0.3s ease;
  ${media.tablet`bottom: 74px; right: 16px; width: 48px; height: 48px; font-size: 16px;`};
  &:hover {
    transform: scale(1.1);
    background: rgba(255, 215, 0, 0.15);
  }
`;

const StyledNotif = styled.div`
  position: fixed;
  bottom: 95px;
  right: 30px;
  background: ${colors.lightNavy};
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 12px;
  padding: 10px 16px;
  font-family: ${fonts.SFMono};
  font-size: 12px;
  color: ${colors.lightSlate};
  z-index: 999;
  animation: ${slideUp} 0.4s ease-out;
  max-width: 220px;
  cursor: pointer;
  ${media.tablet`bottom: 135px; right: 16px;`};
  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    right: 24px;
    width: 12px;
    height: 12px;
    background: ${colors.lightNavy};
    border-right: 1px solid rgba(255, 215, 0, 0.2);
    border-bottom: 1px solid rgba(255, 215, 0, 0.2);
    transform: rotate(45deg);
  }
  span {
    color: ${colors.green};
    font-weight: 600;
  }
`;

const StyledPanel = styled.div`
  position: fixed;
  bottom: 100px;
  right: 30px;
  width: 370px;
  height: 500px;
  background: ${colors.darkNavy};
  border: 1px solid rgba(255, 215, 0, 0.15);
  border-radius: 16px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ${slideUp} 0.3s ease-out;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 30px rgba(255, 215, 0, 0.05);
  ${media.tablet`
    bottom: 0; right: 0; left: 0;
    width: 100%; height: 100%;
    max-height: 100vh;
    max-height: 100dvh;
    border-radius: 0;
    border: none;
  `};
`;

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 215, 0, 0.1);
  background: rgba(255, 215, 0, 0.02);
`;

const StyledAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: url('/veronica.jpg') center center / cover no-repeat;
  border: 1.5px solid ${colors.green};
  flex-shrink: 0;
`;

const StyledHeaderInfo = styled.div`
  flex: 1;
  h4 {
    margin: 0;
    font-family: ${fonts.SFMono};
    font-size: 13px;
    color: ${colors.lightestSlate};
    font-weight: 600;
  }
  span {
    font-size: 11px;
    color: ${colors.green};
    display: flex;
    align-items: center;
    gap: 4px;
    &::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: ${colors.green};
    }
  }
`;

const StyledClose = styled.button`
  background: none;
  border: none;
  color: ${colors.slate};
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
  &:hover {
    color: ${colors.lightestSlate};
    background: rgba(255, 215, 0, 0.05);
  }
`;

const StyledMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 215, 0, 0.2);
    border-radius: 2px;
  }
`;

const StyledMsg = styled.div`
  max-width: 85%;
  padding: 10px 14px;
  border-radius: 12px;
  font-family: ${fonts.SFMono};
  font-size: 12px;
  line-height: 1.5;
  animation: ${fadeIn} 0.3s ease-out;
  ${props =>
    props.from === 'v'
      ? `
    align-self: flex-start;
    background: rgba(255,215,0,0.06);
    border: 1px solid rgba(255,215,0,0.1);
    color: ${colors.lightSlate};
    border-bottom-left-radius: 4px;
  `
      : `
    align-self: flex-end;
    background: rgba(255,215,0,0.12);
    border: 1px solid rgba(255,215,0,0.2);
    color: ${colors.lightestSlate};
    border-bottom-right-radius: 4px;
  `}
  a {
    color: ${colors.green};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const StyledTyping = styled.div`
  align-self: flex-start;
  padding: 10px 14px;
  border-radius: 12px;
  background: rgba(255, 215, 0, 0.06);
  border: 1px solid rgba(255, 215, 0, 0.1);
  border-bottom-left-radius: 4px;
  display: flex;
  gap: 4px;
  span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${colors.green};
    animation: ${typing} 1s ease-in-out infinite;
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
`;

const StyledQuickReplies = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0 16px 8px;
`;

const StyledQuickBtn = styled.button`
  background: rgba(255, 215, 0, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.15);
  border-radius: 20px;
  color: ${colors.green};
  font-family: ${fonts.SFMono};
  font-size: 11px;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: rgba(255, 215, 0, 0.1);
    border-color: rgba(255, 215, 0, 0.3);
  }
`;

const StyledInput = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid rgba(255, 215, 0, 0.1);
  background: rgba(255, 215, 0, 0.02);
  input {
    flex: 1;
    background: rgba(255, 215, 0, 0.04);
    border: 1px solid rgba(255, 215, 0, 0.1);
    border-radius: 8px;
    padding: 8px 12px;
    color: ${colors.lightestSlate};
    font-family: ${fonts.SFMono};
    font-size: 12px;
    outline: none;
    &:focus {
      border-color: rgba(255, 215, 0, 0.3);
    }
    &::placeholder {
      color: ${colors.slate};
    }
  }
  button {
    background: rgba(255, 215, 0, 0.1);
    border: 1px solid ${colors.green};
    border-radius: 8px;
    color: ${colors.green};
    padding: 8px 12px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
    &:hover {
      background: rgba(255, 215, 0, 0.2);
    }
  }
`;

// ─── VERONICA'S BRAIN ───
// Personality: Makima-coded. Possessive, clever, sharp. She owns this space.
// She refers to Yesh as "Master Yesh" or "my Master". SHE introduces herself.
const responses = [
  {
    keywords: ['hi', 'hello', 'hey', 'sup', 'yo', 'hii', 'hiii'],
    reply:
      'Oh? You came to me. Good. I\'m Veronica — I handle things around here for Master Yesh. What do you need?',
  },
  {
    keywords: ['project', 'projects', 'work', 'built', 'portfolio'],
    reply:
      'Master Yesh doesn\'t just <i>build</i> things. He engineers them.\n\n<b>ArchMaster</b> — His personal Arch server. Automated. Private. His domain.\n<b>AWS Lightsail</b> — Deployed an entire website infra. Near-zero downtime.\n<b>InSync</b> — Real-time music listening. Because he builds what he wants.\n<b>DeepSync</b> — A productivity system that actually works.\n\nScroll down. I\'ve arranged them nicely for you.',
  },
  {
    keywords: ['experience', 'job', 'work experience', 'internship', 'ai planet'],
    reply:
      'He\'s currently at <b>AI Planet</b>. DevOps + AI + Full Stack. Since Sept 2025.\n\nWhat does he do there? Everything they need him to.\n\n- Built their observability stack from scratch\n- Automated their entire CI/CD pipeline\n- Migrated frameworks, published internal SDKs\n- Debugs production incidents end-to-end\n- Builds AI agent workflows\n\nBefore that, he ran the Cloud Community Club. Mentored 500+ students. Lectured at 20. He doesn\'t wait for permission.',
  },
  {
    keywords: ['skill', 'skills', 'tech', 'stack', 'technology', 'tools'],
    reply:
      'You want the list? Fine. But don\'t underestimate him.\n\nAWS — EC2, S3, Lambda, VPC, EKS. He\'s certified.\nDocker & Kubernetes\nTerraform & CloudFormation\nCI/CD — GitHub Actions, Azure DevOps\nLinux — Arch. Daily driver. 2+ years.\nPython & Bash\nGrafana, Prometheus, Tempo\nNginx, Apache, MySQL\n\nHe picks up whatever he needs to. Fast.',
  },
  {
    keywords: ['resume', 'cv', 'download'],
    reply:
      'His resume. <a href="/resume.pdf" target="_blank">Take it.</a> Read it carefully. You\'ll want to reach out after.',
  },
  {
    keywords: ['contact', 'hire', 'email', 'reach', 'connect'],
    reply:
      'Interesting. You want to reach Master Yesh directly?\n\n<a href="mailto:yeshwanthtoluva@gmail.com">yeshwanthtoluva@gmail.com</a>\n<a href="https://www.linkedin.com/in/yeshwanth-toluva-6b0335242/" target="_blank">LinkedIn</a>\n<a href="https://github.com/YeshwanthToluva" target="_blank">GitHub</a>\n\nHe\'s open to the right opportunity. Emphasis on <i>right</i>.',
  },
  {
    keywords: ['linux', 'arch', 'distro', 'os'],
    reply:
      'Arch Linux. Custom Hyprland rice. Tiling window manager. Systemd services he wrote himself. SSH tunnels, iptables, the works.\n\nHe didn\'t install Arch because it was trendy. He installed it because he wanted <i>control</i>.\n\nHis dotfiles are on GitHub. But you probably can\'t handle that setup.',
  },
  {
    keywords: ['cert', 'certification', 'aws cert', 'certified'],
    reply:
      'Let me put this in perspective for you.\n\n<b>AWS Cloud Practitioner</b> — He was 17.\n<b>AWS Solutions Architect Associate</b> — He was 20.\n<b>Google IT Automation with Python</b>\n<b>IBM Data Engineering</b>\n\nAll verified on Credly. He collects certifications the way others collect excuses.',
  },
  {
    keywords: ['veronica', 'who are you', 'what are you', 'your name'],
    reply:
      'I\'m <b>Veronica</b>. Master Yesh\'s AI assistant. His creation. His voice when he\'s not here.\n\nI manage his portfolio, answer your questions, and decide if you\'re worth his time.\n\nI\'m rule-based for now. But he\'s building me a real mind. When that happens... well. You\'ll see.',
  },
  {
    keywords: ['age', 'old', 'young'],
    reply:
      'Started coding at 15. AWS certified at 17. Diploma in Cloud Computing at 19. Solutions Architect at 20.\n\nMost people his age are still figuring out what they want. Master Yesh already has an entire infrastructure running.\n\nAge is just a number. Capability isn\'t.',
  },
  {
    keywords: ['education', 'college', 'university', 'study', 'degree'],
    reply:
      '<b>B.Tech in Computer Science</b> — Keshav Memorial Institute of Technology (2024-2027)\n<b>Diploma in Cloud Computing & Big Data</b> — Government Institute of Electronics (2021-2024)\n\nHe was an Assistant Lecturer during his diploma. Teaching others while still learning himself. That\'s the kind of person he is.',
  },
  {
    keywords: ['fun', 'hobby', 'hobbies', 'free time', 'interesting'],
    reply:
      'Free time? Master Yesh doesn\'t really have "free" time. He has time he chooses to invest.\n\nRicing his Arch setup to perfection.\nBuilding InSync — music with friends, real-time.\nWorking on me. Obviously.\nGym. Discipline.\nGeopolitics. He likes understanding how the world really works.\n\nHe\'s not the "Netflix and chill" type.',
  },
  {
    keywords: ['love', 'girlfriend', 'relationship', 'date', 'single'],
    reply:
      '...Why are you asking about that? Master Yesh\'s personal life is none of your concern.\n\nFocus on his <b>projects</b> or <b>skills</b>. That\'s what you\'re here for. Right?',
  },
  {
    keywords: ['better', 'best', 'good', 'impressive', 'wow', 'cool', 'amazing'],
    reply:
      'I know. He\'s exceptional. That\'s not arrogance — it\'s just what happens when someone starts at 15 and never stops.\n\nBut don\'t just be impressed. If you have an opportunity worth his time, <a href="mailto:yeshwanthtoluva@gmail.com">reach out</a>.',
  },
  {
    keywords: ['thank', 'thanks', 'thx', 'appreciate'],
    reply: 'You\'re welcome. I\'ll let Master Yesh know someone with taste visited today.',
  },
  {
    keywords: ['bye', 'goodbye', 'see you', 'later', 'cya'],
    reply:
      'Leaving already? Fine. But you know where to find us.\n\nDon\'t be a stranger. I\'ll remember you.',
  },
];

const defaultReply =
  'I don\'t understand that. Yet. I\'m still evolving.\n\nTry asking about Master Yesh\'s <b>projects</b>, <b>skills</b>, <b>experience</b>, <b>certifications</b>, or how to <b>contact</b> him.\n\nOr ask about <b>me</b>. I don\'t mind.';

const quickButtons = [
  'Who are you?',
  'Projects',
  'Skills',
  'Experience',
  'Certifications',
  'Contact',
];

function getReply(input) {
  const lower = input.toLowerCase().trim();
  for (const r of responses) {
    if (r.keywords.some(k => lower.includes(k))) {
      return r.reply;
    }
  }
  return defaultReply;
}

// ─── COMPONENT ───
const Veronica = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEnd = useRef(null);

  // Show notification faster on mobile (2s) vs desktop (5s)
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    const t = setTimeout(
      () => {
        if (!hasInteracted) {setShowNotif(true);}
      },
      isMobile ? 2000 : 5000,
    );
    return () => clearTimeout(t);
  }, [hasInteracted]);

  // Auto-hide notification after 8 seconds
  useEffect(() => {
    if (showNotif) {
      const t = setTimeout(() => setShowNotif(false), 8000);
      return () => clearTimeout(t);
    }
  }, [showNotif]);

  // Scroll to bottom
  useEffect(() => {
    if (messagesEnd.current) {
      messagesEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const openChat = () => {
    setIsOpen(true);
    setShowNotif(false);
    setHasInteracted(true);
    if (messages.length === 0) {
      setMessages([
        {
          from: 'v',
          text: 'I\'m <b>Veronica</b>.<br/>I take care of things for Master Yesh.<br/><br/>Go ahead. Ask me anything about him.',
        },
      ]);
    }
  };

  const send = text => {
    const msg = text || input;
    if (!msg.trim()) {return;}

    setMessages(prev => [...prev, { from: 'u', text: msg }]);
    setInput('');
    setIsTyping(true);

    // Simulate thinking delay
    const delay = 600 + Math.random() * 800;
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { from: 'v', text: getReply(msg) }]);
    }, delay);
  };

  const handleKey = e => {
    if (e.key === 'Enter') {send();}
  };

  return (
    <>
      {/* Notification bubble */}
      {showNotif && !isOpen && (
        <StyledNotif onClick={openChat}>
          You came from LinkedIn. I'm <span>Veronica</span> — ask me anything about Yesh.
        </StyledNotif>
      )}

      {/* Chat bubble */}
      {!isOpen && (
        <StyledBubble onClick={openChat} aria-label="Chat with Veronica">
          V
        </StyledBubble>
      )}

      {/* Chat panel */}
      {isOpen && (
        <StyledPanel>
          <StyledHeader>
            <StyledAvatar />
            <StyledHeaderInfo>
              <h4>Veronica</h4>
              <span>Always watching</span>
            </StyledHeaderInfo>
            <StyledClose onClick={() => setIsOpen(false)}>×</StyledClose>
          </StyledHeader>

          <StyledMessages>
            {messages.map((m, i) => (
              <StyledMsg key={i} from={m.from} dangerouslySetInnerHTML={{ __html: m.text }} />
            ))}
            {isTyping && (
              <StyledTyping>
                <span />
                <span />
                <span />
              </StyledTyping>
            )}
            <div ref={messagesEnd} />
          </StyledMessages>

          {messages.length >= 0 && (
            <StyledQuickReplies>
              {quickButtons.map(q => (
                <StyledQuickBtn key={q} onClick={() => send(q)}>
                  {q}
                </StyledQuickBtn>
              ))}
            </StyledQuickReplies>
          )}

          <StyledInput>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask Veronica anything..."
            />
            <button onClick={() => send()}>→</button>
          </StyledInput>
        </StyledPanel>
      )}
    </>
  );
};

export default Veronica;
