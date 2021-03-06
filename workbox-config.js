module.exports = {
  globDirectory: 'gh-pages',
  globPatterns: [
    '**/*.{html,js,css,png,svg,jpg,gif,json,woff,woff2,eot,ico,webmanifest,map}',
  ],
  swDest: 'gh-pages/sw.js',
  sourcemap: false,
  clientsClaim: true,
  skipWaiting: true,
}
