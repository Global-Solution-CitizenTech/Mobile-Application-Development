import { createContext, use, useCallback, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { FeedbackModal } from '@/components/FeedbackModal';
import type { FeedbackContextData, FeedbackOptions } from '@/types/feedback';

const FeedbackContext = createContext<FeedbackContextData | null>(null);

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<FeedbackOptions[]>([]);
  const lastConfirmedRef = useRef<FeedbackOptions | null>(null);
  const currentModal = queue[0] ?? null;

  const showFeedback = useCallback((options: FeedbackOptions) => {
    setQueue((prev) => [...prev, { ...options }]);
  }, []);

  const showError = useCallback((title: string, message: string) => {
    setQueue((prev) => [...prev, { type: 'error', title, message }]);
  }, []);

  const showSuccess = useCallback((title: string, message: string, onConfirm?: () => void) => {
    setQueue((prev) => [...prev, { type: 'success', title, message, onConfirm }]);
  }, []);

  const handleConfirm = useCallback(() => {
    if (!currentModal || lastConfirmedRef.current === currentModal) {
      return;
    }
    lastConfirmedRef.current = currentModal;
    const onConfirm = currentModal.onConfirm;
    setQueue((prev) => (prev[0] === currentModal ? prev.slice(1) : prev));
    onConfirm?.();
  }, [currentModal]);

  const value = useMemo<FeedbackContextData>(
    () => ({ showFeedback, showError, showSuccess }),
    [showFeedback, showError, showSuccess]
  );

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      <FeedbackModal
        visible={Boolean(currentModal)}
        type={currentModal?.type}
        title={currentModal?.title ?? ''}
        message={currentModal?.message ?? ''}
        confirmText={currentModal?.confirmText}
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
