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
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useRegistrationContext } from "./RegistrationContextManager";
import { sub } from "date-fns";
import { useRouter } from "next/navigation";

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

  type IntroductionType = z.infer<typeof formSchema>;

  const form = useForm<IntroductionType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      introduction: "",
      profilePicture: undefined,
    },
    mode: "onTouched",
  });

  const [profilePicture, setProfilePicture] = useState<string>(
    "https://i.redd.it/o9srxpsm8rm01.png",
  );

  const { updateData, submitRegistration } = useRegistrationContext();
  const router = useRouter();

  useEffect(() => {
    return () => {
      if (profilePicture) URL.revokeObjectURL(profilePicture);
    };
  }, [profilePicture]);

  const onSubmit = async (data: IntroductionType) => {
    updateData(data)
    const res = await submitRegistration(data);

    if (res.success) {
      router.push("/login");
    } else {
      alert("Sikertelen regisztráció");
    }
  };

  return (
    <section className="flex flex-row w-full">
      <div className="lg:w-7/12"></div>
      <aside className="w-full lg:w-5/12 min-h-fit bg-background rounded-[1.2rem] p-10">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id="introductionForm"
          className="w-full h-full"
        >
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
                      className="border-2 border-border rounded-2xl py-2 text-sm field-sizing-fixed min-h-40"
                      placeholder="Bemutatkozás"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <div className="w-full min-h-48 md:h-full flex flex-row md:justify-center items-center">
                <Avatar className="h-1/2 w-1/2 md:w-1/4 md:h-1/4">
                  <AvatarImage
                    className="aspect-square"
                    alt="avatar"
                    src={profilePicture}
                  />
                </Avatar>
              </div>
              <Controller
                name="profilePicture"
                control={form.control}
                render={({
                  field: { value, onChange, ...fieldProps },
                  fieldState,
                }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="w-full rounded-2xl md:text-lg"
                  >
                    <Input
                      {...fieldProps}
                      type="file"
                      id="profile-picture-upload"
                      accept="image/png, image/jpeg"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          form.setValue("profilePicture", file);
                          onChange(file);
                          setProfilePicture(URL.createObjectURL(file));
                        }
                      }}
                    />
                    <label
                      htmlFor="profile-picture-upload"
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-foreground text-primary-foreground hover:bg-foreground/90 h-10 px-4 py-6 md:text-lg w-full cursor-pointer"
                    >
                      {profilePicture !== "https://i.redd.it/o9srxpsm8rm01.png"
                        ? "Kép módosítása"
                        : "Profilkép feltöltése"}
                    </label>
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
              form="introductionForm"
              className="w-full rounded-2xl py-6 md:text-lg cursor-pointer"
              disabled={!form.formState.isValid}
            >
              Tovább
            </Button>
          </FieldGroup>
        </form>
      </aside>
      <div className="absolute bg-background p-2 rounded-xl flex flex-col justify-center items-center rotate-10 top-7/12 left-7/12 md:top-7/12 md:left-8/12 lg:top-7/12 lg:left-7/12 -translate-y-4/12 -translate-x-2/12 md:-translate-y-5/12 lg:-translate-x-3/5 lg:-translate-y-2/3 shadow-[6px_6px_0px_0px_#2D5F3F] max-w-52 lg:max-w-fit border-2 border-border">
        <h3 className="font-bold text-sm w-full md:text-lg">Tippek:</h3>
        <ul className="list-inside list-disc text-[0.6rem] md:text-xs">
          <li>egyedül szerepelj a képen, mosolyogj</li>
          <li>az arcod szemből legyen</li>
          <li>kerüld a szemüvegek tükröződését, logókat, túl sötét képeket</li>
          <li>minimum 600x600 px, .png vagy .jpeg</li>
        </ul>
      </div>
    </section>
  );
};

export default IntroductionComponent;
