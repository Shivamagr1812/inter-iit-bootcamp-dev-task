import React from 'react';
import MarkupFormatter from './markup';

function MsgBox({ role, content, fileName }) {
    const [speaking, setSpeaking] = React.useState(false);
    const codeline = content.split('```');
    const copyToClipboard = (text) => () => {
        navigator.clipboard.writeText(text);
    };

    const speak = (text) => async () => {
        try {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = window.speechSynthesis.getVoices().filter(voice => voice.lang === 'en-GB')[10];
            utterance.pitch = 1.1;
            utterance.rate = 0.9;
            utterance.volume = 0.8;
            utterance.onerror = (event) => {
                console.error('SpeechSynthesisUtterance.onerror ', event);
                setSpeaking(false);
            };

            setSpeaking(true);  // Set speaking before starting
            window.speechSynthesis.speak(utterance);
            utterance.onend = () => {
                setSpeaking(false);
            };

            let r = setInterval(() => {
                console.log(window.speechSynthesis.speaking);
                if (!window.speechSynthesis.speaking) {
                    clearInterval(r);
                } else {
                    window.speechSynthesis.pause();
                    window.speechSynthesis.resume();
                }
            }, 14000);

        } catch (error) {
            console.error('Speech synthesis error: ', error);
            setSpeaking(false);
        }
    };


    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/*ROLE*/}
                {role === 'user' ? <p style={{ color: '#4444ff', display: 'inline-block' }}>You: </p> : <p style={{ color: '#ff4444', display: 'inline-block' }}>Gemini: </p>}
                {
                    /*SPEAKER*/
                    speaking ?
                        <img src="pause.svg" alt="pause" style={{ width: '20px', height: '20px', cursor: 'pointer' }} onClick={() => { window.speechSynthesis.cancel(); setSpeaking(false) }} />
                        :
                        <img src="speaker.svg" alt="speaker" style={{ width: '20px', height: '20px', cursor: 'pointer' }} onClick={speak(content)} />
                }
            </div>
            {/*CONTENT*/}
            <div style={{ paddingLeft: '10px' }}>
                {
                    fileName ?
                        <div className="file-name">
                            {'▶ ' + fileName}
                        </div> : null
                }
                {
                    codeline.map((line, index1) => {
                        let style1 = (index1 % 2 === 0) ? {} : { backgroundColor: 'black', borderRadius: 5, paddingLeft: 20, paddingTop: 10, paddingBottom: 10 };
                        const parts = line.split('\n');
                        return (
                            <React.Fragment key={index1}>
                                {
                                    // Code block header
                                    index1 % 2 === 1 ?
                                        <div style={snippetHeader}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                                                <div>
                                                    {parts[0]}
                                                </div>
                                                <div style={{ fontSize: 12 }} onClick={copyToClipboard(line)}>
                                                    copy
                                                </div>
                                            </div>
                                        </div>
                                        : null
                                }

                                <div key={index1} style={style1}>
                                    {
                                        // Code block content / text
                                        index1 % 2 === 0 ?
                                            parts.map((part, index) => {
                                                return <MarkupFormatter key={index} text={part} />
                                            }) :
                                            parts.slice(1).map((part, index) => {
                                                return <p key={index}>{part}</p>
                                            })
                                    }
                                </div>
                                <br key={index1 + 1} />
                            </React.Fragment>
                        );
                    })
                }
            </div>
        </div>
    );
}

const snippetHeader = {
    backgroundColor: '#444',
    color: 'white',
    padding: '10px',
    borderRadius: '5px 5px 0px 0px'
};

export default MsgBox;
