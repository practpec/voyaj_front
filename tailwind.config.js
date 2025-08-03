/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // PALETA PRINCIPAL VOYAJ - Inspirada en la naturaleza
        sage: {
          50: '#f5f7f3',
          100: '#e8eee3', 
          200: '#d1dcc7',
          300: '#b4c5a3',
          400: '#9CAF88', // Color principal Verde Sage
          500: '#7d9968',
          600: '#617a51',
          700: '#4f6142',
          800: '#425037',
          900: '#39442f',
        },
        vanilla: {
          50: '#fefffe',
          100: '#fdfcfa',
          200: '#fbf8f2', 
          300: '#f8f3e7',
          400: '#F5F5DC', // Color acento Crema Vanilla
          500: '#f0ead1',
          600: '#e4d5b7',
          700: '#d4c097',
          800: '#c7ae82',
          900: '#b89968',
        },
        
        // COLORES SEMÁNTICOS PARA USO FÁCIL
        primary: '#9CAF88',           // sage.400
        'primary-hover': '#7d9968',   // sage.500
        'primary-dark': '#617a51',    // sage.600
        accent: '#F5F5DC',            // vanilla.400
        'accent-hover': '#f0ead1',    // vanilla.500
        
        // FONDOS
        background: '#FFFFFF',
        'background-alt': '#F7FAFC',  // gray.50 equivalente
        'background-soft': '#f5f7f3', // sage.50 para fondos muy sutiles
        
        // TEXTOS
        'text-default': '#1A202C',    // gray.800 equivalente
        'text-muted': '#718096',      // gray.600 equivalente
        'text-light': '#A0AEC0',      // gray.500 equivalente
        
        // BORDES Y LÍNEAS
        'border-default': '#E2E8F0',  // gray.200 equivalente
        'border-light': '#EDF2F7',    // gray.100 equivalente
        
        // ESTADOS DE INTERACCIÓN
        'focus-ring': '#9CAF88',      // sage.400 para anillos de enfoque
        'hover-bg': '#F7FAFC',        // Fondo hover sutil
        
        // GRISES EXTENDIDOS (manteniendo consistencia con Chakra)
        gray: {
          50: '#F7FAFC',
          100: '#EDF2F7',
          200: '#E2E8F0',
          300: '#CBD5E0',
          400: '#A0AEC0',
          500: '#718096',
          600: '#4A5568',
          700: '#2D3748',
          800: '#1A202C',
          900: '#171923',
        }
      },
      
      fontFamily: {
        // Fuente principal Inter para toda la aplicación
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
      },
      
      fontSize: {
        // Escala tipográfica adaptada de Chakra
        'xs': ['0.75rem', { lineHeight: '1rem' }],     // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }], // 14px  
        'base': ['1rem', { lineHeight: '1.5rem' }],    // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }], // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],  // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],     // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],  // 36px
        '5xl': ['3rem', { lineHeight: '1' }],          // 48px
      },
      
      spacing: {
        // Espaciado personalizado para coincidir con Chakra
        '18': '4.5rem',   // 72px
        '88': '22rem',    // 352px
        '128': '32rem',   // 512px
        '144': '36rem',   // 576px
      },
      
      borderRadius: {
        // Radios de borde que coinciden con el diseño Voyaj
        'xl': '0.75rem',   // 12px - Para tarjetas
        '2xl': '1rem',     // 16px - Para containers grandes
        '3xl': '1.5rem',   // 24px - Para elementos destacados
      },
      
      boxShadow: {
        // Sombras específicas del diseño Voyaj
        'soft': '0 2px 4px 0 rgb(0 0 0 / 0.05)',
        'card': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)',
        'elevated': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
        'hero': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)',
      },
      
      animation: {
        // Animaciones suaves para interacciones
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      
      // Breakpoints personalizados si es necesario
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px', 
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}