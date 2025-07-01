import { ReactNode } from "react";
interface AuthContextType {
    userId?: string;
    loaded: boolean;
    loggedIn: boolean;
    logout: () => void;
    login: () => Promise<void>;
    getToken: () => Promise<string | undefined>;
}
export declare function AuthProvider({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useAuth(): AuthContextType;
export {};
