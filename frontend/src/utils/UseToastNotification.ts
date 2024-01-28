import { useToast, ToastId, ToastPosition } from "@chakra-ui/react";

type ToastStatus = 'success' | 'error' | 'warning' | 'info';

// Create a function that returns another function to use the toast.
export const UseToastNotification = () => {
    const toast = useToast();

    const showToast = (status: ToastStatus, title: string, description?: string): ToastId => {
        return toast({
            title,
            description,
            status,
            duration: 5000,
            isClosable: true,
            position: "top" as ToastPosition
        });
    };

    return showToast;
};
