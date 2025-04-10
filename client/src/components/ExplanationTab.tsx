interface ExplanationTabProps {
  explanation: string;
  title: string;
}

export default function ExplanationTab({ explanation, title }: ExplanationTabProps) {
  // Split the explanation by paragraphs and headings
  const paragraphs = explanation.split('\n\n').map((para, index) => {
    // If paragraph starts with # or ##, make it a heading
    if (para.startsWith('# ')) {
      return <h3 key={index} className="text-xl font-semibold text-neutral-800 my-4">{para.substring(2)}</h3>;
    } else if (para.startsWith('## ')) {
      return <h4 key={index} className="text-lg font-semibold text-neutral-800 my-4">{para.substring(3)}</h4>;
    } else if (para.trim() === '') {
      return null;
    } else {
      return <p key={index} className="mb-4">{para}</p>;
    }
  });

  return (
    <div className="py-6 font-serif">
      <h3 className="text-xl font-semibold text-neutral-800 mb-4">What {title.toLowerCase().includes('is') ? 'is' : 'are'} {title}?</h3>
      
      <div className="prose max-w-none text-neutral-700">
        {paragraphs}
      </div>
      
      <div className="flex items-center mt-8 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
        <span className="material-icons text-neutral-500 mr-3">lightbulb</span>
        <p className="text-neutral-600 text-sm italic">
          "The most important investment you can make is in yourself." — Warren Buffett
        </p>
      </div>
    </div>
  );
}
