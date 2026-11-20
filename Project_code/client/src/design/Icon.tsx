const artwork = {
  brand: <><path d="m5 16 7-8 7 3" /><circle cx="5" cy="16" r="2" fill="currentColor" /><circle cx="12" cy="8" r="2" fill="currentColor" /><circle cx="19" cy="11" r="2" fill="currentColor" /></>,
  overview: <><rect x="3" y="3" width="7" height="7" rx="1.2" /><rect x="14" y="3" width="7" height="7" rx="1.2" /><rect x="3" y="14" width="7" height="7" rx="1.2" /><rect x="14" y="14" width="7" height="7" rx="1.2" /></>,
  team: <><circle cx="9" cy="8" r="3" /><path d="M3 19v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1M16 5.2a3 3 0 0 1 0 5.6m1.5 2.7A4 4 0 0 1 21 18v1" /></>,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  signOut: <path d="M11 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6m4-12 4 4-4 4m-6-4h13" />,
  arrowRight: <path d="M4 12h15m-6-6 6 6-6 6" />,
  external: <path d="M13 4h7v7m0-7-9 9m-2-8H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3" />,
  plus: <path d="M12 5v14M5 12h14" />,
  settings: <><path d="M4 7h16M4 17h16" /><circle cx="9" cy="7" r="2" fill="var(--icon-surface, white)" /><circle cx="15" cy="17" r="2" fill="var(--icon-surface, white)" /></>,
  chart: <path d="M4 4v16h16M9 15l4-5 3 2 4-6" />,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4m10-4v4M3 10h18m-13 5h2m4 0h2" /></>,
  user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1" /></>,
  send: <path d="m3 10 18-7-7 18-3.5-7.5L3 10Zm7.5 3.5L21 3" />,
  refresh: <path d="M20 10a8 8 0 0 0-14-4L3 9m0-5v5h5m-4 5a8 8 0 0 0 14 4l3-3m0 5v-5h-5" />,
  history: <path d="M4 12a8 8 0 1 1 2.2 5.5M4 7v5h5m3-4v5l3 2" />,
  feedback: <path d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-6 4V6a2 2 0 0 1 2-2Zm3 5h8m-8 4h5" />,
  check: <path d="m5 12 4 4L19 6" />,
} as const;

export function Icon({ name, size = 20 }: { name: keyof typeof artwork; size?: number }) {
  return <svg className="ui-icon" width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {artwork[name]}
  </svg>;
}
