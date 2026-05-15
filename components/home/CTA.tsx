"use client";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function CTA() {
  return (
    <section id="contact" className="py-24 lg:py-32">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-navy px-8 py-16 text-white md:px-16 md:py-20">
          {/* hex motif */}
          <svg
            className="pointer-events-none absolute -right-12 -top-12 h-72 w-72 opacity-30"
            viewBox="0 0 200 200"
          >
            <path d="M100 8 L180 52 V148 L100 192 L20 148 V52 Z" fill="#1675F4" />
          </svg>
          <svg
            className="pointer-events-none absolute -right-32 bottom-[-60px] h-80 w-80 opacity-20"
            viewBox="0 0 200 200"
          >
            <path d="M100 8 L180 52 V148 L100 192 L20 148 V52 Z" fill="#64E9EE" />
          </svg>

          <div className="relative max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-electric">
              Get started
            </p>
            <h2 className="mt-4 font-display text-headline font-bold tracking-tight">
              Let's build your portfolio together.
            </h2>
            <p className="mt-4 text-body-l text-white/75">
              A 30-minute conversation with a senior advisor. No obligation, no jargon. We'll
              understand your goals and show you exactly where you stand.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" variant="light" href="#contact-form">Book a free consultation</Button>
              <Button size="lg" variant="ghost" className="text-white border border-white/20 hover:bg-white/10" href="https://wa.me/919209039205">
                WhatsApp us
              </Button>
            </div>
          </div>

          <ContactForm />
        </div>
      </Container>
    </section>
  );
}

function ContactForm() {
  return (
    <form
      id="contact-form"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const data = Object.fromEntries(fd.entries());
        const msg = `Hi Money Lancer, I'd like to start investing.%0A%0AName: ${data.name}%0APhone: ${data.phone}%0AEmail: ${data.email}%0AGoal: ${data.goal}`;
        window.location.href = `https://wa.me/919209039205?text=${msg}`;
      }}
      className="relative mt-12 grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur md:grid-cols-2 md:p-8"
    >
      <Field name="name" label="Full name" placeholder="Your name" required />
      <Field name="phone" label="Phone" placeholder="+91 …" required />
      <Field name="email" label="Email" type="email" placeholder="you@email.com" />
      <Field name="goal" label="Primary goal" placeholder="e.g. retirement, child's education" />
      <div className="md:col-span-2">
        <Button type="submit" size="lg" className="w-full md:w-auto">
          Request callback →
        </Button>
        <p className="mt-3 text-[11px] text-white/55">
          By submitting you agree to our privacy policy. We'll never share your details.
        </p>
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  placeholder,
  required,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-white/60">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-electric focus:bg-white/10 focus:outline-none"
      />
    </label>
  );
}
