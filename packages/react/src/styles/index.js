export const getColors = (isDark, designConfig) => {
  const { lightThemeConfig, darkThemeConfig } = designConfig || {}
  const { background, foreground, primary, secondary, borderColor } = lightThemeConfig || {}
  const { darkBackground, darkForeground, darkPrimary, darkSecondary, darkBorderColor } = darkThemeConfig || {}
  return isDark
    ? {
        brand,
        background: darkBackground ?? '#09090B',
        foreground: darkForeground ?? '#FAFAFA',
        muted: darkSecondary ?? '#27272A',
        mutedForeground: '#A1A1AA',
        border: darkBorderColor ?? '#27272A',
        input: darkBorderColor ?? '#27272A',
        primary: darkPrimary ?? '#FAFAFA',
        secondary: darkSecondary ?? '#27272A',
        destructive: '#7F1D1D',
        ring: '#27272A',
        radius: '8px',
      }
    : {
        brand,
        background: background ?? '#FFFFFF',
        foreground: foreground ?? '#09090B',
        muted: secondary ?? '#F4F4F5', // gray 300 - 400
        mutedForeground: '#71717A',
        border: borderColor ?? '#18181B', // thick border
        input: borderColor ?? '#E4E4E7', // normal border
        primary: primary ?? '#18181B',
        secondary: secondary ?? '#F4F4F5',
        destructive: '#EF4444',
        ring: '#A1A1AA',
        radius: '8px',
      }
}
export const colors = {
  background: '#FFFFFF',
  foreground: '#09090B',
  muted: '#F4F4F5', // gray 300 - 400
  mutedForeground: '#71717A',
  border: '#18181B', // thick border
  input: '#E4E4E7', // normal border
  primary: '#18181B',
  secondary: '#F4F4F5',
  destructive: '#EF4444',
  ring: '#A1A1AA',
  radius: '8px',

  brand: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
    950: '#09090b',
  },

  gray: {
    50: '#ffffff',
    100: '#ffffff',
    200: '#ffffff',
    300: '#ffffff',
    400: '#ffffff',
    500: '#ffffff',
    600: '#ffffff',
    700: '#ffffff',
    800: '#ffffff',
    900: '#ffffff',
    950: '#ffffff',
  },
}

export const darkColors = {
  background: '#09090B',
  foreground: '#FAFAFA',
  muted: '#27272A',
  mutedForeground: '#A1A1AA',
  border: '#27272A',
  input: '#27272A',
  primary: '#FAFAFA',
  secondary: '#27272A',
  destructive: '#7F1D1D',
  ring: '#27272A',
  radius: '8px',

  brand: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
    950: '#09090b',
  },
}

const brand = {
  50: '#fafafa',
  100: '#f4f4f5',
  200: '#e4e4e7',
  300: '#d4d4d8',
  400: '#a1a1aa',
  500: '#71717a',
  600: '#52525b',
  700: '#3f3f46',
  800: '#27272a',
  900: '#18181b',
  950: '#09090b',
}
