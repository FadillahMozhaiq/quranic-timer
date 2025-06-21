export abstract class AppError extends Error {
  abstract readonly code: string;
  abstract readonly category: 'AUDIO' | 'TIMER' | 'SETTINGS' | 'YOUTUBE' | 'NOTIFICATION';
  
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = this.constructor.name;
    
    if ('captureStackTrace' in Error) {
      (Error as any).captureStackTrace(this, this.constructor);
    }
  }
}

export class AudioLoadError extends AppError {
  readonly code = 'AUDIO_LOAD_FAILED';
  readonly category = 'AUDIO' as const;
  
  constructor(url: string, cause?: Error) {
    super(`Failed to load audio from: ${url}`, cause);
  }
}

export class AudioPlaybackError extends AppError {
  readonly code = 'AUDIO_PLAYBACK_FAILED';
  readonly category = 'AUDIO' as const;
  
  constructor(message: string, cause?: Error) {
    super(`Audio playback error: ${message}`, cause);
  }
}

export class YouTubePlayerError extends AppError {
  readonly code = 'YOUTUBE_PLAYER_ERROR';
  readonly category = 'YOUTUBE' as const;
  
  constructor(errorCode: number, cause?: Error) {
    super(`YouTube player error (code: ${errorCode})`, cause);
  }
}

export class YouTubeApiError extends AppError {
  readonly code = 'YOUTUBE_API_ERROR';
  readonly category = 'YOUTUBE' as const;
  
  constructor(message: string, cause?: Error) {
    super(`YouTube API error: ${message}`, cause);
  }
}

export class InvalidYouTubeUrlError extends AppError {
  readonly code = 'INVALID_YOUTUBE_URL';
  readonly category = 'YOUTUBE' as const;
  
  constructor(url: string) {
    super(`Invalid YouTube URL: ${url}`);
  }
}

export class TimerConfigurationError extends AppError {
  readonly code = 'TIMER_CONFIGURATION_ERROR';
  readonly category = 'TIMER' as const;
  
  constructor(message: string) {
    super(`Timer configuration error: ${message}`);
  }
}

export class TimerWorkerError extends AppError {
  readonly code = 'TIMER_WORKER_ERROR';
  readonly category = 'TIMER' as const;
  
  constructor(message: string, cause?: Error) {
    super(`Timer worker error: ${message}`, cause);
  }
}

export class SettingsValidationError extends AppError {
  readonly code = 'SETTINGS_VALIDATION_ERROR';
  readonly category = 'SETTINGS' as const;
  
  constructor(field: string, value: unknown) {
    super(`Invalid settings value for ${field}: ${value}`);
  }
}

export class SettingsStorageError extends AppError {
  readonly code = 'SETTINGS_STORAGE_ERROR';
  readonly category = 'SETTINGS' as const;
  
  constructor(operation: 'load' | 'save', cause?: Error) {
    super(`Failed to ${operation} settings`, cause);
  }
}

export class NotificationPermissionError extends AppError {
  readonly code = 'NOTIFICATION_PERMISSION_DENIED';
  readonly category = 'NOTIFICATION' as const;
  
  constructor() {
    super('Notification permission denied by user');
  }
}

export class NotificationError extends AppError {
  readonly code = 'NOTIFICATION_ERROR';
  readonly category = 'NOTIFICATION' as const;
  
  constructor(message: string, cause?: Error) {
    super(`Notification error: ${message}`, cause);
  }
}

export type ErrorHandler = (error: AppError) => void;

export const createErrorHandler = (category?: AppError['category']): ErrorHandler => {
  return (error: AppError) => {
    if (category && error.category !== category) {
      return;
    }
    
    console.error(`[${error.category}] ${error.code}: ${error.message}`, {
      error,
      cause: error.cause,
      stack: error.stack
    });
    
  };
};

export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};