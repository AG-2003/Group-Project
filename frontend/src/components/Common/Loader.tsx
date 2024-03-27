import React from 'react';
import { Spinner, Box, SpinnerProps, BoxProps } from '@chakra-ui/react';

interface LoaderProps {
    spinnerProps?: SpinnerProps;
    containerProps?: BoxProps;
}

const Loader: React.FC<LoaderProps> = ({ spinnerProps, containerProps }) => {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%" {...containerProps}>
            <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" {...spinnerProps} />
        </Box>
    );
};

export default Loader;
