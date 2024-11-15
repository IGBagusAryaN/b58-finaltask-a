module.exports = {
  content: [
    './src/views/**/*.hbs', // Pastikan ini mencakup file view yang benar
    './node_modules/flowbite/**/*.js', // Pastikan Flowbite juga terdaftar di content
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin'), // Pastikan Flowbite plugin ditambahkan
  ],
}
