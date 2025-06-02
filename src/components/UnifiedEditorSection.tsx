
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Creator, MimoPackage, MediaItem } from '@/types/creator';
import BasicInfoSection from './editor/BasicInfoSection';
import CoverImageSection from './editor/CoverImageSection';
import AvatarSection from './editor/AvatarSection';
import SocialLinksSection from './editor/SocialLinksSection';
import PackagesSection from './editor/PackagesSection';

interface UnifiedEditorSectionProps {
  creator: Creator;
  mimoPackages: MimoPackage[];
  coverPreview: string | null;
  avatarPreview: string | null;
  showNewPackageForm: boolean;
  newPackage: MimoPackage;
  onCreatorChange: (field: string, value: string) => void;
  onSocialLinkChange: (index: number, field: 'type' | 'url', value: string) => void;
  onCoverChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddFeature: () => void;
  onFeatureChange: (index: number, value: string) => void;
  onRemoveFeature: (index: number) => void;
  onPackageChange: (field: string, value: any) => void;
  onAddMedia: (packageId: number | string | null, media: MediaItem) => void;
  onRemoveMedia: (packageId: number | string | null, mediaId: number | string) => void;
  onTogglePreview: (packageId: number | string | null, mediaId: number | string) => void;
  onSavePackage: () => void;
  onDeletePackage: (id: number | string) => void;
  onEditPackage: (id: number | string) => void;
  setShowNewPackageForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const UnifiedEditorSection = (props: UnifiedEditorSectionProps) => {
  const {
    creator,
    mimoPackages,
    coverPreview,
    avatarPreview,
    showNewPackageForm,
    newPackage,
    onCreatorChange,
    onSocialLinkChange,
    onCoverChange,
    onAvatarChange,
    onAddFeature,
    onFeatureChange,
    onRemoveFeature,
    onPackageChange,
    onAddMedia,
    onRemoveMedia,
    onTogglePreview,
    onSavePackage,
    onDeletePackage,
    onEditPackage,
    setShowNewPackageForm
  } = props;

  console.log('UnifiedEditorSection - mimoPackages:', mimoPackages);

  return (
    <div className="space-y-6 w-full">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="packages">
            Recompensas ({mimoPackages?.length || 0})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6 mt-6">
          <BasicInfoSection 
            creator={creator}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
              onCreatorChange(e.target.name, e.target.value)
            }
          />
          
          <CoverImageSection 
            coverPreview={coverPreview || creator.cover}
            onCoverChange={onCoverChange}
          />
          
          <AvatarSection 
            avatarPreview={avatarPreview || creator.avatar}
            onAvatarChange={onAvatarChange}
          />
          
          <SocialLinksSection 
            socialLinks={creator.socialLinks || []}
            onChange={onSocialLinkChange}
          />
        </TabsContent>
        
        <TabsContent value="packages" className="mt-6">
          <PackagesSection
            mimoPackages={mimoPackages || []}
            showNewPackageForm={showNewPackageForm}
            newPackage={newPackage}
            onPackageChange={onPackageChange}
            onFeatureChange={onFeatureChange}
            onAddFeature={onAddFeature}
            onRemoveFeature={onRemoveFeature}
            onAddMedia={onAddMedia}
            onRemoveMedia={onRemoveMedia}
            onTogglePreview={onTogglePreview}
            onSavePackage={onSavePackage}
            onDeletePackage={onDeletePackage}
            onEditPackage={onEditPackage}
            setShowNewPackageForm={setShowNewPackageForm}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnifiedEditorSection;
