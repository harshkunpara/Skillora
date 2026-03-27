import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground/80 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg hero-gradient flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-primary-foreground">Skillora</span>
            </Link>
            <p className="text-sm text-primary-foreground/60 leading-relaxed">
              Empowering millions of learners worldwide with cutting-edge courses from industry experts.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-primary-foreground mb-4 text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/courses" className="hover:text-primary-foreground transition-colors">Browse Courses</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary-foreground transition-colors">Dashboard</Link></li>
              <li><Link to="#" className="hover:text-primary-foreground transition-colors">Certifications</Link></li>
              <li><Link to="#" className="hover:text-primary-foreground transition-colors">For Business</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-primary-foreground mb-4 text-sm uppercase tracking-wider">Community</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="#" className="hover:text-primary-foreground transition-colors">Blog</Link></li>
              <li><Link to="#" className="hover:text-primary-foreground transition-colors">Forums</Link></li>
              <li><Link to="#" className="hover:text-primary-foreground transition-colors">Teach on Skillora</Link></li>
              <li><Link to="#" className="hover:text-primary-foreground transition-colors">Affiliates</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-primary-foreground mb-4 text-sm uppercase tracking-wider">Support</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="#" className="hover:text-primary-foreground transition-colors">Help Center</Link></li>
              <li><Link to="#" className="hover:text-primary-foreground transition-colors">Contact Us</Link></li>
              <li><Link to="#" className="hover:text-primary-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-primary-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-8 text-center text-sm text-primary-foreground/40">
          <p>© {new Date().getFullYear()} Skillora. All rights reserved. Built with ❤️ for learners everywhere.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
