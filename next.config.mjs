/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['lh3.googleusercontent.com'],
    },
    webpack: (config, _) => ({
        ...config,
        watchOptions: {
            ...config.watchOptions,
            poll: 200,
            aggregateTimeout: 200,
        },
    }),
    experimental: {
        serverComponentsExternalPackages: ['typeorm'],
    },
};

export default nextConfig;
