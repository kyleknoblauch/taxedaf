import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="mt-16 border-t border-gray-200 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-center space-x-4 text-sm text-gray-600 mb-4">
          <Link to="/privacy" className="hover:text-gray-900">Privacy Policy</Link>
          <span>-</span>
          <Link to="/terms" className="hover:text-gray-900">Terms of Service</Link>
          <span>-</span>
          <Link to="/support" className="hover:text-gray-900">Support</Link>
        </div>
        <div className="text-center space-y-2">
          <p className="text-gray-600">Taking the guess work out of tax season</p>
          <p className="text-sm text-gray-500">© 2025 taxedAF</p>
        </div>
      </div>
    </footer>
  );
};