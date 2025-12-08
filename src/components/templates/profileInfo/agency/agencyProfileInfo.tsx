import React, { useState, useEffect, useRef } from 'react';
import { 
  MdEdit, 
  MdSave, 
  MdCancel, 
  MdVerified, 
  MdBusiness, 
  MdPhone, 
  MdEmail, 
  MdLocationOn, 
  MdLanguage, 
  MdCheckCircle, 
  MdWarning, 
  MdError, 
  MdUploadFile, 
  MdDescription,
  MdDateRange,
  MdNumbers
} from 'react-icons/md';
import { 
  FaFacebook, 
  FaInstagram, 
  FaLinkedin, 
  FaTwitter 
} from 'react-icons/fa';
import { useAgencyProfileStore } from '../../../stores/AcencyProfileStore'
// --- Types & Interfaces ---
interface AgencyProfile {
  agencyName: string;
  slogan: string;
  about: string;
  gstin: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  joinedDate: string;
  facebookUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
}

interface DocumentData {
  status: 'uploaded' | 'missing' | 'pending';
  fileName?: string;
}

interface AgencyDocuments {
  logo: string | null;
  businessLicense: DocumentData;
  identityProof: DocumentData;
  agreement: DocumentData;
}

interface FormErrors {
  [key: string]: string;
}

// --- Initial Mock Data ---
const initialProfile: AgencyProfile = {
  agencyName: "Creative Ads Inc.",
  slogan: "Strategic Advertising for the Modern Era",
  about: "Creative Ads Inc. is a premier advertising agency focused on delivering high-impact marketing campaigns for global brands. We specialize in digital transformation, brand identity, and customer engagement strategies that drive measurable results.",
  gstin: "22AAAAA0000A1Z5",
  phone: "+1 (555) 012-3456",
  email: "contact@creativeads.com",
  address: "123 Market Street, Suite 400, San Francisco, CA 94103",
  website: "https://www.creativeads.com",
  joinedDate: "Jan 15, 2020",
  facebookUrl: "https://facebook.com/creativeads",
  instagramUrl: "https://instagram.com/creativeads",
  linkedinUrl: "https://linkedin.com/company/creativeads",
  twitterUrl: "@creativeads"
};

const initialDocs: AgencyDocuments = {
  logo: null,
  businessLicense: { status: 'uploaded', fileName: 'license_2024.pdf' },
  identityProof: { status: 'missing' },
  agreement: { status: 'uploaded', fileName: 'signed_agreement_v2.pdf' }
};

// --- Component ---
const AgencyProfilePage: React.FC = () => {
  // --- State ---
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<AgencyProfile>(initialProfile);
  const [documents, setDocuments] = useState<AgencyDocuments>(initialDocs);
  const [errors, setErrors] = useState<FormErrors>({});
  const { updateAgencyProfile, uploadDocument, loading } = useAgencyProfileStore();
  // Computed State
  const [completion, setCompletion] = useState(0);
  const [kycStatus, setKycStatus] = useState<'Approved' | 'Pending' | 'Rejected'>('Pending');

  // File Refs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const licenseInputRef = useRef<HTMLInputElement>(null);
  const identityInputRef = useRef<HTMLInputElement>(null);
  const agreementInputRef = useRef<HTMLInputElement>(null);

  // --- Logic ---
  useEffect(() => {
    calculateCompletion();
    determineKycStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, documents]);

  const calculateCompletion = () => {
    const fields: (keyof AgencyProfile)[] = ['agencyName', 'slogan', 'about', 'gstin', 'phone', 'email', 'address', 'website'];
    let filled = fields.filter(k => profile[k].trim().length > 0).length;
    
    if (documents.logo) filled++;
    if (documents.businessLicense.status === 'uploaded') filled++;
    if (documents.identityProof.status === 'uploaded') filled++;
    if (documents.agreement.status === 'uploaded') filled++;

    const total = fields.length + 4;
    setCompletion(Math.round((filled / total) * 100));
  };

  const determineKycStatus = () => {
    const { businessLicense, identityProof, agreement } = documents;
    const allUploaded = businessLicense.status === 'uploaded' && identityProof.status === 'uploaded' && agreement.status === 'uploaded';
    const anyUploaded = businessLicense.status === 'uploaded' || identityProof.status === 'uploaded' || agreement.status === 'uploaded';

    if (allUploaded) setKycStatus('Approved');
    else if (anyUploaded) setKycStatus('Pending');
    else setKycStatus('Rejected');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, docType: keyof AgencyDocuments) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (docType === 'logo') {
      const url = URL.createObjectURL(file);
      setDocuments(prev => ({ ...prev, logo: url }));
    } else {
      setDocuments(prev => ({
        ...prev,
        [docType]: { status: 'uploaded', fileName: file.name }
      }));
    }
  };

  const handleSave = async () => {
  const newErrors: FormErrors = {};
  if (!profile.agencyName.trim()) newErrors.agencyName = "Required";
  if (!profile.email.trim()) newErrors.email = "Required";
  if (!profile.phone.trim()) newErrors.phone = "Required";
  if (!profile.gstin.trim()) newErrors.gstin = "Required";
  if (!profile.address.trim()) newErrors.address = "Required";
  if (!profile.website.trim()) newErrors.website = "Required";

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  try {
    // Step 1: Upload logo if changed
    if (logoInputRef.current?.files?.[0]) {
      await uploadDocument(logoInputRef.current.files[0], 'logo');
    }

    // Step 2: Upload other documents if selected
    if (licenseInputRef.current?.files?.[0]) {
      await uploadDocument(licenseInputRef.current.files[0], 'businessLicense');
    }
    if (identityInputRef.current?.files?.[0]) {
      await uploadDocument(identityInputRef.current.files[0], 'identityProof');
    }
    if (agreementInputRef.current?.files?.[0]) {
      await uploadDocument(agreementInputRef.current.files[0], 'agreement');
    }

    // Step 3: Save profile data
    await updateAgencyProfile({
      agencyName: profile.agencyName,
      slogan: profile.slogan,
      about: profile.about,
      gstin: profile.gstin,
      phone: profile.phone,
      email: profile.email,
      address: profile.address,
      website: profile.website,
      facebookUrl: profile.facebookUrl || '',
      instagramUrl: profile.instagramUrl || '',
      linkedinUrl: profile.linkedinUrl || '',
      twitterUrl: profile.twitterUrl || '',
    });

    setIsEditing(false);
    setErrors({});
  } catch (err) {
    console.error('Save failed:', err);
    // Error already toasted in store
  }
};
  const handleCancel = () => {
    if (window.confirm("Discard unsaved changes?")) {
      setProfile(initialProfile);
      setDocuments(initialDocs);
      setErrors({});
      setIsEditing(false);
    }
  };

  // --- Helper Components ---
  const StatusPill = ({ status }: { status: string }) => {
    let colorClass = "";
    let Icon = MdWarning;
    
    switch (status) {
      case 'Approved': colorClass = "text-green-400 bg-green-500/10 border-green-500/20"; Icon = MdCheckCircle; break;
      case 'Pending': colorClass = "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"; Icon = MdWarning; break;
      case 'Rejected': colorClass = "text-red-400 bg-red-500/10 border-red-500/20"; Icon = MdError; break;
      case 'Uploaded': colorClass = "text-blue-400 bg-blue-500/10 border-blue-500/20"; Icon = MdCheckCircle; break;
      case 'Missing': colorClass = "text-gray-400 bg-gray-500/10 border-gray-500/20"; Icon = MdError; break;
      default: colorClass = "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }

    return (
      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${colorClass}`}>
        <Icon size={14} />
        {status}
      </span>
    );
  };

  // --- Render ---
  return (
    <div className="w-full max-w-6xl mx-auto pb-12 animate-fade-in">
      
      {/* 1. HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--white-color)] tracking-tight">Agency Profile</h1>
          <p className="text-[var(--light-grey-color)] text-sm mt-1">Manage company identity and compliance verification.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-xs text-[var(--light-grey-color)] uppercase tracking-wider mb-1">Completion</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 bg-[var(--white-glass-color)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--puprle-color)] transition-all duration-500" style={{ width: `${completion}%` }} />
              </div>
              <span className="text-xs font-bold text-[var(--white-color)]">{completion}%</span>
            </div>
          </div>

          <StatusPill status={kycStatus} />

          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-[var(--white-glass-color)] hover:bg-[var(--light-purple-color)] text-[var(--white-color)] px-5 py-2 rounded-lg transition-all border border-[var(--white-glass-color)] font-medium text-sm"
            >
              <MdEdit size={16} /> Edit Profile
            </button>
          ) : (
             <div className="flex items-center gap-2">
                <button 
                  onClick={handleCancel}
                  className="flex items-center gap-2 bg-transparent text-[var(--light-grey-color)] hover:text-white px-4 py-2 rounded-lg transition-all font-medium text-sm"
                >
                  <MdCancel size={16} /> Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-[var(--puprle-color)] hover:bg-[#6a55d6] text-white px-5 py-2 rounded-lg transition-all shadow-lg shadow-purple-900/40 font-medium text-sm"
                >
                  <MdSave size={16} /> Save Changes
                </button>
             </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6">

        {/* 2. TOP IDENTITY CARD */}
        <div className="bg-[var(--light-dark-color)] border border-[var(--white-glass-color)] rounded-xl p-6 shadow-sm relative overflow-hidden">
           <div className="absolute -top-10 -right-10 w-64 h-64 bg-[var(--puprle-color)] opacity-5 blur-3xl rounded-full pointer-events-none"></div>

           <div className="flex flex-col lg:flex-row gap-8 items-start">
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 flex-1 w-full">
                 <div className="relative group shrink-0">
                    <div className="w-24 h-24 rounded-2xl bg-[var(--dark-color)] border border-[var(--white-glass-color)] flex items-center justify-center overflow-hidden shadow-lg">
                       {documents.logo ? (
                         <img src={documents.logo} alt="Logo" className="w-full h-full object-cover" />
                       ) : (
                         <MdBusiness size={40} className="text-[var(--light-grey-color)] opacity-30" />
                       )}
                    </div>
                    {isEditing && (
                      <button 
                        onClick={() => logoInputRef.current?.click()}
                        className="absolute -bottom-2 -right-2 p-2 bg-[var(--puprle-color)] text-white rounded-full shadow-lg hover:bg-purple-600 transition-colors"
                      >
                        <MdEdit size={14} />
                      </button>
                    )}
                    <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} />
                 </div>
                 
                 <div className="text-center sm:text-left flex-1 w-full">
                    {isEditing ? (
                      <div className="space-y-3">
                        <input 
                          name="agencyName"
                          value={profile.agencyName}
                          onChange={handleInputChange}
                          placeholder="Agency Name"
                          className={`w-full bg-[var(--white-glass-color)] border ${errors.agencyName ? 'border-red-500' : 'border-transparent'} rounded px-3 py-2 text-lg font-bold text-white focus:outline-none focus:border-[var(--puprle-color)]`}
                        />
                         <input 
                          name="slogan"
                          value={profile.slogan}
                          onChange={handleInputChange}
                          placeholder="Slogan / Tagline"
                          className="w-full bg-[var(--white-glass-color)] border border-transparent rounded px-3 py-2 text-sm text-[var(--light-grey-color)] focus:outline-none focus:border-[var(--puprle-color)]"
                        />
                      </div>
                    ) : (
                      <>
                        <h2 className="text-2xl font-bold text-[var(--white-color)]">{profile.agencyName}</h2>
                        <p className="text-[var(--light-grey-color)] text-sm mt-1">{profile.slogan}</p>
                        <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
                           <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-[var(--white-glass-color)] rounded text-[var(--light-grey-color)]">Agency</span>
                           <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-[var(--white-glass-color)] rounded text-[var(--light-grey-color)]">Marketing</span>
                        </div>
                      </>
                    )}
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-x-12 gap-y-6 w-full lg:w-auto lg:border-l border-[var(--white-glass-color)] lg:pl-12 pt-4 lg:pt-0">
                 <div>
                    <div className="flex items-center gap-2 text-[var(--light-grey-color)] text-xs font-semibold uppercase tracking-wider mb-1">
                      <MdNumbers /> GSTIN Number
                    </div>
                    {isEditing ? (
                       <input 
                        name="gstin"
                        value={profile.gstin}
                        onChange={handleInputChange}
                        className={`bg-[var(--white-glass-color)] border ${errors.gstin ? 'border-red-500' : 'border-transparent'} rounded px-2 py-1 text-sm text-white w-full`}
                       />
                    ) : (
                      <div className="text-[var(--white-color)] font-medium font-mono">{profile.gstin}</div>
                    )}
                 </div>
                 <div>
                    <div className="flex items-center gap-2 text-[var(--light-grey-color)] text-xs font-semibold uppercase tracking-wider mb-1">
                      <MdDateRange /> Joined Date
                    </div>
                    <div className="text-[var(--white-color)] font-medium">{profile.joinedDate}</div>
                 </div>
                 <div>
                    <div className="flex items-center gap-2 text-[var(--light-grey-color)] text-xs font-semibold uppercase tracking-wider mb-1">
                      <MdVerified /> KYC Verification
                    </div>
                    <div className={`text-sm font-bold ${kycStatus === 'Approved' ? 'text-green-400' : 'text-yellow-400'}`}>{kycStatus}</div>
                 </div>
                 <div>
                    <div className="flex items-center gap-2 text-[var(--light-grey-color)] text-xs font-semibold uppercase tracking-wider mb-1">
                      <MdCheckCircle /> Completion
                    </div>
                    <div className="text-[var(--white-color)] font-bold">{completion}%</div>
                 </div>
              </div>
           </div>
        </div>

        {/* ROW 2: Layout Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* COLUMN 1: Details & Contact */}
          <div className="lg:col-span-2 space-y-6">
             <div className="bg-[var(--light-dark-color)] border border-[var(--white-glass-color)] rounded-xl p-6 shadow-sm h-full flex flex-col">
                <h3 className="text-[var(--white-color)] font-semibold text-lg mb-4 border-b border-[var(--white-glass-color)] pb-3">About & Contact</h3>
                
                <div className="mb-6">
                   <label className="block text-[var(--light-grey-color)] text-xs font-semibold uppercase mb-2">Description</label>
                   {isEditing ? (
                     <textarea 
                        name="about"
                        rows={4}
                        value={profile.about}
                        onChange={handleInputChange}
                        className="w-full bg-[var(--dark-color)] border border-[var(--white-glass-color)] rounded-lg px-3 py-2 text-sm text-[var(--white-color)] focus:outline-none focus:border-[var(--puprle-color)] resize-none"
                     />
                   ) : (
                     <p className="text-[var(--white-color)] text-sm leading-relaxed opacity-90">{profile.about}</p>
                   )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                       <div>
                          <label className="flex items-center gap-2 text-[var(--light-grey-color)] text-xs font-semibold mb-1">
                             <MdPhone className="text-[var(--puprle-color)]" /> Phone
                          </label>
                          {isEditing ? (
                             <input 
                              name="phone"
                              value={profile.phone}
                              onChange={handleInputChange}
                              className="w-full bg-[var(--dark-color)] border border-[var(--white-glass-color)] rounded px-2 py-1 text-sm text-white"
                             />
                          ) : (
                            <div className="text-[var(--white-color)] text-sm">{profile.phone}</div>
                          )}
                       </div>
                       <div>
                          <label className="flex items-center gap-2 text-[var(--light-grey-color)] text-xs font-semibold mb-1">
                             <MdEmail className="text-[var(--puprle-color)]" /> Email
                          </label>
                          {isEditing ? (
                             <input 
                              name="email"
                              value={profile.email}
                              onChange={handleInputChange}
                              className="w-full bg-[var(--dark-color)] border border-[var(--white-glass-color)] rounded px-2 py-1 text-sm text-white"
                             />
                          ) : (
                            <div className="text-[var(--white-color)] text-sm">{profile.email}</div>
                          )}
                       </div>
                    </div>
                    
                    <div className="space-y-4">
                       <div>
                          <label className="flex items-center gap-2 text-[var(--light-grey-color)] text-xs font-semibold mb-1">
                             <MdLanguage className="text-[var(--puprle-color)]" /> Website
                          </label>
                          {isEditing ? (
                             <input 
                              name="website"
                              value={profile.website}
                              onChange={handleInputChange}
                              className="w-full bg-[var(--dark-color)] border border-[var(--white-glass-color)] rounded px-2 py-1 text-sm text-white"
                             />
                          ) : (
                             <a href={profile.website} target="_blank" rel="noreferrer" className="text-[var(--puprle-color)] text-sm hover:underline truncate block">
                               {profile.website}
                             </a>
                          )}
                       </div>
                       <div>
                          <label className="flex items-center gap-2 text-[var(--light-grey-color)] text-xs font-semibold mb-1">
                             <MdLocationOn className="text-[var(--puprle-color)]" /> Address
                          </label>
                          {isEditing ? (
                             <input 
                              name="address"
                              value={profile.address}
                              onChange={handleInputChange}
                              className="w-full bg-[var(--dark-color)] border border-[var(--white-glass-color)] rounded px-2 py-1 text-sm text-white"
                             />
                          ) : (
                            <div className="text-[var(--white-color)] text-sm">{profile.address}</div>
                          )}
                       </div>
                    </div>
                </div>

                <div className="pt-4 mt-auto border-t border-[var(--white-glass-color)]">
                   <label className="block text-[var(--light-grey-color)] text-xs font-semibold uppercase mb-3">Social Profiles</label>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded bg-[#1877F2] text-white flex items-center justify-center shrink-0"><FaFacebook /></div>
                         {isEditing ? (
                            <input name="facebookUrl" value={profile.facebookUrl} onChange={handleInputChange} className="flex-1 bg-[var(--dark-color)] border border-[var(--white-glass-color)] rounded px-2 py-1 text-xs text-white" placeholder="URL" />
                         ) : (
                            <span className="text-sm text-[var(--white-color)] truncate opacity-80">{profile.facebookUrl || '-'}</span>
                         )}
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded bg-gradient-to-tr from-[#f09433] to-[#bc1888] text-white flex items-center justify-center shrink-0"><FaInstagram /></div>
                         {isEditing ? (
                            <input name="instagramUrl" value={profile.instagramUrl} onChange={handleInputChange} className="flex-1 bg-[var(--dark-color)] border border-[var(--white-glass-color)] rounded px-2 py-1 text-xs text-white" placeholder="URL" />
                         ) : (
                            <span className="text-sm text-[var(--white-color)] truncate opacity-80">{profile.instagramUrl || '-'}</span>
                         )}
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded bg-[#0A66C2] text-white flex items-center justify-center shrink-0"><FaLinkedin /></div>
                         {isEditing ? (
                            <input name="linkedinUrl" value={profile.linkedinUrl} onChange={handleInputChange} className="flex-1 bg-[var(--dark-color)] border border-[var(--white-glass-color)] rounded px-2 py-1 text-xs text-white" placeholder="URL" />
                         ) : (
                            <span className="text-sm text-[var(--white-color)] truncate opacity-80">{profile.linkedinUrl || '-'}</span>
                         )}
                      </div>
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded bg-black border border-gray-700 text-white flex items-center justify-center shrink-0"><FaTwitter /></div>
                         {isEditing ? (
                            <input name="twitterUrl" value={profile.twitterUrl} onChange={handleInputChange} className="flex-1 bg-[var(--dark-color)] border border-[var(--white-glass-color)] rounded px-2 py-1 text-xs text-white" placeholder="Handle" />
                         ) : (
                            <span className="text-sm text-[var(--white-color)] truncate opacity-80">{profile.twitterUrl || '-'}</span>
                         )}
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* COLUMN 2: Documents & Completion */}
          <div className="space-y-6">

             <div className="bg-[var(--light-dark-color)] border border-[var(--white-glass-color)] rounded-xl p-6 shadow-sm">
                <h3 className="text-[var(--white-color)] font-semibold text-sm mb-4 flex items-center gap-2">
                   <MdCheckCircle className="text-[var(--puprle-color)]" /> Profile Strength
                </h3>
                <div className="relative pt-1">
                   <div className="flex mb-2 items-center justify-between">
                      <div className="text-right">
                         <span className="text-xs font-semibold inline-block text-[var(--puprle-color)]">
                           {completion}% Complete
                         </span>
                      </div>
                   </div>
                   <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-[var(--white-glass-color)]">
                      <div style={{ width: `${completion}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[var(--puprle-color)] transition-all duration-500"></div>
                   </div>
                   <p className="text-xs text-[var(--light-grey-color)]">
                      {completion < 100 ? "Complete all sections and upload documents to reach 100% and get verified." : "Great job! Your profile is fully complete."}
                   </p>
                </div>
             </div>

             <div className="bg-[var(--light-dark-color)] border border-[var(--white-glass-color)] rounded-xl p-6 shadow-sm flex-1">
                <h3 className="text-[var(--white-color)] font-semibold text-lg mb-4 flex items-center justify-between">
                   <span>Documents</span>
                   {isEditing && <span className="text-xs font-normal text-[var(--light-grey-color)]">Tap to upload</span>}
                </h3>
                
                <div className="space-y-3">
                   <div 
                      onClick={() => isEditing && licenseInputRef.current?.click()}
                      className={`p-3 rounded-lg border flex items-center justify-between transition-colors ${isEditing ? 'cursor-pointer hover:bg-[var(--white-glass-color)] border-dashed border-[var(--light-grey-color)]/30' : 'border-[var(--white-glass-color)] bg-[var(--dark-color)]'}`}
                   >
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded bg-[var(--white-glass-color)] flex items-center justify-center text-[var(--white-color)]">
                            {isEditing ? <MdUploadFile /> : <MdDescription />}
                         </div>
                         <div>
                            <p className="text-xs font-medium text-[var(--white-color)]">Business License</p>
                            {documents.businessLicense.fileName && <p className="text-[10px] text-[var(--light-grey-color)] truncate max-w-[100px]">{documents.businessLicense.fileName}</p>}
                         </div>
                      </div>
                      <StatusPill status={documents.businessLicense.status === 'uploaded' ? 'Uploaded' : 'Missing'} />
                      <input type="file" ref={licenseInputRef} className="hidden" onChange={(e) => handleFileChange(e, 'businessLicense')} />
                   </div>

                   <div 
                      onClick={() => isEditing && identityInputRef.current?.click()}
                      className={`p-3 rounded-lg border flex items-center justify-between transition-colors ${isEditing ? 'cursor-pointer hover:bg-[var(--white-glass-color)] border-dashed border-[var(--light-grey-color)]/30' : 'border-[var(--white-glass-color)] bg-[var(--dark-color)]'}`}
                   >
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded bg-[var(--white-glass-color)] flex items-center justify-center text-[var(--white-color)]">
                             {isEditing ? <MdUploadFile /> : <MdDescription />}
                         </div>
                         <div>
                            <p className="text-xs font-medium text-[var(--white-color)]">ID Proof</p>
                            {documents.identityProof.fileName && <p className="text-[10px] text-[var(--light-grey-color)] truncate max-w-[100px]">{documents.identityProof.fileName}</p>}
                         </div>
                      </div>
                      <StatusPill status={documents.identityProof.status === 'uploaded' ? 'Uploaded' : 'Missing'} />
                      <input type="file" ref={identityInputRef} className="hidden" onChange={(e) => handleFileChange(e, 'identityProof')} />
                   </div>

                   <div 
                      onClick={() => isEditing && agreementInputRef.current?.click()}
                      className={`p-3 rounded-lg border flex items-center justify-between transition-colors ${isEditing ? 'cursor-pointer hover:bg-[var(--white-glass-color)] border-dashed border-[var(--light-grey-color)]/30' : 'border-[var(--white-glass-color)] bg-[var(--dark-color)]'}`}
                   >
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded bg-[var(--white-glass-color)] flex items-center justify-center text-[var(--white-color)]">
                             {isEditing ? <MdUploadFile /> : <MdDescription />}
                         </div>
                         <div>
                            <p className="text-xs font-medium text-[var(--white-color)]">Agreement</p>
                            {documents.agreement.fileName && <p className="text-[10px] text-[var(--light-grey-color)] truncate max-w-[100px]">{documents.agreement.fileName}</p>}
                         </div>
                      </div>
                      <StatusPill status={documents.agreement.status === 'uploaded' ? 'Uploaded' : 'Missing'} />
                      <input type="file" ref={agreementInputRef} className="hidden" onChange={(e) => handleFileChange(e, 'agreement')} />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyProfilePage;