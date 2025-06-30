import { Box, Stack } from '@mui/material';
import { contentBlockHeaderStyle } from '../_styles/ContentBlock.Header.Style';

type ContentBlockHeaderProps = {
    text: string;
    buttons?: React.ReactNode[];
};

const ContentBlockHeader: React.FC<ContentBlockHeaderProps> = ({ text, buttons = [] }) => {
    return (
        <Stack
            className="content-block-heading"
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
            sx={contentBlockHeaderStyle}
        >
            {/* Header Text */}
            <h4 style={{ margin: 0 }}>{text}</h4>

            {/* Header Buttons */}
            <Box sx={{ display: 'flex', gap: '8px' }}>
                {buttons.map((button, index) => (
                    <Box key={index}>{button}</Box>
                ))}
            </Box>
        </Stack>
    );
};

export default ContentBlockHeader;
