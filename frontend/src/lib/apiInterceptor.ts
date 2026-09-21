// Global API Fetch Interceptor for Render Cold Start Monitoring
let activeLongRequests = 0;
let listeners: Array<(waking: boolean) => void> = [];

const notify = (waking: boolean) => {
  listeners.forEach((l) => {
    try {
      l(waking);
    } catch (e) {
      console.error('Error executing waking listener', e);
    }
  });
};

export const subscribeToWakingState = (listener: (waking: boolean) => void) => {
  listeners.push(listener);
  // If there's already an active long request, immediately notify new subscribers
  if (activeLongRequests > 0) {
    listener(true);
  }
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
};

const originalFetch = window.fetch;

window.fetch = async function (...args) {
  const input = args[0];
  let url = '';

  if (typeof input === 'string') {
    url = input;
  } else if (input instanceof URL) {
    url = input.href;
  } else if (input && typeof input === 'object' && 'url' in input) {
    url = (input as any).url;
  }

  // Intercept requests directed to our Render/Local API server
  const isApiRequest = 
    url.includes('/api/v1/') || 
    url.includes('localhost:4000') || 
    (import.meta.env.VITE_API_URL && url.includes(import.meta.env.VITE_API_URL));

  if (!isApiRequest) {
    return originalFetch.apply(this, args);
  }

  let isCompleted = false;
  let hasTriggeredWaking = false;

  // 1.5 second threshold to trigger "warming/waking up" notification
  const timer = setTimeout(() => {
    if (!isCompleted) {
      activeLongRequests++;
      hasTriggeredWaking = true;
      notify(true);
    }
  }, 1500);

  try {
    const response = await originalFetch.apply(this, args);
    return response;
  } finally {
    isCompleted = true;
    clearTimeout(timer);
    if (hasTriggeredWaking) {
      activeLongRequests--;
      if (activeLongRequests <= 0) {
        activeLongRequests = 0;
        notify(false);
      }
    }
  }
};
