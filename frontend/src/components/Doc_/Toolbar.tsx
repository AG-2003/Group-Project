import React from "react";
import {
  ButtonGroup,
  IconButton,
  useColorModeValue,
  Tooltip,
} from "@chakra-ui/react";
import {
  FaSearch,
  FaUndo,
  FaRedo,
  FaSpellCheck,
  FaPlus,
  FaMinus,
  FaPaintBrush,
  FaHighlighter,
  FaLink,
  FaComment,
  FaImage,
  FaBold,
  FaItalic,
  FaUnderline,
  FaList,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
  FaFont,
  FaListOl,
  FaHeading,
} from "react-icons/fa";

const Toolbar: React.FC = () => {
  const iconBtnBg = useColorModeValue("white", "gray.800"); // Color mode sensitive background

  return (
    <ButtonGroup spacing={2} padding={2}>
      <Tooltip label="Search" hasArrow>
        <IconButton
          aria-label="Search"
          icon={<FaSearch />}
          background={iconBtnBg}
        />
      </Tooltip>
      <Tooltip label="Undo" hasArrow>
        <IconButton
          aria-label="Undo"
          icon={<FaUndo />}
          background={iconBtnBg}
        />
      </Tooltip>
      <Tooltip label="Redo" hasArrow>
        <IconButton
          aria-label="Redo"
          icon={<FaRedo />}
          background={iconBtnBg}
        />
      </Tooltip>
      <Tooltip label="Spellcheck" hasArrow>
        <IconButton
          aria-label="Spellcheck"
          icon={<FaSpellCheck />}
          background={iconBtnBg}
        />
      </Tooltip>
      <Tooltip label="Headings" hasArrow>
        {/* <Select variant="unstyled" placeholder="Normal text">
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </Select> */}
        <IconButton
          aria-label="Headings"
          icon={<FaHeading />}
          background={iconBtnBg}
        />
      </Tooltip>
      <Tooltip label="Font Style" hasArrow>
        <IconButton
          aria-label="Font"
          icon={<FaFont />}
          background={iconBtnBg}
        />
      </Tooltip>
      <Tooltip label="Increase Font Size" hasArrow>
        <IconButton
          aria-label="Increase Font Size"
          icon={<FaPlus />}
          background={iconBtnBg}
        />
      </Tooltip>
      <Tooltip label="Decrease Font Size" hasArrow>
        <IconButton
          aria-label="Decrease Font Size"
          icon={<FaMinus />}
          background={iconBtnBg}
        />
      </Tooltip>
      <Tooltip label="Bold" hasArrow>
        <IconButton
          aria-label="Bold"
          icon={<FaBold />}
          background={iconBtnBg}
        />
      </Tooltip>
      <Tooltip label="Italic" hasArrow>
        <IconButton
          aria-label="Italic"
          icon={<FaItalic />}
          background={iconBtnBg}
        />
      </Tooltip>
      <Tooltip label="Underline" hasArrow>
        <IconButton
          aria-label="Underline"
          icon={<FaUnderline />}
          background={iconBtnBg}
        />
      </Tooltip>
      <Tooltip label="Text Color" hasArrow>
        <IconButton
          aria-label="Text Color"
          icon={<FaPaintBrush />}
          background={iconBtnBg}
        />
      </Tooltip>
      <Tooltip label="Highlight Text" hasArrow>
        <IconButton
          aria-label="Highlight Text"
          icon={<FaHighlighter />}
          background={iconBtnBg}
        />
      </Tooltip>
      <Tooltip label="Insert Link" hasArrow>
        <IconButton
          aria-label="Insert Link"
          icon={<FaLink />}
          background={iconBtnBg}
        />
      </Tooltip>
      <Tooltip label="Add Comment" hasArrow>
        <IconButton
          aria-label="Add Comment"
          icon={<FaComment />}
          background={iconBtnBg}
        />
      </Tooltip>
      <Tooltip label="Add Image" hasArrow>
        <IconButton
          aria-label="Add Image"
          icon={<FaImage />}
          background={iconBtnBg}
        />
      </Tooltip>
      <Tooltip label="Align Left" hasArrow>
        <IconButton
          aria-label="Align Left"
          icon={<FaAlignLeft />}
          background={iconBtnBg}
        />
      </Tooltip>
      <Tooltip label="Align Center" hasArrow>
        <IconButton
          aria-label="Align Center"
          icon={<FaAlignCenter />}
          background={iconBtnBg}
        />
      </Tooltip>
      <Tooltip label="Align Right" hasArrow>
        <IconButton
          aria-label="Align Right"
          icon={<FaAlignRight />}
          background={iconBtnBg}
        />
      </Tooltip>
      <Tooltip label="Align Justify" hasArrow>
        <IconButton
          aria-label="Align Justify"
          icon={<FaAlignJustify />}
          background={iconBtnBg}
        />
      </Tooltip>
      <Tooltip label="Bullets" hasArrow>
        <IconButton
          aria-label="Bullets"
          icon={<FaList />}
          background={iconBtnBg}
        />
      </Tooltip>
      <Tooltip label="Numbered" hasArrow>
        <IconButton
          aria-label="Numbered"
          icon={<FaListOl />}
          background={iconBtnBg}
        />
      </Tooltip>
      {/* ... other toolbar items */}
    </ButtonGroup>
  );
};

export default Toolbar;
