import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  CheckIcon,
  MinusIcon,
  WarningIcon,
} from "@phosphor-icons/react/dist/ssr";

import { HeroPreview } from "@/components/site/HeroPreview";
import { Reveal } from "@/components/site/Reveal";
import { ConfidenceChip } from "@/components/ui/Confidence";
import { getCase, siteData } from "@/lib/data";
import { formatPeso } from "@/lib/format";

const statusMark = {
  supported: { icon: CheckIcon, className: "text-verified", label: "Supported" },
  partial: { icon: MinusIcon, className: "text-review", label: "Partial" },
  unsupported: { icon: WarningIcon, className: "text-risk", label: "Not supported" },
} as const;

export default function LandingPage() {
  const { product, sources, intake, pillars, confidenceBands, safeguards, plans, faq } = siteData;
  const demo = getCase("people-vs-cruz")!;
  const matrix = demo.proofMatrix.elements.slice(0, 5);

  return (
    <>
      {/* Hero, asymmetric split */}
      <section className="border-b border-line">
        <div className="shell grid items-center gap-12 pt-14 pb-16 md:grid-cols-[1.05fr_0.95fr] md:pt-20 md:pb-20">
          <div>
            <h1 className="text-[2rem] leading-[1.05] font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl lg:text-[3.4rem]">
              {product.headline}
            </h1>
            <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-ink-2">
              {product.subhead}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={product.primaryCta.href}
                className="inline-flex items-center gap-2 rounded-[8px] bg-accent px-5 py-3 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-hover active:translate-y-px"
              >
                {product.primaryCta.label}
                <ArrowRightIcon size={16} weight="bold" />
              </Link>
              <Link
                href={product.secondaryCta.href}
                className="inline-flex items-center rounded-[8px] border border-line-strong px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-surface-2 active:translate-y-px"
              >
                {product.secondaryCta.label}
              </Link>
            </div>
          </div>
          <HeroPreview />
        </div>
      </section>

      {/* Sources it reads */}
      <section className="border-b border-line bg-surface">
        <div className="shell py-10">
          <h2 className="text-[13px] font-medium text-ink-3">
            Built for what actually arrives in a Philippine case folder
          </h2>
          <ul className="mt-5 flex flex-wrap gap-2.5">
            {sources.map((source) => (
              <li
                key={source.label}
                className="rounded-full border border-line bg-canvas px-3.5 py-2 text-[13px]"
              >
                <span className="font-medium">{source.label}</span>
                <span className="text-ink-3"> {source.note}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The pile, image beside counts */}
      <section className="border-b border-line">
        <div className="shell grid items-center gap-10 py-20 md:grid-cols-2 md:gap-16">
          <Reveal>
            <Image
              src="https://picsum.photos/seed/manila-law-office-case-folders/1200/900"
              alt="Stacked case folders and loose documents on a desk"
              width={1200}
              height={900}
              className="h-full w-full rounded-[12px] border border-line object-cover"
              priority
            />
          </Reveal>
          <div>
            <h2 className="text-3xl leading-tight font-semibold tracking-tight md:text-4xl">
              A new client walks in with 94 files and no order to them
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-2">
              Reading all of it just to answer what happened, when, and which documents matter takes
              a day you do not have. Intake for {intake.caseTitle} looked like this.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3">
              {intake.pile.map((row, index) => (
                <Reveal key={row.label} delay={index * 0.04}>
                  <div className="border-t border-line pt-3">
                    <dt className="font-mono text-2xl tabular-nums">{row.count}</dt>
                    <dd className="mt-1 text-[13px] text-ink-2">{row.label}</dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Pillars, four cells with mixed weight */}
      <section className="border-b border-line bg-surface">
        <div className="shell py-20">
          <h2 className="max-w-2xl text-3xl leading-tight font-semibold tracking-tight md:text-4xl">
            What you get back, an hour after the upload
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <article className="rounded-[12px] border border-line bg-accent-soft p-6 md:col-span-2 md:p-8">
              <h3 className="text-xl font-semibold tracking-tight">{pillars[0].title}</h3>
              <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-ink-2">
                {pillars[0].body}
              </p>
              <p className="mt-4 font-mono text-xs text-accent">{pillars[0].detail}</p>
            </article>
            <article className="rounded-[12px] border border-line bg-canvas p-6 md:p-8">
              <h3 className="text-xl font-semibold tracking-tight">{pillars[1].title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{pillars[1].body}</p>
              <p className="mt-4 font-mono text-xs text-ink-3">{pillars[1].detail}</p>
            </article>
            <article className="rounded-[12px] border border-line bg-canvas p-6 md:p-8">
              <h3 className="text-xl font-semibold tracking-tight">{pillars[2].title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{pillars[2].body}</p>
              <p className="mt-4 font-mono text-xs text-ink-3">{pillars[2].detail}</p>
            </article>
            <article className="relative overflow-hidden rounded-[12px] border border-line bg-canvas p-6 md:col-span-2 md:p-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(120%_100%_at_100%_0%,var(--c-accent-soft),transparent_70%)]"
              />
              <div className="relative">
                <h3 className="text-xl font-semibold tracking-tight">{pillars[3].title}</h3>
                <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-ink-2">
                  {pillars[3].body}
                </p>
                <p className="mt-4 font-mono text-xs text-ink-3">{pillars[3].detail}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Proof matrix, real rows from the demo case */}
      <section className="border-b border-line">
        <div className="shell py-20">
          <div className="max-w-2xl">
            <h2 className="text-3xl leading-tight font-semibold tracking-tight md:text-4xl">
              Every element of the offence, beside the evidence you hold
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-2">
              This is the live matrix from the demo BP 22 file. The unsupported row is the one that
              decides whether the case is ready to file.
            </p>
          </div>

          <div className="mt-9 overflow-x-auto rounded-[12px] border border-line bg-surface">
            <table className="w-full min-w-[42rem] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-[12px] text-ink-3">
                  <th scope="col" className="px-5 py-3 font-medium">
                    Element
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Evidence on file
                  </th>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {matrix.map((row) => {
                  const mark = statusMark[row.status];
                  const Icon = mark.icon;
                  return (
                    <tr key={row.element}>
                      <th scope="row" className="max-w-xs px-5 py-4 align-top font-medium">
                        {row.element}
                        <span className="mt-1 block font-mono text-[11px] font-normal text-ink-3">
                          {row.authority}
                        </span>
                      </th>
                      <td className="px-5 py-4 align-top text-ink-2">
                        {row.evidence.length === 0 ? (
                          <span className="text-risk">Nothing on file</span>
                        ) : (
                          row.evidence
                            .map((id) => demo.evidence.find((e) => e.id === id)?.filename ?? id)
                            .join(", ")
                        )}
                      </td>
                      <td className="px-5 py-4 align-top">
                        <span className={`inline-flex items-center gap-1.5 ${mark.className}`}>
                          <Icon size={15} weight="bold" />
                          {mark.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-ink-3">{demo.proofMatrix.basis}</p>
        </div>
      </section>

      {/* Uncertainty handling */}
      <section className="border-b border-line bg-surface">
        <div className="shell py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <h2 className="text-3xl leading-tight font-semibold tracking-tight md:text-4xl">
                It reports what it could not read
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-2">
                A blurred receipt produces a blank field and a reason, never a plausible number. Each
                extraction carries a score, and the score decides how the text may be used.
              </p>
              <ul className="mt-8 space-y-4">
                {confidenceBands.map((band) => (
                  <li key={band.band} className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
                    <span className="w-24 shrink-0 font-mono text-sm tabular-nums">{band.band}</span>
                    <ConfidenceChip
                      value={band.tone === "verified" ? 98 : band.tone === "review" ? 86 : 41}
                      showValue={false}
                    />
                    <span className="w-full text-[13px] leading-relaxed text-ink-2 sm:w-auto sm:flex-1">
                      {band.meaning}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <ul className="grid gap-px overflow-hidden rounded-[12px] border border-line bg-line sm:grid-cols-2">
              {safeguards.map((item) => (
                <li key={item.title} className="bg-canvas p-6">
                  <h3 className="text-[15px] font-medium">{item.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-ink-2">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="border-b border-line">
        <div className="shell py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="text-3xl leading-tight font-semibold tracking-tight md:text-4xl">
              Priced for a Philippine practice
            </h2>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
            >
              Full comparison
              <ArrowRightIcon size={15} weight="bold" />
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-[12px] border p-6 ${
                  plan.featured ? "border-accent-line bg-accent-soft" : "border-line bg-surface"
                }`}
              >
                <h3 className="text-[15px] font-medium">{plan.name}</h3>
                <p className="mt-3 font-mono text-2xl tabular-nums">
                  {plan.price === null ? "On request" : formatPeso(plan.price)}
                </p>
                <p className="mt-1 text-[13px] text-ink-3">{plan.unit}</p>
                <p className="mt-4 text-[13px] leading-relaxed text-ink-2">{plan.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Questions and closing */}
      <section>
        <div className="shell grid gap-12 py-20 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-3xl leading-tight font-semibold tracking-tight md:text-4xl">
              Questions a partner asks first
            </h2>
            <div className="mt-8 rounded-[12px] border border-line bg-surface p-6">
              <p className="text-[15px] leading-relaxed">
                Open the demo case file and check the flagged items yourself. Nothing to install.
              </p>
              <Link
                href="/app"
                className="mt-5 inline-flex items-center gap-2 rounded-[8px] bg-accent px-5 py-3 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-hover active:translate-y-px"
              >
                Open the demo case
                <ArrowRightIcon size={16} weight="bold" />
              </Link>
            </div>
          </div>

          <dl className="divide-y divide-line border-y border-line">
            {faq.map((item) => (
              <div key={item.q}>
                <details className="group">
                  <summary className="flex items-center justify-between gap-6 py-5 text-[15px] font-medium">
                    <dt>{item.q}</dt>
                    <span
                      aria-hidden="true"
                      className="grid size-6 shrink-0 place-items-center rounded-full border border-line text-ink-3 transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <dd className="max-w-2xl pb-5 text-[14px] leading-relaxed text-ink-2">
                    {item.a}
                  </dd>
                </details>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
