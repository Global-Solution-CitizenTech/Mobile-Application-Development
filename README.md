# ZelaFix Mobile — Zeladoria Urbana Colaborativa & Alerta Cidadão

> **FIAP Global Solution 2026/2 — Mobile Application Development (2TDSPG)**  
> **Tema:** *ZelaFix — Tecnologia com o cidadão no centro da inovação*  
> **Alinhamento ONU:** **ODS 11** — Cidades e Comunidades Sustentáveis

---

## 1. Visão Geral da Solução

O **ZelaFix Mobile** é um aplicativo desenvolvido em **React Native (Expo SDK 54) + TypeScript** que coloca o cidadão no centro da gestão pública urbana. Por meio dele, moradores identificam problemas nos espaços públicos do bairro (buracos na via, bueiros entupidos, iluminação pública apagada, descarte irregular de lixo, queda de árvores e vazamentos), anexam evidência fotográfica e localização via GPS, contam com **Triagem Inteligente por IA** para classificação automática de severidade e órgão competente, priorizam colaborativamente as ocorrências mais urgentes da vizinhança e acompanham o histórico completo de resolução até o parecer final da prefeitura.

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

- **Gerenciamento de Estado Assíncrono (`@tanstack/react-query` v5):** Cache inteligente, invalidação automática de *queries* (`queryKeys.chamados`), *pull-to-refresh* e mutações otimistas (`useMutation`).
- **Validação de Formulários com Schemas (`zod` v4):** Schemas declarativos (`LoginSchema`, `RegisterSchema`, `ProfileEditSchema`, `ChamadoFormSchema`, `StatusUpdateSchema`) com extração automática de erros por campo.
- **Extração Dinâmica do Commit Hash (`app.config.js` + `expo-constants`):** O hash completo e curto do commit Git, branch e data são injetados automaticamente em tempo de build e exibidos na tela **Sobre o App**, atendendo integralmente à exigência de auditoria do edital FIAP.
- **Camada HTTP Pronta para Java Spring Boot (`src/services/`):** Suporte nativo ao formato paginado `Page<T>` do **Spring Data JPA**, interceptors `Bearer JWT` do **Spring Security**, normalização de erros do `@RestControllerAdvice` / Bean Validation (`src/utils/apiError.ts`) e *warmup* em `/actuator/health`.
- **Isolamento de Dados Mockados (`src/mocks/`):** Todos os dados de fallback para demonstração offline estão isolados em `src/mocks/chamadosMock.ts`, mantendo os serviços (`authService.ts` e `chamadoService.ts`) limpos e orientados aos contratos REST Java.

```text
Mobile-Application-Development/
├── App.tsx                           # Providers: SafeArea, QueryClientProvider, ThemeProvider, AuthProvider
├── app.config.js                     # Injeção dinâmica do Git Commit Hash via child_process
├── src/
│   ├── components/                   # Componentes modulares (Pasta + index.tsx)
│   │   ├── Button/index.tsx
│   │   ├── CategoryBadge/index.tsx
│   │   ├── ChamadoCard/index.tsx
│   │   ├── EmptyState/index.tsx
│   │   ├── FeedbackModal/index.tsx
│   │   ├── Header/index.tsx
│   │   ├── Input/index.tsx
│   │   ├── LoadingSpinner/index.tsx
│   │   ├── StatCard/index.tsx
│   │   └── StatusBadge/index.tsx
│   ├── config/
│   │   ├── env.ts                    # URLs da API Java Spring Boot e flags de ambiente
│   │   └── version.ts                # Metadados de build, Commit Hash dinâmico e Equipe FIAP
│   ├── contexts/
│   │   ├── AuthContext.tsx           # Sessão JWT + invalidação do QueryClient + Warmup API
│   │   └── ThemeContext.tsx          # Tema Claro/Escuro persistido via AsyncStorage
│   ├── hooks/
│   │   ├── useAuth.ts                # Acesso ao contexto de autenticação
│   │   ├── useChamados.ts            # Queries e Mutations TanStack Query v5
│   │   ├── useChamadoForm.ts         # Formulário de criação/edição com Zod + Triagem IA
│   │   ├── useLoginForm.ts           # Formulário de login com Zod + useMutation
│   │   └── useRegisterForm.ts        # Formulário de cadastro com Zod + useMutation
│   ├── lib/
│   │   ├── queryClient.ts            # Instância global do TanStack QueryClient
│   │   └── queryKeys.ts              # Fábrica tipada de Query Keys
│   ├── mocks/
│   │   └── chamadosMock.ts           # Dados mockados isolados para demonstração offline
│   ├── navigation/
│   │   ├── AuthNavigator.tsx         # Stack Público (Welcome, Login, Register)
│   │   ├── AppNavigator.tsx          # Stack Autenticado (Main Tabs, Details, Novo, Editar, Sobre)
│   │   ├── TabNavigator.tsx          # Bottom Tabs (Início, Demandas, Meus Relatos, Perfil)
│   │   ├── index.tsx                 # Roteador condicional + Splash de sessão
│   │   └── types.ts                  # Tipagens estritas do React Navigation
│   ├── screens/                      # Telas organizadas em pastas + subcomponentes locais
│   │   ├── Welcome/WelcomeScreen.tsx
│   │   ├── Login/LoginScreen.tsx (+ components/LoginForm.tsx)
│   │   ├── Register/RegisterScreen.tsx (+ components/RegisterForm.tsx)
│   │   ├── Home/HomeScreen.tsx (+ components/HomePanoramaCard.tsx, HomeCategoryList.tsx)
│   │   ├── RadarBairro/RadarBairroScreen.tsx (+ components/RadarHeaderFilters.tsx)
│   │   ├── MeusChamados/MeusChamadosScreen.tsx (+ components/MeusChamadosHeader.tsx)
│   │   ├── NovoChamado/NovoChamadoScreen.tsx (+ components/PhotoEvidencePicker.tsx, CategoryGridSelector.tsx)
│   │   ├── EditarChamado/EditarChamadoScreen.tsx
│   │   ├── ChamadoDetails/ChamadoDetailsScreen.tsx (+ components/ChamadoTimelineCard.tsx, StatusChangeModal.tsx)
│   │   ├── Profile/ProfileScreen.tsx (+ components/EditProfileModal.tsx)
│   │   └── SobreApp/SobreAppScreen.tsx
│   ├── services/
│   │   ├── api.ts                    # Axios + Interceptor JWT + Health Warmup
│   │   ├── authService.ts            # Contratos REST /auth/* (Java Spring Security)
│   │   └── chamadoService.ts         # Contratos REST /chamados/* (Spring Data JPA Page<T>)
│   ├── theme/index.ts                # Design System (Cores, Tipografia, Sombras, Espaçamentos)
│   ├── types/
│   │   ├── api.ts                    # Contratos SpringPageResponse<T>, ApiError, FieldValidationError
│   │   └── index.ts                  # Entidades de domínio e DTOs
│   └── utils/
│       ├── apiError.ts               # Normalizador de erros HTTP / Spring Boot
│       └── schemas.ts                # Schemas Zod v4
```

---

## 4. Mapeamento das 10 Telas (9 Telas Válidas + Sobre o App)

Conforme regra do edital (*"Mínimo de 6 telas distintas — a tela sobre o app não contabiliza no total de telas"*), o aplicativo conta com **9 telas funcionais distintas** além da tela **Sobre o App**:

1. **`WelcomeScreen` (`src/screens/Welcome/WelcomeScreen.tsx`):** Apresentação institucional da plataforma ZelaFix, alinhamento à ODS 11 da ONU e portas de entrada para Login ou Cadastro.
2. **`LoginScreen` (`src/screens/Login/LoginScreen.tsx`):** Autenticação JWT com validação Zod e botão de preenchimento rápido para avaliadores FIAP.
3. **`RegisterScreen` (`src/screens/Register/RegisterScreen.tsx`):** Cadastro completo de cidadão (Nome, E-mail, CPF, Telefone, Bairro e Senha) validado com Zod.
4. **`HomeScreen` (`src/screens/Home/HomeScreen.tsx`):** Painel executivo do bairro com Índice de Resolução, métricas inline, CTA de abertura rápida, Top 2 prioridades urgentes e distribuição por categoria.
5. **`RadarBairroScreen` (`src/screens/RadarBairro/RadarBairroScreen.tsx`):** Feed colaborativo e ranking de urgência do bairro com busca textual, alternância *Mais Urgentes / Todas*, filtros por categoria/status e botão de apoio comunitário (`+1`).
6. **`MeusChamadosScreen` (`src/screens/MeusChamados/MeusChamadosScreen.tsx`):** Gestão dos protocolos abertos pelo próprio cidadão filtrados por etapa de atendimento.
7. **`NovoChamadoScreen` (`src/screens/NovoChamado/NovoChamadoScreen.tsx`):** Abertura de relato com seletor de evidência fotográfica, grid de categorias, prévia em tempo real da **Triagem IA** e autopreenchimento GPS.
8. **`ChamadoDetailsScreen` (`src/screens/ChamadoDetails/ChamadoDetailsScreen.tsx`):** Visualização completa do protocolo, parecer da Triagem IA, coordenadas GPS, linha do tempo auditável e modais de atualização de status e exclusão.
9. **`EditarChamadoScreen` (`src/screens/EditarChamado/EditarChamadoScreen.tsx`):** Edição cadastral completa de relatos existentes com validação Zod.
10. **`ProfileScreen` (`src/screens/Profile/ProfileScreen.tsx`):** Dados do cidadão verificado, modal de edição de perfil/senha, alternância de tema Claro/Escuro e restauração da base de demonstração.
11. **`SobreAppScreen` (`src/screens/SobreApp/SobreAppScreen.tsx`):** Exibe o **Hash de Commit de Referência** extraído dinamicamente do Git, integrantes da equipe FIAP com links diretos para GitHub/LinkedIn e stack tecnológica.

---

## 5. Contratos REST Prontos para o Backend Java (Spring Boot)

A camada `src/services/` já está configurada para consumir os seguintes endpoints do backend Java em `EXPO_PUBLIC_API_URL` (padrão `http://localhost:8080/api/v1`):

| Método | Endpoint Java Spring Boot | Descrição |
| :---: | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Autentica o cidadão e retorna `{ usuario, token }` (JWT Bearer) |
| `POST` | `/api/v1/auth/register` | Registra novo cidadão com validação Bean Validation |
| `PUT` | `/api/v1/usuarios/{id}` | Atualiza dados cadastrais e credenciais do cidadão |
| `GET` | `/api/v1/chamados` | Lista chamados (suporta retorno `Page<ChamadoResponseDTO>` ou `List`) |
| `GET` | `/api/v1/chamados/{id}` | Detalhes completos do protocolo e histórico |
| `POST` | `/api/v1/chamados` | Cria novo chamado de zeladoria urbana |
| `PUT` | `/api/v1/chamados/{id}` | Atualiza dados de um chamado existente |
| `PATCH` | `/api/v1/chamados/{id}/status` | Atualiza etapa do protocolo (`Aberto`, `Em Andamento`, `Resolvido`) |
| `POST` | `/api/v1/chamados/{id}/apoiar` | Registra/remove apoio comunitário (`+1`) de morador |
| `DELETE` | `/api/v1/chamados/{id}` | Remove chamado pelo ID |
| `POST` | `/api/v1/triagem-ia/analisar` | Endpoint Spring AI para classificação automática de severidade e órgão |

---

## 6. Como Executar o Projeto

```bash
# 1. Acesse a pasta do projeto Mobile
cd Mobile-Application-Development

# 2. Instale as dependências
npm install --legacy-peer-deps

# 3. Verifique a tipagem estrita do TypeScript
npm run type-check

# 4. Inicie o servidor de desenvolvimento Expo
npx expo start
```

---

## 7. Declaração de Uso de Inteligência Artificial Generativa (Item 1.11 do Edital)

Em conformidade com as diretrizes de ética e transparência acadêmica da **FIAP Global Solution 2026/2 (Seção 1.11)**:

- **Ferramentas utilizadas:** Assistente de codificação baseado em LLM para apoio na refatoração arquitetural de componentes React Native, estruturação de schemas de validação com `zod` e padronização de contratos tipados TypeScript (`SpringPageResponse<T>`).
- **Responsabilidade e Autoria Humana:** Todas as decisões de produto, definição do escopo funcional de zeladoria colaborativa, modelagem de domínio, regras de negócio, fluxos de navegação, identidade visual e revisão integral do código-fonte foram conduzidas, testadas e validadas pelos integrantes do grupo.
