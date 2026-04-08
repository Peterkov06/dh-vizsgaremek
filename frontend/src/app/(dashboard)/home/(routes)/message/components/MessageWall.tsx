const MessageWall = (props: { id: string }) => {
  return (
    <section className="w-full h-full bg-light-bg-gray rounded-2xl p-6">
      {props.id}
    </section>
  );
};

export default MessageWall;
