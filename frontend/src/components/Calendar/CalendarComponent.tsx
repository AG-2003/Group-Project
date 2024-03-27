
// import { Box, Button, Divider, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, Stack, useDisclosure } from '@chakra-ui/react';
// import React, { useEffect, useState } from 'react';
// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import timeGridPlugin from '@fullcalendar/timegrid'
// import interactionPlugin from '@fullcalendar/interaction'
// import SideBar from "../Dashboard/sidebar";
// import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
// import { auth } from '../../firebase-config';
// import { db } from '../../firebase-config';
// import { AnimatePresence, motion } from 'framer-motion';
// import Navbar from '../Dashboard/Navbar';
// import { EventType } from '../../interfaces/EventType';



// export const CalendarComponent: React.FC = () => {
//     const { isOpen, onOpen, onClose } = useDisclosure();
//     const [events, setEvents] = useState<EventType[]>([]);
//     const [newEvent, setNewEvent] = useState<EventType>({ title: '', start: '', end: '', priority: 'low', backgroundColor: '' });

//     const email = auth.currentUser?.email;


//     // Dashboard routing
//     const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//     const sidebarVariants = {
//         open: { width: "200px" },
//         closed: { width: "0px" },
//     };

//     // Function to toggle the sidebar
//     const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);




//     const handleCreateEventClick = () => {
//         onOpen();
//     };

//     const handleNewEventChange = (event: React.ChangeEvent<HTMLInputElement> | { target: { name: string, value: string } }) => {
//         const { name, value }: { name: string, value: string } = event.target;

//         let backgroundColor = newEvent.backgroundColor;

//         // Map the priority to a background color
//         if (name === 'priority') {
//             backgroundColor = value === 'low' ? 'blue' : value === 'medium' ? 'yellow' : 'red';
//         }

//         setNewEvent({ ...newEvent, [name]: value, ...(name === 'priority' && { backgroundColor }) });
//     };




//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         const newEventToAdd: EventType = {
//             ...newEvent,
//             backgroundColor: newEvent.priority === 'low' ? '#B19CD9' : newEvent.priority === 'medium' ? '#8968CD' : '#7851A9',
//         };

//         // Add the new event locally and then save to Firestore
//         setEvents(prevEvents => [...prevEvents, newEventToAdd]);
//         await saveEventToFirestore(newEventToAdd);
//         onClose(); // Close the modal after submission
//         setNewEvent({ title: '', start: '', end: '', backgroundColor: '', priority: 'low' }); // resetting the form here.

//     };


//     const fetchEventsFromFirestore = async () => {
//         if (email) {
//             const userRef = doc(db, 'users', email);
//             try {
//                 const docSnap = await getDoc(userRef);
//                 if (docSnap.exists() && docSnap.data().events) {
//                     setEvents(docSnap.data().events);
//                 } else {

//                     console.log("No such document or events field!");
//                 }
//             } catch (error) {
//                 console.error("Error fetching events from Firestore: ", error);
//             }
//         }
//     };


//     useEffect(() => {
//         fetchEventsFromFirestore();
//     }, []);

//     const saveEventToFirestore = async (event: EventType) => {
//         if (email) {
//             const userRef = doc(db, 'users', email);
//             try {

//                 await updateDoc(userRef, {
//                     events: arrayUnion(event)
//                 });
//             } catch (error) {
//                 console.error("Error saving event to Firestore: ", error);
//             }
//         }
//     };



//     return (

//         <>
//             <Box style={{ padding: "10px", background: "#484c6c" }}>
//                 <Navbar onToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />
//             </Box>
//             <Divider borderColor="lightgrey" borderWidth="1px" maxW="98.5vw" />
//             <Box display="flex" height="calc(100vh - 10px)" width="100%">
//                 <AnimatePresence>
//                     {isSidebarOpen ? (
//                         <motion.div
//                             initial="open"
//                             animate="open"
//                             exit="closed"
//                             variants={sidebarVariants}
//                             transition={{ type: "spring", stiffness: 300, damping: 30 }}
//                             style={{
//                                 paddingTop: "10px",
//                                 height: "inherit",
//                                 backgroundColor: "#f6f6f6",
//                                 boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
//                                 overflow: "hidden",
//                             }}
//                         >
//                             <SideBar />
//                         </motion.div>
//                     ) : (
//                         <motion.div
//                             initial="closed"
//                             animate="closed"
//                             exit="open"
//                             variants={sidebarVariants}
//                             transition={{ type: "spring", stiffness: 300, damping: 30 }}
//                             style={{
//                                 paddingTop: "10px",
//                                 height: "inherit",
//                                 backgroundColor: "#f6f6f6",
//                                 boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
//                                 overflow: "hidden",
//                             }}
//                         >
//                             <SideBar />
//                         </motion.div>
//                     )}
//                 </AnimatePresence>
//                 <Box flexGrow="1" pt="1px" pl='5px' overflowY="auto" > {/* Make sure this Box is a flex container */}

//                     <Modal isOpen={isOpen} onClose={onClose} isCentered >
//                         <ModalOverlay />
//                         <ModalContent >
//                             <ModalHeader>Create a new event</ModalHeader>
//                             <ModalCloseButton />
//                             <form onSubmit={handleSubmit}>
//                                 <ModalBody >
//                                     <FormControl>
//                                         <FormLabel>Title</FormLabel>
//                                         <Input name="title" onChange={handleNewEventChange} value={newEvent.title} />
//                                     </FormControl>
//                                     <FormControl mt={4}>
//                                         <FormLabel>Start</FormLabel>
//                                         <Input type="date" name="start" onChange={handleNewEventChange} value={newEvent.start} />
//                                     </FormControl>
//                                     <FormControl mt={4}>
//                                         <FormLabel>End</FormLabel>
//                                         <Input type="date" name="end" onChange={handleNewEventChange} value={newEvent.end} />
//                                     </FormControl>
//                                     <FormControl mt={4}>
//                                         <FormLabel>Priority</FormLabel>
//                                         <RadioGroup
//                                             onChange={(value) => handleNewEventChange({ target: { name: 'priority', value } as any })}
//                                         >
//                                             <Stack spacing={5} direction='row'>
//                                                 <Radio colorScheme='blue' value='low'>Low</Radio>
//                                                 <Radio colorScheme='yellow' value='medium'>Medium</Radio>
//                                                 <Radio colorScheme='red' value='high'>High</Radio>
//                                             </Stack>
//                                         </RadioGroup>

//                                     </FormControl>
//                                 </ModalBody>
//                                 <ModalFooter>
//                                     <Button colorScheme="blue" mr={3} type="submit">
//                                         Save
//                                     </Button>
//                                     <Button variant="ghost" onClick={onClose}>Cancel</Button>
//                                 </ModalFooter>
//                             </form>
//                         </ModalContent>
//                     </Modal>
//                     <FullCalendar
//                         plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//                         height='100%'
//                         headerToolbar={{
//                             start: 'today prevYear,prev,next,nextYear',
//                             center: 'title',
//                             end: 'createEvent dayGridMonth,timeGridWeek,timeGridDay'
//                         }}
//                         customButtons={{
//                             createEvent: {
//                                 text: 'Create Event',
//                                 click: handleCreateEventClick,

//                             }
//                         }}
//                         initialView="dayGridMonth"
//                         editable
//                         selectable
//                         dayMaxEvents
//                         events={events}
//                     />
//                 </Box>

//             </Box>

//         </>

//     );
// };

import { useEffect, useState } from 'react';
import { Box, Button, Divider, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, Stack, Table, Tbody, Td, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import SideBar from "../Dashboard/sidebar";
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth } from '../../firebase-config';
import { db } from '../../firebase-config';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '../Dashboard/Navbar';
import { EventType } from '../../interfaces/EventType';

export const CalendarComponent: React.FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
    const [events, setEvents] = useState<EventType[]>([]);
    const [newEvent, setNewEvent] = useState<EventType>({ title: '', start: '', end: '', priority: 'low', backgroundColor: '' });
    const email = auth.currentUser?.email;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // State to track screen width
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    // Function to update screenWidth state
    const updateScreenWidth = () => {
        setScreenWidth(window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener("resize", updateScreenWidth);
        return () => window.removeEventListener("resize", updateScreenWidth);
    }, []);

    // Close the sidebar when screen size is smaller
    useEffect(() => {
        if (screenWidth < 768) {
            setIsSidebarOpen(false);
        } else {
            setIsSidebarOpen(true);
        }
    }, [screenWidth]);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleCreateEventClick = () => {
        onOpen();
    };

    const handleEditTasksClick = () => {
        onEditOpen();
    };

    const handleNewEventChange = (event: React.ChangeEvent<HTMLInputElement> | { target: { name: string, value: string } }) => {
        const { name, value }: { name: string, value: string } = event.target;

        let backgroundColor = newEvent.backgroundColor;

        if (name === 'priority') {
            backgroundColor = value === 'low' ? 'blue' : value === 'medium' ? 'yellow' : 'red';
        }

        setNewEvent({ ...newEvent, [name]: value, ...(name === 'priority' && { backgroundColor }) });
    };

    // Helper function to get background color based on priority
    const getBackgroundColorByPriority = (priority: 'low' | 'medium' | 'high') => {
        switch (priority) {
            case 'low':
                return '#B19CD9';
            case 'medium':
                return '#8968CD';
            case 'high':
                return '#7851A9';
            default:
                return '#dcdcf6'; // default color
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if the event has specific start/end times and construct ISO strings
        const startDateTime = newEvent.startTime
            ? `${newEvent.start}T${newEvent.startTime}:00`
            : newEvent.start;
        const endDateTime = newEvent.endTime
            ? `${newEvent.end}T${newEvent.endTime}:00`
            : newEvent.end;

        // Construct the new event object with combined date and time
        const newEventToAdd = {
            title: newEvent.title,
            start: startDateTime,
            end: endDateTime,
            allDay: !newEvent.startTime && !newEvent.endTime,
            backgroundColor: getBackgroundColorByPriority(newEvent.priority),
            priority: newEvent.priority,
        };

        setEvents(prevEvents => [...prevEvents, newEventToAdd]);
        await saveEventToFirestore(newEventToAdd);
        onClose();
        setNewEvent({ title: '', start: '', end: '', backgroundColor: '', priority: 'low' });
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

    const handleDeleteEvent = async (eventToDelete: EventType) => {
        if (!email) return;
        const updatedEvents = events.filter(event => event !== eventToDelete);
        const userRef = doc(db, 'users', email);
        try {
            await updateDoc(userRef, {
                events: updatedEvents
            });
            setEvents(updatedEvents);
        } catch (error) {
            console.error("Error deleting event from Firestore: ", error);
        }
    };



    const handleEventUpdate = async (eventToUpdate: EventType, field: string, value: string) => {
        if (!email) return;

        const updatedEvent = { ...eventToUpdate, [field]: value };
        const updatedEvents = events.map(event =>
            event === eventToUpdate ? updatedEvent : event
        );
        setEvents(updatedEvents);

        const userRef = doc(db, 'users', email);
        try {
            await updateDoc(userRef, {
                events: updatedEvents
            });
        } catch (error) {
            console.error("Error updating event in Firestore: ", error);
        }
    };


    return (
        <>

            <Box flexGrow="1" pt="1px" pl='5px' overflowY="auto" >

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
                                    <FormLabel>Start Time</FormLabel>
                                    <Input type="time" name="startTime" onChange={handleNewEventChange} value={newEvent.startTime} placeholder="HH:MM" />
                                </FormControl>
                                <FormControl mt={4}>
                                    <FormLabel>End</FormLabel>
                                    <Input type="date" name="end" onChange={handleNewEventChange} value={newEvent.end} />
                                </FormControl>
                                <FormControl mt={4}>
                                    <FormLabel>End Time</FormLabel>
                                    <Input type="time" name="endTime" onChange={handleNewEventChange} value={newEvent.endTime} placeholder="HH:MM" />
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
                <Modal isOpen={isEditOpen} onClose={onEditClose} isCentered size='xxl'>
                    <ModalOverlay />
                    <ModalContent w='auto'>
                        <ModalHeader>Edit Tasks</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody w='auto'>
                            <Table variant="simple">
                                <Thead>
                                    <Tr>
                                        <Th>Title</Th>
                                        <Th>Start</Th>
                                        <Th>End</Th>
                                        <Th>Action</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {events.map((event, index) => (
                                        <Tr key={index}>
                                            <Td>
                                                <Input
                                                    variant="unstyled"
                                                    defaultValue={event.title}
                                                    onBlur={(e) => handleEventUpdate(event, 'title', e.target.value)}
                                                />
                                            </Td>
                                            <Td>
                                                <Input
                                                    type="date"
                                                    variant="unstyled"
                                                    defaultValue={event.start.split('T')[0]}
                                                    onBlur={(e) => handleEventUpdate(event, 'start', e.target.value + 'T' + event.start.split('T')[1])}
                                                />
                                            </Td>
                                            <Td>
                                                <Input
                                                    type="date"
                                                    variant="unstyled"
                                                    defaultValue={event.end?.split('T')[0]}
                                                    onBlur={(e) => handleEventUpdate(event, 'end', e.target.value + 'T' + event.end?.split('T')[1])}
                                                />
                                            </Td>
                                            <Td>
                                                <Button colorScheme="red" size="sm" onClick={() => handleDeleteEvent(event)}>
                                                    Delete
                                                </Button>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </ModalBody>
                    </ModalContent>
                </Modal>

                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    height='100%'
                    headerToolbar={{
                        start: 'today prevYear,prev,next,nextYear',
                        center: 'title',
                        end: 'editTasks,createEvent dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    customButtons={{
                        createEvent: {
                            text: 'Create Event',
                            click: handleCreateEventClick,
                        },
                        editTasks: {
                            text: 'Edit Tasks',
                            click: handleEditTasksClick,
                        }
                    }}
                    initialView="dayGridMonth"
                    editable
                    selectable
                    dayMaxEvents
                    events={events}
                />
            </Box>
            <Divider borderColor="lightgrey" borderWidth="1px" maxW="98.5vw" />
            <Box display="flex" flexWrap="wrap" width="100%">
                <AnimatePresence>
                    <motion.div
                        initial="open"
                        animate={isSidebarOpen ? "open" : "closed"}
                        exit="closed"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        style={{
                            width: isSidebarOpen ? (screenWidth < 768 ? "150px" : "200px") : "0px", // Adjusted sidebar width
                            backgroundColor: "#f6f6f6",
                            boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
                            overflow: "hidden",
                            height: "100vh", // Extend to full height
                        }}
                    >
                        <SideBar />
                    </motion.div>
                </AnimatePresence>
                <Box
                    flex="1"
                    px={{ base: "1rem", md: isSidebarOpen ? (screenWidth < 768 ? "150px" : "200px") : "1rem" }} // Adjusted sidebar width
                    py={{ base: "1rem", md: 0 }}
                    overflowY="auto"
                    width={{
                        base: isSidebarOpen ? (screenWidth < 768 ? "calc(100% - 150px)" : "calc(100% - 200px)") : "100%", // Adjusted calendar width
                        md: "100%"
                    }}
                >
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        headerToolbar={{
                            start: 'today prevYear,prev,next,nextYear',
                            center: 'title',
                            end: screenWidth >= 768 ? 'createEvent dayGridMonth,timeGridWeek,timeGridDay' : 'createEvent'
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
                        height="100vh" // Extend to full height
                    />
                </Box>
            </Box>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create a new event</ModalHeader>
                    <ModalCloseButton />
                    <form onSubmit={handleSubmit}>
                        <ModalBody>
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
                                    <Stack spacing={5} direction={{ base: 'column', md: 'row' }}>
                                        <Radio colorScheme='blue' value='low'>Low</Radio>
                                        <Radio colorScheme='yellow' value='medium'>Medium</Radio>
                                        <Radio colorScheme='red' value='high'>High</Radio>
                                    </Stack>
                                </RadioGroup>
                            </FormControl>
                        </ModalBody>
                        <ModalFooter flexDirection={{ base: "column", md: "row" }} justifyContent={{ base: "center", md: "flex-end" }} alignItems={{ base: "center", md: "flex-end" }} overflowX="auto">
                            <Button colorScheme="blue" mr={3} type="submit" minWidth={{ base: "100%", md: "auto" }} mb={{ base: "1rem", md: 0 }}>
                                Save
                            </Button>
                            <Button variant="ghost" onClick={onClose} minWidth={{ base: "100%", md: "auto" }}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    );
};
