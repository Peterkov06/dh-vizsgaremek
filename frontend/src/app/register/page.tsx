import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const page = () => {
  return (
    <section className="flex flex-row h-screen min-h-screen w-full bg-registration-bg justify-center items-center px-10">
      <div className="lg:w-7/12"></div>
      <aside className="w-full lg:w-5/12 h-10/12 bg-background rounded-[1.2rem] p-10">
        <form action="" className="w-full h-full">
          <FieldGroup className="w-full h-full flex flex-col justify-between">
            <div className="flex flex-col items-start">
              <h1 className="text-2xl md:text-3xl font-bold text-primary">
                Regisztráció
              </h1>
              <p className="indent-4 text-xs md:text-sm">
                Kérjük adja meg regisztrációs adatait!
              </p>
            </div>
            <Field className="w-full">
              <ToggleGroup
                type="single"
                defaultValue="a"
                spacing={0.1}
                className="justify-center w-full flex bg-primary p-[0.35rem] text-primary-foreground rounded-2xl"
              >
                <ToggleGroupItem value="a" className="flex-1 rounded-[0.8rem] ">
                  Tanuló
                </ToggleGroupItem>
                <ToggleGroupItem value="b" className="flex-1 rounded-[0.8rem] ">
                  Tanár
                </ToggleGroupItem>
                <ToggleGroupItem value="c" className="flex-1 rounded-[0.8rem] ">
                  Szülő
                </ToggleGroupItem>
              </ToggleGroup>
            </Field>
            <FieldSet>
              <Field className="w-full">
                <Input
                  type="text"
                  placeholder="Email cím"
                  className="border-2 border-border rounded-2xl py-5 text-sm"
                />
              </Field>
              <Field className="w-full">
                <Input
                  type="password"
                  placeholder="Jelszó"
                  className="border-2 border-border rounded-2xl py-5 text-sm"
                />
              </Field>
            </FieldSet>
            <Button
              variant={"default"}
              className="w-full rounded-2xl py-6  md:text-lg"
            >
              Regisztráció
            </Button>

            <div className="flex flex-row justify-center items-center">
              <FieldSeparator className="w-full"></FieldSeparator>
              <p className="mx-3 text-sidebar-border text-[0.7rem] whitespace-nowrap">
                Vagy regisztrálj más fiókkal
              </p>
              <FieldSeparator className="w-full"></FieldSeparator>
            </div>
            <FieldSet className="flex-row justify-center">
              <Button>A</Button>
              <Button>B</Button>
              <Button>C</Button>
            </FieldSet>
          </FieldGroup>
        </form>
      </aside>
    </section>
  );
};

export default page;
