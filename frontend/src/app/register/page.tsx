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
    <section className="flex flex-row h-screen w-full bg-registration-bg justify-center items-center p-5">
      <div className="lg:w-8/12"></div>
      <aside className="lg:w-4/12 lg:h-10/12 bg-background rounded-[1.2rem] p-10">
        <form action="" className="w-full h-full">
          <FieldGroup className="w-full h-full flex flex-col justify-between">
            <div className="flex flex-col items-start">
              <h1 className="text-3xl font-bold">Regisztráció</h1>
              <p className="indent-4 text-sm">
                Kérjük adja meg regisztrációs adatait!
              </p>
            </div>
            <Field className="w-full">
              <ToggleGroup
                type="single"
                defaultValue="a"
                className="justify-center w-full flex"
              >
                <ToggleGroupItem value="a" className="flex-1">
                  Tanuló
                </ToggleGroupItem>
                <ToggleGroupItem value="b" className="flex-1">
                  Tanár
                </ToggleGroupItem>
                <ToggleGroupItem value="c" className="flex-1">
                  Szülő
                </ToggleGroupItem>
              </ToggleGroup>
            </Field>
            <FieldSet>
              <Field className="w-full">
                <Input type="text" placeholder="Email cím" />
              </Field>
              <Field className="w-full">
                <Input type="password" placeholder="Jelszó" />
              </Field>
            </FieldSet>
            <Button variant={"default"} className="w-full rounded-[1rem]">
              Regisztráció
            </Button>

            <FieldSeparator></FieldSeparator>
            <FieldSet className="flex-row justify-center">
              <Button>Google</Button>
              <Button>Microsoft</Button>
              <Button>Facebook</Button>
            </FieldSet>
          </FieldGroup>
        </form>
      </aside>
    </section>
  );
};

export default page;
