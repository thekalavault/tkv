from PIL import Image

def remove_white_background(input_path, output_path, ico_output_path):
    img = Image.open(input_path).convert("RGBA")
    data = img.get_flattened_data() if hasattr(img, 'get_flattened_data') else img.getdata()
    
    new_data = []
    for item in data:
        # Check if the pixel is near white
        if item[0] > 230 and item[1] > 230 and item[2] > 230:
            # Replace white with transparent
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    
    # Crop to the bounding box of the non-transparent pixels to make the logo as large as possible
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    img.save(output_path, "PNG")
    
    # Save as ICO for good measure, resizing to common icon sizes
    img.save(ico_output_path, format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
    print(f"Successfully processed {input_path}")

if __name__ == "__main__":
    remove_white_background("public/favicon.png", "public/favicon.png", "public/favicon.ico")
