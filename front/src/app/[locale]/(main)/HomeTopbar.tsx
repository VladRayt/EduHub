'use client';

import * as React from 'react';
import { useState } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

export function HomeTopbar() {
  const { locale = 'en' } = useParams();
  const pathname = usePathname();
  const t = useTranslations('top-bar');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navItems = [
    {
      key: 'organizations',
      href: `/${locale}/home`,
      label: t('organizations'),
      icon: '🏢',
      description: 'Manage your organizations',
    },
    {
      key: 'progress',
      href: `/${locale}/progress`,
      label: t('progress'),
      icon: '📊',
      description: 'Track your achievements',
    },
    {
      key: 'settings',
      href: `/${locale}/settings/profile`,
      label: t('settings'),
      icon: '⚙️',
      description: 'Customize your experience',
    },
  ];

  const isActiveItem = (href: string) => {
    if (href.includes('/home')) {
      return pathname === href || pathname === `/${locale}`;
    }
    return pathname.startsWith(href);
  };

  return (
    <div style={styles.container}>
      <div style={styles.background}></div>
      <div style={styles.glowEffect}></div>

      <NavigationMenu style={styles.navigationMenu}>
        <NavigationMenuList style={styles.navigationList}>
          {navItems.map((item) => {
            const isActive = isActiveItem(item.href);
            const isHovered = hoveredItem === item.key;

            return (
              <NavigationMenuItem key={item.key} style={styles.navigationItem}>
                <Link href={item.href} legacyBehavior passHref>
                  <NavigationMenuLink
                    style={{
                      ...styles.navigationLink,
                      ...(isActive ? styles.navigationLinkActive : {}),
                      ...(isHovered ? styles.navigationLinkHover : {}),
                    }}
                    onMouseEnter={() => setHoveredItem(item.key)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <div style={styles.linkContent}>
                      <div
                        style={{
                          ...styles.iconContainer,
                          ...(isActive ? styles.iconContainerActive : {}),
                          ...(isHovered ? styles.iconContainerHover : {}),
                        }}
                      >
                        <span style={styles.icon}>{item.icon}</span>
                      </div>

                      <div style={styles.textContainer}>
                        <span
                          style={{
                            ...styles.linkText,
                            ...(isActive ? styles.linkTextActive : {}),
                          }}
                        >
                          {item.label}
                        </span>

                        {(isHovered || isActive) && (
                          <span style={styles.description}>{item.description}</span>
                        )}
                      </div>

                      {isActive && (
                        <div style={styles.activeIndicator}>
                          <span style={styles.checkmark}>✓</span>
                        </div>
                      )}
                    </div>

                    {/* Animated underline */}
                    <div
                      style={{
                        ...styles.underline,
                        ...(isActive ? styles.underlineActive : {}),
                        ...(isHovered ? styles.underlineHover : {}),
                      }}
                    ></div>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>

        {/* Logo/Brand Section */}
        <div style={styles.brandSection}>
          <div style={styles.logoContainer}>
            <span style={styles.logo}>🎓</span>
          </div>
          <div style={styles.brandText}>
            <span style={styles.brandName}>EduHub</span>
            <span style={styles.brandTagline}>Learn & Grow</span>
          </div>
        </div>
      </NavigationMenu>

      {/* Decorative elements */}
      <div style={styles.decorativeOrb1}></div>
      <div style={styles.decorativeOrb2}></div>
      <div style={styles.decorativeOrb3}></div>
    </div>
  );
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className
            )}
            {...props}
          >
            <div className='text-sm font-medium leading-none'>{title}</div>
            <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = 'ListItem';

const styles = {
  container: {
    position: 'relative' as const,
    width: '100%',
    background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
    borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
    overflow: 'hidden',
    minHeight: '80px',
  },

  background: {
    position: 'absolute' as const,
    inset: 0,
    background: 'radial-gradient(ellipse at top, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
    pointerEvents: 'none' as const,
  },

  glowEffect: {
    position: 'absolute' as const,
    top: 0,
    left: '50%',
    width: '200%',
    height: '2px',
    background:
      'linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.6) 50%, transparent 100%)',
    transform: 'translateX(-50%)',
  },

  navigationMenu: {
    position: 'relative' as const,
    zIndex: 10,
    maxWidth: 'none',
    width: '100%',
    padding: '0',
    background: 'transparent',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '2rem',
    paddingRight: '2rem',
    paddingTop: '1rem',
    paddingBottom: '1rem',
  },

  navigationList: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },

  navigationItem: {
    position: 'relative' as const,
  },

  navigationLink: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    padding: '0.75rem 1.5rem',
    borderRadius: '16px',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#CBD5E1',
    textDecoration: 'none',
    position: 'relative' as const,
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    minWidth: '140px',
    cursor: 'pointer',
  },

  navigationLinkActive: {
    background: 'rgba(59, 130, 246, 0.2)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    color: '#FFFFFF',
    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
  },

  navigationLinkHover: {
    background: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
  },

  linkContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    width: '100%',
    position: 'relative' as const,
    zIndex: 2,
  },

  iconContainer: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    flexShrink: 0,
  },

  iconContainerActive: {
    background: 'rgba(59, 130, 246, 0.3)',
    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4)',
  },

  iconContainerHover: {
    background: 'rgba(255, 255, 255, 0.2)',
    transform: 'scale(1.1)',
  },

  icon: {
    fontSize: '20px',
    display: 'block',
  },

  textContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start',
    flex: 1,
    gap: '2px',
  },

  linkText: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'inherit',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap' as const,
  },

  linkTextActive: {
    color: '#FFFFFF',
    textShadow: '0 2px 8px rgba(59, 130, 246, 0.5)',
  },

  description: {
    fontSize: '11px',
    color: 'rgba(203, 213, 225, 0.7)',
    fontWeight: '400',
    animation: 'fadeInUp 0.3s ease-out',
    whiteSpace: 'nowrap' as const,
  },

  activeIndicator: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
    flexShrink: 0,
  },

  checkmark: {
    fontSize: '12px',
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  underline: {
    position: 'absolute' as const,
    bottom: '0',
    left: '50%',
    width: '0%',
    height: '2px',
    background: 'linear-gradient(90deg, #3B82F6 0%, #1D4ED8 100%)',
    borderRadius: '1px',
    transition: 'all 0.3s ease',
    transform: 'translateX(-50%)',
  },

  underlineActive: {
    width: '80%',
  },

  underlineHover: {
    width: '60%',
    background:
      'linear-gradient(90deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.8) 100%)',
  },

  brandSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0.5rem',
  },

  logoContainer: {
    width: '48px',
    height: '48px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.4)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
  },

  logo: {
    fontSize: '24px',
    color: '#FFFFFF',
  },

  brandText: {
    display: 'flex',
    flexDirection: 'column' as const,
  },

  brandName: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: '1.2',
  },

  brandTagline: {
    fontSize: '11px',
    color: 'rgba(203, 213, 225, 0.8)',
    fontWeight: '400',
  },

  decorativeOrb1: {
    position: 'absolute' as const,
    top: '-20px',
    left: '10%',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
    filter: 'blur(15px)',
    animation: 'float 6s ease-in-out infinite',
  },

  decorativeOrb2: {
    position: 'absolute' as const,
    bottom: '-15px',
    right: '20%',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, transparent 70%)',
    filter: 'blur(10px)',
    animation: 'float 8s ease-in-out infinite reverse',
  },

  decorativeOrb3: {
    position: 'absolute' as const,
    top: '50%',
    right: '5%',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(245, 158, 11, 0.5) 0%, transparent 70%)',
    filter: 'blur(8px)',
    animation: 'float 10s ease-in-out infinite',
  },
} as const;

// Add keyframes for animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`;
document.head.appendChild(styleSheet);
