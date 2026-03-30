"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Bell, Lock, Pencil, Save, Trash, User } from "lucide-react";
import { useEffect, useState } from "react";
import ResetPasswordDialog from "../../(teacher)/components/setting/ResetPasswordDialog";
import { Switch } from "@/components/ui/switch";
import { BASE_URL } from "@/app/api/auth/register/route";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { UserSettings } from "@/lib/models/SettingModels";
import fetchWithAuth from "@/lib/api-client";

const Settings = () => {
  const [fullName, setFullName] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [cityName, setCityName] = useState<string>("");
  const [cities, setCities] = useState<string[]>([]);
  const [postalCode, setPostalCode] = useState<string>("");
  const [postalCodeAll, setPostalCodeAll] = useState<string[]>([]);
  const [address, setAddress] = useState<string>("");

  const [allTabs, setAllTabs] = useState<string>("introduction");
  const [introduction, setIntroduction] = useState<string>("");

  const [activitySwitch, setActivitySwitch] = useState<boolean>(false);
  const [peddingSwitch, setPeddingSwitch] = useState<boolean>(false);
  const [marketingSwitch, setMarketingSwitch] = useState<boolean>(false);

  useEffect(() => {
    fetchWithAuth("/api/auth/me/settings")
      .then((data) => data.json())
      .then((data) => {
        setFullName(data.fullName);
        setNickname(data.nickname);
        setCityName(data.city);
        setPostalCode(data.postalCode);
        setAddress(data.address);
        setIntroduction(data.introduction || "");
      });
  }, []);

  useEffect(() => {
    if (cityName.length < 1) {
      setCities([]);
      return;
    }

    const delayDebounceFunction = setTimeout(async () => {
      try {
        const response = await fetch(
          BASE_URL + "/cities/search?city=" + cityName,
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
      }
    }, 300);

    return () => clearTimeout(delayDebounceFunction);
  }, [cityName]);

  useEffect(() => {
    if (postalCode.length < 1) {
      setPostalCodeAll([]);
      return;
    }

    const delayDebounceFunction = setTimeout(async () => {
      try {
        const response = await fetch(
          BASE_URL + "/cities/postal/search?postal=" + postalCode,
          {
            headers: {
              Accept: "*/*",
            },
          },
        );
        const data = await response.json();
        setPostalCodeAll(data);
      } catch (error) {
        console.error("Error fetching postal codes: ", error);
      } finally {
      }
    }, 300);

    return () => clearTimeout(delayDebounceFunction);
  }, [postalCode]);

  useEffect(() => {
    const isValid = postalCode.length === 4;
    if (!isValid) {
      return;
    }

    const setCity = setTimeout(async () => {
      try {
        const response = await fetch(
          BASE_URL + "/cities/search/city_by_postal?postal=" + postalCode,
          {
            headers: {
              Accept: "*/*",
            },
          },
        );
        const data = await response.json();
        if (data.length === 1) {
          // form.setValue("cityName", data[0], { shouldValidate: true });
          setCityName(data[0]);
        }
      } catch (error) {
        console.error("Error fetching cities: ", error);
      }
    }, 300);
    return () => clearTimeout(setCity);
  }, [postalCode]);

  useEffect(() => {
    const isValid = cityName.length > 0;
    if (!isValid) {
      return;
    }

    const setPostal = setTimeout(async () => {
      try {
        const response = await fetch(
          BASE_URL + "/cities/search/postal_by_city?city=" + cityName,
          {
            headers: {
              Accept: "*/*",
            },
          },
        );
        const data = await response.json();
        if (data.length === 1) {
          setPostalCode(data[0]);
        }
      } catch (error) {
        console.error("Error fetching postal codes: ", error);
      }
    }, 300);
    return () => clearTimeout(setPostal);
  }, [cityName]);

  return (
    <main className="flex flex-col lg:grid grid-cols-10 grid-rows-12 h-full w-full">
      <div className="row-start-1">
        <h1 className="text-3xl lg:text-5xl font-bold text-primary">
          Beállítások
        </h1>
      </div>
      <section className="row-start-2 col-span-3 row-span-7 border-4 border-light-bg-gray rounded-2xl flex flex-col px-2 py-3 items-center gap-6 mt-8 mx-3">
        <h1 className="text-2xl font-bold">Személyes adatok</h1>
        <div className="flex flex-col w-full gap-4">
          <Input
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
            }}
            className="bg-light-bg-gray rounded-xl text-lg! h-12 p-3"
            placeholder="Teljes név..."
          ></Input>
          <Input
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
            }}
            className="bg-light-bg-gray rounded-xl text-lg! h-12 p-3"
            placeholder="Becenév..."
          ></Input>

          <Combobox
            items={cities}
            value={cityName}
            onValueChange={(e) => {
              setCityName(e || "");
            }}
            id="postal-code"
          >
            <ComboboxInput
              placeholder="Város..."
              className="bg-light-bg-gray rounded-xl h-12"
              style={{ fontSize: "1.125rem" }}
              type="text"
              value={cityName}
              onChange={(e) => {
                setCityName(e.target.value);
              }}
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
          <Combobox
            items={postalCodeAll}
            value={postalCode}
            onValueChange={(e) => {
              setPostalCode(e || "");
            }}
            id="postal-code"
          >
            <ComboboxInput
              placeholder="Irányítószám..."
              className="bg-light-bg-gray rounded-xl h-12"
              style={{ fontSize: "1.125rem" }}
              type="number"
              value={postalCode}
              onChange={(e) => {
                setPostalCode(e.target.value);
              }}
            />
            <ComboboxContent>
              <ComboboxEmpty>Nem találtunk ilyen irányítószámot.</ComboboxEmpty>
              <ComboboxList>
                {(item: any) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          <Input
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
            }}
            className="bg-light-bg-gray rounded-xl text-lg! h-12 p-3"
            placeholder="Lakcím (utca, házszám)..."
          ></Input>
        </div>
        <Button className="text-xl w-40 flex gap-1 bg-linear-to-tl from-foreground to-[#868686]">
          <Save className="size-6"></Save>
          <p>Mentés</p>
        </Button>
      </section>
      <section className="mx-3 row-start-2 col-span-4 row-span-6 border-4 border-light-bg-gray rounded-2xl flex flex-col px-2 py-1 my-8 gap-3 items-stretch">
        <RadioGroup
          className="grid grid-cols-2 gap-0"
          value={allTabs}
          onValueChange={setAllTabs}
        >
          <div
            className={`border-6 border-light-bg-gray rounded-l-xl py-2 ${allTabs === "introduction" ? "bg-background text-primary font-bold" : "bg-light-bg-gray text-[#898989]"}`}
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
              Bemutatkozás
            </Label>
          </div>
          <div
            className={`border-6 border-light-bg-gray rounded-r-xl ${allTabs === "qualification" ? "bg-background text-primary font-bold" : "bg-light-bg-gray text-[#898989]"}`}
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
              Végzettségek
            </Label>
          </div>
        </RadioGroup>

        <Textarea
          value={introduction}
          onChange={(e) => {
            setIntroduction(e.target.value);
          }}
          className="bg-light-bg-gray resize-none h-[12em]! text-lg!"
          placeholder="Bemutatkozás..."
        ></Textarea>

        <div className="flex gap-3 items-center justify-center">
          <Button className="h-10 w-50 text-lg bg-linear-to-tl from-primary to-[#7CB08C]">
            <Pencil className="size-6"></Pencil>
            Módosítás
          </Button>
          <Button className="h-10 w-10 bg-linear-to-tl from-[#B02929] to-[#BD6060]">
            <Trash className="size-6"></Trash>
          </Button>
        </div>
      </section>
      <section className="mx-3 px-1 py-1 mt-8 row-start-2 col-span-3 row-span-6 border-4 border-light-bg-gray rounded-2xl flex flex-col justify-between">
        <div className="flex gap-2 items-center bg-light-bg-gray rounded-xl py-2 px-5">
          <User className="text-primary size-10"></User>
          <h1 className="text-2xl font-bold">Profilkép</h1>
        </div>
        <div className="flex justify-center">
          <Avatar className="size-40 lg:size-50">
            <AvatarImage src={"/defaults/default_avatar.jpg"}></AvatarImage>
          </Avatar>
        </div>
        <div className="flex gap-3 items-center justify-center">
          <Button className="h-8 lg:h-10 w-40 lg:w-50 text-lg bg-linear-to-tl from-primary to-[#7CB08C]">
            <Pencil className="size-4 lg:size-6"></Pencil>
            Módosítás
          </Button>
          <Button className="h-8 w-8 lg:h-10 lg:w-10 bg-linear-to-tl from-[#B02929] to-[#BD6060]">
            <Trash className="size-5 lg:size-6"></Trash>
          </Button>
        </div>
      </section>

      <section className="mx-3 px-1 py-1 mt-4 row-start-9 col-span-3 row-span-3 border-4 border-light-bg-gray rounded-2xl flex flex-col items-center justify-between">
        <div className="flex gap-3 items-center bg-light-bg-gray rounded-xl py-2 px-5 w-full">
          <Lock className="text-primary size-8"></Lock>
          <h1 className="text-2xl font-bold">Fiókom</h1>
        </div>
        <ResetPasswordDialog></ResetPasswordDialog>
        <Button className="bg-linear-to-tl from-[#B02929] to-[#BD6060] text-xl w-fit h-10 mt-3 lg:mt-0 lg:h-12">
          <Trash className="size-5 lg:size-6"></Trash>
          Törlés
        </Button>
      </section>
      <section className=" px-1 py-1 mt-4 row-start-8 col-span-3 row-span-4 border-4 border-light-bg-gray rounded-2xl flex flex-col">
        <div className="flex gap-3 items-center bg-light-bg-gray rounded-xl py-2 px-5 w-full">
          <Bell className="text-primary size-8"></Bell>
          <h1 className="text-2xl font-bold">Értesítések</h1>
        </div>
        <div className="flex flex-col gap-2 px-4 py-3">
          <div className="flex gap-4 items-center">
            <Switch
              size="lg"
              name="activity"
              checked={activitySwitch}
              onClick={() => {
                setActivitySwitch((prev) => !prev);
              }}
            ></Switch>
            <Label htmlFor="activity" className="text-2xl">
              Fióktevékenység
            </Label>
          </div>
          <div className="flex gap-4 items-center">
            <Switch
              size="lg"
              name="pedding"
              checked={peddingSwitch}
              onClick={() => {
                setPeddingSwitch((prev) => !prev);
              }}
            ></Switch>
            <Label htmlFor="pedding" className="text-2xl">
              Magánóra Kérések
            </Label>
          </div>
          <div className="flex gap-4 items-center">
            <Switch
              size="lg"
              name="marketing"
              checked={marketingSwitch}
              onClick={() => {
                setMarketingSwitch((prev) => !prev);
              }}
            ></Switch>
            <Label htmlFor="marketing" className="text-2xl">
              Ajánlatok
            </Label>
          </div>
        </div>
        <div className="flex justify-center h-full items-center">
          <Button
            className="bg-linear-to-tl from-[#B02929] to-[#BD6060] text-xl w-fit"
            onClick={() => {
              setActivitySwitch(false);
              setPeddingSwitch(false);
              setMarketingSwitch(false);
            }}
          >
            Kikapcsolás
          </Button>
        </div>
      </section>
      <section className="mx-4 px-5 py-1 mt-4 row-start-8 col-span-5 row-span-1 border-4 border-light-bg-gray rounded-2xl flex items-center justify-between">
        <h1 className="text-xl">Választott nyelvek: </h1>
        <div className="mr-20">
          <img
            src="/imgs/flags/Hungary.png"
            alt="hungary"
            className="h-8 w-14"
          />
        </div>
      </section>
    </main>
  );
};

export default Settings;
