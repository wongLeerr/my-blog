/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 图片资源白名单
  images: {
    domains:['10wallpaper.com'],
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
}

const removeImports = require('next-remove-imports')({
  options: { },
})

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})


module.exports = removeImports(withMDX(nextConfig))

