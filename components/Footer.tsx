import { PRIVACY_POLICY_URL, SITE_NAME, copy } from "@/lib/config";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-slate-600 sm:px-6">
        <p>{copy.privacyNote}</p>
        <p className="mt-2">
          © {new Date().getFullYear()} {SITE_NAME} ·{" "}
          <a
            href={PRIVACY_POLICY_URL}
            className="font-medium text-blue-700 underline underline-offset-2 hover:text-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 rounded"
          >
            Privacy policy
          </a>
        </p>
      </div>
    </footer>
  );
}
