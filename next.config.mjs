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
        hostname: 'offerboat-ap.....t-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'offerboat-...amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.go....tent.com',
      },
    ],
  },
  pageExtensions: ['tsx', 'js', 'ts', 'jsx'], 
}

export default nextConfig;
