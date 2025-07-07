import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import './styles.css';

// Add error boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#fee', 
          color: '#c00',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap'
        }}>
          <h2>Something went wrong!</h2>
          <p>Error: {this.state.error?.message}</p>
          <p>Stack: {this.state.error?.stack}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Check if in development
console.log('Starting React app...');

const container = document.getElementById('root');
if (!container) {
  console.error('Root element not found! Make sure you have <div id="root"></div> in your HTML');
} else {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
  console.log('React app rendered successfully');
}