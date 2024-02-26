// "use client";

import BottomBar from "@/components/bottom-bar";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Providers } from "@/components/providers";
// import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import Script from "next/script";
import { Toaster } from "react-hot-toast";
import "swiper/css";
import "swiper/css/pagination";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <BottomBar />
          {children}
        </Providers>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              borderRadius: "90px",
              fontSize: "16px",
              fontWeight: "600",
              backgroundColor: "#000",
              color: "#FFF",
              maxWidth: "100%",
              textAlign: "center",
            },
          }}
        />
        <Footer />
      </body>

      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
    </html>
  );
}
