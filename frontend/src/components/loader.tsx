import { useEffect, useState } from "react";
import "./Loader.css";

const messages = [
  "Connecting to Server...",
  "Fetching Fresh Collection...",
  "Fetching Repeat Collection...",
  "Calculating Rankings...",
  "Preparing Dashboard...",
  "Almost Ready..."
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
        return prev + 1;
      });
    }, 35);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const msg = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 1200);

    return () => clearInterval(msg);
  }, []);

  return (
    <div className="loader-screen">

      <div className="background-blur"></div>

      <div className="particles">
        {[...Array(40)].map((_, i) => (
          <span key={i}></span>
        ))}
      </div>

      <div className="loader-card">

        <div className="logo-circle">

          <div className="ring one"></div>
          <div className="ring two"></div>

          <div className="center-logo">
            💰
          </div>

        </div>

        <h1>Minutes Loan</h1>

        <h2>Sanction Leaderboard</h2>

        <div className="progress-number">

          {progress}%

        </div>

        <div className="progress-bar">

          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />

        </div>

        <div className="loading-message">

          {messages[messageIndex]}

        </div>

      </div>

    </div>
  );
}