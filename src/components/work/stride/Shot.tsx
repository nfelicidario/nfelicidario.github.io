import Image from "next/image";

export function Shot({
  src,
  alt,
  width,
  height,
  caption,
  className = "",
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="bubble-sm h-auto w-full border border-rule"
      />
      {caption && <p className="mt-2 text-[12.5px] text-muted">{caption}</p>}
    </div>
  );
}
