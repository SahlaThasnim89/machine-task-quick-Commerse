import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./Providers";
import ReactQueryProvider from "@/utils/reactQuery";
import { SocketProvider } from "@/context/socketProvider";



const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] })

export const metadata = {
  title: "Quick",
  description: "Quick Commerce & Delivery Tracking ",
};


export default function RootLayout({ children }) {
  return (
  
      <html lang="en">
        <body suppressHydrationWarning className={`${outfit.className} antialiased text-gray-700`} >
          <AuthProvider>
          <Toaster />
          {/* <AppContextProvider> */}
            <ReactQueryProvider>
            <SocketProvider>
            {children}
            </SocketProvider>
            </ReactQueryProvider>
          {/* </AppContextProvider> */}
          </AuthProvider>
        </body>
      </html>
  );
}
