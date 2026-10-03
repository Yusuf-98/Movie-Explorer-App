import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useSyncExternalStore,
  Suspense,
  lazy,
} from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu } from 'lucide-react';
import ArrowBack from '../../assets/icons/arrow-back.png';
import { useMovieStore } from '@/store/movieStore';
import { cn } from '@/lib/utils';
import { SearchInputVisual } from './SearchInputVisual';
import Logo from '../ui/Logo';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import { navigationMenuTriggerStyle } from '../ui/navigation-menu-style';
import { scrollToTop } from '@/lib/scrollToTop';
import CloseIcon from '../../assets/icons/x-icon.png';
import { m, AnimatePresence } from 'framer-motion';
import { useModalA11y } from '@/hooks/useModalA11y';

const LazySearchFormFields = lazy(() => import('./SearchFormFields'));

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const navigate = useNavigate();
  const { favorites } = useMovieStore();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 678) {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    setQuery('');
  }, []);

  const menuRef = useModalA11y(isMenuOpen, closeMenu);

  const openSearch = () => {
    setIsSearchOpen(true);
    if (isMenuOpen) closeMenu();
    setQuery('');
    setTimeout(() => inputRef.current?.focus(), 150);
  };
  const closeSearch = () => {
    setIsSearchOpen(false);
    setQuery('');
  };

  const handleQueryChange = useCallback(
    (val: string) => {
      setQuery(val);
      clearTimeout(timerRef.current);
      if (val.trim().length > 1) {
        timerRef.current = setTimeout(() => {
          navigate(`/search?q=${encodeURIComponent(val.trim())}`);
        }, 500);
      }
    },
    [navigate]
  );

  const handleSubmitQuery = useCallback(
    (val: string) => {
      const trimmed = val.trim();
      if (trimmed.length < 2 || trimmed.length > 100) return;
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
      setTimeout(closeSearch, 200);
    },
    [navigate]
  );

  const handlePlainSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmitQuery(query);
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300',
          isScrolled ? 'backdrop-blur-2xl' : 'bg-transparent'
        )}
      >
        <AnimatePresence mode="wait">
          {isSearchOpen ? (
            /* ── MOBILE SEARCH BAR ── */
            <m.div
              key="search-bar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="md:hidden w-full h-16 flex items-center bg-neutral-950 px-xl gap-lg"
            >
              {/* Back arrow */}
              <button
                type="button"
                onClick={closeSearch}
                aria-label="Back"
                className="shrink-0 flex items-center justify-center text-base-white bg-transparent border-none cursor-pointer p-0"
              >
                <img src={ArrowBack} alt="Back" className="w-6 h-6" />
              </button>

              {/* Search form */}
              <Suspense
                fallback={
                  <SearchInputVisual
                    variant="mobile"
                    value={query}
                    onChangeText={handleQueryChange}
                    onSubmit={handlePlainSubmit}
                    inputRef={inputRef}
                    autoFocus
                  />
                }
              >
                <LazySearchFormFields
                  variant="mobile"
                  initialQuery={query}
                  onQueryChange={handleQueryChange}
                  onSubmitQuery={handleSubmitQuery}
                  inputRef={inputRef}
                  autoFocus
                />
              </Suspense>
            </m.div>
          ) : (
            /* ── NORMAL NAVBAR ── */
            <m.div
              key="navbar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <div className="custom-container h-16 md:h-19 lg:h-22.5 flex flex-row justify-between items-center">
                {/* Left: Logo + Desktop Nav */}
                <div className="flex items-center gap-8xl">
                  <Link to="/" onClick={scrollToTop} className="flex items-start">
                    <Logo />
                  </Link>

                  <NavigationMenu className="hidden md:flex">
                    <NavigationMenuList className="flex gap-6xl">
                      <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/"
                            onClick={scrollToTop}
                            className={cn(
                              navigationMenuTriggerStyle(),
                              'bg-transparent text-base-white hover:text-primary-200 transition-colors duration-300'
                            )}
                          >
                            Home
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                      <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/favorites"
                            onClick={scrollToTop}
                            className={cn(
                              navigationMenuTriggerStyle(),
                              'relative flex items-center gap-1 text-base-white hover:text-primary-200 bg-transparent transition-colors duration-300'
                            )}
                          >
                            Favorites
                            {favorites.length > 0 && (
                              <span className="ml-1 w-4 h-4 bg-primary-300 text-neutral-25 text-size-xs font-bold rounded-full flex items-center justify-center">
                                {favorites.length > 9 ? '9+' : favorites.length}
                              </span>
                            )}
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                </div>

                {/* Right: Desktop Search + Mobile Icons */}
                <div className="flex items-center gap-3 md:gap-4">
                  {/* Desktop Search */}
                  <Suspense
                    fallback={
                      <SearchInputVisual
                        variant="desktop"
                        value={query}
                        onChangeText={handleQueryChange}
                        onSubmit={handlePlainSubmit}
                        inputRef={inputRef}
                      />
                    }
                  >
                    <LazySearchFormFields
                      variant="desktop"
                      initialQuery={query}
                      onQueryChange={handleQueryChange}
                      onSubmitQuery={handleSubmitQuery}
                      inputRef={inputRef}
                    />
                  </Suspense>

                  {/* Mobile: Search + Hamburger icons */}
                  <div className="md:hidden flex items-center gap-3xl">
                    <button
                      type="button"
                      onClick={openSearch}
                      aria-label="Search"
                      className="flex items-center justify-center bg-transparent border-none cursor-pointer text-base-white p-0"
                    >
                      <Search className="w-6 h-6" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsMenuOpen(true)}
                      aria-label="Open menu"
                      className="flex items-center justify-center bg-transparent border-none cursor-pointer p-0"
                    >
                      <Menu className="w-6 h-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile fullscreen menu */}
      {isMounted &&
        createPortal(
        <AnimatePresence>
          {isMenuOpen && (
            <m.div
              ref={menuRef}
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              tabIndex={-1}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              onClick={closeMenu}
              className="fixed inset-0 w-full h-full bg-base-black overflow-y-auto overflow-x-hidden outline-none"
              style={{ zIndex: 9999 }}
            >
              {/* Header: Logo + Close */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-between p-3xl border-b border-neutral-800"
              >
                <Logo />
                <button
                  type="button"
                  onClick={closeMenu}
                  aria-label="Close menu"
                  className="flex items-center justify-center bg-transparent border-none cursor-pointer p-md"
                >
                  <img src={CloseIcon} alt="Close" className="w-6 h-6" />
                </button>
              </div>

              {/* Nav links */}
              <nav
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col px-3xl py-4xl gap-4xl"
              >
                <Link
                  to="/"
                  onClick={() => {
                    scrollToTop();
                    closeMenu();
                  }}
                  className="text-base-white text-size-lg font-medium no-underline py-xs hover:text-primary-300 transition-colors duration-200"
                >
                  Home
                </Link>
                <Link
                  to="/favorites"
                  onClick={() => {
                    scrollToTop();
                    closeMenu();
                  }}
                  className="text-base-white text-size-lg font-medium no-underline py-xs flex items-center justify-between hover:text-primary-300 transition-colors duration-200"
                >
                  Favorites
                  {favorites.length > 0 && (
                    <span className="w-6 h-6 bg-primary-300 text-neutral-25 text-size-xs font-bold rounded-full flex items-center justify-center">
                      {favorites.length > 9 ? '9+' : favorites.length}
                    </span>
                  )}
                </Link>
              </nav>
            </m.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
