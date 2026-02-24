import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Volume2, VolumeX, Heart, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { EmotionDetector, type Emotion, getEmotionEmoji, getEmotionLabel } from "@/utils/emotionDetection";

interface Message {
  role: "user" | "assistant";
  content: string;
  language?: string;
  emotion?: Emotion;
}

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [transcript, setTranscript] = useState("");
  const [language, setLanguage] = useState<"en-US" | "hi-IN">("en-US");
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>('neutral');
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const emotionDetectorRef = useRef<EmotionDetector | null>(null);
  const emotionIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language;

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
          handleSendMessage(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          toast.error(language === 'hi-IN' ? 'कोई आवाज़ नहीं सुनी गई' : 'No speech detected');
        }
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      toast.error("Speech recognition not supported in this browser");
    }

    // Initialize speech synthesis
    synthRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [language]);

  const toggleListening = async () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      
      // Stop emotion detection
      if (emotionIntervalRef.current) {
        clearInterval(emotionIntervalRef.current);
        emotionIntervalRef.current = null;
      }
      emotionDetectorRef.current?.cleanup();
      emotionDetectorRef.current = null;
    } else {
      try {
        // Start audio capture for emotion detection
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Initialize emotion detector
        emotionDetectorRef.current = new EmotionDetector();
        await emotionDetectorRef.current.initialize(stream);
        
        // Analyze emotion every 500ms
        emotionIntervalRef.current = window.setInterval(() => {
          if (emotionDetectorRef.current) {
            const analysis = emotionDetectorRef.current.analyzeEmotion();
            setCurrentEmotion(analysis.emotion);
          }
        }, 500);
        
        recognitionRef.current.lang = language;
        recognitionRef.current?.start();
        setIsListening(true);
        toast.success(language === 'hi-IN' ? 'सुन रहा हूँ...' : 'Listening...');
      } catch (error) {
        console.error('Error starting emotion detection:', error);
        toast.error(language === 'hi-IN' ? 'माइक्रोफोन एक्सेस विफल' : 'Microphone access failed');
      }
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = { 
      role: "user", 
      content: text,
      language: language === 'hi-IN' ? 'Hindi' : 'English',
      emotion: currentEmotion
    };
    setMessages((prev) => [...prev, userMessage]);
    setTranscript("");

    try {
      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: { 
          message: text,
          language: language === 'hi-IN' ? 'Hindi' : 'English',
          emotion: currentEmotion
        },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      
      // Speak the response
      speakText(data.response);

      // Store voice conversation with metadata
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("conversations").insert({
          elder_id: user.id,
          question: text,
          answer: data.response,
          conversation_type: "voice",
          emotion: currentEmotion,
          language: language === "hi-IN" ? "Hindi" : "English"
        });
      }
    } catch (error: any) {
      toast.error(language === 'hi-IN' ? 'प्रतिक्रिया प्राप्त करने में विफल' : 'Failed to get response');
      console.error("Voice assistant error:", error);
    }
  };

  const speakText = (text: string) => {
    if (!synthRef.current) return;

    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const toggleSpeaking = () => {
    if (synthRef.current) {
      if (isSpeaking) {
        synthRef.current.cancel();
        setIsSpeaking(false);
      }
    }
  };

  const switchLanguage = () => {
    const newLang = language === "en-US" ? "hi-IN" : "en-US";
    setLanguage(newLang);
    if (recognitionRef.current) {
      recognitionRef.current.lang = newLang;
    }
    toast.success(newLang === 'hi-IN' ? 'हिंदी में बदल गया' : 'Switched to English');
  };

  return (
    <div className="space-y-6">
      {/* Language Toggle */}
      <div className="flex gap-3 items-center justify-center">
        <Button
          onClick={switchLanguage}
          variant="outline"
          size="lg"
          className="text-lg font-medium"
          aria-label={`Switch to ${language === "en-US" ? "Hindi" : "English"}`}
        >
          {language === "en-US" ? "🇮🇳 हिंदी में बोलें" : "🇬🇧 Speak in English"}
        </Button>
      </div>

      {/* Main Voice Interface */}
      <Card className="p-8 md:p-12 flex flex-col items-center justify-center min-h-[450px] bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-2">
        <div className="text-center space-y-8">
          {/* Voice Button - Large and prominent */}
          <div className="relative">
            <button
              onClick={toggleListening}
              className={`w-40 h-40 md:w-48 md:h-48 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-primary/40 focus:ring-offset-4 ${
                isListening 
                  ? 'bg-primary animate-pulse-gentle shadow-primary/30' 
                  : isSpeaking
                  ? 'bg-secondary shadow-secondary/30'
                  : 'bg-muted hover:bg-muted/80'
              }`}
              aria-label={isListening ? "Stop listening" : isSpeaking ? "Currently speaking" : "Start speaking"}
              aria-pressed={isListening}
            >
              {isListening ? (
                <Mic className="w-20 h-20 md:w-24 md:h-24 text-primary-foreground" aria-hidden="true" />
              ) : isSpeaking ? (
                <Volume2 className="w-20 h-20 md:w-24 md:h-24 text-secondary-foreground" aria-hidden="true" />
              ) : (
                <MicOff className="w-20 h-20 md:w-24 md:h-24 text-muted-foreground" aria-hidden="true" />
              )}
            </button>
            
            {/* Animated ring */}
            {(isListening || isSpeaking) && (
              <div 
                className="absolute inset-0 rounded-full border-4 border-primary animate-ping opacity-30" 
                aria-hidden="true" 
              />
            )}
            
            {/* Emotion badge */}
            {isListening && currentEmotion !== 'neutral' && (
              <Badge 
                variant="secondary" 
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 text-base shadow-md"
              >
                <Heart className="w-4 h-4" aria-hidden="true" />
                {getEmotionEmoji(currentEmotion)} {getEmotionLabel(currentEmotion, language)}
              </Badge>
            )}
          </div>

          {/* Status Text */}
          <div className="space-y-3">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground">
              {language === "hi-IN" ? "आवाज़ सहायक" : "Voice Assistant"}
            </h3>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-md mx-auto leading-relaxed">
              {isListening 
                ? (language === "hi-IN" ? "🎤 मैं सुन रहा हूँ..." : "🎤 I'm listening...") 
                : isSpeaking
                ? (language === "hi-IN" ? "🔊 बोल रहा हूँ..." : "🔊 Speaking...")
                : (language === "hi-IN" 
                  ? "बड़े बटन को दबाएं और बोलना शुरू करें" 
                  : "Tap the big button above and start speaking"
                )
              }
            </p>
            {transcript && (
              <div className="mt-4 p-4 bg-primary/10 rounded-2xl border border-primary/20">
                <p className="text-lg text-primary font-medium">"{transcript}"</p>
              </div>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              onClick={toggleListening}
              size="xl"
              variant={isListening ? "destructive" : "default"}
              className="min-w-[180px] shadow-lg"
              aria-label={isListening ? "Stop listening" : "Start speaking"}
            >
              {isListening ? (
                <>
                  <MicOff className="w-6 h-6" aria-hidden="true" />
                  {language === "hi-IN" ? "बंद करें" : "Stop"}
                </>
              ) : (
                <>
                  <Mic className="w-6 h-6" aria-hidden="true" />
                  {language === "hi-IN" ? "बोलें" : "Start Speaking"}
                </>
              )}
            </Button>

            {isSpeaking && (
              <Button
                onClick={toggleSpeaking}
                size="xl"
                variant="outline"
                className="min-w-[140px]"
                aria-label="Mute response"
              >
                <VolumeX className="w-6 h-6" aria-hidden="true" />
                {language === "hi-IN" ? "चुप करें" : "Mute"}
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Conversation History */}
      {messages.length > 0 && (
        <Card className="p-6 border-2 shadow-md">
          <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" aria-hidden="true" />
            {language === "hi-IN" ? "बातचीत इतिहास" : "Conversation History"}
          </h4>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2" role="log" aria-live="polite">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground ml-6 md:ml-12"
                    : "bg-muted mr-6 md:mr-12"
                }`}
              >
                {msg.emotion && msg.role === "user" && (
                  <div className="text-sm opacity-80 mb-2 flex items-center gap-2">
                    {getEmotionEmoji(msg.emotion)} {getEmotionLabel(msg.emotion, language)}
                  </div>
                )}
                <p className="text-lg leading-relaxed">{msg.content}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default VoiceAssistant;
