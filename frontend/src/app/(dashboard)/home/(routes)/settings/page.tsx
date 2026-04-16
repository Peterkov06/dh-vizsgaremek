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
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { Controller } from "react-hook-form";
import { Field } from "@/components/ui/field";

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
  const [profilePicture, setProfilePicture] = useState<string>();

  const router = useRouter();

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
        setProfilePicture(data.profilePicUrl);
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

  async function HandleInfoSave() {
    const res = await fetchWithAuth("/api/auth/account/modify", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name: fullName || null,
        nickname: nickname || null,
        address: address || null,
        city: cityName || null,
        postal_code: postalCode || null,
      }),
    });

    if (res.ok) toast.success("Sikeres mentés");
    else toast.error("Hiba történt");
  }

  async function HandleModifyIntrodustion() {
    const res = await fetchWithAuth("/api/auth/account/modify", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        introduction: introduction || null,
      }),
    });

    if (res.ok) toast.success("Sikeres módosítás");
    else toast.error("Hiba történt");
  }

  async function HandleAccountDelete() {
    const res = await fetchWithAuth("/api/auth/account/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      toast.error("Hiba történt!");
      return;
    }
    toast.success("Sikeres fiók törlés");

    await fetchWithAuth("api/auth/logout");
    router.push("/login");
  }

  async function ChangeProfilePicture(File: File) {
    const formData = new FormData();
    formData.append("picture", File);
    const res = await fetchWithAuth("/api/files/profile-picture", {
      method: "POST",
      body: formData,
    });

    if (res.ok) toast.success("Sikeres módosítás");
    else toast.error("Hiba történt");
  }

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
        <Button
          className="text-xl w-40 flex gap-1 bg-linear-to-tl from-foreground to-[#868686]"
          onClick={() => {
            HandleInfoSave();
          }}
        >
          <Save className="size-6"></Save>
          <p>Mentés</p>
        </Button>
      </section>
      <section className="mx-3 row-start-2 col-span-4 row-span-6 border-4 border-light-bg-gray rounded-2xl flex flex-col px-2 py-1 my-8 gap-3 items-stretch">
        <RadioGroup
          className="grid grid-cols-1 gap-0"
          value={allTabs}
          onValueChange={setAllTabs}
        >
          <div
            className={`border-6 border-light-bg-gray rounded-xl py-2 ${allTabs === "introduction" ? "bg-background text-primary font-bold" : "bg-light-bg-gray text-[#898989]"}`}
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
          {/* <div
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
          </div> */}
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
          <Button
            className="h-10 w-50 text-lg bg-linear-to-tl from-primary to-[#7CB08C]"
            onClick={HandleModifyIntrodustion}
          >
            <Pencil className="size-6"></Pencil>
            Módosítás
          </Button>
          <Button
            className="h-10 w-10 bg-linear-to-tl from-[#B02929] to-[#BD6060]"
            onClick={() => {
              setIntroduction("");
            }}
          >
            <Trash className="size-6"></Trash>
          </Button>
        </div>
      </section>
      <section className="mx-3 px-1 py-1 mt-8 row-start-2 col-span-3 row-span-6 border-4 border-light-bg-gray rounded-2xl flex flex-col justify-between">
        <div className="flex gap-2 items-center bg-light-bg-gray rounded-xl py-2 px-5">
          <User className="text-primary size-10"></User>
          <h1 className="text-2xl font-bold">Profilkép</h1>
        </div>
        <div className="w-full min-h-48 md:h-full flex flex-row md:justify-center items-center">
          <Avatar className=" h-52 w-52">
            <AvatarImage
              className="aspect-square"
              alt="avatar"
              src={profilePicture}
            />
          </Avatar>
        </div>

        <Input
          type="file"
          id="profile-picture-upload"
          accept="image/png, image/jpeg"
          className=""
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setProfilePicture(URL.createObjectURL(file));
              ChangeProfilePicture(file);
            }
          }}
        />
        <label
          htmlFor="profile-picture-upload"
          className="inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-foreground text-primary-foreground hover:bg-foreground/90 h-10 px-4 py-6 md:text-lg w-full cursor-pointer"
        >
          {profilePicture !== "https://i.redd.it/o9srxpsm8rm01.png"
            ? "Kép módosítása"
            : "Profilkép feltöltése"}
        </label>
      </section>

      <section className="mx-3 px-1 py-1 mt-4 row-start-9 col-span-3 row-span-3 border-4 border-light-bg-gray rounded-2xl flex flex-col items-center ">
        <div className="flex gap-3 items-center bg-light-bg-gray rounded-xl py-2 px-5 w-full">
          <Lock className="text-primary size-8"></Lock>
          <h1 className="text-2xl font-bold">Fiókom</h1>
        </div>
        <div className="flex items-center h-full">
          <ResetPasswordDialog></ResetPasswordDialog>
        </div>
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
        <h1 className="text-xl">Fiók törlése: </h1>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="bg-linear-to-tl from-[#B02929] to-[#BD6060]">
              <p className="text-xl">Törlés</p>
              <Trash className="size-7"></Trash>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Biztosan akarja törölni a fiókját?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Ez a művelet nem vonható vissza. Ezzel véglegesen törli az Ön
                fiókját a szervereinkről.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Mégse</AlertDialogCancel>
              <AlertDialogAction
                variant={"destructive"}
                onClick={HandleAccountDelete}
              >
                Folytatás
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </main>
  );
};

export default Settings;
