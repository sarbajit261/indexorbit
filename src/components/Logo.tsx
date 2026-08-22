import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  href?: string;
  src?: string;
  asLink?: boolean;
}

export function Logo({ className = "", href = "/", src = "/Black Logo IO.png", asLink = true }: LogoProps) {
  const image = (
    <Image
      src={src}
      alt="IndexOrbit"
      width={100}
      height={67}
      className="h-full w-auto"
      priority
    />
  );

  if (asLink) {
    return (
      <Link href={href} className={className}>
        {image}
      </Link>
    );
  }

  return <div className={className}>{image}</div>;
}
