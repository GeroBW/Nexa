// External
import { Metadata } from "next"
import Image from "next/image"

import { getRegion } from "@lib/data/regions"
import { getProductTypesList } from "@lib/data/product-types"
import { Layout, LayoutColumn } from "@/components/Layout"
import { LocalizedLink } from "@/components/LocalizedLink"
import { CollectionsSection } from "@/components/CollectionsSection"

export const metadata: Metadata = {
  title: "Nexa. Your Fit, Everywhere.",
  description:
    "At NEXA, we solve the shopping issue of niche customer groups by providing a platform that offers a wide range of products that cater to their specific needs.",
}

const ProductTypesSection: React.FC = async () => {
  const productTypes = await getProductTypesList(0, 20, [
    "id",
    "value",
    "metadata",
  ])

  if (!productTypes) {
    return null
  }

  return (
    <Layout className="mb-26 md:mb-36 max-md:gap-x-2">
      <LayoutColumn>
        <h3 className="text-lg md:text-2xl mb-8 md:mb-15">Our products</h3>
      </LayoutColumn>
      {productTypes.productTypes.map((productType, index) => (
        <LayoutColumn
          key={productType.id}
          start={index % 2 === 0 ? 1 : 7}
          end={index % 2 === 0 ? 7 : 13}
        >
          <LocalizedLink href={`/store?type=${productType.value}`}>
            {typeof productType.metadata?.image === "object" &&
              productType.metadata.image &&
              "url" in productType.metadata.image &&
              typeof productType.metadata.image.url === "string" && (
                <Image
                  src={productType.metadata.image.url}
                  width={1200}
                  height={900}
                  alt={productType.value}
                  className="mb-2 md:mb-8"
                />
              )}
            <p className="text-xs md:text-md">{productType.value}</p>
          </LocalizedLink>
        </LayoutColumn>
      ))}
    </Layout>
  )
}

export default async function Home({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  return (
    <>
      <div className="relative max-md:pt-18">
        <Image
          src="/images/content/Hemd-Stockholm-3A.jpg"
          width={2880}
          height={1000}
          objectPosition="top"
          alt="Living room"
          className="md:h-[70vh] md:object-cover"
          priority={true}
        />
        <div className="absolute inset-0 bg-red-500 opacity-50 z-10"></div>
      </div>
      <div className="pt-8 pb-26 md:pt-26 md:pb-36">
        <Layout className="mb-26 md:mb-34">
          <LayoutColumn start={1} end={{ base: 13, md: 8 }}>
            <h3 className="text-2xl">
              We've got your wrists covered. 
              {/* Never worry about size again. */}
            </h3>
          </LayoutColumn>
          <LayoutColumn start={{ base: 1, md: 9 }} end={13}>
            <div className="flex items-center h-full">
              <div className="text-md">
                <p>Discover Your Perfect Fit Today</p>
                <LocalizedLink href="/store" variant="underline">
                  Explore Now
                </LocalizedLink>
              </div>
            </div>
          </LayoutColumn>
        </Layout>
        {/* <ProductTypesSection /> */}
        <CollectionsSection className="mb-26 md:mb-36" />
        <Layout>
          <LayoutColumn className="col-span-full">
            <h3 className="text-lg md:text-2xl mb-8 md:mb-15">
              About Nexa
            </h3>
            <Image
              src="/images/content/team.png"
              width={2496}
              height={1400}
              alt="Sofa"
              className="mb-8 md:mb-16 max-md:aspect-[3/2] max-md:object-cover"
            />
          </LayoutColumn>
          <LayoutColumn start={1} end={{ base: 13, md: 7 }}>
            <h2 className="text-lg md:text-2xl">
              At Nexa, we believe that everyone deserves clothes that fit perfectly.
            </h2>
          </LayoutColumn>
          <LayoutColumn
            start={{ base: 1, md: 8 }}
            end={13}
            className="mt-6 md:mt-19"
          >
            <div className="md:text-md">
              <p className="mb-5 md:mb-9">
                We are dedicated to solving the sizing issues of tall people by connecting them to niche fashion brands.
              </p>
              <p className="mb-5 md:mb-3">
                Our mission is to provide stylish and comfortable clothing options that cater to your unique needs.
              </p>
              <LocalizedLink href="/about" variant="underline">
                Read more about Nexa
              </LocalizedLink>
            </div>
          </LayoutColumn>
        </Layout>
      </div>
    </>
  )
}
