import React from 'react';
import { Extendable } from '../../types';
import ErrorPage from '../../pages/ErrorPage';

export type ErrorBoundaryProps = Extendable & {
  onError?: (error: Error, info: any) => void;
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  state: { error: Error | undefined };
  constructor(props: any) {
    super(props);
    this.state = { error: undefined };
  }

  componentDidCatch(error: Error, info: any) {
    // Display fallback UI
    this.setState({ error: error });
    // You can also log the error to an error reporting service
    console.error('---ErrorBoundary catch:', error, info);
    this.props.onError?.(error, info);
  }

  render() {
    if (this.state.error) {
      // You can render any custom fallback UI
      return <ErrorPage error={this.state.error} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
