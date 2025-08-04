import Image from "next/image"

interface TapestryLogoProps {
  size?: number
  className?: string
}

export default function TapestryLogo({ size = 40, className = "" }: TapestryLogoProps) {
  return (
    <Image
      src="/images/tapestry-logo.png"
      alt="Tapestry Logo"
      width={size}
      height={size}
      className={className}
      priority
    />
  )
}
