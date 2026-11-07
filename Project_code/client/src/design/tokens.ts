/* fastTrack design tokens — B owns (R1-B00).
 * Import this file in any component that needs colours, typography or spacing.
 * Decisions: DEC-08 (black/white/grey theme), DEC-10 (Inter + Noto Sans Thai, weight 500 headings).
 */

/** Colour palette — monochrome with single semantic levels */
export const colors = {
  /** Main page/card background */
  paper: '#FFFFFF',
  /** Primary text, icons and borders */
  ink: '#000000',
  /** Subtle background for rows, panels and hover states */
  wash: '#F5F5F5',
  /** Dividers and input borders */
  divider: '#E5E5E5',
  /** Secondary/muted text (placeholder, caption, helper) */
  muted: '#595959',
  /** Control labels, icon-only buttons and disabled states */
  control: '#8A8A8A',
} as const;

export type ColorKey = keyof typeof colors;

/** Typography — Inter as primary, Noto Sans Thai for Thai text */
export const typography = {
  fontFamily: 'Inter, "Noto Sans Thai", Tahoma, sans-serif',
  /** Heading weight — 500 (medium) for a clean, slide-like appearance */
  headingWeight: 500,
  bodyWeight: 400,
  /** Scale in rem */
  scale: {
    xs: '0.75rem',   // 12px — captions, helper text
    sm: '0.875rem',  // 14px — secondary body, labels
    base: '1rem',    // 16px — primary body
    lg: '1.125rem',  // 18px — sub-headings
    xl: '1.25rem',   // 20px — section headings
    '2xl': '1.5rem', // 24px — page headings
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
} as const;

/** Spacing — 4px base unit */
export const spacing = {
  '0': '0',
  '1': '0.25rem',  // 4px
  '2': '0.5rem',   // 8px
  '3': '0.75rem',  // 12px
  '4': '1rem',     // 16px
  '5': '1.25rem',  // 20px
  '6': '1.5rem',   // 24px
  '8': '2rem',     // 32px
  '10': '2.5rem',  // 40px
  '12': '3rem',    // 48px
  '16': '4rem',    // 64px
} as const;

/** Border radius — restrained; only interactive elements are rounded */
export const radius = {
  sm: '4px',
  md: '8px',
  panel: '12px',
  full: '9999px',
} as const;

/** CSS custom-property declarations — inject at :root for global access */
export const cssVariables = `
  --color-paper: ${colors.paper};
  --color-ink: ${colors.ink};
  --color-wash: ${colors.wash};
  --color-divider: ${colors.divider};
  --color-muted: ${colors.muted};
  --color-control: ${colors.control};
  --font-family: ${typography.fontFamily};
  --font-weight-heading: ${typography.headingWeight};
  --font-weight-body: ${typography.bodyWeight};
`.trim();

