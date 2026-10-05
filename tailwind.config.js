/** @type {import('tailwindcss').Config} */
module.exports = {
  // Onde o Tailwind deve procurar classes. Todo o nosso código fica em src/.
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  // O preset do NativeWind adapta o Tailwind para o React Native.
  presets: [require('nativewind/preset')],
  theme: {
    // Na Aula 2.4, colocaremos aqui as cores e tamanhos do nosso app.
    extend: {},
  },
  plugins: [],
};