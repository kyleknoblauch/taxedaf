import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="mt-16 border-t border-gray-200 dark:border-gray-700 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <Link to="/privacy" className="hover:text-gray-900 dark:hover:text-gray-200">Privacy Policy</Link>
          <span className="text-gray-300 dark:text-gray-600">-</span>
          <Link to="/terms" className="hover:text-gray-900 dark:hover:text-gray-200">Terms of Service</Link>
          <span className="text-gray-300 dark:text-gray-600">-</span>
          <Link to="/support" className="hover:text-gray-900 dark:hover:text-gray-200">Support</Link>
        </div>
        <div className="text-center space-y-2">
          <p className="text-gray-600 dark:text-gray-400">Be smart, add your invoices and get less f*cked this tax season</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">© 2025 taxedAF</p>
        </div>
      </div>
    </footer>
  );
};