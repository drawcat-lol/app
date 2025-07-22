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
    devIndicators: {
        position: "bottom-right",
    },
};

export default nextConfig;
