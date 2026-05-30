// const express = require("express");
// const cors = require("cors");
// const axios = require("axios");
// const Papa = require("papaparse");
// require("dotenv").config();

// const app = express();
// app.use(cors());

// const PORT = 5000;
// const SHEET_URL = process.env.SHEET_URL;

// app.get("/api/leaderboard", async (req, res) => {
//   try {
//     console.log("Fetching sheet...");

//     const response = await axios.get(SHEET_URL);

//     const rows = Papa.parse(response.data, {
//       skipEmptyLines: true
//     }).data;

//     let freshMap = {};
//     let repeatMap = {};

//     rows.slice(1).forEach((row) => {

//       const amount = Number(
//         String(row[4] || "").replace(/[^0-9.]/g, "")
//       ) || 0;

//       const type = String(row[27] || "").toLowerCase().trim();
//       const executive = String(row[28] || "").trim();

//       if (!executive) return;

//       const key = executive.toLowerCase();

//       const isFresh = type.includes("fresh") || type.includes("new");
//       const isRepeat = type.includes("repeat");

//       const target = isFresh ? freshMap : isRepeat ? repeatMap : null;
//       if (!target) return;

//       if (!target[key]) {
//         target[key] = {
//           name: executive,
//           cases: 0,
//           amount: 0
//         };
//       }

//       target[key].cases += 1;
//       target[key].amount += amount;
//     });

//     const fresh = Object.values(freshMap).sort((a,b)=>b.amount-a.amount);
//     const repeat = Object.values(repeatMap).sort((a,b)=>b.amount-a.amount);

//     res.json({ fresh, repeat });

//   } catch (err) {
//     console.log("ERROR:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// app.listen(PORT, () => {
//   console.log("Server running on", PORT);
// });



// const express = require("express");
// const cors = require("cors");
// const axios = require("axios");
// const Papa = require("papaparse");
// require("dotenv").config();

// const app = express();

// app.use(cors());

// const PORT = 5000;

// const SHEET_URL = process.env.SHEET_URL;

// app.get("/api/leaderboard", async (req, res) => {

//   try {

//     /*
//       MONTH FROM FRONTEND
//     */

//     const selectedMonth = String(
//       req.query.month || "all"
//     )
//       .trim()
//       .toLowerCase();

//     console.log(
//       "SELECTED MONTH =>",
//       selectedMonth
//     );

//     /*
//       FETCH SHEET
//     */

//     const response =
//       await axios.get(SHEET_URL);

//     /*
//       PARSE CSV
//     */

//     const rows = Papa.parse(
//       response.data,
//       {
//         skipEmptyLines: true
//       }
//     ).data;

//     /*
//       MAPS
//     */

//     let freshMap = {};
//     let repeatMap = {};

//     /*
//       LOOP
//     */

//     rows.slice(1).forEach((row) => {

//       /*
//         COLUMN INDEX

//         E  = Amount = 4
//         Q  = Month = 16
//         AB = Type = 27
//         AC = Executive = 28
//       */

//       /*
//         MONTH
//       */

//       const rowMonth = String(
//         row[16] || ""
//       )
//         .trim()
//         .toLowerCase();

//       /*
//         MONTH FILTER
//       */

//       if (selectedMonth !== "all") {
//         const normalizedSelectedMonth = selectedMonth
//           .replace(/['\s-]/g, "")
//           .toLowerCase();

//         const normalizedRowMonth = rowMonth
//           .replace(/['\s-]/g, "")
//           .toLowerCase();

//         if (!normalizedRowMonth.startsWith(normalizedSelectedMonth)) {
//           return;
//         }
//       }

//       /*
//         AMOUNT
//       */

//       const amount =
//         Number(
//           String(row[4] || "")
//             .replace(/[^0-9.]/g, "")
//         ) || 0;

//       const repayAmount =
//         Number(
//           String(row[13] || "")
//             .replace(/[^0-9.]/g, "")
//         ) || 0;

//       const receivedAmount =
//         Number(
//           String(row[21] || "")
//             .replace(/[^0-9.]/g, "")
//         ) || 0;

//       /*
//         TYPE
//       */

//       const type = String(
//         row[27] || ""
//       )
//         .trim()
//         .toLowerCase();

//       /*
//         EXECUTIVE
//       */

//       const executive = String(
//         row[28] || ""
//       ).trim();

//       if (!executive) return;

//       /*
//         SAME NAME MERGE
//       */

//       const key =
//         executive.toLowerCase();

//       /*
//         CHECK TYPE
//       */

//       const isFresh =
//         type.includes("fresh") ||
//         type.includes("new");

//       const isRepeat =
//         type.includes("repeat");

//       const target =
//         isFresh
//           ? freshMap
//           : isRepeat
//           ? repeatMap
//           : null;

//       if (!target) return;

//       /*
//         CREATE USER
//       */

//       if (!target[key]) {

//         target[key] = {
//           name: executive,
//           cases: 0,
//           amount: 0,
//           repayAmount: 0,
//           receivedAmount: 0
//         };

//       }

//       /*
//         ADD DATA
//       */

//       target[key].cases += 1;

//       target[key].amount += amount;
//       target[key].repayAmount += repayAmount;
//       target[key].receivedAmount += receivedAmount;

//     });

//     /*
//       SORT
//     */

//     const fresh = Object.values(
//       freshMap
//     )
//       .map((item) => ({
//         ...item,
//         receivePercent: item.repayAmount
//           ? Number(
//               (
//                 (item.receivedAmount /
//                   item.repayAmount) *
//                 100
//               ).toFixed(2)
//             )
//           : 0
//       }))
//       .sort(
//         (a, b) =>
//           b.amount - a.amount
//       );

//     const repeat = Object.values(
//       repeatMap
//     )
//       .map((item) => ({
//         ...item,
//         receivePercent: item.repayAmount
//           ? Number(
//               (
//                 (item.receivedAmount /
//                   item.repayAmount) *
//                 100
//               ).toFixed(2)
//             )
//           : 0
//       }))
//       .sort(
//         (a, b) =>
//           b.amount - a.amount
//       );

//     /*
//       RESPONSE
//     */

//     res.json({
//       fresh,
//       repeat
//     });

//   } catch (err) {

//     console.log(
//       "SERVER ERROR =>",
//       err.message
//     );

//     res.status(500).json({
//       error: err.message
//     });

//   }

// });

// app.listen(PORT, () => {

//   console.log(
//     `Server Running On ${PORT}`
//   );

// });



const express = require("express");
const cors = require("cors");
const axios = require("axios");
const Papa = require("papaparse");
require("dotenv").config();

const app = express();

app.use(cors());

const PORT = process.env.PORT || 5000;

const SHEET_URL = process.env.SHEET_URL;

app.get("/", (req, res) => {
  res.send("Leaderboard Backend Running");
});

app.get("/api/leaderboard", async (req, res) => {
  try {

    const selectedMonth = String(
      req.query.month || "all"
    )
      .trim()
      .toLowerCase();

    console.log("SELECTED MONTH =>", selectedMonth);

    const response = await axios.get(SHEET_URL);

    const rows = Papa.parse(response.data, {
      skipEmptyLines: true
    }).data;

    let freshMap = {};
    let repeatMap = {};

    rows.slice(1).forEach((row) => {

      const rowMonth = String(
        row[16] || ""
      )
        .trim()
        .toLowerCase();

      if (selectedMonth !== "all") {

        const selected = selectedMonth
          .replace(/['\s-]/g, "");

        const month = rowMonth
          .replace(/['\s-]/g, "");

        if (!month.startsWith(selected)) {
          return;
        }
      }

      const amount =
        Number(
          String(row[4] || "")
            .replace(/[^0-9.]/g, "")
        ) || 0;

      const repayAmount =
        Number(
          String(row[13] || "")
            .replace(/[^0-9.]/g, "")
        ) || 0;

      const receivedAmount =
        Number(
          String(row[21] || "")
            .replace(/[^0-9.]/g, "")
        ) || 0;

      const type = String(
        row[27] || ""
      )
        .trim()
        .toLowerCase();

      const executive = String(
        row[28] || ""
      ).trim();

      if (!executive) return;

      const key = executive.toLowerCase();

      const isFresh =
        type.includes("fresh") ||
        type.includes("new");

      const isRepeat =
        type.includes("repeat");

      const target =
        isFresh
          ? freshMap
          : isRepeat
          ? repeatMap
          : null;

      if (!target) return;

      if (!target[key]) {
        target[key] = {
          name: executive,
          cases: 0,
          amount: 0,
          repayAmount: 0,
          receivedAmount: 0
        };
      }

      target[key].cases += 1;
      target[key].amount += amount;
      target[key].repayAmount += repayAmount;
      target[key].receivedAmount += receivedAmount;
    });

    const fresh = Object.values(freshMap)
      .map((item) => ({
        ...item,
        receivePercent:
          item.repayAmount > 0
            ? Number(
                (
                  (item.receivedAmount /
                    item.repayAmount) *
                  100
                ).toFixed(2)
              )
            : 0
      }))
      .sort((a, b) => b.amount - a.amount);

    const repeat = Object.values(repeatMap)
      .map((item) => ({
        ...item,
        receivePercent:
          item.repayAmount > 0
            ? Number(
                (
                  (item.receivedAmount /
                    item.repayAmount) *
                  100
                ).toFixed(2)
              )
            : 0
      }))
      .sort((a, b) => b.amount - a.amount);

    res.json({
      fresh,
      repeat
    });

  } catch (err) {

    console.log("SERVER ERROR =>", err);

    res.status(500).json({
      error: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server Running On ${PORT}`);
});