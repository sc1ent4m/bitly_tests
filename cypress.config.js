const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://api-ssl.bitly.com/v4/',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
