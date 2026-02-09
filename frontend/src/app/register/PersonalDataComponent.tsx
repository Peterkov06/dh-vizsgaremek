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
import { useState } from "react";

const PersonalDataComponent = () => {
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
    });
  
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        email: "",
        password: "",
      },
      mode: "onTouched",
    });
  
    const [accceptedTerms, setAccceptedTerms] = useState<boolean>(false);
  
    return (
      <section className="flex flex-row w-full">
        <div className="lg:w-7/12"></div>
        <aside className="w-full lg:w-5/12 min-h-fit bg-background rounded-[1.2rem] p-10">
          <form action="" id="registration" className="w-full h-full">
            <FieldGroup className="w-full h-full flex flex-col justify-between">
              <div className="flex flex-col items-start">
                <h1 className="text-3xl md:text-4xl font-bold text-primary mb-1">
                  Személyes adatok
                </h1>
                <p className="pl-6 text-xs md:text-sm">
                  Kérjük töltse ki a regisztrációhoz szükséges személyes adatait!
                </p>
              </div>
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
                      <Input
                        {...field}
                        type="password"
                        placeholder="Jelszó"
                        aria-invalid={fieldState.invalid}
                        className="border-2 border-border rounded-2xl py-5 text-sm"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldSet>
              <FieldGroup>
                <Field orientation={"horizontal"} className="">
                  <Checkbox
                    id="terms-and-conditions"
                    className="border-2 border-border"
                    checked={accceptedTerms}
                    onCheckedChange={() => setAccceptedTerms((prev) => !prev)}
                  />
                  <FieldLabel
                    htmlFor="terms-and-conditions"
                    className="font-normal"
                  >
                    Elolvastam és elfogadom a felhasználási feltételeket
                  </FieldLabel>
                </Field>
              </FieldGroup>
              <Button
                variant={"default"}
                type="submit"
                form="registration"
                className="w-full rounded-2xl py-6  md:text-lg"
                disabled={!accceptedTerms || !form.formState.isValid}
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
    )
}

export default PersonalDataComponent