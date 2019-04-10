module.exports = {
  "globDirectory": "./",
  "importWorkboxFrom": "local",
  "globIgnores": [
    "node_modules/**/**",
    "pachage",
    "workbox-config.js",
    "images/**/*"
  ],
  "globPatterns": [
    "**/*.{json,jpg,html,js,css,md}"
  ],
  "swDest": "service-worker.js"
};