"use client";

import { BASE_URL } from "@/app/api/auth/register/route";
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
import { Slider } from "@/components/ui/slider";
import { Book, Funnel, Globe, MapPin, PiggyBank } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";

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
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

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
    if (val[0] > val[1]) setPriceRange([val[1], val[0]]);
    else setPriceRange(val);
  };

  return (
    <main className="h-full flex flex-col gap-10">
      <h1 className="text-4xl font-bold text-primary">Kurzus keresése</h1>
      <section className="grid grid-cols-12 grid-rows-5 h-full">
        <section className="gap-3 flex flex-col border-4 border-light-bg-gray rounded-2xl col-span-3 row-span-5 p-3">
          <h1 className="text-xl font-bold text-primary flex gap-2 bg-light-bg-gray p-2 rounded-xl">
            <Funnel></Funnel>
            Szűrés
          </h1>
          <div className="border-4 border-light-bg-gray rounded-2xl">
            <h2 className="text-primary text-lg bg-light-bg-gray p-1 flex gap-1">
              <Book></Book>Tantárgy:
            </h2>
            <div className="overflow-hidden h-32">
              <div className="overflow-auto h-full">
                {subjects.map((s, i) => (
                  <div key={s + i} className="flex gap-2 items-center px-3">
                    <Checkbox className="border-2 border-gray-400 size-5"></Checkbox>
                    <p className="text-lg">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="border-4 border-light-bg-gray rounded-2xl">
            <h2 className="text-primary text-lg bg-light-bg-gray p-1 flex gap-1">
              <Globe></Globe>Nyelvek:
            </h2>
            <div className="overflow-hidden h-32">
              <div className="overflow-auto h-full">
                {languages.map((l, i) => (
                  <div key={l + i} className="flex gap-2 items-center px-3">
                    <Checkbox className="border-2 border-gray-400 size-5"></Checkbox>
                    <p className="text-lg">{l}</p>
                  </div>
                ))}
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
                  value={city} // ← use local state directly
                  onChange={(e) => setCity(e.target.value)} // ← update state on type
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
                min={0}
                max={10000}
                step={100}
                value={priceRange}
                onValueChange={(val) => handlePriceChange([val[0], val[1]])}
              />

              <div className="flex gap-2 mt-3">
                <Input
                  type="number"
                  value={priceRange[0]}
                  min={0}
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
                  max={10000}
                  onChange={(e) => {
                    handlePriceChange([priceRange[0], Number(e.target.value)]);
                  }}
                ></Input>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
};

export default CourseSearchPage;
