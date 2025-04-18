import { useState, useEffect } from 'react';
import { Quiz } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Award } from 'lucide-react';

interface QuizTabProps {
  quiz?: Quiz;
  isLoading: boolean;
  onQuizComplete?: (score: number) => void;
}

export default function QuizTab({ quiz, isLoading, onQuizComplete }: QuizTabProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [quizPassed, setQuizPassed] = useState(false);

  const handleOptionSelect = (questionIndex: number, optionIndex: number) => {
    if (submitted) return;

    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: optionIndex
    });
  };

  const handleSubmit = () => {
    if (!quiz) return;
    
    let correctCount = 0;
    
    // Check answers
    quiz.questions.forEach((question, questionIndex) => {
      const selectedOptionIndex = selectedAnswers[questionIndex];
      
      if (selectedOptionIndex !== undefined) {
        const isCorrect = question.options[selectedOptionIndex].isCorrect;
        if (isCorrect) {
          correctCount++;
        }
      }
    });
    
    setScore(correctCount);
    setSubmitted(true);
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(null);
  };

  if (isLoading) {
    return (
      <div className="py-6">
        <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Test Your Knowledge</h3>
        
        <div className="mb-8">
          <Skeleton className="h-6 w-3/4 mb-3" />
          
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <Skeleton className="h-4 w-4 mt-1 rounded-full" />
                <div className="ml-3 w-full">
                  <Skeleton className="h-5 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-8">
          <Skeleton className="h-6 w-3/4 mb-3" />
          
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <Skeleton className="h-4 w-4 mt-1 rounded-full" />
                <div className="ml-3 w-full">
                  <Skeleton className="h-5 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-8">
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="py-6">
        <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Test Your Knowledge</h3>
        <p className="text-neutral-600 dark:text-neutral-400">Sorry, we couldn't load the quiz for this topic.</p>
      </div>
    );
  }

  return (
    <div className="py-6">
      <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">Test Your Knowledge</h3>
      
      {submitted && score !== null && (
        <div className={`mb-6 p-4 rounded-lg ${
          score === quiz.questions.length 
            ? 'bg-green-50 dark:bg-green-950 border border-green-100 dark:border-green-900' 
            : 'bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900'
        }`}>
          <p className={`font-medium ${
            score === quiz.questions.length 
              ? 'text-green-800 dark:text-green-300' 
              : 'text-blue-800 dark:text-blue-300'
          }`}>
            You scored {score} out of {quiz.questions.length}!
            {score === quiz.questions.length && ' Great job!'}
          </p>
        </div>
      )}
      
      {quiz.questions.map((question, questionIndex) => (
        <div key={questionIndex} className="mb-8">
          <p className="font-medium text-neutral-800 dark:text-neutral-200 mb-3">{questionIndex + 1}. {question.question}</p>
          
          <div className="space-y-3">
            {question.options.map((option, optionIndex) => {
              const isSelected = selectedAnswers[questionIndex] === optionIndex;
              const isCorrect = submitted && option.isCorrect;
              const isIncorrect = submitted && isSelected && !option.isCorrect;
              
              let className = "flex items-start p-3 border rounded-lg cursor-pointer ";
              
              if (isSelected) {
                className += "border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/30 ";
              } else {
                className += "border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 ";
              }
              
              if (submitted) {
                if (isCorrect) {
                  className = "flex items-start p-3 border rounded-lg cursor-default border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/30";
                } else if (isIncorrect) {
                  className = "flex items-start p-3 border rounded-lg cursor-default border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/30";
                } else {
                  className = "flex items-start p-3 border rounded-lg cursor-default border-neutral-200 dark:border-neutral-700";
                }
              }
              
              return (
                <div 
                  key={optionIndex} 
                  className={className}
                  onClick={() => handleOptionSelect(questionIndex, optionIndex)}
                >
                  <input 
                    type="radio" 
                    name={`q${questionIndex}`} 
                    id={`q${questionIndex}o${optionIndex}`}
                    className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 dark:border-neutral-600"
                    checked={isSelected}
                    onChange={() => handleOptionSelect(questionIndex, optionIndex)}
                    disabled={submitted}
                  />
                  <label htmlFor={`q${questionIndex}o${optionIndex}`} className="ml-3 cursor-pointer">
                    <span className="block font-medium text-neutral-800 dark:text-neutral-200">{option.text}</span>
                  </label>
                  {submitted && isCorrect && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-auto text-green-600 dark:text-green-500">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                  )}
                  {submitted && isIncorrect && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-auto text-red-600 dark:text-red-500">
                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      
      <div className="mt-8">
        {!submitted ? (
          <button 
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-white font-medium transition-colors duration-200"
            onClick={handleSubmit}
            disabled={Object.keys(selectedAnswers).length !== quiz.questions.length}
          >
            Submit Answers
          </button>
        ) : (
          <button 
            className="px-4 py-2 bg-neutral-600 hover:bg-neutral-700 rounded-lg text-white font-medium transition-colors duration-200"
            onClick={handleRetry}
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
