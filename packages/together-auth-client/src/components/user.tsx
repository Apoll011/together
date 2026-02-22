"use client";

import {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
  type ReactNode,
  type CSSProperties,
} from "react";
import { useTogetherAuthContext } from "../context/TogetherAuthProvider.js";
import { redirectToLogin } from "../utils/session.js";
import type { TogetherUser } from "../types/index.ts";
import { sha256 } from "js-sha256/index.js";

// ─── Gravatar ─────────────────────────────────────────────────────────────────

function getGravatarUrl(email: string, size = 80): string {
  const address = String(email).trim().toLowerCase();
  const hash = sha256(address);
  return `https://gravatar.com/avatar/${hash}?s=${size}&d=mp`;
}

export function useGravatar(email: string | null | undefined, size = 80): string | null {
  if (!email) return null;
  return getGravatarUrl(email, size);
}

// ─── UserAvatar ───────────────────────────────────────────────────────────────

export interface UserAvatarProps {
  user: Pick<TogetherUser, "email" | "image" | "name">;
  size?: number;
  style?: CSSProperties;
  className?: string;
}

export function UserAvatar({ user, size = 36, style, className }: UserAvatarProps) {
  const gravatar = useGravatar(user.email, size * 2);
  const src = user.image ?? gravatar ?? undefined;
  const initials = user.name ?? "".split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  
  const base: CSSProperties = {
    width: size,
    height: size,
    borderRadius: "50%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flexShrink: 0,
    fontSize: size * 0.38,
    fontWeight: 600,
    background: "#e2e8f0",
    color: "#475569",
    userSelect: "none",
    ...style,
  };

  if (src) {
    return (
      <span style={base} className={className}>
        <img
          src={src}
          alt={user.name ?? user.email}
          width={size}
          height={size}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </span>
    );
  }

  return (
    <span style={base} className={className}>
      {initials}
    </span>
  );
}

// ─── UserBadge ────────────────────────────────────────────────────────────────

export interface UserBadgeProps {
  label: string;
  variant?: "default" | "admin" | "muted";
  style?: CSSProperties;
  className?: string;
}

const badgeVariants: Record<string, CSSProperties> = {
  default: { background: "#dbeafe", color: "#1e40af" },
  admin:   { background: "#fce7f3", color: "#9d174d" },
  muted:   { background: "#f1f5f9", color: "#64748b" },
};

export function UserBadge({ label, variant = "default", style, className }: UserBadgeProps) {
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.03em",
        textTransform: "uppercase",
        ...badgeVariants[variant],
        ...style,
      }}
    >
      {label}
    </span>
  );
}

// ─── ProfileCard ──────────────────────────────────────────────────────────────

export interface ProfileCardProps {
  user: TogetherUser;
  showRoles?: boolean;
  showEmail?: boolean;
  avatarSize?: number;
  footer?: ReactNode;
  style?: CSSProperties;
  className?: string;
}

export function ProfileCard({
  user,
  showRoles = true,
  showEmail = true,
  avatarSize = 56,
  footer,
  style,
  className,
}: ProfileCardProps) {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        padding: "20px 16px 16px",
        minWidth: 220,
        ...style,
      }}
    >
      <UserAvatar user={user} size={avatarSize} />

      <div style={{ textAlign: "center", lineHeight: 1.4 }}>
        {user.name && (
          <div style={{ fontWeight: 600, fontSize: 15, color: "#0f172a" }}>
            {user.name}
          </div>
        )}
        {user.username && (
          <div style={{ fontSize: 13, color: "#64748b" }}>@{user.username}</div>
        )}
        {showEmail && (
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
            {user.email}
          </div>
        )}
      </div>

      {showRoles && user.roles.length > 0 && (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
          {user.roles.map((role) => (
            <UserBadge
              key={role}
              label={role}
              variant={role === "admin" ? "admin" : "default"}
            />
          ))}
        </div>
      )}

      {footer && (
        <div style={{ width: "100%", marginTop: 4 }}>
          {footer}
        </div>
      )}
    </div>
  );
}

// ─── ProfileMenu ──────────────────────────────────────────────────────────────

interface ProfileMenuContext {
  close: () => void;
}

const ProfileMenuCtx = createContext<ProfileMenuContext>({ close: () => {} });

export function useProfileMenu() {
  return useContext(ProfileMenuCtx);
}

export interface ProfileMenuItemProps {
  children: ReactNode;
  onClick?: () => void;
  danger?: boolean;
  style?: CSSProperties;
  className?: string;
}

export function ProfileMenuItem({ children, onClick, danger, style, className }: ProfileMenuItemProps) {
  const { close } = useProfileMenu();

  return (
    <button
      className={className}
      onClick={() => {
        onClick?.();
        close();
      }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        width: "100%",
        padding: "8px 16px",
        background: "none",
        border: "none",
        textAlign: "left",
        fontSize: 13,
        cursor: "pointer",
        color: danger ? "#dc2626" : "#334155",
        borderRadius: 6,
        transition: "background 0.1s",
        ...style,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = danger ? "#fef2f2" : "#f8fafc";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "none";
      }}
    >
      {children}
    </button>
  );
}

export interface ProfileMenuDividerProps {
  style?: CSSProperties;
}

export function ProfileMenuDivider({ style }: ProfileMenuDividerProps) {
  return (
    <hr
      style={{
        border: "none",
        borderTop: "1px solid #f1f5f9",
        margin: "4px 0",
        ...style,
      }}
    />
  );
}

// ─── ProfileButton ────────────────────────────────────────────────────────────

export interface ProfileButtonProps {
  showName?: boolean;
  avatarSize?: number;
  menuContent?: ReactNode;
  align?: "left" | "right";
  style?: CSSProperties;
  className?: string;
}

export function ProfileButton({
  showName = true,
  avatarSize = 32,
  menuContent,
  align = "right",
  style,
  className,
}: ProfileButtonProps) {
  const { user, isAuthenticated, isLoading, config } = useTogetherAuthContext();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  if (isLoading) {
    return (
      <div
        style={{
          width: avatarSize,
          height: avatarSize,
          borderRadius: "50%",
          background: "#e2e8f0",
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <button
        onClick={() => redirectToLogin(config.identityBaseUrl)}
        style={{
          padding: "6px 14px",
          borderRadius: 8,
          border: "1px solid #e2e8f0",
          background: "#fff",
          fontSize: 13,
          fontWeight: 500,
          cursor: "pointer",
          color: "#334155",
        }}
      >
        Sign in
      </button>
    );
  }

  const defaultMenu = (
    <>
      <ProfileCard user={user} showRoles footer={null} />
      <ProfileMenuDivider />
      <ProfileMenuItem danger onClick={() => redirectToLogin(config.identityBaseUrl)}>
        Sign out
      </ProfileMenuItem>
    </>
  );

  return (
    <ProfileMenuCtx.Provider value={{ close: () => setOpen(false) }}>
      <div ref={ref} style={{ position: "relative", display: "inline-block", ...style }} className={className}>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: showName ? "4px 10px 4px 4px" : 0,
            background: open ? "#f1f5f9" : "transparent",
            border: "1px solid",
            borderColor: open ? "#e2e8f0" : "transparent",
            borderRadius: 999,
            cursor: "pointer",
            transition: "background 0.15s, border-color 0.15s",
          }}
          onMouseEnter={(e) => {
            if (!open) (e.currentTarget as HTMLButtonElement).style.background = "#f8fafc";
          }}
          onMouseLeave={(e) => {
            if (!open) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          <UserAvatar user={user} size={avatarSize} />
          {showName && (
            <span style={{ fontSize: 13, fontWeight: 500, color: "#334155", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.name ?? user.username ?? user.email}
            </span>
          )}
        </button>

        {open && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              ...(align === "right" ? { right: 0 } : { left: 0 }),
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
              zIndex: 9999,
              minWidth: 220,
              overflow: "hidden",
              padding: "4px",
            }}
          >
            {menuContent ?? defaultMenu}
          </div>
        )}
      </div>
    </ProfileMenuCtx.Provider>
  );
}

export interface UserRowCardProps {
  user: Pick<TogetherUser, "email" | "image" | "name" | "username" | "roles">;
  showRole?: boolean;
  action?: ReactNode;
  onClick?: () => void;
  selected?: boolean;
  style?: CSSProperties;
  className?: string;
}

export function UserRowCard({
  user,
  showRole = false,
  action,
  onClick,
  selected,
  style,
  className,
}: UserRowCardProps) {
  const [hovered, setHovered] = useState(false);
  const isInteractive = !!onClick;

  return (
    <div
      className={className}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 16px",
        borderRadius: 12,
        border: "1px solid",
        borderColor: selected ? "#6366f1" : hovered ? "#e2e8f0" : "#f1f5f9",
        background: selected ? "#eef2ff" : hovered && isInteractive ? "#fafafa" : "#fff",
        cursor: isInteractive ? "pointer" : "default",
        transition: "all 0.15s ease",
        boxShadow: hovered && isInteractive ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
        ...style,
      }}
    >
      <UserAvatar user={user} size={40} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontWeight: 600,
          fontSize: 14,
          color: "#0f172a",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>
          {user.name ?? user.username ?? user.email}
        </div>
        <div style={{
          fontSize: 12,
          color: "#94a3b8",
          marginTop: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>
          {user.email}
        </div>
        {showRole && user.roles.length > 0 && (
          <div style={{ display: "flex", gap: 4, marginTop: 5, flexWrap: "wrap" }}>
            {user.roles.map((r) => (
              <UserBadge key={r} label={r} variant={r === "admin" ? "admin" : "default"} />
            ))}
          </div>
        )}
      </div>

      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  );
}

// ─── UserCompactRow ───────────────────────────────────────────────────────────
// Tighter single-line row for use inside lists, tables, dropdowns

export interface UserCompactRowProps {
  user: Pick<TogetherUser, "email" | "image" | "name" | "username">;
  meta?: string;
  action?: ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
  className?: string;
}

export function UserCompactRow({ user, meta, action, onClick, style, className }: UserCompactRowProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={className}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "7px 10px",
        borderRadius: 8,
        background: hovered && onClick ? "#f8fafc" : "transparent",
        cursor: onClick ? "pointer" : "default",
        transition: "background 0.1s",
        ...style,
      }}
    >
      <UserAvatar user={user} size={28} />
      <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: "#334155", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {user.name ?? user.username ?? user.email}
      </span>
      {meta && <span style={{ fontSize: 12, color: "#94a3b8", flexShrink: 0 }}>{meta}</span>}
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  );
}

// ─── UserInfoCard ─────────────────────────────────────────────────────────────
// Wide card with icon strip + optional stats slots

export interface UserInfoCardStat {
  label: string;
  value: ReactNode;
}

export interface UserInfoCardProps {
  user: TogetherUser;
  stats?: UserInfoCardStat[];
  footer?: ReactNode;
  style?: CSSProperties;
  className?: string;
}

export function UserInfoCard({ user, stats, footer, style, className }: UserInfoCardProps) {
  return (
    <div
      className={className}
      style={{
        borderRadius: 16,
        border: "1px solid #f1f5f9",
        background: "#fff",
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        overflow: "hidden",
        width: "100%",
        ...style,
      }}
    >
      {/* Top banner */}
      <div style={{ height: 72, background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }} />

      {/* Avatar overlapping banner */}
      <div style={{ padding: "0 20px 16px", marginTop: -28 }}>
        <div style={{
          display: "inline-block",
          borderRadius: "50%",
          border: "3px solid #fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        }}>
          <UserAvatar user={user} size={56} />
        </div>

        <div style={{ marginTop: 10 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: "#0f172a" }}>
            {user.name ?? user.username ?? user.email}
          </div>
          {user.username && (
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 1 }}>
              @{user.username}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
            <MailIcon size={12} color="#94a3b8" />
            <span style={{ fontSize: 12, color: "#94a3b8" }}>{user.email}</span>
            {user.emailVerified && <VerifiedBadge />}
          </div>
          {user.roles.length > 0 && (
            <div style={{ display: "flex", gap: 4, marginTop: 8, flexWrap: "wrap" }}>
              {user.roles.map((r) => (
                <UserBadge key={r} label={r} variant={r === "admin" ? "admin" : "default"} />
              ))}
            </div>
          )}
        </div>

        {stats && stats.length > 0 && (
          <>
            <div style={{ height: 1, background: "#f1f5f9", margin: "16px 0" }} />
            <div style={{ display: "flex", gap: 0 }}>
              {stats.map((s, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    padding: "0 8px",
                    borderRight: i < stats.length - 1 ? "1px solid #f1f5f9" : "none",
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 16, color: "#0f172a" }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {footer && (
          <div style={{ marginTop: 16 }}>{footer}</div>
        )}
      </div>
    </div>
  );
}

// ─── UserAvatarStack ──────────────────────────────────────────────────────────
// Overlapping avatars for "X members" display

export interface UserAvatarStackProps {
  users: Pick<TogetherUser, "email" | "image" | "name">[];
  max?: number;
  size?: number;
  style?: CSSProperties;
  className?: string;
}

export function UserAvatarStack({ users, max = 4, size = 32, style, className }: UserAvatarStackProps) {
  const visible = users.slice(0, max);
  const overflow = users.length - max;

  return (
    <div
      className={className}
      style={{ display: "inline-flex", alignItems: "center", ...style }}
    >
      {visible.map((u, i) => (
        <div
          key={u.email}
          title={u.name ?? u.email}
          style={{
            marginLeft: i === 0 ? 0 : -(size * 0.3),
            borderRadius: "50%",
            border: "2px solid #fff",
            zIndex: visible.length - i,
            position: "relative",
          }}
        >
          <UserAvatar user={u} size={size} />
        </div>
      ))}
      {overflow > 0 && (
        <div
          style={{
            marginLeft: -(size * 0.3),
            width: size,
            height: size,
            borderRadius: "50%",
            border: "2px solid #fff",
            background: "#f1f5f9",
            color: "#64748b",
            fontSize: size * 0.34,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 0,
            position: "relative",
          }}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}

// ─── UserHoverCard ────────────────────────────────────────────────────────────
// Wrap any element — hovering reveals a mini profile popover

export interface UserHoverCardProps {
  user: TogetherUser;
  children: ReactNode;
  delay?: number;
  align?: "left" | "right" | "center";
}

export function UserHoverCard({ user, children, delay = 300, align = "left" }: UserHoverCardProps) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  function show() {
    timerRef.current = setTimeout(() => setVisible(true), delay);
  }
  function hide() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  }

  const alignStyle: CSSProperties =
    align === "right"
      ? { right: 0 }
      : align === "center"
      ? { left: "50%", transform: "translateX(-50%)" }
      : { left: 0 };

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }} onMouseEnter={show} onMouseLeave={hide}>
      {children}
      {visible && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            ...alignStyle,
            zIndex: 9999,
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 14,
            boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
            width: 260,
            animation: "fadeSlideIn 0.15s ease",
          }}
        >
          <style>{`@keyframes fadeSlideIn { from { opacity: 0; transform: translateY(-4px) ${align === "center" ? "translateX(-50%)" : ""}; } to { opacity: 1; transform: translateY(0) ${align === "center" ? "translateX(-50%)" : ""}; } }`}</style>
          <div style={{ padding: 16 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <UserAvatar user={user} size={44} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#0f172a" }}>
                  {user.name ?? user.username ?? user.email}
                </div>
                {user.username && (
                  <div style={{ fontSize: 12, color: "#64748b" }}>@{user.username}</div>
                )}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 10 }}>
              <MailIcon size={12} color="#94a3b8" />
              <span style={{ fontSize: 12, color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.email}
              </span>
            </div>
            {user.roles.length > 0 && (
              <div style={{ display: "flex", gap: 4, marginTop: 8, flexWrap: "wrap" }}>
                {user.roles.map((r) => (
                  <UserBadge key={r} label={r} variant={r === "admin" ? "admin" : "default"} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── UserSelectList ───────────────────────────────────────────────────────────
// List of selectable user rows with checkbox-style selection

export interface UserSelectListProps {
  users: Pick<TogetherUser, "email" | "image" | "name" | "username" | "roles">[];
  selected: string[];
  onToggle: (email: string) => void;
  style?: CSSProperties;
  className?: string;
}

export function UserSelectList({ users, selected, onToggle, style, className }: UserSelectListProps) {
  return (
    <div
      className={className}
      style={{ display: "flex", flexDirection: "column", gap: 4, ...style }}
    >
      {users.map((u) => {
        const isSelected = selected.includes(u.email);
        return (
          <UserRowCard
            key={u.email}
            user={u}
            selected={isSelected}
            onClick={() => onToggle(u.email)}
            action={
              <Checkbox checked={isSelected} />
            }
          />
        );
      })}
    </div>
  );
}

// ─── UserEmptyState ───────────────────────────────────────────────────────────

export interface UserEmptyStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  style?: CSSProperties;
  className?: string;
}

export function UserEmptyState({
  title = "No users found",
  description = "There are no users to display.",
  action,
  style,
  className,
}: UserEmptyStateProps) {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        textAlign: "center",
        ...style,
      }}
    >
      <div style={{
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: "#f1f5f9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
      }}>
        <UsersIcon size={24} color="#94a3b8" />
      </div>
      <div style={{ fontWeight: 600, fontSize: 15, color: "#0f172a", marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, color: "#94a3b8", maxWidth: 280 }}>{description}</div>
      {action && <div style={{ marginTop: 20 }}>{action}</div>}
    </div>
  );
}

// ─── UserMenuSection ──────────────────────────────────────────────────────────
// Labelled section divider for inside ProfileButton menus

export interface UserMenuSectionProps {
  label: string;
  children: ReactNode;
  style?: CSSProperties;
}

export function UserMenuSection({ label, children, style }: UserMenuSectionProps) {
  return (
    <div style={{ padding: "8px 0", ...style }}>
      <div style={{
        padding: "2px 16px 6px",
        fontSize: 10,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: "#94a3b8",
      }}>
        {label}
      </div>
      {children}
    </div>
  );
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function VerifiedBadge() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="#22c55e" />
      <polyline points="6,12 10,16 18,8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MailIcon({ size = 14, color = "#94a3b8" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  );
}

function UsersIcon({ size = 20, color = "#94a3b8" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <div style={{
      width: 18,
      height: 18,
      borderRadius: 5,
      border: `2px solid ${checked ? "#6366f1" : "#cbd5e1"}`,
      background: checked ? "#6366f1" : "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.15s",
      flexShrink: 0,
    }}>
      {checked && (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <polyline points="1.5,5 4,7.5 8.5,2.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}