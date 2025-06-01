'use client';

import { ChangeEvent, useRef, useState } from 'react';

import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { If } from '@/components/ui/if';
import { Separator } from '@/components/ui/separator';
import { useRestorationCodeEmail, useUpdatePassword } from '@/requests/auth';
import { useUpdateUserName } from '@/requests/user';
import { useAuthStore } from '@/store/auth.store';
import { useUserStore } from '@/store/user.store';

export default function Profile() {
  const [step, setStep] = useState<1 | 2>(1);
  const [newPassword, setNewPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<string>('');

  const router = useRouter();
  const { locale = 'en' } = useParams();
  const t = useTranslations('profile.profile');

  const usernameRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clear);
  const clear = useAuthStore((state) => state.clear);

  const { sendCode } = useRestorationCodeEmail();
  const { resetPassword } = useUpdatePassword();
  const { updateName } = useUpdateUserName();

  const handleSetNewPassword = (e: ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value);

  const handleUpdatePassword = async () => {
    if (step === 1) {
      setIsLoading('password');
      setStep(2);
      await sendCode({ email: user!.email });
      setIsLoading('');
    } else if (step === 2) {
      const code = codeRef.current?.value;
      if (!code) return;
      setIsLoading('password');
      setStep(1);
      await resetPassword({
        email: user!.email,
        code,
        password: newPassword,
      });
      setIsLoading('');
    }
  };

  const handleUpdateName = async () => {
    const newName = usernameRef.current?.value;
    if (!newName) return;
    setIsLoading('name');
    await updateName({
      id: user!.id,
      name: newName,
    });
    setIsLoading('');
  };

  const signOut = () => {
    clear();
    router.push('/' + locale + '/sign-in');
    clearUser();
  };

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.pageHeader}>
        <div style={styles.headerContent}>
          <div style={styles.avatarContainer}>
            <div style={styles.avatar}>
              <span style={styles.avatarText}>{user?.name?.charAt(0)?.toUpperCase() || '👤'}</span>
            </div>
            <div style={styles.statusDot}></div>
          </div>
          <div style={styles.headerText}>
            <h1 style={styles.pageTitle}>{t('title')}</h1>
            <p style={styles.pageDescription}>{t('description')}</p>
          </div>
        </div>
        <div style={styles.headerDecoration}></div>
      </div>

      <div style={styles.separator}></div>

      {/* Profile Card */}
      <Card style={styles.profileCard}>
        <CardHeader style={styles.cardHeader}>
          <div style={styles.cardHeaderContent}>
            <div style={styles.cardIconContainer}>
              <span style={styles.cardIcon}>⚙️</span>
            </div>
            <h2 style={styles.cardTitle}>{t('profile')}</h2>
          </div>
          <div style={styles.cardHeaderLine}></div>
        </CardHeader>

        <CardContent style={styles.cardContent}>
          {/* Username Section */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionIcon}>👤</span>
              <h3 style={styles.sectionTitle}>Personal Information</h3>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                <span style={styles.labelText}>{t('name')}</span>
                <div style={styles.inputContainer}>
                  <input
                    ref={usernameRef}
                    type='text'
                    placeholder={t('name-pl')}
                    defaultValue={user?.name}
                    style={styles.input}
                    onFocus={(e) => (e.target.style.borderColor = '#3B82F6')}
                    onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}
                  />
                  <div style={styles.inputIcon}>✏️</div>
                </div>
                <p style={styles.fieldDescription}>{t('name-description')}</p>
              </label>

              <button
                onClick={handleUpdateName}
                disabled={isLoading === 'name'}
                style={{
                  ...styles.primaryButton,
                  ...(isLoading === 'name' ? styles.buttonLoading : {}),
                }}
                onMouseEnter={(e) => {
                  if (isLoading !== 'name') {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (isLoading !== 'name') {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.2)';
                  }
                }}
              >
                {isLoading === 'name' ? (
                  <div style={styles.buttonContent}>
                    <div style={styles.spinner}></div>
                    Updating...
                  </div>
                ) : (
                  <div style={styles.buttonContent}>
                    <span>💾</span>
                    {t('button-username')}
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Password Section */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionIcon}>🔐</span>
              <h3 style={styles.sectionTitle}>Security Settings</h3>
            </div>

            <div style={styles.fieldGroup}>
              <If value={step === 1}>
                <label style={styles.label}>
                  <span style={styles.labelText}>{t('password')}</span>
                  <div style={styles.inputContainer}>
                    <input
                      type='password'
                      placeholder={t('password-pl')}
                      onChange={handleSetNewPassword}
                      style={styles.input}
                      onFocus={(e) => (e.target.style.borderColor = '#10B981')}
                      onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}
                    />
                    <div style={styles.inputIcon}>🔒</div>
                  </div>
                  <p style={styles.fieldDescription}>{t('password-description')}</p>
                </label>
              </If>

              <If value={step === 2}>
                <label style={styles.label}>
                  <span style={styles.labelText}>{t('code')}</span>
                  <div style={styles.inputContainer}>
                    <input
                      ref={codeRef}
                      type='password'
                      placeholder={t('code-pl')}
                      style={styles.input}
                      onFocus={(e) => (e.target.style.borderColor = '#F59E0B')}
                      onBlur={(e) => (e.target.style.borderColor = '#E5E7EB')}
                    />
                    <div style={styles.inputIcon}>🔑</div>
                  </div>
                  <p style={styles.fieldDescription}>{t('code-description')}</p>
                </label>
              </If>

              <button
                onClick={handleUpdatePassword}
                disabled={isLoading === 'password'}
                style={{
                  ...styles.secondaryButton,
                  ...(isLoading === 'password' ? styles.buttonLoading : {}),
                }}
                onMouseEnter={(e) => {
                  if (isLoading !== 'password') {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (isLoading !== 'password') {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.2)';
                  }
                }}
              >
                {isLoading === 'password' ? (
                  <div style={styles.buttonContent}>
                    <div style={styles.spinner}></div>
                    {step === 1 ? 'Sending...' : 'Updating...'}
                  </div>
                ) : (
                  <div style={styles.buttonContent}>
                    <span>{step === 1 ? '📧' : '🔐'}</span>
                    {t('button-password')}
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div style={styles.dangerSection}>
            <div style={styles.sectionHeader}>
              <span style={styles.sectionIcon}>⚠️</span>
              <h3 style={styles.dangerSectionTitle}>Danger Zone</h3>
            </div>

            <div style={styles.dangerZoneContent}>
              <div style={styles.dangerInfo}>
                <p style={styles.dangerText}>
                  Sign out from your account. You'll need to sign in again to access your data.
                </p>
              </div>

              <button
                onClick={signOut}
                style={styles.dangerButton}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.2)';
                }}
              >
                <div style={styles.buttonContent}>
                  <span>🚪</span>
                  {t('button-sign-out')}
                </div>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const styles = {
  container: {
    padding: '32px',
    maxWidth: '1400px',
    margin: '0 auto',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    minHeight: '100vh',
  },

  pageHeader: {
    position: 'relative' as const,
    background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
    borderRadius: '20px',
    padding: '32px',
    marginBottom: '24px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },

  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    position: 'relative' as const,
    zIndex: 2,
  },

  avatarContainer: {
    position: 'relative' as const,
  },

  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '20px',
    background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
  },

  avatarText: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#ffffff',
  },

  statusDot: {
    position: 'absolute' as const,
    top: '-4px',
    right: '-4px',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    border: '3px solid #ffffff',
    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
  },

  headerText: {
    flex: 1,
  },

  pageTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '8px',
  },

  pageDescription: {
    fontSize: '16px',
    color: '#64748b',
    lineHeight: '1.6',
  },

  headerDecoration: {
    position: 'absolute' as const,
    top: '-20px',
    right: '-20px',
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(29, 78, 216, 0.05) 100%)',
    filter: 'blur(20px)',
  },

  separator: {
    height: '2px',
    background: 'linear-gradient(90deg, transparent 0%, #e2e8f0 50%, transparent 100%)',
    marginBottom: '32px',
  },

  profileCard: {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },

  cardHeader: {
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    borderBottom: '1px solid #e2e8f0',
    padding: '24px 32px',
  },

  cardHeaderContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },

  cardIconContainer: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.2)',
  },

  cardIcon: {
    fontSize: '20px',
  },

  cardTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },

  cardHeaderLine: {
    height: '3px',
    background: 'linear-gradient(90deg, #3B82F6 0%, #1D4ED8 100%)',
    borderRadius: '2px',
    marginTop: '16px',
    width: '60px',
  },

  cardContent: {
    padding: '32px',
  },

  section: {
    marginBottom: '40px',
  },

  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
  },

  sectionIcon: {
    fontSize: '24px',
  },

  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1e293b',
  },

  dangerSectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#dc2626',
  },

  fieldGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },

  label: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },

  labelText: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151',
  },

  inputContainer: {
    position: 'relative' as const,
  },

  input: {
    width: '100%',
    padding: '16px 20px',
    paddingRight: '50px',
    fontSize: '16px',
    borderRadius: '12px',
    border: '2px solid #E5E7EB',
    background: '#ffffff',
    transition: 'all 0.2s ease',
    outline: 'none',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
  },

  inputIcon: {
    position: 'absolute' as const,
    right: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '18px',
    pointerEvents: 'none' as const,
  },

  fieldDescription: {
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: '1.5',
  },

  primaryButton: {
    background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    padding: '16px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '52px',
  },

  secondaryButton: {
    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    padding: '16px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '52px',
  },

  dangerButton: {
    background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    padding: '16px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 15px rgba(239, 68, 68, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '52px',
  },

  buttonLoading: {
    opacity: 0.7,
    cursor: 'not-allowed',
    transform: 'none !important',
  },

  buttonContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  spinner: {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid #ffffff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },

  dangerSection: {
    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(220, 38, 38, 0.02) 100%)',
    border: '1px solid rgba(239, 68, 68, 0.1)',
    borderRadius: '16px',
    padding: '24px',
  },

  dangerZoneContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '24px',
    flexWrap: 'wrap' as const,
  },

  dangerInfo: {
    flex: 1,
    minWidth: '200px',
  },

  dangerText: {
    fontSize: '14px',
    color: '#7f1d1d',
    lineHeight: '1.5',
  },
} as const;

// Add keyframes for spinner animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);
