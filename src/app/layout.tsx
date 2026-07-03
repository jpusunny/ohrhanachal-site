import type { Metadata } from "next";
import "./globals.css";
import CartProvider from "@/components/CartProvider";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: {
    default: "Ohr Hanachal — Authentic Breslev Seforim, Direct From the Publisher",
    template: "%s — Ohr Hanachal",
  },
  description:
    "Breslev seforim in lashon kodesh, printed and bound in-house — Likutei Moharan, Likutei Halachos, Sipurei Maasiyos, sets, pocket, and leather editions.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,600&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Frank+Ruhl+Libre:wght@500;700;900&family=Inter:wght@500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}
