"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { vehicleCatalog } from "@/data/vehicle-catalog";

export default function VehicleCatalogPage() {
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();

  const makes = useMemo(() => vehicleCatalog.map((make) => ({
    ...make,
    models: make.models.filter((model) =>
      !query || make.name.toLowerCase().includes(query) ||
      model.name.toLowerCase().includes(query) ||
      model.engines.some((engine) =>
        engine.label.toLowerCase().includes(query) ||
        engine.fuel.toLowerCase().includes(query) ||
        engine.years.toLowerCase().includes(query)
      )
    )
  })).filter((make) => make.models.length > 0), [query]);

  const modelCount = makes.reduce((total, make) => total + make.models.length, 0);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Vehicle catalogue</span>
          <h1>Find your car before estimating its import costs.</h1>
          <p>Browse the makes, models and common engine variants currently included in Portavero. Exact engines vary by year and market, so confirm the details from the vehicle documents.</p>
          <div className="hero-actions">
            <Link href="/vehicle-import" className="button button-dark">Estimate import costs ↗</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="catalog-toolbar">
            <label className="field catalog-search">
              <span>Search make, model, engine or fuel type</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Try Toyota Prius, BMW 340i, hybrid…"
              />
            </label>
            <p className="catalog-count">{modelCount} models · {makes.length} makes</p>
          </div>

          {makes.length === 0 ? (
            <div className="panel catalog-empty">
              <h2>No matching vehicles</h2>
              <p>Try a different spelling or search by make, model or engine type.</p>
              <button className="button button-outline" type="button" onClick={() => setSearch("")}>Clear search</button>
            </div>
          ) : (
            <div className="catalog-grid">
              {makes.map((make) => (
                <article className="catalog-card" key={make.name}>
                  <div className="catalog-card-heading">
                    <h2>{make.name}</h2>
                    <span>{make.models.length} {make.models.length === 1 ? "model" : "models"}</span>
                  </div>
                  <div className="catalog-model-list">
                    {make.models.map((model) => (
                      <div className="catalog-model" key={model.name}>
                        <h3>{model.name}</h3>
                        <ul>
                          {model.engines.filter((engine) =>
                            !query ||
                            make.name.toLowerCase().includes(query) ||
                            model.name.toLowerCase().includes(query) ||
                            engine.label.toLowerCase().includes(query) ||
                            engine.fuel.toLowerCase().includes(query) ||
                            engine.years.toLowerCase().includes(query)
                          ).map((engine) => (
                            <li key={engine.id}>
                              <span>{engine.label}</span>
                              <small>{engine.cc > 0 ? `${engine.cc.toLocaleString("en-US")} cm³ · ` : ""}{engine.fuel} · {engine.years}</small>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <Link href="/vehicle-import" className="catalog-card-link">Estimate this car’s import costs ↗</Link>
                </article>
              ))}
            </div>
          )}

          <p className="catalog-disclaimer">This is a curated starter catalogue, not a complete global vehicle database or VIN decoder. If your exact trim or engine is missing, you can enter the engine capacity manually in the vehicle import estimator.</p>
        </div>
      </section>
    </>
  );
}
