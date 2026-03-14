"use client";

import { useTranslations } from "next-intl";
import { EventCard } from "@/components/landing/event-card";

const EVENTS = [
  { nameKey: "event1", imageSrc: "/images/landing/artist-1.png" },
  { nameKey: "event2", imageSrc: "/images/landing/artist-2.png" },
  { nameKey: "event3", imageSrc: "/images/landing/artist-3.png" },
] as const;

export function WhatsHappening() {
  const t = useTranslations("LandingPage.whatsHappening");

  return (
    <section id="events" className="w-full bg-[#0a0a0a] px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 text-2xl font-extrabold uppercase tracking-wider text-white sm:mb-16 sm:text-3xl md:text-4xl">
          {t("title")}
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {EVENTS.map((event) => (
            <EventCard
              key={event.nameKey}
              name={t(`${event.nameKey}.name`)}
              venue={t(`${event.nameKey}.venue`)}
              imageSrc={event.imageSrc}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
