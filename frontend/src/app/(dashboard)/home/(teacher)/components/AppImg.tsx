const BASE_URL = "https://localhost:7261/files/";

type AppImageProps = React.ComponentProps<"img"> & {
  src?: string | null;
};

export default function AppImage({ src, className, ...props }: AppImageProps) {
  return (
    <img
      src={src ? `${BASE_URL}${src}` : "/defaults/default_course.jpg"}
      className={className}
      {...props}
    />
  );
}
