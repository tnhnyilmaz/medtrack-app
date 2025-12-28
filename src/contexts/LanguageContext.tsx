import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import i18n from "../i18n";

const LANGUAGE_STORAGE_KEY = "@language_preference";

type LanguageContextType = {
    language: string;
    changeLanguage: (lang: string) => Promise<void>;
    isLoaded: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState(i18n.language || "tr");
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const loadLanguage = async () => {
            try {
                const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
                if (savedLanguage) {
                    await i18n.changeLanguage(savedLanguage);
                    setLanguage(savedLanguage);
                } else {
                    // If no preference found, ensure we sync state with whatever i18n initialized with
                    setLanguage(i18n.language);
                }
            } catch (error) {
                console.error("Error loading language preference:", error);
            } finally {
                setIsLoaded(true);
            }
        };
        loadLanguage();
    }, []);

    const changeLanguage = async (lang: string) => {
        try {
            await i18n.changeLanguage(lang);
            setLanguage(lang);
            await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
        } catch (error) {
            console.error("Error saving language preference:", error);
        }
    };

    if (!isLoaded) {
        return null;
    }

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, isLoaded }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within LanguageProvider");
    }
    return context;
}
