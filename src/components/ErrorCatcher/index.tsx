import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'
import styles from './ErrorCatcher.module.css'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorCatcher extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unexpected rendering error:', error.message)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.wrapper}>
          <h2>Something went wrong.</h2>
          <button
            className={styles.button}
            onClick={() => { this.setState({ hasError: false }); window.location.href = '/' }}
          >
            Go Home
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorCatcher
