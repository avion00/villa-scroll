export type Guide = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  sections: { title: string; paragraphs: string[] }[];
};

export const guides: Guide[] = [
  {
    slug: "understanding-a-property-listing",
    category: "Buying well",
    title: "How to read a property listing",
    excerpt: "A practical checklist for separating supplied facts from questions to verify.",
    sections: [
      { title: "Start with the essentials", paragraphs: ["Check the asking price, transaction type, property type, community, bedroom count and area. Confirm whether an area refers to built-up space, plot size or another measurement.", "Listing references and photographs can help identify the home, but do not replace current confirmation from the agent or owner."] },
      { title: "Ask about what is not stated", paragraphs: ["A missing bathroom count, availability date, furnishing status, floor plan or tenure is not an invitation to guess. Ask for the relevant documentation and current status.", "For a villa, keep built-up area and plot area separate. Ask which measurement supports any quoted price-per-square-foot calculation."] },
      { title: "Verify before committing", paragraphs: ["Arrange a viewing, confirm the parties are authorized to transact and review applicable documents with qualified local professionals. Any online summary should be treated as an initial reference, not legal or financial advice."] },
    ],
  },
  {
    slug: "choosing-a-dubai-community",
    category: "Area guide",
    title: "Choosing a Dubai community",
    excerpt: "Build a shortlist around your routines, preferred home type and practical priorities.",
    sections: [
      { title: "Think about everyday routines", paragraphs: ["Consider where you work, how you travel, who shares your home and the facilities that matter to your household. If possible, visit at different times of day.", "Map out your own journeys and verify opening hours, transport connections and facilities directly with their providers. Avoid relying on unverified distance or travel-time claims."] },
      { title: "Match a setting to your home type", paragraphs: ["Compare the home styles available in each community, including apartments, villas and townhouses. Look closely at layout, outdoor space and any community rules that may affect how you plan to use a property.", "Use current listings as an indication of what is being marketed, not a complete picture of the market or a guarantee of availability."] },
      { title: "Make a useful viewing list", paragraphs: ["Write down the questions that matter most before a viewing: current condition, included fixtures, parking, service arrangements and the documents available for review.", "For financial or legal decisions, seek advice from appropriately qualified professionals."] },
    ],
  },
];

export const guideBySlug = (slug: string) => guides.find((guide) => guide.slug === slug);
