import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="bg-slate-900 backdrop-blur-sm border-b border-white/20 w-full px-4 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <a className="text-xl font-semibold text-white" href="#">
                    Ecommerce Governing Body
                </a>
                <button
                    className="lg:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none"
                    type="button"
                    aria-label="Toggle navigation"
                >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
                <div className="hidden lg:flex">
                    <ul className="flex space-x-8">
                        <li>
                            <a
                                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                                href="/"
                            >
                                Home
                            </a>
                        </li>
                        <li>
                            <Link
                                href="/create-schema"
                                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Create Schema
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
