/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.offerboats.com',
        // 192.168.1.182:8090
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
      {
        protocol: 'https',
        hostname: 'offerboat-app-images.s3.us-east-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'offerboat-app-images.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  reactStrictMode: false,
}

module.exports = nextConfig
