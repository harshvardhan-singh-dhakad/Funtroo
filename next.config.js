/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async redirects() {
    return [
      { source: '/shop', has: [{ type: 'query', key: 'category', value: 'for-her' }], destination: '/sex-toys-for-women', permanent: true },
      { source: '/shop', has: [{ type: 'query', key: 'category', value: 'for-him' }], destination: '/sex-toys-for-men', permanent: true },
      { source: '/shop', has: [{ type: 'query', key: 'category', value: 'couples' }], destination: '/couples-sex-toys', permanent: true },
      { source: '/shop', has: [{ type: 'query', key: 'category', value: 'lubricants' }], destination: '/lubricants', permanent: true },
      { source: '/shop', has: [{ type: 'query', key: 'category', value: 'lingerie' }], destination: '/lingerie', permanent: true },
    ]
  },
}
module.exports = nextConfig
