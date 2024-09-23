import { User } from '@type/user';
import { useRef, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { AuthModal } from '../auth/AuthModal';
import { Button } from '../common/Button';
import { Footer } from './views/Footer';
import { PricingSection } from './views/PricingSection';

interface Props {
  user: User | null;
}

export function LandingScreen({ user }: Props) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const pricingSectionRef = useRef<HTMLDivElement>(null);

  const handleTryForFreeClick = () => {
    if (user) {
      window.location.href = '/app';
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleGoToApp = () => {
    window.location.href = '/app';
  };

  const scrollToPricing = () => {
    pricingSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFreeTierClick = () => {
    if (user) {
      window.location.href = '/app';
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleProTierClick = () => {
    window.location.href = 'https://buy.stripe.com/eVa7sZ8qbd062sg144';
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 text-center relative bg-gradient-to-r from-secondary-background via-primary-background to-secondary-background">
      <nav className="w-full max-w-[1000px] flex justify-end items-center mb-10 gap-8">
        <div className="flex gap-1 mr-auto items-center">
          <img src={'/logo.webp'} className="w-16 h-16 rounded-full" />
          <h2 className="ml-2 sm:ml-4 text-4xl">Locutio</h2>
        </div>
        <a
          href="https://github.com/gnardini/locutio"
          target="_blank"
          className="text-lg text-text-primary hover:underline"
        >
          GitHub
        </a>
        <button onClick={scrollToPricing} className="text-lg hover:underline">
          Pricing
        </button>
        {user && (
          <Button className="px-3 py-2" onClick={handleGoToApp}>
            <div className="flex items-center">
              Go to app <FaArrowRight className="ml-2" />
            </div>
          </Button>
        )}
      </nav>
      <AuthModal isOpen={isAuthModalOpen} onClose={handleCloseAuthModal} />
      <h1 className="max-w-[800px] text-6xl font-bold mt-20 bg-clip-text text-transparent bg-gradient-to-r from-secondary-accent to-purple-500">
        Make your app multilingual in minutes
      </h1>
      <div className="w-[1000px] flex flex-col">
        <h2 className="w-[600px] mx-auto text-2xl mt-8">
          Effortlessly translate your app as our AI makes accurate, context-aware translations into
          multiple languages
        </h2>
        <Button
          className="mt-10 text-4xl w-fit px-10 py-3 mx-auto transition ease-in-out duration-300 transform hover:scale-105"
          onClick={handleTryForFreeClick}
        >
          {'Try for free'}
        </Button>
        {!user && <p className="mt-1 text-text-secondary mx-auto">No credit card required</p>}
      </div>

      <div ref={pricingSectionRef}>
        <PricingSection onFreeTierClick={handleFreeTierClick} onProTierClick={handleProTierClick} />
      </div>

      <Footer />
    </div>
  );
}