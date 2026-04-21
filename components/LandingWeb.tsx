import { View } from 'react-native';
import { useRouter } from 'expo-router';

const features = [
  'Learn 20+ Coins',
  'AI Deep Dive',
  'Portfolio Tracker',
  'Daily Challenges',
  'Community',
  'Events Calendar',
];

export default function LandingWeb() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <div style={{
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
        padding: '0 24px',
        textAlign: 'center',
      }}>

        {/* Logo mark */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(143,190,126,0.08)',
          border: '1px solid rgba(143,190,126,0.25)',
          borderRadius: 100,
          padding: '8px 20px',
          marginBottom: 40,
        }}>
          <div style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: '#8fbe7e',
            boxShadow: '0 0 8px rgba(143,190,126,0.7)',
          }} />
          <span style={{
            fontSize: 12,
            fontWeight: 700,
            color: '#8fbe7e',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}>
            Cryptoverse
          </span>
        </div>

        {/* Eyebrow */}
        <p style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.2em',
          color: 'rgba(143,190,126,0.55)',
          margin: '0 0 20px',
          textTransform: 'uppercase',
        }}>
          What we offer
        </p>

        {/* Main heading */}
        <h1 style={{
          fontFamily: "'Georgia', 'Times New Roman', serif",
          fontSize: 'clamp(44px, 7vw, 86px)',
          fontWeight: 400,
          fontStyle: 'italic',
          color: '#8fbe7e',
          margin: '0 0 22px',
          lineHeight: 1.1,
          letterSpacing: '-0.01em',
          maxWidth: 680,
          textShadow: '0 0 60px rgba(143,190,126,0.15)',
        }}>
          Your Crypto<br />
          Journey Starts Here.
        </h1>

        {/* Description */}
        <p style={{
          fontSize: 'clamp(14px, 1.6vw, 17px)',
          color: 'rgba(143,190,126,0.65)',
          margin: '0 0 44px',
          maxWidth: 460,
          lineHeight: 1.75,
          fontWeight: 300,
        }}>
          Comprehensive, AI-powered learning at every stage of your crypto
          education. Tailored to your pace, your goals, and your portfolio.
        </p>

        {/* Feature pills */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 9,
          justifyContent: 'center',
          marginBottom: 52,
          maxWidth: 540,
        }}>
          {features.map(f => (
            <div key={f} style={{
              padding: '7px 16px',
              border: '1px solid rgba(143,190,126,0.25)',
              borderRadius: 100,
              fontSize: 12.5,
              fontWeight: 500,
              color: 'rgba(143,190,126,0.75)',
              background: 'rgba(143,190,126,0.04)',
              letterSpacing: '0.02em',
            }}>
              {f}
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => router.push('/(tabs)/learn')}
            style={{
              padding: '13px 32px',
              background: '#8fbe7e',
              color: '#060e06',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.03em',
              boxShadow: '0 0 24px rgba(143,190,126,0.3)',
            }}
          >
            Get Started Free
          </button>
          <button
            onClick={() => router.push('/roadmap')}
            style={{
              padding: '13px 32px',
              background: 'rgba(143,190,126,0.05)',
              color: 'rgba(143,190,126,0.75)',
              border: '1px solid rgba(143,190,126,0.25)',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              letterSpacing: '0.02em',
            }}
          >
            View Roadmap
          </button>
        </div>

      </div>
    </View>
  );
}
