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

const page = () => {
  const formSchema = z.object({
    email: z.email({ error: "Érvénytelen email cím" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
    mode: "onTouched",
  });

  return (
    <div className="min-h-screen w-full bg-registration-bg flex flex-col justify-center items-center px-10">
      <section className="flex flex-row w-full">
        <div className="lg:w-7/12"></div>
        <aside className="w-full lg:w-5/12 min-h-fit bg-background rounded-[1.2rem] p-10">
          <form action="" id="forgot-password" className="w-full h-full">
            <FieldGroup className="w-full h-full flex flex-col justify-between">
              <div className="flex flex-col items-start">
                <h1 className="text-3xl md:text-4xl font-bold text-primary mb-1">
                  Elfelejtett jelszó
                </h1>
                <p className="pl-6 text-xs md:text-sm">
                  Kérjük, írja be a regisztrációkor megadott email címét!
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
              </FieldSet>
              <Button
                variant={"default"}
                type="submit"
                form="forgot-password"
                className="w-full rounded-2xl py-6 md:text-lg cursor-pointer"
                disabled={!form.formState.isValid}
              >
                Jelszó visszaállítása
              </Button>
            </FieldGroup>
          </form>
        </aside>
      </section>
    </div>
  );
};

export default page;
