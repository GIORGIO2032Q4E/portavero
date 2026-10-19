"use client";

import { useMemo, useState } from "react";

const money = (value: number, currency: string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(value);

function NumberField({ label, value, onChange, hint, min = 0, step = "0.01" }: {
  label: string; value: number; onChange: (value: number) => void; hint?: string; min?: number; step?: string;
}) {
  return (
    <div className="field">
      <label>{label}</label>
      <input type="number" min={min} step={step} value={value} onChange={(event) => onChange(Math.max(0, Number(event.target.value) || 0))} />
      {hint && <small>{hint}</small>}
    </div>
  );
}

export default function CalculatorPage() {
  const [currency, setCurrency] = useState("USD");
  const [goods, setGoods] = useState(1000);
  const [shipping, setShipping] = useState(250);
  const [insurance, setInsurance] = useState(20);
  const [customs, setCustoms] = useState(0);
  const [handling, setHandling] = useState(75);
  const [other, setOther] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const result = useMemo(() => {
    const subtotal = goods + shipping + insurance + customs + handling + other;
    return { subtotal, perItem: quantity > 0 ? subtotal / quantity : subtotal };
  }, [goods, shipping, insurance, customs, handling, other, quantity]);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Import planning tool</span>
          <h1>See the cost beyond the price tag.</h1>
          <p>Enter the costs you know to estimate your total import spend. Every amount is editable, and no customs rate or shipping quote is assumed to be live.</p>
        </div>
      </section>
      <section className="section">
        <div className="container tool-layout">
          <section className="panel">
            <h2>Your shipment</h2>
            <p className="panel-intro">Use one currency for every field. Convert amounts yourself before entering them if needed.</p>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="currency">Currency</label>
                <select id="currency" value={currency} onChange={(event) => setCurrency(event.target.value)}>
                  <option value="USD">USD · US dollar</option>
                  <option value="EUR">EUR · Euro</option>
                  <option value="GBP">GBP · British pound</option>
                  <option value="GEL">GEL · Georgian lari</option>
                  <option value="JPY">JPY · Japanese yen</option>
                </select>
                <small>All amounts below use this currency.</small>
              </div>
              <NumberField label="Goods / purchase value" value={goods} onChange={setGoods} hint="Total amount paid to the seller." />
              <NumberField label="Shipping / freight" value={shipping} onChange={setShipping} hint="Use a carrier quote where possible." />
              <NumberField label="Insurance" value={insurance} onChange={setInsurance} />
              <NumberField label="Customs and taxes" value={customs} onChange={setCustoms} hint="Enter a verified figure, or leave at zero until known." />
              <NumberField label="Handling / port charges" value={handling} onChange={setHandling} hint="Illustrative starting value. Replace with a quote." />
              <NumberField label="Other costs" value={other} onChange={setOther} hint="Broker, inland delivery, storage or other fees." />
              <NumberField label="Number of items" value={quantity} onChange={setQuantity} min={1} step="1" hint="Used to estimate average cost per item." />
            </div>
          </section>
          <aside className="panel result-panel" aria-live="polite">
            <span className="result-label">Estimated total</span>
            <div className="result-total">{money(result.subtotal, currency)}</div>
            <p>Based only on the amounts entered above.</p>
            <div className="result-lines">
              <div className="result-line"><span>Goods</span><strong>{money(goods, currency)}</strong></div>
              <div className="result-line"><span>Shipping</span><strong>{money(shipping, currency)}</strong></div>
              <div className="result-line"><span>Insurance</span><strong>{money(insurance, currency)}</strong></div>
              <div className="result-line"><span>Customs and taxes</span><strong>{money(customs, currency)}</strong></div>
              <div className="result-line"><span>Handling and other</span><strong>{money(handling + other, currency)}</strong></div>
              <div className="result-line"><span>Average per item</span><strong>{money(result.perItem, currency)}</strong></div>
            </div>
            <div className="disclaimer">Planning estimate only. A zero in any field means no amount has been included, not that the charge is legally waived or free.</div>
          </aside>
        </div>
      </section>
    </>
  );
}
