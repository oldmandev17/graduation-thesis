/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        secondary: '#8696a0',
        'teal-light': '#7ae3c3',
        'photopicker-overlay-background': 'rgba(30,42,49,0.8)',
        'dropdown-background': '#233138',
        'dropdown-background-hover': '#182229',
        'input-background': ' #2a3942',
        'primary-strong': '#020617',
        'panel-header-background': '#fff',
        'panel-header-icon': '#aebac1',
        'icon-lighter': '#8696a0',
        'icon-green': '#00a884',
        'search-input-container-background': '#fff',
        'conversation-border': 'rgba(134,150,160,0.15)',
        'conversation-panel-background': '#fff',
        'background-default-hover': '#fff',
        'incoming-background': '#e5e7eb',
        'outgoing-background': '#2563eb',
        'bubble-meta': 'hsla(0,0%,100%,0.6)',
        'icon-ack': '#53bdeb'
      },
      gridTemplateColumns: {
        main: '1fr 3fr'
      }
    }
  },
  plugins: []
}
