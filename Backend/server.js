    // const express = require("express");
    // const cors = require("cors");
    // const axios = require("axios");
    // const Papa = require("papaparse");
    // require("dotenv").config();

    // const app = express();

    // app.use(cors());

    // const PORT = process.env.PORT || 5000;

    // const SHEET_URL = process.env.SHEET_URL;

    // app.get("/", (req, res) => {
    //   res.send("Leaderboard Backend Running");
    // });

    // app.get("/api/leaderboard", async (req, res) => {
    //   try {

    //     const selectedMonth = String(
    //       req.query.month || "all"
    //     )
    //       .trim()
    //       .toLowerCase();

    //     console.log("SELECTED MONTH =>", selectedMonth);

    //     const response = await axios.get(SHEET_URL);

    //     const rows = Papa.parse(response.data, {
    //       skipEmptyLines: true
    //     }).data;

    //     let freshMap = {};
    //     let repeatMap = {};

    //     rows.slice(1).forEach((row) => {

    //       const rowMonth = String(
    //         row[16] || ""
    //       )
    //         .trim()
    //         .toLowerCase();

    //       if (selectedMonth !== "all") {

    //         const selected = selectedMonth
    //           .replace(/['\s-]/g, "");

    //         const month = rowMonth
    //           .replace(/['\s-]/g, "");

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

    //       const target =
    //         isFresh
    //           ? freshMap
    //           : isRepeat
    //           ? repeatMap
    //           : null;

    //       if (!target) return;

    //       if (!target[key]) {
    //         target[key] = {
    //           name: executive,
    //           cases: 0,
    //           amount: 0,
    //           repayAmount: 0,
    //           receivedAmount: 0
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
    //             : 0
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
    //             : 0
    //       }))
    //       .sort((a, b) => b.amount - a.amount);

    //     res.json({
    //       fresh,
    //       repeat
    //     });

    //   } catch (err) {

    //     console.log("SERVER ERROR =>", err);

    //     res.status(500).json({
    //       error: err.message
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

const PORT = process.env.PORT || 5000;
const SHEET_URL = process.env.SHEET_URL;

function parseDateValue(dateValue) {
  if (!dateValue) return null;

  const value = String(dateValue).trim();

  if (/^\d+(\.\d+)?$/.test(value)) {
    const serial = Number(value);
    const excelEpoch = Date.UTC(1899, 11, 30);
    const date = new Date(excelEpoch + serial * 24 * 60 * 60 * 1000);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  const parts = value.split(/[/-]/);

  if (parts.length !== 3) return null;

  const [first, second, third] = parts.map(Number);

  if ([first, second, third].some(Number.isNaN)) {
    return null;
  }

  if (String(parts[0]).length === 4) {
    return new Date(first, second - 1, third);
  }

  return new Date(third, second - 1, first);
}

function endOfDay(date) {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

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

    const fromDate = parseDateValue(req.query.fromDate);
    const toDate = parseDateValue(req.query.toDate);

    console.log("MONTH =>", selectedMonth);
    console.log("FROM =>", req.query.fromDate || "all");
    console.log("TO =>", req.query.toDate || "all");

    const response = await axios.get(SHEET_URL);

    const rows = Papa.parse(response.data, {
      skipEmptyLines: true,
    }).data;

    const freshMap = {};
    const repeatMap = {};

    rows.slice(1).forEach((row) => {

      // Column O = Disburse Date
      const caseDate = parseDateValue(row[14]);

      // Date Range Filter
      if (fromDate || toDate) {
        if (
          !caseDate ||
          (fromDate && caseDate < fromDate) ||
          (toDate && caseDate > endOfDay(toDate))
        ) {
          return; 
        }
      }

      const rowMonth = String(
        row[16] || ""
      )
        .trim()
        .toLowerCase();

      // Month Filter
      if (selectedMonth !== "all") {
        const selected = selectedMonth.replace(
          /['\s-]/g,
          ""
        );

        const month = rowMonth.replace(
          /['\s-]/g,
          ""
        );

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

      const target = isFresh
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
          receivedAmount: 0,
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
                  (item.receivedAmount /
                    item.repayAmount) *
                  100
                ).toFixed(2)
              )
            : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    res.json({
      fresh,
      repeat,
    });

  } catch (err) {
    console.error("SERVER ERROR =>", err);

    res.status(500).json({
      error: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server Running On ${PORT}`);
});
