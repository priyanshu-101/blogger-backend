
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin 
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 ml-3 mr-4 rounded-xl mb-4">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">Blog Name</h3>
          <p className="text-sm leading-relaxed">
            Sharing insights, stories, and knowledge about technology, 
            design, and development. Join our community of readers and creators.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white transition-colors">
              <Facebook size={20} />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <Instagram size={20} />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-white transition-colors">Home</a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">About Us</a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">Categories</a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">Contact Us</h3>
          <ul className="space-y-2">
            <li className="flex items-center space-x-2">
              <Mail size={16} />
              <span>contact@blogname.com</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone size={16} />
              <span>+1 (555) 123-4567</span>
            </li>
            <li className="flex items-center space-x-2">
              <MapPin size={16} />
              <span>123 Blog Street, City, Country</span>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">Newsletter</h3>
          <p className="text-sm">Subscribe to our newsletter for the latest updates and articles.</p>
          <form className="space-y-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-500"
            />
            <button 
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center text-sm">
            <p>© {currentYear} Blog Name. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;