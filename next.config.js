/** @type {import('next').NextConfig} */
import pwa from "next-pwa";

const withPWA = pwa({
	dest: "public",
});

const nextConfig = withPWA({
	experimental: {
	  instrumentationHook: true,
	},
  });
export default nextConfig;
