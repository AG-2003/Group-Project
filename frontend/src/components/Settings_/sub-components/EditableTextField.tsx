import { useEffect, useState } from "react";
import { Input, Button, Box } from "@chakra-ui/react";

interface Props {
  b1: string;
  initialValue: string;
  onSave: (newValue: string) => void;
}

const EditableTextField = ({ b1, initialValue, onSave }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [textValue, setTextValue] = useState(initialValue);

  useEffect(() => {
    // Update textValue whenever the initialValue prop changes
    setTextValue(initialValue);
  }, [initialValue]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    onSave(textValue); // Call the onSave callback with the new value
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextValue(event.target.value);
  };

  return (
    <Box>
      {isEditing ? (
        <Input value={textValue} onChange={handleInputChange} />
      ) : (
        <Box>
          <span>{textValue}</span>
          <Button ml="5rem" fontWeight="500" onClick={handleEditClick}>
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
