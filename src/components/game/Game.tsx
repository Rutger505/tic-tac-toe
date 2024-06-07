"use client";

export default function GameBoard() {
  return (
    <div className={"space-y-10"}>
      <h1 className={"font-bold text-3xl text-center"}>Your turn (🗙)</h1>
      <div className={`relative grid grid-cols-3 grid-rows-3 h-96 w-96`}>
        <button></button>
        <button></button>
        <button></button>
        <button></button>
        <button></button>
        <button></button>
        <button></button>
        <button></button>
        <button></button>

        {/* Rounded lines */}
        <div className="absolute inset-0 flex flex-col justify-evenly -z-10">
          <div className="w-full h-[6px] bg-black rounded-full"></div>
          <div className="w-full h-[6px] bg-black rounded-full"></div>
        </div>
        <div className="absolute inset-0 flex justify-evenly -z-10">
          <div className="w-[6px] h-full bg-black rounded-full"></div>
          <div className="w-[6px] h-full bg-black rounded-full"></div>
        </div>
      </div>

      <p className={"text-center text-lg font-medium"}>
        Opponent: The Dark Knight
      </p>
    </div>
  );
}
