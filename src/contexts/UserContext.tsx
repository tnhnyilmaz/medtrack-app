import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

interface UserProfile {
  name: string;
  email: string;
  birthday: Date | null;
  photo: string | null;
}

interface UserContextProps {
  user: UserProfile;
  isOnboardingCompleted: boolean;
  isLoading: boolean;
  updateUser: (data: Partial<UserProfile>) => void;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile>({
    name: "",
    email: "",
    birthday: null,
    photo: null,
  });
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("userProfile");
      const onboarded = await AsyncStorage.getItem("isOnboardingCompleted");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        // Correctly restore Date object
        if (parsedUser.birthday) {
          parsedUser.birthday = new Date(parsedUser.birthday);
        }
        setUser(parsedUser);
      }

      if (onboarded === "true") {
        setIsOnboardingCompleted(true);
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (data: Partial<UserProfile>) => {
    setUser((prev) => {
      const newUser = { ...prev, ...data };
      saveUserData(newUser);
      return newUser;
    });
  };

  const saveUserData = async (userData: UserProfile) => {
    try {
      await AsyncStorage.setItem("userProfile", JSON.stringify(userData));
    } catch (error) {
      console.error("Failed to save user data:", error);
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem("isOnboardingCompleted", "true");
      setIsOnboardingCompleted(true);
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
    }
  };

  const resetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem("isOnboardingCompleted");
      await AsyncStorage.removeItem("userProfile");
      setUser({ name: "", email: "", birthday: null, photo: null });
      setIsOnboardingCompleted(false);
    } catch (error) {
      console.error("Failed to reset onboarding:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isOnboardingCompleted,
        isLoading,
        updateUser,
        completeOnboarding,
        resetOnboarding,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
