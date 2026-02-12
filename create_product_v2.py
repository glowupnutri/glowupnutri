import requests
import json
import sys

# Configuration
ADMIN_EMAIL = "admin@glowupnutrition.pl"
ADMIN_PASSWORD = "admin123"
BACKEND_URL = "http://localhost:9000"

def get_token():
    try:
        response = requests.post(
            f"{BACKEND_URL}/auth/user/emailpass",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
            headers={"Content-Type": "application/json"}
        )
        response.raise_for_status()
        return response.json()["token"]
    except Exception as e:
        print(f"Error getting token: {e}")
        sys.exit(1)

def get_sales_channel_id(token):
    try:
        response = requests.get(
            f"{BACKEND_URL}/admin/sales-channels",
            headers={"Authorization": f"Bearer {token}"}
        )
        response.raise_for_status()
        channels = response.json().get("sales_channels", [])
        if not channels:
            print("No sales channels found!")
            sys.exit(1)
        return channels[0]["id"]
    except Exception as e:
        print(f"Error getting sales channel: {e}")
        sys.exit(1)

def create_product(token, sales_channel_id):
    product_data = {
        "title": "GlowUp Whey Protein - Czekolada",
        "handle": "glowup-whey-protein-chocolate",
        "description": "Wysokobiałkowa odżywka serwatkowa o smaku czekoladowym. 25g białka na porcję. Idealna dla osób aktywnych fizycznie, wspierająca regenerację mięśni i budowę masy mięśniowej.",
        "subtitle": "Odżywka białkowa premium - 900g",
        "status": "published",
        "is_giftcard": False,
        "discountable": True,
        "weight": 900,
        "material": "WPC 80%",
        "options": [
            {
                "title": "Smak",
                "values": ["Czekolada"]
            }
        ],
        "variants": [
            {
                "title": "Czekolada - 900g",
                "sku": "GLOWUP-WHEY-CHOC-900",
                "barcode": "5901234567890",
                "manage_inventory": True,
                "options": {
                    "Smak": "Czekolada"
                },
                "prices": [
                    {
                        "amount": 12900, # 129.00 PLN
                        "currency_code": "pln"
                    }
                ]
            }
        ],
        "sales_channels": [
            {"id": sales_channel_id}
        ]
    }

    try:
        # Check if exists first (optional, but good practice)
        # response = requests.get(f"{BACKEND_URL}/admin/products?handle=glowup-whey-protein-chocolate", headers={"Authorization": f"Bearer {token}"})
        
        print("Creating product...")
        response = requests.post(
            f"{BACKEND_URL}/admin/products",
            json=product_data,
            headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
        )
        response.raise_for_status()
        product = response.json()["product"]
        print(f"✅ Product created: {product['title']} (ID: {product['id']})")
        print(f"✅ Price: {product['variants'][0]['prices'][0]['amount']/100} {product['variants'][0]['prices'][0]['currency_code'].upper()}")
        
        # Set inventory (v2 style - needs inventory item + level)
        # The admin/products endpoint above creates the product and variant, 
        # but inventory items need separate handling in v2 unless `manage_inventory` triggers it automatically?
        # In Medusa v2, we often need to link inventory item separately if not implicit.
        # But let's check if checking 'manage_inventory' created an inventory item.
        
        variant_id = product['variants'][0]['id']
        
        # We need to find the inventory item for this variant
        # Actually, let's just ensure it's stocked. But for now, getting the product created with price is key.
        
    except Exception as e:
        print(f"Error creating product: {e}")
        try:
            print(response.text)
        except:
            pass
        sys.exit(1)

def main():
    token = get_token()
    sc_id = get_sales_channel_id(token)
    create_product(token, sc_id)

if __name__ == "__main__":
    main()
