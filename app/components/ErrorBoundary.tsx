'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import Sticker from './Sticker'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex items-center justify-center min-h-screen p-6">
          <div className="card p-8 max-w-md w-full text-center">
            <div className="flex justify-center mb-4">
              <Sticker name="error" size={100} />
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="btn-secondary flex-1"
              >
                Try again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="btn-primary flex-1"
              >
                Go home
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
