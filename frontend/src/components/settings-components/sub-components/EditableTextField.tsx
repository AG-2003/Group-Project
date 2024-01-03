import { SetStateAction, useState } from "react";
import { Input, Button, Box } from "@chakra-ui/react";

interface Props {
  b1: string;

}
const EditableTextField = ({ b1 }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [textValue, setTextValue] = useState("Default Text");

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    // You can perform additional actions with the edited text, if needed.
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
