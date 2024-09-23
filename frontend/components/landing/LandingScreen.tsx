import { User } from '@type/user';
import { useRef, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { navigate } from 'vike/client/router';
import { AuthModal } from '../auth/AuthModal';
import { Button } from '../common/Button';
import { Footer } from './views/Footer';
import { PricingSection } from './views/PricingSection';
import { Header } from '@frontend/components/landing/views/Header';
import { DemoVideoView } from './views/DemoVideoView';

interface Props {
  user: User | null;
}

export function LandingScreen({ user }: Props) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const pricingSectionRef = useRef<HTMLDivElement>(null);

  const handleTryForFreeClick = () => {
    if (user) {
      navigate('/app');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleGoToApp = () => {
    navigate('/app');
  };

  const scrollToPricing = () => {
    navigate;
    pricingSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFreeTierClick = () => {
    if (user) {
      navigate('/app');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleProTierClick = () => {
    window.location.href = 'https://buy.stripe.com/eVa7sZ8qbd062sg144';
  };

  

  return (
    <div className="flex flex-col items-center min-h-screen p-6 text-center relative bg-gradient-to-r from-secondary-background via-primary-background to-secondary-background">
      <Header user={user} onScrollToPricing={scrollToPricing} onGoToApp={handleGoToApp} />
      <AuthModal isOpen={isAuthModalOpen} onClose={handleCloseAuthModal} />
      <h1 className="max-w-[800px] text-3xl sm:text-6xl font-bold mt-4 sm:mt-20 bg-clip-text text-transparent bg-gradient-to-r from-secondary-accent to-purple-500">
        Make your app multilingual in minutes
      </h1>
      <div className="w-full sm:w-[1000px] flex flex-col">
        <h2 className="w-full sm:w-[600px] mx-auto text-lg sm:text-2xl mt-8">
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

      <div className="w-full max-w-[1000px] mt-24 mb-24">
        <h2 className="text-3xl font-bold mb-6">Demo</h2>
        <DemoVideoView />
      </div>

      <div ref={pricingSectionRef}>
        <PricingSection onFreeTierClick={handleFreeTierClick} onProTierClick={handleProTierClick} />
      </div>

      <Footer />
    </div>
  );
}
