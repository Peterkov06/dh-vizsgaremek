import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import WeeklyScheduleBuilder from "./WeeklyScheduleBuilder";
import { Button } from "@/components/ui/button";
import WeeklyScheduleBuilderSpecific from "./WeeklyScheduleBuilderSpecific";

const AddTimeBlock = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Szabad időpontok beállítása</Button>
      </DialogTrigger>
      <DialogContent className="max-w-none! w-[70%]">
        <DialogHeader>
          <DialogTitle>Szabad időpontok</DialogTitle>
        </DialogHeader>
        <div>
          <WeeklyScheduleBuilderSpecific></WeeklyScheduleBuilderSpecific>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTimeBlock;
