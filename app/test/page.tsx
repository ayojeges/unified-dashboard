export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">✅ Unified Dashboard is Running!</h1>
        <p className="text-xl text-muted-foreground">
          The application is successfully running on localhost:3001
        </p>
        <div className="space-y-2">
          <p className="font-medium">Available Routes:</p>
          <ul className="space-y-1">
            <li>• <a href="/auth/login" className="text-primary hover:underline">/auth/login</a> - Login page</li>
            <li>• <a href="/auth/register" className="text-primary hover:underline">/auth/register</a> - Register page</li>
            <li>• <a href="/dashboard" className="text-primary hover:underline">/dashboard</a> - Main dashboard</li>
            <li>• <a href="/projects" className="text-primary hover:underline">/projects</a> - Project management</li>
            <li>• <a href="/projects/kanban" className="text-primary hover:underline">/projects/kanban</a> - Kanban board</li>
            <li>• <a href="/audio" className="text-primary hover:underline">/audio</a> - Audio recorder</li>
            <li>• <a href="/analytics" className="text-primary hover:underline">/analytics</a> - Analytics dashboard</li>
            <li>• <a href="/calendar" className="text-primary hover:underline">/calendar</a> - Team calendar</li>
            <li>• <a href="/chat" className="text-primary hover:underline">/chat</a> - Team chat</li>
            <li>• <a href="/settings" className="text-primary hover:underline">/settings</a> - Settings panel</li>
          </ul>
        </div>
      </div>
    </div>
  );
}