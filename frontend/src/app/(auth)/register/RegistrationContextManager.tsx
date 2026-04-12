"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { z } from "zod";

export const fullRegistrationData = z.object({
  email: z.email({ error: "Érvénytelen email cím" }),
  password: z
    .string()
    .min(8, { error: "A jelszónak legalább 8 karakternek kell lennie" })
    .max(24, { error: "A jelszó maximum 24 karakter lehet" })
    .regex(/[\p{Lu}]/u, {
      error: "A jelszónak tartalmaznia kell legalább egy nagybetűt",
    })
    .regex(/[\p{Ll}]/u, {
      error: "A jelszónak tartalmaznia kell legalább egy kisbetűt",
    })
    .regex(/[0-9]/, {
      error: "A jelszónak tartalmaznia kell legalább egy számot",
    })
    .regex(/[^\p{L}\p{N}]/u, {
      error: "A jelszónak tartalmazinia kell legalább egy speciális karaktert",
    }),
  role: z.enum(["Student", "Teacher", "Parent"]),
  introduction: z
    .string({
      error: "Kérjük írjon egy rövid bemutatkozó szöveget!",
    })
    .nonempty({
      error: "Kérjük írjon egy rövid bemutatkozó szöveget!",
    }),
  profilePicture: z
    .instanceof(File, { error: "Kérjük töltsön fel egy profilképet" })
    .refine(
      (file) => file.size > 0 && file.type.startsWith("image/"),
      "Kérjük töltsön fel egy kép formátumú fájlt!",
    ),
  fullname: z.string().nonempty({ error: "Név megadása kötelező" }),
  nickname: z.string().nonempty({ error: "Becenév megadása kötelező" }),
  dateOfBirth: z
    .date({ error: "Születési dátum megadása kötelező" })
    .min(new Date(1900, 1, 1), {
      error: "Adjon meg érvényes születési dátumot!",
    })
    .max(new Date((new Date().getFullYear() - 12).toString()), {
      error: "12 évesnél idősebbnek kell lennie!",
    }),
  postalCode: z
    .string()
    .nonempty({ error: "Irányítószám megadása kötelező" })
    .regex(/^[0-9]{4}$/, { error: "Érvénytelen irányítószám" }),
  cityName: z.string().nonempty({ error: "Városnév megadása kötelező" }),
  homeAddress: z.string().nonempty({ error: "Cím megadása kötelező" }),
  accceptedTerms: z.boolean(),
});

export type RegistrationData = z.infer<typeof fullRegistrationData>;
export type PatrialRegistrationData = Partial<RegistrationData>;

type RegistrationContextType = {
  data: PatrialRegistrationData;
  updateData: (data: PatrialRegistrationData) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  submitRegistration: (
    finalStepData: PatrialRegistrationData,
  ) => Promise<{ success: boolean; error?: string }>;
};

export const RegistrationContext = createContext<
  RegistrationContextType | undefined
>(undefined);

const RegistrationContextManager = (props: { children: ReactNode }) => {
  const [data, setData] = useState<PatrialRegistrationData>({});
  const [currentStep, setCurrentStep] = useState<number>(0);
  const router = useRouter();

  const updateData = (data: PatrialRegistrationData) => {
    setData((prev) => ({ ...prev, ...data }));
  };

  const submitRegistration = async (finalStepData: PatrialRegistrationData) => {
    try {
      const mergedData = { ...data, ...finalStepData };
      const validatedData = await fullRegistrationData.parseAsync(mergedData);
      const backendData = convertToBackendData(validatedData);
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(backendData),
      });
      const result = response.headers
        .get("content-type")
        ?.includes("application/json")
        ? await response.json()
        : null;

      if (response.status !== 201) {
        return {
          success: false,
          error: result.error || "Sikertelen regisztráció",
        };
      }
      return { success: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          error: "Hibás adatok! Kérjük ellenőrizze a bevitt adatokat!",
        };
      }
      return { success: false, error: "Ismeretlen hiba történt!" };
    }
  };

  const convertToBackendData = (data: RegistrationData) => {
    return {
      email: data.email,
      password: data.password,
      role: data.role,
      nickname: data.nickname,
      address: data.homeAddress,
      postal_code: data.postalCode,
      city: data.cityName,
      date_of_birth: data.dateOfBirth.toISOString(),
      introduction: data.introduction,
      full_name: data.fullname,
      url: null,
    };
  };

  return (
    <RegistrationContext.Provider
      value={{
        data,
        updateData,
        currentStep,
        setCurrentStep,
        submitRegistration,
      }}
    >
      {props.children}
    </RegistrationContext.Provider>
  );
};

export const useRegistrationContext = () => {
  const context = useContext(RegistrationContext);
  if (context === undefined) {
    throw new Error(
      "useRegistrationContext must be used within a RegistrationContextProvider",
    );
  }
  return context;
};

export default RegistrationContextManager;
