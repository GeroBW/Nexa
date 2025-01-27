import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { cache } from "react"
import { getRegion } from "./regions"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { sortProducts } from "@lib/util/sort-products"
import { MetadataFilter, createDefaultMetadataFilter } from "types/metaDataFilter"

export const getProductsById = cache(async function ({
  ids,
  regionId,
}: {
  ids: string[]
  regionId: string
}) {
  return sdk.store.product
    .list(
      {
        id: ids,
        region_id: regionId,
        fields: "*variants.calculated_price,+variants.inventory_quantity",
      },
      { next: { tags: ["products"] } }
    )
    .then(({ products }) => products)
})

export const getProductByHandle = cache(async function (
  handle: string,
  regionId: string
) {
  return sdk.store.product
    .list(
      {
        handle,
        region_id: regionId,
        fields: "*variants.calculated_price,+variants.inventory_quantity",
      },
      { next: { tags: ["products"] } }
    )
    .then(({ products }) => products[0])
})

export const getProductFashionDataByHandle = cache(async function (
  handle: string
) {
  return sdk.client.fetch<{
    materials: {
      id: string
      name: string
      colors: {
        id: string
        name: string
        hex_code: string
      }[]
    }[]
  }>(`/store/custom/fashion/${handle}`, {
    method: "GET",
    headers: { next: { tags: ["products"] } },
  })
})

export const getProductsList = cache(async function ({
  pageParam = 1,
  queryParams,
  countryCode,
  metadataFilter,// = createDefaultMetadataFilter()
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
  countryCode: string
  metadataFilter?: MetadataFilter
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
}> {
  const page = Math.max(1, pageParam || 1)
  const limit = queryParams?.limit || 12
  const offset = (page - 1) * limit
  const region = await getRegion(countryCode)

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }
  return sdk.store.product
    .list(
      {
        limit,
        offset,
        region_id: region.id,
        fields: "*variants.calculated_price",
        ...queryParams,
      },
      { next: { tags: ["products"] } }
    )
    .then(({ products, count }) => {
      products = products.filter((product) => {
        product.variants = product.variants?.filter((variant) =>
          metadataFilter ? checkSizing(variant, metadataFilter) : true
        ) || [];
        return product.variants.length > 0;
      })
      count = products.length;
    
      const nextPage = count > offset + limit ? page + 1 : null

      return {
        response: {
          products,
          count,
        },
        nextPage: nextPage,
        queryParams,
      }
    })
})

/**
 * This will fetch 100 products to the Next.js cache and sort them based on the sortBy parameter.
 * It will then return the paginated products based on the page and limit parameters.
 */
export const getProductsListWithSort = cache(async function ({
  page = 0,
  queryParams,
  sortBy = "created_at",
  countryCode,
  metadataFilter
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  sortBy?: SortOptions
  countryCode: string,
  metadataFilter?: MetadataFilter
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> {
  const limit = queryParams?.limit || 12

  const {
    response: { products, count },
  } = await getProductsList({
    pageParam: 0,
    queryParams: {
      ...queryParams,
      limit: 100,
    },
    countryCode,
    metadataFilter,
  })

  const sortedProducts = sortProducts(products, sortBy)

  const pageParam = (page - 1) * limit

  const nextPage = count > pageParam + limit ? pageParam + limit : null

  const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit)

  return {
    response: {
      products: paginatedProducts,
      count,
    },
    nextPage,
    queryParams,
  }
})

function checkSizing(
  variant: HttpTypes.StoreProductVariant,
  metadataFilter: MetadataFilter
): boolean {
  const metadata = variant.metadata as MetadataFilter;
  // Check each parameter if it is provided
  // const sizeMatch = metadataFilter.size ? metadata.size === metadataFilter.size : true;
  const chestMatch = fits(metadata?.chest_cm, metadataFilter.chest_cm, 2);
  const waistMatch = fits(metadata?.front_length_cm, metadataFilter.front_length_cm, 2);
  const backLengthMatch = fits(metadata?.front_length_cm, metadataFilter.front_length_cm, 2);
  const frontLengthMatch = fits(metadata?.front_length_cm, metadataFilter.front_length_cm, 2);
  const sleeveLengthMatch = fits(metadata?.sleeve_length_cm, metadataFilter.sleeve_length_cm, 2);


  const sizeMatch = true;

  // Return true if all provided parameters match
  return sizeMatch && chestMatch && waistMatch && backLengthMatch && frontLengthMatch && sleeveLengthMatch;
}

/**
 * This function checks if the filterValue and metaDataValue are within the tolerance.
 * If the filterValue is provided, it will only return true if the metaDataValue exists and is within the tolerance.
 */
const fits = (filterValue: number | undefined, metaDataValue: number | undefined, tolerance: number): boolean => {
  return metaDataValue ? filterValue !== undefined && Math.abs(filterValue - metaDataValue) <= tolerance : true;
};