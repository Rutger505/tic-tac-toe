import { RotatingIcon } from "@/components/play/RotatingIcon";
import { CancelButton } from "@/components/play/CancelButton";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center gap-10">
      <h1 className="text-4xl font-bold">Waiting for opponent</h1>
      <RotatingIcon />
      <CancelButton />
    </main>
  );
}
