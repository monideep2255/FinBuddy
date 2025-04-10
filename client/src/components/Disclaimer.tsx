/**
 * Disclaimer Component
 * 
 * Displays a legal disclaimer about the AI-generated content.
 * Important for setting appropriate expectations about the financial information presented.
 */
export default function Disclaimer() {
  return (
    <section className="container mx-auto px-4 mb-8">
      <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
          <span className="font-semibold text-neutral-700 dark:text-neutral-300">Disclaimer:</span> This content is AI-generated and for educational purposes only. It is not financial advice. Please consult a licensed financial advisor before making investment decisions.
        </p>
      </div>
    </section>
  );
}
