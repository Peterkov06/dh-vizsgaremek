import { UpcomingEvent } from "@/lib/models/teacherHome";

const TodayList = (props: {
  date: string;
  upcomingEvents?: UpcomingEvent[];
}) => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">{props.date}</h1>
      <div className="overflow-hidden h-[10em]">
        <div className="overflow-auto h-full flex flex-col gap-3">
          {(() => {
            const todaysEvents = props.upcomingEvents?.filter((ue) =>
              new Date().toLocaleDateString("en-CA").endsWith(ue.startDate),
            );
            return todaysEvents?.length ? (
              todaysEvents.map((ue) => (
                <div
                  key={ue.eventId}
                  className="flex gap-2 lg:gap-5 items-center"
                >
                  <p className="flex justify-center">{ue.startTime}</p>
                  <div className="flex justify-between py-1 lg:py-2 px-2 lg:px-3 w-full rounded-xl text-white bg-linear-to-tl from-secondary to-primary">
                    <p className="text-sm lg:text-xl max-w-[12em] truncate">
                      {ue.title}
                    </p>
                    <p className="truncate max-w-[5em] text-sm lg:text-lg">
                      {ue.studentName}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>Nincs ma esemény</p>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default TodayList;
