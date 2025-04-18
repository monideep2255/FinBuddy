import { useState, useEffect } from 'react';
import { Quiz } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Award, AlertCircle, Check, Loader2, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOptionSelect = (questionIndex: number, optionIndex: number) => {
    if (submitted) return;

    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: optionIndex
    });
  };

  const handleSubmit = () => {
    if (!quiz) return;
    
    setIsSubmitting(true);
    
    // Add a small delay to show submission is processing
    setTimeout(() => {
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
      
      // Calculate percentage score
      const percentageScore = Math.round((correctCount / quiz.questions.length) * 100);
      
      // Set state
      setScore(correctCount);
      setSubmitted(true);
      setIsSubmitting(false);
      
      // Check if quiz is passed (70% or higher is passing)
      const isPassed = percentageScore >= 70;
      setQuizPassed(isPassed);
      
      // If there's a callback, call it with the score
      if (onQuizComplete) {
        onQuizComplete(percentageScore);
      }
      
      // Scroll to the top of quiz results
      const quizElement = document.getElementById('quiz-results');
      if (quizElement) {
        quizElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 600);
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(null);
    setQuizPassed(false);
  };

  // Count unanswered questions
  const unansweredCount = quiz ? quiz.questions.length - Object.keys(selectedAnswers).length : 0;

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
      
      {/* Quiz Results Section */}
      {submitted && score !== null && (
        <div id="quiz-results" className={`mb-6 p-4 rounded-lg ${
          quizPassed
            ? 'bg-green-50 dark:bg-green-950 border border-green-100 dark:border-green-900' 
            : 'bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900'
        }`}>
          <div className="flex items-center">
            <div className={`mr-3 p-2 rounded-full ${
              quizPassed 
                ? 'bg-green-100 dark:bg-green-800' 
                : 'bg-blue-100 dark:bg-blue-800'
            }`}>
              {quizPassed 
                ? <Award className="h-5 w-5 text-green-600 dark:text-green-300" />
                : <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              }
            </div>
            <div>
              <p className={`font-medium ${
                quizPassed
                  ? 'text-green-800 dark:text-green-300' 
                  : 'text-blue-800 dark:text-blue-300'
              }`}>
                You scored {score} out of {quiz.questions.length}!
                {score === quiz.questions.length && ' Perfect score!'}
              </p>
              {quizPassed ? (
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  Congratulations! You've passed this quiz.
                </p>
              ) : (
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                  You need to score at least 70% to pass. Try again!
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Quiz Questions */}
      {quiz.questions.map((question, questionIndex) => (
        <div key={questionIndex} className="mb-8 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
          <p className="font-medium text-neutral-800 dark:text-neutral-200 mb-3">
            {questionIndex + 1}. {question.question}
          </p>
          
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
                  <label htmlFor={`q${questionIndex}o${optionIndex}`} className="ml-3 cursor-pointer flex-grow">
                    <span className="block font-medium text-neutral-800 dark:text-neutral-200">{option.text}</span>
                  </label>
                  {submitted && isCorrect && (
                    <Check className="w-5 h-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                  )}
                  {submitted && isIncorrect && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0 text-red-600 dark:text-red-500">
                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      
      {/* Quiz Status and Actions */}
      <div className="mt-8 border-t border-neutral-200 dark:border-neutral-800 pt-6">
        {!submitted ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:w-auto order-2 sm:order-1">
              <Button 
                className="w-full sm:w-auto px-6 py-3 sm:py-2 flex items-center justify-center gap-2"
                onClick={handleSubmit}
                disabled={Object.keys(selectedAnswers).length !== quiz.questions.length || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <FileCheck className="h-4 w-4" />
                    <span>Submit Quiz</span>
                  </>
                )}
              </Button>
            </div>
            
            {/* Questions Status */}
            <div className="text-sm text-neutral-600 dark:text-neutral-400 order-1 sm:order-2 w-full sm:w-auto text-center sm:text-right mb-3 sm:mb-0">
              {unansweredCount === 0 ? (
                <span className="text-green-600 dark:text-green-400">
                  All questions answered! Ready to submit.
                </span>
              ) : (
                <span>
                  {unansweredCount} {unansweredCount === 1 ? 'question' : 'questions'} left to answer
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <Button 
              variant="secondary"
              className="px-6"
              onClick={handleRetry}
            >
              Try Again
            </Button>
            
            <div className="text-sm text-neutral-600 dark:text-neutral-400 text-right">
              {quizPassed && (
                <span className="text-green-600 dark:text-green-400 font-medium">
                  Quiz completed successfully!
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
