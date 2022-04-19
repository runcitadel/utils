import * as process from 'node:process';
import {URL} from 'node:url';
import type {Context} from 'koa';

const corsOptions = {
  origin: (ctx: Context): string => {
    if (process.env.UNSAFE_REMOVE_CORS_CHECK) {
      return '*';
    }
    const origin =
      ctx.headers.origin ?? ctx.request.headers.origin ?? ctx.origin;
    const allowList = [
      'http://localhost',
      'http://umbrel.local',
      ...(process.env.DEVICE_HOSTS ? process.env.DEVICE_HOSTS.split(',') : []),
    ];

    // Allowlist, but URL.parse every element, and only get the domain
    const allowedDomains = [];
    let url: string;
    for (url of allowList) {
      const parsed = new URL(url);
      allowedDomains.push(parsed.hostname);
    }

    if (!process.env.SAFE_MODE) {
      try {
        const parsed = new URL(origin);
        if (allowedDomains.includes(parsed.hostname)) {
          return parsed.origin;
        }
      } catch {
        if (!origin) return '*';
      }
    }

    if (allowList.includes(origin)) return origin;

    ctx.throw('Not allowed by CORS');
  },
};

export default corsOptions;
