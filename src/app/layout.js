"use client";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const noNavRoutes = ["/login", "/register"];
  const showNavbar = !noNavRoutes.includes(pathname);

  return (
    <html lang="en">
      <body className="bg-white text-black antialiased font-sans">
        {showNavbar && <Navbar />}
        <main>{children}</main>
      </body>
    </html>
  );
}