import React from 'react';
import { Home, RefreshCw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Bingo.io Error caught by boundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-white">
          <div className="text-center space-y-4 bg-white rounded-3xl border-4 border-[#0b2c4d] shadow-[0_8px_0_#08233d] p-7 sm:p-8 text-[#0b2c4d] max-w-sm w-full animate-pop">
            <div className="text-5xl animate-bounce">⚡</div>
            <h2 className="text-2xl font-black">Something went wrong</h2>
            <p className="text-slate-500 font-bold text-xs">
              Don't worry, your game state is safe. Let's get you back in action!
            </p>
            {this.state.error && (
              <div className="bg-rose-50 text-rose-700 font-mono text-[11px] p-2 rounded-xl border border-rose-200 text-left overflow-auto max-h-24 break-words">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}
            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full skribbl-btn-green py-2.5 rounded-2xl text-sm flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full skribbl-btn-blue py-2.5 rounded-2xl text-sm flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
