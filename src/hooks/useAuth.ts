import { useContext } from 'react';
import { AuthContext, AuthContextData } from '../contexts/AuthContext';

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);

  if (!context || !context.login) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }

  return context;
};

