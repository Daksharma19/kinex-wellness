import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  return (
    <section className="px-6 pb-20 lg:px-8 lg:pb-28">
      <div className="mx-auto max-w-[1200px]">
        <div className="rounded-3xl bg-kinex-primary px-8 py-16 text-center shadow-ambient md:px-16 md:py-20">
          <h2 className="text-3xl font-bold tracking-[-0.02em] text-white md:text-[2.25rem]">
            Ready to Prioritize Your Health?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[17px] leading-relaxed text-white/85">
            Join the clinical sanctuary. Experience healthcare designed with
            dignity, excellence, and you in mind.
          </p>
          <form
            className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row sm:items-center sm:gap-0 sm:rounded-full sm:bg-white sm:p-1.5 sm:pl-5 sm:shadow-lg"
            action="#"
            method="post"
          >
            <Input
              type="email"
              name="email"
              required
              placeholder="Enter Email Here"
              className="h-12 flex-1 rounded-full border-0 bg-white text-kinex-on-surface shadow-sm sm:h-11 sm:bg-transparent sm:shadow-none"
              aria-label="Email address"
            />
            <Button
              type="submit"
              className="h-12 shrink-0 rounded-full bg-kinex-container px-8 text-[15px] font-semibold text-white hover:bg-kinex-primary-deep sm:h-11"
            >
              Submit Now
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
