import { Link } from 'wouter';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <a className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center text-white">
              <span className="material-icons">trending_up</span>
            </div>
            <h1 className="ml-3 text-xl font-semibold text-neutral-800">FinBuddy</h1>
          </a>
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/">
            <a className="font-medium text-primary-600 flex items-center">
              <span className="material-icons mr-1 text-sm">menu_book</span>
              <span>Topics</span>
            </a>
          </Link>
          <a href="#" className="font-medium text-neutral-500 hover:text-neutral-700 flex items-center">
            <span className="material-icons mr-1 text-sm">insights</span>
            <span>Market Data</span>
          </a>
          <a href="#" className="font-medium text-neutral-500 hover:text-neutral-700 flex items-center">
            <span className="material-icons mr-1 text-sm">chat</span>
            <span>Ask FinBuddy</span>
          </a>
          <a href="#" className="font-medium text-neutral-500 hover:text-neutral-700 flex items-center">
            <span className="material-icons mr-1 text-sm">leaderboard</span>
            <span>My Progress</span>
          </a>
        </nav>
        <button className="md:hidden text-neutral-500">
          <span className="material-icons">menu</span>
        </button>
      </div>
    </header>
  );
}
