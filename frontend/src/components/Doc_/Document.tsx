import { useRef, useState, useMemo, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase-config";
import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";

import ReactQuill from "react-quill";
import ToolBar from "./Toolbar";
import "react-quill/dist/quill.snow.css";
import { SuiteData } from "../../interfaces/SuiteData";
import "./Document.scss";
import { debounce } from "../../utils/Time";
import { CommentType } from "../../interfaces/CommentType";
import { SuiteProps } from "../../interfaces/SuiteProps";

import { app as firebaseApp } from '../../firebase-config'
import { QuillBinding } from "y-quill";
import QuillCursors from "quill-cursors";
import * as Y from 'yjs'
import { FireProvider } from "y-fire";

ReactQuill.Quill.register('modules/cursors', QuillCursors)

function getRandomHexColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i =  0; i <  6; i++) {
    color += letters[Math.floor(Math.random() *  16)];
  }
  return color;
}


const Document: React.FC<SuiteProps> = ({ suiteId, suiteTitle, setSuiteTitle }: SuiteProps) => {
  //Set the current value of the text editor or the react-quill component
  const [value, setValue] = useState<string>("");
  //Reference the react-quill component
  const quillRef = useRef<ReactQuill>(null);
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isSpellCheckEnabled, setSpellCheckEnabled] = useState<boolean>(true);
  const isSharePage = window.location.pathname.includes('/doc/share')

  const [isLoading, setIsLoading] = useState(true)
  const [latestLastEdited, setLatestLastEdited] = useState<string | null>(null);

  const [user] = useAuthState(auth);

  const documentPath = `/sharedDocs/${suiteId}`

  useEffect(() => {
    if(isSharePage && !isLoading){
      // A Yjs document holds the shared data
      const ydoc = new Y.Doc()

      const yprovider = new FireProvider({ firebaseApp, ydoc, path: documentPath });

      if(yprovider.awareness){
        yprovider.awareness.setLocalStateField('user', {
          user: user?.email,
          color: getRandomHexColor()
        })

        yprovider.awareness.setLocalState({
          user: {
            name: user?.email,
            color: getRandomHexColor()
          },
        });


        // Define a shared text type on the document
        const ytext = ydoc.getText('quill')

        // "Bind" the quill editor to a Yjs text type.
        const binding = new QuillBinding(ytext, quillRef.current?.getEditor(), yprovider.awareness)

        return () => {
          yprovider.destroy()
          binding.destroy()
          ydoc.destroy()
        }
      }

      return () => {
        yprovider.destroy()
        ydoc.destroy()
      }
    }
  }, [isSharePage, isLoading])



  //---------------Function to render the document in the database----------------
  useEffect(() => {
    const userEmail = user?.email
    if (userEmail && !isSharePage) {
      fetchDocumentFromFirestore(userEmail)
    } else if(userEmail && isSharePage){
      fetchSharedDocumentFromFirestore()
      setIsLoading(false)
    }
  }, []);

  const fetchDocumentFromFirestore = async (userEmail: string) => {
    try {
      if (userEmail) {
        const userDocRef = doc(db, "users", userEmail);
        const docSnapshot = await getDoc(userDocRef);
        if (docSnapshot.exists()) {
          const documentsArray: SuiteData[] = docSnapshot.data().documents || [];
          const document = documentsArray.find((doc: SuiteData) => doc.id === suiteId);
          if (document && document.content) {
            setValue(document.content);
            setSuiteTitle(document.title)
            setComments(document.comments || []);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  };

  const fetchSharedDocumentFromFirestore = async () => {
    try {
        const sharedDocRef = doc(db, "sharedDocs", suiteId);
        const docSnapshot = await getDoc(sharedDocRef);
        if (docSnapshot.exists()) {
          const {title, comments} = docSnapshot.data() as SuiteData;
          if (title && comments) {
            setSuiteTitle(title)
            setComments(comments || []);
          }
        }
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  };
  //____________________________________________________________
  //---------------Function to save the document to the database----------------
  // Use useEffect to call saveDocumentToFirestore whenever the value changes
  useEffect(() => {
    const userEmail = user?.email;
    if (userEmail && !isSharePage) {

        debouncedSaveDocumentToFirestore(
          userEmail,
          suiteId,
          suiteTitle,
          value,
          comments
        );
    }
  }, [value, suiteTitle, comments]); // Only re-run the effect if 'value' changes

  useEffect(() => {

    const userEmail = user?.email

    if(userEmail && isSharePage && !isLoading){

      saveSharedDocumentToFirestore(
        suiteId,
        suiteTitle,
        value,
        comments
      );

    }

  }, [latestLastEdited, suiteTitle])

  const saveDocumentToFirestore = async (
    userEmail: string,
    suiteId: string,
    suiteTitle: string,
    text: string,
    comments: CommentType[]
  ): Promise<void> => {
    try {
      const userDocRef = doc(db, "users", userEmail);
      const docSnapshot = await getDoc(userDocRef);
      let documentsArray: SuiteData[] = [];

      if (docSnapshot.exists()) {
        documentsArray = docSnapshot.data().documents || [];
      }

      const now = new Date().toISOString(); // Get current time as ISO string

      // Check if the document with the given ID already exists
      const existingDocIndex = documentsArray.findIndex(doc => doc.id === suiteId);

      if (existingDocIndex !== -1) {
        // Update the existing document's title, content, and last edited time
        documentsArray[existingDocIndex] = {
          ...documentsArray[existingDocIndex], // Spread existing properties
          title: suiteTitle,
          content: text,
          lastEdited: now, // Update last edited time
          comments
        };
      } else {
        // Add a new document with a unique ID and current last edited time
        documentsArray.push({
          id: suiteId,
          title: suiteTitle,
          content: text,
          lastEdited: now, // Set last edited time for new document
          type: 'document',
          isTrash: false,
          isShared: false,
          comments
        });
      }

      // Update the user's document with the new or updated documents array
      await setDoc(
        userDocRef,
        { documents: documentsArray },
        { merge: true }

      );
      console.log("Document saved successfully");
    } catch (error) {
      console.error("Error saving document:", error);
    }
  };

  //Save a shared document to firestore
  const saveSharedDocumentToFirestore = async (
    suiteId: string,
    suiteTitle: string,
    text: string,
    comments: CommentType[]
  ): Promise<void> => {
    try {
      if (isSharePage) {
        // Retrieve the existing document
        const sharedDocRef = doc(db, "sharedDocs", `${suiteId}`);
        const docSnapshot = await getDoc(sharedDocRef);
        let sharedDocument: SuiteData;

        if (docSnapshot.exists() && user?.email) {
          // If the document exists, update only the comments and latestLastEdited fields
          sharedDocument = docSnapshot.data() as SuiteData;
          sharedDocument.comments = comments;
          sharedDocument.lastEdited = latestLastEdited || "";
          sharedDocument.title=suiteTitle

          if (sharedDocument.user && !sharedDocument.user.includes(user?.email)) {
            sharedDocument.user.push(user?.email);
          } else if (!sharedDocument.user) {
            sharedDocument.user = [user?.email];
          }
        } else {
          // If the document does not exist, construct a new SuiteData object
          sharedDocument = {
            id: suiteId,
            title: suiteTitle,
            lastEdited: latestLastEdited || "",
            type: 'document',
            isTrash: false,
            isShared: isSharePage,
            comments: comments
          };
        }

        // Save the document with the updated fields
        await setDoc(sharedDocRef, sharedDocument, { merge: true });
        console.log("Shared document saved successfully");
      } else {
        // Handle the case where isSharePage is false (if needed)
      }
    } catch (error) {
      console.error("Error saving shared document:", error);
    }
  };


  const debouncedSaveDocumentToFirestore = debounce(
    saveDocumentToFirestore,
    2000 // Delay in milliseconds
  );

  //____________________________________________________________

  const toggleSearchVisibility = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const handleSearch = debounce((searchTerm: string) => {
    if (searchTerm && quillRef.current) {
      const editor = quillRef.current.getEditor();
      const text = editor.getText();
      const startIndex = text.toLowerCase().indexOf(searchTerm.toLowerCase());

      if (startIndex !== -1) {
        editor.setSelection(startIndex, searchTerm.length); // Highlight the found text
      } else {
        editor.setSelection(0, 0); // Reset selection if not found
      }
    }
  }, 700);

  const handleUndo = () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor() as any;
      editor.history.undo();
    }
  };

  const handleRedo = () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor() as any;
      editor.history.redo();
    }
  };

  const handleToggleSpellCheck = () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const editorElem = editor.root; // This is the editor element
      editorElem.spellcheck = !isSpellCheckEnabled; // Toggle the spellcheck attribute
      setSpellCheckEnabled(!isSpellCheckEnabled); // Update state
    }
  };

  const handleTextTypeChange = (format: string, level?: number) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      if (format === "normal") {
        editor.format("header", false); // Removes any header formatting
      } else {
        editor.format(format, level || false); // Apply header level or blockquote
      }
    }
  };

  const handleFontChange = (font: string) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.format("font", font.toLowerCase().replace(/\s/g, "-"));
    }
  };

  const handleFontSizeSelect = (size: string) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.format("size", size);
    }
  };

  const handleBoldClick = () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.format("bold", !editor.getFormat().bold);
    }
  };

  const handleItalicClick = () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.format("italic", !editor.getFormat().italic);
    }
  };

  const handleUnderlineClick = () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.format("underline", !editor.getFormat().underline);
    }
  };

  const handleStrikeClick = () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.format("strike", !editor.getFormat().strike);
    }
  };

  const handleColorSelect = (color: string) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.format("color", color);
    }
  };

  const handleHighlightSelect = (color: string) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.format("background", color);
    }
  };

  const handleLinkClick = () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection();
      if (range) {
        const url = prompt("Enter the URL");
        if (url) {
          editor.format("link", url);
        }
      }
    }
  };

  const handleAddComment = () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection();
      if (range && range.length > 0) {
        const commentText = prompt("Enter your comment:");
        if (commentText) {
          const comment: CommentType = {
            id: Date.now(),
            text: commentText,
            rangeIndex: range.index,
            rangeLength: range.length,
          };
          setComments((prevComments) => [...prevComments, comment]);

          // Apply custom formatting for commented text
          editor.formatText(range.index, range.length, {
            "comment-id": comment.id,
          });
          editor.formatText(
            range.index,
            range.length,
            "ql-commented-text",
            true
          );
        }
      } else {
        alert("Please select text to comment on.");
      }
    }
  };

  const handleRemoveComment = (commentId: number) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      // Find the comment based on commentId
      const comment = comments.find((c) => c.id === commentId);
      if (comment) {
        // Remove the custom formatting for commented text
        editor.formatText(
          comment.rangeIndex,
          comment.rangeLength,
          "ql-commented-text",
          false
        );
      }

      // Remove the comment from the state
      setComments(comments.filter((c) => c.id !== commentId));
    }
  };

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      if (input.files) {
        const file = input.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (quillRef.current) {
              const editor = quillRef.current.getEditor();
              const range = editor.getSelection(true);
              editor.insertEmbed(range.index, "image", reader.result);
            }
          };
          reader.readAsDataURL(file);
        }
      }
    };
  };

  const handleTextAlignmentChange = (alignment: string) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.format("align", alignment);
    }
  };

  const handleChecklistClick = () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection();
      if (range) {
        const format = editor.getFormat(range.index, range.length);
        editor.format("list", format.list === "checked" ? null : "checked");
      }
    }
  };

  const handleUnorderedListClick = () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const format = editor.getFormat();
      editor.format("list", format.list === "bullet" ? null : "bullet");
    }
  };

  const handleOrderedListClick = () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const format = editor.getFormat();
      editor.format("list", format.list === "ordered" ? null : "ordered");
    }
  };

  const handleIndentClick = (direction: string) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection();
      if (range) {
        const currentIndent = editor.getFormat(range).indent || 0;
        const newIndent =
          direction === "indent" ? currentIndent + 1 : currentIndent - 1;
        editor.format("indent", newIndent > 0 ? newIndent : false);
      }
    }
  };

  const modules = useMemo(
    () => ({
      toolbar: false, // Keep this false if you are using a custom toolbar
      cursors: true,
      history: {
        delay: 500,
        maxStack: 100,
        userOnly: true,
      },
    }),
    []
  );

  return (
    <div>
      <ToolBar
        onSearch={handleSearch}
        isSearchVisible={isSearchVisible}
        toggleSearchVisibility={toggleSearchVisibility}
        onUndo={handleUndo}
        onRedo={handleRedo}
        isSpellCheckEnabled={isSpellCheckEnabled}
        onToggleSpellCheck={handleToggleSpellCheck}
        onTextTypeChange={handleTextTypeChange}
        onFontChange={handleFontChange}
        onFontSizeSelect={handleFontSizeSelect}
        onBoldClick={handleBoldClick}
        onItalicClick={handleItalicClick}
        onUnderlineClick={handleUnderlineClick}
        onStrikeClick={handleStrikeClick}
        onColorSelect={handleColorSelect}
        onHighlightSelect={handleHighlightSelect}
        onLinkClick={handleLinkClick}
        onAddComment={handleAddComment}
        onImageUpload={handleImageUpload}
        onTextAlignmentChange={handleTextAlignmentChange}
        onChecklistClick={handleChecklistClick}
        onUnorderedListClick={handleUnorderedListClick}
        onOrderedListClick={handleOrderedListClick}
        onIndentClick={handleIndentClick}
        onOutdentClick={handleIndentClick}
      />
      <div className="document">
        <ReactQuill
          className="editable-area"
          ref={quillRef}
          value={value}
          onChange={(newValue) => {
            setValue(newValue)
            setLatestLastEdited(new Date().toISOString())
          }}
          modules={modules}
        />
        <div className="comments-section">
          {comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment-text">
                Comment: {comment.text}
                <div className="commented-text-preview">
                  Text:{" "}
                  {quillRef.current
                    ?.getEditor()
                    .getText(comment.rangeIndex, comment.rangeLength)}
                </div>
              </div>
              <button onClick={() => handleRemoveComment(comment.id)}>
                Remove Comment
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Document;