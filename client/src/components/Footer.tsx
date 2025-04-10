import { Link } from 'wouter';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white">
                <span className="material-icons text-sm">trending_up</span>
              </div>
              <h2 className="ml-2 text-lg font-semibold text-neutral-800">FinBuddy</h2>
            </div>
            <p className="text-neutral-500 text-sm mt-2">Your AI-Powered Finance Learning Companion</p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold text-neutral-800 mb-3">Topics</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-neutral-500 hover:text-neutral-700">Economics</a></li>
                <li><a href="#" className="text-neutral-500 hover:text-neutral-700">Investments</a></li>
                <li><a href="#" className="text-neutral-500 hover:text-neutral-700">Markets</a></li>
                <li><a href="#" className="text-neutral-500 hover:text-neutral-700">Personal Finance</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-800 mb-3">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-neutral-500 hover:text-neutral-700">Glossary</a></li>
                <li><a href="#" className="text-neutral-500 hover:text-neutral-700">Market Data</a></li>
                <li><a href="#" className="text-neutral-500 hover:text-neutral-700">Learning Paths</a></li>
                <li><a href="#" className="text-neutral-500 hover:text-neutral-700">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-800 mb-3">About</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-neutral-500 hover:text-neutral-700">How It Works</a></li>
                <li><a href="#" className="text-neutral-500 hover:text-neutral-700">Legal</a></li>
                <li><a href="#" className="text-neutral-500 hover:text-neutral-700">Privacy</a></li>
                <li><a href="#" className="text-neutral-500 hover:text-neutral-700">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-neutral-200 text-sm text-neutral-500 text-center">
          <p>© {new Date().getFullYear()} FinBuddy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
