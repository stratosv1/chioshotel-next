const fs = require("fs");

const file = "components/home/LiveDirectRequest.tsx";
let s = fs.readFileSync(file, "utf8");

s = s.replace(
`  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);`,
`  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [lastSelectedKey, setLastSelectedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);`
);

s = s.replace(
`    const validSelectedDates = selectedDates.filter((date) => getNightInfo(deals, selectedRoom, date, guests));
    if (!validSelectedDates.length) {
      const firstDate = firstAvailableDate(deals, selectedRoom, guests);
      setSelectedDates(firstDate ? [firstDate] : []);
    } else if (validSelectedDates.length !== selectedDates.length) {
      setSelectedDates(validSelectedDates);
    }
  }, [deals, guests, selectedDates, selectedKey, selectedRoom]);`,
`    const firstDate = firstAvailableDate(deals, selectedRoom, guests);

    if (lastSelectedKey !== nextKey) {
      setLastSelectedKey(nextKey);
      setSelectedDates(firstDate ? [firstDate] : []);
      return;
    }

    const validSelectedDates = selectedDates.filter((date) => getNightInfo(deals, selectedRoom, date, guests));
    if (!validSelectedDates.length) {
      setSelectedDates(firstDate ? [firstDate] : []);
    } else if (validSelectedDates.length !== selectedDates.length) {
      setSelectedDates(validSelectedDates);
    }
  }, [deals, guests, lastSelectedKey, selectedDates, selectedKey, selectedRoom]);`
);

s = s.replace(
`            <div className="mt-3 flex snap-x gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-2.5">`,
`            <div className="mt-3 flex snap-x gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-7 md:gap-3 md:overflow-visible md:pb-0">`
);

s = s.replace(
`className={\`relative flex h-[86px] w-[70px] flex-none snap-start flex-col justify-center rounded-2xl border px-1.5 py-2 text-center shadow-sm transition md:h-[94px] md:w-[86px] \${`,
`className={\`relative flex h-[86px] w-[70px] flex-none snap-start flex-col justify-center rounded-2xl border px-1.5 py-2 text-center shadow-sm transition md:h-[94px] md:w-full md:flex-auto \${`
);

fs.writeFileSync(file, s, "utf8");
console.log("Patched LiveDirectRequest date chips and room-date reset");
