import React from 'react'
import type { ReactNode } from 'react'

type ErrorBoundaryProps = {
    fallback: ReactNode;
    children: ReactNode;
};

type ErrorBoundaryState = {
    hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
   constructor(props: ErrorBoundaryProps){
    super(props);
    this.state = {hasError: false}
   }

   static getDerivedStateFromError() {
    return { hasError: true}
   }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.log(error, errorInfo);
    }

    render(){
        if(this.state.hasError){
            return this.props.fallback
        }
        return this.props.children
    }
}

export default ErrorBoundary;