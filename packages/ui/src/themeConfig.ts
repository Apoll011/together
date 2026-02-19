// themeConfig.ts
import type { ThemeConfig } from "antd";

// ─── Light Theme ─────────────────────────────────────────────────────────────
export const lightTheme: ThemeConfig = {
  token: {
    // 1. COLORS
    colorPrimary: '#0050B3', // Ocean Blue
    colorSuccess: '#52c41a',
    colorWarning: '#fa8c16',
    colorError: '#f5222d',
    colorTextBase: '#1F1F1F', // Dark Slate (Softer than pure black)
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: '#ffffff',
    
    // 2. SHAPE & FORM (The Minimalist Tweaks)
    borderRadius: 12,         // Soft squares (Standard AntD is 6, Apple is 12+)
    wireframe: false,        // Use modern filled styles instead of outlines
    
    // 3. TYPOGRAPHY
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: 16,            // Larger base text for readability
  },
  components: {
    Button: {
      controlHeight: 44,     // Taller buttons (easier to click)
      algorithm: true,       // Use AntD algorithms to calculate hover states
      fontWeight: 600,
    },
    Card: {
      boxShadowTertiary: '0 1px 2px 0 rgba(0, 0, 0, 0.03)', // Very subtle shadow
      paddingLG: 32,         // More whitespace inside cards
    },
    Layout: {
      headerBg: '#FFFFFF', // White header (clean look)
      bodyBg: '#FFFFFF',   // White body
    },
    Typography: {
      titleMarginBottom: '1em',
    }
  }
};

// ─── Dark Theme ─────────────────────────────────────────────────────────────
export const darkTheme: ThemeConfig = {
  token: {
    // 1. COLORS
    colorPrimary: '#177ddc', // Lighter blue for dark mode
    colorSuccess: '#49aa19',
    colorWarning: '#d08420',
    colorError: '#a61d24',
    colorTextBase: '#ffffff',
    colorBgContainer: '#1b1b1b',
    colorBgElevated: '#262626',
    colorBgLayout: '#141414',
    
    // 2. SHAPE & FORM
    borderRadius: 12,
    wireframe: false,
    
    // 3. TYPOGRAPHY
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: 16,
  },
  components: {
    Button: {
      controlHeight: 44,
      algorithm: true,
      fontWeight: 600,
    },
    Card: {
      boxShadowTertiary: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
      paddingLG: 32,
    },
    Layout: {
      headerBg: '#1b1b1b',
      bodyBg: '#141414',
    },
    Typography: {
      titleMarginBottom: '1em',
    }
  }
};

// ─── Brand Colors (used in Navbar & Footer) ─────────────────────────────────
export const brandColors = {
  light: {
    // Navbar colors
    navBg: '#ffffff',
    navText: '#1F1F1F',
    navSubText: '#595959',
    navBorder: 'rgba(0,0,0,0.08)',
    navBorderScrolled: 'rgba(0,0,0,0.06)',
    navShadow: 'rgba(0,0,0,0.06)',
    logoBg: '#0050B3',
    logoText: '#ffffff',
    logoBorder: 'none',
    accentText: '#0050B3',
    
    // Footer colors
    footerBg: '#0A0F1E',
    footerText: '#ffffff',
    footerTextMuted: 'rgba(255,255,255,0.5)',
    footerLink: 'rgba(255,255,255,0.55)',
    footerLinkHover: 'rgba(255,255,255,0.95)',
    footerDivider: 'rgba(255,255,255,0.08)',
    footerBottomText: 'rgba(255,255,255,0.35)',
    footerSocialIcon: 'rgba(255,255,255,0.4)',
    footerSocialIconHover: 'rgba(255,255,255,0.9)',
    footerSocialBgHover: 'rgba(255,255,255,0.08)',
    
    // App item colors (for ecosystem)
    appColors: {
      preserve: '#52c41a',
      learn: '#fa8c16',
      work: '#0050B3',
      help: '#eb2f96',
      explore: '#722ed1',
      code: '#13c2c2',
    },
    
    // Button colors
    primaryBtnBg: '#0050B3',
    primaryBtnText: '#ffffff',
  },
  dark: {
    // Navbar colors
    navBg: 'rgba(27,27,27,0.95)',
    navText: '#ffffff',
    navSubText: 'rgba(255,255,255,0.65)',
    navBorder: 'rgba(255,255,255,0.08)',
    navBorderScrolled: 'rgba(255,255,255,0.06)',
    navShadow: 'rgba(0,0,0,0.3)',
    logoBg: '#177ddc',
    logoText: '#ffffff',
    logoBorder: '1px solid rgba(255,255,255,0.2)',
    accentText: '#177ddc',
    
    // Footer colors
    footerBg: '#0d1117',
    footerText: '#ffffff',
    footerTextMuted: 'rgba(255,255,255,0.5)',
    footerLink: 'rgba(255,255,255,0.55)',
    footerLinkHover: 'rgba(255,255,255,0.95)',
    footerDivider: 'rgba(255,255,255,0.08)',
    footerBottomText: 'rgba(255,255,255,0.35)',
    footerSocialIcon: 'rgba(255,255,255,0.4)',
    footerSocialIconHover: 'rgba(255,255,255,0.9)',
    footerSocialBgHover: 'rgba(255,255,255,0.08)',
    
    // App item colors (for ecosystem)
    appColors: {
      preserve: '#49aa19',
      learn: '#d08420',
      work: '#177ddc',
      help: '#db2777',
      explore: '#a855f7',
      code: '#06b6d4',
    },
    
    // Button colors
    primaryBtnBg: '#177ddc',
    primaryBtnText: '#ffffff',
  }
};

// Default export for backward compatibility
export const themeConfig = lightTheme;

