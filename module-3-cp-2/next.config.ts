 import type { NextConfig } from 'next';
 import withBundleAnalyzer from '@next/bundle-analyzer';

 const nextConfig: NextConfig = {
   // your existing config...
   experimental: {
     // Matikan auto-upgrade bawaan `next build` supaya build tidak
     // mencoba konek ke npm registry (penyebab error ECONNRESET saat build).
     agentUpgrade: false,
   },
 };

 const withAnalyzer = withBundleAnalyzer({
   enabled: process.env.ANALYZE === 'true',
 });

 export default withAnalyzer(nextConfig);
