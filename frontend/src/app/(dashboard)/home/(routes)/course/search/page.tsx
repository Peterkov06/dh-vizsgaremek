"use client";

import { BASE_URL } from "@/app/api/auth/register/route";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { SearchCourseType } from "@/lib/models/CourseSearchModel";
import {
  ArrowUpDown,
  Book,
  Funnel,
  Globe,
  MapPin,
  PiggyBank,
  SlidersHorizontalIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import SearchCourseCard from "./components/SearchCourseCard";

const CourseSearchPage = () => {
  const subjects = [
    "Matek",
    "Angol",
    "Német",
    "Francia",
    "Kínai",
    "Magyar",
    "Történelem",
  ];
  const languages = [
    "Angol",
    "Magyar",
    "Német",
    "Francia",
    "Spanyol",
    "Lengyel",
  ];
  const [cities, setCities] = useState<string[]>([]);

  const [city, setCity] = useState<string>("");
  const minPrice = 0;
  const maxPrice = 10000;
  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPrice,
    maxPrice,
  ]);

  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const sortingCategories = [
    "Népszerű",
    "Legújabb",
    "Értékelés",
    "Ár: növekvő",
    "Ár: csökkenő",
  ];
  const [sortBy, setSortBy] = useState("");

  const [dummyCourses, setDummyCourses] = useState<SearchCourseType[]>([]);

  useEffect(() => {
    fetch("/mockup/searchCourses.json")
      .then((data) => data.json())
      .then((res) => setDummyCourses(res));
  }, []);

  useEffect(() => {
    const searchQuery = city;
    if (searchQuery.length < 1) {
      setCities([]);
      return;
    }

    const delayDebounceFunction = setTimeout(async () => {
      // setisLoadingCities(true);
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
        // setisLoadingCities(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFunction);
  }, [city]);

  const handlePriceChange = (val: [number, number]) => {
    if (val[1] > maxPrice) val[1] = maxPrice;
    if (val[0] > maxPrice) val[0] = maxPrice;

    if (val[0] > val[1]) setPriceRange([val[1], val[0]]);
    else setPriceRange(val);
  };

  const toggleLanguage = (language: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(language)
        ? prev.filter((l) => l !== language)
        : [...prev, language],
    );
  };
  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((l) => l !== subject)
        : [...prev, subject],
    );
  };

  return (
    <main className="h-full flex flex-col gap-10">
      <h1 className="text-4xl font-bold text-primary">Kurzus keresése</h1>
      <section className="grid grid-cols-12 grid-rows-5 h-full">
        <section className="gap-3 flex flex-col border-4 border-light-bg-gray rounded-2xl col-span-3 row-span-4 p-3">
          <h1 className="text-xl font-bold text-primary flex gap-2 bg-light-bg-gray p-2 rounded-xl">
            <Funnel></Funnel>
            Szűrés
          </h1>
          <div className="border-4 border-light-bg-gray rounded-2xl">
            <h2 className="text-primary text-lg bg-light-bg-gray p-1 flex gap-1">
              <Book></Book>Tantárgy:
            </h2>
            <div className="overflow-hidden h-26">
              <div className="overflow-auto h-full">
                {subjects.map((s, i) => {
                  const isChecked = selectedSubjects.includes(s);
                  return (
                    <div
                      key={s + i}
                      className={`flex gap-2 items-center px-3 ${isChecked && "bg-light-bg-gray"}`}
                      onClick={() => {
                        toggleSubject(s);
                      }}
                    >
                      <Checkbox
                        className="border-2 border-gray-400 size-5"
                        checked={isChecked}
                        onCheckedChange={() => {
                          toggleSubject(s);
                        }}
                        onClick={(e) => e.stopPropagation()}
                      ></Checkbox>
                      <p className="text-lg">{s}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="border-4 border-light-bg-gray rounded-2xl">
            <h2 className="text-primary text-lg bg-light-bg-gray p-1 flex gap-1">
              <Globe></Globe>Nyelvek:
            </h2>
            <div className="overflow-hidden h-26">
              <div className="overflow-auto h-full">
                {languages.map((l, i) => {
                  const isChecked = selectedLanguages.includes(l);
                  return (
                    <div
                      key={l + i}
                      className={`flex gap-2 items-center px-3 ${isChecked && "bg-light-bg-gray"}`}
                      onClick={() => {
                        toggleLanguage(l);
                      }}
                    >
                      <Checkbox
                        className="border-2 border-gray-400 size-5"
                        checked={isChecked}
                        onCheckedChange={() => {
                          toggleLanguage(l);
                        }}
                        onClick={(e) => e.stopPropagation()}
                      ></Checkbox>
                      <p className="text-lg">{l}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="border-4 border-light-bg-gray rounded-2xl">
            <h2 className="text-primary text-lg bg-light-bg-gray p-1 flex gap-1">
              <MapPin /> Helyszín:
            </h2>
            <div>
              <Combobox
                items={cities}
                onValueChange={(e) => setCity(e?.toString() ?? "")}
                value={city}
              >
                <ComboboxInput
                  placeholder="Város"
                  className="border-2 border-border rounded-2xl py-5 text-sm w-full"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <ComboboxContent>
                  <ComboboxEmpty>Nem találtunk ilyen várost.</ComboboxEmpty>
                  <ComboboxList>
                    {(item: any) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>
          </div>
          <div className="border-4 border-light-bg-gray rounded-2xl">
            <h2 className="text-primary text-lg bg-light-bg-gray p-1 flex gap-1">
              <PiggyBank /> Ár:
            </h2>
            <div className="">
              <Slider
                className="mt-2"
                min={minPrice}
                max={maxPrice}
                step={100}
                value={priceRange}
                onValueChange={(val) => handlePriceChange([val[0], val[1]])}
              />

              <div className="flex gap-2 mt-3">
                <Input
                  type="number"
                  value={priceRange[0]}
                  min={minPrice}
                  max={priceRange[1]}
                  onChange={(e) => {
                    handlePriceChange([Number(e.target.value), priceRange[1]]);
                  }}
                ></Input>
                <p className="text-xl flex items-center">-</p>
                <Input
                  type="number"
                  value={priceRange[1]}
                  min={priceRange[0]}
                  max={maxPrice}
                  onChange={(e) => {
                    handlePriceChange([priceRange[0], Number(e.target.value)]);
                  }}
                ></Input>
              </div>
            </div>
          </div>
          <Button className="bg-linear-to-br from-primary to-secondary from-10%">
            <SlidersHorizontalIcon></SlidersHorizontalIcon>
            Szűrés
          </Button>
        </section>

        <section className="col-span-9 ml-4">
          <div className="flex gap-1 items-center">
            <ArrowUpDown className="text-primary"></ArrowUpDown>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 shadow-2xl">
                <SelectValue placeholder="Rendezés..." />
              </SelectTrigger>
              <SelectContent>
                {sortingCategories.map((sc) => (
                  <SelectItem key={sc} value={sc}>
                    {sc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-3">
            {dummyCourses.map((c) => (
              <div className="flex justify-center" key={c.id}>
                <SearchCourseCard card={c} key={c.id}></SearchCourseCard>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
};

export default CourseSearchPage;
