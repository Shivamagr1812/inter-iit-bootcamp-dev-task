import styles from './copyToClipBoard.module.css';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { IconButton, Tooltip } from '@mui/material';

const CopyToClipboard = ({content, setInfoText}) => {

    const copyResponse = async (msgContent) => {
        try {
          await navigator.clipboard.writeText(msgContent);
          setInfoText('Copied!');
        } catch (err) {
          setInfoText('Failed to copy');
        }
        setTimeout(() => setInfoText(''), 3000);
      }

    return (
        <Tooltip title="Copy to clipboard">
            <IconButton className={styles.copy} onClick={() => copyResponse(content)}>
                <ContentCopyIcon />
            </IconButton>
        </Tooltip>
    );
}

export default CopyToClipboard;