import type { Metadata } from "next";
import { PageHero, Section, SectionHeading, Photo } from "@/components/shared";
import { Features, ProcessSteps, Stats, CTASection } from "@/components/sections";
import type { ImageKey } from "@/lib/image-manifest";

export const metadata: Metadata = {
  title: "About",
  description:
    "Prince Jahknow Crown Interior Services designs and builds premium POP ceilings and interiors across Lagos — one team, one standard, from first sketch to final handover.",
};

const buildShots: { image: ImageKey; caption: string }[] = [
  { image: "build-scaffold-01", caption: "Structure & scaffolding" },
  { image: "build-site-01", caption: "Shell in progress" },
  { image: "build-shell-02", caption: "Roof on, systems in" },
  { image: "build-scaffold-02", caption: "Finishing on site" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Craftsmanship you notice every day"
        subtitle="Prince Jahknow Crown Interior Services is a Lagos studio of designers, plasterers and finishers who treat the ceiling as the most important surface in the room."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow="Our story"
              title="Built on detail, not on promises"
              className="mb-8"
            />
            <div className="max-w-xl space-y-6 text-[0.95rem] leading-relaxed text-muted-foreground">
              <p>
                We started with a simple frustration: too many beautiful renders
                never survived contact with the real room. So we built a team that
                designs, builds and finishes under one roof — where the person who
                drew your ceiling is the person who signs it off.
              </p>
              <p>
                That means honest quotes, tidy sites and a finish that still looks
                intentional years later. From a single accent ceiling to a complete
                home, the standard never changes.
              </p>
            </div>
            <blockquote className="mt-10 border-l-2 border-foreground/20 pl-6">
              <p className="font-serif text-2xl italic leading-snug text-foreground">
                &ldquo;We don&apos;t hand over until we&apos;d happily live under it
                ourselves.&rdquo;
              </p>
              <footer className="eyebrow mt-4 text-muted-foreground">
                The Prince Jahknow Crown Interior Services team
              </footer>
            </blockquote>
          </div>

          <div className="lg:col-span-5">
            <Photo image="living-linear-cove" ratio="aspect-[4/5]" />
          </div>
        </div>
      </Section>

      <Section background="secondary" id="behind-the-build" className="scroll-mt-20">
        <SectionHeading
          eyebrow="Behind the build"
          title="The part most portfolios skip"
          subtitle="Before the lighting and the finish, there is structure, plaster and patience. We show it because it's where quality is actually decided."
        />

        <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {buildShots.map((shot) => (
            <figure key={shot.image} className="group">
              <Photo
                image={shot.image}
                ratio="aspect-[3/4]"
                sizes="(min-width: 1024px) 23vw, 46vw"
              />
              <figcaption className="eyebrow mt-4 text-muted-foreground">
                {shot.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Stats />
      <Features />
      <ProcessSteps />
      <CTASection />
    </>
  );
}
