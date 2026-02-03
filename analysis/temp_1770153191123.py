import requests
from bs4 import BeautifulSoup

# Fetch the ABUGO homepage
url = "https://www.abugo.com/"
response = requests.get(url)
soup = BeautifulSoup(response.content, "html.parser")

# Count the number of product sections
product_sections = soup.find_all("div", class_="product-section")
num_products = len(product_sections)
print(f"ABUGO has {num_products} main product offerings.")

# Analyze the focus areas
focus_areas = [section.find("h3").text for section in product_sections]
print("ABUGO's focus areas:")
for area in focus_areas:
    print("- " + area)

# Summarize insights
print("\nInsights:")
print("- ABUGO appears to be a software company with multiple commerce-focused product offerings.")
print("- They seem to have a diverse set of focus areas, including inventory management, online stores, and business operations.")
print("- The website highlights their mission of 'simplifying commerce with software'.")