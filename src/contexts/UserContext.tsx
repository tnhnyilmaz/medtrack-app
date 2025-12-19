import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  clearUser,
  getUser,
  saveUser,
  userExists,
} from "../database/userRepository";

interface UserProfile {
  name: string;
  email: string;
  birthday: Date | null;
  gender: "male" | "female" | null;
  photo: string | null;
}

interface UserContextProps {
  user: UserProfile;
  isOnboardingCompleted: boolean;
  isLoading: boolean;
  updateUser: (data: Partial<UserProfile>) => void;
  updateUserPhoto: (photoUri: string) => Promise<void>;
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
    gender: null,
    photo: null,
  });
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Check if user exists in SQLite database
      const exists = await userExists();

      if (exists) {
        const dbUser = await getUser();
        if (dbUser) {
          setUser({
            name: dbUser.name,
            email: dbUser.email,
            birthday: dbUser.birthday ? new Date(dbUser.birthday) : null,
            gender: dbUser.gender,
            photo: dbUser.photo,
          });
          setIsOnboardingCompleted(true);
        }
      } else {
        // Fallback: Check AsyncStorage for backward compatibility
        const onboarded = await AsyncStorage.getItem("isOnboardingCompleted");
        if (onboarded === "true") {
          const storedUser = await AsyncStorage.getItem("userProfile");
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.birthday) {
              parsedUser.birthday = new Date(parsedUser.birthday);
            }
            setUser(parsedUser);
            // Migrate to SQLite
            await saveUser({
              name: parsedUser.name,
              email: parsedUser.email,
              birthday: parsedUser.birthday?.toISOString() || null,
              gender: parsedUser.gender,
              photo: parsedUser.photo,
            });
          }
          setIsOnboardingCompleted(true);
        }
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
      return newUser;
    });
  };

  const updateUserPhoto = async (photoUri: string) => {
    try {
      const updatedUser = { ...user, photo: photoUri };
      setUser(updatedUser);
      // Save to database
      await saveUser({
        name: updatedUser.name,
        email: updatedUser.email,
        birthday: updatedUser.birthday?.toISOString() || null,
        gender: updatedUser.gender,
        photo: photoUri,
      });
    } catch (error) {
      console.error("Failed to update photo:", error);
    }
  };

  const completeOnboarding = async () => {
    try {
      // Save user to SQLite database
      await saveUser({
        name: user.name,
        email: user.email,
        birthday: user.birthday?.toISOString() || null,
        gender: user.gender,
        photo: user.photo,
      });

      // Also set AsyncStorage flag for backward compatibility
      await AsyncStorage.setItem("isOnboardingCompleted", "true");
      setIsOnboardingCompleted(true);
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
    }
  };

  const resetOnboarding = async () => {
    try {
      // Clear SQLite user data
      await clearUser();

      // Clear AsyncStorage
      await AsyncStorage.removeItem("isOnboardingCompleted");
      await AsyncStorage.removeItem("userProfile");

      setUser({
        name: "",
        email: "",
        birthday: null,
        gender: null,
        photo: null,
      });
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
        updateUserPhoto,
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
