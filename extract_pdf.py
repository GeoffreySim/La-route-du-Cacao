import fitz

def extract_pdf_content():
    try:
        # Ouvrir le PDF
        doc = fitz.open('LRDC Presentation .pdf')
        print(f"Nombre de pages: {len(doc)}")
        print("=" * 50)
        
        # Extraire le contenu de chaque page
        for i in range(len(doc)):
            page = doc[i]
            text = page.get_text()
            if text.strip():  # Si la page contient du texte
                print(f"\n--- PAGE {i+1} ---")
                print(text)
                print("-" * 30)
        
        doc.close()
        
    except Exception as e:
        print(f"Erreur: {e}")

if __name__ == "__main__":
    extract_pdf_content() 