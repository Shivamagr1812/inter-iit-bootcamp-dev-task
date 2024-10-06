// src/utils/api.js
export const transcribeAudio = async (audioBlob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.wav');

    const response = await fetch('http://localhost:5000/transcribe', {
        method: 'POST',
        body: formData,
    });

    return response.json();
};
