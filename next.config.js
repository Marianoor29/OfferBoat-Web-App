/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.offerboats.com',
      },
      {
        protocol: 'https',
        hostname: 'images.myguide-cdn.com',
      },
      {
        protocol: 'https',
        hostname: 'classycartagena.com',
      },
      {
        protocol: 'https',
        hostname: 'www.shutterstock.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      },
    ],
  },
  reactStrictMode: true,
}

module.exports = nextConfig
