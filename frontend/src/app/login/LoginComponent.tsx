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

const LoginComponent = () => {
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

  const [stayLoggedIn, setstayLoggedIn] = useState<boolean>(false);

  return (
    <section className="flex flex-row w-full">
      <div className="lg:w-7/12"></div>
      <aside className="w-full lg:w-5/12 min-h-fit bg-background rounded-[1.2rem] p-10">
        <form action="" id="login" className="w-full h-full">
          <FieldGroup className="w-full h-full flex flex-col justify-between">
            <div className="flex flex-col items-start">
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-1">
                Bejelentkezés
              </h1>
              <p className="pl-6 text-xs md:text-sm">
                Kérjük adja meg bejelentkezési adatait!
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
            <FieldGroup className="flex flex-row justify-between">
              <Field orientation={"horizontal"} className="w-full">
                <Checkbox
                  id="stay-logged-in"
                  className="border-2 border-border"
                  checked={stayLoggedIn}
                  onCheckedChange={() => setstayLoggedIn((prev) => !prev)}
                />
                <FieldLabel htmlFor="stay-logged-in" className="font-normal">
                  Maradjon bejelentkezve
                </FieldLabel>
              </Field>
              <Field className="w-fit">
                <Button variant={"link"} className="cursor-pointer">
                  Elfelejtett jelszó
                </Button>
              </Field>
            </FieldGroup>
            <Button
              variant={"default"}
              type="submit"
              form="login"
              className="w-full rounded-2xl py-6 md:text-lg cursor-pointer"
              disabled={!form.formState.isValid}
            >
              Bejelentkezés
            </Button>

            <div className="flex flex-row justify-center items-center">
              <FieldSeparator className="w-full"></FieldSeparator>
              <p className="mx-3 text-sidebar-border text-[0.7rem] whitespace-nowrap">
                Vagy lépj be más fiókkal
              </p>
              <FieldSeparator className="w-full"></FieldSeparator>
            </div>
            <FieldSet className="flex-row justify-center">
              <Button>A</Button>
              <Button>B</Button>
              <Button>C</Button>
            </FieldSet>
            <div className="flex flex-col justify-center items-center">
              <p className="text-xs text-sidebar-border">Még nincs fiókod?</p>
              <Button variant={"link"} className="cursor-pointer">
                Regisztrálj!
              </Button>
            </div>
          </FieldGroup>
        </form>
      </aside>
    </section>
  );
};

export default LoginComponent;
