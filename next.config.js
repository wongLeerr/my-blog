/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

const removeImports = require('next-remove-imports')({
  options: { },
})


module.exports = removeImports(nextConfig)

