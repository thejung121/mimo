
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface CoverImageSectionProps {
  coverPreview: string;
  onCoverChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CoverImageSection = ({ coverPreview, onCoverChange }: CoverImageSectionProps) => {
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: '%', // Use percentage instead of pixels
    width: 100,
    height: 33, // Banner aspect ratio
    x: 0,
    y: 0
  });
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setShowCropDialog(true);
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const onImageLoaded = (img: HTMLImageElement) => {
    setImageRef(img);
    return false; // Return false to prevent completion right away
  };
  
  const onCropComplete = (crop: Crop) => {
    // Crop is complete, you can use the crop data
    console.log('Crop complete:', crop);
  };
  
  const getCroppedImg = (
    image: HTMLImageElement,
    crop: Crop,
    fileName: string
  ): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width as number;
    canvas.height = crop.height as number;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('No 2d context');
    }

    ctx.drawImage(
      image,
      (crop.x as number) * scaleX,
      (crop.y as number) * scaleY,
      (crop.width as number) * scaleX,
      (crop.height as number) * scaleY,
      0,
      0,
      crop.width as number,
      crop.height as number
    );

    // As a blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas is empty'));
            return;
          }
          (blob as any).name = fileName;
          resolve(blob);
        },
        'image/jpeg',
        1
      );
    });
  };
  
  const applyCrop = async () => {
    if (!imageRef || !crop.width || !crop.height) {
      return;
    }
    
    try {
      const croppedImageBlob = await getCroppedImg(imageRef, crop, 'cover.jpg');
      const croppedImageUrl = URL.createObjectURL(croppedImageBlob);
      
      // Create a new file from the blob
      const croppedFile = new File([croppedImageBlob], 'cropped-cover.jpg', { 
        type: 'image/jpeg' 
      });
      
      // Create a synthetic event to pass to the onCoverChange handler
      const syntheticEvent = {
        target: {
          files: {
            0: croppedFile,
            length: 1,
            item: (index: number) => index === 0 ? croppedFile : null
          }
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      // Call the original handler with our synthetic event
      onCoverChange(syntheticEvent);
      setShowCropDialog(false);
    } catch (e) {
      console.error('Error applying crop:', e);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Imagem de Capa</CardTitle>
          <CardDescription>A imagem principal da sua página.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <img 
              src={coverPreview} 
              alt="Capa" 
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
              <label className="cursor-pointer bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-md hover:bg-white/30 transition-colors">
                Alterar Imagem
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Crop Dialog */}
      <Dialog open={showCropDialog} onOpenChange={setShowCropDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Recorte a imagem de capa</DialogTitle>
          </DialogHeader>
          
          <div className="my-4">
            {imageSrc && (
              <ReactCrop 
                crop={crop} 
                onChange={c => setCrop(c)}
                onComplete={onCropComplete}
                aspect={3} // 3:1 aspect ratio for banner
                className="max-h-[500px] overflow-y-auto"
              >
                <img 
                  src={imageSrc} 
                  alt="Imagem a ser recortada"
                  onLoad={e => onImageLoaded(e.currentTarget)} 
                />
              </ReactCrop>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCropDialog(false)}
            >
              Cancelar
            </Button>
            <Button 
              className="mimo-button"
              onClick={applyCrop}
            >
              Aplicar Recorte
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CoverImageSection;
