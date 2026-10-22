function pickEnglishVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang === 'en-US') ??
    voices.find((v) => v.lang.startsWith('en'))
  );
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function speakEnglish(text: string): void {
  if (!isSpeechSynthesisSupported()) return;

  const trimmed = text.trim();
  if (!trimmed) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(trimmed);
  utterance.lang = 'en-US';
  utterance.rate = 0.95;

  const voice = pickEnglishVoice();
  if (voice) utterance.voice = voice;

  window.speechSynthesis.speak(utterance);
}

if (isSpeechSynthesisSupported()) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}
