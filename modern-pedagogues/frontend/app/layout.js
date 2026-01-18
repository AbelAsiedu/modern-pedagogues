export const metadata = {
  title: 'The Modern Pedagogues',
  description: 'Optional frontend preview for The Modern Pedagogues.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'Arial, sans-serif', margin: 0 }}>{children}</body>
    </html>
  );
}
