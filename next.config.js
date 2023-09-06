/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com", // Allow clerk.com to post images on our nextjs app.
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
      },
      {
        protocol: "https",
        hostname: "uploadthing.com",
      },
    ],
    typescript: {
      ignoreBuildErrors: true,
    },
  },
};

module.exports = nextConfig;
