import NextImage from "next/image";
import { imageSize } from "@/lib/image-sizes";

type Props = {
  src: string;
  alt: string;
  className?: string;
  /**
   * Fill the nearest positioned ancestor, for images that were previously CSS
   * `background-image`. A background cannot be optimised, preloaded, lazily
   * loaded or given alt text; `fill` gets all of that back while keeping the
   * same visual result via object-fit.
   */
  fill?: boolean;
  /**
   * Set on the image that is the Largest Contentful Paint for its page - the
   * hero, essentially. It preloads the file and skips lazy loading. Marking
   * more than one or two per page makes LCP worse, not better, because the
   * preloads compete for bandwidth.
   */
  priority?: boolean;
  /**
   * The rendered width at each breakpoint, so the browser picks the smallest
   * sufficient variant. Without it Next assumes the image spans the viewport
   * and ships a needlessly large file to phones.
   */
  sizes?: string;
  style?: React.CSSProperties;
  "aria-hidden"?: boolean | "true" | "false";
};

/**
 * Bundled images render through next/image, which serves AVIF/WebP at the size
 * the layout actually uses and reserves space up front so nothing shifts.
 *
 * Images whose dimensions are unknown - CMS rows can carry an arbitrary remote
 * URL - fall back to a plain lazy <img>. next/image would reject an
 * unconfigured remote host outright, so the fallback is what keeps an editor
 * from being able to break a page by pasting a link.
 */
export default function Img({
  src,
  alt,
  className,
  fill,
  priority,
  sizes = "100vw",
  style,
  ...rest
}: Props) {
  const size = imageSize(src);

  if (!size) {
    // Unknown dimensions: a plain <img>, with fill reproduced in CSS.
    const fallbackStyle: React.CSSProperties = fill
      ? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...style }
      : style ?? {};

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={className}
        style={fallbackStyle}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        {...rest}
      />
    );
  }

  if (fill) {
    return (
      <NextImage
        src={src}
        alt={alt}
        fill
        className={className}
        style={{ objectFit: "cover", ...style }}
        sizes={sizes}
        priority={priority}
        {...rest}
      />
    );
  }

  return (
    <NextImage
      src={src}
      alt={alt}
      width={size.width}
      height={size.height}
      className={className}
      style={style}
      sizes={sizes}
      priority={priority}
      {...rest}
    />
  );
}
