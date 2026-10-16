"use client";

import { useMemo, useState } from "react";
import { formatAED } from "../lib/site";

const numberValue = (value: string, fallback: number) => {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
};

export default function MortgageCalculator() {
  const [price, setPrice] = useState("2500000");
  const [depositPercent, setDepositPercent] = useState("20");
  const [annualRate, setAnnualRate] = useState("4.5");
  const [termYears, setTermYears] = useState("25");
  const [costRate, setCostRate] = useState("0");

  const result = useMemo(() => {
    const value = numberValue(price, 0);
    const deposit = Math.min(100, numberValue(depositPercent, 0));
    const rate = numberValue(annualRate, 0);
    const years = numberValue(termYears, 0);
    const loan = value * (1 - deposit / 100);
    const months = years * 12;
    const monthlyRate = rate / 100 / 12;
    const payment = months === 0
      ? 0
      : monthlyRate === 0
        ? loan / months
        : loan * (monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1);
    const repayment = payment * months;

    return {
      depositAmount: value - loan,
      loan,
      payment: Number.isFinite(payment) ? payment : 0,
      interest: Math.max(0, repayment - loan),
      repayment,
      assumedCosts: value * numberValue(costRate, 0) / 100,
    };
  }, [price, depositPercent, annualRate, termYears, costRate]);

  return (
    <div className="calculator-grid">
      <section className="calculator-panel">
        <h2>Mortgage estimate</h2>
        <label className="filter-field">Property price (AED)<input min="0" type="number" inputMode="decimal" value={price} onChange={(event) => setPrice(event.target.value)} /></label>
        <label className="filter-field">Deposit (%)<input min="0" max="100" step="0.5" type="number" inputMode="decimal" value={depositPercent} onChange={(event) => setDepositPercent(event.target.value)} /></label>
        <label className="filter-field">Annual interest rate (%)<input min="0" step="0.1" type="number" inputMode="decimal" value={annualRate} onChange={(event) => setAnnualRate(event.target.value)} /></label>
        <label className="filter-field">Loan term (years)<input min="1" max="40" type="number" inputMode="numeric" value={termYears} onChange={(event) => setTermYears(event.target.value)} /></label>
        <div className="calculator-results">
          <span>Estimated monthly payment</span><strong>{formatAED(result.payment)}</strong>
          <dl><dt>Deposit</dt><dd>{formatAED(result.depositAmount)}</dd><dt>Loan amount</dt><dd>{formatAED(result.loan)}</dd><dt>Total estimated interest</dt><dd>{formatAED(result.interest)}</dd><dt>Total repayment</dt><dd>{formatAED(result.repayment)}</dd></dl>
        </div>
        <p className="disclaimer">Illustrative estimate only. Actual financing terms depend on lender assessment, eligibility and fees. No lender rate is represented here.</p>
      </section>
      <section className="calculator-panel">
        <h2>Additional-cost estimate</h2>
        <p className="section-intro">Enter a percentage assumption of your choice. No transaction or government fees are prefilled or represented as official charges.</p>
        <label className="filter-field">Assumed additional costs (%)<input min="0" max="100" step="0.1" type="number" inputMode="decimal" value={costRate} onChange={(event) => setCostRate(event.target.value)} /></label>
        <div className="calculator-results">
          <span>Illustrative additional cost</span><strong>{formatAED(result.assumedCosts)}</strong>
          <dl><dt>Property price</dt><dd>{formatAED(numberValue(price, 0))}</dd><dt>Your assumption</dt><dd>{numberValue(costRate, 0)}%</dd><dt>Price + assumed costs</dt><dd>{formatAED(numberValue(price, 0) + result.assumedCosts)}</dd></dl>
        </div>
        <p className="disclaimer">This estimate uses only the assumption you enter. Ask a qualified professional for applicable fees and charges.</p>
      </section>
    </div>
  );
}
