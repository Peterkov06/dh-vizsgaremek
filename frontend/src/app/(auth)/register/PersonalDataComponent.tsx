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
import { se } from "date-fns/locale";
import { BASE_URL } from "../../api/auth/register/route";
import { is } from "zod/locales";

const PersonalDataComponent = () => {
  const formSchema = z.object({
    fullname: z.string().nonempty({ error: "Név megadása kötelező" }),
    nickname: z.string().optional(),
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
  const [cities, setCities] = useState<string[]>([]);
  const [postalCodes, setPostalCodes] = useState<string[]>([]);
  const [isLoadingCities, setisLoadingCities] = useState<boolean>(false);
  const [isLoadingPostalCodes, setisLoadingPostalCodes] =
    useState<boolean>(false);
  const { updateData, setCurrentStep, currentStep } = useRegistrationContext();
  const postalCodeValid = form.watch("postalCode");
  const cityNameValid = form.watch("cityName");

  const onSubmit = async (data: PersonalFormData) => {
    updateData(data);
    setCurrentStep(currentStep + 1);
  };

  useEffect(() => {
    const searchQuery = form.getValues("cityName");
    if (searchQuery.length < 1) {
      setCities([]);
      return;
    }

    const delayDebounceFunction = setTimeout(async () => {
      setisLoadingCities(true);
      try {
        const response = await fetch(
          BASE_URL + "/cities/search?city=" + searchQuery,
          {
            headers: {
              Accept: "*/*",
            },
          },
        );
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error("Error fetching cities: ", error);
      } finally {
        setisLoadingCities(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFunction);
  }, [cityNameValid]);

  useEffect(() => {
    const searchQuery = form.getValues("postalCode");
    if (searchQuery.length < 1) {
      setCities([]);
      return;
    }

    const delayDebounceFunction = setTimeout(async () => {
      setisLoadingPostalCodes(true);
      try {
        const response = await fetch(
          BASE_URL + "/cities/postal/search?postal=" + searchQuery,
          {
            headers: {
              Accept: "*/*",
            },
          },
        );
        const data = await response.json();
        setPostalCodes(data);
      } catch (error) {
        console.error("Error fetching postal codes: ", error);
      } finally {
        setisLoadingPostalCodes(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFunction);
  }, [postalCodeValid]);

  useEffect(() => {
    const isValid =
      postalCodeValid.length === 4 &&
      form.formState.errors.postalCode === undefined;
    if (!isValid) {
      return;
    }

    const setCity = setTimeout(async () => {
      try {
        const response = await fetch(
          BASE_URL + "/cities/search/city_by_postal?postal=" + postalCodeValid,
          {
            headers: {
              Accept: "*/*",
            },
          },
        );
        const data = await response.json();
        if (data.length === 1) {
          form.setValue("cityName", data[0], { shouldValidate: true });
        }
      } catch (error) {
        console.error("Error fetching cities: ", error);
      }
    }, 300);
    return () => clearTimeout(setCity);
  }, [postalCodeValid, form.formState.errors.postalCode, form]);

  useEffect(() => {
    const isValid =
      cityNameValid.length > 0 && form.formState.errors.cityName === undefined;
    if (!isValid) {
      return;
    }

    const setPostal = setTimeout(async () => {
      try {
        const response = await fetch(
          BASE_URL + "/cities/search/postal_by_city?city=" + cityNameValid,
          {
            headers: {
              Accept: "*/*",
            },
          },
        );
        const data = await response.json();
        if (data.length === 1) {
          form.setValue("postalCode", data[0], { shouldValidate: true });
        }
      } catch (error) {
        console.error("Error fetching postal codes: ", error);
      }
    }, 300);
    return () => clearTimeout(setPostal);
  }, [cityNameValid, form.formState.errors.cityName, form]);

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
                              captionLayout="label"
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
                  <Field
                    {...field}
                    className="w-full"
                    data-invalid={fieldState.invalid}
                  >
                    <FieldLabel htmlFor="postal-code">Irányítószám</FieldLabel>
                    <Combobox
                      items={postalCodes}
                      onValueChange={field.onChange}
                      id="postal-code"
                    >
                      <ComboboxInput
                        placeholder="Irányítószám"
                        className="border-2 border-border rounded-2xl py-5 text-sm w-full"
                        type="number"
                        value={field.value}
                      />
                      <ComboboxContent>
                        <ComboboxEmpty>
                          Nem találtunk ilyen irányítószámot.
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
                    <Combobox items={cities} onValueChange={field.onChange}>
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
