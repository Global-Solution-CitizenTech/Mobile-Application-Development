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
| 📥 **Download direto do APK (Android Standalone)** | [**Baixar zelafix.apk (Build Oficial versionCode 6)**](https://expo.dev/artifacts/eas/uxHWQSXdY-Man695Jcin1-LypU211GDfS9qtDiAbrBs.apk) |
| 🏗️ **Painel de Compilação do EAS Build** | [Dashboard Expo EAS — Build `718280c9` (versionCode 6)](https://expo.dev/accounts/enzookuizumis-team/projects/zelafix/builds/718280c9-0c57-4f26-8052-a433446ed163) |
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
- **Extração Dinâmica do Commit Hash (`app.config.js` + `expo-constants`):** O hash completo e curto do commit Git, branch e data são injetados automaticamente em tempo de build e exibidos na tela **Sobre o App**.
- **Camada HTTP Integrada ao Azure App Service (`src/services/`):** Suporte nativo ao formato paginado `Page<T>` do **Spring Data JPA**, interceptors `Bearer JWT` do **Spring Security**, normalização de erros do `@RestControllerAdvice` / Bean Validation (`src/utils/apiError.ts`) e *warmup* throttled em `/actuator/health` em `https://app-zelafix-561432.azurewebsites.net`.
- **Câmera Nativa & GPS Automático (`expo-image-picker` + `expo-location`):** Captura real de evidências fotográficas (câmera/galeria enviadas via `multipart/form-data`) com preenchimento automático de CEP e endereço via Reverse Geocoding (`src/hooks/useLocalizacao.ts`) e resolução ViaCEP no backend Java.

```text
Mobile-Application-Development/
├── App.tsx                           # Providers: SafeArea, QueryClientProvider (AppState + expo-network), ThemeProvider, AuthProvider
├── app.config.js                     # Injeção dinâmica do Git Commit Hash via child_process
├── eslint.config.js                  # ESLint v9 Flat Config com eslint-config-expo
├── src/
│   ├── components/                   # Componentes modulares (Pasta + index.tsx + Temas Claro/Escuro)
│   │   ├── AuthHeader/index.tsx      # Cabeçalho institucional para Login e Cadastro
│   │   ├── BaseModal/index.tsx       # Modal base acessível e reutilizável (KeyboardAvoiding + Overlay)
│   │   ├── Button/index.tsx
│   │   ├── CategoryBadge/index.tsx
│   │   ├── CategoryGridSelector/index.tsx
│   │   ├── ChamadoCard/index.tsx
│   │   ├── ChamadoFormFields/index.tsx
│   │   ├── EmptyState/index.tsx
│   │   ├── FeedbackModal/index.tsx
│   │   ├── Header/index.tsx
│   │   ├── Input/index.tsx
│   │   ├── LoadingSpinner/index.tsx
│   │   ├── SelectPickerModal/index.tsx # Seletor modal reutilizável para filtros e opções
│   │   ├── StatCard/index.tsx
│   │   └── StatusBadge/index.tsx
│   ├── config/
│   │   ├── env.ts                    # URL centralizada de produção (Azure App Service)
│   │   └── version.ts                # Metadados de build, Commit Hash dinâmico e Equipe FIAP
│   ├── contexts/
│   │   ├── AuthContext.tsx           # Sessão JWT + invalidação do QueryClient + Warmup API
│   │   └── ThemeContext.tsx          # Design tokens Light/Dark + useThemedStyles
│   ├── hooks/
│   │   ├── useChamadoDetails.ts      # Domain hook de detalhes, permissões e ações (Cidadão vs Gestor)
│   │   ├── useChamadoForm.ts         # Hook unificado de criação/edição com Zod + GPS + Foto
│   │   ├── useChamadoMutations.ts    # Mutações TanStack Query v5 + apoio otimista
│   │   ├── useChamados.ts            # Queries e filtros de chamados/categorias
│   │   ├── useDebounce.ts            # Debounce para busca textual no Radar
│   │   ├── useHomeData.ts            # Domain hook da HomeScreen (panorama, categorias e recentes)
│   │   ├── useLocalizacao.ts         # GPS real e Reverse Geocoding via expo-location
│   │   ├── useLoginForm.ts           # Formulário de login com Zod
│   │   ├── useMeusChamadosData.ts    # Domain hook dos chamados do autor
│   │   ├── useProfileData.ts         # Domain hook de perfil, estatísticas do usuário e sessão
│   │   ├── useRadarData.ts           # Domain hook do radar comunitário (todas as cidades por padrão + filtros modais)
│   │   ├── useRegisterForm.ts        # Formulário de cadastro com Zod
│   │   ├── useZelaBot.ts             # Chat IA ZelaBot, histórico SQLite e insights preventivos
│   │   └── useZodForm.ts             # Hook genérico memoizado (Zero `any`) para formulários Zod
│   ├── lib/
│   │   ├── queryClient.ts            # Instância global do TanStack QueryClient + AppState/Network
│   │   └── queryKeys.ts              # Fábrica tipada de Query Keys
│   ├── navigation/
│   │   ├── AuthNavigator.tsx         # Stack Público (Welcome, Login, Register)
│   │   ├── AppNavigator.tsx          # Stack Autenticado (Main Tabs, Details, Editar, ZelaBot, Sobre)
│   │   ├── TabNavigator.tsx          # Bottom Tabs dinâmicas com botão central para o ZelaBot IA + SafeAreaInsets
│   │   ├── index.tsx                 # Roteador condicional conectado ao NavigationContainer Theme
│   │   └── types.ts                  # Tipagens estritas do React Navigation
│   ├── screens/                      # Telas declarativas + subcomponentes locais
│   │   ├── Welcome/WelcomeScreen.tsx
│   │   ├── Login/LoginScreen.tsx (+ components/LoginForm.tsx)
│   │   ├── Register/RegisterScreen.tsx (+ components/RegisterForm.tsx)
│   │   ├── Home/HomeScreen.tsx (+ components/HomePanoramaCard.tsx, HomeCategoryList.tsx)
│   │   ├── RadarBairro/RadarBairroScreen.tsx (+ components/RadarHeaderFilters.tsx)
│   │   ├── MeusChamados/MeusChamadosScreen.tsx (+ components/MeusChamadosHeader.tsx)
│   │   ├── NovoChamado/NovoChamadoScreen.tsx (+ components/PhotoEvidencePicker.tsx)
│   │   ├── EditarChamado/EditarChamadoScreen.tsx
│   │   ├── ChamadoDetails/ChamadoDetailsScreen.tsx (+ components/ChamadoSummaryCard.tsx, ChamadoLocationCard.tsx, ChamadoTimelineCard.tsx, ChamadoActionBar.tsx, StatusChangeModal.tsx)
│   │   ├── Profile/ProfileScreen.tsx (+ components/ProfileUserCard.tsx, ProfileStatsCard.tsx, EditProfileModal.tsx)
│   │   ├── ZelaBot/ZelaBotScreen.tsx (+ components/ZelaBotHistoryModal.tsx, ZelaBotInputBar.tsx, ZelaBotInsightsBanner.tsx, ZelaBotMessageBubble.tsx)
│   │   └── SobreApp/SobreAppScreen.tsx (+ components/TeamMembersCard.tsx)
│   ├── services/
│   │   ├── aiService.ts              # Integração com o microsserviço ZelaBot IA (FastAPI + RAG)
│   │   ├── api.ts                    # Axios + Interceptor JWT + Azure Health Warmup Throttled
│   │   ├── authService.ts            # Contratos REST /login e /usuarios/* (Spring Security)
│   │   ├── chamadoService.ts         # Contratos REST /chamados/* e /categorias (Spring Data JPA Page<T>)
│   │   └── storageService.ts         # Persistência segura (SecureStore JWT + AsyncStorage usuário/tema)
│   ├── theme/
│   │   ├── index.ts                  # Design System (Cores base, Tipografia, Sombras, Espaçamentos)
│   │   └── semanticConfig.ts         # Helpers visuais semânticos de Status e Prioridade
│   ├── types/
│   │   ├── ai.ts                     # Contratos de chat IA, histórico e insights
│   │   ├── api.ts                    # Contratos SpringPageResponse<T>, ApiError, FieldValidationError
│   │   ├── auth.ts                   # Domínio de usuário, login e autenticação
│   │   ├── categoria.ts              # Categorias de zeladoria
│   │   ├── chamado.ts                # Domínio de ocorrências e métricas
│   │   ├── endereco.ts               # Contratos de endereço e resumo
│   │   ├── filters.ts                # Tipos de filtros e ordenação
│   │   ├── forms.ts                  # Tipos auxiliares de formulário
│   │   ├── localizacao.ts            # Payload de geolocalização capturada
│   │   ├── status.ts                 # Status de atendimento de chamados
│   │   └── version.ts                # Metadados de build e equipe
│   └── utils/
│       ├── apiError.ts               # Normalizador de erros HTTP / Spring Boot
│       ├── apiUrl.ts                 # Builder de URLs absolutas de mídia da API
│       ├── chamadoMappers.ts         # Normalizadores e builders de payload para API Java
│       ├── enderecoMappers.ts        # Builder de EnderecoRequest para Java
│       ├── formatters.ts             # Formatadores de data, CEP e texto de usuário
│       ├── image.ts                  # Normalização de prefixo Base64/Data URI
│       ├── permissions.ts            # Regras puras Cidadão vs. Gestor Público (zero ADMIN no mobile)
│       ├── schemas.ts                # Schemas Zod v4
│       ├── shadow.ts                 # Utilitário multiplataforma de sombras (Web boxShadow / Native)
│       ├── throttledPing.ts          # Controle de warmup com deduplicação e cooldown
│       ├── usuarioMappers.ts         # Builder de UsuarioRequest para Java
│       └── zodToFormErrors.ts        # Conversor de ZodError para FormErrors<T>
```

---

## 4. Mapeamento das 12 Telas (11 Telas Funcionais + Sobre o App)

O aplicativo conta com **11 telas funcionais distintas** além da tela **Sobre o App**:

1. **`WelcomeScreen` (`src/screens/Welcome/WelcomeScreen.tsx`):** Apresentação institucional da plataforma ZelaFix, alinhamento à ODS 11 da ONU e portas de entrada para Login ou Cadastro.
2. **`LoginScreen` (`src/screens/Login/LoginScreen.tsx`):** Autenticação JWT de produção com validação Zod.
3. **`RegisterScreen` (`src/screens/Register/RegisterScreen.tsx`):** Cadastro completo de cidadão (Nome, E-mail, Telefone, CEP/GPS, Rua, Número, Referência e Senha) validado com Zod.
4. **`HomeScreen` (`src/screens/Home/HomeScreen.tsx`):** Painel executivo com Índice de Resolução no topo, atalhos por categoria, acesso ao ZelaBot IA e lista de ocorrências mais recentes.
5. **`RadarBairroScreen` (`src/screens/RadarBairro/RadarBairroScreen.tsx`):** Feed colaborativo e ranking de urgência com busca textual, botão integrado para **Reportar Ocorrência**, seleção em modal (`SelectPickerModal`) por categoria/status/localização (todas as cidades por padrão, com opção por cidade, bairro ou estado) e apoio comunitário (`+1`).
6. **`MeusChamadosScreen` (`src/screens/MeusChamados/MeusChamadosScreen.tsx`):** Gestão dos protocolos abertos pelo próprio cidadão filtrados por etapa de atendimento.
7. **`NovoChamadoScreen` (`src/screens/NovoChamado/NovoChamadoScreen.tsx`):** Abertura simplificada de ocorrência a partir do Radar com **foto obrigatória** (câmera/galeria) e endereço via CEP/GPS; a requisição aguarda a triagem da **Spring AI** via RabbitMQ (`DeferredResult` na API) e já retorna o chamado classificado (ou rejeita na hora com feedback visual caso a imagem esteja fora do escopo urbano).
8. **`ChamadoDetailsScreen` (`src/screens/ChamadoDetails/ChamadoDetailsScreen.tsx`):** Visualização completa do protocolo, dados preenchidos pela Triagem IA (título, descrição, categoria, prioridade e órgão responsável), localização, linha do tempo auditável, ações de **Editar/Excluir** para o Autor ou **Gestor Público**, apoio comunitário (`+1`) e painel de **Atualizar Status** exclusivo para o **Gestor Público**.
9. **`EditarChamadoScreen` (`src/screens/EditarChamado/EditarChamadoScreen.tsx`):** Edição cadastral completa de relatos existentes com validação Zod.
10. **`ProfileScreen` (`src/screens/Profile/ProfileScreen.tsx`):** Dados do usuário autenticado, papel (`Cidadão` / `Gestor Público`), cartão de estatísticas pessoais (`ProfileStatsCard`), modal de edição de perfil/senha (`useZodForm` + `BaseModal`), alternância de tema Claro/Escuro persistida e acesso à tela Sobre o App.
11. **`ZelaBotScreen` (`src/screens/ZelaBot/ZelaBotScreen.tsx`):** Assistente conversacional integrado ao botão central da barra de navegação, com histórico de sessões e insights preventivos por bairro.
12. **`SobreAppScreen` (`src/screens/SobreApp/SobreAppScreen.tsx`):** Exibe o **Hash de Commit de Referência** extraído dinamicamente do Git com compartilhamento nativo, integrantes da equipe FIAP com links diretos para GitHub/LinkedIn e stack tecnológica.

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

# 3. Verifique a tipagem estrita do TypeScript e o ESLint
npm run type-check
npm run lint

# 4. Inicie o servidor de desenvolvimento Expo
npx expo start
```
