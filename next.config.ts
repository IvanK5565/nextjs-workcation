import type { NextConfig } from "next";
import { i18n } from './next-i18next.config'

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // i18n:{
  //   locales:['en-US','ua'],
  //   defaultLocale: 'ua'
  // }
  i18n
};

export default nextConfig;
