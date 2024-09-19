import { Button } from '@frontend/components/common/Button';
import { Modal } from '@frontend/components/common/Modal';
import { AuthForm } from './AuthForm';

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
  }&redirect_uri=${encodeURIComponent(`http://localhost:3950/github_callback`)}`;

  return (
    <Modal visible={isOpen} closeModal={onClose} extraClassName="w-[500px]">
      <Button href={githubAuthUrl}>Sign in with GitHub</Button>
      <p className="my-4">or</p>
      <h2 className="mb-4">Set up your account</h2>
      <AuthForm onAuthSuccess={handleAuthSuccess} initialState="signup" />
    </Modal>
  );
}
