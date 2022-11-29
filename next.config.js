/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['https://cdn.discordapp.com', 'cdn.discordapp.com']
  }
}

module.exports = nextConfig
