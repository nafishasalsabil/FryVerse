import { Fry } from '@/data/fries';
import { Sauce } from '@/data/sauces';

// Generate pairing reasons based on fry and sauce characteristics
export const getPairingReason = (_fry: Fry, sauce: Sauce): string => {
  const reasons: Record<string, string[]> = {
    'Ketchup': [
      'Sweet acidity cuts the crunch',
      'Classic combo that never fails',
      'Tangy balance for golden fries',
    ],
    'Ranch': [
      'Cool creaminess complements the heat',
      'Herby richness enhances the flavor',
      'Perfect dip for crispy textures',
    ],
    'BBQ': [
      'Smoky sweetness pairs with bold cuts',
      'Tangy depth elevates the experience',
      'Bold flavor matches hearty fries',
    ],
    'Aioli': [
      'Garlicky richness adds depth',
      'Creamy texture enhances crispiness',
      'Elegant pairing for premium fries',
    ],
    'Sriracha Mayo': [
      'Spicy kick meets creamy cool',
      'Heat builds with each bite',
      'Bold flavor for adventurous palates',
    ],
    'Honey Mustard': [
      'Sweet and tangy harmony',
      'Golden glaze complements the fry',
      'Balanced flavor profile',
    ],
    'Buffalo Sauce': [
      'Fiery heat for bold fries',
      'Tangy spice cuts through richness',
      'Maximum flavor explosion',
    ],
    'Blue Cheese': [
      'Bold tang complements hearty cuts',
      'Creamy richness balances spice',
      'Classic pairing for loaded fries',
    ],
    'Garlic Aioli': [
      'Extra garlicky goodness',
      'Creamy garlic enhances every bite',
      'Rich flavor for premium experience',
    ],
    'Chipotle Aioli': [
      'Smoky heat with creamy cool',
      'Spicy depth adds complexity',
      'Bold flavor for textured cuts',
    ],
    'Truffle Aioli': [
      'Luxurious earthy notes',
      'Elegant pairing for premium fries',
      'Sophisticated flavor profile',
    ],
    'Remoulade': [
      'Zesty tang complements bold cuts',
      'Creamy with a kick',
      'Complex flavor for adventurous eaters',
    ],
    'Maple Syrup': [
      'Sweet breakfast vibes',
      'Caramelized notes enhance sweetness',
      'Comfort food perfection',
    ],
    'HP Sauce': [
      'British classic tang',
      'Vinegary depth cuts richness',
      'Traditional pairing for classic cuts',
    ],
    'Mayonnaise': [
      'Simple creamy perfection',
      'Clean flavor lets fries shine',
      'Classic European pairing',
    ],
  };

  const sauceReasons = reasons[sauce.name] || [
    'Perfect flavor harmony',
    'Complements the fry beautifully',
    'Delicious pairing',
  ];

  // Return a random reason for variety, or the first one
  return sauceReasons[Math.floor(Math.random() * sauceReasons.length)];
};
