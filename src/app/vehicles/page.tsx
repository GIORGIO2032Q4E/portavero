"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { vehicleCatalog } from "@/data/vehicle-catalog";
import { parseSavedVehicleCandidates, SAVED_VEHICLES_STORAGE_KEY } from "@/lib/saved-vehicles.mjs";

export default function VehicleCatalogPage() {
  const [search, setSearch] = useState("");
  const [savedVehicleCount, setSavedVehicleCount] = useState(0);
  const query = search.trim().toLowerCase();

  useEffect(() => {
    try {
      const saved = parseSavedVehicleCandidates(
        window.localStorage.getItem(SAVED_VEHICLES_STORAGE_KEY)
      );
      setSavedVehicleCount(saved.items.length);
    } catch {
      setSavedVehicleCount(0);
    }
  }, []);

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
          <h1>Check the common engine options for your car.</h1>
          <p>This list covers some of the makes, models and engine options included in Portavero. The same model can have different engines depending on its year and market, so check the car's documents before using a number in your estimate.</p>
          <div className="hero-actions">
            <Link href="/vehicle-import" className="button button-dark">Estimate import costs ↗</Link>
            <Link href="/compare" className="button button-outline">Compare saved vehicles ({savedVehicleCount})</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="catalog-toolbar">
            <label className="field catalog-search">
              <span>Search by make, model, engine or fuel</span>
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
              <p>Try another spelling, or search for just the make, model or engine.</p>
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
                              {engine.note && <small>{engine.note}</small>}
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

          <p className="catalog-disclaimer">This list is not complete, and it does not identify the exact engine fitted to a car. Can't find your trim? You can enter the engine size yourself in the car-import planner.</p>
        </div>
      </section>
    </>
  );
}
