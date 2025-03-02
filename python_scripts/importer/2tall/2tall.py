import csv
import os
import unicodedata
import json


def make_url_safe(name):
    name = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode("ascii")
    handle = (
        "".join(c if c.isalnum() or c == "-" else "-" for c in name).lower().strip("-")
    )
    while "--" in handle:
        handle = handle.replace("--", "-")
    return handle


def convert_json_to_import_template(json_path, import_template_path, sizing_data_path):
    with open(sizing_data_path, mode="r", encoding="utf-8") as sizing_file:
        sizing_data = json.load(sizing_file)

    with open(json_path, mode="r", encoding="utf-8") as json_file:
        data = json.load(json_file)
        products = data.get("products", [])

        os.makedirs(os.path.dirname(import_template_path), exist_ok=True)
        with open(
            import_template_path, mode="w", encoding="utf-8", newline=""
        ) as import_file:
            fieldnames = [
                "Product Id",
                "Product Handle",
                "Product Title",
                "Product Subtitle",
                "Product Description",
                "Product Status",
                "Product Thumbnail",
                "Product Weight",
                "Product Length",
                "Product Width",
                "Product Height",
                "Product HS Code",
                "Product Origin Country",
                "Product MID Code",
                "Product Material",
                "Product Collection Title",
                "Product Collection Handle",
                "Product Type",
                "Product Tags",
                "Product Discountable",
                "Product External Id",
                "Product Profile Name",
                "Product Profile Type",
                "Variant Id",
                "Variant Title",
                "Variant SKU",
                "Variant Barcode",
                "Variant Inventory Quantity",
                "Variant Allow Backorder",
                "Variant Manage Inventory",
                "Variant Weight",
                "Variant Length",
                "Variant Width",
                "Variant Height",
                "Variant HS Code",
                "Variant Origin Country",
                "Variant MID Code",
                "Variant Material",
                "Price EUR",
                "Price USD",
                "Option 1 Name",
                "Option 1 Value",
                "Option 2 Name",
                "Option 2 Value",
                "Image 1 Url",
                "Image 2 Url",
                "Image 3 Url",
                "Image 4 Url",
                "Image 5 Url",
                "Image 6 Url",
                "Image 7 Url",
                "Variant Metadata",
            ]
            for key in sizing_data[next(iter(sizing_data))].keys():
                fieldnames.append(f"Variant Metadata.{key}")
            import_writer = csv.DictWriter(
                import_file, fieldnames=fieldnames, delimiter=";"
            )
            import_writer.writeheader()

            for product in products:
                product_info = {
                    "Product Id": "prod_" + str(product.get("id")),
                    "Product Handle": make_url_safe(product.get("title", "")),
                    "Product Title": product.get("title", ""),
                    "Product Subtitle": product.get("subtitle", ""),
                    "Product Description": "<div>"+ (product.get("body_html") or "").strip() + "</div>",
                    "Product Status": "published",
                    "Product Thumbnail": product.get("thumbnail", ""),
                    "Product Weight": product.get("weight", ""),
                    "Product Length": product.get("length", ""),
                    "Product Width": product.get("width", ""),
                    "Product Height": product.get("height", ""),
                    "Product HS Code": product.get("hs_code", ""),
                    "Product Origin Country": product.get("origin_country", ""),
                    "Product MID Code": product.get("mid_code", ""),
                    "Product Material": product.get("material", ""),
                    "Product Collection Title": product.get("collection_title", ""),
                    "Product Collection Handle": product.get("collection_handle", ""),
                    "Product Type": product.get("product_type", "Tops"),
                    "Product Tags": "",  # product.get("tags", ""),
                    "Product Discountable": product.get("discountable", "true"),
                    "Product External Id": product.get("external_id", ""),
                    "Product Profile Name": product.get("profile_name", ""),
                    "Product Profile Type": product.get("profile_type", ""),
                }

                for i, image in enumerate(product.get("images", [])):
                    product_info[f"Image {i + 1} Url"] = image.get("src", "")

                for variant in product.get("variants", []):
                    size = variant.get("option1", "")
                    sizing_info = sizing_data.get(size, {})
                    variant_metadata = json.dumps(sizing_info)
                    variant_data = {
                        **product_info,
                        "Variant Id": variant.get("id", ""),
                        "Variant Title": variant.get("title", ""),
                        "Variant SKU": variant.get("sku", ""),
                        "Variant Barcode": variant.get("barcode", ""),
                        "Variant Inventory Quantity": variant.get(
                            "inventory_quantity", 0
                        ),
                        "Variant Allow Backorder": variant.get(
                            "allow_backorder", "false"
                        ),
                        "Variant Manage Inventory": variant.get(
                            "manage_inventory", "false"
                        ),
                        "Variant Weight": variant.get("weight", ""),
                        "Variant Length": variant.get("length", ""),
                        "Variant Width": variant.get("width", ""),
                        "Variant Height": variant.get("height", ""),
                        "Price EUR": variant.get("price", ""),
                        "Price USD": "",
                        "Option 1 Name": "Fit",
                        "Option 1 Value": size,
                        "Variant Metadata": variant_metadata,
                    }
                    for key in sizing_info.keys():
                        variant_data[f"Variant Metadata.{key}"] = sizing_info[key]
                    import_writer.writerow(variant_data)


def subtract_csv(file1_path, file2_path, output_path):
    with open(file1_path, mode="r", encoding="utf-8") as file1, open(file2_path, mode="r", encoding="utf-8") as file2:
        reader1 = csv.DictReader(file1, delimiter=";")
        reader2 = csv.DictReader(file2, delimiter=";")
        
        rows1 = {row["Product Id"]: row for row in reader1}
        rows2 = {row["Product Id"]: row for row in reader2}
        
        difference = {key: rows2[key] for key in rows2 if key not in rows1}
        
        fieldnames = reader1.fieldnames
        with open(output_path, mode="w", encoding="utf-8", newline="") as output_file:
            writer = csv.DictWriter(output_file, fieldnames=fieldnames, delimiter=";")
            writer.writeheader()
            for row in difference.values():
                writer.writerow(row)


# Example usage
convert_json_to_import_template(
    "/Users/gero/dev/Nexa/nexa_old/python_scripts/importer/2tall/products.json",
    "/Users/gero/dev/Nexa/nexa_old/python_scripts/importer/2tall/out/2tall_products1.csv",
    "/Users/gero/dev/Nexa/nexa_old/python_scripts/importer/2tall/sizing.json",
)

convert_json_to_import_template(
    "/Users/gero/dev/Nexa/nexa_old/python_scripts/importer/2tall/products.json",
    "/Users/gero/dev/Nexa/nexa_old/python_scripts/importer/2tall/out/2tall_products2.csv",
    "/Users/gero/dev/Nexa/nexa_old/python_scripts/importer/2tall/sizing.json",
)

subtract_csv(
    "/Users/gero/dev/Nexa/nexa_old/python_scripts/importer/2tall/out/2tall_products1.csv",
    "/Users/gero/dev/Nexa/nexa_old/python_scripts/importer/2tall/out/2tall_products2.csv",
    "/Users/gero/dev/Nexa/nexa_old/python_scripts/importer/2tall/out/2tall_products_difference.csv"
)
