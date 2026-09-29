import './globals.css';
export const metadata = {
  title: 'Replyroom — Think before you reply',
  description: 'Conversation guidance grounded in your reading.',
};

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
