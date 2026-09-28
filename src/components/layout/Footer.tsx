import { Link } from 'react-router-dom';
import Logo from '../ui/Logo';
import { scrollToTop } from '@/lib/scrollToTop';

export function Footer() {
  return (
    <footer>
      <div className="custom-container h-30 flex flex-col md:flex-row justify-between items-start md:items-center gap-md py-3xl md:py-md border-t border-neutral-800 bg-base-black">
        {/* Logo */}
        <Link to="/" onClick={scrollToTop} className="flex items-center gap-2">
          <Logo />
        </Link>

        {/* Copyright */}
        <p className="text-neutral-500 text-size-xs md:text-size-md">
          Copyright ©{new Date().getFullYear()} Movie Explorer
        </p>
      </div>
    </footer>
  );
}
