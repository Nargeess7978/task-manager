import "./globals.css";

export const metadata = {
  title: "Task Manager",
  description: "Create, track and organise your tasks",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
