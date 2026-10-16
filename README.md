# Villa Scroll

An original, responsive Dubai property-discovery demonstration built with the Next.js App Router, TypeScript and Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Use `npm run lint` and `npm run build` to check the project and create a production build.

## Main routes

- `/` — cinematic property discovery homepage
- `/properties`, `/properties/for-sale`, `/properties/for-rent` — searchable local listing collection
- `/properties/[slug]` — listing details, gallery, source link, comparison and enquiry form
- `/areas` and `/communities` — Dubai location directories and individual guides
- `/off-plan` — off-plan directory (no verified development records are configured)
- `/services` — buying, selling, renting, property management and investment guidance
- `/contact`, `/book-a-viewing`, `/property-valuation` — validated enquiry forms
- `/mortgage-calculator`, `/favorites`, `/compare`, `/guides`

The homepage opens directly on a single pinned HTML canvas section. GSAP ScrollTrigger progress selects the displayed frame in `app/components/frame-sequence-canvas.tsx`; no video or autonomous playback loop is used. The first 150 frames preload before the clean progress indicator clears, and the remaining frames load in the background. Lenis smooth scrolling is connected to the GSAP ticker by `app/components/smooth-scroll-provider.tsx`. The same minimal Properties, Areas and Contact navigation is shared across the homepage and sub-pages.

## Configuration before production

- Set `NEXT_PUBLIC_SITE_URL` to the deployed canonical origin to enable absolute canonical metadata and a populated sitemap.
- Set `NEXT_PUBLIC_MAP_PROVIDER` to `google` for an area-level embedded Google Maps search. The default is `google`; map searches do not identify a precise property pin.
- Configure the real business name and verified contact details in `app/lib/site.ts`. Footer social links currently point to the Espace Real Estate profiles supplied for this demonstration.
- Connect `app/lib/inquiries.ts` to a server-side CRM, email service or API before accepting leads. The current adapter intentionally reports that inquiries are not sent or stored.
- Configure verified agent and development data before publishing those profiles.

## Listing-data and asset notes

The six records in `app/lib/properties.ts` are demonstration data transcribed from user-supplied reference details. They are not a complete inventory, and their prices, availability and listing facts require confirmation. The Harmony 2 listing retains the supplied four-bedroom metadata and separate five-bedroom headline discrepancy.

The supplied CloudFront image URLs are third-party reference assets. Their URLs were reachable when checked, but usage rights, continued availability and permission to publish must be confirmed. A local frame is shown if a remote cover image cannot load.

The 720 extracted frames are under `public/frames/`. The original `public/house.mp4` is retained as an unused asset.

No real company address, phone number, email, agent identity, testimonial, market statistic, rental estimate or development financial data is configured. Mortgage and additional-cost results are estimates based only on user-entered assumptions.
