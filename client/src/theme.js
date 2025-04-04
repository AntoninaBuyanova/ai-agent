// Custom theme configuration
const theme = {
  variant: "professional",
  primary: "hsl(271 91% 58%)",
  appearance: "light",
  radius: 0.5
};

// Apply theme to the document
export function applyTheme() {
  document.documentElement.style.setProperty('--theme-primary', theme.primary);
  document.documentElement.style.setProperty('--theme-radius', `${theme.radius}rem`);
  
  // Set the appearance
  if (theme.appearance === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  // Set the variant
  document.documentElement.setAttribute('data-theme-variant', theme.variant);
}

export default theme; 