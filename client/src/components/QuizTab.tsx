import { useState } from 'react';
import { Quiz } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

interface QuizTabProps {
  quiz?: Quiz;
  isLoading: boolean;
}

export default function QuizTab({ quiz, isLoading }: QuizTabProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

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
        <h3 className="text-xl font-semibold text-neutral-800 mb-4">Test Your Knowledge</h3>
        
        <div className="mb-8">
          <Skeleton className="h-6 w-3/4 mb-3" />
          
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start p-3 border border-neutral-200 rounded-lg">
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
              <div key={i} className="flex items-start p-3 border border-neutral-200 rounded-lg">
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
        <h3 className="text-xl font-semibold text-neutral-800 mb-4">Test Your Knowledge</h3>
        <p className="text-neutral-600">Sorry, we couldn't load the quiz for this topic.</p>
      </div>
    );
  }

  return (
    <div className="py-6">
      <h3 className="text-xl font-semibold text-neutral-800 mb-4">Test Your Knowledge</h3>
      
      {submitted && score !== null && (
        <div className={`mb-6 p-4 rounded-lg ${
          score === quiz.questions.length ? 'bg-green-50 border border-green-100' : 'bg-blue-50 border border-blue-100'
        }`}>
          <p className={`font-medium ${
            score === quiz.questions.length ? 'text-green-800' : 'text-blue-800'
          }`}>
            You scored {score} out of {quiz.questions.length}!
            {score === quiz.questions.length && ' Great job!'}
          </p>
        </div>
      )}
      
      {quiz.questions.map((question, questionIndex) => (
        <div key={questionIndex} className="mb-8">
          <p className="font-medium text-neutral-800 mb-3">{questionIndex + 1}. {question.question}</p>
          
          <div className="space-y-3">
            {question.options.map((option, optionIndex) => {
              const isSelected = selectedAnswers[questionIndex] === optionIndex;
              const isCorrect = submitted && option.isCorrect;
              const isIncorrect = submitted && isSelected && !option.isCorrect;
              
              let className = "flex items-start p-3 border rounded-lg hover:bg-neutral-50 cursor-pointer ";
              
              if (isSelected) {
                className += "border-primary-300 bg-primary-50 ";
              } else {
                className += "border-neutral-200 ";
              }
              
              if (submitted) {
                if (isCorrect) {
                  className = "flex items-start p-3 border border-green-300 bg-green-50 rounded-lg cursor-default";
                } else if (isIncorrect) {
                  className = "flex items-start p-3 border border-red-300 bg-red-50 rounded-lg cursor-default";
                } else {
                  className = "flex items-start p-3 border border-neutral-200 rounded-lg cursor-default";
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
                    className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300"
                    checked={isSelected}
                    onChange={() => handleOptionSelect(questionIndex, optionIndex)}
                    disabled={submitted}
                  />
                  <label htmlFor={`q${questionIndex}o${optionIndex}`} className="ml-3 cursor-pointer">
                    <span className="block font-medium text-neutral-800">{option.text}</span>
                  </label>
                  {submitted && isCorrect && (
                    <span className="material-icons ml-auto text-green-600">check_circle</span>
                  )}
                  {submitted && isIncorrect && (
                    <span className="material-icons ml-auto text-red-600">cancel</span>
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
