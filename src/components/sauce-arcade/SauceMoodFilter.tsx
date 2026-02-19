import { useState } from 'react';

interface SauceMoodFilterProps {
  selectedMood: string | null;
  onMoodChange: (mood: string | null) => void;
}

const moods = [
  { id: 'all', label: 'All', emoji: '🍟' },
  { id: 'spicy', label: 'Spicy', emoji: '🔥' },
  { id: 'tangy', label: 'Tangy', emoji: '🍋' },
  { id: 'creamy', label: 'Creamy', emoji: '🥛' },
  { id: 'sweet', label: 'Sweet', emoji: '🍯' },
];

const SauceMoodFilter = ({ selectedMood, onMoodChange }: SauceMoodFilterProps) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
      {moods.map((mood) => (
        <button
          key={mood.id}
          onClick={() => onMoodChange(mood.id === 'all' ? null : mood.id)}
          className={`
            px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200
            ${
              selectedMood === mood.id || (mood.id === 'all' && selectedMood === null)
                ? 'bg-primary-500 text-white shadow-md scale-105'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-700'
            }
            focus:outline-none
          `}
          aria-label={`Filter by ${mood.label} mood`}
        >
          <span className="mr-1.5">{mood.emoji}</span>
          {mood.label}
        </button>
      ))}
    </div>
  );
};

export default SauceMoodFilter;
