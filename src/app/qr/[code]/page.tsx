import { redirect } from "next/navigation";

export default function QrRedirectPage({ params }: { params: { code: string } }) {
  redirect(`/landing?c=${encodeURIComponent(params.code)}`);
}

