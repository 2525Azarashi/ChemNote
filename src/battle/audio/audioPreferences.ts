import { BATTLE_AUDIO_STORAGE_KEY, parseBattleAudioSettings, serializeBattleAudioSettings, type BattleAudioSettings } from '../core/audioSettings';

export function readAudioPreferences(): BattleAudioSettings {
  try {
    const raw = localStorage.getItem(BATTLE_AUDIO_STORAGE_KEY);
    const settings = parseBattleAudioSettings(raw);
    if (raw === null) {
      const legacy = localStorage.getItem('battle_sfx');
      // Preserve the app's previous quiet default and explicit preferences.
      settings.sfx = legacy === 'on';
    }
    return settings;
  } catch { return { ...parseBattleAudioSettings(null), sfx: false }; }
}
export function writeAudioPreferences(patch: Partial<BattleAudioSettings>): BattleAudioSettings {
  const next = parseBattleAudioSettings(serializeBattleAudioSettings({ ...readAudioPreferences(), ...patch }));
  try { localStorage.setItem(BATTLE_AUDIO_STORAGE_KEY, serializeBattleAudioSettings(next)); } catch { /* session state still applies */ }
  globalThis.dispatchEvent?.(new Event('battle-audio-settings'));
  return next;
}
