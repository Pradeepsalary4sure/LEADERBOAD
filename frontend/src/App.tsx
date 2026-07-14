import "./App.css";
import heroImage from "./assets/logo.png";
import bankLogo from "./assets/logo.png";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import Papa from "papaparse";
import Loader from "./components/loader";

interface LeaderboardItem {
  name: string;
  repayAmount?: number;
  actualRepayAmount?: number;
  [key: string]: unknown;
}


const API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:5000"
  : "https://leaderboad-backend.onrender.com";

  const MIN_DISBURSE_DATE = "2025-10-25";
  const MAX_DISBURSE_DATE = "2030-12-31";
  const FRESH_TARGET = 5 * 10000000;
  const REPEAT_TARGET = 5 * 10000000;

  // ============================
  // HARDCODED CREDENTIALS (Demo)
  // ============================
  interface Data {
    name: string;
    cases: number;
    amount: number;
    repayAmount: number;
    receivedAmount: number;
    receivePercent: number;
    date?: string;
  }

  const countUniqueExecutives = (items: Data[]) =>
    new Set(items.map((item) => item.name.toLowerCase().trim())).size;

  function App() {
    // ============================
    // DASHBOARD STATE
    // ============================
    const [fresh, setFresh] = useState<Data[]>([]);
    const [repeat, setRepeat] = useState<Data[]>([]);
    const freshTarget = FRESH_TARGET;
    const repeatTarget = REPEAT_TARGET;
    const [month, setMonth] = useState(() => {
      const now = new Date();
      const year = now.getFullYear();
      const shortYear = String(year).slice(-2);
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
      return `${months[now.getMonth()]}'${shortYear}`;
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState("All");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [appliedFrom, setAppliedFrom] = useState("");
    const [appliedTo, setAppliedTo] = useState("");
    const [sheetDateRange, setSheetDateRange] = useState<{ min: string; max: string } | null>(null);
    const [matchedRows, setMatchedRows] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const currentUser = "User";
    const [missionAmountVisible, setMissionAmountVisible] = useState(false);
    const [bannerVisible, setBannerVisible] = useState(true);
    const [bannerExpanded, setBannerExpanded] = useState(true);

    // ============================
    // FETCH LEADERBOARD
    // ============================
 const fetchLeaderboard = useCallback(async () => {
  setLoading(true);

  const query = new URLSearchParams();

  const hasDateFilter = Boolean(appliedFrom || appliedTo);

  if (month !== "All" && !hasDateFilter) {
    query.set("month", month);
  }

  if (appliedFrom) {
    query.set("fromDate", appliedFrom);
  }

  if (appliedTo) {
    query.set("toDate", appliedTo);
  }

  axios
    .get(`${API_BASE_URL}/api/leaderboard?${query.toString()}`)
    .then((res) => {
      setFresh(
        res.data.fresh.map((item: LeaderboardItem) => ({
          ...item,
          repayAmount: item.repayAmount ?? item.actualRepayAmount ?? 0,
        }))
      );

      setRepeat(
        res.data.repeat.map((item: LeaderboardItem) => ({
          ...item,
          repayAmount: item.repayAmount ?? item.actualRepayAmount ?? 0,
        }))
      );

      if (res.data.meta?.sheetDateRange) {
        setSheetDateRange(res.data.meta.sheetDateRange);
      }
      setMatchedRows(
        typeof res.data.meta?.matchedRows === "number"
          ? res.data.meta.matchedRows
          : null
      );
      setLastUpdated(new Date());
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setLoading(false);
    });
  }, [month, appliedFrom, appliedTo]);

          useEffect(() => {
        fetchLeaderboard();
      }, [fetchLeaderboard]);
  const applyDateRange = () => {
    if (!dateFrom && !dateTo) {
      setAppliedFrom("");
      setAppliedTo("");
      return;
    }

    const from = dateFrom || dateTo;
    const to = dateTo || dateFrom;

    setAppliedFrom(from);
    setAppliedTo(to);
    setMonth("All");
  };

  const clearDateRange = () => {
    setDateFrom("");
    setDateTo("");
    setAppliedFrom("");
    setAppliedTo("");
    setMatchedRows(null);
  };

  const handleMonthChange = (value: string) => {
    setMonth(value);
    if (value !== "All") {
      clearDateRange();
    }
  };

    const filteredFresh = fresh.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredRepeat = repeat.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const hasActiveDateFilter = Boolean(appliedFrom || appliedTo);
    const noDataForDateFilter =
      hasActiveDateFilter &&
      !loading &&
      filteredFresh.length === 0 &&
      filteredRepeat.length === 0;

    const formatDisplayDate = (value: string) => {
      const [year, month, day] = value.split("-");
      if (!year || !month || !day) return value;
      return `${day}-${month}-${year}`;
    };

    const maxSelectableDate = sheetDateRange?.max || MAX_DISBURSE_DATE;

    const showFresh = viewMode === "All" || viewMode === "Fresh";
    const showRepeat = viewMode === "All" || viewMode === "Repeat";

    const freshTotal = filteredFresh.reduce((sum, item) => sum + item.amount, 0);
    const repeatTotal = filteredRepeat.reduce((sum, item) => sum + item.amount, 0);

    const freshPercent = freshTarget > 0 ? (freshTotal / freshTarget) * 100 : 0;
    const repeatPercent = repeatTarget > 0 ? (repeatTotal / repeatTarget) * 100 : 0;
    const combinedTargetPercent =
      freshTarget + repeatTarget > 0
        ? ((freshTotal + repeatTotal) / (freshTarget + repeatTarget)) * 100
        : 0;

    const visibleData = [
      ...(showFresh ? filteredFresh : []),
      ...(showRepeat ? filteredRepeat : []),
    ];

    const activeExecutiveCount = countUniqueExecutives(visibleData);

    const overallAmount = visibleData.reduce((sum, item) => sum + item.amount, 0);
    const overallRepayAmount = visibleData.reduce(
      (sum, item) => sum + item.repayAmount,
      0
    );
    const overallReceivedAmount = visibleData.reduce(
      (sum, item) => sum + item.receivedAmount,
      0
    );
    const overallReceivedPercent =
      overallRepayAmount > 0
        ? (overallReceivedAmount / overallRepayAmount) * 100
        : 0;

    const totalMissionTarget = freshTarget + repeatTarget;
    const achievedTotal = freshTotal + repeatTotal;
    const missionProgressPercent =
      totalMissionTarget > 0 ? (achievedTotal / totalMissionTarget) * 100 : 0;
    const missionRemaining = Math.max(totalMissionTarget - achievedTotal, 0);
    const currentDay = new Date().getDate();
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const missionMonth = month === "All"
      ? new Date().toLocaleString("default", { month: "long", year: "numeric" })
      : month;

    // ============================
    // DOWNLOAD REPORTS
    // ============================

    const downloadFullReport = () => {
      const reportData = [];

      reportData.push(["Minutes Loan - FULL REPORT"]);
      reportData.push(["Generated on", new Date().toLocaleString()]);
      if (appliedFrom || appliedTo) {
        reportData.push(["Date Range", `${appliedFrom || "Start"} to ${appliedTo || "End"}`]);
      }
      if (month !== "All") {  
        reportData.push(["Month Filter", month]);
      }
      reportData.push([]);

      reportData.push(["SUMMARY STATISTICS"]);
      reportData.push(["Fresh Target Achievement", `${freshPercent.toFixed(2)}%`, `₹ ${(freshTotal / 10000000).toFixed(2)}Cr`, `Target: ₹ ${(freshTarget / 10000000).toFixed(1)}Cr`]);
      reportData.push(["Repeat Target Achievement", `${repeatPercent.toFixed(2)}%`, `₹ ${(repeatTotal / 10000000).toFixed(2)}Cr`, `Target: ₹ ${(repeatTarget / 10000000).toFixed(1)}Cr`]);
      reportData.push(["Combined Achievement", `${combinedTargetPercent.toFixed(2)}%`, `₹ ${((freshTotal + repeatTotal) / 10000000).toFixed(2)}Cr`, `Target: ₹ ${((freshTarget + repeatTarget) / 10000000).toFixed(1)}Cr`]);
      reportData.push([]);

      reportData.push(["OVERALL AMOUNT SUMMARY"]);
      reportData.push(["Total Amount", overallAmount.toLocaleString()]);
      reportData.push(["Total Repay Amount", overallRepayAmount.toLocaleString()]);
      reportData.push(["Total Received Amount", overallReceivedAmount.toLocaleString()]);
      reportData.push(["Overall Received %", `${overallReceivedPercent.toFixed(2)}%`]);
      reportData.push([]);
      reportData.push([]);

      if (showFresh && filteredFresh.length > 0) {
        reportData.push(["FRESH PERFORMANCE"]);
        reportData.push(["Rank", "Executive Name", "No of Cases", "Total Amount", "Total Repay Amt", "Total Received Amt", "% Received"]);
        filteredFresh.forEach((item, idx) => {
          reportData.push([
            idx + 1,
            item.name,
            item.cases,
            item.amount.toLocaleString(),
            item.repayAmount.toLocaleString(),
            item.receivedAmount.toLocaleString(),
            `${item.receivePercent.toFixed(2)}%`
          ]);
        });
        reportData.push([]);
        reportData.push([]);
      }

      if (showRepeat && filteredRepeat.length > 0) {
        reportData.push(["REPEAT PERFORMANCE"]);
        reportData.push(["Rank", "Executive Name", "No of Cases", "Total Amount", "Total Repay Amt", "Total Received Amt", "% Received"]);
        filteredRepeat.forEach((item, idx) => {
          reportData.push([
            idx + 1,
            item.name,
            item.cases,
            item.amount.toLocaleString(),
            item.repayAmount.toLocaleString(),
            item.receivedAmount.toLocaleString(),
            `${item.receivePercent.toFixed(2)}%`
          ]);
        });
      }

      const csv = Papa.unparse(reportData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `Toofan_Full_Report_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const downloadIncentiveReport = () => {
      const incentiveData = [];

      const freshIncentive = filteredFresh.filter(item => item.receivePercent >= 80);
      const repeatIncentive = filteredRepeat.filter(item => item.receivePercent >= 80);
      const allIncentive = [...freshIncentive, ...repeatIncentive];

      allIncentive.sort((a, b) => b.receivePercent - a.receivePercent);

      incentiveData.push(["Minutes Loan - INCENTIVE REPORT (80%+ RECEIVED)"]);
      incentiveData.push(["Generated on", new Date().toLocaleString()]);
      incentiveData.push(["Filter Criteria", "Received Percentage >= 80%"]);
      
      if (appliedFrom || appliedTo) {
        incentiveData.push(["Date Range", `${appliedFrom || "Start"} to ${appliedTo || "End"}`]);
      }
      if (month !== "All") {
        incentiveData.push(["Month Filter", month]);
      }
      
      incentiveData.push([]);

      const totalEligible = countUniqueExecutives(allIncentive);
      const totalCases = allIncentive.reduce((sum, item) => sum + item.cases, 0);
      const totalAmount = allIncentive.reduce((sum, item) => sum + item.amount, 0);
      const totalRepay = allIncentive.reduce((sum, item) => sum + item.repayAmount, 0);
      const totalReceived = allIncentive.reduce((sum, item) => sum + item.receivedAmount, 0);
      const avgPercent = allIncentive.length > 0 ? (allIncentive.reduce((sum, item) => sum + item.receivePercent, 0) / allIncentive.length) : 0;

      incentiveData.push(["INCENTIVE ELIGIBLE SUMMARY"]);
      incentiveData.push(["Total Eligible Executives", totalEligible]);
      incentiveData.push(["Total Cases", totalCases]);
      incentiveData.push(["Total Amount", totalAmount.toLocaleString()]);
      incentiveData.push(["Total Repay Amount", totalRepay.toLocaleString()]);
      incentiveData.push(["Total Received Amount", totalReceived.toLocaleString()]);
      incentiveData.push(["Average Received %", `${avgPercent.toFixed(2)}%`]);
      incentiveData.push([]);
      incentiveData.push([]);

      if (allIncentive.length > 0) {
        incentiveData.push(["ELIGIBLE EXECUTIVES (80%+ RECEIVED)"]);
        incentiveData.push(["Rank", "Executive Name", "No of Cases", "Total Amount", "Total Repay Amt", "Total Received Amt", "% Received", "Type", "Eligible for Incentive"]);
        
        allIncentive.forEach((item, idx) => {
          const type = freshIncentive.includes(item) ? "Fresh" : "Repeat";
          incentiveData.push([
            idx + 1,
            item.name,
            item.cases,
            item.amount.toLocaleString(),
            item.repayAmount.toLocaleString(),
            item.receivedAmount.toLocaleString(),
            `${item.receivePercent.toFixed(2)}%`,
            type,
            "YES ✓"
          ]);
        });
      } else {
        incentiveData.push([]);
        incentiveData.push(["NO ELIGIBLE EXECUTIVES", "No executives with 80%+ received percentage in selected filters"]);
      }

      const csv = Papa.unparse(incentiveData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      
      let fileName = `Toofan_Incentive_Report_${new Date().toISOString().split('T')[0]}`;
      if (appliedFrom) fileName += `_from_${appliedFrom}`;
      if (appliedTo) fileName += `_to_${appliedTo}`;
      fileName += ".csv";
      
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    // ============================
    // TARGET CARD RENDER
    // ============================
    const renderTargetPanel = (category: "Fresh" | "Repeat") => {
      const isFresh = category === "Fresh";
      const percent = isFresh ? freshPercent : repeatPercent;
      const amount = isFresh ? freshTotal : repeatTotal;
      const target = isFresh ? freshTarget : repeatTarget;
      const colorClass = isFresh ? "fresh" : "repeat";

      return (
        <div className={`target-item ${colorClass}-target`}>
          <div className="target-item-header">
            <h3>{category} Loans</h3>
            <span className="achievement-percent">{percent.toFixed(1)}%</span>
          </div>

          <div className="progress-bar">
            <div
              className={`progress-fill ${colorClass}`}
              style={{ width: `${Math.min(percent, 100)}%` }}
            ></div>
          </div>

          <div className="amount-row">
            <div className="amount-item">
              <span className="label">Achieved</span>
              <span className="value">₹ {(amount / 10000000).toFixed(2)}Cr</span>
            </div>
            <div className="amount-item">
              <span className="label">Target</span>
              <span className="value">₹ {(target / 10000000).toFixed(1)}Cr</span>
            </div>
          </div>
        </div>
      );
    };

    const renderTargetCard = () => (
      <div className="target-card-main mission-target-card">
        <div className="mission-header">
          <div>
            <h2 className="mission-title">Mission ₹ {(totalMissionTarget / 10000000).toFixed(1)}Cr — {missionMonth}</h2>
          </div>
          <span className="mission-badge">Day {currentDay} of {daysInMonth}</span>
        </div>

        <div className="mission-track-card">
          <div className="track-labels-row">
            <span className="track-label">₹0</span>
            <span className="track-label">₹ {(totalMissionTarget * 0.25 / 10000000).toFixed(1)}Cr</span>
            <span className="track-label">₹ {(totalMissionTarget * 0.5 / 10000000).toFixed(1)}Cr</span>
            <span className="track-label">₹ {(totalMissionTarget * 0.75 / 10000000).toFixed(1)}Cr</span>
            <span className="track-label">₹ {(totalMissionTarget / 10000000).toFixed(1)}Cr</span>
          </div>

          <div
              className="progress-track"
              onClick={() => setMissionAmountVisible((current) => !current)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setMissionAmountVisible((current) => !current)}
            >
            <div className="progress-rail"></div>

            <div
              className="progress-fill"
              style={{ width: `${Math.min(missionProgressPercent, 100)}%` }}
            />
              <div
                  className="progress-percent"
                  style={{
                    left: `${Math.min(missionProgressPercent, 100)}%`,
                  }}
                >
                  <div>{missionProgressPercent.toFixed(1)}%</div>
                  <small>
                    ₹ {(achievedTotal / 10000000).toFixed(2)} Cr
                  </small>
                </div>
            {[0, 25, 50, 75, 100].map((value) => (
              <div
                key={value}
                className="progress-dot"
                style={{ left: `${value}%` }}
              />
            ))}

            <div
              className={`progress-current-bubble ${missionAmountVisible ? "visible" : ""}`}
              style={{ left: `${Math.min(missionProgressPercent, 100)}%` }}
            >
              <span>Mission reached: {missionProgressPercent.toFixed(1)}% • ₹ {(achievedTotal / 10000000).toFixed(2)}Cr</span>
            </div>
          </div>
        </div>

        <div className="mission-summary-panel">
          <div className="mission-stat-card">
            <div className="mission-stat-label">Target Achievement</div>
            <div className="mission-stat-value">₹ {((freshTotal + repeatTotal) / 10000000).toFixed(2)}Cr</div>
          </div>
          <div className="mission-stat-card">
            <div className="mission-stat-label">Total Target Achievement</div>
            <div className="mission-stat-value">₹ {(totalMissionTarget / 10000000).toFixed(1)}Cr</div>
          </div>
          <div className="mission-stat-card mission-stat-highlight">
            <div className="mission-stat-label">Overall Achievement %</div>
            <div className="mission-stat-value">{combinedTargetPercent.toFixed(1)}%</div>
          </div>
        </div>

        <div className="mission-summary-grid">
          <div className="mission-summary-item">
            <span>Achieved</span>
            <strong>₹ {(achievedTotal / 10000000).toFixed(2)}Cr</strong>
          </div>
          <div className="mission-summary-item">
            <span>Target</span>
            <strong>₹ {(totalMissionTarget / 10000000).toFixed(1)}Cr</strong>
          </div>
          <div className="mission-summary-item highlight-item">
            <span>Remaining</span>
            <strong>₹ {(missionRemaining / 10000000).toFixed(2)}Cr</strong>
          </div>
        </div>
      </div>
    );

    // ============================
    // TOP 3 RENDER
    // ============================
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

    // ============================
    // TABLE RENDER
    // ============================
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
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="empty-table-message">
                      Is date range par koi data nahi mila.
                    </td>
                  </tr>
                ) : (
                  data.map((item, i) => (
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
                ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );

    // ============================
    // MAIN DASHBOARD RENDER
    // ============================

    // const liveUsersList = allLoggedInUsers.map(name => ({
    //   name,
    //   email: `${name.toLowerCase().replace(/\s/g, '')}@toofanloan.com`
    // }));

    return (
      <div className="app">
        {/* LIVE TICKER */}
        {/* <div className="live-ticker-container"> */}
          {/* <div className="live-badge">
            <div className="live-dot"></div>
            LIVE
            <div className="live-count">{liveUsersList.length + 5}</div>
          </div> */}
          {/* <div className="ticker-wrap"> */}
            {/* <div className="ticker-content"> */}
              {/* Duplicating the list a few times for seamless continuous scroll */}
              {/* {[...liveUsersList, ...liveUsersList, ...liveUsersList, ...liveUsersList].map((u, i) => (
                <span key={i} className="ticker-item">
                  <span className="dot">🟢</span>
                  {u.name}
                  <span className="email">({u.email})</span>
                  <span className="ticker-sep">|</span>
                </span>
              ))} */}
            {/* </div>
          </div> */}
        {/* </div> */}

        {/* MAIN APP HEADER */}
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
            <div className="user-info" style={{ margin: "0 0 -4px 0" }}>
              <span className="username">👤 Welcome, {currentUser}</span>
            </div>
            <div className="button-group">
              <button
                className="refresh-button"
                onClick={fetchLeaderboard}
                disabled={loading}
              >
                {loading ? "Refreshing..." : "🔄 Refresh"}
              </button>
              <button
                className="download-button full-report"
                onClick={downloadFullReport}
                title="Download full dashboard report with all data"
              >
                📥 Full Report
              </button>
              <button
                className="download-button incentive-report"
                onClick={downloadIncentiveReport}
                title="Download incentive report (80%+ received)"
              >
                💰 Incentive (80%+)
              </button>
            </div>
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

        {!bannerVisible && (
          <div className="banner-show-control">
            <button type="button" className="banner-show-button" onClick={() => setBannerVisible(true)}>
              Show Dashboard Banner
            </button>
          </div>
        )}

        {bannerVisible && (
          <section className={`dashboard-banner ${bannerExpanded ? "" : "collapsed"}`}>
            <div className="banner-controls">
              <button
                type="button"
                className="banner-toggle-button"
                onClick={() => setBannerExpanded((prev) => !prev)}
              >
                {bannerExpanded ? "Minimize" : "Maximize"}
              </button>
              <button
                type="button"
                className="banner-cancel-button"
                onClick={() => setBannerVisible(false)}
              >
                Cancel
              </button>
            </div>

            <img src={heroImage} alt="Dashboard" className="dashboard-image" />
            <div className="dashboard-title">
              <h1>Sanction Leaderboard Dashboard</h1>
              <p>Centered high-value ranking view with fresh and repeat performance.</p>
            </div>
          </section>
        )}

        {/* KPI SUMMARY CARDS */}
        <div className="kpi-container">
          <div className="kpi-card">
            <div className="kpi-label">Fresh Cases</div>
            <div className="kpi-value">{filteredFresh.reduce((sum, item) => sum + item.cases, 0)}</div>
            <div className="kpi-subtext">₹ {(freshTotal / 10000000).toFixed(2)}Cr</div>
          </div>
          
          <div className="kpi-card">
            <div className="kpi-label">Repeat Cases</div>
            <div className="kpi-value">{filteredRepeat.reduce((sum, item) => sum + item.cases, 0)}</div>
            <div className="kpi-subtext">₹ {(repeatTotal / 10000000).toFixed(2)}Cr</div>
          </div>
          
          <div className="kpi-card kpi-highlight">
            <div className="kpi-label">Total Collection</div>
            <div className="kpi-value">₹ {(overallReceivedAmount / 10000000).toFixed(2)}Cr</div>
            <div className="kpi-subtext">{overallReceivedPercent.toFixed(1)}% Recovery</div>
          </div>
          
          <div className="kpi-card">
            <div className="kpi-label">Sanction Executives</div>
            <div className="kpi-value">{activeExecutiveCount}</div>
            <div className="kpi-subtext">Total in View</div>
          </div>
        </div>

        {renderTargetCard()}

        <div className="target-card-main target-summary-section">
          <h2 className="target-main-title">Current Target & Achievement</h2>
          <div className="target-grid">
            {showFresh && renderTargetPanel("Fresh")}
            {showRepeat && renderTargetPanel("Repeat")}
          </div>
        </div>

        <div className="target-card-main overall-summary-section">
          <h2 className="target-main-title">Overall Amount Summary</h2>
          <div className="summary-grid">
            <div className="summary-box">
              <span>Total Amount</span>
              <strong>₹ {overallAmount.toLocaleString()}</strong>
            </div>
            <div className="summary-box">
              <span>Total Repay Amount</span>
              <strong>₹ {overallRepayAmount.toLocaleString()}</strong>
            </div>
            <div className="summary-box">
              <span>Total Received Amount</span>
              <strong>₹ {overallReceivedAmount.toLocaleString()}</strong>
            </div>
            <div className="summary-box highlight-box">
              <span>Overall Received %</span>
              <strong>{overallReceivedPercent.toFixed(2)}%</strong>
            </div>
          </div>
          <div className="summary-progress-wrap">
            <div className="summary-progress-line">
              <div
                className="summary-progress-fill combined"
                style={{ width: `${Math.min(overallReceivedPercent, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="split-layout">
          <aside className="side-panel">
            <div className="filter-box">
              <div className="filter-heading">
                <h3>Custom Filters</h3>
              </div>
              <div className="filter-content">
                <label>
                  Month
                  <select
                    className="month-select"
                    value={month}
                    onChange={(e) => handleMonthChange(e.target.value)}
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
                        max={maxSelectableDate}
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                      />
                      <span className="date-separator">to</span>
                      <input
                        className="date-input"
                        type="date"
                        min={dateFrom || MIN_DISBURSE_DATE}
                        max={maxSelectableDate}
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                      />
                    </div>
                    <div className="date-actions">
                      <button
                        type="button"
                        className="apply-button"
                        onClick={applyDateRange}
                      >
                        Apply
                      </button>
                      {(dateFrom || dateTo || appliedFrom || appliedTo) && (
                        <button
                          type="button"
                          className="clear-button"
                          onClick={clearDateRange}
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    {sheetDateRange && (
                      <p className="date-range-hint">
                        Available data: {formatDisplayDate(sheetDateRange.min)} to{" "}
                        {formatDisplayDate(sheetDateRange.max)}
                      </p>
                    )}
                    {(appliedFrom || appliedTo) && (
                      <p className="active-date-filter">
                        Showing: {appliedFrom === appliedTo
                          ? formatDisplayDate(appliedFrom)
                          : `${formatDisplayDate(appliedFrom || appliedTo)} to ${formatDisplayDate(appliedTo || appliedFrom)}`}
                        {matchedRows !== null && ` (${matchedRows} cases)`}
                      </p>
                    )}
                    {noDataForDateFilter && (
                      <p className="date-filter-warning">
                        Is date par sheet mein koi record nahi hai.
                        {sheetDateRange
                          ? ` Data ${formatDisplayDate(sheetDateRange.min)} se ${formatDisplayDate(sheetDateRange.max)} tak available hai.`
                          : ""}
                      </p>
                    )}
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
            </div>
          </aside>

          <main className="main-panel">
            {noDataForDateFilter && (
              <div className="no-data-banner">
                Selected date range mein koi data nahi mila. Kripya wahi date select karein
                jis din sheet mein Disburse Date hai.
                {sheetDateRange && (
                  <>
                    {" "}
                    Latest available date: {formatDisplayDate(sheetDateRange.max)}
                  </>
                )}
              </div>
            )}
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
        {loading && <Loader />}
           
      </div>
    );
  }

  export default App;



