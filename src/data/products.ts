export interface ProductReview {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  weight: number; // in grams
  purity: '24K' | '22K' | '18K';
  makingChargesPerGram: number; // USD per gram
  gemstoneType: 'None' | 'Diamond' | 'Emerald' | 'Ruby' | 'Sapphire';
  gemstoneWeight: number; // in carats
  gemstonePrice: number; // flat fee
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  rating: number;
  reviewCount: number;
  images: string[]; // 8 elements corresponding to views
  video: string;
  features: string[];
  reviews: ProductReview[];
}

export const CATEGORIES = [
  "Gold Rings",
  "Gold Chains",
  "Gold Necklaces",
  "Gold Earrings",
  "Gold Bangles",
  "Gold Bracelets",
  "Gold Pendants",
  "Diamond Jewellery",
  "Bridal Jewellery",
  "Temple Jewellery",
  "Mens Jewellery",
  "Kids Jewellery"
];

// Unsplash jewellery image IDs to map realistic luxury products
const UNSPLASH_IDS: Record<string, string[]> = {
  "Gold Rings": [
    "photo-1605100804763-247f67b3557e", // Diamond gold band
    "photo-1603561591411-07134e71a2a9", // Elegant ring
    "photo-1543294001-f7cbfe92237e"  // Stacked gold rings
  ],
  "Gold Chains": [
    "photo-1599643478518-a784e5dc4c8f", // Delicate link chain
    "photo-1617038260897-41a1f14a8ca0", // Gold rope chain
    "photo-1535632066927-ab7c9ab60908"  // Curb chain
  ],
  "Gold Necklaces": [
    "photo-1599643478518-a784e5dc4c8f", // Diamond choker
    "photo-1602751584552-8ba73aad10e1", // Gold necklace close
    "photo-1515562141207-7a88fb7ce338"  // Diamond pearl necklace
  ],
  "Gold Earrings": [
    "photo-1630019852942-f89202989a59", // Hoop gold earrings
    "photo-1635767798638-3e25273a8236", // Diamond drops
    "photo-1535632066927-ab7c9ab60908"  // Drop studs
  ],
  "Gold Bangles": [
    "photo-1611591437281-460bfbe1220a", // Heavy cuff bangle
    "photo-1573408301185-9146fe634ad0", // Traditional Indian gold bangles
    "photo-1611591437281-460bfbe1220a"  // Plain gold bands
  ],
  "Gold Bracelets": [
    "photo-1611591437281-460bfbe1220a", // Gold charm bracelet
    "photo-1573408301185-9146fe634ad0", // Elegant diamond tennis bracelet
    "photo-1611591437281-460bfbe1220a"  // Linked bracelet
  ],
  "Gold Pendants": [
    "photo-1599643478518-a784e5dc4c8f", // Heart pendant
    "photo-1602751584552-8ba73aad10e1", // Coin pendant
    "photo-1515562141207-7a88fb7ce338"  // Floral diamond pendant
  ],
  "Diamond Jewellery": [
    "photo-1605100804763-247f67b3557e", // Diamond ring
    "photo-1599643478518-a784e5dc4c8f", // Diamond necklace
    "photo-1635767798638-3e25273a8236"  // Diamond drops
  ],
  "Bridal Jewellery": [
    "photo-1515562141207-7a88fb7ce338", // Luxury necklace bridal
    "photo-1599643478518-a784e5dc4c8f", // Heavy necklace set
    "photo-1573408301185-9146fe634ad0"  // Bridal cuffs
  ],
  "Temple Jewellery": [
    "photo-1515562141207-7a88fb7ce338", // Temple heritage design
    "photo-1602751584552-8ba73aad10e1", // Gold coin necklace
    "photo-1573408301185-9146fe634ad0"  // Heavy gold cuff
  ],
  "Mens Jewellery": [
    "photo-1617038260897-41a1f14a8ca0", // Gold chain rope
    "photo-1543294001-f7cbfe92237e", // Gold band ring
    "photo-1611591437281-460bfbe1220a"  // Heavy links
  ],
  "Kids Jewellery": [
    "photo-1599643478518-a784e5dc4c8f", // Small gold pendant
    "photo-1630019852942-f89202989a59", // Dainty star earrings
    "photo-1611591437281-460bfbe1220a"  // Kids gold bracelet
  ]
};

// Standard royalty free video loop
const LUXURY_VIDEO_URL = "https://assets.mixkit.co/videos/preview/mixkit-close-up-of-sparkling-wedding-rings-44368-large.mp4";

const ADJECTIVES = ["Aura", "Royal", "Celestial", "Majestic", "Vintage", "Heritage", "Divine", "Elysian", "Regal", "Imperial", "Dynasty", "Sovereign"];
const REVIEWERS = ["Elena Rostova", "Sophia Patel", "David Miller", "Aisha Rahman", "Jean-Pierre", "Chloe Bennett", "Amara Okafor", "Yuki Tanaka"];
const COMMENTS = [
  "Absolutely breathtaking design. The craftsmanship on the gold is second to none.",
  "Stunning finish! The weight feels substantial and the hallmark is clear. Very luxury experience.",
  "Bought this as a wedding gift, and it exceeded all expectations. Incredible sparkle and premium packaging.",
  "A masterpiece of jewellery art. Highly recommend ASCOPE JEWELLLERY for their outstanding customer support.",
  "The 360 view helped me decide. It looks even more beautiful in person! The gold luster is perfect.",
  "Elegant, refined, and classic. The finish is impeccable. Delivery was secure and fast."
];

// Seed generator to make 108 products
const generateProducts = (): Product[] => {
  const list: Product[] = [];
  let count = 0;

  CATEGORIES.forEach((cat) => {
    // Generate 9 products per category (12 * 9 = 108 products)
    for (let i = 1; i <= 9; i++) {
      count++;
      const id = `JKS-${100 + count}`;
      const name = `${ADJECTIVES[(count + i) % ADJECTIVES.length]} ${cat.replace("Jewellery", "").trim()} ${i}`;
      
      // Determine weight based on category
      let baseWeight = 4.5; // rings, earrings
      if (cat.includes("Chains") || cat.includes("Bracelets")) baseWeight = 18.0;
      if (cat.includes("Necklaces") || cat.includes("Bridal") || cat.includes("Temple")) baseWeight = 45.0;
      if (cat.includes("Bangles")) baseWeight = 28.0;
      
      const weight = parseFloat((baseWeight + (i * 1.5) + (count % 3)).toFixed(2));
      
      // Purity selection
      const purity = (count % 3 === 0) ? '18K' : (count % 3 === 1) ? '22K' : '22K'; // Mostly 22K for luxury gold, some 18K for diamonds
      const makingCharges = 8 + (count % 5) * 2; // $8 to $16 per gram

      // Gemstone specifications
      let gemstoneType: Product['gemstoneType'] = 'None';
      let gemstoneWeight = 0;
      let gemstonePrice = 0;
      
      if (cat.includes("Diamond") || (count % 4 === 0 && !cat.includes("Kids"))) {
        gemstoneType = (count % 3 === 0) ? 'Emerald' : (count % 3 === 1) ? 'Ruby' : 'Diamond';
        gemstoneWeight = parseFloat((0.2 + (i * 0.15)).toFixed(2));
        gemstonePrice = gemstoneType === 'Diamond' ? gemstoneWeight * 1200 : gemstoneWeight * 400;
      }

      // Generate 8 images matching the 8 views:
      // Front, Left, Right, Top, Back, Closeup, Model, Lifestyle
      const baseUnsplash = UNSPLASH_IDS[cat] ? UNSPLASH_IDS[cat][i % 3] : "photo-1605100804763-247f67b3557e";
      
      const viewAngles = [
        "&q=80&w=800",                                     // Front
        "&q=80&w=800&fit=crop&crop=focalpoint&fp-x=0.3",    // Left
        "&q=80&w=800&fit=crop&crop=focalpoint&fp-x=0.7",    // Right
        "&q=80&w=800&fit=crop&crop=focalpoint&fp-y=0.3",    // Top
        "&q=80&w=800&fit=crop&crop=focalpoint&fp-y=0.7",    // Back
        "&q=80&w=800&auto=format&fit=crop&zoom=2",          // Closeup
        "&q=80&w=800&fit=crop&crop=faces",                  // Model
        "&q=80&w=800&fit=crop&blend=0A0A0A&blend-mode=overlay" // Lifestyle
      ];

      const images = viewAngles.map((angle) => `https://images.unsplash.com/${baseUnsplash}?auto=format&fit=crop${angle}`);

      // Generate reviews
      const reviews: ProductReview[] = [];
      const reviewCount = 3 + (count % 5);
      for (let r = 0; r < reviewCount; r++) {
        reviews.push({
          id: `rev-${count}-${r}`,
          name: REVIEWERS[(count + r) % REVIEWERS.length],
          rating: 4 + (count + r) % 2, // 4 or 5 stars
          comment: COMMENTS[(count + r) % COMMENTS.length],
          date: new Date(2026, 5 - r, 12 - (r * 2)).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        });
      }

      const rating = parseFloat((4.2 + ((count % 8) * 0.1)).toFixed(1));

      list.push({
        id,
        name,
        category: cat,
        description: `This ${purity} Gold ${cat.toLowerCase().replace("jewellery", "").trim()} is an absolute marvel of artisanal craftsmanship. Part of our signature collection, it features intricate details inspired by classic royal heritages and is forged to perfection. Every curve and polish speaks of timeless elegance and modern sophistication, making it the perfect heirloom to cherish for generations.`,
        weight,
        purity,
        makingChargesPerGram: makingCharges,
        gemstoneType,
        gemstoneWeight,
        gemstonePrice,
        isFeatured: count % 9 === 1,
        isNewArrival: count % 9 === 3,
        isBestSeller: count % 9 === 5,
        rating,
        reviewCount: reviews.length,
        images,
        video: LUXURY_VIDEO_URL,
        features: [
          "BIS Hallmark 916 certified purity assurance",
          "Ethically sourced materials and conflict-free gemstones",
          "Includes luxury leather display casket and certification card",
          "Lifetime buyback and exchange guarantee",
          "Complimentary secure transit insurance & shipping"
        ],
        reviews
      });
    }
  });

  return list;
};

export const productsDatabase: Product[] = generateProducts();
