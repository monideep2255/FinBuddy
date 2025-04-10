interface RealWorldExampleTabProps {
  example: string;
  title: string;
}

export default function RealWorldExampleTab({ example, title }: RealWorldExampleTabProps) {
  // Split the example by paragraphs 
  const paragraphs = example.split('\n\n').map((para, index) => {
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
      <h3 className="text-xl font-semibold text-neutral-800 mb-4">{title} in Real Life</h3>
      
      <div className="prose max-w-none text-neutral-700">
        {paragraphs}
      </div>
      
      <div className="mt-8 p-4 bg-primary-50 rounded-lg border border-primary-100">
        <div className="flex items-start">
          <span className="material-icons text-primary-600 mr-3 mt-1">tips_and_updates</span>
          <div>
            <h4 className="font-semibold text-primary-800 mb-1">Why This Matters</h4>
            <p className="text-primary-700 text-sm">
              Understanding {title.toLowerCase()} with real examples helps you make better financial decisions and see how economic concepts affect your daily life.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
