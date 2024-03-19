
import { Box, Button, Divider, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, Stack, useDisclosure } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import SideBar from "../Dashboard/sidebar";
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import { auth } from '../../firebase-config';
import { db } from '../../firebase-config';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '../Dashboard/Navbar';
import { EventType } from '../../interfaces/EventType';



export const CalendarComponent: React.FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [events, setEvents] = useState<EventType[]>([]);
    const [newEvent, setNewEvent] = useState<EventType>({ title: '', start: '', end: '', priority: 'low', backgroundColor: '' });

    const email = auth.currentUser?.email;


    // Dashboard routing
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const sidebarVariants = {
        open: { width: "200px" },
        closed: { width: "0px" },
    };

    // Function to toggle the sidebar
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);




    const handleCreateEventClick = () => {
        onOpen();
    };

    const handleNewEventChange = (event: React.ChangeEvent<HTMLInputElement> | { target: { name: string, value: string } }) => {
        const { name, value }: { name: string, value: string } = event.target;

        let backgroundColor = newEvent.backgroundColor;

        // Map the priority to a background color
        if (name === 'priority') {
            backgroundColor = value === 'low' ? 'blue' : value === 'medium' ? 'yellow' : 'red';
        }

        setNewEvent({ ...newEvent, [name]: value, ...(name === 'priority' && { backgroundColor }) });
    };




    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newEventToAdd: EventType = {
            ...newEvent,
            backgroundColor: newEvent.priority === 'low' ? '#B19CD9' : newEvent.priority === 'medium' ? '#8968CD' : '#7851A9',
        };

        // Add the new event locally and then save to Firestore
        setEvents(prevEvents => [...prevEvents, newEventToAdd]);
        await saveEventToFirestore(newEventToAdd);
        onClose(); // Close the modal after submission
        setNewEvent({ title: '', start: '', end: '', backgroundColor: '', priority: 'low' }); // resetting the form here.

    };


    const fetchEventsFromFirestore = async () => {
        if (email) {
            const userRef = doc(db, 'users', email);
            try {
                const docSnap = await getDoc(userRef);
                if (docSnap.exists() && docSnap.data().events) {
                    setEvents(docSnap.data().events);
                } else {

                    console.log("No such document or events field!");
                }
            } catch (error) {
                console.error("Error fetching events from Firestore: ", error);
            }
        }
    };


    useEffect(() => {
        fetchEventsFromFirestore();
    }, []);

    const saveEventToFirestore = async (event: EventType) => {
        if (email) {
            const userRef = doc(db, 'users', email);
            try {

                await updateDoc(userRef, {
                    events: arrayUnion(event)
                });
            } catch (error) {
                console.error("Error saving event to Firestore: ", error);
            }
        }
    };



    return (

        <>
            <Navbar onToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
            <Divider borderColor="lightgrey" borderWidth="1px" maxW="98.5vw" />
            <Box display="flex" height="calc(100vh - 10px)" width="100%">
                <AnimatePresence>
                    {isSidebarOpen ? (
                        <motion.div
                            initial="open"
                            animate="open"
                            exit="closed"
                            variants={sidebarVariants}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            style={{
                                paddingTop: "10px",
                                height: "inherit",
                                backgroundColor: "#f6f6f6",
                                boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
                                overflow: "hidden",
                            }}
                        >
                            <SideBar />
                        </motion.div>
                    ) : (
                        <motion.div
                            initial="closed"
                            animate="closed"
                            exit="open"
                            variants={sidebarVariants}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            style={{
                                paddingTop: "10px",
                                height: "inherit",
                                backgroundColor: "#f6f6f6",
                                boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
                                overflow: "hidden",
                            }}
                        >
                            <SideBar />
                        </motion.div>
                    )}
                </AnimatePresence>
                <Box flexGrow="1" pt="1px" pl='5px' overflowY="auto" > {/* Make sure this Box is a flex container */}

                    <Modal isOpen={isOpen} onClose={onClose} isCentered >
                        <ModalOverlay />
                        <ModalContent >
                            <ModalHeader>Create a new event</ModalHeader>
                            <ModalCloseButton />
                            <form onSubmit={handleSubmit}>
                                <ModalBody >
                                    <FormControl>
                                        <FormLabel>Title</FormLabel>
                                        <Input name="title" onChange={handleNewEventChange} value={newEvent.title} />
                                    </FormControl>
                                    <FormControl mt={4}>
                                        <FormLabel>Start</FormLabel>
                                        <Input type="date" name="start" onChange={handleNewEventChange} value={newEvent.start} />
                                    </FormControl>
                                    <FormControl mt={4}>
                                        <FormLabel>End</FormLabel>
                                        <Input type="date" name="end" onChange={handleNewEventChange} value={newEvent.end} />
                                    </FormControl>
                                    <FormControl mt={4}>
                                        <FormLabel>Priority</FormLabel>
                                        <RadioGroup
                                            onChange={(value) => handleNewEventChange({ target: { name: 'priority', value } as any })}
                                        >
                                            <Stack spacing={5} direction='row'>
                                                <Radio colorScheme='blue' value='low'>Low</Radio>
                                                <Radio colorScheme='yellow' value='medium'>Medium</Radio>
                                                <Radio colorScheme='red' value='high'>High</Radio>
                                            </Stack>
                                        </RadioGroup>

                                    </FormControl>
                                </ModalBody>
                                <ModalFooter>
                                    <Button colorScheme="blue" mr={3} type="submit">
                                        Save
                                    </Button>
                                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                                </ModalFooter>
                            </form>
                        </ModalContent>
                    </Modal>
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        height='100%'
                        headerToolbar={{
                            start: 'today prevYear,prev,next,nextYear',
                            center: 'title',
                            end: 'createEvent dayGridMonth,timeGridWeek,timeGridDay'
                        }}
                        customButtons={{
                            createEvent: {
                                text: 'Create Event',
                                click: handleCreateEventClick,

                            }
                        }}
                        initialView="dayGridMonth"
                        editable
                        selectable
                        dayMaxEvents
                        events={events}
                    />
                </Box>

            </Box>

        </>

    );
};
