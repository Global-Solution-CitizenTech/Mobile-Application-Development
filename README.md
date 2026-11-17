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

## 🔗 Links Oficiais do Projeto

| Recurso | URL |
| :--- | :--- |
| 📥 **Download direto do APK (Android Standalone)** | [**Baixar zelafix.apk (Build Oficial versionCode 10)**](https://expo.dev/artifacts/eas/vWLNbhoGwg25BxcN6-QG1RHUOnJ2X9d9KAu2L3WP1JE.apk) |
| 🏗️ **Painel de Compilação do EAS Build** | [Dashboard Expo EAS — Build `d6f6ece9` (versionCode 10)](https://expo.dev/accounts/enzookuizumis-team/projects/zelafix/builds/d6f6ece9-d3b7-4365-8b16-71dead2dafc4) |
| 💻 **Repositório GitHub Mobile** | [Global-Solution-CitizenTech/Mobile-Application-Development](https://github.com/Global-Solution-CitizenTech/Mobile-Application-Development) |
| ☕ **Backend Java (Spring Boot)** | [Global-Solution-CitizenTech/Java-Advanced](https://github.com/Global-Solution-CitizenTech/Java-Advanced) |
| 🤖 **Microsserviço IA (FastAPI)** | [Global-Solution-CitizenTech/Disruptive-Architectures-IoT-IoB-IA](https://github.com/Global-Solution-CitizenTech/Disruptive-Architectures-IoT-IoB-IA) |

---

## 🔗 Vídeo de Demonstração (Global Solution 2)

*(Link do YouTube será inserido após gravação)*

---

## 3. Arquitetura de Engenharia Mobile (Padrão Sprint 4 + TanStack Query + Zod)

O projeto foi arquitetado seguindo os mais altos padrões de Engenharia Mobile em React Native + TypeScript, estruturando componentes e telas em módulos desacoplados e preparando toda a camada de rede para integração imediata com o **Backend Java (Spring Boot)**:

- **Gerenciamento de Estado Assíncrono (`@tanstack/react-query` v5):** Cache inteligente, *lifecycle* nativo (`AppState` + `expo-network`), atualização otimista no apoio comunitário (`apoiarChamado`), *pull-to-refresh* e mutações invalidadas automaticamente via `queryKeys`.
- **Segurança & Persistência (`expo-secure-store` + `@react-native-async-storage/async-storage`):** Tokens JWT armazenados de forma criptografada no Keychain/Keystore nativo via `SecureStore` (com fallback Web transparente) e preferências de tema reativas.
- **Validação de Formulários com Schemas (`zod` v4 + `useZodForm`):** Hook genérico memoizado integrado a schemas declarativos (`LoginSchema`, `RegisterSchema`, `ProfileEditSchema`, `ChamadoFormSchema`, `StatusUpdateSchema`) com extração automática de erros por campo.
- **Extração Dinâmica do Commit Hash (`app.config.js` + `expo-constants`):** O hash completo e curto do commit Git, branch e data são injetados automaticamente em tempo de build (`src/config/versionParser.ts`) e exibidos na tela **Sobre o App**.
- **Camada HTTP Integrada ao Azure App Service (`src/services/`):** Suporte nativo ao formato paginado `Page<T>` do **Spring Data JPA**, interceptors `Bearer JWT` do **Spring Security**, normalização de erros do `@RestControllerAdvice` / Bean Validation (`src/utils/apiError.ts`) e *warmup* throttled em `/actuator/health` em `https://app-zelafix.azurewebsites.net`.
- **Câmera Nativa & GPS Automático (`expo-image-picker` + `expo-location`):** Captura real de evidências fotográficas (câmera/galeria enviadas via `multipart/form-data`) com preenchimento automático de CEP e endereço via Reverse Geocoding (`src/hooks/useLocalizacao.ts`) e resolução ViaCEP no backend Java.

```text
Mobile-Application-Development/
├── App.tsx                           # Providers: SafeArea, QueryClientProvider (AppState + expo-network), ThemeProvider, AuthProvider, FeedbackProvider
├── app.config.js                     # Injeção dinâmica do Git Commit Hash via child_process
├── app.json                          # Configuração Expo SDK 58 (expo-splash-screen, expo-font, expo-image-picker, expo-location)
├── eslint.config.js                  # ESLint v9 Flat Config com eslint-config-expo
├── tests/                            # Suíte de testes unitários Node (--experimental-strip-types, 78 testes)
└── src/
    ├── components/                   # Componentes modulares (Pasta + index.tsx + Temas Claro/Escuro)
    │   ├── AuthHeader/index.tsx      # Cabeçalho institucional para Login e Cadastro
    │   ├── Avatar/index.tsx          # Avatar com iniciais do usuário
    │   ├── BaseModal/index.tsx       # Modal base reutilizável (KeyboardAvoiding + Backdrop)
    │   ├── Button/index.tsx
    │   ├── CategoryBadge/index.tsx
    │   ├── CategoryGridSelector/index.tsx
    │   ├── ChamadoCard/index.tsx
    │   ├── ChamadoFormFields/index.tsx
    │   ├── EmptyState/index.tsx
    │   ├── EnderecoFormFields/index.tsx # Campos reutilizáveis de endereço (CEP, Número, Rua, Referência + GPS)
    │   ├── FeedbackModal/index.tsx
    │   ├── Header/index.tsx
    │   ├── Input/index.tsx
    │   ├── KeyboardScreenLayout/index.tsx # Layout padrão com Header, KeyboardAvoidingView e SafeAreaInsets
    │   ├── ListSeparator/index.tsx
    │   ├── LoadingSpinner/index.tsx
    │   ├── MarkdownText/index.tsx    # Renderizador Markdown nativo (títulos, listas, callouts e tabelas)
    │   ├── PickerTriggerButton/index.tsx
    │   ├── SelectPickerModal/index.tsx # Seletor modal genérico com FlatList para filtros e opções
    │   ├── StatCard/index.tsx
    │   └── StatusBadge/index.tsx
    ├── config/
    │   ├── env.ts                    # URL centralizada de produção (Azure App Service + FastAPI IA)
    │   ├── sobreAppData.ts           # Constantes de Stack Tecnológica e Pilares ODS 11
    │   ├── version.ts                # Metadados de build, Commit Hash dinâmico e Equipe FIAP
    │   └── versionParser.ts          # Parser seguro dos metadados Git em runtime
    ├── contexts/
    │   ├── AuthContext.tsx           # Sessão JWT + validação em background + Warmup API
    │   ├── FeedbackContext.tsx       # Fila FIFO de modais de erro/sucesso/alerta
    │   └── ThemeContext.tsx          # Design tokens Light/Dark + useThemedStyles memoizado
    ├── hooks/
    │   ├── useChamadoDetails.ts      # Domain hook de detalhes, permissões e ações (Cidadão vs Gestor)
    │   ├── useChamadoMutations.ts    # Mutações TanStack Query v5 + apoio otimista com lock por ID
    │   ├── useChamados.ts            # Queries paginadas/infinitas com AbortSignal e estatísticas
    │   ├── useDebounce.ts            # Debounce para busca textual no Radar
    │   ├── useEditarChamadoForm.ts   # Formulário Zod de edição de chamado + GPS
    │   ├── useEditarPerfilForm.ts    # Formulário Zod de edição de perfil + GPS
    │   ├── useHomeData.ts            # Domain hook da HomeScreen (panorama, categorias e recentes)
    │   ├── useImageEvidencePicker.ts # Permissões, validação MIME/7MB e captura de foto
    │   ├── useLocalizacao.ts         # GPS real e Reverse Geocoding via expo-location
    │   ├── useLoginForm.ts           # Formulário de login com Zod e proteção contra duplo envio
    │   ├── useMeusChamadosData.ts    # Domain hook dos chamados do autor com paginação completa
    │   ├── useNovoChamadoForm.ts     # Formulário Zod de abertura de ocorrência (Foto + Endereço/GPS)
    │   ├── useProfileData.ts         # Domain hook de perfil, estatísticas do usuário e sessão
    │   ├── useRadarData.ts           # Domain hook do radar comunitário (filtros, ordenação e paginação)
    │   ├── useRegisterForm.ts        # Formulário de cadastro com Zod + GPS
    │   ├── useZelaBot.ts             # Chat IA ZelaBot, histórico SQLite e insights preventivos
    │   └── useZodForm.ts             # Hook genérico estritamente tipado para formulários Zod
    ├── lib/
    │   ├── chamadoCache.ts           # Atualização otimista de caches paginados/infinitos
    │   ├── queryClient.ts            # Instância global do TanStack QueryClient + AppState/Network
    │   └── queryKeys.ts              # Fábrica tipada de Query Keys
    ├── navigation/
    │   ├── AuthNavigator.tsx         # Stack Público (Welcome, Login, Register)
    │   ├── AppNavigator.tsx          # Stack Autenticado (MainTabs, Details, Novo, Editar, EditarPerfil, Sobre)
    │   ├── TabNavigator.tsx          # Bottom Tabs dinâmicas com botão central para o ZelaBot IA + SafeAreaInsets
    │   └── index.tsx                 # Roteador condicional conectado ao NavigationContainer Theme
    ├── screens/                      # Telas declarativas + subcomponentes locais
    │   ├── Welcome/WelcomeScreen.tsx
    │   ├── Login/LoginScreen.tsx (+ components/LoginForm.tsx)
    │   ├── Register/RegisterScreen.tsx (+ components/RegisterForm.tsx)
    │   ├── Home/HomeScreen.tsx (+ components/HomeHeroHeader.tsx, HomeAiPromoCard.tsx, HomePanoramaCard.tsx, HomeCategoryList.tsx)
    │   ├── RadarBairro/RadarBairroScreen.tsx (+ components/RadarHeaderFilters.tsx, RadarSearchBar.tsx, RadarFilterChips.tsx, RadarFilterModals.tsx)
    │   ├── MeusChamados/MeusChamadosScreen.tsx (+ components/MeusChamadosHeader.tsx)
    │   ├── NovoChamado/NovoChamadoScreen.tsx (+ components/AiTriageBanner.tsx, PhotoEvidencePicker.tsx, NovoChamadoSuccessModal.tsx)
    │   ├── EditarChamado/EditarChamadoScreen.tsx
    │   ├── ChamadoDetails/ChamadoDetailsScreen.tsx (+ components/ChamadoSummaryCard.tsx, ChamadoLocationCard.tsx, ChamadoTimelineCard.tsx, ChamadoActionBar.tsx, StatusChangeModal.tsx)
    │   ├── Profile/ProfileScreen.tsx (+ components/ProfileUserCard.tsx, ProfileStatsCard.tsx, ProfileMenuCard.tsx)
    │   ├── EditarPerfil/EditarPerfilScreen.tsx
    │   ├── ZelaBot/ZelaBotScreen.tsx (+ components/ZelaBotHistoryModal.tsx, ZelaBotInputBar.tsx, ZelaBotInsightsBanner.tsx, ZelaBotMessageBubble.tsx)
    │   └── SobreApp/SobreAppScreen.tsx (+ components/CommitInfoCard.tsx, OdsInfoCard.tsx, TechStackCard.tsx, TeamMembersCard.tsx)
    ├── services/
    │   ├── aiService.ts              # Integração com o microsserviço ZelaBot IA (FastAPI + RAG)
    │   ├── api.ts                    # Axios + Interceptor JWT + Deduplicação 401 + Warmup Azure
    │   ├── authService.ts            # Contratos REST /login e /usuarios/* (Spring Security)
    │   ├── chamadoService.ts         # Contratos REST /chamados/* e /categorias (Spring Data JPA Page<T>)
    │   └── storageService.ts         # Persistência segura (SecureStore JWT + AsyncStorage usuário/tema)
    ├── theme/
    │   ├── colors.ts                 # Paletas Light e Dark
    │   ├── semanticConfig.ts         # Helpers visuais semânticos de Status, Categoria e Prioridade
    │   ├── spacing.ts                # Espaçamentos e raios de borda
    │   └── typography.ts             # Escala tipográfica e pesos
    ├── types/                        # Centralização estrita de todos os tipos e interfaces (sem barrels)
    │   ├── ai.ts                     # Contratos de chat IA, histórico e insights
    │   ├── api.ts                    # Contratos SpringPageResponse<T>, ApiError, FieldValidationError
    │   ├── auth.ts                   # Domínio de usuário, login e edição de perfil
    │   ├── categoria.ts              # Categorias de zeladoria
    │   ├── chamado.ts                # Domínio de ocorrências, uploads e hooks de formulário
    │   ├── endereco.ts               # Contratos de endereço e resumo
    │   ├── feedback.ts               # Contratos de fila de modais de feedback
    │   ├── filters.ts                # Tipos de filtros, modais e ordenação
    │   ├── form.ts                   # Tipos de formulários Zod e binding de campos
    │   ├── markdown.ts               # Contratos de blocos e segmentos Markdown
    │   ├── navigation.ts             # Tipagens estritas do React Navigation
    │   ├── theme.ts                  # Contratos de tema, sombras e estilos
    │   ├── ui.ts                     # Props de componentes e subcomponentes de tela
    │   └── version.ts                # Metadados de build e equipe
    └── utils/
        ├── apiError.ts               # Normalizador de erros HTTP / Spring Boot
        ├── chamadoMappers.ts         # Normalizadores, URLs de mídia e builder multipart/payload Java
        ├── formatters.ts             # Formatadores de data, CEP, telefone e bairro
        ├── markdown.ts               # Parser de Markdown (tabelas, listas, blocos de código e inline)
        ├── permissions.ts            # Regras puras Cidadão vs. Gestor Público (zero ADMIN no mobile)
        ├── schemas.ts                # Schemas Zod v4 e extração de erros
        └── shadow.ts                 # Utilitário multiplataforma de sombras (Web boxShadow / Native)
```

---

## 4. Mapeamento das 13 Telas (12 Telas Funcionais + Sobre o App)

O aplicativo conta com **12 telas funcionais distintas** além da tela **Sobre o App**:

1. **`WelcomeScreen` (`src/screens/Welcome/WelcomeScreen.tsx`):** Apresentação institucional da plataforma ZelaFix, alinhamento à ODS 11 da ONU e portas de entrada para Login ou Cadastro.
2. **`LoginScreen` (`src/screens/Login/LoginScreen.tsx`):** Autenticação JWT de produção com validação Zod.
3. **`RegisterScreen` (`src/screens/Register/RegisterScreen.tsx`):** Cadastro completo de cidadão (Nome, E-mail, Telefone, CEP/GPS, Rua, Número, Referência e Senha) validado com Zod.
4. **`HomeScreen` (`src/screens/Home/HomeScreen.tsx`):** Painel executivo com Índice de Resolução no topo, atalhos por categoria, acesso ao ZelaBot IA e lista de ocorrências mais recentes.
5. **`RadarBairroScreen` (`src/screens/RadarBairro/RadarBairroScreen.tsx`):** Feed colaborativo e ranking de urgência com busca textual, botão integrado para **Reportar Ocorrência**, seleção em modal (`SelectPickerModal`) por categoria/status/localização (todas as cidades por padrão, com opção por cidade, bairro ou estado) e apoio comunitário (`+1`).
6. **`MeusChamadosScreen` (`src/screens/MeusChamados/MeusChamadosScreen.tsx`):** Gestão dos protocolos abertos pelo próprio cidadão filtrados por etapa de atendimento.
7. **`NovoChamadoScreen` (`src/screens/NovoChamado/NovoChamadoScreen.tsx`):** Abertura simplificada de ocorrência a partir do Radar com **foto obrigatória** (câmera/galeria) e endereço via CEP/GPS; a requisição aguarda a triagem da **Spring AI** via RabbitMQ (`DeferredResult` na API) e já retorna o chamado classificado (ou rejeita na hora com feedback visual caso a imagem esteja fora do escopo urbano).
8. **`ChamadoDetailsScreen` (`src/screens/ChamadoDetails/ChamadoDetailsScreen.tsx`):** Visualização completa do protocolo, dados preenchidos pela Triagem IA (título, descrição, categoria, prioridade e órgão responsável), localização, linha do tempo auditável, ações de **Editar/Excluir** para o Autor ou **Gestor Público**, apoio comunitário (`+1`) e painel de **Atualizar Status** exclusivo para o **Gestor Público**.
9. **`EditarChamadoScreen` (`src/screens/EditarChamado/EditarChamadoScreen.tsx`):** Edição cadastral completa de relatos existentes com validação Zod.
10. **`ProfileScreen` (`src/screens/Profile/ProfileScreen.tsx`):** Dados do usuário autenticado, papel (`Cidadão` / `Gestor Público`), cartão de estatísticas pessoais (`ProfileStatsCard`), menu de ações (`ProfileMenuCard`), alternância de tema Claro/Escuro persistida e acesso à tela Editar Perfil e Sobre o App.
11. **`EditarPerfilScreen` (`src/screens/EditarPerfil/EditarPerfilScreen.tsx`):** Atualização cadastral completa (dados pessoais, endereço com preenchimento via GPS e alteração de senha) validada com Zod.
12. **`ZelaBotScreen` (`src/screens/ZelaBot/ZelaBotScreen.tsx`):** Assistente conversacional integrado ao botão central da barra de navegação, com histórico de sessões e insights preventivos por bairro.
13. **`SobreAppScreen` (`src/screens/SobreApp/SobreAppScreen.tsx`):** Exibe o **Hash de Commit de Referência** extraído dinamicamente do Git com compartilhamento nativo, integrantes da equipe FIAP com links diretos para GitHub/LinkedIn e stack tecnológica.

---

## 5. Contratos REST Integrados ao Backend Java (Azure)

A camada `src/services/` está conectada ao backend Java Spring Boot em `https://app-zelafix.azurewebsites.net` via `src/config/env.ts`:

| Método | Endpoint Java Spring Boot | Descrição |
| :---: | :--- | :--- |
| `POST` | `/login` | Autentica o cidadão e retorna `{ token, user }` (JWT Bearer) |
| `POST` | `/usuarios` | Registra novo cidadão com validação Bean Validation e endereço ViaCEP |
| `GET` | `/usuarios/me` | Obtém dados cadastrais e endereço do usuário autenticado |
| `PUT` | `/usuarios/me` | Atualiza dados cadastrais e senha do cidadão |
| `GET` | `/categorias` | Lista o catálogo oficial de categorias de zeladoria |
| `GET` | `/chamados` | Lista chamados paginados (`Page<ChamadoResponse>`) com filtros |
| `GET` | `/chamados/estatisticas` | Retorna métricas agregadas do painel executivo |
| `GET` | `/chamados/{id}` | Detalhes completos do protocolo, classificação IA e histórico |
| `GET` | `/chamados/{id}/foto` | Recupera a evidência fotográfica armazenada no Oracle BLOB |
| `POST` | `/chamados` | Cria chamado via `multipart/form-data` (`cep`, `numero`, `referencia`, `rua`, `foto`) aguardando a triagem IA via `DeferredResult` (`201 Created` se válida ou erro se recusada) |
| `PUT` | `/chamados/{id}` | Atualiza dados de um chamado existente |
| `PATCH` | `/chamados/{id}/status` | Atualiza etapa do protocolo (`PENDENTE`, `EM_ANALISE`, `EM_EXECUCAO`, `CONCLUIDO`, `REJEITADO`) |
| `POST` | `/chamados/{id}/apoiar` | Registra/remove apoio comunitário (`+1`) via fila RabbitMQ |
| `DELETE` | `/chamados/{id}` | Remove chamado pelo ID |
| `GET` | `/actuator/health` | Probe de saúde e aquecimento preventivo no Azure App Service |

---

## 6. Como Executar o Projeto

```bash
# 1. Acesse a pasta do projeto Mobile
cd Mobile-Application-Development

# 2. Instale as dependências
npm install

# 3. Verifique a tipagem estrita do TypeScript, ESLint, testes unitários e saúde Expo
npm run type-check
npm run lint
npm test
npx expo-doctor

# 4. Inicie o servidor de desenvolvimento Expo
npx expo start
```
