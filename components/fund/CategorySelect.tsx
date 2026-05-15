"use client";
import { useRouter } from "next/navigation";

type Group = { group: string; items: { value: string; label: string }[] };

export function CategorySelect({
  groups,
  selected,
}: {
  groups: Group[];
  selected: string;
}) {
  const router = useRouter();

  return (
    <select
      value={selected}
      onChange={(e) => {
        const v = e.target.value;
        router.push(v === "all" ? "/funds" : `/funds?category=${encodeURIComponent(v)}`);
      }}
      className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-graphite shadow-soft focus:border-crayola focus:outline-none focus:ring-2 focus:ring-crayola/20 cursor-pointer"
    >
      <option value="all">All Funds</option>
      {groups.map((g) => (
        <optgroup key={g.group} label={g.group}>
          {g.items.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
