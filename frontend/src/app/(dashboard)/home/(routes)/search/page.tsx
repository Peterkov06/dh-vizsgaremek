"use client";

import { BASE_URL } from "@/app/api/auth/register/route";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
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
import {
  CourseFilterResponse,
  CoursesPage,
} from "@/lib/models/CourseSearchModel";
import {
  ArrowUpDown,
  Book,
  ChevronDown,
  Funnel,
  Globe,
  MapPin,
  PiggyBank,
  Search,
  SlidersHorizontalIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SearchCourseCard from "./components/SearchCourseCard";
import SearchPagination from "./components/SearchPagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { CoursePage } from "@/lib/models/CourseWall";
import { toast } from "sonner";
import fetchWithAuth from "@/lib/api-client";
import React from "react";

type SortByType = {
  name: string;
  value: string;
};

const CourseSearchPage = () => {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);

  const [searchQueryFromUser, setSearchQueryFromUser] = useState<string>("");
  const [cities, setCities] = useState<string[]>([]);

  const [city, setCity] = useState<string>("");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPrice,
    maxPrice,
  ]);

  const [pageNum, setPageNum] = useState<number>(1);

  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const [allLoc, setAllLoc] = useState<string[]>(["Online"]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [locInputValue, setLocInputValue] = useState("");
  const anchorLoc = useRef(null);

  const sortingCategories: SortByType[] = [
    { name: "Népszerű", value: "Popularity" },
    { name: "Legújabb", value: "Recent" },
    { name: "Értékelés", value: "Review" },
    { name: "Ár: növekvő", value: "PriceAscending" },
    { name: "Ár: csökkenő", value: "PriceDescending" },
  ];
  const [sortBy, setSortBy] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = searchParams.get("page");

  const [courses, setCourses] = useState<CoursesPage>();

  const [isOpenFilter, setIsOpenFilter] = useState(false);

  useEffect(() => {
    fetch("/api/pages/course-explorer")
      .then((data) => data.json())
      .then((res) => {
        if (res.error !== undefined) return;
        const noState: CourseFilterResponse = res;

        console.log(res);

        setCourses(res.courses);

        noState.domains.forEach((sub) => {
          setSubjects((prev) =>
            !prev.includes(sub.name) ? [...prev, sub.name] : [...prev],
          );
        });
        noState.languages.forEach((lan) => {
          setLanguages((prev) =>
            !prev.includes(lan.name) ? [...prev, lan.name] : [...prev],
          );
        });

        setMinPrice(noState.minPrice);
        setMaxPrice(noState.maxPrice);

        setPriceRange([noState.minPrice, noState.maxPrice]);

        setPageNum(noState.courses.pageNum);

        console.log(noState.courses.pageNum, noState.courses.coursesPerPage);
      });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (sortBy) params.set("orderBy", sortBy);
    router.push(`${pathname}?${params.toString()}`);
  }, [sortBy]);

  useEffect(() => {
    fetch(`/api/courses?${searchParams.toString()}`)
      .then((res) => res.json())
      .then((res) => setCourses(res));

    if (searchParams.toString().length > 0) toast.success("Sikeres szűrés");
  }, [searchParams]);

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

  const SearchByName = () => {
    const params = new URLSearchParams(searchParams);
    params.set("keyword", searchQueryFromUser);
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const searchQuery = locInputValue.trim();
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
  }, [selectedLocations]);

  const FilterToQuery = () => {
    const params = new URLSearchParams(searchParams);

    params.delete("Domains");
    selectedSubjects.forEach((s) => params.append("Domains", s));

    params.delete("Languages");
    selectedLanguages.forEach((l) => params.append("Languages", l));
    params.delete("Locations");
    selectedLocations.forEach((l) => params.append("Locations", l));

    params.set("minPrice", priceRange[0].toString());
    params.set("maxPrice", priceRange[1].toString());

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <main className="h-full flex flex-col gap-5 lg:gap-10">
      <div className="gap-4 flex-col lg:flex-row flex justify-between lg:items-center">
        <h1 className="text-4xl font-bold text-primary">Kurzus keresése</h1>
        <InputGroup className=" lg:max-w-[60%] shadow-2xl">
          <InputGroupInput
            type="text"
            value={searchQueryFromUser}
            onChange={(e) => {
              setSearchQueryFromUser(e.target.value);
            }}
            onKeyDown={(e) => e.key === "Enter" && SearchByName()}
            className="text-lg!"
            placeholder="Keresés..."
          ></InputGroupInput>
          <InputGroupAddon align={"inline-end"}>
            <InputGroupButton onClick={SearchByName}>
              <Search className="size-5"></Search>
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
      <section className="flex flex-col lg:grid grid-cols-12 grid-rows-5 h-full">
        <section
          className={`lg:gap-3 flex flex-col border-4 border-light-bg-gray rounded-2xl col-span-3 h-fit p-3 ${isOpenFilter && "gap-3"}`}
        >
          <h1
            className="text-xl font-bold text-primary flex gap-2 bg-light-bg-gray p-2 rounded-xl"
            onClick={() => setIsOpenFilter((prev) => !prev)}
          >
            <Funnel></Funnel>
            Szűrés
            <ChevronDown
              className={`ml-auto transition-transform duration-300 md:hidden ${
                isOpenFilter ? "rotate-180" : "rotate-0"
              }`}
            />
          </h1>
          <div
            className={`flex flex-col gap-3 overflow-hidden transition-all duration-300 md:flex md:overflow-visible ${
              isOpenFilter
                ? "max-h-500 opacity-100"
                : "max-h-0 opacity-0 md:max-h-none md:opacity-100"
            }`}
          >
            <div className="border-4 border-light-bg-gray rounded-2xl">
              <h2 className="text-primary text-lg bg-light-bg-gray p-1 flex gap-1">
                <Book></Book>Tantárgy:
              </h2>
              <div className="overflow-hidden h-fit max-h-26">
                <div className="overflow-auto h-full max-h-26">
                  {subjects.map((s, i) => {
                    const isChecked = selectedSubjects.includes(s);
                    return (
                      <div
                        key={s + i}
                        className={`flex gap-2 cursor-pointer items-center px-3 ${isChecked && "bg-light-bg-gray"}`}
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
              <div className="overflow-hidden h-fit max-h-26">
                <div className="overflow-auto h-full max-h-26">
                  {languages.map((l, i) => {
                    const isChecked = selectedLanguages.includes(l);
                    return (
                      <div
                        key={l + i}
                        className={`flex gap-2 cursor-pointer items-center px-3 ${isChecked && "bg-light-bg-gray"}`}
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
                  multiple
                  autoHighlight
                  items={allLoc}
                  value={
                    Array.isArray(selectedLocations) ? selectedLocations : []
                  }
                  onValueChange={(val) => {
                    setSelectedLocations(val);
                  }}
                >
                  <ComboboxChips
                    ref={anchorLoc}
                    className={`w-full border-2 text-lg border-primary`}
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
                            placeholder="Helyszín..."
                            value={locInputValue}
                            onChange={(e) => setLocInputValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === " ") e.stopPropagation();
                            }}
                          />
                        </React.Fragment>
                      )}
                    </ComboboxValue>
                  </ComboboxChips>
                  <ComboboxContent anchor={anchorLoc} side="top">
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
                      handlePriceChange([
                        Number(e.target.value),
                        priceRange[1],
                      ]);
                    }}
                  ></Input>
                  <p className="text-xl flex items-center">-</p>
                  <Input
                    type="number"
                    value={priceRange[1]}
                    min={priceRange[0]}
                    max={maxPrice}
                    onChange={(e) => {
                      handlePriceChange([
                        priceRange[0],
                        Number(e.target.value),
                      ]);
                    }}
                  ></Input>
                </div>
              </div>
            </div>
            <Button
              className="bg-linear-to-br from-primary to-secondary from-10%"
              onClick={() => {
                FilterToQuery();
              }}
            >
              <SlidersHorizontalIcon></SlidersHorizontalIcon>
              Szűrés
            </Button>
          </div>
        </section>

        <section className="col-span-9 mt-3 lg:mt-0 lg:ml-4">
          <div className="flex gap-1 items-center">
            <ArrowUpDown className="text-primary"></ArrowUpDown>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 shadow-2xl">
                <SelectValue placeholder="Rendezés..." />
              </SelectTrigger>
              <SelectContent>
                {sortingCategories.map((sc) => (
                  <SelectItem key={sc.value} value={sc.value}>
                    {sc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col lg:grid grid-cols-3 gap-4 mt-3">
            {/* && courses?.courses.length > 0  */}
            {courses && courses.courses && courses?.courses.length > 0 ? (
              courses?.courses.map((c) => (
                <div className="flex justify-center" key={c.id}>
                  <SearchCourseCard card={c} key={c.id}></SearchCourseCard>
                </div>
              ))
            ) : (
              <div className="text-2xl text-primary font-bold col-span-3 ">
                Nincs a paramétereknek megfelelő kurzus
              </div>
            )}
          </div>
          <div className="h-30 flex items-center ">
            <SearchPagination maxPage={pageNum}></SearchPagination>
          </div>
        </section>
      </section>
    </main>
  );
};

export default CourseSearchPage;
