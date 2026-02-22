// ─── Configuration ────────────────────────────────────────────────────────────
export { configure, getConfig, getIdentityUrl } from "./config.js";

// ─── Provider ─────────────────────────────────────────────────────────────────
export {
  TogetherAuthProvider,
  type TogetherAuthProviderProps,
} from "./context/TogetherAuthProvider.js";

// ─── Hooks ────────────────────────────────────────────────────────────────────
export {
  useTogetherAccount,
  useSession,
  useRoles,
  useHasRole,
  useHasAppRole,
  type UseTogetherAccountReturn,
  type UseSessionReturn,
  type UseRolesReturn,
} from "./hooks/index.js";

// ─── Components ───────────────────────────────────────────────────────────────
export {
  SignedIn,
  SignedOut,
  RequireAuth,
  RequireRole,
  RequireAppRole,
  type SignedInProps,
  type SignedOutProps,
  type RequireAuthProps,
  type RequireRoleProps,
  type RequireAppRoleProps,
} from "./components/index.js";

export {
  UserAvatar,
  UserBadge,
  ProfileCard,
  ProfileMenuItem,
  ProfileMenuDivider,
  useProfileMenu,
  UserRowCard,
  UserCompactRow,
  UserInfoCard,
  UserAvatarStack,
  UserSelectList,
  UserHoverCard,
  UserMenuSection,
  UserEmptyState,
  type UserAvatarProps,
  type UserBadgeProps,
  type ProfileCardProps,
  type ProfileMenuItemProps,
  type ProfileMenuDividerProps,
  type UserRowCardProps,
  type UserCompactRowProps,
  type UserInfoCardProps,
  type UserAvatarStackProps,
  type UserSelectListProps,
  type UserHoverCardProps,
  type UserMenuSectionProps,
} from "./components/user.js";

// ─── Client utilities ─────────────────────────────────────────────────────────
export {
  redirectToLogin,
  logout,
  refreshSession,
  getIdentityPageUrl,
  fetchSession,
} from "./utils/client.js";

// ─── Types ────────────────────────────────────────────────────────────────────
export type {
  TogetherUser,
  TogetherSession,
  TogetherAuthConfig,
  TogetherAuthContextValue,
  GlobalRole,
  AppRoles,
} from "./types/index.js";
