import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

export default function NotFound() {
  const { language } = useLanguage()

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
      <p style={{
        fontSize: 'clamp(4rem, 10vw, 8rem)',
        fontWeight: 400,
        lineHeight: 1,
        marginBottom: '16px',
        opacity: 0.15,
        letterSpacing: '0.05em',
      }}>
        404
      </p>
      <h1 style={{
        fontSize: 'clamp(1.25rem, 3vw, 2rem)',
        fontWeight: 400,
        marginBottom: '16px',
        letterSpacing: '0.1em',
      }}>
        {language === 'ja' ? 'ページが見つかりません' : 'Page Not Found'}
      </h1>
      <p style={{
        fontSize: 'clamp(0.875rem, 2vw, 1rem)',
        color: 'rgba(45, 45, 45, 0.7)',
        marginBottom: '32px',
        lineHeight: 1.6,
        maxWidth: '400px',
      }}>
        {language === 'ja'
          ? 'お探しのページは存在しないか、移動した可能性があります。'
          : 'The page you are looking for does not exist or may have been moved.'}
      </p>
      <Link
        to="/"
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
          textDecoration: 'none',
          minHeight: '44px',
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        {language === 'ja' ? 'トップへ戻る' : 'Back to Home'}
      </Link>
    </div>
  )
}
