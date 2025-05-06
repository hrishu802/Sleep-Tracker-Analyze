import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Sleep tips data
const TIPS_CATEGORIES = {
  'bedtime-routine': {
    name: 'Bedtime Routine',
    icon: '🌙',
    tips: [
      {
        title: 'Consistent Schedule',
        description: 'Go to bed and wake up at the same time every day, even on weekends.',
        benefits: 'Regulates your body\'s internal clock and optimizes sleep quality.'
      },
      {
        title: 'Wind-Down Period',
        description: 'Set aside 30-60 minutes of quiet time before bed without screens.',
        benefits: 'Signals to your body that it\'s time to sleep and reduces sleep latency.'
      },
      {
        title: 'Light Reading',
        description: 'Read a physical book (not on a screen) with dim lighting.',
        benefits: 'Relaxes the mind without the sleep-disrupting blue light from electronics.'
      },
      {
        title: 'Gentle Stretching',
        description: 'Do light stretches or yoga poses before bed.',
        benefits: 'Relieves muscle tension and promotes physical relaxation.'
      },
      {
        title: 'Warm Bath or Shower',
        description: 'Take a warm bath or shower 1-2 hours before bedtime.',
        benefits: 'The post-bath drop in body temperature promotes drowsiness.'
      }
    ]
  },
  'sleep-environment': {
    name: 'Sleep Environment',
    icon: '🛏️',
    tips: [
      {
        title: 'Cool Temperature',
        description: 'Keep your bedroom between 60-67°F (15-19°C).',
        benefits: 'Your body naturally cools during sleep; a cool room facilitates this process.'
      },
      {
        title: 'Dark Room',
        description: 'Use blackout curtains or an eye mask to block all light.',
        benefits: 'Darkness triggers melatonin production, the hormone that regulates sleep.'
      },
      {
        title: 'Noise Control',
        description: 'Use earplugs, white noise, or a fan to mask disruptive sounds.',
        benefits: 'Prevents sleep disruption from unexpected noises.'
      },
      {
        title: 'Comfortable Bedding',
        description: 'Invest in a quality mattress and pillows that support your sleep position.',
        benefits: 'Reduces discomfort and prevents unnecessary awakenings due to pain.'
      },
      {
        title: 'Clean Space',
        description: 'Keep your bedroom tidy and free of clutter.',
        benefits: 'A cluttered environment can create stress and anxiety, making it harder to relax.'
      }
    ]
  },
  'diet-exercise': {
    name: 'Diet & Exercise',
    icon: '🏃‍♂️',
    tips: [
      {
        title: 'Morning Exercise',
        description: 'Exercise regularly, but try to finish at least 3 hours before bedtime.',
        benefits: 'Regular exercise promotes deeper sleep, but exercising too late can be stimulating.'
      },
      {
        title: 'Caffeine Cutoff',
        description: 'Avoid caffeine (coffee, tea, soda, chocolate) after 2 PM.',
        benefits: 'Caffeine can stay in your system for 6+ hours, affecting your ability to fall asleep.'
      },
      {
        title: 'Light Evening Meal',
        description: 'Have dinner at least 2-3 hours before bedtime.',
        benefits: 'Gives your body time to digest before sleep, preventing discomfort and reflux.'
      },
      {
        title: 'Limit Alcohol',
        description: 'Avoid alcohol close to bedtime, despite its sedative effects.',
        benefits: 'While alcohol may help you fall asleep, it disrupts REM sleep and causes fragmented sleep.'
      },
      {
        title: 'Hydration Balance',
        description: 'Stay hydrated during the day but reduce fluids 1-2 hours before bed.',
        benefits: 'Prevents midnight bathroom trips that interrupt your sleep cycle.'
      }
    ]
  },
  'relaxation-techniques': {
    name: 'Relaxation Techniques',
    icon: '🧘‍♀️',
    tips: [
      {
        title: 'Deep Breathing',
        description: 'Practice the 4-7-8 technique: Inhale for 4 seconds, hold for 7, exhale for 8.',
        benefits: 'Activates the parasympathetic nervous system, promoting relaxation.'
      },
      {
        title: 'Progressive Muscle Relaxation',
        description: 'Tense and then release each muscle group from toes to head.',
        benefits: 'Reduces physical tension and helps identify areas of stress in your body.'
      },
      {
        title: 'Guided Meditation',
        description: 'Use a sleep-focused meditation app or recording.',
        benefits: 'Quiets the mind and shifts focus away from racing thoughts or worries.'
      },
      {
        title: 'Visualization',
        description: 'Imagine a peaceful, calming scene in detail using all your senses.',
        benefits: 'Distracts from stressful thoughts and creates a mental environment conducive to sleep.'
      },
      {
        title: 'Journaling',
        description: 'Write down worries or a to-do list for tomorrow before bed.',
        benefits: 'Helps "download" concerns from your mind to paper, reducing rumination.'
      }
    ]
  }
};

const TipsList = ({ category, limit }) => {
  const [activeCategory, setActiveCategory] = useState(category || 'bedtime-routine');
  const [expandedTip, setExpandedTip] = useState(null);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setExpandedTip(null); // Reset expanded tip when changing categories
  };

  const toggleTip = (index) => {
    setExpandedTip(expandedTip === index ? null : index);
  };

  const currentTips = TIPS_CATEGORIES[activeCategory].tips;
  const displayTips = limit ? currentTips.slice(0, limit) : currentTips;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {!limit && (
        <div className="flex overflow-x-auto bg-gray-50 border-b">
          {Object.entries(TIPS_CATEGORIES).map(([key, { name, icon }]) => (
            <button
              key={key}
              onClick={() => handleCategoryChange(key)}
              className={`px-4 py-3 flex items-center space-x-2 whitespace-nowrap ${
                activeCategory === key 
                  ? 'border-b-2 border-indigo-600 text-indigo-600 font-medium' 
                  : 'text-gray-600 hover:text-indigo-500'
              }`}
            >
              <span className="text-xl">{icon}</span>
              <span>{name}</span>
            </button>
          ))}
        </div>
      )}

      <div className="p-4">
        {limit && (
          <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center">
            <span className="mr-2">{TIPS_CATEGORIES[activeCategory].icon}</span>
            {TIPS_CATEGORIES[activeCategory].name}
          </h3>
        )}

        <ul className="space-y-3">
          {displayTips.map((tip, index) => (
            <li 
              key={index} 
              className="border rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleTip(index)}
                className="w-full px-4 py-3 flex justify-between items-center text-left hover:bg-gray-50"
              >
                <span className="font-medium text-gray-800">{tip.title}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    expandedTip === index ? 'transform rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {expandedTip === index && (
                <div className="px-4 py-3 bg-gray-50 border-t">
                  <p className="text-gray-700 mb-2">{tip.description}</p>
                  <p className="text-sm text-indigo-600"><strong>Benefits:</strong> {tip.benefits}</p>
                </div>
              )}
            </li>
          ))}
        </ul>

        {limit && (
          <div className="mt-4 text-center">
            <Link to="/tips" className="text-indigo-600 hover:text-indigo-800 font-medium">
              View All Sleep Tips →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TipsList;
