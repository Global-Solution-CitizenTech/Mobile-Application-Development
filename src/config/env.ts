/**
 * Configurações centralizadas de ambiente e endpoints da API Java (Spring Boot) / .NET
 */
export const env = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080',
  aiUrl: process.env.EXPO_PUBLIC_AI_URL || 'http://localhost:8080/ai',
  /**
   * Quando `enableMockFallback` está ativo, se o backend Java/Spring Boot ainda não estiver
   * rodando localmente ou na nuvem (Azure), o app utiliza o repositório persistente local
   * (AsyncStorage + Mock Seed) sem quebrar o fluxo das telas ou do TanStack Query.
   */
  enableMockFallback: true,
};
