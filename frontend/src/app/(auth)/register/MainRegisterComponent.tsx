"use client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import * as z from "zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRegistrationContext } from "./RegistrationContextManager";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const MainRegisterComponent = () => {
  const formSchema = z.object({
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
        error:
          "A jelszónak tartalmazinia kell legalább egy speciális karaktert",
      }),
    role: z.enum(["Student", "Teacher", "Parent"]),
    accceptedTerms: z.boolean().refine(
      (val) => val,
      "Kérjük, elfogadja a felhasználási feltételeket!",
    ),
  });

  type MainFormData = z.infer<typeof formSchema>;

  const form = useForm<MainFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "Student",
      accceptedTerms: false,
    },
    mode: "onTouched",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { updateData, setCurrentStep, currentStep } = useRegistrationContext();

  const onSubmit = async (data: MainFormData) => {
    updateData(data);
    setCurrentStep(currentStep + 1);
  };

  return (
    <section className="flex flex-row w-full">
      <div className="lg:w-7/12"></div>
      <aside className="w-full lg:w-5/12 min-h-fit bg-background rounded-[1.2rem] p-10">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id="registration"
          className="w-full h-full"
        >
          <FieldGroup className="w-full h-full flex flex-col justify-between">
            <div className="flex flex-col items-start">
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-1">
                Regisztráció
              </h1>
              <p className="pl-6 text-xs md:text-sm">
                Kérjük adja meg regisztrációs adatait!
              </p>
            </div>
            <Controller
              control={form.control}
              name="role"
              render={({ field, fieldState }) => (
                <RadioGroup
                  className="justify-center w-full flex bg-primary p-[0.35rem] text-primary-foreground rounded-2xl gap-0"
                  defaultValue={field.value}
                  onChange={field.onChange}
                >
                  <FieldLabel
                    htmlFor="student"
                    className="flex-1 rounded-[0.65rem]! transition-all cursor-pointer has-data-[state=checked]:text-primary has-data-[state=checked]:bg-background has-data-[state=checked]:font-bold border-none"
                  >
                    <Field orientation="horizontal" className="w-full p-2!">
                      <FieldContent className="w-full flex flex-row justify-center">
                        <FieldTitle>Tanuló</FieldTitle>
                      </FieldContent>
                      <RadioGroupItem
                        value="Student"
                        id="student"
                        className="peer sr-only"
                      />
                    </Field>
                  </FieldLabel>
                  <FieldLabel
                    htmlFor="teacher"
                    className="flex-1 rounded-[0.65rem]! transition-all cursor-pointer has-data-[state=checked]:text-primary has-data-[state=checked]:bg-background has-data-[state=checked]:font-bold border-none"
                  >
                    <Field orientation="horizontal" className="w-full p-2!">
                      <FieldContent className="w-full flex flex-row justify-center">
                        <FieldTitle>Tanár</FieldTitle>
                      </FieldContent>
                      <RadioGroupItem
                        value="teacher"
                        id="teacher"
                        className="peer sr-only"
                      />
                    </Field>
                  </FieldLabel>
                  <FieldLabel
                    htmlFor="parent"
                    className="flex-1 rounded-[0.65rem]! transition-all cursor-pointer has-data-[state=checked]:text-primary has-data-[state=checked]:bg-background has-data-[state=checked]:font-bold border-none"
                  >
                    <Field orientation="horizontal" className="w-full p-2!">
                      <FieldContent className="w-full flex flex-row justify-center">
                        <FieldTitle className="w-fit">Szülő</FieldTitle>
                      </FieldContent>
                      <RadioGroupItem
                        value="parent"
                        id="parent"
                        className="peer sr-only"
                      />
                    </Field>
                  </FieldLabel>
                </RadioGroup>
              )}
            />
            <FieldSet>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="w-full" data-invalid={fieldState.invalid}>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      type="text"
                      placeholder="Email cím"
                      className="border-2 border-border rounded-2xl py-5 text-sm"
                      onChange={field.onChange}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="w-full" data-invalid={fieldState.invalid}>
                    <InputGroup className="border-2 border-border rounded-2xl py-5 text-sm">
                      <InputGroupInput
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Jelszó"
                        aria-invalid={fieldState.invalid}
                        onChange={field.onChange}
                        
                      />
                      <InputGroupAddon align={"inline-end"}>
                        <InputGroupButton variant={"ghost"} size={"icon-sm"} type="button" onClick={() => setShowPassword(prev => !prev)}>
                          <EyeIcon
                            className={showPassword ? "" : "hidden"}
                          />
                          <EyeOffIcon
                            className={showPassword ? "hidden" : ""}
                          />
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldSet>
            <FieldGroup>
              <Controller control={form.control} name="accceptedTerms" render={({field, fieldState}) => (
                <Field orientation={"horizontal"} className="">
                <Checkbox
                  id="terms-and-conditions"
                  className="border-2 border-border"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FieldLabel
                  htmlFor="terms-and-conditions"
                  className="font-normal"
                >
                  Elolvastam és elfogadom a felhasználási feltételeket
                </FieldLabel>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
              </Field>
              )} />
            </FieldGroup>
            <Button
              variant={"default"}
              type="submit"
              form="registration"
              className="w-full rounded-2xl py-6 md:text-lg cursor-pointer"
              disabled={!form.formState.isValid}
            >
              Regisztráció
            </Button>

            <div className="flex flex-row justify-center items-center">
              <FieldSeparator className="w-full"></FieldSeparator>
              <p className="mx-3 text-sidebar-border text-[0.7rem] whitespace-nowrap">
                Vagy regisztrálj más fiókkal
              </p>
              <FieldSeparator className="w-full"></FieldSeparator>
            </div>
            <FieldSet className="flex-row justify-center">
              <Button>A</Button>
              <Button>B</Button>
              <Button>C</Button>
            </FieldSet>
          </FieldGroup>
        </form>
      </aside>
    </section>
  );
};

export default MainRegisterComponent;
