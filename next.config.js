/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ["mongoose"], // Allow rendering Mongoose actions.
  },
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
      {
        protocol: "https",
        hostname: "utfs.io", // Allow cloud.mongodb.com to post images on our nextjs app.
      },
    ],
  },
};

module.exports = nextConfig;
