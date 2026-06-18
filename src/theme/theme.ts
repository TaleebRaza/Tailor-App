// src/theme/theme.ts

export const theme = {
  colors: {
    background: '#F2F2F7', // Standard Apple system background (light gray)
    surface: '#FFFFFF', // Standard card background
    primary: '#007AFF', // Apple system blue
    text: '#000000',
    textSecondary: '#8E8E93',
    border: '#E5E5EA',
    danger: '#FF3B30',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24, // Deep curve for the Bento Box aesthetic
  },
  typography: {
    header: { fontSize: 28, fontWeight: '700' as const },
    title: { fontSize: 20, fontWeight: '600' as const },
    body: { fontSize: 16, fontWeight: '400' as const },
    caption: { fontSize: 13, fontWeight: '500' as const },
  }
};