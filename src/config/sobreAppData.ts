import type { PilarItem } from '@/types/ui';

export const TECH_STACK: readonly string[] = [
  'React Native + Expo SDK 58',
  'TypeScript Strict',
  'TanStack React Query v5',
  'Zod v4 Schema Validation',
  'React Navigation v7',
  'Axios + JWT Interceptors',
  'Expo SecureStore + Network',
  'API Java Spring Boot (Azure)',
  'Triagem IA + Priorização',
];

export const PILARES: readonly PilarItem[] = [
  {
    icon: 'camera-outline',
    titulo: 'Relato Fotográfico Rápido',
    descricao: 'Registre buracos, bueiros ou postes apagados com localização GPS automática.',
  },
  {
    icon: 'sparkles-outline',
    titulo: 'Triagem Inteligente com IA',
    descricao: 'Classificação automática de severidade e encaminhamento para o órgão competente.',
  },
  {
    icon: 'people-outline',
    titulo: 'Priorização Comunitária',
    descricao: 'Apoie demandas dos seus vizinhos para elevar o ranking de urgência do bairro.',
  },
];
