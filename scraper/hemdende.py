from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

import pandas as pd

# Configure Chrome options
options = Options()
# options.add_argument('--headless')  # Run in headless mode (no GUI)
options.add_argument('--disable-gpu')
options.add_argument('--no-sandbox')
options.add_argument('--window-size=1920,1080')

# Set up the driver
from seleniumbase import Driver
driver= Driver(uc=True, headless=False)
url = 'https://www.hemden.de/herrenhemd/olymp/slim-line/bleu/new-kent/kurzarm-12cm/einfarbig/03041211#96969a4f806a8af9d5b12363f06f9329'


class ProductInfo:
    def __init__(self, product_name, product_price, product_image, sizing_table):
        self.product_name = product_name
        self.product_price = product_price
        self.product_image = product_image
        self.sizing_table = sizing_table

    def __str__(self):
        return f'Product Name: {self.product_name}, Product Price: {self.product_price}, Product Image: {self.product_image}, Sizing Table: {self.sizing_table}'
    

def scrapeProductPage(url, driver) -> ProductInfo:
        
    # Load the HTML file
    driver.get(url)


    try:
        # Extract product name
        product_name = driver.find_element(By.CSS_SELECTOR, 'meta[property="og:title"]').get_attribute('content')

        # Extract product price
        product_price = driver.find_element(By.CSS_SELECTOR, 'meta[property="product:price"]').get_attribute('content')

        # Extract product image
        product_image = driver.find_element(By.CSS_SELECTOR, 'meta[property="og:image"]').get_attribute('content')

        # Extract sizing table (if available)
        try:
            table_element = driver.find_element(By.ID, 'product-measures')
            table_html = table_element.get_attribute('outerHTML')  # You can parse this further if needed
        except Exception as e:
            table_html = None  # Handle the case where no table is found

        # Print extracted information
        print("Product Name:", product_name)
        print("Product Price:", product_price)
        print("Product Image:", product_image)
        print("Sizing Table HTML:", table_html)

        return ProductInfo(product_name, product_price, product_image, table_html)
    
    finally:
        # Close the browser
        driver.quit()

product = scrapeProductPage(url, driver)
pd.read_html(product.sizing_table)
f = open("hemdende.txt", "w")
f.write(str(product))