# Portavero

**Know the full cost before you import.**

Portavero is a cross-border import planning project, starting with imports into Georgia. It is designed to help people organize costs before committing to a shipment, including goods value, transport, insurance, customs-related costs, and other user-entered fees.

## Project status

The current build includes the responsive website, a transparent general import calculator, and a vehicle-import budget planner with a preliminary Georgian passenger-vehicle excise estimate. This is an early-stage project, not a customs broker or a source of binding tax advice.

### Important accuracy rules

- Calculations are estimates based on the values the user enters.
- Do not present illustrative values as live freight quotes, official tax rates, partnerships, or shipment tracking.
- The vehicle planner implements a preliminary excise estimate using the Revenue Service's published April 2, 2026 rates for passenger vehicles classified under HS 8703. It does not calculate import duty or all service fees, does not support the special excise rule for fully electric vehicles, and does not decide whether transitional rules apply.
- Verify the exact vehicle using the [official Revenue Service Auto/Moto Levy Calculator](https://www.rs.ge/CarClearance-en) before making a purchase or shipping decision. See the [Revenue Service notice on the 2026 tax-code change](https://voice.rs.ge/Default.aspx?id=3874).
- Customs and tax rules must be verified against current official Georgian Revenue Service guidance before they are used for real decisions.
- Never commit API keys, passwords, or private credentials.

## Getting started

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful scripts:

```bash
npm run lint
npm run typecheck
npm run build
```

## Stack

- Next.js App Router
- React
- TypeScript
- CSS, with no required UI framework

## Deployment

The app is intended for deployment on a Next.js-compatible host such as Vercel. Connect this repository, keep secrets in the host's environment-variable settings, and deploy the `main` branch. Confirm the production build and review all legal, tax, and pricing information before public launch.

## Roadmap

- [x] Project foundation and brand direction
- [x] Transparent general import cost estimator
- [x] Vehicle import planner with transparent excise estimate and entered-cost budget
- [x] Document official Georgian passenger-vehicle excise rates and transitional-rule caveat
- [ ] Verify full customs duty and service-fee calculations with official sources
- [ ] Add quote comparison and maintained shipping-rate sources or user-entered quotes
- [ ] Add comparison and PDF export
- [ ] Add accounts and shipment dashboard only when a secure backend is ready

## License

No open-source license has been added yet. All rights reserved by default unless a license is added later.
