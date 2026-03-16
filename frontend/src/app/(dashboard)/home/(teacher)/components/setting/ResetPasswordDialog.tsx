"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldSet } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, Save } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
const passwordField = z
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
  });

const formSchema = z.object({
  old_password: passwordField,
  new_password: passwordField,
});

type FormData = z.infer<typeof formSchema>;

const ResetPasswordDialog = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (data: FormData) => {
    // const res = await submitLogin(data);
    console.log(data);
  };

  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-linear-to-tl from-foreground to-[#868686] mt-3 lg:mt-0 text-lg lg:text-xl w-fit h-10 lg:h-12">
          Jelszó módosítása
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">Jelszó módosítása</DialogTitle>
          <DialogDescription>
            Kérjük add meg a jelenlegi és az új jelszavad
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id="login"
          className="w-full h-full"
        >
          <FieldGroup className="w-full h-full flex flex-col justify-between">
            <FieldSet>
              <div>
                <h1>Jelenlegi jelszavad:</h1>
                <Controller
                  name="old_password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field className="w-full" data-invalid={fieldState.invalid}>
                      <InputGroup className="border-2 border-border rounded-2xl py-5 text-sm">
                        <InputGroupInput
                          {...field}
                          type={showOldPassword ? "text" : "password"}
                          placeholder="Jelenlegi jelszó..."
                          aria-invalid={fieldState.invalid}
                          onChange={field.onChange}
                        />
                        <InputGroupAddon align={"inline-end"}>
                          <InputGroupButton
                            variant={"ghost"}
                            size={"icon-sm"}
                            type="button"
                            onClick={() => setShowOldPassword((prev) => !prev)}
                          >
                            <EyeIcon
                              className={showOldPassword ? "" : "hidden"}
                            />
                            <EyeOffIcon
                              className={showOldPassword ? "hidden" : ""}
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
              </div>
              <div>
                <h1>Új jelszavad:</h1>
                <Controller
                  name="new_password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field className="w-full" data-invalid={fieldState.invalid}>
                      <InputGroup className="border-2 border-border rounded-2xl py-5 text-sm">
                        <InputGroupInput
                          {...field}
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Új jelszó..."
                          aria-invalid={fieldState.invalid}
                          onChange={field.onChange}
                        />
                        <InputGroupAddon align={"inline-end"}>
                          <InputGroupButton
                            variant={"ghost"}
                            size={"icon-sm"}
                            type="button"
                            onClick={() => setShowNewPassword((prev) => !prev)}
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
              </div>
            </FieldSet>
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button
            variant={"default"}
            type="submit"
            form="login"
            className="w-full rounded-2xl py-6 md:text-lg cursor-pointer bg-linear-to-tl from-foreground to-[#868686]"
            disabled={!form.formState.isValid}
          >
            <Save></Save>
            Módosítás
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordDialog;
