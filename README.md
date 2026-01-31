
# Farm 2 Fuel

Farm 2 Fuel is a platform that connects farmers and industries to enable the circular economy by transforming agricultural waste into valuable resources. Farmers can list their crop residues, and industries can source sustainable raw materials for bio-energy, packaging, and more. The platform provides a transparent, trusted, and mobile-first marketplace to increase farmer income and reduce environmental impact.

---

## Features

- Farmer and Industry authentication and dashboards
- List and manage agricultural waste batches
- Industry marketplace for sourcing verified waste
- Real-time notifications and support tickets
- Carbon impact and transaction history tracking
- Modern UI with mobile-first design
- Built with Next.js, TypeScript, Tailwind CSS, and Supabase

---

## Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## Project Structure

- `app/` — Next.js app directory (routes, pages, API endpoints)
- `components/` — Reusable UI and form components
- `lib/` — Utility libraries (auth, db, matching, etc.)
- `public/` — Static files and mock data (JSON)
- `types/` — TypeScript types
- `utils/` — Utility functions and mock data

---

## Environment Variables

Create a `.env.local` file in the root and add your Supabase credentials and any other required environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run lint` — Run ESLint

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

MIT

---

## Contact

For questions or support, please open an issue or contact the project maintainers.

---


