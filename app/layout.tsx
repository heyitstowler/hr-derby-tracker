import '../styles/globals.css'

export const metadata = {
  title: 'Home',
  description: 'Welcome to HR Derby',
};


export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}