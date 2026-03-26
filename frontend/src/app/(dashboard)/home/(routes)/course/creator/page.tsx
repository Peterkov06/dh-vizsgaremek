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
import { IdName } from "@/lib/models/CourseSearchModel";
import React, { useEffect, useRef, useState } from "react";

const CourseCreator = () => {
  const [items, setItems] = useState<string[]>([]);

  const [inputValue, setInputValue] = useState("");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const anchor = useRef(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      const trimmed = inputValue.trim();

      if (!items.includes(trimmed)) {
        setItems((prev) => [...prev, trimmed]);
      }

      if (!selectedValues.includes(trimmed)) {
        setSelectedValues((prev) => [...prev, trimmed]);
      }

      setInputValue("");
      e.preventDefault();
    }
  };

  useEffect(() => {
    const searchQuery = inputValue;
    if (searchQuery.length < 1) {
      setItems([]);
      return;
    }

    const delayDebounceFunction = setTimeout(async () => {
      // setisLoadingCities(true);
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
        setItems(data.map((d) => d.name));
      } catch (error) {
        console.error("Error fetching cities: ", error);
      } finally {
      }
    }, 300);

    return () => clearTimeout(delayDebounceFunction);
  }, [inputValue]);

  useEffect(() => {
    setInputValue("");
  }, [selectedValues]);

  return (
    <main>
      <div>
        <Combobox
          multiple
          autoHighlight
          items={items}
          value={selectedValues}
          onValueChange={(val) => setSelectedValues(val as string[])}
        >
          <ComboboxChips
            ref={anchor}
            className="w-full max-w-xs border-2 border-primary"
          >
            <ComboboxValue>
              {(values) => (
                <React.Fragment>
                  {values.map((value: string) => (
                    <ComboboxChip key={value}>{value}</ComboboxChip>
                  ))}
                  <ComboboxChipsInput
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </React.Fragment>
              )}
            </ComboboxValue>
          </ComboboxChips>
          <ComboboxContent anchor={anchor}>
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
    </main>
  );
};

export default CourseCreator;
