
import React from 'react';
import FileUploader from './FileUploader';

const GradientHero = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl md:text-6xl font-bold mb-4">
        Transforming security reviews
        <br/>
        <span className="gradient-text">with speed and precision.</span>
      </h1>
      <p className="text-xl text-gray-400 mb-12 max-w-2xl">
        Evaluate compliance with ISO 27002 in seconds with our AI-based solution.
      </p>
      
      <div className="w-full max-w-xl">
        <FileUploader />
      </div>
    </div>
  );
};

export default GradientHero;
