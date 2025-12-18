
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { FinanceProvider } from './context/FinanceContext';

// Production-Ready Error Guard (Simulation of Crashlytics runZonedGuarded)
interface ErrorGuardProps {
  children?: React.ReactNode;
}

interface ErrorGuardState {
  hasError: boolean;
}

class ErrorGuard extends React.Component<ErrorGuardProps, ErrorGuardState> {
  // Fix: Explicitly define props and state as class properties to ensure they are recognized by TS
  public props: ErrorGuardProps;
  public state: ErrorGuardState = { hasError: false };

  constructor(props: ErrorGuardProps) {
    super(props);
    // Fix: Manually assign props to instance if inheritance detection is failing
    this.props = props;
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("FATAL ERROR CAUGHT BY CRASHLYTICS:", error, errorInfo);
    // Here we would call: FirebaseCrashlytics.instance.recordError(error, stack);
  }

  render() {
    // Fix: access state and props which are now correctly typed and accessible in the render scope
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#F8F5F0] p-10 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center text-4xl mb-6">⚠️</div>
          <h1 className="text-2xl font-black text-black mb-2">Ops! Ocorreu um erro.</h1>
          <p className="text-gray-500 font-medium mb-8">Nossa equipe já foi notificada. Tente reiniciar o aplicativo.</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full h-16 bg-[#2952E3] text-white rounded-[24px] font-black"
          >
            REINICIAR APP
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Root element not found");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorGuard>
      <FinanceProvider>
        <App />
      </FinanceProvider>
    </ErrorGuard>
  </React.StrictMode>
);
