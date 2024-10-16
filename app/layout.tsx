import { Inter as FontSans, Poppins } from "next/font/google"
import { cn } from "@/lib/utils"
import './globals.css'
import { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import Provider from "./Provider"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontPoppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: 'LiveDocs | Collaborative Editing Reimagined',
  description: 'Experience seamless real-time collaboration with LiveDocs - Your go-to editor for team productivity',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: { 
          colorPrimary: "#4F46E5",
          colorBackground: "#111827",
          colorText: "#F9FAFB",
          colorTextSecondary: "#9CA3AF",
          fontSize: '16px'
        },
      }}
    >
      <html lang="en" suppressHydrationWarning className={`${fontSans.variable} ${fontPoppins.variable}`}>
        <body
          className={cn(
            "min-h-screen font-sans antialiased bg-gradient-to-br from-gray-900 to-gray-800",
            fontSans.variable
          )}
        >
          <Provider>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  )
}
