export const theme = {
  colors: {
    bg: '#f6f7f9',
    surface: '#ffffff',
    text: '#1a1d21',
    textMuted: '#5c6570',
    border: '#e4e7ec',
    accent: '#3b6fd9',
    accentMuted: '#e8eef9',
    success: '#15803d',
    danger: '#b42318',
  },
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
  },
  shadow: {
    card: '0 1px 2px rgba(16, 24, 40, 0.06), 0 1px 3px rgba(16, 24, 40, 0.1)',
  },
  font: {
    family:
      "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  layout: {
    maxWidth: '1120px',
    headerHeight: '56px',
  },
} as const;

export type AppTheme = typeof theme;
