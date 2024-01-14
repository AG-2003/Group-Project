import "./Toolbar.scss";
import {
  ButtonGroup,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
} from "@chakra-ui/react";
import {
  FaSearch,
  FaUndo,
  FaRedo,
  FaSpellCheck,
  FaPaintBrush,
  FaHighlighter,
  FaLink,
  FaComment,
  FaImage,
  FaBold,
  FaItalic,
  FaUnderline,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
  FaFont,
  FaListOl,
  FaHeading,
  FaStrikethrough,
  FaTextHeight,
  FaListUl,
  FaIndent,
  FaOutdent,
} from "react-icons/fa";
import { VscChecklist } from "react-icons/vsc";

// Define the types for the functions used as props
type SearchFunction = (searchTerm: string) => void;
type SimpleFunction = () => void;
type TextTypeChangeFunction = (format: string, level?: number) => void;
type FontChangeFunction = (font: string) => void;
type FontSizeSelectFunction = (size: string) => void;
type ColorSelectFunction = (color: string) => void;
type TextAlignmentChangeFunction = (alignment: string) => void;
type IndentClickFunction = (direction: string) => void;

// Define the props interface
interface ToolBarProps {
  onSearch: SearchFunction;
  isSearchVisible: boolean;
  toggleSearchVisibility: SimpleFunction;
  onUndo: SimpleFunction;
  onRedo: SimpleFunction;
  onToggleSpellCheck: SimpleFunction;
  isSpellCheckEnabled: boolean;
  onTextTypeChange: TextTypeChangeFunction;
  onFontChange: FontChangeFunction;
  onFontSizeSelect: FontSizeSelectFunction;
  onBoldClick: SimpleFunction;
  onItalicClick: SimpleFunction;
  onUnderlineClick: SimpleFunction;
  onStrikeClick: SimpleFunction;
  onColorSelect: ColorSelectFunction;
  onHighlightSelect: ColorSelectFunction;
  onLinkClick: SimpleFunction;
  onImageUpload: SimpleFunction;
  onTextAlignmentChange: TextAlignmentChangeFunction;
  onChecklistClick: SimpleFunction;
  onUnorderedListClick: SimpleFunction;
  onOrderedListClick: SimpleFunction;
  onIndentClick: IndentClickFunction;
  onOutdentClick: IndentClickFunction;
}

const ToolBar: React.FC<ToolBarProps> = ({
  onSearch,
  isSearchVisible,
  toggleSearchVisibility,
  onUndo,
  onRedo,
  onToggleSpellCheck,
  isSpellCheckEnabled,
  onTextTypeChange,
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
  onTextAlignmentChange,
  onChecklistClick,
  onUnorderedListClick,
  onOrderedListClick,
  onIndentClick,
  onOutdentClick,
}) => {
  const textTypes = [
    { label: "Normal", value: "normal" },
    { label: "Heading 1", value: "header", level: 1 },
    { label: "Heading 2", value: "header", level: 2 },
    { label: "Heading 3", value: "header", level: 3 },
    { label: "Heading 4", value: "header", level: 4 },
    { label: "Heading 5", value: "header", level: 5 },
    { label: "Heading 6", value: "header", level: 6 },
    { label: "Blockquote", value: "blockquote" },
    { label: "Code Block", value: "code-block" },
  ];

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
    "#434343",
    "#666666",
    "#999999",
    "#b7b7b7",
    "#cccccc",
    "#d9d9d9",
    "#efefef",
    "#f3f3f3",
    "#ffffff",

    "#980000",
    "#ff0000",
    "#ff9900",
    "#ffff00",
    "#00ff00",
    "#00ffff",
    "#4a86e8",
    "#0000ff",
    "#9900ff",
    "#ff00ff",

    "#e6b8af",
    "#f4cccc",
    "#fce5cd",
    "#fff2cc",
    "#d9ead3",
    "#d0e0e3",
    "#c9daf8",
    "#cfe2f3",
    "#d9d2e9",
    "#ead1dc",

    "#dd7e6b",
    "#ea9999",
    "#f9cb9c",
    "#ffe599",
    "#b6d7a8",
    "#a2c4c9",
    "#a4c2f4",
    "#9fc5e8",
    "#b4a7d6",
    "#d5a6bd",

    "#cc4125",
    "#e06666",
    "#e06666",
    "#ffd966",
    "#93c47d",
    "#76a5af",
    "#6d9eeb",
    "#6fa8dc",
    "#8e7cc3",
    "#c27ba0",

    "#a61c00",
    "#cc0000",
    "#e69138",
    "#f1c232",
    "#6aa84f",
    "#45818e",
    "#3c78d8",
    "#3d85c6",
    "#674ea7",
    "#a64d79",

    "#85200c",
    "#990000",
    "#b45f06",
    "#bf9000",
    "#38761d",
    "#134f5c",
    "#1155cc",
    "#0b5394",
    "#351c75",
    "#741b47",

    "#5b0f00",
    "#660000",
    "#783f04",
    "#7f6000",
    "#274e13",
    "#0c343d",
    "#1c4587",
    "#073763",
    "#20124d",
    "#4c1130",
  ];

  const alignmentOptions = [
    { label: "Align Left", value: "", icon: FaAlignLeft },
    { label: "Align Center", value: "center", icon: FaAlignCenter },
    { label: "Align Right", value: "right", icon: FaAlignRight },
    { label: "Align Justify", value: "justify", icon: FaAlignJustify },
  ];

  return (
    <div className="containerSheet">
      <ButtonGroup className="toolbarSheet">
        <div className="search-container">
          <Tooltip label="Search" hasArrow>
            <IconButton
              className="tool"
              aria-label="Search"
              icon={<FaSearch />}
              onClick={toggleSearchVisibility}
            />
          </Tooltip>
          {isSearchVisible && (
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search..."
                onChange={(e) => onSearch(e.target.value)}
                className="search-input"
              />
            </div>
          )}
        </div>

        <Tooltip label="Undo" hasArrow>
          <IconButton
            className="tool"
            aria-label="Undo"
            icon={<FaUndo />}
            onClick={onUndo}
          />
        </Tooltip>

        <Tooltip label="Redo" hasArrow>
          <IconButton
            className="tool"
            aria-label="Redo"
            icon={<FaRedo />}
            onClick={onRedo}
          />
        </Tooltip>

        <Tooltip label="Spell Check" hasArrow>
          <IconButton
            className={`tool spellcheck-button ${
              isSpellCheckEnabled ? "active" : ""
            }`}
            aria-label="Toggle Spell Check"
            icon={<FaSpellCheck />} // Make sure to import the correct icon
            onClick={onToggleSpellCheck}
          />
        </Tooltip>

        <Tooltip label="Heading" hasArrow>
          <div>
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FaHeading />}
                className="menu-button"
              />
              <MenuList>
                {textTypes.map((type) => (
                  <MenuItem
                    key={type.label}
                    onClick={() => onTextTypeChange(type.value, type.level)}
                  >
                    {type.label}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </div>
        </Tooltip>

        <Tooltip label="Font" hasArrow>
          <div>
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FaFont />}
                className="menu-button"
              />
              <MenuList>
                {fonts.map((font) => (
                  <MenuItem key={font} onClick={() => onFontChange(font)}>
                    {font}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </div>
        </Tooltip>

        <Tooltip label="Font Size" hasArrow>
          <div>
            <Menu>
              <MenuButton
                className="menu-button"
                as={IconButton}
                icon={<FaTextHeight />}
              />
              <MenuList>
                {fontSizes.map((size) => (
                  <MenuItem
                    className="menu-item"
                    key={size}
                    onClick={() => onFontSizeSelect(size)}
                  >
                    {size}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </div>
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
          <div>
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
          </div>
        </Tooltip>

        <Tooltip label="Highlight Color" hasArrow>
          <div>
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FaHighlighter />}
                className="menu-button"
              />
              <MenuList className="menu-list">
                {colors.map((color) => (
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
          </div>
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

        <Tooltip label="Text Alignment" hasArrow>
          <div className="alignment-container">
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FaAlignLeft />}
                className="alignment-button"
              />
              <MenuList className="alignment-menu-list">
                {alignmentOptions.map((option) => (
                  <MenuItem
                    key={option.value}
                    onClick={() => onTextAlignmentChange(option.value)}
                    className="alignment-menu-item"
                  >
                    <Icon as={option.icon} className="alignment-icon" />
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </div>
        </Tooltip>

        <Tooltip label="Checklist" hasArrow>
          <IconButton
            className="tool-check"
            aria-label="Toggle Checklist"
            icon={<VscChecklist />} // Assuming FaListUl is the icon you want for the checklist
            onClick={onChecklistClick}
          />
        </Tooltip>

        <Tooltip label="Bullet List" hasArrow>
          <IconButton
            className="tool"
            aria-label="Unordered List"
            icon={<FaListUl />} // Assuming FaListUl is the icon for the unordered list
            onClick={onUnorderedListClick}
          />
        </Tooltip>

        <Tooltip label="Numbered List" hasArrow>
          <IconButton
            className="tool"
            aria-label="Ordered List"
            icon={<FaListOl />} // Assuming FaListOl is the icon for the ordered list
            onClick={onOrderedListClick}
          />
        </Tooltip>

        <Tooltip label="Indent" hasArrow>
          <IconButton
            className="tool"
            aria-label="Indent"
            icon={<FaIndent />} // Icon for indent
            onClick={() => onIndentClick("indent")}
          />
        </Tooltip>

        <Tooltip label="Outdent" hasArrow>
          <IconButton
            className="tool"
            aria-label="Outdent"
            icon={<FaOutdent />} // Icon for outdent
            onClick={() => onIndentClick("outdent")}
          />
        </Tooltip>
      </ButtonGroup>
    </div>
  );
};

export default ToolBar;
