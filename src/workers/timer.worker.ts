let timerId: number | null = null;
let startTime: number;
let duration: number;
let isPaused = false;
let pausedTime = 0;

interface WorkerMessage {
  action: 'START' | 'PAUSE' | 'RESUME' | 'RESET' | 'STOP';
  payload?: {
    duration?: number;
  };
}

interface WorkerResponse {
  type: 'TICK' | 'COMPLETE' | 'PAUSED' | 'RESUMED' | 'RESET';
  payload?: {
    remaining?: number;
  };
}

self.onmessage = function(e: MessageEvent<WorkerMessage>) {
  const { action, payload } = e.data;
  
  switch(action) {
    case 'START':
      if (payload?.duration) {
        startTimer(payload.duration);
      }
      break;
    case 'PAUSE':
      pauseTimer();
      break;
    case 'RESUME':
      resumeTimer();
      break;
    case 'RESET':
      resetTimer();
      break;
    case 'STOP':
      stopTimer();
      break;
  }
};

function startTimer(totalDuration: number) {
  if (timerId) {
    clearInterval(timerId);
  }
  
  startTime = Date.now();
  duration = totalDuration * 1000;
  isPaused = false;
  pausedTime = 0;
  
  timerId = setInterval(() => {
    if (isPaused) return;
    
    const elapsed = Date.now() - startTime - pausedTime;
    const remaining = Math.max(0, duration - elapsed);
    const remainingSeconds = Math.ceil(remaining / 1000);
    
    const response: WorkerResponse = {
      type: 'TICK',
      payload: { remaining: remainingSeconds }
    };
    
    self.postMessage(response);
    
    if (remaining <= 0) {
      const completeResponse: WorkerResponse = { type: 'COMPLETE' };
      self.postMessage(completeResponse);
      clearInterval(timerId!);
      timerId = null;
    }
  }, 100);
}

function pauseTimer() {
  if (!isPaused && timerId) {
    isPaused = true;
    pausedTime += Date.now() - startTime;
    const response: WorkerResponse = { type: 'PAUSED' };
    self.postMessage(response);
  }
}

function resumeTimer() {
  if (isPaused) {
    isPaused = false;
    startTime = Date.now();
    const response: WorkerResponse = { type: 'RESUMED' };
    self.postMessage(response);
  }
}

function resetTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  isPaused = false;
  pausedTime = 0;
  const response: WorkerResponse = { type: 'RESET' };
  self.postMessage(response);
}

function stopTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  isPaused = false;
  pausedTime = 0;
}

export {};