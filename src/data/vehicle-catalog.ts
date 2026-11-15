type EngineVariant = {
  id: string;
  label: string;
  cc: number;
  fuel: "Petrol" | "Diesel" | "Hybrid" | "Plug-in hybrid" | "Electric" | "LPG" | "CNG";
  years: string;
  note?: string;
};

type VehicleModel = { name: string; engines: EngineVariant[] };
type VehicleMake = { name: string; models: VehicleModel[] };

// Common variants found across popular used-car import markets.
// Engine choices vary by model year, trim and market. This is not a complete VIN-level catalogue.
const e = (id: string, label: string, cc: number, fuel: EngineVariant["fuel"], years: string, note?: string): EngineVariant =>
  ({ id, label, cc, fuel, years, note });


const u = (id: string, label: string, fuel: EngineVariant["fuel"]): EngineVariant =>
  e(id, label, 0, fuel, "varies by year and market", "Exact engine displacement is not fixed for this model. Enter the capacity shown in the vehicle documents before calculating import tax.");

const baseVehicleCatalog: VehicleMake[] = [
  { name: "Toyota", models: [
    { name: "Prius", engines: [
      e("prius-18h", "1.8 Hybrid", 1798, "Hybrid", "2009–2022"),
      e("prius-20h", "2.0 Hybrid", 1987, "Hybrid", "2023 onward"),
      e("prius-15h", "1.5 Hybrid", 1497, "Hybrid", "2003–2009"),
    ] },
    { name: "Camry", engines: [
      e("camry-25", "2.5 Petrol", 2487, "Petrol", "2010 onward"),
      e("camry-35", "3.5 V6 Petrol", 3456, "Petrol", "2007 onward"),
      e("camry-25h", "2.5 Hybrid", 2487, "Hybrid", "2007 onward"),
      e("camry-20", "2.0 Petrol", 1987, "Petrol", "selected markets"),
    ] },
    { name: "Corolla", engines: [
      e("corolla-18", "1.8 Petrol", 1798, "Petrol", "2000 onward"),
      e("corolla-20", "2.0 Petrol", 1987, "Petrol", "selected markets"),
      e("corolla-18h", "1.8 Hybrid", 1798, "Hybrid", "2018 onward"),
      e("corolla-16", "1.6 Petrol", 1598, "Petrol", "selected markets"),
    ] },
    { name: "RAV4", engines: [
      e("rav4-25", "2.5 Petrol", 2487, "Petrol", "2013 onward"),
      e("rav4-25h", "2.5 Hybrid", 2487, "Hybrid", "2016 onward"),
      e("rav4-20", "2.0 Petrol", 1987, "Petrol", "selected markets"),
      e("rav4-22d", "2.2 Diesel", 2231, "Diesel", "older generations"),
    ] },
    { name: "Aqua / Prius C", engines: [
      e("aqua-15h", "1.5 Hybrid", 1496, "Hybrid", "2011–2021"),
    ] },
    { name: "Land Cruiser Prado", engines: [
      e("prado-27", "2.7 Petrol", 2693, "Petrol", "multiple generations"),
      e("prado-40", "4.0 V6 Petrol", 3956, "Petrol", "multiple generations"),
      e("prado-28d", "2.8 Diesel", 2755, "Diesel", "2015 onward"),
      e("prado-30d", "3.0 Diesel", 2982, "Diesel", "older generations"),
      ] }
  ]},
  { name: "Honda", models: [
    { name: "Fit / Jazz", engines: [
      e("fit-13", "1.3 Petrol", 1339, "Petrol", "2001–2020"),
      e("fit-15", "1.5 Petrol", 1496, "Petrol", "2001 onward"),
      e("fit-15h", "1.5 Hybrid", 1496, "Hybrid", "2013 onward"),
    ] },
    { name: "Civic", engines: [
      e("civic-20", "2.0 Petrol", 1996, "Petrol", "2016 onward"),
      e("civic-15t", "1.5 Turbo Petrol", 1498, "Petrol", "2016 onward"),
      e("civic-18", "1.8 Petrol", 1799, "Petrol", "2006–2015"),
      e("civic-16d", "1.6 Diesel", 1597, "Diesel", "selected markets"),
    ] },
    { name: "Accord", engines: [
      e("accord-24", "2.4 Petrol", 2354, "Petrol", "older generations"),
      e("accord-15t", "1.5 Turbo Petrol", 1498, "Petrol", "2018 onward"),
      e("accord-20t", "2.0 Turbo Petrol", 1996, "Petrol", "2018 onward"),
      e("accord-20h", "2.0 Hybrid", 1993, "Hybrid", "2014 onward"),
    ] },
    { name: "CR-V", engines: [
      e("crv-24", "2.4 Petrol", 2354, "Petrol", "older generations"),
      e("crv-15t", "1.5 Turbo Petrol", 1498, "Petrol", "2017 onward"),
      e("crv-20h", "2.0 Hybrid", 1993, "Hybrid", "selected markets"),
      e("crv-16d", "1.6 Diesel", 1597, "Diesel", "selected markets"),
      ] }
  ]},
  { name: "BMW", models: [
    { name: "3 Series", engines: [
      e("bmw-318i", "318i · 2.0 Petrol", 1995, "Petrol", "varies by generation"),
      e("bmw-320i", "320i · 2.0 Petrol", 1998, "Petrol", "varies by generation"),
      e("bmw-330i", "330i · 2.0 Petrol", 1998, "Petrol", "varies by generation"),
      e("bmw-340i", "340i · 3.0 Petrol", 2998, "Petrol", "2015–2019"),
      e("bmw-320d", "320d · 2.0 Diesel", 1995, "Diesel", "varies by generation"),
      e("bmw-330d", "330d · 3.0 Diesel", 2993, "Diesel", "varies by generation"),
    ] },
    { name: "5 Series", engines: [
      e("bmw-520i", "520i · 2.0 Petrol", 1998, "Petrol", "varies by generation"),
      e("bmw-530i", "530i · Petrol · capacity varies", 0, "Petrol", "varies by generation", "Enter the exact engine capacity from the vehicle documents before using the estimate."),
      e("bmw-540i", "540i · Petrol · capacity varies", 0, "Petrol", "varies by generation", "Enter the exact engine capacity from the vehicle documents before using the estimate."),
      e("bmw-520d", "520d · 2.0 Diesel", 1995, "Diesel", "varies by generation"),
      e("bmw-530d", "530d · 3.0 Diesel", 2993, "Diesel", "varies by generation"),
    ] },
    { name: "X3", engines: [
      e("bmw-x3-20i", "20i · 2.0 Petrol", 1998, "Petrol", "varies by generation"),
      e("bmw-x3-30i", "30i · Petrol · capacity varies", 0, "Petrol", "varies by generation", "Enter the exact engine capacity from the vehicle documents before using the estimate."),
      e("bmw-x3-20d", "20d · 2.0 Diesel", 1995, "Diesel", "varies by generation"),
      e("bmw-x3-30d", "30d · 3.0 Diesel", 2993, "Diesel", "varies by generation"),
      ] }
  ]},
  { name: "Mercedes-Benz", models: [
    { name: "C-Class", engines: [
      e("mb-c180", "C 180 · Petrol · capacity varies", 0, "Petrol", "varies by year", "Enter the exact engine capacity from the vehicle documents before using the estimate."),
      e("mb-c200", "C 200 · Petrol · capacity varies", 0, "Petrol", "varies by year", "Enter the exact engine capacity from the vehicle documents before using the estimate."),
      e("mb-c300", "C 300 · Petrol · capacity varies", 0, "Petrol", "varies by year", "Enter the exact engine capacity from the vehicle documents before using the estimate."),
      e("mb-c220d", "C 220 d · Diesel · capacity varies", 0, "Diesel", "varies by year", "Enter the exact engine capacity from the vehicle documents before using the estimate."),
    ] },
    { name: "E-Class", engines: [
      e("mb-e200", "E 200 · 2.0 Petrol", 1991, "Petrol", "varies by generation"),
      e("mb-e300", "E 300 · Petrol · capacity varies", 0, "Petrol", "varies by year", "Enter the exact engine capacity from the vehicle documents before using the estimate."),
      e("mb-e350", "E 350 · Petrol · capacity varies", 0, "Petrol", "varies by year", "Enter the exact engine capacity from the vehicle documents before using the estimate."),
      e("mb-e220d", "E 220 d · Diesel · capacity varies", 0, "Diesel", "varies by year", "Enter the exact engine capacity from the vehicle documents before using the estimate."),
      e("mb-e350d", "E 350 d · 3.0 Diesel", 2987, "Diesel", "varies by generation"),
    ] },
    { name: "GLC", engines: [
      e("mb-glc300", "GLC 300 · 2.0 Petrol", 1991, "Petrol", "2016 onward"),
      e("mb-glc220d", "GLC 220 d · Diesel · capacity varies", 0, "Diesel", "varies by year", "Enter the exact engine capacity from the vehicle documents before using the estimate."),
      e("mb-glc300d", "GLC 300 d · Diesel · capacity varies", 0, "Diesel", "varies by year", "Enter the exact engine capacity from the vehicle documents before using the estimate."),
      ] }
  ]},
  { name: "Volkswagen", models: [
    { name: "Golf", engines: [
      e("vw-golf-14t", "1.4 TSI Petrol", 1395, "Petrol", "selected generations"),
      e("vw-golf-15t", "1.5 TSI Petrol", 1498, "Petrol", "2017 onward"),
      e("vw-golf-20t", "2.0 TSI Petrol", 1984, "Petrol", "GTI / selected trims"),
      e("vw-golf-20d", "2.0 TDI Diesel", 1968, "Diesel", "selected generations"),
      e("vw-golf-16d", "1.6 TDI Diesel", 1598, "Diesel", "selected generations"),
    ] },
    { name: "Passat", engines: [
      e("vw-passat-14t", "1.4 TSI Petrol", 1395, "Petrol", "selected generations"),
      e("vw-passat-18t", "1.8 TSI Petrol", 1798, "Petrol", "selected generations"),
      e("vw-passat-20t", "2.0 TSI Petrol", 1984, "Petrol", "selected generations"),
      e("vw-passat-20d", "2.0 TDI Diesel", 1968, "Diesel", "selected generations"),
    ] },
    { name: "Tiguan", engines: [
      e("vw-tiguan-14t", "1.4 TSI Petrol", 1395, "Petrol", "selected generations"),
      e("vw-tiguan-20t", "2.0 TSI Petrol", 1984, "Petrol", "selected generations"),
      e("vw-tiguan-20d", "2.0 TDI Diesel", 1968, "Diesel", "selected generations"),
      ] }
  ]},
  { name: "Audi", models: [
    { name: "A4", engines: [
      e("audi-a4-20t", "2.0 TFSI Petrol", 1984, "Petrol", "selected generations"),
      e("audi-a4-30t", "3.0 TFSI Petrol", 2995, "Petrol", "selected trims"),
      e("audi-a4-20d", "2.0 TDI Diesel", 1968, "Diesel", "selected generations"),
    ] },
    { name: "A6", engines: [
      e("audi-a6-20t", "2.0 TFSI Petrol", 1984, "Petrol", "selected generations"),
      e("audi-a6-30t", "3.0 TFSI Petrol", 2995, "Petrol", "selected generations"),
      e("audi-a6-20d", "2.0 TDI Diesel", 1968, "Diesel", "selected generations"),
      e("audi-a6-30d", "3.0 TDI Diesel", 2967, "Diesel", "selected generations"),
    ] },
    { name: "Q5", engines: [
      e("audi-q5-20t", "2.0 TFSI Petrol", 1984, "Petrol", "selected generations"),
      e("audi-q5-30t", "3.0 TFSI Petrol", 2995, "Petrol", "selected trims"),
      e("audi-q5-20d", "2.0 TDI Diesel", 1968, "Diesel", "selected generations"),
      ] }
  ]},
  { name: "Hyundai", models: [
    { name: "Elantra", engines: [
      e("hy-el-16", "1.6 Petrol", 1591, "Petrol", "selected markets"),
      e("hy-el-20", "2.0 Petrol", 1999, "Petrol", "selected markets"),
      e("hy-el-16d", "1.6 Diesel", 1582, "Diesel", "selected markets"),
      e("hy-el-16h", "1.6 Hybrid", 1580, "Hybrid", "selected markets"),
    ] },
    { name: "Sonata", engines: [
      e("hy-son-24", "2.4 Petrol", 2359, "Petrol", "older generations"),
      e("hy-son-20t", "2.0 Turbo Petrol", 1998, "Petrol", "selected generations"),
      e("hy-son-20h", "2.0 Hybrid", 1999, "Hybrid", "selected generations"),
    ] },
    { name: "Tucson", engines: [
      e("hy-tuc-20", "2.0 Petrol", 1999, "Petrol", "selected markets"),
      e("hy-tuc-16t", "1.6 Turbo Petrol", 1591, "Petrol", "selected generations"),
      e("hy-tuc-20d", "2.0 Diesel", 1995, "Diesel", "selected markets"),
      e("hy-tuc-16h", "1.6 Hybrid", 1598, "Hybrid", "selected generations"),
      ] }
  ]},
  { name: "Kia", models: [
    { name: "Sportage", engines: [
      e("kia-sp-20", "2.0 Petrol", 1999, "Petrol", "selected markets"),
      e("kia-sp-24", "2.4 Petrol", 2359, "Petrol", "selected generations"),
      e("kia-sp-16t", "1.6 Turbo Petrol", 1591, "Petrol", "selected generations"),
      e("kia-sp-20d", "2.0 Diesel", 1995, "Diesel", "selected markets"),
      e("kia-sp-16h", "1.6 Hybrid", 1598, "Hybrid", "selected generations"),
    ] },
    { name: "Optima / K5", engines: [
      e("kia-op-24", "2.4 Petrol", 2359, "Petrol", "selected generations"),
      e("kia-op-20t", "2.0 Turbo Petrol", 1998, "Petrol", "selected generations"),
      e("kia-op-20h", "2.0 Hybrid", 1999, "Hybrid", "selected generations"),
    ] },
    { name: "Sorento", engines: [
      e("kia-so-24", "2.4 Petrol", 2359, "Petrol", "selected generations"),
      e("kia-so-33", "3.3 V6 Petrol", 3342, "Petrol", "selected generations"),
      e("kia-so-22d", "2.2 Diesel", 2199, "Diesel", "selected generations"),
      e("kia-so-16h", "1.6 Hybrid", 1598, "Hybrid", "selected generations"),
      ] }
  ]},
  { name: "Lexus", models: [
    { name: "RX", engines: [
      e("lex-rx-35", "3.5 V6 Petrol", 3456, "Petrol", "older generations"),
      e("lex-rx-20t", "2.0 Turbo Petrol", 1998, "Petrol", "selected generations"),
      e("lex-rx-35h", "3.5 Hybrid", 3456, "Hybrid", "older generations"),
      e("lex-rx-25h", "2.5 Hybrid", 2487, "Hybrid", "selected generations"),
    ] },
    { name: "IS", engines: [
      e("lex-is-25", "2.5 V6 Petrol", 2499, "Petrol", "selected generations"),
      e("lex-is-35", "3.5 V6 Petrol", 3456, "Petrol", "selected generations"),
      e("lex-is-20t", "2.0 Turbo Petrol", 1998, "Petrol", "selected generations"),
    ] },
    { name: "NX", engines: [
      e("lex-nx-20t", "2.0 Turbo Petrol", 1998, "Petrol", "2015 onward"),
      e("lex-nx-25h", "2.5 Hybrid", 2487, "Hybrid", "2015 onward"),
      ] }
  ]},
  { name: "Nissan", models: [
    { name: "Altima", engines: [
      e("nis-alt-25", "2.5 Petrol", 2488, "Petrol", "2002 onward"),
      e("nis-alt-35", "3.5 V6 Petrol", 3498, "Petrol", "selected generations"),
      e("nis-alt-20t", "2.0 VC-Turbo Petrol", 1997, "Petrol", "selected generations"),
    ] },
    { name: "X-Trail / Rogue", engines: [
      e("nis-x-25", "2.5 Petrol", 2488, "Petrol", "selected generations"),
      e("nis-x-20h", "2.0 Hybrid", 1997, "Hybrid", "selected markets"),
      e("nis-x-15t", "1.5 VC-Turbo", 1497, "Petrol", "selected recent models"),
    ] },
    { name: "Leaf", engines: [
      e("nis-leaf-ev", "Electric motor", 0, "Electric", "all generations", "A limited electric-vehicle estimate is included; confirm the current treatment and vehicle classification with the Revenue Service."),
      ] }
  ]},
  { name: "Mazda", models: [
    { name: "Mazda3", engines: [
      e("maz-3-15", "1.5 Petrol", 1496, "Petrol", "selected markets"),
      e("maz-3-20", "2.0 Petrol", 1998, "Petrol", "selected generations"),
      e("maz-3-25", "2.5 Petrol", 2488, "Petrol", "selected markets"),
      e("maz-3-22d", "2.2 Diesel", 2191, "Diesel", "selected markets"),
    ] },
    { name: "CX-5", engines: [
      e("maz-cx5-20", "2.0 Petrol", 1998, "Petrol", "selected markets"),
      e("maz-cx5-25", "2.5 Petrol", 2488, "Petrol", "selected markets"),
      e("maz-cx5-22d", "2.2 Diesel", 2191, "Diesel", "selected markets"),
      ] }
  ]},
  { name: "Subaru", models: [
    { name: "Forester", engines: [
      e("sub-for-20", "2.0 Petrol", 1995, "Petrol", "selected generations"),
      e("sub-for-25", "2.5 Petrol", 2498, "Petrol", "selected markets"),
      e("sub-for-20d", "2.0 Diesel", 1998, "Diesel", "selected markets"),
      e("sub-for-20h", "2.0 Hybrid", 1995, "Hybrid", "selected markets"),
    ] },
    { name: "Impreza", engines: [
      e("sub-imp-16", "1.6 Petrol", 1599, "Petrol", "selected markets"),
      e("sub-imp-20", "2.0 Petrol", 1995, "Petrol", "selected generations"),
      e("sub-imp-25t", "2.5 Turbo Petrol", 2457, "Petrol", "WRX / selected trims"),
      ] }
  ]},
  { name: "Ford", models: [
    { name: "Fusion / Mondeo", engines: [
      e("ford-fus-15t", "1.5 EcoBoost Petrol", 1498, "Petrol", "selected generations"),
      e("ford-fus-20t", "2.0 EcoBoost Petrol", 1999, "Petrol", "selected generations"),
      e("ford-fus-25", "2.5 Petrol", 2488, "Petrol", "selected markets"),
      e("ford-fus-20h", "2.0 Hybrid", 1999, "Hybrid", "selected generations"),
      e("ford-mon-20d", "2.0 TDCi Diesel", 1997, "Diesel", "selected generations"),
    ] },
    { name: "Escape / Kuga", engines: [
      e("ford-esc-15t", "1.5 EcoBoost Petrol", 1498, "Petrol", "selected generations"),
      e("ford-esc-20t", "2.0 EcoBoost Petrol", 1999, "Petrol", "selected generations"),
      e("ford-esc-25h", "2.5 Hybrid", 2488, "Hybrid", "selected generations"),
      e("ford-esc-20d", "2.0 Diesel", 1997, "Diesel", "selected markets"),
      ] }
  ]},
  { name: "Chevrolet", models: [
    { name: "Cruze", engines: [
      e("chev-cr-14t", "1.4 Turbo Petrol", 1364, "Petrol", "selected generations"),
      e("chev-cr-18", "1.8 Petrol", 1796, "Petrol", "selected generations"),
      e("chev-cr-16d", "1.6 Diesel", 1598, "Diesel", "selected markets"),
    ] },
    { name: "Malibu", engines: [
      e("chev-mal-15t", "1.5 Turbo Petrol", 1490, "Petrol", "selected generations"),
      e("chev-mal-20t", "2.0 Turbo Petrol", 1998, "Petrol", "selected generations"),
      e("chev-mal-25", "2.5 Petrol", 2457, "Petrol", "selected generations"),
      e("chev-mal-18h", "1.8 Hybrid", 1796, "Hybrid", "selected generations"),
      ] }
  ]},
  { name: "Volvo", models: [
    { name: "S60", engines: [
      e("vol-s60-20t", "2.0 Turbo Petrol", 1969, "Petrol", "2011 onward"),
      e("vol-s60-20d", "2.0 Diesel", 1969, "Diesel", "selected generations"),
      e("vol-s60-24d", "2.4 Diesel", 2400, "Diesel", "older generations"),
      e("vol-s60-20h", "2.0 Plug-in hybrid", 1969, "Plug-in hybrid", "selected recent models"),
    ] },
    { name: "XC60", engines: [
      e("vol-xc60-20t", "2.0 Turbo Petrol", 1969, "Petrol", "2010 onward"),
      e("vol-xc60-20d", "2.0 Diesel", 1969, "Diesel", "selected generations"),
      e("vol-xc60-24d", "2.4 Diesel", 2400, "Diesel", "older generations"),
      e("vol-xc60-20h", "2.0 Plug-in hybrid", 1969, "Plug-in hybrid", "selected recent models"),
      ] }
  ]},
  { name: "Mitsubishi", models: [
    { name: "Outlander", engines: [
      e("mit-out-20", "2.0 Petrol", 1998, "Petrol", "selected generations"),
      e("mit-out-24", "2.4 Petrol", 2360, "Petrol", "selected generations"),
      e("mit-out-20d", "2.0 Diesel", 1968, "Diesel", "selected markets"),
      e("mit-out-24phev", "2.4 Plug-in hybrid", 2360, "Plug-in hybrid", "selected recent models"),
    ] },
    { name: "Lancer", engines: [
      e("mit-lan-16", "1.6 Petrol", 1590, "Petrol", "selected markets"),
      e("mit-lan-18", "1.8 Petrol", 1798, "Petrol", "selected generations"),
      e("mit-lan-20", "2.0 Petrol", 1998, "Petrol", "selected generations"),
      e("mit-lan-20t", "2.0 Turbo Petrol", 1998, "Petrol", "Evolution trims"),
    ] },
    { name: "Pajero", engines: [
      e("mit-paj-30", "3.0 V6 Petrol", 2972, "Petrol", "selected generations"),
      e("mit-paj-35", "3.5 V6 Petrol", 3497, "Petrol", "selected generations"),
      e("mit-paj-38", "3.8 V6 Petrol", 3828, "Petrol", "selected generations"),
      e("mit-paj-32d", "3.2 Diesel", 3200, "Diesel", "selected generations"),
      ] }
  ]},
  { name: "Jeep", models: [
    { name: "Grand Cherokee", engines: [
      e("jeep-gc-36", "3.6 V6 Petrol", 3604, "Petrol", "2011 onward"),
      e("jeep-gc-57", "5.7 V8 Petrol", 5654, "Petrol", "selected trims"),
      e("jeep-gc-30d", "3.0 Diesel", 2987, "Diesel", "selected generations"),
      e("jeep-gc-20t", "2.0 Turbo Petrol", 1995, "Petrol", "selected recent models"),
    ] },
    { name: "Wrangler", engines: [
      e("jeep-wr-36", "3.6 V6 Petrol", 3604, "Petrol", "2012 onward"),
      e("jeep-wr-20t", "2.0 Turbo Petrol", 1995, "Petrol", "2018 onward"),
      e("jeep-wr-38", "3.8 V6 Petrol", 3778, "Petrol", "older generations"),
      e("jeep-wr-20phev", "2.0 Plug-in hybrid", 1995, "Plug-in hybrid", "4xe models"),
      ] }
  ]},
  { name: "Porsche", models: [
    { name: "Cayenne", engines: [
      e("por-cay-30t", "3.0 Turbo V6", 2995, "Petrol", "selected generations"),
      e("por-cay-36", "3.6 V6", 3598, "Petrol", "older generations"),
      e("por-cay-48", "4.8 V8", 4806, "Petrol", "older generations"),
      e("por-cay-30h", "3.0 Plug-in hybrid", 2995, "Plug-in hybrid", "selected generations"),
    ] },
    { name: "Macan", engines: [
      e("por-mac-20t", "2.0 Turbo Petrol", 1984, "Petrol", "selected generations"),
      e("por-mac-30t", "3.0 Turbo V6", 2997, "Petrol", "selected generations"),
      e("por-mac-36t", "3.6 Turbo V6", 3604, "Petrol", "selected trims"),
    ] },
    { name: "Panamera", engines: [
      e("por-pan-29t", "2.9 Turbo V6", 2894, "Petrol", "selected generations"),
      e("por-pan-36", "3.6 V6", 3605, "Petrol", "older generations"),
      e("por-pan-48", "4.8 V8", 4806, "Petrol", "older generations"),
      e("por-pan-29h", "2.9 Plug-in hybrid", 2894, "Plug-in hybrid", "selected generations"),
      ] }
  ]},
  { name: "Infiniti", models: [
    { name: "Q50", engines: [
      e("inf-q50-20t", "2.0 Turbo Petrol", 1991, "Petrol", "selected markets"),
      e("inf-q50-30t", "3.0 Twin-turbo V6", 2997, "Petrol", "2016 onward"),
      e("inf-q50-37", "3.7 V6", 3696, "Petrol", "selected markets"),
      e("inf-q50-35h", "3.5 Hybrid", 3498, "Hybrid", "selected generations"),
    ] },
    { name: "QX60", engines: [
      e("inf-qx60-35", "3.5 V6 Petrol", 3498, "Petrol", "selected generations"),
      e("inf-qx60-25h", "2.5 Hybrid", 2488, "Hybrid", "older generations"),
      e("inf-qx60-20t", "2.0 VC-Turbo Petrol", 1997, "Petrol", "selected recent models"),
      ] }
  ]},
  { name: "Suzuki", models: [
    { name: "Swift", engines: [
      e("suz-sw-12", "1.2 Petrol", 1242, "Petrol", "selected generations"),
      e("suz-sw-13", "1.3 Petrol", 1328, "Petrol", "older generations"),
      e("suz-sw-14t", "1.4 Turbo Petrol", 1373, "Petrol", "Sport trims"),
      e("suz-sw-12h", "1.2 Mild hybrid", 1197, "Hybrid", "selected recent models"),
    ] },
    { name: "Vitara", engines: [
      e("suz-vit-16", "1.6 Petrol", 1586, "Petrol", "selected generations"),
      e("suz-vit-14t", "1.4 Turbo Petrol", 1373, "Petrol", "selected generations"),
      e("suz-vit-16d", "1.6 Diesel", 1598, "Diesel", "selected markets"),
      ] }
  ]},
  { name: "Škoda", models: [
    { name: "Octavia", engines: [
      e("sko-oct-14t", "1.4 TSI Petrol", 1395, "Petrol", "selected generations"),
      e("sko-oct-15t", "1.5 TSI Petrol", 1498, "Petrol", "2017 onward"),
      e("sko-oct-20t", "2.0 TSI Petrol", 1984, "Petrol", "selected trims"),
      e("sko-oct-20d", "2.0 TDI Diesel", 1968, "Diesel", "selected generations"),
      e("sko-oct-16d", "1.6 TDI Diesel", 1598, "Diesel", "selected generations"),
    ] },
    { name: "Superb", engines: [
      e("sko-sup-14t", "1.4 TSI Petrol", 1395, "Petrol", "selected generations"),
      e("sko-sup-20t", "2.0 TSI Petrol", 1984, "Petrol", "selected generations"),
      e("sko-sup-20d", "2.0 TDI Diesel", 1968, "Diesel", "selected generations"),
      ] }
  ]},
  { name: "Opel", models: [
    { name: "Astra", engines: [
      e("op-as-14t", "1.4 Turbo Petrol", 1399, "Petrol", "selected generations"),
      e("op-as-16", "1.6 Petrol", 1598, "Petrol", "selected generations"),
      e("op-as-16d", "1.6 Diesel", 1598, "Diesel", "selected generations"),
      e("op-as-20d", "2.0 Diesel", 1956, "Diesel", "selected generations"),
    ] },
    { name: "Insignia", engines: [
      e("op-in-16t", "1.6 Turbo Petrol", 1598, "Petrol", "selected generations"),
      e("op-in-20t", "2.0 Turbo Petrol", 1998, "Petrol", "selected generations"),
      e("op-in-20d", "2.0 Diesel", 1956, "Diesel", "selected generations"),
      ] }
  ]},
  { name: "Peugeot", models: [
    { name: "3008", engines: [
      e("peu-3008-12t", "1.2 PureTech Petrol", 1199, "Petrol", "selected generations"),
      e("peu-3008-16t", "1.6 THP Petrol", 1598, "Petrol", "selected generations"),
      e("peu-3008-16d", "1.6 BlueHDi Diesel", 1560, "Diesel", "selected generations"),
      e("peu-3008-20d", "2.0 BlueHDi Diesel", 1997, "Diesel", "selected generations"),
      e("peu-3008-16h", "1.6 Plug-in hybrid", 1598, "Plug-in hybrid", "selected recent models"),
    ] },
    { name: "508", engines: [
      e("peu-508-12t", "1.2 PureTech Petrol", 1199, "Petrol", "selected generations"),
      e("peu-508-16t", "1.6 THP Petrol", 1598, "Petrol", "selected generations"),
      e("peu-508-20d", "2.0 Diesel", 1997, "Diesel", "selected generations"),
      ] }
  ]},
  { name: "Renault", models: [
    { name: "Megane", engines: [
      e("ren-meg-12t", "1.2 TCe Petrol", 1197, "Petrol", "selected generations"),
      e("ren-meg-13t", "1.3 TCe Petrol", 1330, "Petrol", "2018 onward"),
      e("ren-meg-16", "1.6 Petrol", 1598, "Petrol", "selected generations"),
      e("ren-meg-15d", "1.5 dCi Diesel", 1461, "Diesel", "selected generations"),
    ] },
    { name: "Kadjar", engines: [
      e("ren-kad-12t", "1.2 TCe Petrol", 1197, "Petrol", "selected generations"),
      e("ren-kad-13t", "1.3 TCe Petrol", 1330, "Petrol", "selected generations"),
      e("ren-kad-15d", "1.5 dCi Diesel", 1461, "Diesel", "selected generations"),
      e("ren-kad-16d", "1.6 dCi Diesel", 1598, "Diesel", "selected generations"),
      ] }
  ]},
  { name: "Land Rover", models: [
    { name: "Range Rover Sport", engines: [
      e("lr-rs-30s", "3.0 Supercharged Petrol", 2995, "Petrol", "selected generations"),
      e("lr-rs-50s", "5.0 Supercharged V8", 5000, "Petrol", "selected generations"),
      e("lr-rs-30d", "3.0 Diesel", 2993, "Diesel", "selected generations"),
      e("lr-rs-30phev", "3.0 Plug-in hybrid", 2996, "Plug-in hybrid", "selected recent models"),
    ] },
    { name: "Discovery", engines: [
      e("lr-dis-30s", "3.0 Supercharged Petrol", 2995, "Petrol", "selected generations"),
      e("lr-dis-30d", "3.0 Diesel", 2993, "Diesel", "selected generations"),
      e("lr-dis-20d", "2.0 Diesel", 1999, "Diesel", "selected generations"),
      ] }
  ]},
  { name: "Tesla", models: [
    { name: "Model 3", engines: [
      e("tesla-m3-ev", "Electric motor", 0, "Electric", "all generations", "A limited electric-vehicle estimate is included; confirm the current treatment and vehicle classification with the Revenue Service."),
    ] },
    { name: "Model Y", engines: [
      e("tesla-my-ev", "Electric motor", 0, "Electric", "all generations", "A limited electric-vehicle estimate is included; confirm the current treatment and vehicle classification with the Revenue Service."),
      ] }
  ]},
  { name: "Acura", models: [
    { name: "MDX", engines: [u("acura-mdx-p","Petrol · capacity varies","Petrol"), u("acura-mdx-h","Hybrid · capacity varies","Hybrid")] },
    { name: "RDX", engines: [u("acura-rdx-p","Petrol · capacity varies","Petrol")] },
    { name: "TLX", engines: [u("acura-tlx-p","Petrol · capacity varies","Petrol")] },
    { name: "ILX", engines: [u("acura-ilx-p","Petrol · capacity varies","Petrol"), u("acura-ilx-h","Hybrid · capacity varies","Hybrid")] }
  ]},
  { name: "Alfa Romeo", models: [
    { name: "Giulia", engines: [u("alfa-giulia-p","Petrol · capacity varies","Petrol"), u("alfa-giulia-d","Diesel · capacity varies","Diesel")] },
    { name: "Stelvio", engines: [u("alfa-stelvio-p","Petrol · capacity varies","Petrol"), u("alfa-stelvio-d","Diesel · capacity varies","Diesel")] },
    { name: "Tonale", engines: [u("alfa-tonale-p","Petrol · capacity varies","Petrol"), u("alfa-tonale-h","Plug-in hybrid · capacity varies","Plug-in hybrid")] }
  ]},
  { name: "BYD", models: [
    { name: "Atto 3", engines: [u("byd-atto3-ev","Electric motor","Electric")] },
    { name: "Dolphin", engines: [u("byd-dolphin-ev","Electric motor","Electric")] },
    { name: "Han", engines: [u("byd-han-ev","Electric motor","Electric"), u("byd-han-phev","Plug-in hybrid · capacity varies","Plug-in hybrid")] },
    { name: "Seal", engines: [u("byd-seal-ev","Electric motor","Electric")] },
    { name: "Song Plus", engines: [u("byd-song-phev","Plug-in hybrid · capacity varies","Plug-in hybrid"), u("byd-song-ev","Electric motor","Electric")] },
    { name: "Tang", engines: [u("byd-tang-ev","Electric motor","Electric"), u("byd-tang-phev","Plug-in hybrid · capacity varies","Plug-in hybrid")] },
    { name: "Qin", engines: [u("byd-qin-phev","Plug-in hybrid · capacity varies","Plug-in hybrid")] }
  ]},
  { name: "Buick", models: [
    { name: "Encore", engines: [u("buick-encore-p","Petrol · capacity varies","Petrol")] },
    { name: "Envision", engines: [u("buick-envision-p","Petrol · capacity varies","Petrol")] },
    { name: "Enclave", engines: [u("buick-enclave-p","Petrol · capacity varies","Petrol")] },
    { name: "Regal", engines: [u("buick-regal-p","Petrol · capacity varies","Petrol"), u("buick-regal-d","Diesel · capacity varies","Diesel")] }
  ]},
  { name: "Cadillac", models: [
    { name: "ATS", engines: [u("cad-ats-p","Petrol · capacity varies","Petrol")] },
    { name: "CTS", engines: [u("cad-cts-p","Petrol · capacity varies","Petrol")] },
    { name: "CT5", engines: [u("cad-ct5-p","Petrol · capacity varies","Petrol")] },
    { name: "XT4", engines: [u("cad-xt4-p","Petrol · capacity varies","Petrol")] },
    { name: "XT5", engines: [u("cad-xt5-p","Petrol · capacity varies","Petrol")] },
    { name: "Escalade", engines: [u("cad-escalade-p","Petrol · capacity varies","Petrol"), u("cad-escalade-d","Diesel · capacity varies","Diesel")] }
  ]},
  { name: "Chery", models: [
    { name: "Tiggo 4", engines: [u("chery-t4-p","Petrol · capacity varies","Petrol")] },
    { name: "Tiggo 7", engines: [u("chery-t7-p","Petrol · capacity varies","Petrol"), u("chery-t7-phev","Plug-in hybrid · capacity varies","Plug-in hybrid")] },
    { name: "Tiggo 8", engines: [u("chery-t8-p","Petrol · capacity varies","Petrol"), u("chery-t8-phev","Plug-in hybrid · capacity varies","Plug-in hybrid")] },
    { name: "Arrizo 5", engines: [u("chery-a5-p","Petrol · capacity varies","Petrol")] },
    { name: "Arrizo 8", engines: [u("chery-a8-p","Petrol · capacity varies","Petrol"), u("chery-a8-phev","Plug-in hybrid · capacity varies","Plug-in hybrid")] }
  ]},
  { name: "Chrysler", models: [
    { name: "300", engines: [u("chrysler-300-p","Petrol · capacity varies","Petrol")] },
    { name: "200", engines: [u("chrysler-200-p","Petrol · capacity varies","Petrol")] },
    { name: "Pacifica", engines: [u("chrysler-pac-p","Petrol · capacity varies","Petrol"), u("chrysler-pac-phev","Plug-in hybrid · capacity varies","Plug-in hybrid")] }
  ]},
  { name: "Dodge", models: [
    { name: "Charger", engines: [u("dodge-charger-p","Petrol · capacity varies","Petrol")] },
    { name: "Challenger", engines: [u("dodge-challenger-p","Petrol · capacity varies","Petrol")] },
    { name: "Durango", engines: [u("dodge-durango-p","Petrol · capacity varies","Petrol"), u("dodge-durango-d","Diesel · capacity varies","Diesel")] },
    { name: "Journey", engines: [u("dodge-journey-p","Petrol · capacity varies","Petrol")] }
  ]},
  { name: "Genesis", models: [
    { name: "G70", engines: [u("genesis-g70-p","Petrol · capacity varies","Petrol"), u("genesis-g70-d","Diesel · capacity varies","Diesel")] },
    { name: "G80", engines: [u("genesis-g80-p","Petrol · capacity varies","Petrol"), u("genesis-g80-d","Diesel · capacity varies","Diesel"), u("genesis-g80-ev","Electric motor","Electric")] },
    { name: "G90", engines: [u("genesis-g90-p","Petrol · capacity varies","Petrol")] },
    { name: "GV70", engines: [u("genesis-gv70-p","Petrol · capacity varies","Petrol"), u("genesis-gv70-d","Diesel · capacity varies","Diesel"), u("genesis-gv70-ev","Electric motor","Electric")] },
    { name: "GV80", engines: [u("genesis-gv80-p","Petrol · capacity varies","Petrol"), u("genesis-gv80-d","Diesel · capacity varies","Diesel")] }
  ]},
  { name: "Geely", models: [
    { name: "Coolray", engines: [u("geely-coolray-p","Petrol · capacity varies","Petrol")] },
    { name: "Atlas / Boyue", engines: [u("geely-atlas-p","Petrol · capacity varies","Petrol"), u("geely-atlas-h","Hybrid · capacity varies","Hybrid")] },
    { name: "Monjaro", engines: [u("geely-monjaro-p","Petrol · capacity varies","Petrol"), u("geely-monjaro-h","Hybrid · capacity varies","Hybrid")] },
    { name: "Emgrand", engines: [u("geely-emgrand-p","Petrol · capacity varies","Petrol")] },
    { name: "Geometry C", engines: [u("geely-geometry-c-ev","Electric motor","Electric")] }
  ]},
  { name: "GMC", models: [
    { name: "Terrain", engines: [u("gmc-terrain-p","Petrol · capacity varies","Petrol"), u("gmc-terrain-d","Diesel · capacity varies","Diesel")] },
    { name: "Acadia", engines: [u("gmc-acadia-p","Petrol · capacity varies","Petrol")] },
    { name: "Yukon", engines: [u("gmc-yukon-p","Petrol · capacity varies","Petrol"), u("gmc-yukon-d","Diesel · capacity varies","Diesel")] },
    { name: "Sierra", engines: [u("gmc-sierra-p","Petrol · capacity varies","Petrol"), u("gmc-sierra-d","Diesel · capacity varies","Diesel")] }
  ]},
  { name: "Great Wall", models: [
    { name: "Haval H6", engines: [u("gwm-h6-p","Petrol · capacity varies","Petrol"), u("gwm-h6-h","Hybrid · capacity varies","Hybrid")] },
    { name: "Haval Jolion", engines: [u("gwm-jolion-p","Petrol · capacity varies","Petrol"), u("gwm-jolion-h","Hybrid · capacity varies","Hybrid")] },
    { name: "Tank 300", engines: [u("gwm-tank300-p","Petrol · capacity varies","Petrol"), u("gwm-tank300-h","Hybrid · capacity varies","Hybrid")] },
    { name: "Poer", engines: [u("gwm-poer-p","Petrol · capacity varies","Petrol"), u("gwm-poer-d","Diesel · capacity varies","Diesel")] }
  ]},
  { name: "Haval", models: [
    { name: "H2", engines: [u("haval-h2-p","Petrol · capacity varies","Petrol")] },
    { name: "H6", engines: [u("haval-h6-p","Petrol · capacity varies","Petrol"), u("haval-h6-h","Hybrid · capacity varies","Hybrid")] },
    { name: "Jolion", engines: [u("haval-jolion-p","Petrol · capacity varies","Petrol"), u("haval-jolion-h","Hybrid · capacity varies","Hybrid")] },
    { name: "F7", engines: [u("haval-f7-p","Petrol · capacity varies","Petrol")] }
  ]},
  { name: "Jaguar", models: [
    { name: "XE", engines: [u("jag-xe-p","Petrol · capacity varies","Petrol"), u("jag-xe-d","Diesel · capacity varies","Diesel")] },
    { name: "XF", engines: [u("jag-xf-p","Petrol · capacity varies","Petrol"), u("jag-xf-d","Diesel · capacity varies","Diesel")] },
    { name: "XJ", engines: [u("jag-xj-p","Petrol · capacity varies","Petrol"), u("jag-xj-d","Diesel · capacity varies","Diesel")] },
    { name: "F-Pace", engines: [u("jag-fpace-p","Petrol · capacity varies","Petrol"), u("jag-fpace-d","Diesel · capacity varies","Diesel"), u("jag-fpace-phev","Plug-in hybrid · capacity varies","Plug-in hybrid")] },
    { name: "I-Pace", engines: [u("jag-ipace-ev","Electric motor","Electric")] }
  ]},
  { name: "Lincoln", models: [
    { name: "MKZ", engines: [u("lincoln-mkz-p","Petrol · capacity varies","Petrol"), u("lincoln-mkz-h","Hybrid · capacity varies","Hybrid")] },
    { name: "MKC", engines: [u("lincoln-mkc-p","Petrol · capacity varies","Petrol")] },
    { name: "Corsair", engines: [u("lincoln-corsair-p","Petrol · capacity varies","Petrol"), u("lincoln-corsair-phev","Plug-in hybrid · capacity varies","Plug-in hybrid")] },
    { name: "Nautilus", engines: [u("lincoln-nautilus-p","Petrol · capacity varies","Petrol"), u("lincoln-nautilus-h","Hybrid · capacity varies","Hybrid")] },
    { name: "Navigator", engines: [u("lincoln-navigator-p","Petrol · capacity varies","Petrol")] }
  ]},
  { name: "Li Auto", models: [
    { name: "L6", engines: [u("li-l6-phev","Range-extender hybrid · capacity varies","Plug-in hybrid")] },
    { name: "L7", engines: [u("li-l7-phev","Range-extender hybrid · capacity varies","Plug-in hybrid")] },
    { name: "L8", engines: [u("li-l8-phev","Range-extender hybrid · capacity varies","Plug-in hybrid")] },
    { name: "L9", engines: [u("li-l9-phev","Range-extender hybrid · capacity varies","Plug-in hybrid")] },
    { name: "Mega", engines: [u("li-mega-ev","Electric motor","Electric")] }
  ]},
  { name: "MG", models: [
    { name: "MG 3", engines: [u("mg3-p","Petrol · capacity varies","Petrol"), u("mg3-h","Hybrid · capacity varies","Hybrid")] },
    { name: "MG 4", engines: [u("mg4-ev","Electric motor","Electric")] },
    { name: "MG 5", engines: [u("mg5-p","Petrol · capacity varies","Petrol"), u("mg5-ev","Electric motor","Electric")] },
    { name: "ZS", engines: [u("mg-zs-p","Petrol · capacity varies","Petrol"), u("mg-zs-ev","Electric motor","Electric")] },
    { name: "HS", engines: [u("mg-hs-p","Petrol · capacity varies","Petrol"), u("mg-hs-phev","Plug-in hybrid · capacity varies","Plug-in hybrid")] },
    { name: "Marvel R", engines: [u("mg-marvel-ev","Electric motor","Electric")] }
  ]},
  { name: "MINI", models: [
    { name: "Cooper", engines: [u("mini-cooper-p","Petrol · capacity varies","Petrol"), u("mini-cooper-d","Diesel · capacity varies","Diesel"), u("mini-cooper-ev","Electric motor","Electric")] },
    { name: "Countryman", engines: [u("mini-countryman-p","Petrol · capacity varies","Petrol"), u("mini-countryman-d","Diesel · capacity varies","Diesel"), u("mini-countryman-phev","Plug-in hybrid · capacity varies","Plug-in hybrid")] },
    { name: "Clubman", engines: [u("mini-clubman-p","Petrol · capacity varies","Petrol"), u("mini-clubman-d","Diesel · capacity varies","Diesel")] }
  ]},
  { name: "NIO", models: [
    { name: "ET5", engines: [u("nio-et5-ev","Electric motor","Electric")] },
    { name: "ET7", engines: [u("nio-et7-ev","Electric motor","Electric")] },
    { name: "ES6 / EL6", engines: [u("nio-es6-ev","Electric motor","Electric")] },
    { name: "ES8 / EL8", engines: [u("nio-es8-ev","Electric motor","Electric")] },
    { name: "EC6", engines: [u("nio-ec6-ev","Electric motor","Electric")] }
  ]},
  { name: "RAM", models: [
    { name: "1500", engines: [u("ram-1500-p","Petrol · capacity varies","Petrol"), u("ram-1500-d","Diesel · capacity varies","Diesel")] },
    { name: "2500", engines: [u("ram-2500-p","Petrol · capacity varies","Petrol"), u("ram-2500-d","Diesel · capacity varies","Diesel")] },
    { name: "ProMaster", engines: [u("ram-promaster-p","Petrol · capacity varies","Petrol"), u("ram-promaster-d","Diesel · capacity varies","Diesel")] }
  ]},
  { name: "Zeekr", models: [
    { name: "001", engines: [u("zeekr-001-ev","Electric motor","Electric")] },
    { name: "X", engines: [u("zeekr-x-ev","Electric motor","Electric")] },
    { name: "007", engines: [u("zeekr-007-ev","Electric motor","Electric")] },
    { name: "009", engines: [u("zeekr-009-ev","Electric motor","Electric")] },
    { name: "7X", engines: [u("zeekr-7x-ev","Electric motor","Electric")] }
  ]},
  { name: "Isuzu", models: [
    { name: "D-Max", engines: [u("isuzu-dmax-d","Diesel · capacity varies","Diesel"), u("isuzu-dmax-p","Petrol · capacity varies","Petrol")] },
    { name: "MU-X", engines: [u("isuzu-mux-d","Diesel · capacity varies","Diesel")] },
    { name: "Trooper", engines: [u("isuzu-trooper-p","Petrol · capacity varies","Petrol"), u("isuzu-trooper-d","Diesel · capacity varies","Diesel")] }
  ]},
  { name: "Daihatsu", models: [
    { name: "Mira", engines: [u("daihatsu-mira-p","Petrol · capacity varies","Petrol")] },
    { name: "Move", engines: [u("daihatsu-move-p","Petrol · capacity varies","Petrol")] },
    { name: "Tanto", engines: [u("daihatsu-tanto-p","Petrol · capacity varies","Petrol")] },
    { name: "Rocky", engines: [u("daihatsu-rocky-p","Petrol · capacity varies","Petrol"), u("daihatsu-rocky-h","Hybrid · capacity varies","Hybrid")] },
    { name: "Terios", engines: [u("daihatsu-terios-p","Petrol · capacity varies","Petrol")] }
  ]},
  { name: "Fiat", models: [
    { name: "500", engines: [u("fiat-500-p","Petrol · capacity varies","Petrol"), u("fiat-500-h","Hybrid · capacity varies","Hybrid"), u("fiat-500-ev","Electric motor","Electric")] },
    { name: "Panda", engines: [u("fiat-panda-p","Petrol · capacity varies","Petrol"), u("fiat-panda-d","Diesel · capacity varies","Diesel"), u("fiat-panda-h","Hybrid · capacity varies","Hybrid")] },
    { name: "Tipo", engines: [u("fiat-tipo-p","Petrol · capacity varies","Petrol"), u("fiat-tipo-d","Diesel · capacity varies","Diesel")] },
    { name: "500X", engines: [u("fiat-500x-p","Petrol · capacity varies","Petrol"), u("fiat-500x-d","Diesel · capacity varies","Diesel")] }
  ]}

];


const additionalVehicleCatalog: Array<{ name: string; models: Array<[string, EngineVariant["fuel"][]]> }> = [{"name":"Toyota","models":[["Yaris",["Petrol","Hybrid"]],["Yaris Cross",["Petrol","Hybrid"]],["C-HR",["Petrol","Hybrid","Plug-in hybrid"]],["Highlander",["Petrol","Hybrid"]],["Avalon",["Petrol","Hybrid"]],["Crown",["Petrol","Hybrid"]],["Sienna",["Petrol","Hybrid"]],["Venza",["Petrol","Hybrid"]],["bZ4X",["Electric"]],["GR86",["Petrol"]],["Supra",["Petrol"]],["86",["Petrol"]],["Sequoia",["Petrol","Hybrid"]],["Verso",["Petrol","Diesel"]]]},{"name":"Honda","models":[["HR-V",["Petrol","Hybrid"]],["ZR-V",["Petrol","Hybrid"]],["Pilot",["Petrol"]],["Passport",["Petrol"]],["Odyssey",["Petrol","Hybrid"]],["Insight",["Hybrid"]],["CR-Z",["Hybrid"]],["Crosstour",["Petrol"]],["Ridgeline",["Petrol"]],["e:Ny1",["Electric"]],["e",["Electric"]]]},{"name":"BMW","models":[["1 Series",["Petrol","Diesel"]],["2 Series",["Petrol","Diesel","Plug-in hybrid"]],["4 Series",["Petrol","Diesel"]],["6 Series",["Petrol","Diesel","Hybrid"]],["7 Series",["Petrol","Diesel","Hybrid","Plug-in hybrid"]],["8 Series",["Petrol","Diesel"]],["X1",["Petrol","Diesel","Plug-in hybrid"]],["X2",["Petrol","Diesel","Plug-in hybrid"]],["X4",["Petrol","Diesel"]],["X5",["Petrol","Diesel","Plug-in hybrid"]],["X6",["Petrol","Diesel"]],["X7",["Petrol","Diesel"]],["Z4",["Petrol"]],["i4",["Electric"]],["i5",["Electric"]],["i7",["Electric"]],["iX",["Electric"]],["iX1",["Electric"]],["iX3",["Electric"]],["i3",["Electric"]]]},{"name":"Mercedes-Benz","models":[["A-Class",["Petrol","Diesel","Hybrid"]],["B-Class",["Petrol","Diesel"]],["CLA",["Petrol","Diesel"]],["CLS",["Petrol","Diesel"]],["S-Class",["Petrol","Diesel","Hybrid","Plug-in hybrid"]],["GLA",["Petrol","Diesel","Hybrid"]],["GLB",["Petrol","Diesel"]],["GLE",["Petrol","Diesel","Plug-in hybrid"]],["GLS",["Petrol","Diesel"]],["G-Class",["Petrol","Diesel"]],["SL",["Petrol"]],["AMG GT",["Petrol"]],["EQA",["Electric"]],["EQB",["Electric"]],["EQE",["Electric"]],["EQS",["Electric"]],["EQC",["Electric"]],["CLE",["Petrol","Diesel","Hybrid"]],["Maybach S-Class",["Petrol","Hybrid"]],["Maybach GLS",["Petrol"]]]},{"name":"Volkswagen","models":[["Jetta",["Petrol","Diesel"]],["Arteon",["Petrol","Diesel","Plug-in hybrid"]],["T-Roc",["Petrol","Diesel"]],["T-Cross",["Petrol","Diesel"]],["Touareg",["Petrol","Diesel","Hybrid","Plug-in hybrid"]],["Taigo",["Petrol"]],["ID.3",["Electric"]],["ID.4",["Electric"]],["ID.5",["Electric"]],["ID.7",["Electric"]],["ID.Buzz",["Electric"]],["Sharan",["Petrol","Diesel"]],["Touran",["Petrol","Diesel"]],["up!",["Petrol","Electric"]],["Polo",["Petrol","Diesel"]]]},{"name":"Audi","models":[["A1",["Petrol","Diesel"]],["A3",["Petrol","Diesel","Plug-in hybrid"]],["A5",["Petrol","Diesel","Hybrid"]],["A7",["Petrol","Diesel","Plug-in hybrid"]],["A8",["Petrol","Diesel","Plug-in hybrid"]],["Q2",["Petrol","Diesel"]],["Q3",["Petrol","Diesel","Plug-in hybrid"]],["Q7",["Petrol","Diesel","Plug-in hybrid"]],["Q8",["Petrol","Diesel","Plug-in hybrid"]],["TT",["Petrol"]],["R8",["Petrol"]],["e-tron",["Electric"]],["Q4 e-tron",["Electric"]],["Q8 e-tron",["Electric"]],["e-tron GT",["Electric"]]]},{"name":"Hyundai","models":[["Kona",["Petrol","Diesel","Hybrid","Electric"]],["Santa Fe",["Petrol","Diesel","Hybrid","Plug-in hybrid"]],["Palisade",["Petrol","Diesel","Hybrid"]],["Venue",["Petrol"]],["Ioniq",["Hybrid","Plug-in hybrid","Electric"]],["Ioniq 5",["Electric"]],["Ioniq 6",["Electric"]],["Staria",["Petrol","Diesel","Hybrid"]],["Veloster",["Petrol"]],["i10",["Petrol"]],["i20",["Petrol","Diesel"]],["i30",["Petrol","Diesel"]],["Bayon",["Petrol"]]]},{"name":"Kia","models":[["Rio",["Petrol","Diesel"]],["Cerato / Forte",["Petrol","Diesel"]],["Ceed",["Petrol","Diesel","Plug-in hybrid"]],["Soul",["Petrol","Electric"]],["Niro",["Hybrid","Plug-in hybrid","Electric"]],["EV6",["Electric"]],["EV9",["Electric"]],["Carnival",["Petrol","Diesel","Hybrid"]],["Telluride",["Petrol"]],["K8",["Petrol","Hybrid"]],["K9 / K900",["Petrol"]],["Stonic",["Petrol","Diesel"]],["Seltos",["Petrol","Diesel"]]]},{"name":"Lexus","models":[["ES",["Petrol","Hybrid"]],["LS",["Petrol","Hybrid"]],["GS",["Petrol","Hybrid"]],["CT",["Hybrid"]],["UX",["Petrol","Hybrid","Electric"]],["LX",["Petrol","Diesel"]],["GX",["Petrol"]],["RC",["Petrol","Hybrid"]],["LC",["Petrol","Hybrid"]],["RZ",["Electric"]],["LBX",["Hybrid"]]]},{"name":"Nissan","models":[["Sentra",["Petrol"]],["Maxima",["Petrol"]],["Versa / Sunny",["Petrol"]],["Pathfinder",["Petrol","Hybrid"]],["Armada / Patrol",["Petrol","Diesel"]],["Murano",["Petrol","Hybrid"]],["Note",["Petrol","Hybrid"]],["March / Micra",["Petrol","Diesel"]],["Silvia",["Petrol"]],["GT-R",["Petrol"]],["Z",["Petrol"]],["Ariya",["Electric"]],["Juke",["Petrol","Diesel","Hybrid"]],["Qashqai",["Petrol","Diesel","Hybrid"]],["Primera",["Petrol","Diesel"]],["Teana",["Petrol","Hybrid"]],["Kicks",["Petrol","Hybrid"]]]},{"name":"Mazda","models":[["Mazda6",["Petrol","Diesel"]],["CX-3",["Petrol","Diesel"]],["CX-30",["Petrol","Diesel","Hybrid"]],["CX-50",["Petrol","Hybrid"]],["CX-60",["Petrol","Diesel","Plug-in hybrid"]],["CX-9",["Petrol"]],["CX-90",["Petrol","Diesel","Plug-in hybrid"]],["MX-5",["Petrol"]],["RX-8",["Petrol"]],["MX-30",["Electric","Hybrid"]],["CX-8",["Petrol","Diesel"]]]},{"name":"Subaru","models":[["Outback",["Petrol","Diesel"]],["Legacy",["Petrol","Diesel"]],["BRZ",["Petrol"]],["WRX",["Petrol"]],["Levorg",["Petrol"]],["Ascent",["Petrol"]],["Crosstrek / XV",["Petrol","Hybrid"]],["Tribeca",["Petrol"]],["Solterra",["Electric"]]]},{"name":"Ford","models":[["Focus",["Petrol","Diesel"]],["Fiesta",["Petrol","Diesel"]],["Mustang",["Petrol"]],["Edge",["Petrol","Diesel"]],["Explorer",["Petrol","Hybrid"]],["Expedition",["Petrol"]],["Bronco",["Petrol"]],["Bronco Sport",["Petrol","Hybrid"]],["Mustang Mach-E",["Electric"]],["Flex",["Petrol"]],["C-Max",["Petrol","Diesel","Hybrid","Plug-in hybrid"]],["Puma",["Petrol","Diesel","Hybrid"]],["Kuga",["Petrol","Diesel","Hybrid","Plug-in hybrid"]],["EcoSport",["Petrol","Diesel"]],["Everest",["Petrol","Diesel"]],["Galaxy",["Petrol","Diesel"]]]},{"name":"Chevrolet","models":[["Spark",["Petrol","Electric"]],["Trax",["Petrol"]],["Equinox",["Petrol","Diesel","Electric"]],["Traverse",["Petrol"]],["Blazer",["Petrol","Electric"]],["Tahoe",["Petrol","Diesel","Hybrid"]],["Suburban",["Petrol","Diesel"]],["Corvette",["Petrol","Hybrid"]],["Camaro",["Petrol"]],["Bolt",["Electric"]],["Trailblazer",["Petrol","Diesel"]],["Trailblazer (classic)",["Petrol","Diesel"]],["Orlando",["Petrol","Diesel"]],["Captiva",["Petrol","Diesel"]],["Impala",["Petrol","Hybrid"]]]},{"name":"Volvo","models":[["S40",["Petrol","Diesel"]],["S80",["Petrol","Diesel"]],["S90",["Petrol","Diesel","Plug-in hybrid"]],["V40",["Petrol","Diesel"]],["V60",["Petrol","Diesel","Plug-in hybrid"]],["V90",["Petrol","Diesel","Plug-in hybrid"]],["XC40",["Petrol","Diesel","Electric"]],["XC90",["Petrol","Diesel","Plug-in hybrid"]],["EX30",["Electric"]],["EX90",["Electric"]],["C30",["Petrol","Diesel","Electric"]],["C70",["Petrol","Diesel"]]]},{"name":"Mitsubishi","models":[["ASX / RVR",["Petrol","Diesel"]],["Eclipse Cross",["Petrol","Plug-in hybrid"]],["Delica D:5",["Petrol","Diesel"]],["Colt",["Petrol","Diesel"]],["Mirage / Space Star",["Petrol"]],["Grandis",["Petrol","Diesel"]],["i-MiEV",["Electric"]],["Galant",["Petrol"]],["Space Wagon",["Petrol","Diesel"]],["Outlander Sport",["Petrol","Diesel"]]]},{"name":"Jeep","models":[["Compass",["Petrol","Diesel","Plug-in hybrid"]],["Renegade",["Petrol","Diesel","Plug-in hybrid"]],["Cherokee",["Petrol","Diesel","Hybrid"]],["Commander",["Petrol","Diesel"]],["Avenger",["Petrol","Hybrid","Electric"]],["Wagoneer",["Petrol"]],["Grand Wagoneer",["Petrol"]],["Liberty / Cherokee KJ",["Petrol","Diesel"]],["Patriot",["Petrol","Diesel"]]]},{"name":"Porsche","models":[["911",["Petrol","Hybrid"]],["718 Boxster",["Petrol"]],["718 Cayman",["Petrol"]],["Taycan",["Electric"]],["Boxster",["Petrol"]],["Cayman",["Petrol"]],["918 Spyder",["Hybrid"]],["718 Spyder",["Petrol"]]]},{"name":"Infiniti","models":[["Q30",["Petrol","Diesel"]],["Q60",["Petrol"]],["QX50",["Petrol"]],["QX55",["Petrol"]],["QX70",["Petrol","Diesel"]],["QX80",["Petrol"]],["FX",["Petrol","Diesel"]],["EX",["Petrol","Diesel"]],["M / Q70",["Petrol","Hybrid","Diesel"]]]},{"name":"Suzuki","models":[["Jimny",["Petrol"]],["Baleno",["Petrol","Diesel","Hybrid"]],["Ignis",["Petrol","Hybrid"]],["S-Cross",["Petrol","Diesel","Hybrid"]],["SX4",["Petrol","Diesel"]],["Ciaz",["Petrol","Diesel","Hybrid"]],["Ertiga",["Petrol","Diesel","Hybrid"]],["Across",["Plug-in hybrid"]],["Alto",["Petrol"]],["Wagon R",["Petrol","Hybrid"]]]},{"name":"Škoda","models":[["Fabia",["Petrol","Diesel"]],["Kamiq",["Petrol","Diesel"]],["Karoq",["Petrol","Diesel"]],["Kodiaq",["Petrol","Diesel","Plug-in hybrid"]],["Scala",["Petrol","Diesel"]],["Kushaq",["Petrol"]],["Enyaq",["Electric"]],["Rapid",["Petrol","Diesel"]],["Yeti",["Petrol","Diesel"]],["Roomster",["Petrol","Diesel"]]]},{"name":"Opel","models":[["Corsa",["Petrol","Diesel","Electric"]],["Mokka",["Petrol","Diesel","Electric"]],["Grandland",["Petrol","Diesel","Plug-in hybrid"]],["Crossland",["Petrol","Diesel"]],["Zafira",["Petrol","Diesel"]],["Frontera",["Hybrid","Electric"]],["Meriva",["Petrol","Diesel"]],["Adam",["Petrol"]],["Karl",["Petrol"]]]},{"name":"Peugeot","models":[["208",["Petrol","Diesel","Electric"]],["308",["Petrol","Diesel","Plug-in hybrid"]],["2008",["Petrol","Diesel","Electric"]],["5008",["Petrol","Diesel","Hybrid"]],["408",["Petrol","Plug-in hybrid"]],["407",["Petrol","Diesel"]],["508",["Petrol","Diesel","Plug-in hybrid"]],["4008",["Petrol","Diesel"]],["e-2008",["Electric"]],["e-208",["Electric"]],["Rifter",["Petrol","Diesel","Electric"]]]},{"name":"Renault","models":[["Clio",["Petrol","Diesel","Hybrid"]],["Captur",["Petrol","Diesel","Hybrid","Plug-in hybrid"]],["Koleos",["Petrol","Diesel"]],["Arkana",["Petrol","Hybrid"]],["Austral",["Hybrid"]],["Scenic",["Petrol","Diesel","Electric"]],["Espace",["Petrol","Diesel","Hybrid"]],["Talisman",["Petrol","Diesel"]],["Twizy",["Electric"]],["Zoe",["Electric"]],["Twingo",["Petrol","Electric"]],["Kadjar",["Petrol","Diesel"]],["Fluence",["Petrol","Diesel","Electric"]],["Laguna",["Petrol","Diesel"]]]},{"name":"Land Rover","models":[["Range Rover",["Petrol","Diesel","Plug-in hybrid"]],["Range Rover Evoque",["Petrol","Diesel","Plug-in hybrid"]],["Range Rover Velar",["Petrol","Diesel","Plug-in hybrid"]],["Defender",["Petrol","Diesel","Plug-in hybrid"]],["Discovery Sport",["Petrol","Diesel","Plug-in hybrid"]],["Freelander",["Petrol","Diesel"]],["Range Rover SV",["Petrol","Plug-in hybrid"]]]},{"name":"Tesla","models":[["Model S",["Electric"]],["Model X",["Electric"]],["Cybertruck",["Electric"]],["Roadster",["Electric"]],]},{"name":"BYD","models":[["Seagull / Dolphin Mini",["Electric"]],["Sealion 6",["Plug-in hybrid"]],["Sealion 7",["Electric"]],["Yuan Plus",["Electric"]],["Yuan Up",["Electric"]],["e2",["Electric"]],["Destroyer 05",["Plug-in hybrid"]],["Frigate 07",["Plug-in hybrid"]],["Song Pro",["Plug-in hybrid"]],["Qin Plus",["Plug-in hybrid"]],["Denza D9",["Plug-in hybrid","Electric"]]]},{"name":"Chery","models":[["Tiggo 2",["Petrol"]],["Tiggo 3",["Petrol"]],["Tiggo 5",["Petrol"]],["Tiggo 9",["Petrol","Plug-in hybrid"]],["Arrizo 6",["Petrol"]],["Arrizo 7",["Petrol"]],["Omoda 5",["Petrol","Electric"]],["Jaecoo 7",["Petrol","Plug-in hybrid"]]]},{"name":"Geely","models":[["Emgrand 7",["Petrol"]],["Preface",["Petrol"]],["Galaxy L7",["Plug-in hybrid"]],["Galaxy E5",["Electric"]],["Starray",["Petrol"]],["Coolray / Binyue",["Petrol"]],["Tugella",["Petrol"]]]},{"name":"Haval","models":[["H5",["Petrol","Diesel"]],["H7",["Petrol","Hybrid"]],["H9",["Petrol","Diesel"]],["Big Dog / Dargo",["Petrol","Hybrid"]],["Chitu",["Petrol","Hybrid"]],["Shenshou",["Petrol"]]]},{"name":"Great Wall","models":[["Tank 500",["Petrol","Hybrid"]],["Tank 700",["Hybrid"]],["Wey Coffee 01",["Plug-in hybrid"]],["Wey Coffee 02",["Plug-in hybrid"]],["Wey 03",["Plug-in hybrid"]],["Wey 05",["Plug-in hybrid"]]]},{"name":"Genesis","models":[["G60",["Electric"]],["Electrified G80",["Electric"]],["Electrified GV70",["Electric"]],["GV60",["Electric"]]]},{"name":"MG","models":[["Cyberster",["Electric"]],["IM5",["Electric"]],["IM6",["Electric"]],["ZS Hybrid",["Hybrid"]],["HS Hybrid",["Hybrid"]]]},{"name":"NIO","models":[["ET5 Touring",["Electric"]],["ET9",["Electric"]],["ES7 / EL7",["Electric"]],["EC7",["Electric"]],["Firefly",["Electric"]]]},{"name":"Chrysler","models":[["Voyager",["Petrol"]],["Aspen",["Petrol"]],["Sebring",["Petrol"]],["PT Cruiser",["Petrol","Diesel"]]]},{"name":"Dodge","models":[["Hornet",["Petrol","Plug-in hybrid"]],["Dart",["Petrol"]],["Avenger",["Petrol","Diesel"]],["Caliber",["Petrol","Diesel"]],["Nitro",["Petrol","Diesel"]]]},{"name":"Cadillac","models":[["XT6",["Petrol"]],["LYRIQ",["Electric"]],["CELESTIQ",["Electric"]],["Optiq",["Electric"]],["Vistiq",["Electric"]]]},{"name":"Buick","models":[["LaCrosse",["Petrol","Hybrid"]],["Verano",["Petrol"]],["Envision Plus",["Petrol"]],["Electra E5",["Electric"]],["Electra E4",["Electric"]]]},{"name":"Jaguar","models":[["F-Type",["Petrol"]],["F-Pace SVR",["Petrol"]],["E-Pace",["Petrol","Diesel"]],["X-Type",["Petrol","Diesel"]]]},{"name":"Lincoln","models":[["Aviator",["Petrol","Plug-in hybrid"]],["Continental",["Petrol"]],["MKX",["Petrol"]],["MKT",["Petrol"]],["Town Car",["Petrol"]]]},{"name":"MINI","models":[["Paceman",["Petrol","Diesel"]],["Coupe",["Petrol"]],["Roadster",["Petrol"]],["Aceman",["Electric"]],["John Cooper Works",["Petrol","Electric"]]]},{"name":"Abarth","models":[["500",["Petrol"]],["595",["Petrol"]],["695",["Petrol"]],["600e",["Electric"]]]},{"name":"Aston Martin","models":[["Vantage",["Petrol"]],["DB9",["Petrol"]],["DB11",["Petrol"]],["DB12",["Petrol"]],["DBS",["Petrol"]],["DBX",["Petrol"]],["Rapide",["Petrol"]],["Vanquish",["Petrol"]]]},{"name":"Bentley","models":[["Continental GT",["Petrol","Hybrid"]],["Flying Spur",["Petrol","Hybrid"]],["Bentayga",["Petrol","Diesel","Hybrid"]],["Mulsanne",["Petrol"]],["Arnage",["Petrol"]]]},{"name":"Bugatti","models":[["Veyron",["Petrol"]],["Chiron",["Petrol"]],["Divo",["Petrol"]],["Tourbillon",["Hybrid"]]]},{"name":"Citroën","models":[["C1",["Petrol","Diesel"]],["C2",["Petrol","Diesel"]],["C3",["Petrol","Diesel"]],["C3 Aircross",["Petrol","Diesel"]],["C4",["Petrol","Diesel","Electric"]],["C4 Cactus",["Petrol","Diesel"]],["C5 Aircross",["Petrol","Diesel","Plug-in hybrid"]],["C5 X",["Petrol","Plug-in hybrid"]],["DS3",["Petrol","Diesel"]],["e-C4",["Electric"]]]},{"name":"Cupra","models":[["Formentor",["Petrol","Diesel","Plug-in hybrid"]],["Leon",["Petrol","Diesel","Plug-in hybrid"]],["Born",["Electric"]],["Ateca",["Petrol"]],["Tavascan",["Electric"]],["Terramar",["Petrol","Plug-in hybrid"]]]},{"name":"Dacia","models":[["Sandero",["Petrol","LPG","Hybrid"]],["Duster",["Petrol","Diesel","LPG","Hybrid"]],["Logan",["Petrol","Diesel","LPG"]],["Jogger",["Petrol","LPG","Hybrid"]],["Spring",["Electric"]],["Bigster",["Petrol","Hybrid"]],["Lodgy",["Petrol","Diesel"]]]},{"name":"DS Automobiles","models":[["DS 3",["Petrol","Diesel","Electric"]],["DS 4",["Petrol","Diesel","Plug-in hybrid"]],["DS 7",["Petrol","Diesel","Plug-in hybrid"]],["DS 9",["Petrol","Plug-in hybrid"]]]},{"name":"Ferrari","models":[["California",["Petrol"]],["458 Italia",["Petrol"]],["488 GTB",["Petrol"]],["F8 Tributo",["Petrol"]],["296 GTB",["Plug-in hybrid"]],["812 Superfast",["Petrol"]],["Roma",["Petrol"]],["Portofino",["Petrol"]],["Purosangue",["Petrol"]],["SF90 Stradale",["Plug-in hybrid"]],["LaFerrari",["Hybrid"]],["F12berlinetta",["Petrol"]]]},{"name":"GAC","models":[["GS3",["Petrol"]],["GS4",["Petrol","Hybrid"]],["GS8",["Petrol","Hybrid"]],["Empow",["Petrol"]],["Aion Y",["Electric"]],["Aion S",["Electric"]],["Aion V",["Electric"]],["Aion LX",["Electric"]]]},{"name":"Hongqi","models":[["H5",["Petrol","Hybrid"]],["H6",["Petrol"]],["H9",["Petrol"]],["HS3",["Petrol"]],["HS5",["Petrol"]],["HS7",["Petrol"]],["E-HS9",["Electric"]],["E-QM5",["Electric"]]]},{"name":"Hummer","models":[["H2",["Petrol"]],["H3",["Petrol"]],["Hummer EV SUV",["Electric"]]]},{"name":"Lada","models":[["Vesta",["Petrol","LPG"]],["Granta",["Petrol","LPG"]],["Niva Legend",["Petrol"]],["Niva Travel",["Petrol"]],["XRAY",["Petrol"]],["Priora",["Petrol"]],["Kalina",["Petrol"]]]},{"name":"Lamborghini","models":[["Huracán",["Petrol"]],["Aventador",["Petrol"]],["Urus",["Petrol","Plug-in hybrid"]],["Revuelto",["Plug-in hybrid"]],["Gallardo",["Petrol"]],["Murciélago",["Petrol"]],["Temerario",["Plug-in hybrid"]]]},{"name":"Lancia","models":[["Ypsilon",["Petrol","Hybrid","Electric"]],["Delta",["Petrol","Diesel"]],["Thema",["Petrol","Diesel"]],["Musa",["Petrol","Diesel"]],["Voyager",["Petrol","Diesel"]]]},{"name":"Lotus","models":[["Elise",["Petrol"]],["Exige",["Petrol"]],["Evora",["Petrol"]],["Emira",["Petrol"]],["Eletre",["Electric"]],["Emeya",["Electric"]]]},{"name":"Lucid","models":[["Air",["Electric"]],["Gravity",["Electric"]]]},{"name":"Maserati","models":[["Ghibli",["Petrol","Diesel","Hybrid"]],["Quattroporte",["Petrol","Diesel"]],["Levante",["Petrol","Diesel"]],["MC20",["Petrol"]],["GranTurismo",["Petrol","Electric"]],["Grecale",["Petrol","Hybrid"]],["GranCabrio",["Petrol","Electric"]]]},{"name":"McLaren","models":[["540C",["Petrol"]],["570S",["Petrol"]],["600LT",["Petrol"]],["720S",["Petrol"]],["750S",["Petrol"]],["Artura",["Plug-in hybrid"]],["GT",["Petrol"]],["765LT",["Petrol"]],["P1",["Hybrid"]]]},{"name":"Pagani","models":[["Zonda",["Petrol"]],["Huayra",["Petrol"]],["Utopia",["Petrol"]]]},{"name":"Polestar","models":[["1",["Plug-in hybrid"]],["2",["Electric"]],["3",["Electric"]],["4",["Electric"]],["5",["Electric"]]]},{"name":"Rivian","models":[["R1S",["Electric"]],["R2",["Electric"]],["R3",["Electric"]]]},{"name":"Rolls-Royce","models":[["Ghost",["Petrol"]],["Phantom",["Petrol"]],["Wraith",["Petrol"]],["Dawn",["Petrol"]],["Cullinan",["Petrol"]],["Spectre",["Electric"]],["Silver Shadow",["Petrol"]]]},{"name":"Saab","models":[["9-3",["Petrol","Diesel"]],["9-5",["Petrol","Diesel"]],["9-4X",["Petrol"]],["900",["Petrol"]],["9000",["Petrol"]]]},{"name":"SEAT","models":[["Ibiza",["Petrol","Diesel"]],["Leon",["Petrol","Diesel","Plug-in hybrid"]],["Arona",["Petrol"]],["Ateca",["Petrol","Diesel"]],["Tarraco",["Petrol","Diesel","Plug-in hybrid"]],["Toledo",["Petrol","Diesel"]],["Alhambra",["Petrol","Diesel"]],["Mii",["Petrol","Electric"]]]},{"name":"Smart","models":[["Fortwo",["Petrol","Electric"]],["Forfour",["Petrol","Electric"]],["#1",["Electric"]],["#3",["Electric"]],["#5",["Electric"]]]},{"name":"KGM","models":[["Tivoli",["Petrol","Diesel"]],["Korando",["Petrol","Diesel","Electric"]],["Torres",["Petrol","Electric"]],["Rexton",["Petrol","Diesel"]],["Actyon",["Petrol","Hybrid"]]]},{"name":"Tata","models":[["Nexon",["Petrol","Diesel","Electric"]],["Harrier",["Diesel"]],["Safari",["Diesel"]],["Punch",["Petrol","Electric"]],["Altroz",["Petrol","Diesel","CNG"]],["Tiago",["Petrol","CNG","Electric"]],["Tigor",["Petrol","CNG","Electric"]]]},{"name":"Mahindra","models":[["XUV300",["Petrol","Diesel"]],["XUV 3XO",["Petrol","Diesel"]],["XUV700",["Petrol","Diesel"]],["Scorpio",["Petrol","Diesel"]],["Scorpio-N",["Petrol","Diesel"]],["Thar",["Petrol","Diesel"]],["Bolero",["Diesel"]],["BE 6",["Electric"]],["XEV 9e",["Electric"]]]},{"name":"XPeng","models":[["P5",["Electric"]],["P7",["Electric"]],["P7+",["Electric"]],["G3",["Electric"]],["G6",["Electric"]],["G9",["Electric"]],["X9",["Electric"]]]},{"name":"Leapmotor","models":[["T03",["Electric"]],["C10",["Electric","Plug-in hybrid"]],["C11",["Electric","Plug-in hybrid"]],["C16",["Electric","Plug-in hybrid"]],["B10",["Electric"]]]},{"name":"Wuling","models":[["Hongguang Mini EV",["Electric"]],["Bingo",["Electric"]],["Air ev",["Electric"]],["Starlight",["Plug-in hybrid","Electric"]],["Xingchi",["Petrol"]]]},{"name":"JAC","models":[["J7",["Petrol"]],["JS4",["Petrol"]],["JS6",["Petrol","Hybrid"]],["iEV7S",["Electric"]],["E-JS1",["Electric"]],["S7",["Petrol"]]]},{"name":"Dongfeng","models":[["Aeolus Yixuan",["Petrol"]],["Aeolus AX7",["Petrol"]],["Box",["Electric"]],["eπ 007",["Electric","Plug-in hybrid"]],["Fengon 580",["Petrol"]],["Fengon  ix5",["Petrol"]]]},{"name":"Changan","models":[["CS35 Plus",["Petrol"]],["CS55 Plus",["Petrol"]],["CS75 Plus",["Petrol"]],["UNI-T",["Petrol"]],["UNI-V",["Petrol"]],["UNI-K",["Petrol","Hybrid"]],["Deepal S07",["Electric","Plug-in hybrid"]],["Deepal L07",["Electric","Plug-in hybrid"]],["Lumin",["Electric"]]]},{"name":"FAW","models":[["Bestune T77",["Petrol"]],["Bestune T99",["Petrol"]],["Bestune B70",["Petrol"]],["Hongqi H5",["Petrol","Hybrid"]],["Hongqi E-HS9",["Electric"]]]},{"name":"Denza","models":[["D9",["Plug-in hybrid","Electric"]],["N7",["Electric"]],["N8",["Plug-in hybrid"]],["Z9",["Plug-in hybrid","Electric"]]]},{"name":"Lynk & Co","models":[["01",["Petrol","Plug-in hybrid"]],["02",["Electric"]],["03",["Petrol","Hybrid"]],["05",["Petrol"]],["06",["Petrol","Plug-in hybrid"]],["09",["Petrol","Hybrid","Plug-in hybrid"]]]},{"name":"VinFast","models":[["VF 5",["Electric"]],["VF 6",["Electric"]],["VF 7",["Electric"]],["VF 8",["Electric"]],["VF 9",["Electric"]],["VF e34",["Electric"]]]},{"name":"Fisker","models":[["Ocean",["Electric"]],["Karma",["Plug-in hybrid"]]]},{"name":"Pontiac","models":[["GTO",["Petrol"]],["Firebird",["Petrol"]],["Solstice",["Petrol"]],["G8",["Petrol"]],["Grand Prix",["Petrol"]],["Vibe",["Petrol"]]]},{"name":"Saturn","models":[["Vue",["Petrol","Hybrid"]],["Aura",["Petrol","Hybrid"]],["Sky",["Petrol"]],["Ion",["Petrol"]],["Outlook",["Petrol"]]]},{"name":"Mercury","models":[["Grand Marquis",["Petrol"]],["Milan",["Petrol","Hybrid"]],["Mountaineer",["Petrol"]],["Cougar",["Petrol"]],["Mariner",["Petrol","Hybrid"]]]},{"name":"Holden","models":[["Commodore",["Petrol","Diesel"]],["Astra",["Petrol","Diesel"]],["Captiva",["Petrol","Diesel"]],["Cruze",["Petrol","Diesel"]],["Barina",["Petrol"]]]},{"name":"Vauxhall","models":[["Astra",["Petrol","Diesel"]],["Corsa",["Petrol","Diesel","Electric"]],["Mokka",["Petrol","Diesel","Electric"]],["Grandland",["Petrol","Diesel","Plug-in hybrid"]],["Insignia",["Petrol","Diesel"]],["Crossland",["Petrol","Diesel"]]]},{"name":"BAIC","models":[["X35",["Petrol"]],["X55",["Petrol"]],["X7",["Petrol"]],["BJ40",["Petrol","Diesel"]],["EU5",["Electric"]]]},{"name":"Seres","models":[["3",["Electric"]],["5",["Electric","Plug-in hybrid"]],["M7",["Plug-in hybrid"]],["Aito M5",["Electric","Plug-in hybrid"]]]},{"name":"ORA","models":[["03 / Funky Cat",["Electric"]],["07",["Electric"]],["05",["Electric"]],["Good Cat",["Electric"]]]},{"name":"Maxus","models":[["MIFA 9",["Electric"]],["Euniq 5",["Electric"]],["D90",["Petrol","Diesel"]],["Euniq 6",["Electric"]]]},{"name":"Avatr","models":[["11",["Electric"]],["12",["Electric"]],["07",["Electric","Plug-in hybrid"]]]},{"name":"AITO","models":[["M5",["Electric","Plug-in hybrid"]],["M7",["Electric","Plug-in hybrid"]],["M9",["Electric","Plug-in hybrid"]]]},{"name":"Proton","models":[["X50",["Petrol"]],["X70",["Petrol"]],["S70",["Petrol"]],["Persona",["Petrol"]],["Iriz",["Petrol"]],["Exora",["Petrol"]]]},{"name":"Morgan","models":[["Plus Four",["Petrol"]],["Plus Six",["Petrol"]],["3 Wheeler",["Petrol"]],["Super 3",["Petrol"]]]}];

export const vehicleCatalog: VehicleMake[] = (() => {
  const merged = new Map<string, VehicleMake>();

  for (const make of baseVehicleCatalog) {
    merged.set(make.name, { name: make.name, models: [...make.models] });
  }

  for (const [makeIndex, make] of additionalVehicleCatalog.entries()) {
    const target = merged.get(make.name) ?? { name: make.name, models: [] };

    for (const [modelIndex, model] of make.models.entries()) {
      const [modelName, fuels] = model;
      if (target.models.some((item) => item.name.toLowerCase() === modelName.toLowerCase())) continue;

      target.models.push({
        name: modelName,
        engines: fuels.map((fuel, fuelIndex) => {
          const label = fuel === "Electric" ? "Electric motor" : `${fuel} · capacity varies`;
          return u(`extra-${makeIndex}-${modelIndex}-${fuelIndex}`, label, fuel);
        })
      });
    }

    merged.set(make.name, target);
  }

  return Array.from(merged.values())
    .map((make) => ({ ...make, models: [...make.models].sort((a, b) => a.name.localeCompare(b.name)) }))
    .sort((a, b) => a.name.localeCompare(b.name));
})();

export const importCountries = [
  "United States", "Japan", "Germany", "South Korea", "United Kingdom",
  "Canada", "United Arab Emirates", "Italy", "France", "Netherlands",
  "Belgium", "Poland", "Sweden", "Austria", "Switzerland", "Spain", "Norway", "Australia", "Other"
];
