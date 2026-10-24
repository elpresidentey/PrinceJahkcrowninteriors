"use client";

import { useEffect, useState } from "react";
import { CloudRain, CloudSun, Lightbulb, Ruler, Sun } from "lucide-react";

type Weather = {
  temperature: number | null;
  label: string;
  kind: "sun" | "cloud" | "rain";
};

/** Translated marquee copy, supplied by the [lang] layout via the hero. */
export interface StatusStrings {
  aria: string;
  updating: string;
  clear: string;
  partly: string;
  rain: string;
  sr: string;
  updates: readonly string[];
}

export function StudioStatusSlider({ aria: strings }: { aria: StatusStrings }) {
  const [weather, setWeather] = useState<Omit<Weather, "label"> & { label: string }>(() => ({
    temperature: null,
    label: strings.updating,
    kind: "cloud",
  }));

  useEffect(() => {
    const controller = new AbortController();
    // Give up after 8s so the marquee's placeholder is the worst case.
    const timeout = setTimeout(() => controller.abort(), 8000);

    async function loadWeather() {
      try {
        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=6.5244&longitude=3.3792&current=temperature_2m,weather_code&timezone=Africa%2FLagos",
          { signal: controller.signal }
        );
        if (!response.ok) return;
        const data: { current?: { temperature_2m?: number; weather_code?: number } } =
          await response.json();
        const current = data.current;
        if (current?.temperature_2m === undefined || current.weather_code === undefined) return;
        const condition = weatherLabel(current.weather_code);
        setWeather({
          temperature: Math.round(current.temperature_2m),
          label: condition.label,
          kind: condition.kind,
        });
      } catch {
        // The fallback status stays useful when the weather service is unavailable.
      }
    }

    void loadWeather();
    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, []);

  const weatherLabel = (code: number) => {
    if (code <= 1) return { label: strings.clear, kind: "sun" as const };
    if (code <= 3 || code === 45 || code === 48) {
      return { label: strings.partly, kind: "cloud" as const };
    }
    return { label: strings.rain, kind: "rain" as const };
  };

  const studioUpdates = [
    { text: strings.updates[0], Icon: Ruler },
    { text: strings.updates[1], Icon: Lightbulb },
    { text: strings.updates[2], Icon: Ruler },
  ];

  const WeatherIcon =
    weather.kind === "sun" ? Sun : weather.kind === "rain" ? CloudRain : CloudSun;
  const weatherText =
    weather.temperature === null
      ? weather.label
      : `Lagos · ${weather.temperature}°C · ${weather.label}`;
  const updates = [
    { text: weatherText, Icon: WeatherIcon },
    ...studioUpdates,
  ];

  return (
    <aside
      aria-label={strings.aria}
      className="relative z-10 w-full overflow-hidden border-t border-primary-foreground/15 bg-primary/70 backdrop-blur-sm"
    >
      <p className="sr-only" aria-live="polite">
        {weatherText}. {strings.sr}
      </p>
      <div aria-hidden className="status-marquee flex w-max motion-reduce:animate-none">
        {[...updates, ...updates].map(({ text, Icon }, index) => (
          <div
            key={`${text}-${index}`}
            className="flex shrink-0 items-center gap-3 border-r border-primary-foreground/15 px-5 py-4 sm:px-8"
          >
            <Icon className="size-3.5 text-gold-bright" strokeWidth={1.75} />
            <span className="eyebrow whitespace-nowrap text-primary-foreground/80">
              {text}
            </span>
            <span className="ml-3 size-1.5 rotate-45 bg-gold-bright/80" />
          </div>
        ))}
      </div>
    </aside>
  );
}
