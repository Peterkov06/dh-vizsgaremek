"use client";

import { BASE_URL } from "@/app/api/auth/register/route";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from "@/components/ui/combobox";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Currency, IdName } from "@/lib/models/CourseSearchModel";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Book,
  Captions,
  ChartArea,
  CircleDollarSignIcon,
  CirclePlus,
  Globe,
  MapPin,
  Pen,
  PiggyBank,
  Plus,
  Tag,
  Tags,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import ImageUploader from "./components/ImgUploader";
import AvatarUploader from "./components/AvatarUploader";

const CourseCreator = () => {
  const formSchema = z.object({
    courseName: z.string().nonempty({ error: "Név megadása kötelező" }),
    description: z.string().nonempty({ error: "Leírás megadása kötelező" }),
    tags: z
      .array(z.string())
      .min(1, { message: "Legalább egy címke szükséges" }),
    languages: z
      .array(z.string())
      .min(1, { message: "Legalább egy nyelv szükséges" }),
    location: z
      .array(z.string())
      .min(1, { message: "Legalább egy helyszín szükséges" }),
    level: z.string().nonempty({ message: "Szint megadása kötelező" }),
    subject: z.string().nonempty({ message: "Tantárgy megadása kötelező" }),
    currency: z.string().nonempty({ message: "Árfolyam megadása kötelező" }),
    firstFree: z.enum(["Ingyenes", "Fizetős"], {
      message: "Típus megadása kötelező",
    }),
    price: z
      .number({ message: "Ár megadása kötelező" })
      .min(1, { message: "Az ár nem lehet 1-nél kevesebb" }),
  });
  type CourseCreatorFormData = z.infer<typeof formSchema>;

  const form = useForm<CourseCreatorFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseName: "",
      description: "",
      tags: [],
      languages: [],
      location: [],
      level: "",
      subject: "",
      firstFree: "Ingyenes",
      price: 0,
      currency: "",
    },
    mode: "onTouched",
  });

  const [allTags, setAllTags] = useState<string[]>([]);
  const [tagInputValue, setTagInputValue] = useState("");
  const anchorTag = useRef(null);

  const [allLang, setAllLang] = useState<string[]>([]);
  const [langInputValue, setLangInputValue] = useState("");
  const anchorLang = useRef(null);

  const [allLoc, setAllLoc] = useState<string[]>(["Online"]);
  const [locInputValue, setLocInputValue] = useState("");
  const anchorLoc = useRef(null);

  const [allLevels, setAllLevels] = useState<string[]>([]);
  const [allSubjects, setAllSubjects] = useState<string[]>([]);
  const [allCurrency, setAllCurrency] = useState<Currency[]>([]);

  const [priceInput, setPriceInput] = useState("");

  useEffect(() => {
    const searchQuery = tagInputValue;
    if (searchQuery.length < 1) {
      setAllTags([]);
      return;
    }
    const delayDebounceFunction = setTimeout(async () => {
      try {
        const response = await fetch(
          BASE_URL + "/courses/metadata/tags/" + searchQuery,
          {
            headers: {
              Accept: "*/*",
            },
          },
        );
        const data: IdName[] = await response.json();
        setAllTags(data.map((d) => d.name));
      } catch (error) {
        console.error("Error fetching cities: ", error);
      } finally {
      }
    }, 300);

    return () => clearTimeout(delayDebounceFunction);
  }, [tagInputValue]);

  useEffect(() => {
    const searchQuery = locInputValue;
    if (searchQuery.length < 1) {
      setAllLoc(["Online"]);
      return;
    }
    const delayDebounceFunction = setTimeout(async () => {
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
        setAllLoc(data);
        if ("online".includes(searchQuery.toLowerCase()))
          setAllLoc((prev) => ["Online", ...prev]);
      } catch (error) {
        console.error("Error fetching cities: ", error);
      } finally {
      }
    }, 300);

    return () => clearTimeout(delayDebounceFunction);
  }, [locInputValue]);

  useEffect(() => {
    setLocInputValue("");
  }, [form.watch("location")]);

  const getEverything = async () => {
    const langRes = await fetch(BASE_URL + "/lookups/languages", {
      headers: {
        Accept: "*/*",
      },
    });
    const dataLang: IdName[] = await langRes.json();
    setAllLang(dataLang.map((d) => d.name));

    const levelRes = await fetch(BASE_URL + "/courses/metadata/levels", {
      headers: {
        Accept: "*/*",
      },
    });
    const dataLevel: IdName[] = await levelRes.json();
    setAllLevels(dataLevel.map((d) => d.name));

    const subRes = await fetch(BASE_URL + "/courses/metadata/domains", {
      headers: {
        Accept: "*/*",
      },
    });
    const dataSub: IdName[] = await subRes.json();
    setAllSubjects(dataSub.map((d) => d.name));

    const currRes = await fetch(BASE_URL + "/lookups/currencies", {
      headers: {
        Accept: "*/*",
      },
    });
    const dataCurr: Currency[] = await currRes.json();
    setAllCurrency(dataCurr);
  };

  useEffect(() => {
    getEverything();
  }, []);

  const onSubmit = (data: CourseCreatorFormData) => {
    console.log(data);
  };

  return (
    <main className="flex w-full flex-col gap-10">
      <section className="relative">
        {/* <div className="flex justify-center items-center w-full h-30 bg-linear-to-tr from-primary to-secondary rounded-2xl">
          <Plus className="size-20 text-primary-foreground"></Plus>
        </div> */}
        <ImageUploader></ImageUploader>
        {/* <div className="flex justify-center items-center absolute w-24 h-24 bg-black -bottom-7 left-5 rounded-[50%]">
          {/* <Avatar></Avatar>
          <Plus className="size-20 text-primary-foreground"></Plus>
        </div> */}
        <AvatarUploader></AvatarUploader>
      </section>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 w-full gap-5"
      >
        <section className="flex-1 flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <div className="flex">
              <Pen className="text-primary size-7"></Pen>
              <h2 className="text-xl text-primary">Cím</h2>
            </div>
            <Controller
              name="courseName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="w-full" data-invalid={fieldState.invalid}>
                  <Input
                    className="border-2 border-primary text-xl!"
                    {...field}
                    aria-invalid={fieldState.invalid}
                    placeholder="Kurzus neve..."
                  ></Input>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex">
              <Captions className="text-primary size-7"></Captions>
              <h2 className="text-xl text-primary">Leírás</h2>
            </div>

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="w-full" data-invalid={fieldState.invalid}>
                  <Textarea
                    className="border-2 resize-none text-xl! border-primary h-52"
                    placeholder="Kurzus leírása..."
                    {...field}
                    aria-invalid={fieldState.invalid}
                  ></Textarea>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex">
              <Tags className="text-primary size-7"></Tags>
              <h2 className="text-xl text-primary">Címkék</h2>
            </div>
            <Controller
              name="tags"
              control={form.control}
              defaultValue={[]}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Combobox
                    multiple
                    autoHighlight
                    items={allTags}
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val);
                      field.onBlur();
                    }}
                  >
                    <ComboboxChips
                      ref={anchorTag}
                      className={`w-full border-2 text-lg ${
                        fieldState.invalid ? "border-red-500" : "border-primary"
                      }`}
                    >
                      <ComboboxValue>
                        {(values) => (
                          <React.Fragment>
                            {values.map((value: string) => (
                              <ComboboxChip key={value} className="text-lg">
                                {value}
                              </ComboboxChip>
                            ))}
                            <ComboboxChipsInput
                              value={tagInputValue}
                              onChange={(e) => setTagInputValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && tagInputValue.trim()) {
                                  const trimmed = tagInputValue.trim();
                                  if (!allTags.includes(trimmed))
                                    setAllTags((prev) => [...prev, trimmed]);
                                  if (!field.value.includes(trimmed))
                                    field.onChange([...field.value, trimmed]);
                                  setTagInputValue("");
                                  e.preventDefault();
                                }
                              }}
                            />
                          </React.Fragment>
                        )}
                      </ComboboxValue>
                    </ComboboxChips>
                    <ComboboxContent anchor={anchorTag}>
                      <ComboboxEmpty>Új címke hozzáadása</ComboboxEmpty>
                      <ComboboxList>
                        {(item) => (
                          <ComboboxItem key={item} value={item}>
                            {item}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex">
              <Globe className="text-primary size-7"></Globe>
              <h2 className="text-xl text-primary">Nyelvek</h2>
            </div>
            <Controller
              name="languages"
              control={form.control}
              defaultValue={[]}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Combobox
                    multiple
                    autoHighlight
                    items={allLang}
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val);
                      field.onBlur();
                    }}
                  >
                    <ComboboxChips
                      ref={anchorLang}
                      className={`w-full border-2 text-lg ${
                        fieldState.invalid ? "border-red-500" : "border-primary"
                      }`}
                    >
                      <ComboboxValue>
                        {(values) => (
                          <React.Fragment>
                            {values.map((value: string) => (
                              <ComboboxChip key={value} className="text-lg">
                                {value}
                              </ComboboxChip>
                            ))}
                            <ComboboxChipsInput
                              value={langInputValue}
                              onChange={(e) =>
                                setLangInputValue(e.target.value)
                              }
                            />
                          </React.Fragment>
                        )}
                      </ComboboxValue>
                    </ComboboxChips>
                    <ComboboxContent anchor={anchorLang}>
                      <ComboboxEmpty>Nincs ilyen nyelv</ComboboxEmpty>
                      <ComboboxList>
                        {(item) => (
                          <ComboboxItem key={item} value={item}>
                            {item}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </section>
        <section className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex">
              <h2 className="text-xl text-primary">Kurzus típusa</h2>
            </div>
            <RadioGroup className="grid grid-cols-2 gap-0">
              <div
                className={`border-6 border-light-bg-gray rounded-l-xl py-2  bg-background text-primary font-bold`}
              >
                <RadioGroupItem
                  value="introduction"
                  className="hidden"
                  id="studs"
                ></RadioGroupItem>
                <Label
                  htmlFor="studs"
                  className="h-full w-full flex justify-center items-center text-lg"
                >
                  Magántanári
                </Label>
              </div>
              <div
                className={`border-6 border-light-bg-gray rounded-r-xl  bg-light-bg-gray text-[#898989]`}
              >
                <RadioGroupItem
                  value="qualification"
                  className="hidden"
                  id="money"
                  disabled
                ></RadioGroupItem>
                <Label
                  htmlFor="money"
                  className="h-full w-full flex justify-center items-center text-lg"
                >
                  Tanulói ösvény
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex">
              <ChartArea className="text-primary size-7"></ChartArea>
              <h2 className="text-xl text-primary">Szint</h2>
            </div>
            <Controller
              name="level"
              control={form.control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Select
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val);
                      field.onBlur();
                    }}
                  >
                    <SelectTrigger
                      className={`w-full border-2 text-lg ${
                        fieldState.invalid ? "border-red-500" : "border-primary"
                      }`}
                    >
                      <SelectValue placeholder="Válassz szintet..." />
                    </SelectTrigger>
                    <SelectContent>
                      {allLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex">
              <Book className="text-primary size-7"></Book>
              <h2 className="text-xl text-primary">Tantárgy</h2>
            </div>
            <Controller
              name="subject"
              control={form.control}
              defaultValue=""
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Select
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val);
                      field.onBlur();
                    }}
                  >
                    <SelectTrigger
                      className={`w-full border-2 text-lg ${
                        fieldState.invalid ? "border-red-500" : "border-primary"
                      }`}
                    >
                      <SelectValue placeholder="Válassz tantárgyat..." />
                    </SelectTrigger>
                    <SelectContent>
                      {allSubjects.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex">
              <h2 className="text-xl text-primary">Első konzultációs óra</h2>
            </div>
            <Controller
              name="firstFree"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <RadioGroup
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val);
                      field.onBlur();
                    }}
                    className="grid grid-cols-2 gap-0"
                  >
                    <div
                      className={`border-6 rounded-l-xl py-2 ${
                        field.value === "Ingyenes"
                          ? "bg-background border-light-bg-gray text-primary font-bold"
                          : "border-light-bg-gray bg-light-bg-gray text-[#898989]"
                      }`}
                    >
                      <RadioGroupItem
                        value="Ingyenes"
                        className="hidden"
                        id="free"
                      />
                      <Label
                        htmlFor="free"
                        className="h-full w-full flex justify-center items-center text-lg cursor-pointer"
                      >
                        Ingyenes
                      </Label>
                    </div>
                    <div
                      className={`border-6 rounded-r-xl py-2  ${
                        field.value === "Fizetős"
                          ? "bg-background text-primary  border-light-bg-gray font-bold"
                          : "border-light-bg-gray bg-light-bg-gray text-[#898989]"
                      }`}
                    >
                      <RadioGroupItem
                        value="Fizetős"
                        className="hidden"
                        id="paid"
                      />
                      <Label
                        htmlFor="paid"
                        className="h-full w-full flex justify-center items-center text-lg cursor-pointer"
                      >
                        Fizetős
                      </Label>
                    </div>
                  </RadioGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="flex gap-5 w-full">
            <div className="flex flex-col gap-2 w-full">
              <div className="flex">
                <PiggyBank className="text-primary size-7"></PiggyBank>
                <h2 className="text-xl text-primary">Ár</h2>
              </div>
              <Controller
                name="price"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Input
                      type="number"
                      min={0}
                      className={`border-2 text-xl! ${
                        fieldState.invalid ? "border-red-500" : "border-primary"
                      }`}
                      placeholder="Kurzus ára..."
                      value={priceInput}
                      onChange={(e) => {
                        setPriceInput(e.target.value);
                        const num = Number(e.target.value);
                        field.onChange(e.target.value === "" ? undefined : num);
                      }}
                      onBlur={field.onBlur}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex">
                <CircleDollarSignIcon className="text-primary size-7"></CircleDollarSignIcon>
                <h2 className="text-xl text-primary">Árfolyam</h2>
              </div>
              <Controller
                name="currency"
                control={form.control}
                defaultValue=""
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Select
                      value={field.value}
                      onValueChange={(val) => {
                        field.onChange(val);
                        field.onBlur();
                      }}
                    >
                      <SelectTrigger
                        className={`w-full border-2 text-lg ${
                          fieldState.invalid
                            ? "border-red-500"
                            : "border-primary"
                        }`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {allCurrency.map((level) => (
                          <SelectItem key={level.id} value={level.id}>
                            {level.currencyCode}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex">
              <MapPin className="text-primary size-7"></MapPin>
              <h2 className="text-xl text-primary">Helyszín</h2>
            </div>
            <Controller
              name="location"
              control={form.control}
              defaultValue={[]}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Combobox
                    multiple
                    autoHighlight
                    items={allLoc}
                    value={Array.isArray(field.value) ? field.value : []}
                    onValueChange={(val) => {
                      field.onChange(val);
                      field.onBlur();
                    }}
                  >
                    <ComboboxChips
                      ref={anchorLoc}
                      className={`w-full border-2 text-lg ${
                        fieldState.invalid ? "border-red-500" : "border-primary"
                      }`}
                    >
                      <ComboboxValue>
                        {(values) => (
                          <React.Fragment>
                            {values.map((value: string) => (
                              <ComboboxChip key={value} className="text-lg">
                                {value}
                              </ComboboxChip>
                            ))}
                            <ComboboxChipsInput
                              value={locInputValue}
                              onChange={(e) => setLocInputValue(e.target.value)}
                            />
                          </React.Fragment>
                        )}
                      </ComboboxValue>
                    </ComboboxChips>
                    <ComboboxContent anchor={anchorLoc}>
                      <ComboboxEmpty>Nincs ilyen helyszín</ComboboxEmpty>
                      <ComboboxList>
                        {(item) => (
                          <ComboboxItem key={item} value={item}>
                            {item}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <Button type="submit" className="text-xl">
            <CirclePlus className="size-5"></CirclePlus>Létrehozzás
          </Button>
        </section>
      </form>
    </main>
  );
};

export default CourseCreator;
