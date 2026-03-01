import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-[#D0D5DD] bg-[#F2F4F7] px-8 py-12">
      <div className="mx-auto max-w-[1200px]">
        <p className="text-sm text-[#555555]">
          Part of the{" "}
          <Link
            href="/"
            className="font-medium text-[#3B82F6] underline-offset-4 hover:underline"
          >
            DecisionDock
          </Link>{" "}
          portfolio.
        </p>
      </div>
    </footer>
  );
}
