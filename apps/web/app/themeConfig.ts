// themeConfig.ts
export const themeConfig = {
  token: {
    // 1. COLORS
    colorPrimary: '#0050B3', // Ocean Blue
    colorSuccess: '#52c41a',
    colorWarning: '#fa8c16',
    colorError: '#f5222d',
    colorTextBase: '#1F1F1F', // Dark Slate (Softer than pure black)
    
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