import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import rgiptLogo from '../../images/RGIPT.png';

const Footer = () => {
  return (
    <footer className="bg-slate-900/95 backdrop-blur-md border-t border-white/10 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={rgiptLogo} 
                alt="RGIPT Logo" 
                className="h-12 w-auto object-contain"
              />
              <span className="text-2xl font-bold">Aagman</span>
            </div>
            <p className="text-slate-400 mb-4 max-w-md">
              Rajiv Gandhi Institute of Petroleum Technology's digital campus pass management system. 
              Streamlining student mobility with modern technology.
            </p>
            <div className="flex flex-col gap-2 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>Jais, Amethi, Uttar Pradesh 229304</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span>+91-XXXX-XXXXXX</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>info@rgipt.ac.in</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-400 hover:text-white transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-slate-400 hover:text-white transition-colors">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/creator" className="text-slate-400 hover:text-white transition-colors">
                  About Creator
                </Link>
              </li>
            </ul>
          </div>

          {/* RGIPT Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">RGIPT</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://www.rgipt.ac.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  Official Website
                  <ExternalLink size={14} />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.rgipt.ac.in/about" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  About RGIPT
                  <ExternalLink size={14} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} Rajiv Gandhi Institute of Petroleum Technology. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm">
            Powered by Aagman - Digital Campus Pass System
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


