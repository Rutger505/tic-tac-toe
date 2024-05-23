import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between h-24 px-12">
      <Link href={"/"}>
        <Image
          src={"/icon.svg"}
          alt={"Tic-tac-toe Icon"}
          width={50}
          height={50}
        />
      </Link>

      <div className={"flex gap-12"}>
        <Link href={"friends"} className={"font-medium text-xl"}>
          Friends
        </Link>
        <button className={"font-medium text-xl"}>Logout</button>
        <button className={"font-medium text-xl"}>Login</button>
      </div>
    </header>
  );
}
