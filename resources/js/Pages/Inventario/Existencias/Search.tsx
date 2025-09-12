import { useState } from "react";
import { X, Search } from "lucide-react";

export type Chip = {
  value: string;
};

interface ChipSearchProps {
  onChange: (chips: Chip[]) => void; // 👈 callback para pasar los chips al padre
}

export default function ChipSearch({ onChange }: ChipSearchProps) {
  const [chips, setChips] = useState<Chip[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      const newChips = [...chips, { value: inputValue.trim() }];
      setChips(newChips);
      onChange(newChips); // notificamos al padre
      setInputValue("");
      e.preventDefault();
    }
  };

  const removeChip = (index: number) => {
    const newChips = chips.filter((_, i) => i !== index);
    setChips(newChips);
    onChange(newChips); // notificamos al padre
  };

  return (
    <div className="relative flex-1 max-w-sm flex items-center border rounded-md px-2 py-1">
      <Search className="text-muted-foreground h-4 w-4 mr-2" />

      <div className="flex gap-2 flex-wrap items-center flex-1">
        {chips.map((chip, i) => (
          <span
            key={i}
            className="flex items-center bg-stone-400 text-white text-sm rounded px-2 py-1"
          >
            {chip.value}
            <button
              className="ml-2 hover:text-gray-300"
              onClick={() => removeChip(i)}
            >
              <X size={14} />
            </button>
          </span>
        ))}

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar..."
          className="flex-1 outline-none focus:ring-0 focus:border-transparent text-sm min-w-[120px] bg-transparent border-none"
        />
      </div>
    </div>
  );
}
