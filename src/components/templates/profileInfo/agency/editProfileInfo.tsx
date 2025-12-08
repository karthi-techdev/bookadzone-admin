import React, { useState } from 'react';
import type { AgencyProfile } from '../../../utils/fields/ProfileInfo';
import { FiX, FiSave, FiUser, FiMail, FiPhone, FiMapPin, FiGlobe, FiLinkedin, FiTwitter, FiInstagram, FiFacebook } from 'react-icons/fi';

interface EditProfileModalProps {
  profile: AgencyProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProfile: AgencyProfile) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ profile, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<AgencyProfile>(profile);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      socials: { ...prev.socials, [name]: value }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-[var(--dark-color)] border border-[var(--white-glass-color)] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-[fadeIn_0.3s_ease-out]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--white-glass-color)]">
          <h2 className="text-xl font-bold text-[var(--white-color)] tracking-tight">Edit Profile Details</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--white-glass-color)] text-[var(--light-grey-color)] hover:text-[var(--white-color)] transition-colors"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Scrollable Form */}
        <div className="overflow-y-auto custom-scrollbar p-6 space-y-8">
          <form id="edit-profile-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* Basic Info Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[var(--puprle-color)] uppercase tracking-wider mb-4 flex items-center gap-2">
                <div className="w-8 h-[1px] bg-[var(--puprle-color)]"></div> Basic Info
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[var(--light-grey-color)] ml-1">Agency Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-3 text-[var(--light-grey-color)]" />
                    <input
                      type="text"
                      name="agencyName"
                      value={formData.agencyName}
                      onChange={handleChange}
                      className="w-full bg-[color-mix(in_srgb,var(--white-color),transparent_97%)] border border-[var(--white-glass-color)] rounded-xl py-2.5 pl-10 pr-4 text-sm text-[var(--white-color)] focus:border-[color-mix(in_srgb,var(--puprle-color),transparent_50%)] focus:bg-[var(--white-glass-color)] outline-none transition-all placeholder:text-gray-600"
                      placeholder="Agency Name"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[var(--light-grey-color)] ml-1">Slogan</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="slogan"
                      value={formData.slogan}
                      onChange={handleChange}
                      className="w-full bg-[color-mix(in_srgb,var(--white-color),transparent_97%)] border border-[var(--white-glass-color)] rounded-xl py-2.5 px-4 text-sm text-[var(--white-color)] focus:border-[color-mix(in_srgb,var(--puprle-color),transparent_50%)] focus:bg-[var(--white-glass-color)] outline-none transition-all placeholder:text-gray-600"
                      placeholder="Catchy slogan"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--light-grey-color)] ml-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-[color-mix(in_srgb,var(--white-color),transparent_97%)] border border-[var(--white-glass-color)] rounded-xl py-3 px-4 text-sm text-[var(--white-color)] focus:border-[color-mix(in_srgb,var(--puprle-color),transparent_50%)] focus:bg-[var(--white-glass-color)] outline-none transition-all placeholder:text-gray-600 leading-relaxed custom-scrollbar resize-none"
                  placeholder="Tell us about your agency..."
                />
              </div>
            </div>

            {/* Contact Info Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[var(--puprle-color)] uppercase tracking-wider mb-4 flex items-center gap-2">
                <div className="w-8 h-[1px] bg-[var(--puprle-color)]"></div> Contact Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[var(--light-grey-color)] ml-1">Phone Number</label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-3 text-[var(--light-grey-color)]" />
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-[color-mix(in_srgb,var(--white-color),transparent_97%)] border border-[var(--white-glass-color)] rounded-xl py-2.5 pl-10 pr-4 text-sm text-[var(--white-color)] focus:border-[color-mix(in_srgb,var(--puprle-color),transparent_50%)] focus:bg-[var(--white-glass-color)] outline-none transition-all placeholder:text-gray-600"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[var(--light-grey-color)] ml-1">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-3 text-[var(--light-grey-color)]" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-[color-mix(in_srgb,var(--white-color),transparent_97%)] border border-[var(--white-glass-color)] rounded-xl py-2.5 pl-10 pr-4 text-sm text-[var(--white-color)] focus:border-[color-mix(in_srgb,var(--puprle-color),transparent_50%)] focus:bg-[var(--white-glass-color)] outline-none transition-all placeholder:text-gray-600"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--light-grey-color)] ml-1">Website URL</label>
                <div className="relative">
                  <FiGlobe className="absolute left-3 top-3 text-[var(--light-grey-color)]" />
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full bg-[color-mix(in_srgb,var(--white-color),transparent_97%)] border border-[var(--white-glass-color)] rounded-xl py-2.5 pl-10 pr-4 text-sm text-[var(--white-color)] focus:border-[color-mix(in_srgb,var(--puprle-color),transparent_50%)] focus:bg-[var(--white-glass-color)] outline-none transition-all placeholder:text-gray-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--light-grey-color)] ml-1">Physical Address</label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-3 text-[var(--light-grey-color)]" />
                  <input
                    type="text"
                    name="physicalAddress"
                    value={formData.physicalAddress}
                    onChange={handleChange}
                    className="w-full bg-[color-mix(in_srgb,var(--white-color),transparent_97%)] border border-[var(--white-glass-color)] rounded-xl py-2.5 pl-10 pr-4 text-sm text-[var(--white-color)] focus:border-[color-mix(in_srgb,var(--puprle-color),transparent_50%)] focus:bg-[var(--white-glass-color)] outline-none transition-all placeholder:text-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Social Links Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[var(--puprle-color)] uppercase tracking-wider mb-4 flex items-center gap-2">
                <div className="w-8 h-[1px] bg-[var(--puprle-color)]"></div> Social Media
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <FiLinkedin className="absolute left-3 top-3 text-blue-500" />
                  <input
                    type="text"
                    name="linkedin"
                    value={formData.socials.linkedin || ''}
                    onChange={handleSocialChange}
                    className="w-full bg-[color-mix(in_srgb,var(--white-color),transparent_97%)] border border-[var(--white-glass-color)] rounded-xl py-2.5 pl-10 pr-4 text-sm text-[var(--white-color)] focus:border-[color-mix(in_srgb,var(--puprle-color),transparent_50%)] focus:bg-[var(--white-glass-color)] outline-none transition-all placeholder:text-gray-600"
                    placeholder="LinkedIn URL"
                  />
                </div>
                <div className="relative">
                  <FiTwitter className="absolute left-3 top-3 text-sky-400" />
                  <input
                    type="text"
                    name="twitter"
                    value={formData.socials.twitter || ''}
                    onChange={handleSocialChange}
                    className="w-full bg-[color-mix(in_srgb,var(--white-color),transparent_97%)] border border-[var(--white-glass-color)] rounded-xl py-2.5 pl-10 pr-4 text-sm text-[var(--white-color)] focus:border-[color-mix(in_srgb,var(--puprle-color),transparent_50%)] focus:bg-[var(--white-glass-color)] outline-none transition-all placeholder:text-gray-600"
                    placeholder="Twitter URL"
                  />
                </div>
                <div className="relative">
                  <FiInstagram className="absolute left-3 top-3 text-pink-500" />
                  <input
                    type="text"
                    name="instagram"
                    value={formData.socials.instagram || ''}
                    onChange={handleSocialChange}
                    className="w-full bg-[color-mix(in_srgb,var(--white-color),transparent_97%)] border border-[var(--white-glass-color)] rounded-xl py-2.5 pl-10 pr-4 text-sm text-[var(--white-color)] focus:border-[color-mix(in_srgb,var(--puprle-color),transparent_50%)] focus:bg-[var(--white-glass-color)] outline-none transition-all placeholder:text-gray-600"
                    placeholder="Instagram URL"
                  />
                </div>
                <div className="relative">
                  <FiFacebook className="absolute left-3 top-3 text-blue-600" />
                  <input
                    type="text"
                    name="facebook"
                    value={formData.socials.facebook || ''}
                    onChange={handleSocialChange}
                    className="w-full bg-[color-mix(in_srgb,var(--white-color),transparent_97%)] border border-[var(--white-glass-color)] rounded-xl py-2.5 pl-10 pr-4 text-sm text-[var(--white-color)] focus:border-[color-mix(in_srgb,var(--puprle-color),transparent_50%)] focus:bg-[var(--white-glass-color)] outline-none transition-all placeholder:text-gray-600"
                    placeholder="Facebook URL"
                  />
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[var(--white-glass-color)] flex justify-end gap-3 bg-[color-mix(in_srgb,var(--light-dark-color),transparent_50%)] backdrop-blur-xl rounded-b-2xl">
          <button 
            type="button" 
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-[var(--white-glass-color)] text-[var(--light-grey-color)] text-sm font-medium hover:bg-[var(--white-glass-color)] hover:text-[var(--white-color)] transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="edit-profile-form"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[var(--puprle-color)] to-[var(--light-puprle-color)] text-[var(--white-color)] text-sm font-bold shadow-lg shadow-[rgba(127,106,247,0.25)] hover:shadow-[rgba(127,106,247,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <FiSave className="text-lg" />
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditProfileModal;