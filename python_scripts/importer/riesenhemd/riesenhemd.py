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


def convert_wc_to_import_template(
    wc_export_path, import_template_path, sizing_data_path
):
    with open(sizing_data_path, mode="r", encoding="utf-8") as sizing_file:
        sizing_data = json.load(sizing_file)

    with open(wc_export_path, mode="r", encoding="utf-8") as wc_file:
        wc_reader = csv.DictReader(wc_file, delimiter=";")
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
                # "Variant Metadata.",
            ]
            for key in sizing_data[next(iter(sizing_data))]["sizes"][0].keys():
                fieldnames.append(f"Variant Metadata.{key}")
            import_writer = csv.DictWriter(
                import_file, fieldnames=fieldnames, delimiter=";"
            )
            import_writer.writeheader()

            product_info = {}

            for row in wc_reader:
                if row["Typ"] == "variable":
                    title = "RH " + row["Name"].split(" - ")[0].replace("Hemd ", "")
                    product_info = {
                        "Product Id": "prod_" + row["ID"],
                        "Product Handle": make_url_safe(title),
                        "Product Title": title,
                        "Product Subtitle": "",
                        "Product Description": row["Kurzbeschreibung"].strip(),
                        "Product Status": (
                            "published" if row["Veröffentlicht"] == "1" else "draft"
                        ),
                        "Product Thumbnail": (
                            row["Bilder"].split(",")[0] if row["Bilder"] else ""
                        ),
                        "Product Weight": row["Gewicht (kg)"],
                        "Product Length": row["Länge (cm)"],
                        "Product Width": row["Breite (cm)"],
                        "Product Height": row["Höhe (cm)"],
                        "Product HS Code": "",
                        "Product Origin Country": "",
                        # "Product Sales Channel 1": "Riesenhemd",
                        "Product MID Code": "",
                        "Product Material": "",
                        "Product Collection Title": "",
                        "Product Collection Handle": "",
                        "Product Type": "Dress Shirts",
                        "Product Tags": "",  # row["Schlagwörter"],
                        "Product Discountable": "true",
                        "Product External Id": "",
                        "Product Profile Name": "",
                        "Product Profile Type": "",
                    }

                    for i, image in enumerate(row["Bilder"].split(",")):
                        product_info[f"Image {i+1} Url"] = image

                elif row["Typ"] == "variation":
                    fit = row["Attribut 1 Wert(e)"]
                    size = int(row["Attribut 2 Wert(e)"])
                    sizing_info = next(
                        (s for s in sizing_data[fit]["sizes"] if s["size"] == size), {}
                    )
                    variant_metadata = json.dumps(sizing_info)
                    variant = {
                        **product_info,
                        "Variant Id": "art_" + row["Artikelnummer"],
                        "Variant Title": row["Attribut 2 Wert(e)"],
                        "Variant SKU": row["Artikelnummer"],
                        "Variant Barcode": row["Artikelnummer"],
                        "Variant Inventory Quantity": (
                            0 if row["Vorrätig?"] == "0" else row["Lager"]
                        ),
                        "Variant Allow Backorder": (
                            "false" if row["Rückstände erlaubt?"] == "0" else "true"
                        ),
                        "Variant Manage Inventory": "false",
                        "Variant Weight": row["Gewicht (kg)"],
                        "Variant Length": row["Länge (cm)"],
                        "Variant Width": row["Breite (cm)"],
                        "Variant Height": row["Höhe (cm)"],
                        "Price EUR": row["Regulärer Preis"],
                        "Price USD": "",
                        "Option 1 Name": "Fit",
                        "Option 1 Value": row["Attribut 1 Wert(e)"],
                        "Option 2 Name": "Size",
                        "Option 2 Value": row["Attribut 2 Wert(e)"],
                        "Variant Metadata": variant_metadata,
                        # "Variant Metadata.test": sizing_info.get("test", ""),
                    }
                    for key in sizing_info.keys():
                        variant[f"Variant Metadata.{key}"] = sizing_info[key]
                    import_writer.writerow(variant)


# Example usage
convert_wc_to_import_template(
    "/Users/gero/dev/Nexa/nexa_old/python_scripts/importer/riesenhemd/wc-product-export-24-1-2025-1737709004303.csv",
    "/Users/gero/dev/Nexa/nexa_old/python_scripts/importer/riesenhemd/out/product-import-template.csv",
    "/Users/gero/dev/Nexa/nexa_old/python_scripts/importer/riesenhemd/sizing.json",
)
