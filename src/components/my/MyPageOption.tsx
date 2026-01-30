import Link from "next/link";

export default function MyPageOption({
  href,
  label,
  onClick,
}: {
  href?: string;
  label: string;
  onClick?: () => void;
}) {
  if (!href) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center justify-between border-b border-gray-200 py-5 text-base font-medium text-gray-900"
      >
        <span>{label}</span>
        <span className="text-lg text-gray-400">›</span>
      </button>
    );
  }
  return (
    <Link
      href={href}
      className="flex items-center justify-between border-b border-gray-200 py-5 text-base font-medium text-gray-900"
    >
      <span>{label}</span>
      <span className="text-lg text-gray-400">›</span>
    </Link>
  );
}
