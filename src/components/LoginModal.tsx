import React from 'react';
import { UserRole, UserProfile } from '../types';
import { LoginWindow } from './LoginWindow';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string, user: UserProfile, gatewayRoute: string) => void;
  initialRole?: UserRole;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialRole = 'student'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="w-full max-w-4xl my-auto">
        <LoginWindow
          onLoginSuccess={onLoginSuccess}
          onClose={onClose}
          initialRole={initialRole}
          isModal={true}
        />
      </div>
    </div>
  );
};
