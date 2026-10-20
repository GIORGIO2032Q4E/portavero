# Portavero

Portavero is a small personal web project about planning import costs, with an initial focus on bringing goods and cars into Georgia.

The idea is simple: enter the costs you already know, see their total, and keep track of the costs you still need to confirm.

## What it can do

- Add up costs entered in the general import calculator.
- Show which cost fields are still blank.
- Calculate an average cost per item.
- Give a preliminary excise estimate for some passenger vehicles imported into Georgia.
- Show a checklist of questions to ask a shipping provider.

## What it cannot do yet

- Find live shipping prices or compare real carrier quotes.
- Convert currencies using live exchange rates.
- Book shipments or track cargo.
- Calculate every customs duty, tax, or service fee.
- Replace the official Revenue Service calculator.

The numbers are for planning only. Check important costs with the carrier, customs professional, or official source before relying on them. The vehicle estimate has limits, including fully electric vehicles and possible transitional rules. Check the [official Revenue Service calculator](https://www.rs.ge/CarClearance-en) for the specific vehicle.

## Run it locally

You need Node.js and npm installed.

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Useful commands

```bash
npm run lint
npm run typecheck
npm run build
```

## Technologies

- Next.js
- React
- TypeScript
- CSS

This is an early version of the project. I plan to improve it as I test the tools and verify the information.

## Deployment

The project can be deployed on a Next.js hosting service such as Vercel. Do not add passwords, API keys, or other private credentials to the repository.
