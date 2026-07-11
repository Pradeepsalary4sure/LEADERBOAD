import { useEffect, useState } from "react";
import "./Loader.css";
import { ShieldCheck } from "lucide-react";

const messages = [
  "Initializing Dashboard...",
  "Loading Leaderboard...",
  "Fetching Performance Data...",
  "Preparing Analytics...",
  "Almost Ready...",
  "Launching Experience..."
];

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const next = prev + 1;
        if (next % 18 === 0) {
          setMessageIndex((m) =>
            Math.min(m + 1, messages.length - 1)
          );
        }
        
        return next;
      });
    }, 35);
    return () => clearInterval(timer);
  }, []);

  const [particles] = useState(() =>
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 10}s`,
      animationDuration: `${8 + Math.random() * 8}s`,
    }))
  );
      
  return (
    <div className="loader-screen">
      {/* Aurora Background */}
      <div className="aurora aurora1"></div>
      <div className="aurora aurora2"></div>
      <div className="aurora aurora3"></div>

      {/* Background Blur */}
      <div className="background-blur"></div>

      {/* Animated Grid Background */}
      <div className="grid-background">
        <div className="grid-line horizontal"></div>
        <div className="grid-line horizontal"></div>
        <div className="grid-line horizontal"></div>
        <div className="grid-line vertical"></div>
        <div className="grid-line vertical"></div>
        <div className="grid-line vertical"></div>
      </div>

      {/* Floating Dots Animation */}
      <div className="floating-dots">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`dot-${i}`}
            className="float-dot"
            style={
              {
                "--delay": `${i * 0.15}s`,
                "--distance": `${50 + i * 20}px`,
                "--angle": `${(i / 6) * 360}deg`,
              } as React.CSSProperties
            } 
          />
        ))}
      </div>

      {/* Pulsing Orbs */}
      <div className="pulsing-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* Floating Particles */}
      <div className="particles">
        {particles.map((particle) => (
          <span
            key={particle.id}
            className={`particle particle-${particle.id % 3}`}
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.animationDelay,
              animationDuration: particle.animationDuration,
            }}
          />
        ))}
      </div>

      {/* Animated Background Waves */}
      <div className="wave-container">
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
      </div>

      {/* Radial Pulse */}
      <div className="radial-pulse"></div>

      {/* Middle Content - Behind Card */}
      <div className="loader-content">
        <div className="feature-grid">
          <div className="feature-item">
            <span className="feature-icon">📊</span>
            <div className="feature-label">Live Analytics</div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🏆</span>
            <div className="feature-label">Smart Rankings</div>
          </div>
          <div className="feature-item">
            <span className="feature-icon">⚡</span>
            <div className="feature-label">Real-time Data</div>
          </div>
        </div>
      </div>

      {/* Glass Card */}
      <div className="loader-card">
        {/* Dynamic Glow */}
        <div className="card-glow glow1"></div>
        <div className="card-glow glow2"></div>

        {/* Logo */}
        <div className="logo-circle">
          <div className="ring one"></div>
          <div className="ring two"></div>
          <div className="center-logo">
            <ShieldCheck size={42} />
          </div>
        </div>

        <h1>Minutes Loan</h1>
        <h2>Leaderboard Dashboard</h2>

        <div className="progress-number">
          {progress}%
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <div className="loading-message">
          {messages[messageIndex]}
        </div>
      </div>

      {/* Tagline Below Card */}
      <div className="loader-tagline">
        <div className="tagline-text">Smart Collections Platform</div>
        <div className="tagline-subtext">
          Real-time performance tracking and sanction management system
        </div>
      </div>
    </div>
  );
}
