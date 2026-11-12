# ZelaFix Mobile — Zeladoria Urbana Colaborativa & Alerta Cidadão

> **FIAP Global Solution 2026/2 — Mobile Application Development (2TDSPG)**  
> **Tema:** *ZelaFix — Tecnologia com o cidadão no centro da inovação*  
> **Alinhamento ONU:** **ODS 11** — Cidades e Comunidades Sustentáveis

---

## 1. Visão Geral da Solução

O **ZelaFix Mobile** é um aplicativo desenvolvido em **React Native (Expo SDK 58) + TypeScript** que coloca o cidadão no centro da gestão pública urbana. Por meio dele, moradores identificam problemas nos espaços públicos do bairro (buracos na via, bueiros entupidos, iluminação pública apagada, descarte irregular de lixo, queda de árvores e vazamentos), anexam evidência fotográfica e localização via GPS, contam com **Triagem Inteligente por IA** para classificação automática de severidade e órgão competente, priorizam colaborativamente as ocorrências mais urgentes da vizinhança e acompanham o histórico completo de resolução até o parecer final da prefeitura.

---

## 2. Integrantes do Grupo (2TDSPG)

| Nome Completo | RM | Função Principal | GitHub | LinkedIn |
| :--- | :---: | :--- | :---: | :---: |
| **Enzo Okuizumi** | `561432` | Mobile Developer & Arquiteto React Native | [@EnzoOkuizumiFiap](https://github.com/EnzoOkuizumiFiap) | [LinkedIn](https://www.linkedin.com/in/enzo-okuizumi-b60292256/) |
| **Gustavo Okada** | `563428` | Backend Developer & API Integration | [@Gdev3356](https://github.com/Gdev3356) | [LinkedIn](https://www.linkedin.com/in/gustavo-okada-53a3b8359/) |
| **Lucas Barros Gouveia** | `566422` | Fullstack Developer & Database Architect | [@LuzBGouveia](https://github.com/LuzBGouveia) | [LinkedIn](https://www.linkedin.com/in/lucas-barros-gouveia-09b147355/) |
| **Luna de Carvalho Guimarães** | `562290` | UI/UX Designer & Mobile Frontend Specialist | [@lunaguima](https://github.com/lunaguima) | [LinkedIn](https://www.linkedin.com/in/luna-guimar%C3%A3es-b0ba82309/) |
| **Milton Marcelino** | `564836` | DevOps & Quality Assurance (QA) | [@MiltonMarcelino](https://github.com/MiltonMarcelino) | [LinkedIn](https://www.linkedin.com/in/milton-marcelino-250298142) |

---

## 3. Arquitetura de Engenharia Mobile (Padrão Sprint 4 + TanStack Query + Zod)

O projeto foi arquitetado seguindo os mais altos padrões de Engenharia Mobile em React Native + TypeScript, estruturando componentes e telas em módulos desacoplados e preparando toda a camada de rede para integração imediata com o **Backend Java (Spring Boot)**:

- **Gerenciamento de Estado Assíncrono (`@tanstack/react-query` v5):** Cache inteligente, *lifecycle* nativo (`AppState` + `expo-network`), atualização otimista no apoio comunitário (`apoiarChamado`), *pull-to-refresh* e mutações invalidadas automaticamente via `queryKeys`.
- **Segurança & Persistência (`expo-secure-store` + `@react-native-async-storage/async-storage`):** Tokens JWT armazenados de forma criptografada no Keychain/Keystore nativo via `SecureStore` (com fallback Web transparente) e preferências de tema reativas.
- **Validação de Formulários com Schemas (`zod` v4 + `useZodForm`):** Hook genérico memoizado integrado a schemas declarativos (`LoginSchema`, `RegisterSchema`, `ProfileEditSchema`, `ChamadoFormSchema`, `StatusUpdateSchema`) com extração automática de erros por campo.
- **Extração Dinâmica do Commit Hash (`app.config.js` + `expo-constants`):** O hash completo e curto do commit Git, branch e data são injetados automaticamente em tempo de build e exibidos na tela **Sobre o App**, atendendo integralmente à exigência de auditoria do edital FIAP.
- **Camada HTTP Integrada ao Azure App Service (`src/services/`):** Suporte nativo ao formato paginado `Page<T>` do **Spring Data JPA**, interceptors `Bearer JWT` do **Spring Security**, normalização de erros do `@RestControllerAdvice` / Bean Validation (`src/utils/apiError.ts`) e *warmup* throttled em `/actuator/health` em `https://app-zelafix-561432.azurewebsites.net`.
- **Câmera Nativa & GPS Automático (`expo-image-picker` + `expo-location`):** Captura real de evidências fotográficas (câmera/galeria em Base64) com preenchimento automático de CEP e endereço via Reverse Geocoding (`src/hooks/useLocalizacao.ts`) e resolução ViaCEP no backend Java.

```text
Mobile-Application-Development/
├── App.tsx                           # Providers: SafeArea, QueryClientProvider (AppState + expo-network), ThemeProvider, AuthProvider
├── app.config.js                     # Injeção dinâmica do Git Commit Hash via child_process
├── eslint.config.js                  # ESLint v9 Flat Config com eslint-config-expo
├── src/
│   ├── components/                   # Componentes modulares (Pasta + index.tsx + Temas Claro/Escuro)
│   │   ├── BaseModal/index.tsx       # Modal base acessível e reutilizável (KeyboardAvoiding + Overlay)
│   │   ├── Button/index.tsx
│   │   ├── CategoryBadge/index.tsx
│   │   ├── ChamadoCard/index.tsx
│   │   ├── ChamadoFormFields/index.tsx
│   │   ├── EmptyState/index.tsx
│   │   ├── FeedbackModal/index.tsx
│   │   ├── Header/index.tsx
│   │   ├── Input/index.tsx
│   │   ├── LoadingSpinner/index.tsx
│   │   ├── StatCard/index.tsx
│   │   └── StatusBadge/index.tsx
│   ├── config/
│   │   ├── env.ts                    # URL centralizada de produção (Azure App Service)
│   │   └── version.ts                # Metadados de build, Commit Hash dinâmico e Equipe FIAP
│   ├── contexts/
│   │   ├── AuthContext.tsx           # Sessão JWT + invalidação do QueryClient + Warmup API
│   │   └── ThemeContext.tsx          # Design tokens Light/Dark + useThemedStyles
│   ├── hooks/
│   │   ├── useAuth.ts                # Acesso ao contexto de autenticação
│   │   ├── useChamadoDetails.ts      # Domain hook de detalhes, permissões e ações (Cidadão vs Gestor)
│   │   ├── useChamadoForm.ts         # Hook unificado de criação/edição com Zod + GPS + Foto
│   │   ├── useChamadoMutations.ts    # Mutações TanStack Query v5 + apoio otimista
│   │   ├── useChamados.ts            # Queries e filtros de chamados/categorias
│   │   ├── useHomeData.ts            # Domain hook da HomeScreen
│   │   ├── useLocalizacao.ts         # GPS real e Reverse Geocoding via expo-location
│   │   ├── useLoginForm.ts           # Formulário de login com useZodForm + useMutation
│   │   ├── useMeusChamadosData.ts    # Domain hook dos chamados do autor
│   │   ├── useProfileData.ts         # Domain hook de perfil, cargo e sessão
│   │   ├── useRadarData.ts           # Domain hook do radar comunitário / fila de triagem do gestor
│   │   ├── useRegisterForm.ts        # Formulário de cadastro com useZodForm + useMutation
│   │   └── useZodForm.ts             # Hook genérico memoizado (Zero `any`) para formulários Zod
│   ├── lib/
│   │   ├── queryClient.ts            # Instância global do TanStack QueryClient + AppState/Network
│   │   └── queryKeys.ts              # Fábrica tipada de Query Keys
│   ├── navigation/
│   │   ├── AuthNavigator.tsx         # Stack Público (Welcome, Login, Register)
│   │   ├── AppNavigator.tsx          # Stack Autenticado (Main Tabs, Details, Novo, Editar, Sobre)
│   │   ├── TabNavigator.tsx          # Bottom Tabs dinâmicas (Tema + SafeAreaInsets)
│   │   ├── index.tsx                 # Roteador condicional conectado ao NavigationContainer Theme
│   │   └── types.ts                  # Tipagens estritas do React Navigation
│   ├── screens/                      # Telas declarativas + subcomponentes locais
│   │   ├── Welcome/WelcomeScreen.tsx
│   │   ├── Login/LoginScreen.tsx (+ components/LoginForm.tsx)
│   │   ├── Register/RegisterScreen.tsx (+ components/RegisterForm.tsx)
│   │   ├── Home/HomeScreen.tsx (+ components/HomePanoramaCard.tsx, HomeCategoryList.tsx)
│   │   ├── RadarBairro/RadarBairroScreen.tsx (+ components/RadarHeaderFilters.tsx, FilterChipRow.tsx)
│   │   ├── MeusChamados/MeusChamadosScreen.tsx (+ components/MeusChamadosHeader.tsx)
│   │   ├── NovoChamado/NovoChamadoScreen.tsx (+ components/PhotoEvidencePicker.tsx, CategoryGridSelector.tsx)
│   │   ├── EditarChamado/EditarChamadoScreen.tsx
│   │   ├── ChamadoDetails/ChamadoDetailsScreen.tsx (+ components/ChamadoSummaryCard.tsx, ChamadoIaTriageCard.tsx, ChamadoLocationCard.tsx, ChamadoTimelineCard.tsx, ChamadoActionBar.tsx, StatusChangeModal.tsx)
│   │   ├── Profile/ProfileScreen.tsx (+ components/ProfileUserCard.tsx, EditProfileModal.tsx)
│   │   └── SobreApp/SobreAppScreen.tsx (+ components/TeamMembersCard.tsx)
│   ├── services/
│   │   ├── api.ts                    # Axios + Interceptor JWT + Azure Health Warmup Throttled
│   │   ├── authService.ts            # Contratos REST /login e /usuarios/* (Spring Security)
│   │   ├── chamadoService.ts         # Contratos REST /chamados/* e /categorias (Spring Data JPA Page<T>)
│   │   └── storageService.ts         # Persistência segura (SecureStore JWT + AsyncStorage usuário/tema)
│   ├── theme/
│   │   ├── index.ts                  # Design System (Cores base, Tipografia, Sombras, Espaçamentos)
│   │   └── semanticConfig.ts         # Helpers visuais semânticos de Status e Prioridade
│   ├── types/
│   │   ├── api.ts                    # Contratos SpringPageResponse<T>, ApiError, FieldValidationError
│   │   ├── auth.ts                   # Domínio de usuário, login e endereço
│   │   ├── categoria.ts              # Categorias, prioridades e status
│   │   ├── chamado.ts                # Domínio de ocorrências e métricas
│   │   └── index.ts                  # Barrel dos tipos de domínio
│   └── utils/
│       ├── apiError.ts               # Normalizador de erros HTTP / Spring Boot
│       ├── chamadoMappers.ts         # Normalizadores e builders de payload para API Java
│       ├── formatters.ts             # Formatadores de data, CEP e texto de usuário
│       ├── permissions.ts            # Regras puras Cidadão vs. Gestor Público (zero ADMIN no mobile)
│       ├── schemas.ts                # Schemas Zod v4
│       └── shadow.ts                 # Utilitário multiplataforma de sombras (Web boxShadow / Native)
```

---

## 4. Mapeamento das 11 Telas (10 Telas Válidas + Sobre o App)

Conforme regra do edital (*"Mínimo de 6 telas distintas — a tela sobre o app não contabiliza no total de telas"*), o aplicativo conta com **10 telas funcionais distintas** além da tela **Sobre o App**:

1. **`WelcomeScreen` (`src/screens/Welcome/WelcomeScreen.tsx`):** Apresentação institucional da plataforma ZelaFix, alinhamento à ODS 11 da ONU e portas de entrada para Login ou Cadastro.
2. **`LoginScreen` (`src/screens/Login/LoginScreen.tsx`):** Autenticação JWT de produção com validação Zod.
3. **`RegisterScreen` (`src/screens/Register/RegisterScreen.tsx`):** Cadastro completo de cidadão (Nome, E-mail, CPF, Telefone, CEP/GPS, Bairro e Senha) validado com Zod.
4. **`HomeScreen` (`src/screens/Home/HomeScreen.tsx`):** Painel executivo com Índice de Resolução, métricas inline, CTA de abertura rápida e distribuição por categoria.
5. **`RadarBairroScreen` (`src/screens/RadarBairro/RadarBairroScreen.tsx`):** Feed colaborativo e ranking de urgência do bairro com busca textual, fila de triagem para **Gestor Público**, filtros por categoria/status e botão de apoio comunitário (`+1`).
6. **`MeusChamadosScreen` (`src/screens/MeusChamados/MeusChamadosScreen.tsx`):** Gestão dos protocolos abertos pelo próprio cidadão filtrados por etapa de atendimento.
7. **`NovoChamadoScreen` (`src/screens/NovoChamado/NovoChamadoScreen.tsx`):** Abertura de relato com câmera/galeria, grid de categorias e autopreenchimento GPS.
8. **`ChamadoDetailsScreen` (`src/screens/ChamadoDetails/ChamadoDetailsScreen.tsx`):** Visualização completa do protocolo, parecer real da Triagem IA (quando presente), localização, linha do tempo auditável, ações de **Editar/Excluir** para o Autor e painel de **Atualizar Status** exclusivo para o **Gestor Público**.
9. **`EditarChamadoScreen` (`src/screens/EditarChamado/EditarChamadoScreen.tsx`):** Edição cadastral completa de relatos existentes com validação Zod.
10. **`ProfileScreen` (`src/screens/Profile/ProfileScreen.tsx`):** Dados do usuário autenticado e papel (`Cidadão` / `Gestor Público`), modal de edição de perfil/senha (`useZodForm` + `BaseModal`), alternância de tema Claro/Escuro persistida e acesso à tela Sobre o App.
11. **`SobreAppScreen` (`src/screens/SobreApp/SobreAppScreen.tsx`):** Exibe o **Hash de Commit de Referência** extraído dinamicamente do Git com compartilhamento nativo, integrantes da equipe FIAP com links diretos para GitHub/LinkedIn e stack tecnológica.

---

## 5. Contratos REST Integrados ao Backend Java (Azure)

A camada `src/services/` está conectada ao backend Java Spring Boot em `https://app-zelafix-561432.azurewebsites.net` via `src/config/env.ts`:

| Método | Endpoint Java Spring Boot | Descrição |
| :---: | :--- | :--- |
| `POST` | `/login` | Autentica o cidadão e retorna `{ token, user }` (JWT Bearer) |
| `POST` | `/usuarios` | Registra novo cidadão com validação Bean Validation e endereço ViaCEP |
| `GET` | `/usuarios/me` | Obtém dados cadastrais e endereço do usuário autenticado |
| `PUT` | `/usuarios/me` | Atualiza dados cadastrais e senha do cidadão |
| `GET` | `/categorias` | Lista o catálogo oficial de categorias de zeladoria |
| `GET` | `/chamados` | Lista chamados paginados (`Page<ChamadoResponse>`) com filtros |
| `GET` | `/chamados/estatisticas` | Retorna métricas agregadas do painel executivo |
| `GET` | `/chamados/{id}` | Detalhes completos do protocolo, triagem IA e histórico |
| `GET` | `/chamados/{id}/foto` | Recupera a evidência fotográfica armazenada no Oracle BLOB |
| `POST` | `/chamados` | Cria novo chamado com foto em Base64 e resolução de CEP |
| `PUT` | `/chamados/{id}` | Atualiza dados de um chamado existente |
| `PATCH` | `/chamados/{id}/status` | Atualiza etapa do protocolo (`ABERTO`, `EM_ANALISE`, `EM_EXECUCAO`, `CONCLUIDO`, `REJEITADO`) |
| `POST` | `/chamados/{id}/apoiar` | Registra/remove apoio comunitário (`+1`) via fila RabbitMQ |
| `DELETE` | `/chamados/{id}` | Remove chamado pelo ID (autor proprietário) |
| `GET` | `/actuator/health` | Probe de saúde e aquecimento preventivo no Azure App Service |

---

## 6. Como Executar o Projeto

```bash
# 1. Acesse a pasta do projeto Mobile
cd Mobile-Application-Development

# 2. Instale as dependências
npm install --legacy-peer-deps

# 3. Verifique a tipagem estrita do TypeScript e o ESLint
npm run type-check
npm run lint

# 4. Inicie o servidor de desenvolvimento Expo
npx expo start
```

---

## 7. Declaração de Uso de Inteligência Artificial Generativa (Item 1.11 do Edital)

Em conformidade com as diretrizes de ética e transparência acadêmica da **FIAP Global Solution 2026/2 (Seção 1.11)**:

- **Ferramentas utilizadas:** Assistente de codificação baseado em LLM para apoio na refatoração arquitetural de componentes React Native, estruturação de schemas de validação com `zod` e padronização de contratos tipados TypeScript (`SpringPageResponse<T>`).
- **Responsabilidade e Autoria Humana:** Todas as decisões de produto, definição do escopo funcional de zeladoria colaborativa, modelagem de domínio, regras de negócio, fluxos de navegação, identidade visual e revisão integral do código-fonte foram conduzidas, testadas e validadas pelos integrantes do grupo.
