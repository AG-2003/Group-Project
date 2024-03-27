import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import SideBar from "../Dashboard/sidebar";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { auth } from "../../firebase-config";
import { db } from "../../firebase-config";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../Dashboard/Navbar";
import { EventType } from "../../interfaces/EventType";

export const CalendarComponent: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const [events, setEvents] = useState<EventType[]>([]);
  const [newEvent, setNewEvent] = useState<EventType>({
    title: "",
    start: "",
    end: "",
    priority: "low",
    backgroundColor: "",
  });
  const [isDesktop, setIsDesktop] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Check screen width or user agent to determine if it's desktop or mobile
    const screenWidth = window.innerWidth;
    setIsDesktop(screenWidth > 768); // Adjust the breakpoint as needed
  }, []);

  const email = auth.currentUser?.email;

  const handleCreateEventClick = () => {
    onOpen();
    setIsMenuOpen(false);
  };

  const handleEditTasksClick = () => {
    onEditOpen();
    setIsMenuOpen(false);
  };

  const handleMobileHeaderClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handler for closing the menu modal
  const handleCloseMenuModal = () => {
    setIsMenuOpen(false);
  };

  // Handler for clicking anywhere else on the screen
  const handleClickOutsideModal = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    if (!target.closest(".modal-content")) {
      setIsMenuOpen(false);
    }
  };

  const handleNewEventChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value }: { name: string; value: string } = event.target;

    let backgroundColor = newEvent.backgroundColor;

    // Map the priority to a background color
    if (name === "priority") {
      backgroundColor =
        value === "low" ? "blue" : value === "medium" ? "yellow" : "red";
    }

    setNewEvent({
      ...newEvent,
      [name]: value,
      ...(name === "priority" && { backgroundColor }),
    });
  };

  // Helper function to get background color based on priority
  const getBackgroundColorByPriority = (
    priority: "low" | "medium" | "high"
  ) => {
    switch (priority) {
      case "low":
        return "#B19CD9";
      case "medium":
        return "#8968CD";
      case "high":
        return "#7851A9";
      default:
        return "#dcdcf6"; // default color
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

    setEvents((prevEvents) => [...prevEvents, newEventToAdd]);
    await saveEventToFirestore(newEventToAdd);

    setNewEvent({
      title: "",
      start: "",
      end: "",
      priority: "low",
      backgroundColor: "",
    });
    onClose();
  };

  const fetchEventsFromFirestore = async () => {
    if (email) {
      const userRef = doc(db, "users", email);
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
      const userRef = doc(db, "users", email);
      try {
        await updateDoc(userRef, {
          events: arrayUnion(event),
        });
      } catch (error) {
        console.error("Error saving event to Firestore: ", error);
      }
    }
  };

  const handleDeleteEvent = async (eventToDelete: EventType) => {
    if (!email) return;
    const updatedEvents = events.filter((event) => event !== eventToDelete);
    const userRef = doc(db, "users", email);
    try {
      await updateDoc(userRef, {
        events: updatedEvents,
      });
      setEvents(updatedEvents);
    } catch (error) {
      console.error("Error deleting event from Firestore: ", error);
    }
  };

  const handleEventUpdate = async (
    eventToUpdate: EventType,
    field: string,
    value: string
  ) => {
    if (!email) return;

    const updatedEvent = { ...eventToUpdate, [field]: value };
    const updatedEvents = events.map((event) =>
      event === eventToUpdate ? updatedEvent : event
    );
    setEvents(updatedEvents);

    const userRef = doc(db, "users", email);
    try {
      await updateDoc(userRef, {
        events: updatedEvents,
      });
    } catch (error) {
      console.error("Error updating event in Firestore: ", error);
    }
  };

  return (
    <>
      <Box flexGrow="1" pt="1px" pl="5px" overflowY="auto">
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create a new event</ModalHeader>
            <ModalCloseButton />
            <form onSubmit={handleSubmit}>
              <ModalBody>
                <FormControl>
                  <FormLabel>Title</FormLabel>
                  <Input
                    name="title"
                    onChange={handleNewEventChange}
                    value={newEvent.title}
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Start</FormLabel>
                  <Input
                    type="date"
                    name="start"
                    onChange={handleNewEventChange}
                    value={newEvent.start}
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Start Time</FormLabel>
                  <Input
                    type="time"
                    name="startTime"
                    onChange={handleNewEventChange}
                    value={newEvent.startTime}
                    placeholder="HH:MM"
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>End</FormLabel>
                  <Input
                    type="date"
                    name="end"
                    onChange={handleNewEventChange}
                    value={newEvent.end}
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>End Time</FormLabel>
                  <Input
                    type="time"
                    name="endTime"
                    onChange={handleNewEventChange}
                    value={newEvent.endTime}
                    placeholder="HH:MM"
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Priority</FormLabel>
                  <RadioGroup
                    onChange={(value) =>
                      handleNewEventChange({
                        target: { name: "priority", value } as any,
                      })
                    }
                  >
                    <Stack spacing={5} direction="row">
                      <Radio colorScheme="blue" value="low">
                        Low
                      </Radio>
                      <Radio colorScheme="yellow" value="medium">
                        Medium
                      </Radio>
                      <Radio colorScheme="red" value="high">
                        High
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} type="submit">
                  Save
                </Button>
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
        <Modal isOpen={isEditOpen} onClose={onEditClose} isCentered size="xxl">
          <ModalOverlay />
          <ModalContent w="auto">
            <ModalHeader>Edit Tasks</ModalHeader>
            <ModalCloseButton />
            <ModalBody w="auto">
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
                          onBlur={(e) =>
                            handleEventUpdate(event, "title", e.target.value)
                          }
                        />
                      </Td>
                      <Td>
                        <Input
                          type="date"
                          variant="unstyled"
                          defaultValue={event.start.split("T")[0]}
                          onBlur={(e) =>
                            handleEventUpdate(
                              event,
                              "start",
                              e.target.value + "T" + event.start.split("T")[1]
                            )
                          }
                        />
                      </Td>
                      <Td>
                        <Input
                          type="date"
                          variant="unstyled"
                          defaultValue={event.end?.split("T")[0]}
                          onBlur={(e) =>
                            handleEventUpdate(
                              event,
                              "end",
                              e.target.value + "T" + event.end?.split("T")[1]
                            )
                          }
                        />
                      </Td>
                      <Td>
                        <Button
                          colorScheme="red"
                          size="sm"
                          onClick={() => handleDeleteEvent(event)}
                        >
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

        {isDesktop ? (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            height="100%"
            headerToolbar={{
              start: "today prevYear,prev,next,nextYear",
              center: "title",
              end: "editTasks,createEvent dayGridMonth,timeGridWeek,timeGridDay",
            }}
            customButtons={{
              createEvent: {
                text: "Create Event",
                click: handleCreateEventClick,
              },
              editTasks: {
                text: "Edit Tasks",
                click: handleEditTasksClick,
              },
            }}
            initialView="dayGridMonth"
            editable
            selectable
            dayMaxEvents
            events={events}
          />
        ) : (
          // phone version
          <>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              height="100%"
              headerToolbar={{
                start: "today prevYear,prev,next,nextYear",
                center: "title",
                end: "menuButton dayGridMonth,timeGridWeek,timeGridDay",
              }}
              customButtons={{
                menuButton: {
                  text: "Menu",
                  click: handleMobileHeaderClick,
                },
              }}
              initialView="dayGridMonth"
              editable
              selectable
              dayMaxEvents
              events={events}
            />
            {/* Menu */}
            {/* {isMenuOpen && (
              <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                bg="white"
                zIndex="popover"
                p="4"
                boxShadow="md"
              >
                <Button onClick={handleCreateEventClick} mb="2">
                  Create Event
                </Button>
                <Button onClick={handleEditTasksClick}>Edit Tasks</Button>
              </Box>
            )} */}
            <Modal
              isOpen={isMenuOpen}
              onClose={handleCloseMenuModal}
              isCentered
            >
              <ModalOverlay onClick={handleClickOutsideModal}>
                <ModalBody textAlign="center" justifyContent="center" mt="50%">
                  <Button onClick={handleCreateEventClick}>Create Event</Button>
                  <Button onClick={handleEditTasksClick}>Edit Tasks</Button>
                </ModalBody>
              </ModalOverlay>
            </Modal>
          </>
        )}
      </Box>
    </>
  );
};
