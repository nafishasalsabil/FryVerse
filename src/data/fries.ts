export interface Fry {
  slug: string;
  name: string;
  cutType: string;
  flavorTags: string[];
  spice: number; // 1-5
  price: number;
  shortDescription: string;
  origin: {
    country: string;
    region?: string;
    story: string;
  };
  ingredients: string[];
  bestSauces: string[];
  textureNotes: string;
}

export const fries: Fry[] = [
  {
    slug: 'classic-crispy',
    name: 'Classic Crispy',
    cutType: 'Straight Cut',
    flavorTags: ['Classic', 'Crispy', 'Golden'],
    spice: 1,
    price: 4.99,
    shortDescription: 'The timeless favorite, perfectly golden and irresistibly crispy.',
    origin: {
      country: 'Belgium',
      region: 'Wallonia',
      story: 'Legend has it that in the 1680s, villagers in the Meuse Valley would fry small fish during winter. When the river froze, they cut potatoes into fish-like shapes and fried them instead. This humble beginning gave birth to the world\'s most beloved snack.',
    },
    ingredients: ['Russet Potatoes', 'Vegetable Oil', 'Sea Salt'],
    bestSauces: ['Ketchup', 'Mayonnaise', 'Aioli'],
    textureNotes: 'Crispy exterior with a fluffy, tender interior. Perfect snap when bitten.',
  },
  {
    slug: 'curly-q',
    name: 'Curly Q',
    cutType: 'Spiral',
    flavorTags: ['Spiral', 'Crunchy', 'Fun'],
    spice: 1,
    price: 5.99,
    shortDescription: 'Spiral-cut perfection that maximizes surface area for maximum crunch.',
    origin: {
      country: 'United States',
      region: 'Texas',
      story: 'Born in the heart of Texas state fairs, the Curly Q was invented by a creative fry master who wanted to make every bite count. The spiral cut ensures every inch is perfectly seasoned and crispy.',
    },
    ingredients: ['Yukon Gold Potatoes', 'Canola Oil', 'Seasoned Salt', 'Paprika'],
    bestSauces: ['Ranch', 'Cheese Sauce', 'BBQ'],
    textureNotes: 'Extra crispy with a satisfying spiral crunch. Holds sauces beautifully.',
  },
  {
    slug: 'waffle-warrior',
    name: 'Waffle Warrior',
    cutType: 'Waffle',
    flavorTags: ['Waffle', 'Textured', 'Bold'],
    spice: 2,
    price: 5.49,
    shortDescription: 'Waffle-cut ridges create pockets of flavor in every bite.',
    origin: {
      country: 'United States',
      region: 'California',
      story: 'Inspired by Belgian waffles, a California chef created this unique cut in the 1990s. The waffle pattern creates more surface area, resulting in an ultra-crispy texture that\'s become a cult favorite.',
    },
    ingredients: ['Red Potatoes', 'Peanut Oil', 'Garlic Powder', 'Onion Powder', 'Cayenne'],
    bestSauces: ['Garlic Aioli', 'Sriracha Mayo', 'Honey Mustard'],
    textureNotes: 'Ridged texture provides extra crunch. Perfect balance of crispy edges and soft center.',
  },
  {
    slug: 'sweet-potato-dreams',
    name: 'Sweet Potato Dreams',
    cutType: 'Straight Cut',
    flavorTags: ['Sweet', 'Caramelized', 'Nutritious'],
    spice: 1,
    price: 6.49,
    shortDescription: 'Naturally sweet with a caramelized edge that\'s pure comfort.',
    origin: {
      country: 'Peru',
      story: 'Sweet potatoes have been cultivated in Peru for over 8,000 years. When Spanish explorers brought them to Europe, they quickly became a delicacy. Our version honors this ancient tradition with modern frying techniques.',
    },
    ingredients: ['Orange Sweet Potatoes', 'Coconut Oil', 'Cinnamon', 'Brown Sugar'],
    bestSauces: ['Maple Syrup', 'Chipotle Aioli', 'Honey Butter'],
    textureNotes: 'Creamy interior with caramelized, slightly chewy edges. Naturally sweet flavor.',
  },
  {
    slug: 'cajun-spice',
    name: 'Cajun Spice',
    cutType: 'Shoestring',
    flavorTags: ['Spicy', 'Cajun', 'Bold'],
    spice: 4,
    price: 5.99,
    shortDescription: 'Shoestring cut meets Louisiana heat for a flavor explosion.',
    origin: {
      country: 'United States',
      region: 'Louisiana',
      story: 'Born in the bayous of Louisiana, these fries carry the spirit of Cajun cuisine. The shoestring cut ensures every fry is coated in our signature spice blend, delivering heat that builds with each bite.',
    },
    ingredients: ['Russet Potatoes', 'Vegetable Oil', 'Cajun Seasoning', 'Paprika', 'Cayenne', 'Garlic Powder'],
    bestSauces: ['Remoulade', 'Blue Cheese', 'Hot Sauce'],
    textureNotes: 'Ultra-crispy and thin. The spice blend creates a flavorful crust.',
  },
  {
    slug: 'truffle-truffle',
    name: 'Truffle Truffle',
    cutType: 'Steak Cut',
    flavorTags: ['Luxury', 'Earthy', 'Elegant'],
    spice: 1,
    price: 8.99,
    shortDescription: 'Steak-cut fries elevated with truffle oil and parmesan.',
    origin: {
      country: 'France',
      region: 'Provence',
      story: 'Inspired by the truffle-rich regions of France, these fries bring luxury to street food. The steak cut provides a substantial base for the earthy truffle flavor, creating an indulgent experience.',
    },
    ingredients: ['Yukon Gold Potatoes', 'Truffle Oil', 'Parmesan Cheese', 'Fresh Parsley', 'Sea Salt'],
    bestSauces: ['Truffle Aioli', 'Garlic Aioli', 'None (they\'re perfect alone)'],
    textureNotes: 'Thick and hearty with a crispy exterior. Creamy interior holds the truffle flavor.',
  },
  {
    slug: 'loaded-ranch',
    name: 'Loaded Ranch',
    cutType: 'Crinkle Cut',
    flavorTags: ['Loaded', 'Creamy', 'Indulgent'],
    spice: 2,
    price: 7.99,
    shortDescription: 'Crinkle-cut fries loaded with ranch seasoning and herbs.',
    origin: {
      country: 'United States',
      region: 'Midwest',
      story: 'The crinkle cut was invented to maximize crispiness, and we\'ve taken it to the next level. Inspired by Midwest comfort food, these fries are seasoned with a ranch blend that\'s both tangy and herbaceous.',
    },
    ingredients: ['Russet Potatoes', 'Vegetable Oil', 'Ranch Seasoning', 'Dill', 'Chives', 'Buttermilk Powder'],
    bestSauces: ['Extra Ranch', 'Blue Cheese', 'Buffalo Sauce'],
    textureNotes: 'Crinkle ridges hold seasoning perfectly. Creamy and tangy with every bite.',
  },
  {
    slug: 'salt-vinegar',
    name: 'Salt & Vinegar',
    cutType: 'Straight Cut',
    flavorTags: ['Tangy', 'Sharp', 'Classic'],
    spice: 1,
    price: 5.49,
    shortDescription: 'Tangy vinegar tang meets sea salt for that addictive British chip flavor.',
    origin: {
      country: 'United Kingdom',
      region: 'England',
      story: 'A British pub classic, salt and vinegar chips have been a staple since the 1950s. The combination of tangy vinegar and sea salt creates a flavor that\'s impossible to stop eating.',
    },
    ingredients: ['Maris Piper Potatoes', 'Vegetable Oil', 'Malt Vinegar', 'Sea Salt'],
    bestSauces: ['None needed', 'Ketchup', 'HP Sauce'],
    textureNotes: 'Crispy with a tangy kick. The vinegar flavor is bold but balanced.',
  },
  {
    slug: 'buffalo-blue',
    name: 'Buffalo Blue',
    cutType: 'Wedge',
    flavorTags: ['Spicy', 'Bold', 'Buffalo'],
    spice: 5,
    price: 6.99,
    shortDescription: 'Wedge-cut fries tossed in buffalo sauce with blue cheese crumbles.',
    origin: {
      country: 'United States',
      region: 'New York',
      story: 'Inspired by Buffalo wings, these fries bring the heat. The wedge cut provides a substantial base that can handle the bold buffalo flavor, while blue cheese crumbles add a cooling contrast.',
    },
    ingredients: ['Russet Potatoes', 'Vegetable Oil', 'Buffalo Sauce', 'Blue Cheese', 'Butter', 'Garlic'],
    bestSauces: ['Extra Blue Cheese', 'Ranch', 'Celery Sticks'],
    textureNotes: 'Thick and hearty. The buffalo sauce creates a sticky, spicy coating.',
  },
  {
    slug: 'herb-garden',
    name: 'Herb Garden',
    cutType: 'Straight Cut',
    flavorTags: ['Fresh', 'Herbaceous', 'Light'],
    spice: 1,
    price: 5.99,
    shortDescription: 'Fresh herbs and lemon zest create a bright, garden-fresh flavor.',
    origin: {
      country: 'Italy',
      region: 'Tuscany',
      story: 'Inspired by the herb gardens of Tuscany, these fries celebrate fresh, simple ingredients. A blend of rosemary, thyme, and parsley with lemon zest creates a light, aromatic experience.',
    },
    ingredients: ['Yukon Gold Potatoes', 'Olive Oil', 'Fresh Rosemary', 'Fresh Thyme', 'Fresh Parsley', 'Lemon Zest'],
    bestSauces: ['Lemon Aioli', 'Garlic Aioli', 'None (herbs shine)'],
    textureNotes: 'Light and crispy. The fresh herbs provide a fragrant, clean flavor.',
  },
];

export const getFryBySlug = (slug: string): Fry | undefined => {
  return fries.find(fry => fry.slug === slug);
};

export const getCutTypes = (): string[] => {
  return Array.from(new Set(fries.map(fry => fry.cutType)));
};

export const getFlavorTags = (): string[] => {
  const allTags = fries.flatMap(fry => fry.flavorTags);
  return Array.from(new Set(allTags));
};
