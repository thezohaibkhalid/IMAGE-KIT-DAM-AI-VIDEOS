import { SessionProvider } from "next-auth/react";
import { ImageKitProvider } from "@imagekit/next";
export default function Providers({ children }: { children: React.ReactNode }) {
  const urlEndPoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
  return (
    <SessionProvider refetchInterval={5 * 60}>
      <ImageKitProvider urlEndPoint={urlEndPoint}>{children}</ImageKitProvider>
    </SessionProvider>
  );
}
