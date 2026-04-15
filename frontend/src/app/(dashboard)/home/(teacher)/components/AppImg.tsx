import Image from "next/image";

const BASE_URL = "https://localhost:7261/files/";

type AppImageProps = Omit<React.ComponentProps<typeof Image>, "src"> & {
  src?: string | null;
};

export default function AppImage({ src, ...props }: AppImageProps) {
  return (
    <img src={src ? `${BASE_URL}${src}` : "/placeholder.png"} {...props} />
  );
}
