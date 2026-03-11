import { UpcomingEvent } from "@/lib/models/teacherHome";

const TodayList = (props: {
  date: string;
  upcomingEvenets?: UpcomingEvent[];
}) => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">{props.date}</h1>
      <div className="overflow-hidden h-[10em]">
        <div className="overflow-auto h-full flex flex-col gap-3">
          {(() => {
            const todaysEvents = props.upcomingEvenets?.filter((ue) =>
              new Date().toLocaleDateString("en-CA").endsWith(ue.startDate),
            );
            return todaysEvents?.length ? (
              todaysEvents.map((ue) => (
                <div key={ue.eventId} className="flex gap-5 items-center">
                  <p>{ue.startTime}</p>
                  <div className="flex justify-between py-2 px-3 w-full rounded-xl text-white bg-linear-to-tl from-secondary to-primary">
                    <p className="text-xl">{ue.title}</p>
                    <p>{ue.studentName}</p>
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
