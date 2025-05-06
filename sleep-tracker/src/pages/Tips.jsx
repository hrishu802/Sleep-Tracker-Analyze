import React from 'react';
import TipsList from '../components/TipsList';

const Tips = () => {
  return (
    <div className="container-xl fade-in">
      <div className="mb-8">
        <h1 className="page-title">Sleep Tips</h1>
        <p className="page-subtitle">
          Expert advice to help you get better sleep
        </p>
      </div>
      
      <div className="mb-8">
        <p className="text-gray-300 mb-6">
          Explore our comprehensive collection of sleep tips and best practices across various categories.
          Click on any tip to learn more about how it can improve your sleep quality.
        </p>
        
        <div className="card-hover p-6">
          <TipsList />
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Why Good Sleep Matters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-hover p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Physical Health</h3>
            <p className="text-gray-700">
              Quality sleep helps maintain your immune system, reduces risk of heart disease and diabetes, 
              and helps regulate metabolism and weight.
            </p>
          </div>
          
          <div className="card-hover p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Mental Wellbeing</h3>
            <p className="text-gray-700">
              Sleep is essential for cognitive function, memory consolidation, 
              emotional regulation, and reducing stress and anxiety.
            </p>
          </div>
          
          <div className="card-hover p-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Performance</h3>
            <p className="text-gray-700">
              Adequate sleep improves focus, problem-solving abilities, physical 
              performance, reaction time, and overall productivity.
            </p>
          </div>
        </div>
      </div>
      
      <div className="card-hover p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Need Personalized Advice?</h2>
        <p className="text-gray-700 mb-4">
          Everyone's sleep needs are different. If you're consistently struggling with sleep despite following these tips,
          consider consulting with a healthcare professional or sleep specialist.
        </p>
      </div>
    </div>
  );
};

export default Tips;
