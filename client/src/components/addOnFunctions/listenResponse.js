import { useState } from 'react';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { IconButton, Tooltip } from '@mui/material';

const ListenResponse = ({content}) => {
    const [playingAudio, setPlayingAudio] = useState(false);

    const toggleSpeech = (response) => {
        if(playingAudio){
            setPlayingAudio(false);
            speechSynthesis.cancel();
        }
        else{
            setPlayingAudio(true);
            const utterance = new SpeechSynthesisUtterance(response);
            speechSynthesis.speak(utterance);
        }
    }

    return (
        <Tooltip title="Listen Response">
            <IconButton className='listen' onClick={() => toggleSpeech(content)}>
                {playingAudio ? <StopCircleIcon /> : <VolumeUpIcon />}
            </IconButton>
        </Tooltip>
    );
}

export default ListenResponse;