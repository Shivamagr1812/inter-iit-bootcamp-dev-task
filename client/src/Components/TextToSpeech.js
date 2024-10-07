export const speakText = (text) => {
     // Check if the browser supports speech synthesis
     if ('speechSynthesis' in window) {
       const speech = new SpeechSynthesisUtterance(text);
       speech.lang = 'en-US'; // You can set this to any language
       speech.pitch = 1;      // Adjust pitch (0 - 2)
       speech.rate = 1;       // Adjust rate (0.1 - 10)
       speech.volume = 1;     // Adjust volume (0 - 1)
   
       // Speak the AI response
       window.speechSynthesis.speak(speech);
     } else {
       console.error('Text-to-Speech is not supported in this browser.');
     }
   };
   