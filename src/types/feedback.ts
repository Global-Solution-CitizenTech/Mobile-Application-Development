export type FeedbackType = 'success' | 'error' | 'warning' | 'info';

export interface FeedbackOptions {
  type?: FeedbackType;
  title: string;
  message: string;
  confirmText?: string;
  onConfirm?: () => void;
}

export interface FeedbackContextData {
  showFeedback: (options: FeedbackOptions) => void;
  showError: (title: string, message: string) => void;
  showSuccess: (title: string, message: string, onConfirm?: () => void) => void;
}
