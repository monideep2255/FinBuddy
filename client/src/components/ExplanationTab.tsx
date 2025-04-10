interface ExplanationTabProps {
  explanation: string;
  title: string;
}

export default function ExplanationTab({ explanation, title }: ExplanationTabProps) {
  // Split the explanation by paragraphs and headings
  const paragraphs = explanation.split('\n\n').map((para, index) => {
    // If paragraph starts with # or ##, make it a heading
    if (para.startsWith('# ')) {
      return <h3 key={index} className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 my-4">{para.substring(2)}</h3>;
    } else if (para.startsWith('## ')) {
      return <h4 key={index} className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 my-4">{para.substring(3)}</h4>;
    } else if (para.trim() === '') {
      return null;
    } else {
      return <p key={index} className="mb-4 dark:text-neutral-300">{para}</p>;
    }
  });

  return (
    <div className="py-6 font-serif">
      <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
        What {title.toLowerCase().includes('is') ? 'is' : 'are'} {title}?
      </h3>
      
      <div className="prose dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-300">
        {paragraphs}
      </div>
      
      <div className="flex items-center mt-8 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-neutral-500 dark:text-neutral-400 mr-3">
          <path d="M12 .75a8.25 8.25 0 00-4.135 15.39c.686.398 1.115 1.008 1.134 1.623a.75.75 0 00.577.706c.352.083.71.148 1.074.195.323.041.6-.218.6-.544v-4.661a6.75 6.75 0 1110.5 0v4.661c0 .326.277.585.6.544.364-.047.722-.112 1.074-.195a.75.75 0 00.577-.706c.02-.615.448-1.225 1.134-1.623A8.25 8.25 0 0012 .75z" />
          <path fillRule="evenodd" d="M9.013 19.9a.75.75 0 01.877-.597 11.319 11.319 0 004.22 0 .75.75 0 11.28 1.473 12.819 12.819 0 01-4.78 0 .75.75 0 01-.597-.877zM9.75 7.5a.75.75 0 000 1.5h1.5v1.5a.75.75 0 001.5 0V9h1.5a.75.75 0 000-1.5h-1.5V6a.75.75 0 00-1.5 0v1.5h-1.5z" clipRule="evenodd" />
        </svg>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm italic">
          "The most important investment you can make is in yourself." — Warren Buffett
        </p>
      </div>
    </div>
  );
}
