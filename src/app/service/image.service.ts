import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private imageCache: Map<string, string> = new Map();

  async getImageAsBase64(imageName: string): Promise<string> {
    // Check cache first
    const cached = this.imageCache.get(imageName);
    if (cached) {
      return cached;
    }

    const imagePath = `assets/images/${imageName}`;
    
    try {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const base64 = await new Promise<string>((resolve, reject) => {
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL('image/jpeg');
          resolve(dataURL);
        };
        img.onerror = () => reject(`Failed to load image: ${imagePath}`);
        img.src = imagePath;
      });

      // Cache the result
      this.imageCache.set(imageName, base64);
      return base64;
    } catch (error) {
      console.error('Error loading image:', error);
      throw error;
    }
  }
}