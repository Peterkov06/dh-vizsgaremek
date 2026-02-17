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
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { use, useEffect, useState } from "react";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, isValid, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { useRegistrationContext } from "./RegistrationContextManager";

const PersonalDataComponent = () => {
  const formSchema = z.object({
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
  });

  type PersonalFormData = z.infer<typeof formSchema>;

  const form = useForm<PersonalFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      nickname: "",
      dateOfBirth: new Date(),
      postalCode: "",
      cityName: "",
      homeAddress: "",
    },
    mode: "onTouched",
  });

  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [birthMonth, setBirthMonth] = useState<Date>(new Date());
  const [value, setValue] = useState(format(new Date(), "yyyy.MM.dd."));
  const { updateData, setCurrentStep, currentStep } = useRegistrationContext();

  const onSubmit = async (data: PersonalFormData) => {
    updateData(data);
    setCurrentStep(currentStep + 1);
  };

  return (
    <section className="flex flex-row w-full">
      <div className="lg:w-7/12"></div>
      <aside className="w-full lg:w-5/12 min-h-fit bg-background rounded-[1.2rem] p-10">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id="personalData"
          className="w-full h-full"
        >
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
                name="fullname"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="w-full" data-invalid={fieldState.invalid}>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      type="text"
                      placeholder="Teljes név"
                      className="border-2 border-border rounded-2xl py-5 text-sm"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="nickname"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="w-full" data-invalid={fieldState.invalid}>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      type="text"
                      placeholder="Becenév (opcionális)"
                      className="border-2 border-border rounded-2xl py-5 text-sm"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldSet>
            <FieldSet className="flex flex-col md:flex-row justify-between md:justify-center md:items-center md:gap-2 wfull">
              <Controller
                name="dateOfBirth"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="date-required">
                      Születési dátum
                    </FieldLabel>
                    <InputGroup className="border-2 border-border rounded-2xl py-5 text-sm">
                      <InputGroupInput
                        {...field}
                        aria-invalid={fieldState.invalid}
                        id="date-required"
                        value={value}
                        placeholder="Születési dátum"
                        onChange={(e) => {
                          const vale = e.target.value;
                          setValue(vale);
                          const date = parse(vale, "yyyy.MM.dd.", new Date());
                          if (isValid(date)) {
                            field.onChange(date);
                            form.setValue("dateOfBirth", date);
                            setBirthMonth(date);
                          } else {
                            field.onChange(null);
                          }
                        }}
                        /*onKeyDown={(e) => {
              
                    }}*/
                      />
                      <InputGroupAddon align="inline-end">
                        <Popover
                          open={openDatePicker}
                          onOpenChange={setOpenDatePicker}
                        >
                          <PopoverTrigger asChild>
                            <InputGroupButton
                              id="date-picker"
                              variant="ghost"
                              size="icon-xs"
                              aria-label="Select date"
                            >
                              <CalendarIcon />
                              <span className="sr-only">Select date</span>
                            </InputGroupButton>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto overflow-hidden p-0"
                            alignOffset={-8}
                            sideOffset={10}
                            onFocusOutside={(e) => e.preventDefault()}
                          >
                            <Calendar
                              mode="single"
                              captionLayout="dropdown"
                              weekStartsOn={1}
                              month={birthMonth}
                              onMonthChange={setBirthMonth}
                              selected={field.value}
                              onSelect={(date) => {
                                if (date) {
                                  field.onChange(date);
                                  form.setValue("dateOfBirth", date);
                                  form.setFocus("dateOfBirth");
                                  setValue(format(date, "yyyy.MM.dd."));
                                  setOpenDatePicker(false);
                                }
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="postalCode"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="w-full" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="postal-code">Irányítószám</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      id="postal-code"
                      type="text"
                      placeholder="Irányítószám"
                      className="border-2 border-border rounded-2xl py-5 text-sm"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldSet>
            <FieldSet className="flex flex-col md:flex-row justify-between md:justify-center md:items-center md:gap-2 wfull">
              <Controller
                name="cityName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    {...field}
                    className="w-full"
                    data-invalid={fieldState.invalid}
                  >
                    <Combobox
                      items={["Derecske", "Debrecen", "Mándok"]}
                      onValueChange={field.onChange}
                    >
                      <ComboboxInput
                        placeholder="Város"
                        className="border-2 border-border rounded-2xl py-5 text-sm w-full"
                        value={field.value}
                      />
                      <ComboboxContent>
                        <ComboboxEmpty>
                          Nem találtunk ilyen várost.
                        </ComboboxEmpty>
                        <ComboboxList>
                          {(item: any) => (
                            <ComboboxItem key={item} value={item}>
                              {item}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Combobox>
                  </Field>
                )}
              />
              <Controller
                name="homeAddress"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="w-full" data-invalid={fieldState.invalid}>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      type="text"
                      placeholder="Lakcím (utca, házszám)"
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
              form="personalData"
              className="w-full rounded-2xl py-6 md:text-lg cursor-pointer"
              disabled={!form.formState.isValid}
            >
              Tovább
            </Button>
          </FieldGroup>
        </form>
      </aside>
    </section>
  );
};

export default PersonalDataComponent;
