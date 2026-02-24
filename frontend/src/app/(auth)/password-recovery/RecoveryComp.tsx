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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";

type RecoveryType = {
  email: string;
  token: string;
  new_password: string;
};
type RecoveryDTOType = {
  newPassword: string;
};

const RecoveryComp = () => {
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const formSchema = z
    .object({
      newPassword: z
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
      newPasswordAgain: z.string().min(1, { error: "A jelszó nem egyezik" }),
    })
    .superRefine((val, ctx) => {
      if (val.newPassword !== val.newPasswordAgain) {
        ctx.addIssue({
          code: "custom",
          input: val.newPasswordAgain,
          message: "A jelszó nem egyezik",
          path: ["newPasswordAgain"],
        });
      }
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      newPasswordAgain: "",
    },
    mode: "onTouched",
  });

  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showNewPasswordAgain, setShowNewPasswordAgain] =
    useState<boolean>(false);

  const sendRecoveryPassword = async (data: RecoveryDTOType) => {
    if (!email || !token) return false;
    const cleanToken = token.replace(/ /g, "+");

    let sendBody: RecoveryType = {
      email: email,
      token: cleanToken,
      new_password: data.newPassword,
    };

    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendBody),
    });
    return response.ok;
  };

  const onSubmit = async (data: RecoveryDTOType) => {
    let res = await sendRecoveryPassword(data);
    if (res) setIsSent(true);
  };

  const [isSent, setIsSent] = useState<boolean>(false);

  return (
    <div className="min-h-screen w-full bg-registration-bg flex flex-col justify-center items-center px-10">
      <section className="flex flex-row w-full">
        <div className="lg:w-7/12"></div>
        <aside className="w-full lg:w-5/12 min-h-fit bg-background rounded-[1.2rem] p-10">
          {!isSent ? (
            <form
              action=""
              id="registration"
              className="w-full h-full"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FieldGroup className="w-full h-full flex flex-col justify-between">
                <div className="flex flex-col items-start">
                  <h1 className="text-3xl md:text-4xl font-bold text-primary mb-1">
                    Új jelszó beállítása
                  </h1>
                  <p className="pl-6 text-xs md:text-sm">
                    Kérjük, adjon meg egy új jelszót!
                  </p>
                </div>
                <FieldSet>
                  <Controller
                    name="newPassword"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field
                        className="w-full"
                        data-invalid={fieldState.invalid}
                      >
                        <InputGroup className="border-2 border-border rounded-2xl py-5 text-sm">
                          <InputGroupInput
                            {...field}
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Új jelszó"
                            aria-invalid={fieldState.invalid}
                            onChange={field.onChange}
                          />
                          <InputGroupAddon align={"inline-end"}>
                            <InputGroupButton
                              variant={"ghost"}
                              size={"icon-sm"}
                              type="button"
                              onClick={() =>
                                setShowNewPassword((prev) => !prev)
                              }
                            >
                              <EyeIcon
                                className={showNewPassword ? "" : "hidden"}
                              />
                              <EyeOffIcon
                                className={showNewPassword ? "hidden" : ""}
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
                  <Controller
                    name="newPasswordAgain"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field
                        className="w-full"
                        data-invalid={fieldState.invalid}
                      >
                        <InputGroup className="border-2 border-border rounded-2xl py-5 text-sm">
                          <InputGroupInput
                            {...field}
                            type={showNewPasswordAgain ? "text" : "password"}
                            placeholder="Új jelszó újra"
                            aria-invalid={fieldState.invalid}
                            onChange={field.onChange}
                          />
                          <InputGroupAddon align={"inline-end"}>
                            <InputGroupButton
                              variant={"ghost"}
                              size={"icon-sm"}
                              type="button"
                              onClick={() =>
                                setShowNewPasswordAgain((prev) => !prev)
                              }
                            >
                              <EyeIcon
                                className={showNewPasswordAgain ? "" : "hidden"}
                              />
                              <EyeOffIcon
                                className={showNewPasswordAgain ? "hidden" : ""}
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
                <Button
                  variant={"default"}
                  type="submit"
                  form="registration"
                  className="w-full rounded-2xl py-6 md:text-lg cursor-pointer"
                  disabled={!form.formState.isValid}
                >
                  Új jelszó beállítása
                </Button>
              </FieldGroup>
            </form>
          ) : (
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-1">
                Jelszavad sikeresen visszaállítotuk!
              </h1>
              <p className="pl-6 text-xs md:text-sm">
                Kérjük, lépjen be mégegyszer!
              </p>
            </div>
          )}
        </aside>
      </section>
    </div>
  );
};

export default RecoveryComp;
