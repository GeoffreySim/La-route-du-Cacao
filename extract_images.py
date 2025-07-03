import fitz
import os

def extract_images_from_pdf():
    try:
        # Créer le dossier images s'il n'existe pas
        if not os.path.exists('images'):
            os.makedirs('images')
        
        # Ouvrir le PDF
        doc = fitz.open('LRDC Presentation .pdf')
        print(f"Extraction des images du PDF ({len(doc)} pages)...")
        
        image_count = 0
        
        # Parcourir chaque page
        for page_num in range(len(doc)):
            page = doc[page_num]
            
            # Extraire les images de la page
            image_list = page.get_images()
            
            for img_index, img in enumerate(image_list):
                try:
                    # Obtenir l'image
                    xref = img[0]
                    pix = fitz.Pixmap(doc, xref)
                    
                    # Sauvegarder l'image
                    if pix.n - pix.alpha < 4:  # GRAY or RGB
                        img_filename = f"images/page_{page_num + 1}_img_{img_index + 1}.png"
                        pix.save(img_filename)
                        print(f"Image sauvegardée : {img_filename}")
                        image_count += 1
                    else:  # CMYK: convert to RGB first
                        pix1 = fitz.Pixmap(fitz.csRGB, pix)
                        img_filename = f"images/page_{page_num + 1}_img_{img_index + 1}.png"
                        pix1.save(img_filename)
                        print(f"Image sauvegardée (CMYK→RGB) : {img_filename}")
                        image_count += 1
                        pix1 = None
                    
                    pix = None
                    
                except Exception as e:
                    print(f"Erreur lors de l'extraction de l'image {img_index} de la page {page_num + 1}: {e}")
                    continue
        
        doc.close()
        print(f"\nExtraction terminée ! {image_count} images extraites dans le dossier 'images/'")
        
        # Lister les images extraites
        if os.path.exists('images'):
            images = os.listdir('images')
            print(f"\nImages disponibles :")
            for img in images:
                print(f"  - {img}")
        
    except Exception as e:
        print(f"Erreur générale : {e}")

if __name__ == "__main__":
    extract_images_from_pdf() 