import { SetStateAction, useState } from "react";
import { Input, Button, Box } from "@chakra-ui/react";
import { auth } from "../../../firebase-config";
import { updateProfile } from "firebase/auth";

interface Props {
  b1: string;
  initialValue: string; // prop for initial value
  onSave: (newValue: string) => void; // prop for the save callback 

}
const EditableTextField = ({ b1, initialValue, onSave }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [textValue, setTextValue] = useState(initialValue);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    onSave(textValue); // Call the onSave callback with the new value
  };


  const handleInputChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setTextValue(event.target.value);
  };

  return (
    <Box>
      {isEditing ? (
        <Input value={textValue} onChange={handleInputChange} />
      ) : (
        <Box>
          <span>{textValue}</span>
          <Button ml={290} onClick={handleEditClick}>
            {b1}
          </Button>
        </Box>
      )}
      {isEditing && (
        <Button mt={2} onClick={handleSaveClick}>
          Save
        </Button>
      )}
    </Box>
  );
};

export default EditableTextField;
