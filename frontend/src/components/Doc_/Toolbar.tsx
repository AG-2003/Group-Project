// // import React, { useState } from "react";
// // import { Editor, EditorState, RichUtils } from "draft-js";
// import "./ToolBar.scss";
// import {
//   ButtonGroup,
//   IconButton,
//   Menu,
//   MenuButton,
//   MenuItem,
//   MenuList,
//   Tooltip,
// } from "@chakra-ui/react";
// import {
//   FaSearch,
//   FaUndo,
//   FaRedo,
//   FaSpellCheck,
//   FaPlus,
//   FaMinus,
//   FaPaintBrush,
//   FaHighlighter,
//   FaLink,
//   FaComment,
//   FaImage,
//   FaBold,
//   FaItalic,
//   FaUnderline,
//   FaStrikethrough,
//   FaList,
//   FaAlignLeft,
//   FaAlignCenter,
//   FaAlignRight,
//   FaAlignJustify,
//   FaFont,
//   FaListOl,
//   FaHeading,
// } from "react-icons/fa";

// const ToolBar: React.FC = () => {
//   return (
//     <div className="container">
//       <ButtonGroup className="toolbar">
//         <Tooltip label="Search" hasArrow>
//           <IconButton
//             className="tool"
//             aria-label="Search"
//             icon={<FaSearch />}
//           />
//         </Tooltip>
//         <Tooltip label="Undo" hasArrow>
//           <IconButton className="tool" aria-label="Undo" icon={<FaUndo />} />
//         </Tooltip>
//         <Tooltip label="Redo" hasArrow>
//           <IconButton className="tool" aria-label="Redo" icon={<FaRedo />} />
//         </Tooltip>
//         <Tooltip label="Spellcheck" hasArrow>
//           <IconButton
//             className="tool"
//             aria-label="Spellcheck"
//             icon={<FaSpellCheck />}
//           />
//         </Tooltip>
//         <Menu>
//           <Tooltip label="Headings" hasArrow>
//             <MenuButton
//               as={IconButton}
//               className="tool"
//               aria-label="Headings"
//               icon={<FaHeading />}
//             />
//           </Tooltip>
//           <MenuList>
//             <MenuItem>Heading 1</MenuItem>
//             <MenuItem>Heading 2</MenuItem>
//             <MenuItem>Heading 3</MenuItem>
//             <MenuItem>Heading 4</MenuItem>
//             <MenuItem>Heading 5</MenuItem>
//             <MenuItem>Heading 6</MenuItem>
//           </MenuList>
//         </Menu>
//         <Menu>
//           <Tooltip label="Font Style" hasArrow>
//             <MenuButton
//               as={IconButton}
//               className="tool"
//               aria-label="Font Style"
//               icon={<FaFont />}
//             />
//           </Tooltip>
//           <MenuList>
//             <MenuItem>Arial</MenuItem>
//             <MenuItem>Times New Roman</MenuItem>
//             <MenuItem>Helvetica</MenuItem>
//             {/* ... other font options */}
//           </MenuList>
//         </Menu>
//         <Tooltip label="Increase Font Size" hasArrow>
//           <IconButton
//             className="tool"
//             aria-label="Increase Font Size"
//             icon={<FaPlus />}
//           />
//         </Tooltip>
//         <Tooltip label="Decrease Font Size" hasArrow>
//           <IconButton
//             className="tool"
//             aria-label="Decrease Font Size"
//             icon={<FaMinus />}
//           />
//         </Tooltip>
//         <Tooltip label="Bold" hasArrow>
//           <IconButton className="tool" aria-label="Search" icon={<FaBold />} />
//         </Tooltip>
//         <Tooltip label="Italic" hasArrow>
//           <IconButton
//             className="tool"
//             aria-label="Italic"
//             icon={<FaItalic />}
//           />
//         </Tooltip>
//         <Tooltip label="Underline" hasArrow>
//           <IconButton
//             className="tool"
//             aria-label="Underline"
//             icon={<FaUnderline />}
//           />
//         </Tooltip>
//         <Tooltip label="Strikethrough" hasArrow>
//           <IconButton
//             className="tool"
//             aria-label="Strikethrough"
//             icon={<FaStrikethrough />}
//           />
//         </Tooltip>
//         <Tooltip label="Text Color" hasArrow>
//           <IconButton
//             className="tool"
//             aria-label="Text Color"
//             icon={<FaPaintBrush />}
//           />
//         </Tooltip>
//         <Tooltip label="Highlight Text" hasArrow>
//           <IconButton
//             className="tool"
//             aria-label="Highlight Text"
//             icon={<FaHighlighter />}
//           />
//         </Tooltip>
//         <Tooltip label="Insert Link" hasArrow>
//           <IconButton
//             className="tool"
//             aria-label="Insert Link"
//             icon={<FaLink />}
//           />
//         </Tooltip>
//         <Tooltip label="Add Comment" hasArrow>
//           <IconButton
//             className="tool"
//             aria-label="Add Comment"
//             icon={<FaComment />}
//           />
//         </Tooltip>
//         <Tooltip label="Add Image" hasArrow>
//           <IconButton
//             className="tool"
//             aria-label="Add Image"
//             icon={<FaImage />}
//           />
//         </Tooltip>
//         <Tooltip label="Align Left" hasArrow>
//           <IconButton
//             className="tool"
//             aria-label="Align Left"
//             icon={<FaAlignLeft />}
//           />
//         </Tooltip>
//         <Tooltip label="Align Center" hasArrow>
//           <IconButton
//             className="tool"
//             aria-label="Align Center"
//             icon={<FaAlignCenter />}
//           />
//         </Tooltip>
//         <Tooltip label="Align Right" hasArrow>
//           <IconButton
//             className="tool"
//             aria-label="Align Right"
//             icon={<FaAlignRight />}
//           />
//         </Tooltip>
//         <Tooltip label="Align Justify" hasArrow>
//           <IconButton
//             className="tool"
//             aria-label="Align Justify"
//             icon={<FaAlignJustify />}
//           />
//         </Tooltip>
//         <Tooltip label="Bullets" hasArrow>
//           <IconButton className="tool" aria-label="Bullets" icon={<FaList />} />
//         </Tooltip>
//         <Tooltip label="Numbered" hasArrow>
//           <IconButton
//             className="tool"
//             aria-label="Numbered"
//             icon={<FaListOl />}
//           />
//         </Tooltip>
//       </ButtonGroup>
//     </div>
//   );
// };

// export default ToolBar;

import React, { useRef } from "react";
import "./ToolBar.scss";

import {
  ButtonGroup,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
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
  FaStrikethrough,
  FaTextHeight,
} from "react-icons/fa";

const ToolBar = ({
  onFontChange,
  onFontSizeSelect,
  onBoldClick,
  onItalicClick,
  onUnderlineClick,
  onStrikeClick,
  onColorSelect,
  onHighlightSelect,
  onLinkClick,
  onImageUpload,
}) => {
  const fonts = [
    "Arial",
    "Georgia",
    "Impact",
    "Tahoma",
    "Times New Roman",
    "Verdana",
  ];

  const fontSizes = ["10px", "12px", "14px", "16px", "18px", "20px"];

  const colors = [
    "#000000",
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#F333FF",
    "#57FF33",
  ];

  const highlightColors = [
    "transparent",
    "#ffff00",
    "#00ff00",
    "#00ffff",
    "#ff00ff",
    "#0000ff",
  ];

  return (
    <div className="container">
      <ButtonGroup className="toolbar">
        <Select onChange={onFontChange} placeholder="Font">
          {fonts.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </Select>
        <Tooltip label="Font Size" hasArrow>
          <Menu>
            <MenuButton as={IconButton} icon={<FaTextHeight />} />
            <MenuList>
              {fontSizes.map((size) => (
                <MenuItem key={size} onClick={() => onFontSizeSelect(size)}>
                  {size}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Tooltip>
        <Tooltip label="Bold" hasArrow>
          <IconButton
            className="tool"
            aria-label="Search"
            icon={<FaBold />}
            onClick={onBoldClick}
          />
        </Tooltip>
        <Tooltip label="Italic" hasArrow>
          <IconButton
            className="tool"
            aria-label="Italic"
            icon={<FaItalic />}
            onClick={onItalicClick}
          />
        </Tooltip>
        <Tooltip label="Underline" hasArrow>
          <IconButton
            className="tool"
            aria-label="Underline"
            icon={<FaUnderline />}
            onClick={onUnderlineClick}
          />
        </Tooltip>
        <Tooltip label="Strike" hasArrow>
          <IconButton
            className="tool"
            aria-label="Strike"
            icon={<FaStrikethrough />}
            onClick={onStrikeClick}
          />
        </Tooltip>
        <Tooltip label="Text Color" hasArrow>
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<FaPaintBrush />}
              className="menu-button"
            />
            <MenuList className="menu-list">
              {colors.map((color) => (
                <MenuItem
                  className="menu-item"
                  key={color}
                  onClick={() => onColorSelect(color)}
                >
                  <div
                    className="color-swatch"
                    style={{ backgroundColor: color }}
                  ></div>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Tooltip>
        <Tooltip label="Highlight Color" hasArrow>
          <Menu>
            <MenuButton as={IconButton} icon={<FaHighlighter />} />
            <MenuList>
              {highlightColors.map((color) => (
                <MenuItem
                  key={color}
                  onClick={() => onHighlightSelect(color)}
                  style={{
                    backgroundColor: color,
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    margin: "2px",
                  }}
                />
              ))}
            </MenuList>
          </Menu>
        </Tooltip>
        <Tooltip label="Insert Link" hasArrow>
          <IconButton
            className="tool"
            aria-label="Insert Link"
            icon={<FaLink />}
            onClick={onLinkClick}
          />
        </Tooltip>
        <Tooltip label="Insert Image" hasArrow>
          <IconButton
            className="tool"
            aria-label="Insert Image"
            icon={<FaImage />}
            onClick={onImageUpload}
          />
        </Tooltip>
      </ButtonGroup>
    </div>
  );
};

export default ToolBar;
