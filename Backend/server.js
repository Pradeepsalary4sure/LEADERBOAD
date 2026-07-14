//     // const express = require("express");
//     // const cors = require("cors");
//     // const axios = require("axios");
//     // const Papa = require("papaparse");
//     // require("dotenv").config();

//     // const app = express();

//     // app.use(cors());

//     // const PORT = process.env.PORT || 5000;

//     // const SHEET_URL = process.env.SHEET_URL;

//     // app.get("/", (req, res) => {
//     //   res.send("Leaderboard Backend Running");
//     // });

//     // app.get("/api/leaderboard", async (req, res) => {
//     //   try {

//     //     const selectedMonth = String(
//     //       req.query.month || "all"
//     //     )
//     //       .trim()
//     //       .toLowerCase();

//     //     console.log("SELECTED MONTH =>", selectedMonth);

//     //     const response = await axios.get(SHEET_URL);

//     //     const rows = Papa.parse(response.data, {
//     //       skipEmptyLines: true
//     //     }).data;

//     //     let freshMap = {};
//     //     let repeatMap = {};

//     //     rows.slice(1).forEach((row) => {

//     //       const rowMonth = String(
//     //         row[16] || ""
//     //       )
//     //         .trim()
//     //         .toLowerCase();

//     //       if (selectedMonth !== "all") {

//     //         const selected = selectedMonth
//     //           .replace(/['\s-]/g, "");

//     //         const month = rowMonth
//     //           .replace(/['\s-]/g, "");

//     //         if (!month.startsWith(selected)) {
//     //           return;
//     //         }
//     //       }

//     //       const amount =
//     //         Number(
//     //           String(row[4] || "")
//     //             .replace(/[^0-9.]/g, "")
//     //         ) || 0;

//     //       const repayAmount =
//     //         Number(
//     //           String(row[13] || "")
//     //             .replace(/[^0-9.]/g, "")
//     //         ) || 0;

//     //       const receivedAmount =
//     //         Number(
//     //           String(row[21] || "")
//     //             .replace(/[^0-9.]/g, "")
//     //         ) || 0;

//     //       const type = String(
//     //         row[27] || ""
//     //       )
//     //         .trim()
//     //         .toLowerCase();

//     //       const executive = String(
//     //         row[28] || ""
//     //       ).trim();

//     //       if (!executive) return;

//     //       const key = executive.toLowerCase();

//     //       const isFresh =
//     //         type.includes("fresh") ||
//     //         type.includes("new");

//     //       const isRepeat =
//     //         type.includes("repeat");

//     //       const target =
//     //         isFresh
//     //           ? freshMap
//     //           : isRepeat
//     //           ? repeatMap
//     //           : null;

//     //       if (!target) return;

//     //       if (!target[key]) {
//     //         target[key] = {
//     //           name: executive,
//     //           cases: 0,
//     //           amount: 0,
//     //           repayAmount: 0,
//     //           receivedAmount: 0
//     //         };
//     //       }

//     //       target[key].cases += 1;
//     //       target[key].amount += amount;
//     //       target[key].repayAmount += repayAmount;
//     //       target[key].receivedAmount += receivedAmount;
//     //     });

//     //     const fresh = Object.values(freshMap)
//     //       .map((item) => ({
//     //         ...item,
//     //         receivePercent:
//     //           item.repayAmount > 0
//     //             ? Number(
//     //                 (
//     //                   (item.receivedAmount /
//     //                     item.repayAmount) *
//     //                   100
//     //                 ).toFixed(2)
//     //               )
//     //             : 0
//     //       }))
//     //       .sort((a, b) => b.amount - a.amount);

//     //     const repeat = Object.values(repeatMap)
//     //       .map((item) => ({
//     //         ...item,
//     //         receivePercent:
//     //           item.repayAmount > 0
//     //             ? Number(
//     //                 (
//     //                   (item.receivedAmount /
//     //                     item.repayAmount) *
//     //                   100
//     //                 ).toFixed(2)
//     //               )
//     //             : 0
//     //       }))
//     //       .sort((a, b) => b.amount - a.amount);

//     //     res.json({
//     //       fresh,
//     //       repeat
//     //     });

//     //   } catch (err) {

//     //     console.log("SERVER ERROR =>", err);

//     //     res.status(500).json({
//     //       error: err.message
//     //     });
//     //   }
//     // });

//     // app.listen(PORT, () => {
//     //   console.log(`Server Running On ${PORT}`);
//     // });


//     const express = require("express");
// const cors = require("cors");
// const axios = require("axios");
// const Papa = require("papaparse");
// require("dotenv").config();

// const app = express();

// app.use(cors());

// const PORT = process.env.PORT || 5000;
// const SHEET_URL = process.env.SHEET_URL;

// function toDateKey(dateValue) {
//   if (dateValue == null || dateValue === "") return null;

//   const value = String(dateValue).trim().split("T")[0];

//   if (/^\d+(\.\d+)?$/.test(value)) {
//     const serial = Number(value);
//     const excelEpoch = Date.UTC(1899, 11, 30);
//     const date = new Date(excelEpoch + serial * 24 * 60 * 60 * 1000);
//     const year = date.getUTCFullYear();
//     const month = String(date.getUTCMonth() + 1).padStart(2, "0");
//     const day = String(date.getUTCDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   }

//   const parts = value.split(/[/-]/);
//   if (parts.length !== 3) return null;

//   const [first, second, third] = parts.map((part) => part.trim());
//   if ([first, second, third].some((part) => !/^\d+$/.test(part))) {
//     return null;
//   }

//   if (first.length === 4) {
//     return `${first}-${second.padStart(2, "0")}-${third.padStart(2, "0")}`;
//   }

//   return `${third}-${second.padStart(2, "0")}-${first.padStart(2, "0")}`;
// }

// function parseDateValue(dateValue) {
//   const key = toDateKey(dateValue);
//   if (!key) return null;

//   const [year, month, day] = key.split("-").map(Number);
//   return new Date(year, month - 1, day);
// }

// function normalizeDateRange(fromDate, toDate) {
//   const fromKey = toDateKey(fromDate);
//   const toKey = toDateKey(toDate);

//   let from = fromKey;
//   let to = toKey;

//   if (from && !to) {
//     to = from;
//   } else if (to && !from) {
//     from = to;
//   }

//   return { from, to };
// }

// function isDateInRange(caseKey, fromKey, toKey) {
//   if (!caseKey) return false;
//   if (fromKey && caseKey < fromKey) return false;
//   if (toKey && caseKey > toKey) return false;
//   return true;
// }

// app.get("/", (req, res) => {
//   res.send("Leaderboard Backend Running");
// });

// app.get("/api/leaderboard", async (req, res) => {
//   try {
//     const selectedMonth = String(
//     req.query.month || "all"
//     )
//       .trim()
//       .toLowerCase();

//     const parsedFrom = req.query.fromDate || null;
//     const parsedTo = req.query.toDate || null;
//     const { from: fromDateKey, to: toDateKey } = normalizeDateRange(
//       parsedFrom,
//       parsedTo
//     );
//     const hasDateFilter = Boolean(fromDateKey || toDateKey);

//     console.log("MONTH =>", selectedMonth);
//     console.log("FROM =>", fromDateKey || "all");
//     console.log("TO =>", toDateKey || "all");

//     const response = await axios.get(SHEET_URL);

//     const rows = Papa.parse(response.data, {
//       skipEmptyLines: true,
//     }).data;

//     const freshMap = {};
//     const repeatMap = {};
//     let matchedRows = 0;
//     let minSheetDate = null;
//     let maxSheetDate = null;

//     rows.slice(1).forEach((row) => {

//       // Column O = Disburse Date (sheet format: DD-MM-YYYY)
//       const caseDateKey = toDateKey(row[14]);

//       if (caseDateKey) {
//         if (!minSheetDate || caseDateKey < minSheetDate) {
//           minSheetDate = caseDateKey;
//         }
//         if (!maxSheetDate || caseDateKey > maxSheetDate) {
//           maxSheetDate = caseDateKey;
//         }
//       }

//       // Date Range Filter (day-level; single date = that day only)
//       if (hasDateFilter) {
//         if (!isDateInRange(caseDateKey, fromDateKey, toDateKey)) {
//           return;
//         }
//       }

//       const rowMonth = String(
//         row[16] || ""
//       )
//         .trim()
//         .toLowerCase();

//       // Month Filter (skipped when date filter is active)
//       if (!hasDateFilter && selectedMonth !== "all") {
//         const selected = selectedMonth.replace(
//           /['\s-]/g,
//           ""
//         );

//         const month = rowMonth.replace(
//           /['\s-]/g,
//           ""
//         );

//         if (!month.startsWith(selected)) {
//           return;
//         }
//       }

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

//       const type = String(
//         row[27] || ""
//       )
//         .trim()
//         .toLowerCase();

//       const executive = String(
//         row[28] || ""
//       ).trim();

//       if (!executive) return;

//       const key = executive.toLowerCase();

//       const isFresh =
//         type.includes("fresh") ||
//         type.includes("new");

//       const isRepeat =
//         type.includes("repeat");

//       const target = isFresh
//         ? freshMap
//         : isRepeat
//         ? repeatMap
//         : null;

//       if (!target) return;

//       matchedRows += 1;

//       if (!target[key]) {
//         target[key] = {
//           name: executive,
//           cases: 0,
//           amount: 0,
//           repayAmount: 0,
//           receivedAmount: 0,
//         };
//       }

//       target[key].cases += 1;
//       target[key].amount += amount;
//       target[key].repayAmount += repayAmount;
//       target[key].receivedAmount += receivedAmount;
//     });

//     const fresh = Object.values(freshMap)
//       .map((item) => ({
//         ...item,
//         receivePercent:
//           item.repayAmount > 0
//             ? Number(
//                 (
//                   (item.receivedAmount /
//                     item.repayAmount) *
//                   100
//                 ).toFixed(2)
//               )
//             : 0,

            
//       }))
//       .sort((a, b) => b.amount - a.amount);

//     const repeat = Object.values(repeatMap)
//       .map((item) => ({
//         ...item,
//         receivePercent:
//           item.repayAmount > 0
//             ? Number(
//                 (
//                   (item.receivedAmount /
//                     item.repayAmount) *
//                   100
//                 ).toFixed(2)
//               )
//             : 0,
//       }))
//       .sort((a, b) => b.amount - a.amount);

//     res.json({
//       fresh,
//       repeat,
//       meta: {
//         matchedRows,
//         fromDate: fromDateKey,
//         toDate: toDateKey,
//         sheetDateRange: {
//           min: minSheetDate,
//           max: maxSheetDate,
//         },
//       },
//     });

//   } catch (err) {
//     console.error("SERVER ERROR =>", err);

//     res.status(500).json({
//       error: err.message,
//     });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server Running On ${PORT}`);
// });




const express = require("express");
const cors = require("cors");
const axios = require("axios");
const Papa = require("papaparse");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const SHEET_URL = process.env.SHEET_URL;

/* ======================================
   DATE HELPERS
====================================== */

function formatDateKey(value) {
  if (!value) return null;

  value = String(value).trim();

  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  // Excel Serial Date
  if (/^\d+(\.\d+)?$/.test(value)) {
    const serial = Number(value);
    const excelEpoch = Date.UTC(1899, 11, 30);
    const date = new Date(excelEpoch + serial * 86400000);

    return (
      date.getUTCFullYear() +
      "-" +
      String(date.getUTCMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getUTCDate()).padStart(2, "0")
    );
  }

  // DD-MM-YYYY
  if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
    const [d, m, y] = value.split("-");
    return `${y}-${m}-${d}`;
  }

  // DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    const [d, m, y] = value.split("/");
    return `${y}-${m}-${d}`;
  }

  return null;
}

function normalizeRange(from, to) {
  let fromKey = formatDateKey(from);
  let toKey = formatDateKey(to);

  if (fromKey && !toKey) toKey = fromKey;
  if (!fromKey && toKey) fromKey = toKey;

  return {
    fromKey,
    toKey,
  };
}

function inRange(dateKey, fromKey, toKey) {
  if (!dateKey) return false;

  if (fromKey && dateKey < fromKey) return false;
  if (toKey && dateKey > toKey) return false;

  return true;
}

/* ======================================
   ROOT
====================================== */

app.get("/", (req, res) => {
  res.send("Leaderboard Backend Running");
});

/* ======================================
   API
====================================== */

app.get("/api/leaderboard", async (req, res) => {

  try {

    const selectedMonth = String(
      req.query.month || "all"
    )
      .trim()
      .toLowerCase();

    const { fromKey, toKey } = normalizeRange(
      req.query.fromDate,
      req.query.toDate
    );

    const hasDateFilter = Boolean(fromKey || toKey);

    console.log("MONTH :", selectedMonth);
    console.log("FROM :", fromKey || "ALL");
    console.log("TO :", toKey || "ALL");

    const response = await axios.get(SHEET_URL);

    const rows = Papa.parse(response.data, {
      skipEmptyLines: true
    }).data;

    const freshMap = {};
    const repeatMap = {};

    let matchedRows = 0;

    let minDate = null;
    let maxDate = null;

    rows.slice(1).forEach((row) => {

      const caseDate = formatDateKey(row[14]);

      if (caseDate) {

        if (!minDate || caseDate < minDate)
          minDate = caseDate;

        if (!maxDate || caseDate > maxDate)
          maxDate = caseDate;
      }

      // DATE FILTER

      if (hasDateFilter) {

        if (!inRange(caseDate, fromKey, toKey))
          return;

      }

      // MONTH FILTER

      const rowMonth = String(row[16] || "")
        .trim()
        .toLowerCase();

      if (!hasDateFilter && selectedMonth !== "all") {

        const m1 = selectedMonth.replace(/['\s-]/g, "");
        const m2 = rowMonth.replace(/['\s-]/g, "");

        if (!m2.startsWith(m1))
          return;
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

      const type =
        String(row[27] || "")
          .trim()
          .toLowerCase();

      const executive =
        String(row[28] || "")
          .trim();

      if (!executive)
        return;

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

      if (!target)
        return;

      matchedRows++;

      if (!target[key]) {

        target[key] = {

          name: executive,
          cases: 0,
          amount: 0,
          repayAmount: 0,
          receivedAmount: 0

        };

      }

      target[key].cases++;
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
                (item.receivedAmount / item.repayAmount) *
                100
              ).toFixed(2)
            )
          : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const repeat = Object.values(repeatMap)
    .map((item) => ({
      ...item,
      receivePercent:
        item.repayAmount > 0
          ? Number(
              (
                (item.receivedAmount / item.repayAmount) *
                100
              ).toFixed(2)
            )
          : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  console.log("Matched Rows :", matchedRows);

  res.json({
    success: true,

    filters: {
      month: selectedMonth,
      fromDate: fromKey,
      toDate: toKey,
    },

    sheetRange: {
      min: minDate,
      max: maxDate,
    },

    summary: {
      freshExecutives: fresh.length,
      repeatExecutives: repeat.length,
      matchedRows,
    },

    fresh,
    repeat,
  });

} catch (err) {

  console.error("SERVER ERROR =>", err);

  res.status(500).json({
    success: false,
    message: err.message,
  });

}

});

app.listen(PORT, () => {

console.log(`Server Running On ${PORT}`);

});