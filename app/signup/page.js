// Simple HTML redirect page
export default function SignupPage() {
  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content="0; url=/auth/register" />
        <title>Redirecting to Signup</title>
      </head>
      <body>
        <p>Redirecting to <a href="/auth/register">signup page</a>...</p>
      </body>
    </html>
  );
}