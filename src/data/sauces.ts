export interface Sauce {
  id: string;
  name: string;
  heat: number; // 1-5
  tags: ('spicy' | 'tangy' | 'creamy' | 'sweet')[];
  bestWith: string[]; // Cut types
  shortNote: string;
  badge?: 'NEW' | 'BEST' | 'HOT';
}

export const sauces: Sauce[] = [
  {
    id: 'ketchup',
    name: 'Ketchup',
    heat: 1,
    tags: ['tangy', 'sweet'],
    bestWith: ['Straight Cut', 'Classic'],
    shortNote: 'The timeless classic',
  },
  {
    id: 'ranch',
    name: 'Ranch',
    heat: 1,
    tags: ['creamy'],
    bestWith: ['Waffle', 'Steak Cut'],
    shortNote: 'Cool and creamy',
    badge: 'BEST',
  },
  {
    id: 'bbq',
    name: 'BBQ',
    heat: 2,
    tags: ['tangy', 'sweet'],
    bestWith: ['Waffle', 'Steak Cut'],
    shortNote: 'Smoky and sweet',
  },
  {
    id: 'aioli',
    name: 'Aioli',
    heat: 1,
    tags: ['creamy'],
    bestWith: ['Straight Cut', 'Spiral'],
    shortNote: 'Garlicky goodness',
  },
  {
    id: 'sriracha-mayo',
    name: 'Sriracha Mayo',
    heat: 4,
    tags: ['spicy', 'creamy'],
    bestWith: ['Spiral', 'Waffle'],
    shortNote: 'Spicy meets creamy',
    badge: 'HOT',
  },
  {
    id: 'honey-mustard',
    name: 'Honey Mustard',
    heat: 1,
    tags: ['sweet', 'tangy'],
    bestWith: ['Straight Cut', 'Waffle'],
    shortNote: 'Sweet and tangy',
  },
  {
    id: 'buffalo',
    name: 'Buffalo Sauce',
    heat: 5,
    tags: ['spicy', 'tangy'],
    bestWith: ['Steak Cut', 'Waffle'],
    shortNote: 'Fire in your mouth',
    badge: 'HOT',
  },
  {
    id: 'blue-cheese',
    name: 'Blue Cheese',
    heat: 1,
    tags: ['creamy', 'tangy'],
    bestWith: ['Steak Cut', 'Waffle'],
    shortNote: 'Bold and tangy',
  },
  {
    id: 'garlic-aioli',
    name: 'Garlic Aioli',
    heat: 1,
    tags: ['creamy'],
    bestWith: ['Straight Cut', 'Spiral'],
    shortNote: 'Extra garlicky',
  },
  {
    id: 'chipotle-aioli',
    name: 'Chipotle Aioli',
    heat: 3,
    tags: ['spicy', 'creamy'],
    bestWith: ['Waffle', 'Spiral'],
    shortNote: 'Smoky heat',
  },
  {
    id: 'truffle-aioli',
    name: 'Truffle Aioli',
    heat: 1,
    tags: ['creamy'],
    bestWith: ['Straight Cut', 'Classic'],
    shortNote: 'Luxurious flavor',
    badge: 'NEW',
  },
  {
    id: 'remoulade',
    name: 'Remoulade',
    heat: 2,
    tags: ['tangy', 'creamy'],
    bestWith: ['Steak Cut', 'Waffle'],
    shortNote: 'Zesty and bold',
  },
  {
    id: 'maple-syrup',
    name: 'Maple Syrup',
    heat: 1,
    tags: ['sweet'],
    bestWith: ['Waffle', 'Sweet Potato'],
    shortNote: 'Breakfast vibes',
  },
  {
    id: 'hp-sauce',
    name: 'HP Sauce',
    heat: 2,
    tags: ['tangy', 'sweet'],
    bestWith: ['Straight Cut', 'Classic'],
    shortNote: 'British classic',
  },
  {
    id: 'mayonnaise',
    name: 'Mayonnaise',
    heat: 1,
    tags: ['creamy'],
    bestWith: ['Straight Cut', 'Classic'],
    shortNote: 'Simple perfection',
  },
];

export const getFeaturedSauce = (): Sauce => {
  return sauces.find((s) => s.badge === 'BEST') || sauces[1]; // Default to Ranch
};

export const getSaucesByMood = (mood: string | null): Sauce[] => {
  if (!mood || mood === 'all') return sauces;
  return sauces.filter((sauce) => sauce.tags.includes(mood as any));
};
