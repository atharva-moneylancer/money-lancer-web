"use client";
import { useRouter } from "next/navigation";

type Group = { group: string; items: { value: string; label: string }[] };

export function CategoryFilter({
  groups,
  selected,
}: {
  groups: Group[];
  selected: string; // "all" or a category value
}) {
  const router = useRouter();

  // Determine which group tab is active
  const activeGroup =
    selected === "all"
      ? "all"
      : groups.find((g) => g.items.some((i) => i.value === selected))?.group ?? "all";

  const subItems =
    activeGroup === "all"
      ? []
      : groups.find((g) => g.group === activeGroup)?.items ?? [];

  function navigate(val: string) {
    router.push(val === "all" ? "/funds" : `/funds?category=${encodeURIComponent(val)}`);
  }

  return (
    <div className="mt-10">
      {/* ── Tier 1: Asset-class tabs ── */}
      <div className="flex items-center gap-1 border-b border-black/[0.07]">
        {/* All tab */}
        <Tab
          label="All Funds"
          active={activeGroup === "all"}
          onClick={() => navigate("all")}
        />
        {groups.map((g) => (
          <Tab
            key={g.group}
            label={g.group}
            active={g.group === activeGroup}
            onClick={() => {
              // Clicking a group tab selects the group but no sub-category yet →
              // navigate to the first sub-item of the group
              const first = g.items[0];
              if (first) navigate(first.value);
            }}
          />
        ))}
      </div>

      {/* ── Tier 2: Sub-category pills (only when a group is active) ── */}
      {subItems.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {subItems.map(({ value, label }) => {
            const active = value === selected;
            return (
              <button
                key={value}
                onClick={() => navigate(value)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  active
                    ? "bg-crayola text-white shadow-sm"
                    : "bg-black/[0.04] text-graphite hover:bg-crayola/10 hover:text-crayola"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Tab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap ${
        active
          ? "text-crayola"
          : "text-slate1 hover:text-graphite"
      }`}
    >
      {label}
      {/* Active underline */}
      {active && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-crayola" />
      )}
    </button>
  );
}
