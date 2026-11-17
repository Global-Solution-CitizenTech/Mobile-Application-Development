import type { ReactNode, Ref } from 'react';
import type {
  StyleProp,
  TextInputInstance,
  TextInputProps,
  TextStyle,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import type { Edge } from 'react-native-safe-area-context';
import type { AiChatSession, AiInsightItem, AiMessage } from '@/types/ai';
import type { Usuario } from '@/types/auth';
import type { CategoriaResponse, StatusChamado } from '@/types/categoria';
import type { Chamado, EstatisticasChamados, FotoUpload, HistoricoChamado } from '@/types/chamado';
import type { EnderecoFormInput, EnderecoResponse } from '@/types/endereco';
import type { FeedbackType } from '@/types/feedback';
import type {
  LocationFilterLevel,
  MeusChamadosTab,
  RadarActiveModal,
  RadarLocationFilter,
  RadarSortOption,
  SelectPickerOption,
  SelectPickerTab,
  StatusFiltro,
} from '@/types/filters';
import type {
  BoundFieldProps,
  ChamadoFormData,
  FieldBinder,
  LoginFormData,
  RegisterFormData,
  StatusUpdateFormData,
  StringFieldKeys,
} from '@/types/form';
import type { IoniconName } from '@/types/theme';
import type { GitCommitMetadata, IntegranteGrupo } from '@/types/version';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface PilarItem {
  icon: IoniconName;
  titulo: string;
  descricao: string;
}

export interface AvatarProps {
  nome?: string | null;
  tamanho?: AvatarSize | number;
}

export interface AuthHeaderProps {
  title: string;
  subtitle: string;
  onBack?: () => void;
  showIcon?: boolean;
}

export interface BaseModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: number;
  centered?: boolean;
  dismissable?: boolean;
  scrollable?: boolean;
}

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export interface InputProps extends TextInputProps {
  ref?: Ref<TextInputInstance>;
  label?: string;
  error?: string | null;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isPassword?: boolean;
  mask?: (text: string) => string;
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
}

export interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: ReactNode;
  centerTitle?: boolean;
}

export interface KeyboardScreenLayoutProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  keyboardVerticalOffset?: number;
  showsVerticalScrollIndicator?: boolean;
  safeAreaEdges?: readonly Edge[];
}

export interface EnderecoFormFieldsProps {
  field: (name: StringFieldKeys<EnderecoFormInput>) => BoundFieldProps;
  disabled?: boolean;
  onUsarGps?: () => void;
  capturandoGps?: boolean;
  erroGps?: string | null;
  localizacaoResumo?: string | null;
  cepRef?: Ref<TextInputInstance>;
  numeroRef?: Ref<TextInputInstance>;
  ruaRef?: Ref<TextInputInstance>;
  referenciaRef?: Ref<TextInputInstance>;
  onSubmitReferencia?: () => void;
  referenciaReturnKeyType?: TextInputProps['returnKeyType'];
}

export interface ChamadoFormFieldsProps {
  field: <K extends StringFieldKeys<ChamadoFormData>>(name: K) => BoundFieldProps;
  disabled?: boolean;
  hideDetails?: boolean;
  onUsarGps?: () => void;
  capturandoGps?: boolean;
  erroGps?: string | null;
  localizacaoResumo?: string | null;
}

export interface ChamadoCardProps {
  chamado: Chamado;
  onPress: () => void;
  onApoiar?: () => void;
  isSupporting?: boolean;
}

export interface CategoryBadgeProps {
  categoria: string;
  compact?: boolean;
}

export interface CategoryGridSelectorProps {
  categorias: readonly CategoriaResponse[];
  selectedCategoriaId: number;
  onSelectCategoriaId: (id: number) => void;
  error?: string;
  disabled?: boolean;
}

export interface EmptyStateProps {
  icon?: IoniconName;
  title: string;
  description: string;
  actionTitle?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}

export interface FeedbackModalProps {
  visible: boolean;
  type?: FeedbackType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmLoading?: boolean;
}

export interface FeedbackVisual {
  icon: IoniconName;
  color: string;
  bg: string;
  btnVariant: ButtonVariant;
}

export interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
  fullScreen?: boolean;
  style?: StyleProp<ViewStyle>;
}

export interface PickerTriggerButtonProps {
  icon?: IoniconName;
  label?: string;
  valueLabel: string;
  active?: boolean;
  onPress: () => void;
  fullWidth?: boolean;
}

export interface SelectPickerQuickAction {
  label: string;
  onPress: () => void;
}

export interface SelectPickerModalProps<
  T extends string = string,
  TabKey extends string = string,
> {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  options: readonly SelectPickerOption<T>[];
  selectedValue: T | null;
  onSelect: (value: T) => void;
  tabs?: readonly SelectPickerTab<TabKey>[];
  activeTab?: TabKey;
  onChangeTab?: (tabKey: TabKey) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  quickAction?: SelectPickerQuickAction;
}

export interface StatCardProps {
  label: string;
  value: number | string;
  icon: IoniconName;
  color?: string;
  bgColor?: string;
  style?: StyleProp<ViewStyle>;
}

export interface StatusBadgeProps {
  status: StatusChamado;
  compact?: boolean;
}

export interface PhotoEvidencePickerProps {
  foto?: FotoUpload;
  onChangeFoto: (foto?: FotoUpload) => void;
  error?: string;
  disabled?: boolean;
}

export interface AiTriageBannerProps {
  message?: string;
}

export interface NovoChamadoSuccessModalProps {
  chamado: Chamado | null;
  onViewChamado: (chamadoId: number) => void;
  onGoToMeusChamados: () => void;
}

export interface HomeHeroHeaderProps {
  usuario: Usuario | null;
  onPressProfile: () => void;
  onPressRadar: () => void;
}

export interface HomeAiPromoCardProps {
  onPress: () => void;
}

export interface HomeCategoryListProps {
  categorias: readonly CategoriaResponse[];
  onSelectCategoria: (categoriaNome: string) => void;
}

export interface HomePanoramaCardProps {
  estatisticas: EstatisticasChamados;
  taxaResolucao: number;
}

export interface RadarSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export interface RadarFilterChipsProps {
  categoriaFiltro: string;
  statusFiltro: StatusFiltro;
  locationFilter: RadarLocationFilter;
  sortBy: RadarSortOption;
  hasActiveFilters: boolean;
  onOpenLocationModal: () => void;
  onOpenCategoriaModal: () => void;
  onOpenStatusModal: () => void;
  onToggleSort: () => void;
  onClearFilters: () => void;
}

export interface RadarFilterModalsProps {
  openModal: RadarActiveModal;
  onClose: () => void;
  categorias: readonly CategoriaResponse[];
  categoriaFiltro: string;
  onChangeCategoria: (categoria: string) => void;
  statusFiltro: StatusFiltro;
  onChangeStatus: (status: StatusFiltro) => void;
  locationFilter: RadarLocationFilter;
  onChangeLocation: (location: RadarLocationFilter) => void;
  locationOptions: Record<LocationFilterLevel, string[]>;
  userCity: string;
}

export interface RadarHeaderFiltersProps {
  busca: string;
  onChangeBusca: (text: string) => void;
  categorias: readonly CategoriaResponse[];
  categoriaFiltro: string;
  onChangeCategoria: (categoria: string) => void;
  statusFiltro: StatusFiltro;
  onChangeStatus: (status: StatusFiltro) => void;
  locationFilter: RadarLocationFilter;
  onChangeLocation: (location: RadarLocationFilter) => void;
  locationOptions: Record<LocationFilterLevel, string[]>;
  userCity: string;
  sortBy: RadarSortOption;
  onChangeSort: (sort: RadarSortOption) => void;
  totalCount: number;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onPressReportar: () => void;
}

export interface MeusChamadosTabItem {
  key: MeusChamadosTab;
  label: string;
  count: number;
}

export interface MeusChamadosHeaderProps {
  total: number;
  abertos: number;
  emAndamento: number;
  concluidos: number;
  activeTab: MeusChamadosTab;
  onSelectTab: (tab: MeusChamadosTab) => void;
}

export interface ChamadoActionBarProps {
  chamado: Chamado;
  podeApoiar: boolean;
  podeEditar: boolean;
  podeAlterarStatus: boolean;
  podeExcluir: boolean;
  isSupporting: boolean;
  onApoiar: () => void;
  onEditar: () => void;
  onAlterarStatus: () => void;
  onExcluir: () => void;
}

export interface ChamadoLocationCardProps {
  endereco: EnderecoResponse;
}

export interface ChamadoSummaryCardProps {
  chamado: Chamado;
  onAskAi: () => void;
}

export interface ChamadoTimelineCardProps {
  historico: HistoricoChamado[];
}

export interface StatusChangeModalProps {
  visible: boolean;
  currentStatus: StatusChamado;
  onClose: () => void;
  onSubmit: (data: StatusUpdateFormData) => void;
  submitting: boolean;
}

export interface LoginFormProps {
  field: FieldBinder<LoginFormData>;
  isLoading: boolean;
  onSubmit: () => void;
  onGoToRegister: () => void;
}

export interface RegisterFormProps {
  field: FieldBinder<RegisterFormData>;
  onSubmit: () => void;
  onGoToLogin: () => void;
  submitting: boolean;
  onUsarGps?: () => void;
  capturandoGps?: boolean;
  erroGps?: string | null;
  localizacaoResumo?: string | null;
}

export interface ProfileUserCardProps {
  usuario: Usuario;
}

export interface ProfileStatsCardProps {
  total: number;
  emAndamento: number;
  concluidos: number;
  apoiosRecebidos: number;
  loading?: boolean;
  onPressVerChamados: () => void;
}

export interface ProfileMenuCardProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onPressEditarPerfil: () => void;
  onPressZelaBot: () => void;
  onPressSobreApp: () => void;
}

export interface TeamMembersCardProps {
  integrantes: readonly IntegranteGrupo[];
}

export interface CommitInfoCardProps {
  commitInfo: GitCommitMetadata;
  onShare: () => void;
}

export interface TechStackCardProps {
  items: readonly string[];
}

export interface ZelaBotHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  sessoes: AiChatSession[];
  loading: boolean;
  error?: string | null;
  activeSessionId: string;
  loadingSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onNewChat: () => void;
}

export interface ZelaBotInputBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: (customText?: string) => void;
  sugestoes: string[];
  disabled: boolean;
  keyboardVisible: boolean;
}

export interface MarkdownTextProps {
  content: string;
  /** Tipografia reduzida para textos secundários (ex.: próximos passos do ZelaBot). */
  compact?: boolean;
  textColor?: string;
  accentColor?: string;
}

export interface ZelaBotInsightsBannerProps {
  bairro?: string;
  insights: AiInsightItem[];
  loading: boolean;
}

export interface ZelaBotMessageBubbleProps {
  message: AiMessage;
}
