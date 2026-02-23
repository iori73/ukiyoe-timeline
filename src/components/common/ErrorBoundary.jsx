import { Component } from 'react'

const MESSAGES = {
  ja: {
    title: 'エラーが発生しました',
    description: '申し訳ございません。予期しないエラーが発生しました。',
    action: 'ページをリロードしてお試しください。',
    button: 'ページをリロード',
  },
  en: {
    title: 'Something went wrong',
    description: 'We apologize for the inconvenience. An unexpected error occurred.',
    action: 'Please try reloading the page.',
    button: 'Reload Page',
  },
}

function detectLanguage() {
  const lang = navigator.language || navigator.userLanguage || 'ja'
  return lang.startsWith('ja') ? 'ja' : 'en'
}

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      const msg = MESSAGES[detectLanguage()]

      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100dvh',
          padding: '48px 24px',
          background: 'var(--washi, #f5f0e6)',
          color: 'var(--sumi-iro, #2d2d2d)',
          fontFamily: 'var(--font-serif, "Shippori Mincho", serif)',
          textAlign: 'center',
        }}>
          <h1 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: 400,
            marginBottom: '16px',
            letterSpacing: '0.1em',
          }}>
            {msg.title}
          </h1>
          <p style={{
            fontSize: 'clamp(0.875rem, 2vw, 1rem)',
            color: 'rgba(45, 45, 45, 0.7)',
            marginBottom: '32px',
            lineHeight: 1.6,
            maxWidth: '400px',
          }}>
            {msg.description}<br />
            {msg.action}
          </p>
          <button
            onClick={this.handleReload}
            style={{
              padding: '12px 32px',
              fontSize: '1rem',
              fontFamily: 'var(--font-sans)',
              border: '1px solid var(--sumi-iro, #2d2d2d)',
              background: 'transparent',
              color: 'var(--sumi-iro, #2d2d2d)',
              borderRadius: '4px',
              cursor: 'pointer',
              letterSpacing: '0.05em',
              minHeight: '44px',
              minWidth: '44px',
            }}
          >
            {msg.button}
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
