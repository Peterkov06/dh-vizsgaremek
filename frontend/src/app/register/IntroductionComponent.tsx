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
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const IntroductionComponent = () => {
  const formSchema = z.object({
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
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      introduction: "",
      profilePicture: undefined,
    },
    mode: "onTouched",
  });

  return (
    <section className="flex flex-row w-full">
      <div className="lg:w-7/12"></div>
      <aside className="w-full lg:w-5/12 min-h-fit bg-background rounded-[1.2rem] p-10">
        <form action="" id="registration" className="w-full h-full">
          <FieldGroup className="w-full h-full flex flex-col justify-between">
            <div className="flex flex-col items-start">
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-1">
                Bemutatkozás
              </h1>
              <p className="pl-6 text-xs md:text-sm">
                Kérjük mutatkozzon be röviden, és töltsön fel egy profilképet!
              </p>
            </div>

            <FieldSet className="max-w-full">
              <Controller
                name="introduction"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Textarea
                      {...field}
                      aria-invalid={fieldState.invalid}
                      className="border-2 border-border rounded-2xl py-2 text-sm field-sizing-fixed"
                      placeholder="Bemutatkozás"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <div className="w-full h-full flex flex-row justify-center items-center">
                <Avatar className="w-1/3 h-1/3">
                  <AvatarImage src={"https://i.redd.it/o9srxpsm8rm01.png"} />
                </Avatar>
              </div>
              <Controller
                name="profilePicture"
                control={form.control}
                render={({
                  field: { value, onChange, ...fieldProps },
                  fieldState,
                }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Input
                      {...fieldProps}
                      type="file"
                      accept="image/png, image/jpeg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          console.log(file.type);
                          form.setValue("profilePicture", file);
                        }
                      }}
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
              form="registration"
              className="w-full rounded-2xl py-6  md:text-lg"
              disabled={!form.formState.isValid}
            >
              Regisztráció
            </Button>
          </FieldGroup>
        </form>
      </aside>
    </section>
  );
};

export default IntroductionComponent;
