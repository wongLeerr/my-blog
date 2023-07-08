/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 图片资源白名单
  images: {
    domains:['10wallpaper.com'],
  }
}

const removeImports = require('next-remove-imports')({
  options: { },
})


module.exports = removeImports(nextConfig)

