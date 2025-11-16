import { Link } from 'react-router-dom';

// Color Alignment:
// Background: bg-gray-900 (A professional deep gray, complementing the Deep Blue brand color #1E3A8A)
// Accent: text-green-400 (Directly reflects the Green brand color #10B981 for highlights and links)
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 pt-16 pb-8 mt-16 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Link Grid - Responsive 2x2 on Mobile, 4x1 on Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 border-b border-gray-700 pb-10">

          {/* Column 1: Platform */}
          <div>
            <h4 className="font-extrabold text-lg mb-4 uppercase tracking-wider text-green-400">
              Platform
            </h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="hover:text-green-400 transition duration-300">About SUST Connect</Link></li>
              <li><Link to="/features" className="hover:text-green-400 transition duration-300">Features</Link></li>
              <li><Link to="/register" className="hover:text-green-400 transition duration-300">Get Involved</Link></li>
              <li><Link to="/feed" className="hover:text-green-400 transition duration-300">Latest News</Link></li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div>
            <h4 className="font-extrabold text-lg mb-4 uppercase tracking-wider text-green-400">
              Resources
            </h4>
            <ul className="space-y-3">
              <li><a href="https://www.sust.edu" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition duration-300">University Portal</a></li>
              <li><Link to="/calendar" className="hover:text-green-400 transition duration-300">Academic Calendar</Link></li>
              <li><Link to="/help" className="hover:text-green-400 transition duration-300">Student Services</Link></li>
              <li><Link to="/faq" className="hover:text-green-400 transition duration-300">FAQ</Link></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="font-extrabold text-lg mb-4 uppercase tracking-wider text-green-400">
              Support
            </h4>
            <ul className="space-y-3">
              <li><Link to="/contact" className="hover:text-green-400 transition duration-300">Contact Us</Link></li>
              <li><Link to="/contact" className="hover:text-green-400 transition duration-300">Report an Issue</Link></li>
              <li><Link to="/help" className="hover:text-green-400 transition duration-300">Help Center</Link></li>
            </ul>
          </div>

          {/* Column 4: Campus */}
          <div>
            <h4 className="font-extrabold text-lg mb-4 uppercase tracking-wider text-green-400">
              Campus
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/image/540763965_1340254950799652_6212886658485356170_n.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-400 transition duration-300"
                >
                  SUST Map
                </a>
              </li>
              <li><Link to="/privacy" className="hover:text-green-400 transition duration-300">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-green-400 transition duration-300">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Section: Brand and Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm mt-4">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            {/* SUST Campus Logo */}
            <img
              src="/image/482984952_993190959578541_8366529342364279980_n.jpg"
              alt="SUST Logo"
              className="w-10 h-10 rounded-lg object-cover shadow-lg ring-2 ring-green-400/30"
            />
            {/* Text: 'SUST' in red, 'Connect' in white */}
            <span className="text-xl font-extrabold">
              <span className="text-red-500">SUST</span>
              <span className="text-gray-50"> Connect</span>
            </span>
          </div>

          <p className="text-gray-400 text-center">
            &copy; {new Date().getFullYear()} SUST Connect. Built for the community.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;