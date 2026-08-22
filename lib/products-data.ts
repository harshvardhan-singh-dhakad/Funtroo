export interface ProductData {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  category: 'for-her' | 'for-him' | 'couples' | 'lubricants' | 'lingerie';
  price: number;
  originalPrice: number;
  images: string[];
  description: string;
  features: string[];
  material: string;
  isWaterproof: boolean;
  isRechargeable: boolean;
  intensityModes: number;
  stock: number;
  isFeatured: boolean;
  tags: string[];
  rating: number;
  reviewCount: number;
  soldCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export const PRODUCTS_DATA: ProductData[] = [
  // ==========================================
  // CATEGORY 1: FOR HER (3 Products)
  // ==========================================
  {
    id: 'for-her-rose-vibe',
    _id: 'for-her-rose-vibe',
    name: 'Rose Bloom Suction Vibe Pro',
    slug: 'for-her-rose-vibe',
    category: 'for-her',
    price: 1499,
    originalPrice: 2999,
    images: ['/products/for-her-rose-vibe.jpg'],
    description: 'Designed in soft magenta silicone with luxurious rose gold accents, the Rose Bloom Vibe Pro features 10 air-wave suction intensities and 7 vibration patterns. Engineered with whisper-quiet 38dB motor technology and 100% IPX7 waterproof rating for seamless bath or shower enjoyment.',
    features: [
      'Medical-grade velvety soft silicone body',
      'Next-gen air-pulsation suction & 10 vibration modes',
      'IPX7 100% Waterproof construction',
      'Ultra-quiet 38dB motor for complete privacy',
      'USB Magnetic fast charging (90-min runtime)'
    ],
    material: 'Medical-grade Silicone + Rose Gold ABS',
    isWaterproof: true,
    isRechargeable: true,
    intensityModes: 10,
    stock: 50,
    isFeatured: true,
    tags: ['for-her', 'rose', 'suction', 'vibrator', 'waterproof'],
    rating: 4.9,
    reviewCount: 248,
    soldCount: 412
  },
  {
    id: 'for-her-wand-massager',
    _id: 'for-her-wand-massager',
    name: 'Curved G-Spot Wand Massager',
    slug: 'for-her-wand-massager',
    category: 'for-her',
    price: 1899,
    originalPrice: 3499,
    images: ['/products/for-her-wand-massager.jpg'],
    description: 'Crafted in elegant lavender purple with rose gold accents, this curved wand massager targets internal G-spot zones and external pressure points with deep, thumping vibrations. Includes 12 pulse modes and a flexible neck for ergonomic comfort.',
    features: [
      'Flexible ergonomic neck angled for G-spot precision',
      '12 Intense vibration & pulsing patterns',
      'Whisper-quiet dual-motor performance',
      'Silky-smooth skin-safe silicone head',
      'USB Rechargeable with travel security lock'
    ],
    material: 'Body-safe Silicone + ABS',
    isWaterproof: true,
    isRechargeable: true,
    intensityModes: 12,
    stock: 45,
    isFeatured: true,
    tags: ['for-her', 'wand', 'g-spot', 'massager', 'rechargeable'],
    rating: 4.8,
    reviewCount: 192,
    soldCount: 285
  },
  {
    id: 'for-her-dual-stimulator',
    _id: 'for-her-dual-stimulator',
    name: 'Velvet Touch Dual Stimulator',
    slug: 'for-her-dual-stimulator',
    category: 'for-her',
    price: 2299,
    originalPrice: 4199,
    images: ['/products/for-her-dual-stimulator.jpg'],
    description: 'Finished in soft blush pink with metallic gold embellishments, the Velvet Touch Dual Stimulator provides simultaneous internal shaft stimulation and external flexible rabbit ears. Dual independent motors allow custom vibration combinations.',
    features: [
      'Dual independent motors with 10 vibration speeds',
      'Flexible rabbit ears for precise external contact',
      'Ergonomic contoured shaft for effortless comfort',
      'Body-safe non-porous liquid silicone',
      'Fully IPX7 waterproof & magnetic charging'
    ],
    material: 'Liquid Silicone + Gold Trim',
    isWaterproof: true,
    isRechargeable: true,
    intensityModes: 10,
    stock: 35,
    isFeatured: true,
    tags: ['for-her', 'dual', 'rabbit', 'vibrator', 'g-spot'],
    rating: 4.9,
    reviewCount: 164,
    soldCount: 210
  },

  // ==========================================
  // CATEGORY 2: FOR HIM (3 Products)
  // ==========================================
  {
    id: 'for-him-stamina-ring',
    _id: 'for-him-stamina-ring',
    name: 'Apex Pulsing Stamina Ring',
    slug: 'for-him-stamina-ring',
    category: 'for-him',
    price: 999,
    originalPrice: 1899,
    images: ['/products/for-him-stamina-ring.jpg'],
    description: 'Constructed from ultra-stretchable matte black silicone with electric purple accents, the Apex Stamina Ring restricts blood flow for firmer endurance while delivering 9 powerful vibration modes directly to both partners.',
    features: [
      'Ultra-stretchable medical silicone fits all sizes comfortably',
      '9 Vibration & pulsation frequencies for mutual pleasure',
      'Enhances stamina, firmness, and endurance',
      '100% Waterproof & easy water cleanup',
      'USB Rechargeable (45-min battery life)'
    ],
    material: 'Stretchy Medical Silicone',
    isWaterproof: true,
    isRechargeable: true,
    intensityModes: 9,
    stock: 65,
    isFeatured: true,
    tags: ['for-him', 'stamina', 'ring', 'vibrating', 'couples'],
    rating: 4.7,
    reviewCount: 188,
    soldCount: 340
  },
  {
    id: 'for-him-textured-stroker',
    _id: 'for-him-textured-stroker',
    name: 'Pro-Textured Ergonomic Stroker',
    slug: 'for-him-textured-stroker',
    category: 'for-him',
    price: 1799,
    originalPrice: 3199,
    images: ['/products/for-him-textured-stroker.jpg'],
    description: 'Designed in sleek charcoal black with LED status indicator lighting, this ergonomic stroker features a inner sleeve lined with intricate ribs and nubs. Equipped with a suction adjustment valve to simulate realistic sensations.',
    features: [
      'Internal 3D ribbed & beaded pleasure texture',
      'Adjustable suction valve for custom tightness',
      'Discreet sleek outer casing for easy storage',
      'Skin-like TPE material, warm water washable',
      'Open-ended design for effortless maintenance'
    ],
    material: 'Super-soft TPE + ABS Casing',
    isWaterproof: false,
    isRechargeable: false,
    intensityModes: 0,
    stock: 40,
    isFeatured: true,
    tags: ['for-him', 'stroker', 'masturbator', 'textured'],
    rating: 4.8,
    reviewCount: 142,
    soldCount: 260
  },
  {
    id: 'for-him-prostate-massager',
    _id: 'for-him-prostate-massager',
    name: 'Midnight Contour Prostate Massager',
    slug: 'for-him-prostate-massager',
    category: 'for-him',
    price: 2499,
    originalPrice: 4499,
    images: ['/products/for-him-prostate-massager.jpg'],
    description: 'Crafted in deep midnight purple with an anatomically curved tip, the Midnight Contour targets P-spot stimulation while its outer node delivers rhythmic vibrations to the perineum. Fully waterproof with 10 vibration frequencies.',
    features: [
      'Anatomical P-spot curve for precise contact',
      'Dual vibration nodes for internal & perineum stimulation',
      'Flared safety base for hands-free confidence',
      '100% Seamless medical silicone construction',
      'Quiet motor & magnetic USB fast charger'
    ],
    material: 'Medical Silicone',
    isWaterproof: true,
    isRechargeable: true,
    intensityModes: 10,
    stock: 30,
    isFeatured: true,
    tags: ['for-him', 'prostate', 'massager', 'p-spot', 'vibrator'],
    rating: 4.9,
    reviewCount: 116,
    soldCount: 175
  },

  // ==========================================
  // CATEGORY 3: COUPLES (3 Products)
  // ==========================================
  {
    id: 'couples-wearable-vibe',
    _id: 'couples-wearable-vibe',
    name: 'Remote Wearable Couples Vibrator',
    slug: 'couples-wearable-vibe',
    category: 'couples',
    price: 2699,
    originalPrice: 4999,
    images: ['/products/couples-wearable-vibe.jpg'],
    description: 'Engineered in royal purple and pearl white, this flexible C-shaped device fits comfortably during intercourse. Features a wireless remote control (up to 12 meters range) allowing partners to control 10 vibration modes effortlessly.',
    features: [
      'Flexible C-shape fits seamlessly during lovemaking',
      'Wireless remote control with 12m operating distance',
      'Dual stimulation for clitoral & G-spot zones during penetration',
      'Silky-smooth body-safe silicone',
      'Waterproof (IPX7) & USB rechargeable'
    ],
    material: 'Silky Silicone + ABS Remote',
    isWaterproof: true,
    isRechargeable: true,
    intensityModes: 10,
    stock: 50,
    isFeatured: true,
    tags: ['couples', 'remote', 'wearable', 'c-shape', 'vibrator'],
    rating: 4.9,
    reviewCount: 215,
    soldCount: 310
  },
  {
    id: 'couples-intimacy-kit',
    _id: 'couples-intimacy-kit',
    name: 'Luxury Passion Intimacy Gift Kit',
    slug: 'couples-intimacy-kit',
    category: 'couples',
    price: 3499,
    originalPrice: 5999,
    images: ['/products/couples-intimacy-kit.jpg'],
    description: 'Housed in a regal purple & gold presentation box, this intimacy kit includes a remote couple vibrator, 100ml warming massage oil, a silk blindfold, soft satin wrist restraints, and romantic intimacy dice games.',
    features: [
      'Includes Remote Couple Vibe + Massage Oil + Blindfold + Restraints',
      'Perfect luxury gift for anniversaries & honeymooners',
      'All items 100% body-safe & dermatologically tested',
      'Discreet gift box packaging',
      'Includes quick-start intimacy guide card'
    ],
    material: 'Multi-material Kit Box',
    isWaterproof: false,
    isRechargeable: true,
    intensityModes: 7,
    stock: 25,
    isFeatured: true,
    tags: ['couples', 'kit', 'gift', 'massage', 'romance'],
    rating: 5.0,
    reviewCount: 132,
    soldCount: 195
  },
  {
    id: 'couples-ring-set',
    _id: 'couples-ring-set',
    name: 'Silicone Comfort Pleasure Ring Trio',
    slug: 'couples-ring-set',
    category: 'couples',
    price: 699,
    originalPrice: 1299,
    images: ['/products/couples-ring-set.jpg'],
    description: 'A set of 3 stretchy, velvet-soft silicone pleasure rings in blush pink, midnight purple, and charcoal black. Designed in various textures and thicknesses for custom comfort, enhanced stamina, and heightened contact.',
    features: [
      'Set of 3 progressive stretch silicone rings',
      'Promotes longer endurance and firmer intimacy',
      'Reusable, waterproof & easily cleaned with warm water',
      'Hypoallergenic phthalate-free silicone',
      'Compact & travel-friendly'
    ],
    material: 'Ultra-stretch Silicone',
    isWaterproof: true,
    isRechargeable: false,
    intensityModes: 0,
    stock: 90,
    isFeatured: false,
    tags: ['couples', 'rings', 'silicone', 'stamina'],
    rating: 4.6,
    reviewCount: 178,
    soldCount: 410
  },

  // ==========================================
  // CATEGORY 4: LUBRICANTS (3 Products)
  // ==========================================
  {
    id: 'lube-water-based',
    _id: 'lube-water-based',
    name: 'Silk Glide Pure Water Lubricant (100ml)',
    slug: 'lube-water-based',
    category: 'lubricants',
    price: 499,
    originalPrice: 799,
    images: ['/products/lube-water-based.jpg'],
    description: 'Formulated with pure deionized water and natural botanical extracts, Silk Glide provides long-lasting lubrication that feels natural and smooth. Condom-compatible, toy-safe, pH balanced, and easily rinses clean.',
    features: [
      '100% Natural water-based formula',
      'Safe with latex condoms & silicone toys',
      'pH Balanced (4.5) to support natural intimate flora',
      'Non-staining & non-sticky feel',
      'Elegant frosted glass pump dispenser'
    ],
    material: 'Purified Water + Plant Extracts',
    isWaterproof: false,
    isRechargeable: false,
    intensityModes: 0,
    stock: 150,
    isFeatured: true,
    tags: ['lubricants', 'water-based', 'natural', 'toy-safe'],
    rating: 4.9,
    reviewCount: 385,
    soldCount: 680
  },
  {
    id: 'lube-warming-oil',
    _id: 'lube-warming-oil',
    name: 'Sensual Sensations Warming Massage Oil (150ml)',
    slug: 'lube-warming-oil',
    category: 'lubricants',
    price: 599,
    originalPrice: 999,
    images: ['/products/lube-warming-oil.jpg'],
    description: 'Housed in an amber glass dropper bottle with gold foil accents, this massage oil warms gently upon skin contact and light blowing. Rich in vitamin E and natural essential oils for silk-soft foreplay massages.',
    features: [
      'Gently warms upon skin contact & light breath',
      'Infused with Vitamin E & moisturizing botanicals',
      'Subtle aphrodisiac rose & amber aroma',
      'Non-greasy, edible-safe formulation',
      'Dropper top for precise application'
    ],
    material: 'Natural Essential Oils Base',
    isWaterproof: false,
    isRechargeable: false,
    intensityModes: 0,
    stock: 85,
    isFeatured: true,
    tags: ['lubricants', 'massage', 'warming', 'oil'],
    rating: 4.8,
    reviewCount: 210,
    soldCount: 390
  },
  {
    id: 'lube-organic-aloe',
    _id: 'lube-organic-aloe',
    name: 'Organic Pure Aloe Vera Soothing Gel (120ml)',
    slug: 'lube-organic-aloe',
    category: 'lubricants',
    price: 549,
    originalPrice: 899,
    images: ['/products/lube-organic-aloe.jpg'],
    description: 'Crafted from cold-pressed organic aloe vera leaf juice, this soothing gel hydrates sensitive intimate skin while providing frictionless glide. Free from synthetic parabens, petrochemicals, or artificial dyes.',
    features: [
      '99% Certified organic cold-pressed aloe vera',
      'Soothes sensitive skin & provides natural glide',
      'Zero parabens, glycerin, or artificial fragrance',
      'Hypoallergenic & recommended by gynecologists',
      'Multi-use for intimate lube & body hydration'
    ],
    material: '99% Pure Organic Aloe Vera',
    isWaterproof: false,
    isRechargeable: false,
    intensityModes: 0,
    stock: 110,
    isFeatured: false,
    tags: ['lubricants', 'aloe', 'organic', 'soothing'],
    rating: 4.8,
    reviewCount: 145,
    soldCount: 280
  },

  // ==========================================
  // CATEGORY 5: LINGERIE (3 Products)
  // ==========================================
  {
    id: 'lingerie-black-lace-bodysuit',
    _id: 'lingerie-black-lace-bodysuit',
    name: 'Midnight Floral Lace Bodysuit',
    slug: 'lingerie-black-lace-bodysuit',
    category: 'lingerie',
    price: 1199,
    originalPrice: 2199,
    images: ['/products/lingerie-black-lace-bodysuit.jpg'],
    description: 'Crafted from sheer floral eyelash lace and stretch mesh, this midnight black bodysuit features scalloped plunge trimming, adjustable criss-cross back straps, and snap-crotch closure for effortless elegance.',
    features: [
      'Ultra-soft stretch floral eyelash lace',
      'Adjustable shoulder & back crossover straps',
      'Bottom snap-crotch closure for convenience',
      'Flattering figure-hugging fit (Sizes S-XL)',
      'Includes discreet laundry mesh bag'
    ],
    material: 'Eyelash Lace + Nylon Mesh',
    isWaterproof: false,
    isRechargeable: false,
    intensityModes: 0,
    stock: 60,
    isFeatured: true,
    tags: ['lingerie', 'lace', 'bodysuit', 'black'],
    rating: 4.8,
    reviewCount: 195,
    soldCount: 310
  },
  {
    id: 'lingerie-satin-kimono-robe',
    _id: 'lingerie-satin-kimono-robe',
    name: 'Royal Silk Satin Kimono Robe',
    slug: 'lingerie-satin-kimono-robe',
    category: 'lingerie',
    price: 1499,
    originalPrice: 2799,
    images: ['/products/lingerie-satin-kimono-robe.jpg'],
    description: 'Made from heavyweight silk-satin fabric in rich royal purple, this mid-length kimono robe features wide 3/4 sleeves trimmed with black eyelash lace, a matching waist tie belt, and internal tie closures.',
    features: [
      'Heavyweight silk-finish satin with premium shine',
      'Intricate black lace trim along sleeve cuffs',
      'Detachable waist belt & inner tie security',
      'Silky soft, lightweight & breathable feel',
      'Available in Free-Size (Fits S to XL)'
    ],
    material: 'Heavyweight Silk-Satin + Lace',
    isWaterproof: false,
    isRechargeable: false,
    intensityModes: 0,
    stock: 45,
    isFeatured: true,
    tags: ['lingerie', 'robe', 'satin', 'purple', 'kimono'],
    rating: 4.9,
    reviewCount: 160,
    soldCount: 240
  },
  {
    id: 'lingerie-crimson-silk-chemise',
    _id: 'lingerie-crimson-silk-chemise',
    name: 'Crimson Velvet Silk Chemise Set',
    slug: 'lingerie-crimson-silk-chemise',
    category: 'lingerie',
    price: 1299,
    originalPrice: 2399,
    images: ['/products/lingerie-crimson-silk-chemise.jpg'],
    description: 'Designed in rich crimson red silk-satin with black lace bust paneling, this nightgown chemise hugs natural curves gracefully. Comes complete with a matching satin G-string panty.',
    features: [
      'Rich crimson red silk-satin with lace trim',
      'Includes matching satin G-string panty',
      'Adjustable thin spaghetti shoulder straps',
      'Flowy A-line silhouette for flattering drape',
      'Gentle hand-wash friendly fabric'
    ],
    material: 'Crimson Silk-Satin + Lace',
    isWaterproof: false,
    isRechargeable: false,
    intensityModes: 0,
    stock: 50,
    isFeatured: false,
    tags: ['lingerie', 'chemise', 'red', 'silk', 'set'],
    rating: 4.7,
    reviewCount: 128,
    soldCount: 185
  }
];
