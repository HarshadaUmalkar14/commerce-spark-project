
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-shop-blue text-white mt-10">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">ShopSpark</h3>
            <p className="text-sm text-gray-300 mb-4">
              Your one-stop destination for all your shopping needs. Quality products at affordable prices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-shop-yellow">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-shop-yellow">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-shop-yellow">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link to="/products" className="hover:text-shop-yellow">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/featured" className="hover:text-shop-yellow">
                  Featured Products
                </Link>
              </li>
              <li>
                <Link to="/new-arrivals" className="hover:text-shop-yellow">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/deals" className="hover:text-shop-yellow">
                  Deals & Discounts
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link to="/contact" className="hover:text-shop-yellow">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-shop-yellow">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-shop-yellow">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-shop-yellow">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center">
                <Phone size={16} className="mr-2" />
                <span>(123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail size={16} className="mr-2" />
                <span>support@shopspark.com</span>
              </li>
              <li>
                <address className="not-italic">
                  123 Commerce Street<br />
                  Shopping District<br />
                  Market City, MC 12345
                </address>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-sm text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} ShopSpark. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link to="/privacy" className="hover:text-shop-yellow">
              Privacy Policy
            </Link>
            <span>|</span>
            <Link to="/terms" className="hover:text-shop-yellow">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
