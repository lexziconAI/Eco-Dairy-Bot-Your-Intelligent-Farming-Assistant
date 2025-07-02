import { useEffect } from 'react';
import { LOG_LEVEL, log } from '@/utils/logger';

export function useDebug(name: string, obj: unknown, deps: unknown[] = []) {
  useEffect(() => {
    if (LOG_LEVEL === 'debug') log('debug', `[${name}]`, obj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}