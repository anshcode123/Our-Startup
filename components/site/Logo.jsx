/**
 * The site's brand mark, used by both Navigation and Footer. No real logo
 * file has been supplied yet, so this renders the wordmark as styled
 * text — centralizing it here means dropping in a real
 * `/assets/brand/logo.svg` later (via next/image) is a one-file change
 * instead of editing Navigation.jsx and Footer.jsx separately.
 *
 * To swap in a real logo:
 *   import Image from "next/image";
 *   <Image src="/assets/brand/logo.svg" alt="Anshul.dev" width={120} height={24} priority={props.priority} />
 */
export default function Logo({ className = "" }) {
  return <span className={`font-medium tracking-wide text-white ${className}`}>ANSHUL.DEV</span>;
}
