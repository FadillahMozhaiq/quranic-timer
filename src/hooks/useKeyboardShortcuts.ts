import { useEffect, useCallback, useState } from 'react';
import { KEYBOARD_SHORTCUTS } from '../utils/constants';

interface KeyboardShortcutHandlers {
  onToggleTimer?: () => void;
  onResetTimer?: () => void;
  onToggleAudio?: () => void;
  onStopBell?: () => void;
}

export function useKeyboardShortcuts({
  onToggleTimer,
  onResetTimer,
  onToggleAudio,
  onStopBell
}: KeyboardShortcutHandlers) {
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      event.target instanceof HTMLSelectElement
    ) {
      return;
    }

    const key = event.key.toLowerCase();
    
    switch (key) {
      case KEYBOARD_SHORTCUTS.TOGGLE_TIMER:
        event.preventDefault();
        if (onStopBell) {
          onStopBell();
        } else {
          onToggleTimer?.();
        }
        break;
      case KEYBOARD_SHORTCUTS.RESET_TIMER:
        event.preventDefault();
        onResetTimer?.();
        break;
      case KEYBOARD_SHORTCUTS.TOGGLE_AUDIO:
        event.preventDefault();
        onToggleAudio?.();
        break;
      case 'escape':
        event.preventDefault();
        onStopBell?.();
        break;
    }
  }, [onToggleTimer, onResetTimer, onToggleAudio, onStopBell]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);
}

export function useKeyPress(targetKey: string): boolean {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const downHandler = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        setKeyPressed(true);
      }
    };

    const upHandler = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        setKeyPressed(false);
      }
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKey]);

  return keyPressed;
}