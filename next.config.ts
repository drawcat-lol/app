import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "xuxluveicgluyscadmqm.supabase.co",
            },
        ],
    },
};

export default nextConfig;
