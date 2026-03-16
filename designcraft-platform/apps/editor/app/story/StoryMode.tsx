'use client';

import React, { useState } from 'react';
import { 
  PlayIcon, 
  ForwardIcon, 
  BackwardIcon, 
  PauseIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

interface StoryStep {
  id: number;
  title: string;
  description: string;
  action: string;
  component?: string;
  props?: Record<string, any>;
}

export function StoryMode() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const storySteps: StoryStep[] = [
    {
      id: 1,
      title: "Welcome to DesignCraft",
      description: "Let's build your first website together. I'll guide you through each step.",
      action: "Start Building"
    },
    {
      id: 2,
      title: "Adding a Hero Section",
      description: "Every great website starts with a hero section. This is the first thing visitors see.",
      action: "Add Hero Text",
      component: "Text",
      props: {
        text: "Welcome to My Website",
        fontSize: 48,
        fontWeight: "bold",
        textAlign: "center"
      }
    },
    {
      id: 3,
      title: "Adding Supporting Text",
      description: "Now let's add some supporting text to explain what your website is about.",
      action: "Add Description",
      component: "Text",
      props: {
        text: "This is a beautiful website built with AI assistance",
        fontSize: 18,
        fontWeight: "normal",
        textAlign: "center"
      }
    },
    {
      id: 4,
      title: "Adding a Call to Action",
      description: "Every hero section needs a call-to-action button to guide visitors.",
      action: "Add Button",
      component: "Button",
      props: {
        text: "Get Started",
        variant: "primary",
        size: "lg"
      }
    },
    {
      id: 5,
      title: "Adding Visual Content",
      description: "Let's add an image to make your hero section more engaging.",
      action: "Add Image",
      component: "Image",
      props: {
        src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
        alt: "Hero image",
        width: "100%",
        height: "400px"
      }
    },
    {
      id: 6,
      title: "Congratulations!",
      description: "You've successfully created your first hero section! Your website is taking shape.",
      action: "Continue Building"
    }
  ];

  const currentStory = storySteps[currentStep];
  const isLastStep = currentStep === storySteps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (currentStep < storySteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setCurrentStep(storySteps.length - 1);
  };

  return (
    <div className="notion-card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Story Mode</h3>
            <p className="text-sm text-gray-600">Step-by-step guidance</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-sm text-gray-500">Step {currentStep + 1}</span>
          <span className="text-sm text-gray-400"> / {storySteps.length}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep + 1) / storySteps.length) * 100}%` }}
        ></div>
      </div>

      {/* Story Content */}
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">{currentStory.title}</h4>
          <p className="text-gray-700 text-sm leading-relaxed">
            {currentStory.description}
          </p>
        </div>

        {/* Action Preview */}
        {currentStory.component && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-2">Next Action</h5>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md font-medium">
                {currentStory.component}
              </span>
              <span>→</span>
              <span>{currentStory.action}</span>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="btn-ghost flex items-center space-x-2"
          >
            {isPlaying ? (
              <PauseIcon className="w-4 h-4" />
            ) : (
              <PlayIcon className="w-4 h-4" />
            )}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
          {!isLastStep && (
            <button
              onClick={handleSkip}
              className="btn-ghost text-sm text-gray-600 hover:text-gray-900"
            >
              Skip to End
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevious}
            disabled={isFirstStep}
            className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <BackwardIcon className="w-4 h-4" />
            <span>Previous</span>
          </button>
          <button
            onClick={handleNext}
            disabled={isLastStep}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{isLastStep ? 'Finish' : 'Next'}</span>
            <ForwardIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h6 className="font-medium text-yellow-800 mb-1">💡 Pro Tip</h6>
        <p className="text-sm text-yellow-700">
          You can always exit Story Mode and continue building freely. The components you add will remain in your design.
        </p>
      </div>
    </div>
  );
}