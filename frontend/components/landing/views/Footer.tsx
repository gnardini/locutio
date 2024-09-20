import { FaDiscord, FaGithub } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export function Footer() {
  return (
    <footer className="w-full max-w-[1000px] flex flex-col sm:flex-row justify-between items-center mt-20 py-6 border-t border-text-tertiary">
      <div className="flex items-center mb-4 sm:mb-0">
        <img src={'/logo.webp'} className="w-8 h-8 mr-2" alt="Logo" />
        <span className="text-xl font-semibold">Locutio</span>
      </div>
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <p className="text-text-primary ">
          Built by
          <a
            href="https://gnardini.com/ref=locutio"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 hover:text-secondary-accent"
          >
            @gnardini
          </a>
        </p>
        <div className="flex items-center space-x-6">
          <a
            href="https://github.com/gnardini/locutio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-primary hover:text-secondary-accent"
          >
            <FaGithub className="text-2xl" />
          </a>
          <a
            href="https://discord.gg/aZJ7XY8Hx3"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-primary hover:text-secondary-accent"
          >
            <FaDiscord className="text-2xl" />
          </a>
          <a
            href="https://x.com/gonza_nardini"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-primary hover:text-secondary-accent"
          >
            <FaXTwitter className="text-2xl" />
          </a>
        </div>
      </div>
    </footer>
  );
}
