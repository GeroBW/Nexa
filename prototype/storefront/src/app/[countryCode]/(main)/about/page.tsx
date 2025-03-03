// External components
import Image from "next/image"
import { StoreRegion } from "@medusajs/types"

// Lib
import { listRegions } from "@lib/data/regions"

// Components
import { Layout, LayoutColumn } from "@/components/Layout"

export async function generateStaticParams() {
  const countryCodes = await listRegions().then((regions: StoreRegion[]) =>
    regions.flatMap((r) =>
      r.countries
        ? r.countries
            .map((c) => c.iso_2)
            .filter(
              (value): value is string =>
                typeof value === "string" && Boolean(value)
            )
        : []
    )
  )

  const staticParams = countryCodes.map((countryCode) => ({
    countryCode,
  }))

  return staticParams
}

export default function AboutPage() {
  return (
    <>
      <div className="max-md:pt-18">
        <Image
          src="/images/content/hemd_gefaltet.jpg"
          width={2880}
          height={1500}
          alt="Living room"
          className="md:h-screen md:object-cover"
        />
      </div>
      <div className="pt-8 md:pt-26 pb-26 md:pb-36">
        <Layout>
          <LayoutColumn start={1} end={{ base: 13, lg: 7 }}>
            <h3 className="text-lg max-lg:mb-6 md:text-2xl">
              At Nexa, we believe that everyone deserves clothing that fits.
            </h3>
          </LayoutColumn>
          <LayoutColumn start={{ base: 1, lg: 8 }} end={13}>
            <div className="md:text-md lg:mt-18">
              <p className="mb-6 lg:mb-8">
                Welcome to Nexa, where comfort and style
                effortlessly intertwines. Our mission is to help you never worry about size again.
              </p>
              <p>
                Every product in our collection is chosen with care, blending
                quality with tall fits to offer you the
                perfect items for your measurements.
              </p>
            </div>
          </LayoutColumn>
        </Layout>
      </div>
    </>
  )
}
