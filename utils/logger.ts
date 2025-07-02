export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

let LOG_LEVEL: LogLevel = (process.env.NEXT_PUBLIC_LOG_LEVEL as LogLevel) || 'info';

// Browser-specific logic for debug toggles
if (typeof window !== 'undefined') {
  const urlDebug = new URLSearchParams(window.location.search).has('debug');
  const local = window.localStorage.getItem('eco_dairy_bot_log_level') as LogLevel;
  
  if (urlDebug) {
    window.localStorage.setItem('eco_dairy_bot_log_level', 'debug');
    LOG_LEVEL = 'debug';
  } else if (local) {
    LOG_LEVEL = local;
  }
}

export { LOG_LEVEL };

export function log(level: LogLevel, ...data: unknown[]) {
  const order = { debug: 0, info: 1, warn: 2, error: 3 };
  if (order[level] < order[LOG_LEVEL]) return;
  
  // eslint-disable-next-line no-console
  console[level === 'debug' ? 'log' : level](...data);
}