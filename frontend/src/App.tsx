import React, { useState } from "react";
import MediaUpload from "./components/MediaUpload";
import MediaList from "./components/MediaList";
import "./index.css";

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="error-message">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  );
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error!} />;
    }
    return this.props.children;
  }
}

export default function App() {
  const [refresh, setRefresh] = useState(0);

  return (
    <ErrorBoundary>
      <div className="container">
        <header className="header">
          <h1>MINLY</h1>
        </header>
        <main>
          <MediaList key={refresh} />
          <MediaUpload onUploadSuccess={() => setRefresh((r) => r + 1)} />
        </main>
      </div>
    </ErrorBoundary>
  );
}
