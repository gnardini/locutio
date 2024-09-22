import { Modal } from '@frontend/components/common/Modal';
import { FaGithub } from 'react-icons/fa';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const handleAuthSuccess = () => {
    window.location.href = `/dashboard`;
  };

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${
    import.meta.env.PUBLIC_ENV__GITHUB_CLIENT_ID
  }&redirect_uri=${encodeURIComponent(`https://locut.io/github_callback`)}`;

  return (
    <Modal visible={isOpen} closeModal={onClose} extraClassName="w-[500px]">
      <a
        href={githubAuthUrl}
        className="flex flex-row items-center justify-center font-medium text-lg gap-2 bg-primary-background rounded-xl w-full py-3"
      >
        <FaGithub />
        Sign in with GitHub
      </a>

      {/* <p className="my-4">or</p>
      <h2 className="mb-4">Set up your account</h2>
      <AuthForm onAuthSuccess={handleAuthSuccess} initialState="signup" /> */}
    </Modal>
  );
}
