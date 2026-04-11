import { UpcomingEvent } from "@/lib/models/teacherHome";

const AllList = (props: { upcomingEvents?: UpcomingEvent[] }) => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Összes</h1>
      <div className="overflow-hidden h-[10em]">
        <div className="overflow-auto h-full flex flex-col gap-3">
          {(() => {
            const upcomingEvents = props.upcomingEvents?.filter((ue) => {
              const [month, day] = ue.startDate.split("-").map(Number);
              const today = new Date();
              const date = new Date(today.getFullYear(), month - 1, day);
              today.setHours(0, 0, 0, 0);
              return date >= today;
            });

            return upcomingEvents?.length ? (
              upcomingEvents.map((ue) => (
                <div key={ue.eventId} className="flex gap-2 items-center">
                  <div className="flex flex-col items-center">
                    <p className="text-xs">{ue.startTime}</p>
                    <p className="text-sm lg:text-lg font-bold whitespace-nowrap">
                      {ue.startDate}
                    </p>
                  </div>
                  <div className=" flex justify-between flex-1 items-center py-1 lg:py-2 px-2 lg:px-3  rounded-xl text-white bg-linear-to-tl from-secondary to-primary">
                    <p className=" text-sm lg:text-xl">
                      {ue.eventType === "Lesson" && "Óra"}
                    </p>
                    <p className="truncate max-w-[10em] text-sm lg:text-lg">
                      {ue.participantName}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>Nincs közelgő esemény</p>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default AllList;
