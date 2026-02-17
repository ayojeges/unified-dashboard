// Simple HTML redirect page
export default function DashboardPage() {
  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content="0; url=/" />
        <title>Redirecting to Dashboard</title>
      </head>
      <body>
        <p>Redirecting to <a href="/">dashboard</a>...</p>
      </body>
    </html>
  );
}