



// import "./App.css";
// import axios from "axios";
// import { useEffect, useState } from "react";

// interface Data {
//   name: string;
//   cases: number;
//   amount: number;
// }

// function App() {
//   const [fresh, setFresh] = useState<Data[]>([]);
//   const [repeat, setRepeat] = useState<Data[]>([]);

//   useEffect(() => {
//     axios.get("http://localhost:5000/api/leaderboard")
//       .then((res) => {
//         setFresh(res.data.fresh);
//         setRepeat(res.data.repeat);
//       });
//   }, []);

//   const renderTop3 = (
//     data: Data[],
//     title: string,
//     type: string
//   ) => {
//     const top3 = data.slice(0, 3);

//     return (
//       <div className={`top-box ${type}`}>
//         <h2>{title}</h2>

//         <div className="top-cards">
//           {top3.map((item, i) => (
//             <div
//               key={i}
//               className={`top-card ${
//                 i === 0
//                   ? "gold"
//                   : i === 1
//                   ? "silver"
//                   : "bronze"
//               }`}
//             >
//               <div className="medal">
//                 {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
//               </div>

//               <h3>{i + 1} PLACE</h3>
//               <h4>{item.name}</h4>
//               <p>₹ {item.amount.toLocaleString()}</p>
//               <span>{item.cases} Cases</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   const renderTable = (
//     data: Data[],
//     title: string,
//     type: string
//   ) => (
//     <div className={`card ${type}`}>
//       <h2>{title}</h2>

//       <table>
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>Executive Name</th>
//             <th>No of Cases</th>
//             <th>Amount</th>
//           </tr>
//         </thead>

//         <tbody>
//           {data.map((item, i) => (
//             <tr key={i}>
//               <td>
//                 {i === 0
//                   ? "🥇"
//                   : i === 1
//                   ? "🥈"
//                   : i === 2
//                   ? "🥉"
//                   : i + 1}
//               </td>

//               <td>{item.name}</td>
//               <td>{item.cases}</td>
//               <td>
//                 ₹ {item.amount.toLocaleString()}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );

//   return (
//     <div className="app">
//       <h1>🏆 LEADERBOARD</h1>
//       <p>Fresh vs Repeat Performance</p>

//       <div className="top-section">
//         {renderTop3(fresh, "FRESH TOP 3", "fresh")}
//         {renderTop3(repeat, "REPEAT TOP 3", "repeat")}
//       </div>

//       <div className="container">
//         {renderTable(
//           fresh,
//           "FRESH PERFORMANCE",
//           "fresh"
//         )}

//         {renderTable(
//           repeat,
//           "REPEAT PERFORMANCE",
//           "repeat"
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;





import "./App.css";
import heroImage from "./assets/image.png";
import bankLogo from "./assets/logo.png";
import axios from "axios";
import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:5000"
  : "https://leaderboad-backend.onrender.com";

const MIN_DISBURSE_DATE = "2025-10-25";
const MAX_DISBURSE_DATE = "2026-05-23";

interface Data {
  name: string;
  cases: number;
  amount: number;
  repayAmount: number;
  receivedAmount: number;
  receivePercent: number;
  date?: string;
}

function App() {

  const [fresh, setFresh] = useState<Data[]>([]);
  const [repeat, setRepeat] = useState<Data[]>([]);
  const [month, setMonth] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [appliedFrom, setAppliedFrom] = useState("");
  const [appliedTo, setAppliedTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // const fetchLeaderboard = () => {
  //   setLoading(true);

  //   const query = new URLSearchParams();
  //   if (month !== "All") query.set("month", month);

  //   axios
  //     .get(
  //       `https://leaderboad-backend.onrender.com/api/leaderboard?${query.toString()}`
  //     )
  //     .then((res) => {
  //       setFresh(res.data.fresh);
  //       setRepeat(res.data.repeat);
  //       setLastUpdated(new Date());
  //     })
  //     .catch((err) => {
  //       console.error("API Error:", err);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // };


const fetchLeaderboard = () => {
  setLoading(true);

  const query = new URLSearchParams();

  if (month !== "All") {
    query.set("month", month);
  }

  if (appliedFrom) {
    query.set("fromDate", appliedFrom);
  }

  if (appliedTo) {
    query.set("toDate", appliedTo);
  }

  axios
    .get(
      `${API_BASE_URL}/api/leaderboard?${query.toString()}`
    )
    .then((res) => {
      setFresh(res.data.fresh);
      setRepeat(res.data.repeat);
      setLastUpdated(new Date());
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setLoading(false);
    });
};



  // useEffect(() => {
  //   fetchLeaderboard();
  // }, [month]);


  useEffect(() => {
  fetchLeaderboard();
}, [month, appliedFrom, appliedTo]);

  // const applyDateRange = () => {
  //   setAppliedFrom(dateFrom);
  //   setAppliedTo(dateTo);
  // };

const applyDateRange = () => {
  setAppliedFrom(dateFrom);
  setAppliedTo(dateTo);
  setMonth("All");
};

  // const filterLeaderboard = (data: Data[]) =>
  //   data.filter((item) => {
  //     const matchesName = item.name
  //       .toLowerCase()
  //       .includes(searchTerm.toLowerCase());

  //     const itemDate = item.date ? new Date(item.date) : null;
  //     const fromDate = appliedFrom ? new Date(appliedFrom) : null;
  //     const toDate = appliedTo ? new Date(appliedTo) : null;

  //     const matchesDate =
  //       (!fromDate || (itemDate && itemDate >= fromDate)) &&
  //       (!toDate || (itemDate && itemDate <= toDate));

  //     return matchesName && matchesDate;
  //   });

  // const filteredFresh = filterLeaderboard(fresh);
  // const filteredRepeat = filterLeaderboard(repeat);
  // const showFresh = viewMode === "All" || viewMode === "Fresh";
  // const showRepeat = viewMode === "All" || viewMode === "Repeat";


const filteredFresh = fresh.filter((item) =>
  item.name.toLowerCase().includes(searchTerm.toLowerCase())
);

const filteredRepeat = repeat.filter((item) =>
  item.name.toLowerCase().includes(searchTerm.toLowerCase())
);

const showFresh =
  viewMode === "All" ||
  viewMode === "Fresh";

const showRepeat =
  viewMode === "All" ||
  viewMode === "Repeat";




  // ==========================
  // TOP 3
  // ==========================

  const renderTop3 = (
    data: Data[],
    title: string,
    type: string
  ) => {

    const top3 = data.slice(0, 3);
    const renderOrder = [1, 0, 2].filter((index) => index < top3.length);

    return (

      <div className={`top-box ${type}`}>

        <h2>{title}</h2>

        <div className="top-cards">

          {renderOrder.map((originalIndex) => {
            const item = top3[originalIndex];
            return (
              <div
                key={originalIndex}
                className={`top-card ${
                  originalIndex === 0
                    ? "gold"
                    : originalIndex === 1
                    ? "silver"
                    : "bronze"
                }`}
              >

                <div className="medal">
                  {originalIndex === 0
                    ? "🥇"
                    : originalIndex === 1
                    ? "🥈"
                    : "🥉"}
                </div>

                <h3>{originalIndex + 1} PLACE</h3>

                <h4>{item.name}</h4>

                <p>
                  ₹ {item.amount.toLocaleString()}
                </p>

                <span>
                  {item.cases} Cases
                </span>

              </div>
            );
          })}

        </div>

      </div>

    );

  };

  // ==========================
  // TABLE
  // ==========================

  const renderTable = (
    data: Data[],
    title: string,
    type: string
  ) => (

    <div className={`card ${type}`}>

      <h2>{title}</h2>

      <div className="table-panel">

        <div className="table-wrapper">

        <table>

          <thead>

            <tr>

              <th>#</th>

              <th>Executive Name</th>

              <th>No of Cases</th>

              <th>Total Section Amount</th>

              <th>Total Repay Amt</th>

              <th>Total Received Amt</th>

              <th>% Received</th>

            </tr>

          </thead>

          <tbody>

            {data.map((item, i) => (

              <tr key={i}>

                <td>
                  {i === 0
                    ? "🥇"
                    : i === 1
                    ? "🥈"
                    : i === 2
                    ? "🥉"
                    : i + 1}
                </td>

                <td>{item.name}</td>

                <td>{item.cases}</td>

                <td>
                  ₹ {item.amount.toLocaleString()}
                </td>

                <td>
                  ₹ {item.repayAmount.toLocaleString()}
                </td>

                <td>
                  ₹ {item.receivedAmount.toLocaleString()}
                </td>

                <td>
                  {item.receivePercent.toFixed(2)}%
                </td>

              </tr>

            ))}

          </tbody>

        </table>

        </div>

      </div>

    </div>

  );

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo-block">
          <div className="logo-mark">
            <img src={bankLogo} alt="Bank logo" />
          </div>
          <div className="logo-copy">
            <strong>Minutes Loan</strong>
            <span>Smart Collections Dashboard</span>
          </div>
        </div>

        <div className="header-actions">
          <button
            className="refresh-button"
            onClick={fetchLeaderboard}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
          {lastUpdated && (
            <div className="updated-info">
              Last refreshed: {lastUpdated.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          )}
        </div>
      </header>

      <section className="dashboard-banner">
        <img src={heroImage} alt="Dashboard" className="dashboard-image" />
        <div className="dashboard-title">
          <h1>Sanction Leaderboard Dashboard</h1>
          <p>Centered high-value ranking view with fresh and repeat performance.</p>
        </div>
      </section>

      <div className="split-layout">
        <aside className="side-panel">
          <div className="filter-box">
            <h3>Custom Filters</h3>
            <label>
              Month
              <select
                className="month-select"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                <option value="All">All Months</option>
                <option value="Oct'25">Oct'25</option>
                <option value="Nov'25">Nov'25</option>
                <option value="Dec'25">Dec'25</option>
                <option value="Jan'26">Jan'26</option>
                <option value="Feb'26">Feb'26</option>
                <option value="Mar'26">Mar'26</option>
                <option value="Apr'26">Apr'26</option>
                <option value="May'26">May'26</option>
                <option value="Jun'26">Jun'26</option>
                <option value="Jul'26">Jul'26</option>
                <option value="Aug'26">Aug'26</option>
                <option value="Sep'26">Sep'26</option>
                <option value="Oct'26">Oct'26</option>
                <option value="Nov'26">Nov'26</option>
                <option value="Dec'26">Dec'26</option>
              </select>
            </label>

            <label>
              Executive Name
              <input
                className="search-input"
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </label>

            <label>
              Date Range
              <div className="date-row">
                <input
                  className="date-input"
                  type="date"
                  min={MIN_DISBURSE_DATE}
                  max={MAX_DISBURSE_DATE}
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
                <span className="date-separator">to</span>
                <input
                  className="date-input"
                  type="date"
                  min={dateFrom || MIN_DISBURSE_DATE}
                  max={MAX_DISBURSE_DATE}
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="apply-button"
                onClick={applyDateRange}
              >
                Apply
              </button>
            </label>

            <label>
              Board View
              <select
                className="month-select"
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
              >
                <option value="All">Show All</option>
                <option value="Fresh">Fresh Only</option>
                <option value="Repeat">Repeat Only</option>
              </select>
            </label>
          </div>

          {/* <div className="side-note">
            <h4>Tip</h4>
            <p>Use custom filters to narrow the leaderboard by month, name, or board type.</p>
          </div> */}
        </aside>

        <main className="main-panel">
          <div className="top-section">
            {showFresh && renderTop3(filteredFresh, "FRESH TOP 3", "fresh")}
            {showRepeat && renderTop3(filteredRepeat, "REPEAT TOP 3", "repeat")}
          </div>

          <div className="container">
            {showFresh && renderTable(filteredFresh, "🔥 Fresh Performance", "fresh")}
            {showRepeat && renderTable(filteredRepeat, "♻️ Repeat Performance", "repeat")}
          </div>
        </main>
      </div>
    </div>
  );

}

export default App;
