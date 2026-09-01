/* eslint-disable @next/next/no-img-element */
// Marca de producto (Secure CRM) + lockup institucional UVG (versión blanca).
// Ambos se colocan sobre superficies verdes/oscuras para máximo contraste.

export function Logo({ className = 'h-8 w-auto' }: { className?: string }) {
  return <img src="/brand/logo.svg" alt="Secure CRM" className={className} />;
}

export function UvgLogo({
  className = 'h-8 w-auto',
  variant = 'white',
}: {
  className?: string;
  variant?: 'white' | 'ink';
}) {
  const src = variant === 'ink' ? '/brand/uvg-ink.png' : '/brand/uvg.png';
  return <img src={src} alt="Universidad del Valle de Guatemala" className={className} />;
}

export function Wordmark({ subtitle }: { subtitle?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <Logo className="h-7 w-auto" />
      {subtitle && <span className="text-[11px] font-medium text-white/55">{subtitle}</span>}
    </div>
  );
}

/** Producto + universidad, alineados para barras oscuras. */
export function BrandPair({
  className = '',
  logoClassName = 'h-7 w-auto',
  uvgClassName = 'h-7 w-auto',
}: {
  className?: string;
  logoClassName?: string;
  uvgClassName?: string;
}) {
  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      <Logo className={logoClassName} />
      <span className="h-6 w-px shrink-0 bg-white/25" aria-hidden />
      <UvgLogo className={uvgClassName} />
    </div>
  );
}
