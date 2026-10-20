export type EngineVariant = {
  id: string;
  label: string;
  cc: number;
  fuel: "Petrol" | "Diesel" | "Hybrid" | "Plug-in hybrid" | "Electric";
  years: string;
  note?: string;
};

export type VehicleModel = { name: string; engines: EngineVariant[] };
export type VehicleMake = { name: string; models: VehicleModel[] };

// Common variants found across popular used-car import markets.
// Engine choices vary by model year, trim and market. This is not a complete VIN-level catalogue.
const e = (id: string, label: string, cc: number, fuel: EngineVariant["fuel"], years: string, note?: string): EngineVariant =>
  ({ id, label, cc, fuel, years, note });

export const vehicleCatalog: VehicleMake[] = [
  { name: "Toyota", models: [
    { name: "Prius", engines: [e("prius-18h","1.8 Hybrid",1798,"Hybrid","2009–2022"),e("prius-20h","2.0 Hybrid",1987,"Hybrid","2023 onward"),e("prius-15h","1.5 Hybrid",1497,"Hybrid","2003–2009")] },
    { name: "Camry", engines: [e("camry-25","2.5 Petrol",2487,"Petrol","2010 onward"),e("camry-35","3.5 V6 Petrol",3456,"Petrol","2007 onward"),e("camry-25h","2.5 Hybrid",2487,"Hybrid","2007 onward"),e("camry-20","2.0 Petrol",1987,"Petrol","selected markets")] },
    { name: "Corolla", engines: [e("corolla-18","1.8 Petrol",1798,"Petrol","2000 onward"),e("corolla-20","2.0 Petrol",1987,"Petrol","selected markets"),e("corolla-18h","1.8 Hybrid",1798,"Hybrid","2018 onward"),e("corolla-16","1.6 Petrol",1598,"Petrol","selected markets")] },
    { name: "RAV4", engines: [e("rav4-25","2.5 Petrol",2487,"Petrol","2013 onward"),e("rav4-25h","2.5 Hybrid",2487,"Hybrid","2016 onward"),e("rav4-20","2.0 Petrol",1987,"Petrol","selected markets"),e("rav4-22d","2.2 Diesel",2231,"Diesel","older generations")] },
    { name: "Aqua / Prius C", engines: [e("aqua-15h","1.5 Hybrid",1496,"Hybrid","2011–2021")] },
    { name: "Land Cruiser Prado", engines: [e("prado-27","2.7 Petrol",2693,"Petrol","multiple generations"),e("prado-40","4.0 V6 Petrol",3956,"Petrol","multiple generations"),e("prado-28d","2.8 Diesel",2755,"Diesel","2015 onward"),e("prado-30d","3.0 Diesel",2982,"Diesel","older generations")] }
  ]},
  { name: "Honda", models: [
    { name: "Fit / Jazz", engines: [e("fit-13","1.3 Petrol",1339,"Petrol","2001–2020"),e("fit-15","1.5 Petrol",1496,"Petrol","2001 onward"),e("fit-15h","1.5 Hybrid",1496,"Hybrid","2013 onward")] },
    { name: "Civic", engines: [e("civic-20","2.0 Petrol",1996,"Petrol","2016 onward"),e("civic-15t","1.5 Turbo Petrol",1498,"Petrol","2016 onward"),e("civic-18","1.8 Petrol",1799,"Petrol","2006–2015"),e("civic-16d","1.6 Diesel",1597,"Diesel","selected markets")] },
    { name: "Accord", engines: [e("accord-24","2.4 Petrol",2354,"Petrol","older generations"),e("accord-15t","1.5 Turbo Petrol",1498,"Petrol","2018 onward"),e("accord-20t","2.0 Turbo Petrol",1996,"Petrol","2018 onward"),e("accord-20h","2.0 Hybrid",1993,"Hybrid","2014 onward")] },
    { name: "CR-V", engines: [e("crv-24","2.4 Petrol",2354,"Petrol","older generations"),e("crv-15t","1.5 Turbo Petrol",1498,"Petrol","2017 onward"),e("crv-20h","2.0 Hybrid",1993,"Hybrid","selected markets"),e("crv-16d","1.6 Diesel",1597,"Diesel","selected markets")] }
  ]},
  { name: "BMW", models: [
    { name: "3 Series", engines: [e("bmw-318i","318i · 2.0 Petrol",1995,"Petrol","varies by generation"),e("bmw-320i","320i · 2.0 Petrol",1998,"Petrol","varies by generation"),e("bmw-330i","330i · 2.0 Petrol",1998,"Petrol","varies by generation"),e("bmw-340i","340i · 3.0 Petrol",2998,"Petrol","2015–2019"),e("bmw-320d","320d · 2.0 Diesel",1995,"Diesel","varies by generation"),e("bmw-330d","330d · 3.0 Diesel",2993,"Diesel","varies by generation")] },
    { name: "5 Series", engines: [e("bmw-520i","520i · 2.0 Petrol",1998,"Petrol","varies by generation"),e("bmw-530i","530i · 2.0/3.0 Petrol",1998,"Petrol","engine depends on generation"),e("bmw-540i","540i · 3.0/4.0/4.4 Petrol",2998,"Petrol","engine depends on generation"),e("bmw-520d","520d · 2.0 Diesel",1995,"Diesel","varies by generation"),e("bmw-530d","530d · 3.0 Diesel",2993,"Diesel","varies by generation")] },
    { name: "X3", engines: [e("bmw-x3-20i","20i · 2.0 Petrol",1998,"Petrol","varies by generation"),e("bmw-x3-30i","30i · 2.0/3.0 Petrol",1998,"Petrol","engine depends on generation"),e("bmw-x3-20d","20d · 2.0 Diesel",1995,"Diesel","varies by generation"),e("bmw-x3-30d","30d · 3.0 Diesel",2993,"Diesel","varies by generation")] }
  ]},
  { name: "Mercedes-Benz", models: [
    { name: "C-Class", engines: [e("mb-c180","C 180 · 1.6/1.8/2.0 Petrol",1595,"Petrol","engine depends on year"),e("mb-c200","C 200 · 1.5/1.8/2.0 Petrol",1991,"Petrol","engine depends on year"),e("mb-c300","C 300 · 2.0/3.0 Petrol",1991,"Petrol","engine depends on year"),e("mb-c220d","C 220 d · 2.0/2.1 Diesel",2143,"Diesel","engine depends on year")] },
    { name: "E-Class", engines: [e("mb-e200","E 200 · 2.0 Petrol",1991,"Petrol","varies by generation"),e("mb-e300","E 300 · 2.0/3.0 Petrol",1991,"Petrol","engine depends on year"),e("mb-e350","E 350 · 3.0/3.5 Petrol",3498,"Petrol","engine depends on year"),e("mb-e220d","E 220 d · 2.0/2.1 Diesel",2143,"Diesel","engine depends on year"),e("mb-e350d","E 350 d · 3.0 Diesel",2987,"Diesel","varies by generation")] },
    { name: "GLC", engines: [e("mb-glc300","GLC 300 · 2.0 Petrol",1991,"Petrol","2016 onward"),e("mb-glc220d","GLC 220 d · 2.0/2.1 Diesel",2143,"Diesel","engine depends on year"),e("mb-glc300d","GLC 300 d · 2.0/3.0 Diesel",1950,"Diesel","engine depends on year")] }
  ]},
  { name: "Volkswagen", models: [
    { name: "Golf", engines: [e("vw-golf-14t","1.4 TSI Petrol",1395,"Petrol","selected generations"),e("vw-golf-15t","1.5 TSI Petrol",1498,"Petrol","2017 onward"),e("vw-golf-20t","2.0 TSI Petrol",1984,"Petrol","GTI / selected trims"),e("vw-golf-20d","2.0 TDI Diesel",1968,"Diesel","selected generations"),e("vw-golf-16d","1.6 TDI Diesel",1598,"Diesel","selected generations")] },
    { name: "Passat", engines: [e("vw-passat-14t","1.4 TSI Petrol",1395,"Petrol","selected generations"),e("vw-passat-18t","1.8 TSI Petrol",1798,"Petrol","selected generations"),e("vw-passat-20t","2.0 TSI Petrol",1984,"Petrol","selected generations"),e("vw-passat-20d","2.0 TDI Diesel",1968,"Diesel","selected generations")] },
    { name: "Tiguan", engines: [e("vw-tiguan-14t","1.4 TSI Petrol",1395,"Petrol","selected generations"),e("vw-tiguan-20t","2.0 TSI Petrol",1984,"Petrol","selected generations"),e("vw-tiguan-20d","2.0 TDI Diesel",1968,"Diesel","selected generations")] }
  ]},
  { name: "Audi", models: [
    { name: "A4", engines: [e("audi-a4-20t","2.0 TFSI Petrol",1984,"Petrol","selected generations"),e("audi-a4-30t","3.0 TFSI Petrol",2995,"Petrol","selected trims"),e("audi-a4-20d","2.0 TDI Diesel",1968,"Diesel","selected generations")] },
    { name: "A6", engines: [e("audi-a6-20t","2.0 TFSI Petrol",1984,"Petrol","selected generations"),e("audi-a6-30t","3.0 TFSI Petrol",2995,"Petrol","selected generations"),e("audi-a6-20d","2.0 TDI Diesel",1968,"Diesel","selected generations"),e("audi-a6-30d","3.0 TDI Diesel",2967,"Diesel","selected generations")] },
    { name: "Q5", engines: [e("audi-q5-20t","2.0 TFSI Petrol",1984,"Petrol","selected generations"),e("audi-q5-30t","3.0 TFSI Petrol",2995,"Petrol","selected trims"),e("audi-q5-20d","2.0 TDI Diesel",1968,"Diesel","selected generations")] }
  ]},
  { name: "Hyundai", models: [
    { name: "Elantra", engines: [e("hy-el-16","1.6 Petrol",1591,"Petrol","selected markets"),e("hy-el-20","2.0 Petrol",1999,"Petrol","selected markets"),e("hy-el-16d","1.6 Diesel",1582,"Diesel","selected markets"),e("hy-el-16h","1.6 Hybrid",1580,"Hybrid","selected markets")] },
    { name: "Sonata", engines: [e("hy-son-24","2.4 Petrol",2359,"Petrol","older generations"),e("hy-son-20t","2.0 Turbo Petrol",1998,"Petrol","selected generations"),e("hy-son-20h","2.0 Hybrid",1999,"Hybrid","selected generations")] },
    { name: "Tucson", engines: [e("hy-tuc-20","2.0 Petrol",1999,"Petrol","selected markets"),e("hy-tuc-16t","1.6 Turbo Petrol",1591,"Petrol","selected generations"),e("hy-tuc-20d","2.0 Diesel",1995,"Diesel","selected markets"),e("hy-tuc-16h","1.6 Hybrid",1598,"Hybrid","selected generations")] }
  ]},
  { name: "Kia", models: [
    { name: "Sportage", engines: [e("kia-sp-20","2.0 Petrol",1999,"Petrol","selected markets"),e("kia-sp-24","2.4 Petrol",2359,"Petrol","selected generations"),e("kia-sp-16t","1.6 Turbo Petrol",1591,"Petrol","selected generations"),e("kia-sp-20d","2.0 Diesel",1995,"Diesel","selected markets"),e("kia-sp-16h","1.6 Hybrid",1598,"Hybrid","selected generations")] },
    { name: "Optima / K5", engines: [e("kia-op-24","2.4 Petrol",2359,"Petrol","selected generations"),e("kia-op-20t","2.0 Turbo Petrol",1998,"Petrol","selected generations"),e("kia-op-20h","2.0 Hybrid",1999,"Hybrid","selected generations")] },
    { name: "Sorento", engines: [e("kia-so-24","2.4 Petrol",2359,"Petrol","selected generations"),e("kia-so-33","3.3 V6 Petrol",3342,"Petrol","selected generations"),e("kia-so-22d","2.2 Diesel",2199,"Diesel","selected generations"),e("kia-so-16h","1.6 Hybrid",1598,"Hybrid","selected generations")] }
  ]},
  { name: "Lexus", models: [
    { name: "RX", engines: [e("lex-rx-35","3.5 V6 Petrol",3456,"Petrol","older generations"),e("lex-rx-20t","2.0 Turbo Petrol",1998,"Petrol","selected generations"),e("lex-rx-35h","3.5 Hybrid",3456,"Hybrid","older generations"),e("lex-rx-25h","2.5 Hybrid",2487,"Hybrid","selected generations")] },
    { name: "IS", engines: [e("lex-is-25","2.5 V6 Petrol",2499,"Petrol","selected generations"),e("lex-is-35","3.5 V6 Petrol",3456,"Petrol","selected generations"),e("lex-is-20t","2.0 Turbo Petrol",1998,"Petrol","selected generations")] },
    { name: "NX", engines: [e("lex-nx-20t","2.0 Turbo Petrol",1998,"Petrol","2015 onward"),e("lex-nx-25h","2.5 Hybrid",2487,"Hybrid","2015 onward")] }
  ]},
  { name: "Nissan", models: [
    { name: "Altima", engines: [e("nis-alt-25","2.5 Petrol",2488,"Petrol","2002 onward"),e("nis-alt-35","3.5 V6 Petrol",3498,"Petrol","selected generations"),e("nis-alt-20t","2.0 VC-Turbo Petrol",1997,"Petrol","selected generations")] },
    { name: "X-Trail / Rogue", engines: [e("nis-x-25","2.5 Petrol",2488,"Petrol","selected generations"),e("nis-x-20h","2.0 Hybrid",1997,"Hybrid","selected markets"),e("nis-x-15t","1.5 VC-Turbo",1497,"Petrol","selected recent models")] },
    { name: "Leaf", engines: [e("nis-leaf-ev","Electric motor",0,"Electric","all generations","Electric vehicles need the official tax calculator; this estimator does not calculate EV rules.")] }
  ]},
  { name: "Mazda", models: [
    { name: "Mazda3", engines: [e("maz-3-15","1.5 Petrol",1496,"Petrol","selected markets"),e("maz-3-20","2.0 Petrol",1998,"Petrol","selected generations"),e("maz-3-25","2.5 Petrol",2488,"Petrol","selected markets"),e("maz-3-22d","2.2 Diesel",2191,"Diesel","selected markets")] },
    { name: "CX-5", engines: [e("maz-cx5-20","2.0 Petrol",1998,"Petrol","selected markets"),e("maz-cx5-25","2.5 Petrol",2488,"Petrol","selected markets"),e("maz-cx5-22d","2.2 Diesel",2191,"Diesel","selected markets")] }
  ]},
  { name: "Subaru", models: [
    { name: "Forester", engines: [e("sub-for-20","2.0 Petrol",1995,"Petrol","selected generations"),e("sub-for-25","2.5 Petrol",2498,"Petrol","selected markets"),e("sub-for-20d","2.0 Diesel",1998,"Diesel","selected markets"),e("sub-for-20h","2.0 Hybrid",1995,"Hybrid","selected markets")] },
    { name: "Impreza", engines: [e("sub-imp-16","1.6 Petrol",1599,"Petrol","selected markets"),e("sub-imp-20","2.0 Petrol",1995,"Petrol","selected generations"),e("sub-imp-25t","2.5 Turbo Petrol",2457,"Petrol","WRX / selected trims")] }
  ]},
  { name: "Ford", models: [
    { name: "Fusion / Mondeo", engines: [e("ford-fus-15t","1.5 EcoBoost Petrol",1498,"Petrol","selected generations"),e("ford-fus-20t","2.0 EcoBoost Petrol",1999,"Petrol","selected generations"),e("ford-fus-25","2.5 Petrol",2488,"Petrol","selected markets"),e("ford-fus-20h","2.0 Hybrid",1999,"Hybrid","selected generations"),e("ford-mon-20d","2.0 TDCi Diesel",1997,"Diesel","selected generations")] },
    { name: "Escape / Kuga", engines: [e("ford-esc-15t","1.5 EcoBoost Petrol",1498,"Petrol","selected generations"),e("ford-esc-20t","2.0 EcoBoost Petrol",1999,"Petrol","selected generations"),e("ford-esc-25h","2.5 Hybrid",2488,"Hybrid","selected generations"),e("ford-esc-20d","2.0 Diesel",1997,"Diesel","selected markets")] }
  ]},
  { name: "Chevrolet", models: [
    { name: "Cruze", engines: [e("chev-cr-14t","1.4 Turbo Petrol",1364,"Petrol","selected generations"),e("chev-cr-18","1.8 Petrol",1796,"Petrol","selected generations"),e("chev-cr-16d","1.6 Diesel",1598,"Diesel","selected markets")] },
    { name: "Malibu", engines: [e("chev-mal-15t","1.5 Turbo Petrol",1490,"Petrol","selected generations"),e("chev-mal-20t","2.0 Turbo Petrol",1998,"Petrol","selected generations"),e("chev-mal-25","2.5 Petrol",2457,"Petrol","selected generations"),e("chev-mal-18h","1.8 Hybrid",1796,"Hybrid","selected generations")] }
  ]},
  { name: "Tesla", models: [
    { name: "Model 3", engines: [e("tesla-m3-ev","Electric motor",0,"Electric","all generations","Electric vehicles need the official tax calculator; this estimator does not calculate EV rules.")] },
    { name: "Model Y", engines: [e("tesla-my-ev","Electric motor",0,"Electric","all generations","Electric vehicles need the official tax calculator; this estimator does not calculate EV rules.")] }
  ]}
];

export const importCountries = [
  "United States", "Japan", "Germany", "South Korea", "United Kingdom",
  "Canada", "United Arab Emirates", "Italy", "France", "Netherlands",
  "Belgium", "Poland", "Other"
];
