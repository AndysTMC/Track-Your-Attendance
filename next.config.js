/** @type {import('next').NextConfig} */
import pwa from 'next-pwa';

const withPWA = pwa({
    dest: 'public',
});

const nextConfig = withPWA({
    reactStrictMode: true
});

// const nextConfig = {
//     serverExternalPackages: ['tesseract.js'],
// };

export default nextConfig;
