
/**
 * @type {import('next').NextConfig}
 */
 const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  experimental: { esmExternals: true },
 
}

const withTM = require('../unhashlabs/node_modules/next-transpile-modules')(['hashconnect'], {
  resolveSymlinks: false,
  debug: true,
}, ['framer-motion']);

module.exports = withTM({nextConfig});