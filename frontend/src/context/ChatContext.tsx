import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  // Dispatch,
} from "react";
import { AuthContext } from "./AuthContext";

// Define the shape of the state
interface ChatState {
  chatId: string;
  user: any; // Replace 'any' with a more specific type if available
}

// Define the shape of the action
interface ChatAction {
  type: string;
  payload: any; // Replace 'any' with a more specific type if available
}

// Define the shape of the context's value
interface ChatContextType {
  data: ChatState;
  dispatch: React.Dispatch<any>; // Replace 'any' with a more specific action type if available
}

// Define a default state
const DEFAULT_STATE: ChatState = {
  chatId: "null",
  user: {},
};

// Create the context with a default value
export const ChatContext = createContext<ChatContextType>({
  data: DEFAULT_STATE,
  dispatch: () => {}, // No-op function
});

// Define the props for the provider
interface ChatContextProviderProps {
  children: ReactNode;
}

export const ChatContextProvider: React.FC<ChatContextProviderProps> = ({
  children,
}) => {
  const { currentUser } = useContext(AuthContext);

  const INITIAL_STATE: ChatState = {
    chatId: "null",
    user: {},
  };

  const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
    switch (action.type) {
      case "CHANGE_USER":
        // Ensure currentUser is not null before accessing its properties
        if (currentUser) {
          return {
            ...state,
            user: action.payload,
            chatId:
              currentUser.uid > action.payload.uid
                ? currentUser.uid + action.payload.uid
                : action.payload.uid + currentUser.uid,
          };
        }
        return state;

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
