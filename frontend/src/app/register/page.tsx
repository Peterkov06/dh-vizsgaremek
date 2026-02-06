"use client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

const page = () => {
  const formSchema = z.object({
    email: z.email({ error: "Érvénytelen email cím" }),
    password: z
      .string()
      .min(8, { error: "A jelszónak legalább 8 karakternek kell lennie" })
      .max(24, { error: "A jelszó maximum 24 karakter lehet" })
      .regex(/[A-ZÖÜÓŐÚÉÁŰ]/, {
        error: "A jelszónak tartalmaznia kell legalább egy nagybetűt",
      })
      .regex(/[a-zöüóőúéáű]/, {
        error: "A jelszónak tartalmaznia kell legalább egy kisbetűt",
      })
      .regex(/[0-9]/, {
        error: "A jelszónak tartalmaznia kell legalább egy számot",
      })
      .regex(/[^A-Za-z0-9]/, {
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

  return (
    <section className="flex flex-row h-screen min-h-screen w-full bg-registration-bg justify-center items-center px-10">
      <div className="lg:w-7/12"></div>
      <aside className="w-full lg:w-5/12 h-10/12 bg-background rounded-[1.2rem] p-10">
        <form action="" id="registration" className="w-full h-full">
          <FieldGroup className="w-full h-full flex flex-col justify-between">
            <div className="flex flex-col items-start">
              <h1 className="text-2xl md:text-3xl font-bold text-primary">
                Regisztráció
              </h1>
              <p className="indent-4 text-xs md:text-sm">
                Kérjük adja meg regisztrációs adatait!
              </p>
            </div>
            <Field className="w-full">
              <ToggleGroup
                type="single"
                defaultValue="a"
                spacing={0.1}
                className="justify-center w-full flex bg-primary p-[0.35rem] text-primary-foreground rounded-2xl"
              >
                <ToggleGroupItem
                  value="a"
                  className="flex-1 rounded-[0.8rem] data-[state=on]:text-primary data-[state=on]:bg-background"
                >
                  Tanuló
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="b"
                  className="flex-1 rounded-[0.8rem] data-[state=on]:text-primary data-[state=on]:bg-background"
                >
                  Tanár
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="c"
                  className="flex-1 rounded-[0.8rem] data-[state=on]:text-primary data-[state=on]:bg-background"
                >
                  Szülő
                </ToggleGroupItem>
              </ToggleGroup>
            </Field>
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
            <Button
              variant={"default"}
              type="submit"
              form="registration"
              className="w-full rounded-2xl py-6  md:text-lg"
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

export default page;
