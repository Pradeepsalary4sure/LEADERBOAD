



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
import axios from "axios";
import { useEffect, useState } from "react";

interface Data {
  name: string;
  cases: number;
  amount: number;
  repayAmount: number;
  receivedAmount: number;
  receivePercent: number;
}

function App() {

  const [fresh, setFresh] = useState<Data[]>([]);
  const [repeat, setRepeat] = useState<Data[]>([]);

  // MONTH FILTER
  const [month, setMonth] = useState("All");
useEffect(() => {

  axios
    .get(
      `https://leaderboad-backend.onrender.com/api/leaderboard?month=${month}`
    )
    .then((res) => {

      setFresh(res.data.fresh);
      setRepeat(res.data.repeat);

    })
    .catch((err) => {

      console.error("API Error:", err);

    });

}, [month]);
  // ==========================
  // TOP 3
  // ==========================

  const renderTop3 = (
    data: Data[],
    title: string,
    type: string
  ) => {

    const top3 = data.slice(0, 3);

    return (

      <div className={`top-box ${type}`}>

        <h2>{title}</h2>

        <div className="top-cards">

          {top3.map((item, i) => (

            <div
              key={i}
              className={`top-card ${
                i === 0
                  ? "gold"
                  : i === 1
                  ? "silver"
                  : "bronze"
              }`}
            >

              <div className="medal">
                {i === 0
                  ? "🥇"
                  : i === 1
                  ? "🥈"
                  : "🥉"}
              </div>

              <h3>{i + 1} PLACE</h3>

              <h4>{item.name}</h4>

              <p>
                ₹ {item.amount.toLocaleString()}
              </p>

              <span>
                {item.cases} Cases
              </span>

            </div>

          ))}

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

      <h1>🏆 LEADERBOARD</h1>

      <p>
        Fresh vs Repeat Performance
      </p>

      {/* MONTH FILTER */}
{/* MONTH FILTER */}

<div className="filter-box">

  <select
    className="month-select"
    value={month}
    onChange={(e)=>
      setMonth(e.target.value)
    }
  >

    <option value="All">
      All Months
    </option>

    <option value="Jan'26">
      Jan'26
    </option>

    <option value="Feb'26">
      Feb'26
    </option>

    <option value="Mar'26">
      Mar'26
    </option>

    <option value="Apr'26">
      Apr'26
    </option>

    <option value="May'26">
      May'26
    </option>

    <option value="Jun'26">
      Jun'26
    </option>

    <option value="Jul'26">
      Jul'26
    </option>

    <option value="Aug'26">
      Aug'26
    </option>

    <option value="Sep'26">
      Sep'26
    </option>

    <option value="Oct'26">
      Oct'26
    </option>

    <option value="Nov'26">
      Nov'26
    </option>

    <option value="Dec'26">
      Dec'26
    </option>

  </select>

</div>
      {/* TOP 3 */}

      <div className="top-section">

        {renderTop3(
          fresh,
          "FRESH TOP 3",
          "fresh"
        )}

        {renderTop3(
          repeat,
          "REPEAT TOP 3",
          "repeat"
        )}

      </div>

      {/* TABLE */}

      <div className="container">

        {renderTable(
          fresh,
          "FRESH PERFORMANCE",
          "fresh"
        )}

        {renderTable(
          repeat,
          "REPEAT PERFORMANCE",
          "repeat"
        )}

      </div>

    </div>

  );

}

export default App;