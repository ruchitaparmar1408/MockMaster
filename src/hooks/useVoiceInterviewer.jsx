import { useEffect, useRef, useState } from "react";

const supportsSpeechSynthesis =
  typeof window !== "undefined" && "speechSynthesis" in window;

export const useVoiceInterviewer = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [enabled, setEnabled] = useState(supportsSpeechSynthesis);
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (!supportsSpeechSynthesis) return;
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = (text, languageCode) => {
    if (!enabled || !supportsSpeechSynthesis || !text) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    const utterance = new SpeechSynthesisUtterance(text);

    if (languageCode) {
      utterance.lang = languageCode;
      try {
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length) {
          let voice =
            voices.find((v) => v.lang === languageCode) ||
            voices.find((v) => v.lang.startsWith(languageCode.split("-")[0]));
          if (!voice && languageCode.startsWith("en")) {
            voice =
              voices.find((v) => v.lang.startsWith("en-")) ||
              voices.find((v) => v.lang.toLowerCase().includes("english"));
          }
          if (voice) {
            utterance.voice = voice;
          }
        }
      } catch {
        // fall back to default voice if we can't match
      }
    }
    utterance.rate = 1;
    utterance.pitch = 1.05;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    utteranceRef.current = utterance;
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const toggleEnabled = () => {
    setEnabled((prev) => !prev);
    if (isSpeaking && supportsSpeechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const stop = () => {
    if (supportsSpeechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return {
    enabled,
    isSpeaking,
    speak,
    toggleEnabled,
    stop,
  };
};

