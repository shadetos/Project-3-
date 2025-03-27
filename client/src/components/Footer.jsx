import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto py-4 bg-gray-100 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-700 text-sm">
              © {currentYear} Recipe Generator App. All rights reserved.
            </p>
          </div>

          <nav aria-label="Footer Navigation">
            <ul className="flex space-x-6">
              <li>
                <Link
                  to="/about"
                  className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
