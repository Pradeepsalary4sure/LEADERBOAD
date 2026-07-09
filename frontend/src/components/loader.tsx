// import { useEffect, useState } from "react";
// import "./loader.css";

// const messages = [
//   "Connecting to Server...",
//   "Fetching Fresh Collection...",
//   "Fetching Repeat Collection...",
//   "Calculating Rankings...",
//   "Preparing Dashboard...",
//   "Almost Ready..."
// ];

// export default function Loader() {
//   const [progress, setProgress] = useState(0);
//   const [messageIndex, setMessageIndex] = useState(0);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setProgress((prev) => {
//         if (prev >= 100) {
//           clearInterval(timer);
//           return 100;
//         }
//         return prev + 1;
//       });
//     }, 35);

//     return () => clearInterval(timer);
//   }, []);

//   useEffect(() => {
//     const msg = setInterval(() => {
//       setMessageIndex((prev) => (prev + 1) % messages.length);
//     }, 1200);

//     return () => clearInterval(msg);
//   }, []);

//   return (
//     <div className="loader-screen">

//       <div className="background-blur"></div>

//       <div className="particles">
//         {[...Array(40)].map((_, i) => (
//           <span key={i}></span>
//         ))}
//       </div>

//       <div className="loader-card">

//         <div className="logo-circle">

//           <div className="ring one"></div>
//           <div className="ring two"></div>

//           <div className="center-logo">
//             💰
//           </div>

//         </div>

//         <h1>Minutes Loan</h1>

//         <h2>Sanction Leaderboard</h2>

//         <div className="progress-number">

//           {progress}%

//         </div>

//         <div className="progress-bar">

//           <div
//             className="progress-fill"
//             style={{ width: `${progress}%` }}
//           />

//         </div>

//         <div className="loading-message">

//           {messages[messageIndex]}

//         </div>

//       </div>

//     </div>
//   );
// }



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

  return (
    <div className="loader-screen">

      {/* Aurora Background */}
      <div className="aurora aurora1"></div>
      <div className="aurora aurora2"></div>
      <div className="aurora aurora3"></div>

      {/* Background Blur */}
      <div className="background-blur"></div>

      {/* Floating Particles */}
      <div className="particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 8}s`,
            }}
          />
        ))}
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

    </div>
  );
}