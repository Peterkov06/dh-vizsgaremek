"use client";

import { BASE_URL } from "@/app/api/auth/register/route";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IdName } from "@/lib/models/CourseSearchModel";
import React, { useEffect, useRef, useState } from "react";

const CourseCreator = () => {
  const [courseName, setCourseName] = useState<string>("");
  const [courseDesc, setCourseDesc] = useState<string>("");

  const [allTags, setAllTags] = useState<string[]>([]);
  const [tagInputValue, setTagInputValue] = useState("");
  const [selectedTagValues, setselectedTagValues] = useState<string[]>([]);
  const anchorTag = useRef(null);

  const [allLang, setAllLang] = useState<string[]>([]);
  const [langInputValue, setLangInputValue] = useState("");
  const [selectedLangValues, setselectedLangValues] = useState<string[]>([]);
  const anchorLang = useRef(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInputValue.trim()) {
      const trimmed = tagInputValue.trim();
      if (!allTags.includes(trimmed)) {
        setAllTags((prev) => [...prev, trimmed]);
      }
      if (!selectedTagValues.includes(trimmed)) {
        setselectedTagValues((prev) => [...prev, trimmed]);
      }
      setTagInputValue("");
      e.preventDefault();
    }
  };

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

  const getLanguages = async () => {
    const response = await fetch(BASE_URL + "/lookups/languages", {
      headers: {
        Accept: "*/*",
      },
    });
    const data: IdName[] = await response.json();
    setAllLang(data.map((d) => d.name));
  };

  useEffect(() => {
    getLanguages();
  }, []);

  useEffect(() => {
    setTagInputValue("");
  }, [selectedTagValues]);

  return (
    <main className="flex w-full">
      <section></section>
      <section className="flex flex-col w-full">
        <section className="flex-1">
          <div className="w-full">
            <h2 className="text-xl text-primary">Kurzus címe</h2>
            <Input
              className="border-2 border-primary text-xl!"
              value={courseName}
              placeholder="Kurzus neve..."
              onChange={(e) => {
                setCourseName(e.target.value);
              }}
            ></Input>
          </div>
          <div>
            <h2 className="text-xl text-primary">Leírás</h2>
            <Textarea
              className="border-2 resize-none text-xl! border-primary h-40"
              value={courseDesc}
              placeholder="Kurzus leírása..."
              onChange={(e) => {
                setCourseDesc(e.target.value);
              }}
            ></Textarea>
          </div>
          <div>
            <h2 className="text-xl text-primary">Címkék</h2>
            <Combobox
              multiple
              autoHighlight
              items={allTags}
              value={selectedTagValues}
              onValueChange={(val) => setselectedTagValues(val as string[])}
            >
              <ComboboxChips
                ref={anchorTag}
                className="w-full max-w-xs border-2 border-primary text-lg"
              >
                <ComboboxValue>
                  {(values) => (
                    <React.Fragment>
                      {values.map((value: string) => (
                        <ComboboxChip key={value} className={"text-lg"}>
                          {value}
                        </ComboboxChip>
                      ))}
                      <ComboboxChipsInput
                        value={tagInputValue}
                        onChange={(e) => setTagInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
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
          </div>
          <div>
            <h2 className="text-xl text-primary">Nyelvek</h2>
            <Combobox
              multiple
              autoHighlight
              items={allLang}
              value={selectedLangValues}
              onValueChange={(val) => setselectedLangValues(val as string[])}
            >
              <ComboboxChips
                ref={anchorLang}
                className="w-full max-w-xs border-2 border-primary text-lg"
              >
                <ComboboxValue>
                  {(values) => (
                    <React.Fragment>
                      {values.map((value: string) => (
                        <ComboboxChip key={value} className={"text-lg"}>
                          {value}
                        </ComboboxChip>
                      ))}
                      <ComboboxChipsInput
                        value={langInputValue}
                        onChange={(e) => setLangInputValue(e.target.value)}
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
          </div>
        </section>
      </section>
    </main>
  );
};

export default CourseCreator;
