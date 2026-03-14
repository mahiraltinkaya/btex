import { LandingNavbar } from "@/components/landing/landing-navbar";
import { HeroBanner } from "@/components/landing/hero-banner";
import { EventSearchFilter } from "@/components/landing/event-search-filter";
import { WhatsHappening } from "@/components/landing/whats-happening";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <LandingNavbar />
      <HeroBanner />
      <EventSearchFilter />
      <WhatsHappening />
      <LandingFooter />
    </main>
  );
}
