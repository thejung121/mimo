
import React, { memo } from 'react';
import { Creator, MimoPackage, MediaItem } from '@/types/creator';
import CoverImageSection from './editor/CoverImageSection';
import AvatarSection from './editor/AvatarSection';
import BasicInfoSection from './editor/BasicInfoSection';
import SocialLinksSection from './editor/SocialLinksSection';
import PackagesSection from './editor/PackagesSection';

interface UnifiedEditorSectionProps {
  creator: Creator;
  mimoPackages: MimoPackage[];
  coverPreview: string;
  avatarPreview: string;
  showNewPackageForm: boolean;
  newPackage: MimoPackage;
  onCreatorChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSocialLinkChange: (index: number, field: string, value: string) => void;
  onCoverChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddFeature: () => void;
  onFeatureChange: (index: number, value: string) => void;
  onRemoveFeature: (index: number) => void;
  onPackageChange: (field: string, value: any) => void;
  onAddMedia: (packageId: number | null, media: MediaItem) => void;
  onRemoveMedia: (packageId: number | null, mediaId: number) => void;
  onTogglePreview: (packageId: number | null, mediaId: number) => void;
  onSavePackage: () => void;
  onDeletePackage: (id: number) => void;
  onEditPackage: (id: number) => void;
  setShowNewPackageForm: React.Dispatch<React.SetStateAction<boolean>>;
}

// Using React.memo to prevent unnecessary re-renders
const UnifiedEditorSection = memo(({
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
  setShowNewPackageForm,
}: UnifiedEditorSectionProps) => {

  return (
    <div className="space-y-8">
      {/* Cover Image Section */}
      <CoverImageSection
        coverPreview={coverPreview}
        onCoverChange={onCoverChange}
      />
      
      {/* Avatar Section */}
      <AvatarSection
        avatarPreview={avatarPreview}
        onAvatarChange={onAvatarChange}
      />

      {/* Profile Information Section */}
      <BasicInfoSection
        creator={creator}
        onCreatorChange={onCreatorChange}
      />
      
      {/* Social Links Section */}
      <SocialLinksSection
        socialLinks={creator.socialLinks}
        onSocialLinkChange={onSocialLinkChange}
      />
      
      {/* Mimo Packages Section */}
      <PackagesSection
        mimoPackages={mimoPackages}
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
    </div>
  );
});

// Use displayName for better debugging
UnifiedEditorSection.displayName = 'UnifiedEditorSection';

export default UnifiedEditorSection;
