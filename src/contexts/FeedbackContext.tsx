import { createContext, use, useState } from 'react';
import type { ReactNode } from 'react';
import { FeedbackModal, type FeedbackType } from '@/components/FeedbackModal';

export interface FeedbackOptions {
  type?: FeedbackType;
  title: string;
  message: string;
  confirmText?: string;
  onConfirm?: () => void;
}

interface FeedbackContextData {
  showFeedback: (options: FeedbackOptions) => void;
  showError: (title: string, message: string) => void;
  showSuccess: (title: string, message: string, onConfirm?: () => void) => void;
}

const FeedbackContext = createContext<FeedbackContextData | null>(null);

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<FeedbackOptions | null>(null);

  const showFeedback = (options: FeedbackOptions) => setModal(options);

  const showError = (title: string, message: string) => {
    setModal({ type: 'error', title, message });
  };

  const showSuccess = (title: string, message: string, onConfirm?: () => void) => {
    setModal({ type: 'success', title, message, onConfirm });
  };

  const handleConfirm = () => {
    const onConfirm = modal?.onConfirm;
    setModal(null);
    onConfirm?.();
  };

  return (
    <FeedbackContext.Provider value={{ showFeedback, showError, showSuccess }}>
      {children}
      <FeedbackModal
        visible={Boolean(modal)}
        type={modal?.type}
        title={modal?.title ?? ''}
        message={modal?.message ?? ''}
        confirmText={modal?.confirmText}
        onConfirm={handleConfirm}
      />
    </FeedbackContext.Provider>
  );
}

export function useFeedback(): FeedbackContextData {
  const context = use(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback deve ser utilizado dentro de um FeedbackProvider');
  }
  return context;
}
