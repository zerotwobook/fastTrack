// Shared UI components — B owns (R1-B00).
// These are primitive building blocks; feature components import from here.
// All copy is in English; styles use CSS custom properties from global.css.

import { type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from 'react';
import styles from './components.module.css';

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------
export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  loading = false,
  disabled,
  children,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={[styles.btn, styles[`btn--${variant}`], className].filter(Boolean).join(' ')}
      disabled={disabled ?? loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <span className={styles.spinner} aria-hidden="true" /> : null}
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Field (label + input + optional helper/error)
// ---------------------------------------------------------------------------
interface FieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export function Field({ id, label, error, hint, children }: FieldProps) {
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel} htmlFor={id}>
        {label}
      </label>
      {children}
      {hint && !error ? (
        <span className={styles.fieldHint} id={`${id}-hint`}>
          {hint}
        </span>
      ) : null}
      {error ? (
        <span className={styles.fieldError} id={`${id}-error`} role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export function Input({ hasError, className, ...rest }: InputProps) {
  return (
    <input
      className={[styles.input, hasError ? styles['input--error'] : '', className]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    />
  );
}

// ---------------------------------------------------------------------------
// Textarea
// ---------------------------------------------------------------------------
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export function Textarea({ hasError, className, ...rest }: TextareaProps) {
  return (
    <textarea
      className={[styles.textarea, hasError ? styles['input--error'] : '', className]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    />
  );
}

// ---------------------------------------------------------------------------
// Status badge — text + icon only; no colour fill
// ---------------------------------------------------------------------------
export type StatusVariant = 'pending' | 'submitted' | 'overdue' | 'feedback';

const STATUS_LABELS: Record<StatusVariant, string> = {
  pending: 'Pending',
  submitted: 'Submitted',
  overdue: 'Overdue',
  feedback: 'Feedback available',
};

const STATUS_ICONS: Record<StatusVariant, string> = {
  pending: '○',
  submitted: '●',
  overdue: '✕',
  feedback: '◎',
};

interface StatusBadgeProps {
  status: StatusVariant;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={[styles.status, styles[`status--${status}`], className].filter(Boolean).join(' ')}
      aria-label={STATUS_LABELS[status]}
    >
      <span aria-hidden="true">{STATUS_ICONS[status]}</span>
      {STATUS_LABELS[status]}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Divider
// ---------------------------------------------------------------------------
export function Divider({ className }: { className?: string }) {
  return <hr className={[styles.divider, className].filter(Boolean).join(' ')} aria-hidden="true" />;
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------
interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className={styles.emptyState}>
      <p className={styles.emptyStateTitle}>{title}</p>
      {description ? <p className={styles.emptyStateDescription}>{description}</p> : null}
      {action ? <div className={styles.emptyStateAction}>{action}</div> : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Error message (inline, non-alert)
// ---------------------------------------------------------------------------
export function ErrorMessage({ message }: { message: string }) {
  return <p className={styles.errorMessage}>{message}</p>;
}

