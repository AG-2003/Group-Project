import { CommentType } from "./CommentType";

export interface SuiteData {
    id: string;
    content: string;
    title: string;
    lastEdited: string;
    type: 'document' | 'sheet' | 'board' | 'powerpoint';
    isTrash: boolean;
    comments?: CommentType[]
}