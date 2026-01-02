
import React, { Suspense, lazy } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { AccountType } from '../../auth/accountTypes';
import { Loader2 } from 'lucide-react';
import { AppId } from '../../types';

const ReadmeGuest = lazy(() => import('./ReadmeGuest').then(module => ({ default: module.ReadmeGuest })));
const ReadmeRecruiter = lazy(() => import('./ReadmeRecruiter').then(module => ({ default: module.ReadmeRecruiter })));
const ReadmeAdmin = lazy(() => import('./ReadmeAdmin').then(module => ({ default: module.ReadmeAdmin })));

interface ReadmeProps {
    onOpenApp?: (id: AppId, props?: any) => void;
}

const Readme: React.FC<ReadmeProps> = ({ onOpenApp }) => {
  const { account } = useAuth();

  const renderContent = () => {
      if (!account || account.accountType === AccountType.GUEST) {
          return <ReadmeGuest onOpenApp={onOpenApp} />;
      }
      if (account.accountType === AccountType.RECRUITER) {
          return <ReadmeRecruiter onOpenApp={onOpenApp} />;
      }
      if (account.accountType === AccountType.ADMINISTRATOR) {
          return <ReadmeAdmin onOpenApp={onOpenApp} />;
      }
      return <ReadmeGuest onOpenApp={onOpenApp} />;
  };

  return (
    <div className="h-full bg-[#1f2229] text-gray-200 font-sans">
      <Suspense fallback={
          <div className="h-full flex items-center justify-center">
              <Loader2 className="animate-spin text-[#367BF0]" size={32} />
          </div>
      }>
          {renderContent()}
      </Suspense>
    </div>
  );
};

export default Readme;
