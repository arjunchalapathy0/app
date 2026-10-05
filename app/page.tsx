import { Calculator } from "@/components/Calculator";
import { Footer } from "@/components/Footer";
import { copy } from "@/lib/config";

export default function Home() {
  return (
    <>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-10 pb-12 sm:px-6 sm:pt-16">
        <header className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-balance text-slate-900 sm:text-5xl">
            {copy.heroTitle}
          </h1>
          <p className="mt-4 text-lg text-pretty text-slate-700 sm:text-xl">{copy.heroSubtitle}</p>
        </header>
        <div className="mt-8 sm:mt-12">
          <Calculator />
        </div>
      </main>
      <Footer />
    </>
  );
}
