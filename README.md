# Portavero

**Know the full cost before you import.**

Portavero is a cross-border import planning project, starting with imports into Georgia. It is designed to help people organize costs before committing to a shipment, including goods value, transport, insurance, customs-related costs, and other user-entered fees.

## Project status

The first build focuses on the responsive website, a transparent general import calculator, and the foundation for a vehicle-import workflow. This is an early-stage project, not a customs broker or a source of binding tax advice.

### Important accuracy rules

- Calculations are estimates based on the values the user enters.
- Do not present illustrative values as live freight quotes, official tax rates, partnerships, or shipment tracking.
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
- [x] Vehicle import landing page and initial workflow
- [ ] Verify and document official Georgian vehicle/customs rules
- [ ] Add maintained shipping-rate sources or user-entered quotes
- [ ] Add comparison and PDF export
- [ ] Add accounts and shipment dashboard only when a secure backend is ready

## License

No open-source license has been added yet. All rights reserved by default unless a license is added later.
