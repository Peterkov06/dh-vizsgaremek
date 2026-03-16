import { Checkbox } from "@/components/ui/checkbox";
import { Book, Funnel, Globe, MapPin } from "lucide-react";

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
              <MapPin></MapPin>Helyszín:
            </h2>
            <div className="overflow-hidden h-42">
              <div className="overflow-auto h-full"></div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
};

export default CourseSearchPage;
