// Playful emoji icons for Build Box options

// Cut Type Emoji Icons
export const CUT_EMOJI_ICONS: Record<string, string> = {
  'Straight Cut': '🍟',
  'Spiral': '🌀',
  'Waffle': '🧇',
  'Shoestring': '🥨',
  'Steak Cut': '🥩',
  'Crinkle Cut': '〰️',
  'Wedge': '🍠',
};

// Seasoning Emoji Icons
export const SEASONING_EMOJI_ICONS: Record<string, string> = {
  'Classic Salt': '🧂',
  'Cajun Spice': '🔥',
  'Ranch Seasoning': '🌿',
  'Truffle & Parmesan': '🍄',
  'Herb Blend': '🌱',
  'Buffalo Seasoning': '🌶️',
  'Garlic & Onion': '🧄',
  'Sweet & Spicy': '🍯🔥',
};

// Sauce Emoji Icons
export const SAUCE_EMOJI_ICONS: Record<string, string> = {
  'Ketchup': '🍅',
  'Ranch': '🥛',
  'BBQ': '🔥',
  'Aioli': '🧄',
  'Buffalo': '🌶️',
  'Garlic Aioli': '🧄',
  'Honey Mustard': '🍯',
  'Sriracha Mayo': '🌶️',
  'Blue Cheese': '🧀',
  'Chipotle Aioli': '🌶️',
  'Truffle Aioli': '🍄',
  'Remoulade': '🍋',
  'Maple Syrup': '🍁',
  'HP Sauce': '🇬🇧',
  'Mayonnaise': '🥚',
};

// Helper function to get emoji icon
export const getEmojiIcon = (type: 'cut' | 'seasoning' | 'sauce', name: string): string => {
  if (type === 'cut') {
    return CUT_EMOJI_ICONS[name] || '🍟';
  }
  if (type === 'seasoning') {
    return SEASONING_EMOJI_ICONS[name] || '🧂';
  }
  if (type === 'sauce') {
    return SAUCE_EMOJI_ICONS[name] || '🍅';
  }
  return '🍟';
};
