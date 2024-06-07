import Image from "next/image";
import Link from "next/link";
import { auth, signIn, signOut } from "@/auth";

export default async function Header() {
  const session = await auth();

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
        {session ? (
          <>
            <Link href={"/friends"} className={"font-medium text-xl"}>
              Friends
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button className={"font-medium text-xl"}>Logout</button>
            </form>
          </>
        ) : (
          <form
            action={async () => {
              "use server";
              await signIn();
            }}
          >
            <button className={"font-medium text-xl"}>Login</button>
          </form>
        )}
      </div>
    </header>
  );
}
