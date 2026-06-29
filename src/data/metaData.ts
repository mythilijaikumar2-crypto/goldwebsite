export interface CategoryDetail {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface BlogQA {
  question: string;
  answer: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  readTime: string;
  date: string;
  category: string;
  image: string;
  tags: string[];
  aeoQA: BlogQA[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Purity' | 'Customization' | 'Shipping & Returns';
}

export interface GuideSection {
  title: string;
  content: string;
}

export interface CareGuide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  sections: GuideSection[];
}

export const CATEGORIES_METADATA: CategoryDetail[] = [
  {
    id: "gold-rings",
    name: "Gold Rings",
    description: "Sleek gold bands and diamond-studded promise rings hand-carved to represent eternal commitments.",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "gold-chains",
    name: "Gold Chains",
    description: "Heavy links, rope chains, and modern lightweight styles woven in premium 22K gold.",
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "gold-necklaces",
    name: "Gold Necklaces",
    description: "Breathtaking chokers, layered statements, and royal collars reflecting supreme status and craft.",
    image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "gold-earrings",
    name: "Gold Earrings",
    description: "Elegant studs, modern hoops, and elaborate drops crafted in 18K and 22K hallmark gold.",
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "gold-bangles",
    name: "Gold Bangles",
    description: "Rigid gold cuffs, sleek stacking bangles, and heavily detailed bridal kada pieces.",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "gold-bracelets",
    name: "Gold Bracelets",
    description: "Fluid link chains, luxury tennis bracelets, and diamond-studded gold charms.",
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "gold-pendants",
    name: "Gold Pendants",
    description: "Dainty motifs, religious icons, and custom initial lockets hanging on fine gold strings.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "diamond-jewellery",
    name: "Diamond Jewellery",
    description: "Glimmering certified diamonds set in white and yellow gold, matching modern style.",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "bridal-jewellery",
    name: "Bridal Jewellery",
    description: "Showstopping heavy necklaces, matching waist belts, and crowns for the modern royal wedding.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "temple-jewellery",
    name: "Temple Jewellery",
    description: "Traditional antique designs featuring god medallions and hand-carved heritage sculptures.",
    image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "mens-jewellery",
    name: "Mens Jewellery",
    description: "Bold gold bands, statement rings, heavy rope chains, and structural bracelets.",
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "kids-jewellery",
    name: "Kids Jewellery",
    description: "Safe, lightweight, and adorable small earrings, bracelets, and custom initial pendants.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800"
  }
];

export const BLOGS: BlogPost[] = [
  {
    id: "blog-1",
    title: "Understanding Gold Purity: The Ultimate Guide to 24K, 22K & 18K Gold",
    excerpt: "Confused about what 22K gold means versus 18K? We decode gold purity scales, hallmarks, and alloy combinations to help you buy smart.",
    content: "When purchasing gold jewellery, the term 'Karat' (often abbreviated as 'K' or 'kt') is the most important factor determining both value and durability. 24K gold represents pure gold, containing 99.9% gold content. Because pure gold is exceptionally soft and malleable, it is rarely used in structural jewellery; it bends and scratches easily. \n\nTo make jewellery durable, gold is alloyed with other metals like copper, zinc, and silver. 22K gold consists of 22 parts gold and 2 parts alloy (91.6% purity, hallmark 916), making it the gold standard for traditional bridal necklaces and heavy bands. 18K gold consists of 18 parts gold and 6 parts alloy (75.0% purity, hallmark 750), offering superior structural strength for holding diamonds and gemstones securely.",
    readTime: "5 mins read",
    date: "June 15, 2026",
    category: "Gold Guide",
    image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=800",
    tags: ["Gold Purity", "Buying Advice", "Education"],
    aeoQA: [
      {
        question: "What is the difference between 22K and 18K gold?",
        answer: "22K gold contains 91.6% pure gold and is softer, ideal for all-gold heritage designs. 18K gold contains 75% pure gold, making it stronger and more durable, which is the preferred choice for setting diamonds and gemstones."
      },
      {
        question: "Why is 24K gold not used for making stone-studded jewellery?",
        answer: "24K gold is 99.9% pure, which makes it extremely soft. It lacks the structural rigidity needed to secure claws, prongs, and settings, causing gemstones to fall out easily."
      }
    ]
  },
  {
    id: "blog-2",
    title: "How to Care for Your Luxury Diamond & Gold Jewellery at Home",
    excerpt: "Keep your heirlooms glittering like new. Read our step-by-step masterclass on washing, storing, and polishing gold and diamonds.",
    content: "Dust, perfumes, lotions, and soaps can leave a film over gold and diamonds, clouding their natural brilliance. Regular cleaning at home can easily restore their glow. \n\nTo clean gold and diamonds, mix mild dishwashing liquid with warm (not boiling) water. Soak the jewellery for 15-20 minutes. Use a soft-bristled baby toothbrush to gently scrub the settings, especially behind the stones where oils collect. Rinse with clean warm water, and pat dry using a lint-free cloth. Never use bleach, ammonia, or baking soda scrubs, as they can corrode alloy metals and scratch precious metal surfaces.",
    readTime: "4 mins read",
    date: "May 28, 2026",
    category: "Jewellery Care",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800",
    tags: ["Cleaning Guide", "Maintenance", "DIY Tips"],
    aeoQA: [
      {
        question: "Can I use baking soda to clean my gold jewelry?",
        answer: "No, baking soda is abrasive and can scratch the surface of high-carat gold. Instead, use mild dishwashing liquid, warm water, and a soft-bristled baby toothbrush."
      },
      {
        question: "How should I store my diamond rings to prevent scratches?",
        answer: "Diamonds are the hardest natural substance and can scratch gold, platinum, and other diamonds. Store each piece of diamond jewellery in its own soft fabric pouch or a separate compartment in your jewellery box."
      }
    ]
  },
  {
    id: "blog-3",
    title: "Bridal Jewellery Styling: The Golden Rules for the Modern Bride",
    excerpt: "From heavy chokers to matching bangles, align your bridal set with your neckline and outfit to create an unforgettable statement.",
    content: "Every bride deserves to look like royalty. When planning bridal jewellery, balance is the key rule. If your neckline is heavily embroidered, opt for a statement collar or choker accompanied by smaller studs. For open or deep necklines, layered necklaces (a combination of a choker and a long haaram necklace) create a beautiful, rich look. Ensure that metal colors are consistent—do not mix high-copper rose gold with high-yellow 22K gold. Stick to a unified style language, whether it is antique temple designs or contemporary diamonds.",
    readTime: "6 mins read",
    date: "April 10, 2026",
    category: "Styling Advice",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800",
    tags: ["Bridal Style", "Wedding Tips", "Trends"],
    aeoQA: [
      {
        question: "How do I match jewellery with a high-neck wedding dress?",
        answer: "For a high-neck wedding dress, avoid short chokers. Instead, focus on statement drop earrings, premium bangles, and a long pendant necklace to create a balanced silhouette."
      }
    ]
  }
];

export const FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: "What is BIS Hallmark certification in gold jewellery?",
    answer: "BIS Hallmark is the official purity certification system in India. It indicates that the gold has been tested and certified by an official assaying center. The hallmark consists of three marks: the BIS logo, the purity grade (e.g., 22K916 or 18K750), and a unique 6-digit alphanumeric HUID (Hallmark Unique Identification) code stamped on the piece.",
    category: "Purity"
  },
  {
    id: "faq-2",
    question: "How are making charges calculated on gold jewellery?",
    answer: "Making charges cover the labor and artistic crafting costs of the jewellery. At ASCOPE JEWELLLERY, we charge a transparent making fee either as a flat amount per gram (for chains and bangles) or a percentage of the prevailing gold rate (for complex temple designs). Making charges are clearly detailed before billing.",
    category: "General"
  },
  {
    id: "faq-3",
    question: "Do you offer custom jewellery design services?",
    answer: "Yes, we collaborate with our customers to design custom bespoke rings, necklaces, and bridal sets. You can book an appointment with our head designers, submit sketches or ideas, and review 3D CAD renders before final manufacturing.",
    category: "Customization"
  },
  {
    id: "faq-4",
    question: "What is your refund and return policy for online purchases?",
    answer: "We offer a 14-day hassle-free return policy for unused products in their original packaging with security tags intact. We also offer a lifetime buyback and exchange guarantee on all ASCOPE JEWELLLERY gold and diamond pieces based on prevailing market rates of metal and stone weights.",
    category: "Shipping & Returns"
  },
  {
    id: "faq-5",
    question: "Is it safe to ship high-value gold jewellery to my home?",
    answer: "Yes, we ship all orders in high-security, tamper-evident packages. The transit is 100% insured against loss or theft. A signature and OTP verification from the recipient are strictly required upon delivery.",
    category: "Shipping & Returns"
  }
];

export const CARE_GUIDES: CareGuide[] = [
  {
    id: "gold-purity-guide",
    title: "The Gold Purity Guide",
    subtitle: "Carats, Hallmarks & Certification Demystified",
    description: "Our comprehensive guide helps you understand karat counts and hallmark stamps so you can shop with absolute trust and transparency.",
    sections: [
      {
        title: "The Karat Scale System",
        content: "Gold purity is measured in 24 parts. 24 Karat is pure gold, whereas 22 Karat contains 22 parts gold and 2 parts alloy metals (like copper or silver). The higher the carat, the richer the yellow color, but the softer the metal. 18K gold is highly durable and is preferred for setting heavy gemstones."
      },
      {
        title: "How to Read Hallmark Stamps",
        content: "Look for three symbols inside your jewellery: 1) The triangular BIS logo, 2) The purity symbol (e.g. 916 means 22K, 750 means 18K), and 3) The laser-etched 6-digit alphanumeric HUID code, which allows tracing the piece back to its assay center."
      }
    ]
  },
  {
    id: "jewellery-care-guide",
    title: "Masterclass: Jewellery Care",
    subtitle: "Preserving Luster, Polish & Settings",
    description: "High-quality jewellery can last for generations with simple regular care. Learn how to clean and store your pieces at home.",
    sections: [
      {
        title: "Daily Wear Precautions",
        content: "Always put on jewellery *after* applying cosmetics, hairspray, lotions, and perfumes, as chemicals can tarnish gold and dull diamonds. Take off your rings before swimming, cleaning, or visiting gym."
      },
      {
        title: "Safe Cleaning Routine",
        content: "Soak pieces in warm water with a few drops of mild dish detergent. Clean gently with a soft baby brush, rinse with warm water, and dry thoroughly with a microfiber cloth. Never use ultrasonic cleaners at home for emeralds or pearls, as sound vibrations can crack delicate stones."
      }
    ]
  },
  {
    id: "buying-guide",
    title: "Luxury Jewellery Buying Guide",
    subtitle: "Choosing the Perfect Keepsake",
    description: "Whether picking out an engagement solitaire or investing in gold bars, we outline the primary factors to consider.",
    sections: [
      {
        title: "The 4 Cs of Diamonds",
        content: "When purchasing diamond jewellery, evaluate the 4 Cs: Cut (determining the sparkle), Color (ranging from colorless D to yellow Z), Clarity (evaluating microscopic inclusions), and Carat Weight. We only source GIA & IGI certified conflict-free diamonds."
      },
      {
        title: "Investment Value of Gold",
        content: "Traditional gold jewellery retains strong liquid market values. When buying for investment, check the daily live rate, compare making charges, and request a detailed breakdown of tax, gold cost, and stone cost."
      }
    ]
  }
];
