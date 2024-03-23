export interface SuiteProps {
    suiteId: string;
    suiteTitle: string;
    setSuiteTitle: React.Dispatch<React.SetStateAction<string>>;
    team_id?: string
}