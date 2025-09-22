import React, { useState, useRef, useEffect } from 'react';
import type { JSX } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiDownload, 
  FiMail, 
  FiChevronLeft,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiAlertCircle,
  FiDollarSign,
  FiCalendar,
  FiPause,
  FiPlay,
  FiEdit,
  FiImage,
  FiFileText,
  FiMapPin,
  FiUser,
  FiHome,
  FiX,
  FiCheck,
  FiPercent,
  FiArrowRight,
  FiArrowLeft
} from 'react-icons/fi';

// Define interfaces
interface Campaign {
  id: string;
  advertiser: string;
  company: string;
  contact: {
    phone: string;
    email: string;
  };
  property: {
    name: string;
    code: string;
    category: string;
    height: string;
    width: string;
    location: string;
  };
  isPoliticalAd: boolean;
  politicalProof: string;
  isGovernmentAd: boolean;
  governmentProof: string;
  adCategory: string;
  adDescription: string;
  suggestedMaterial: string;
  creativeFiles: { name: string; url: string }[];
  dates: {
    start: string;
    end: string;
  };
  amount: string;
  statusHistory: { status: string; date: string; by: string }[];
}

interface PaymentDetails {
  mediaRental: number;
  printingCost: number;
  printingType: string;
  materialCost: number;
  designCost: number;
  installationCost: number;
  complianceFee: number;
  convenienceFee: number;
  gst: number;
}

interface AgreementType {
  id: string;
  name: string;
  description: string;
}

interface PrintingType {
  id: string;
  name: string;
  cost: number;
}

const CampaignDetails: React.FC = () => {
  const [status, setStatus] = useState<string>('Approved (Waiting for payment)');
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [showRejectionForm, setShowRejectionForm] = useState<boolean>(false);
  const [showAgreementPaymentModal, setShowAgreementPaymentModal] = useState<boolean>(false);
  const [installationStatus, setInstallationStatus] = useState<string>('not_started');
  const [campaignPhoto, setCampaignPhoto] = useState<string | null>(null);
  const [selectedAgreement, setSelectedAgreement] = useState<string>('');
  const [agreementStep, setAgreementStep] = useState<'agreement' | 'payment'>('agreement');
  
  // Payment details state
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    mediaRental: 2500,
    printingCost: 500,
    printingType: 'Vinyl Print (510gsm)',
    materialCost: 300,
    designCost: 0,
    installationCost: 350,
    complianceFee: 0,
    convenienceFee: 100,
    gst: 18
  });

  // Use refs to track modal state changes
  const agreementPaymentModalRef = useRef<HTMLDivElement>(null);
  
  // Sample campaign data
  const campaign: Campaign = {
    id: 'CMP-001',
    advertiser: 'John Smith',
    company: 'Nike Inc.',
    contact: {
      phone: '+1 (555) 123-4567',
      email: 'john.smith@nike.com'
    },
    property: {
      name: 'Times Square Billboard',
      code: 'BAZ3464',
      category: 'Digital Billboard',
      height: '20 ft',
      width: '40 ft',
      location: 'Times Square, New York, NY'
    },
    isPoliticalAd: true,
    politicalProof: '/docs/political-proof.pdf',
    isGovernmentAd: false,
    governmentProof: '',
    adCategory: 'Fashion/Apparel',
    adDescription: 'Promotion of new Nike Air Max sneakers with focus on comfort and style for urban environments.',
    suggestedMaterial: 'Vinyl with matte finish, 510gsm',
    creativeFiles: [
      { name: 'nike_airmax_main.jpg', url: '/creatives/nike_airmax_main.jpg' },
      { name: 'nike_airmax_variant.png', url: '/creatives/nike_airmax_variant.png' },
      { name: 'brand_guidelines.pdf', url: '/creatives/brand_guidelines.pdf' }
    ],
    dates: {
      start: '2023-06-15',
      end: '2023-06-30'
    },
    amount: '$2,500',
    statusHistory: [
      { status: 'Pending', date: '2023-05-10', by: 'System' },
      { status: 'Approved (Waiting for payment)', date: '2023-05-12', by: 'Admin User' }
    ]
  };

  // Agreement types
  const agreementTypes: AgreementType[] = [
    { id: 'standard', name: 'Standard Advertising Agreement', description: 'Basic agreement for most campaigns' },
    { id: 'premium', name: 'Premium Placement Agreement', description: 'For high-visibility locations' },
    { id: 'political', name: 'Political Advertising Agreement', description: 'Special terms for political campaigns' },
    { id: 'government', name: 'Government Campaign Agreement', description: 'For government/public service campaigns' },
    { id: 'longterm', name: 'Long-Term Contract', description: 'For campaigns running 3+ months' },
    { id: 'custom', name: 'Custom Agreement', description: 'Tailored terms for specific needs' }
  ];

  // Printing types
  const printingTypes: PrintingType[] = [
    { id: 'vinyl', name: 'Vinyl Print (510gsm)', cost: 500 },
    { id: 'flex', name: 'Flex Print (440gsm)', cost: 400 },
    { id: 'mesh', name: 'Mesh Print (510gsm)', cost: 550 },
    { id: 'digital', name: 'Digital Print', cost: 600 }
  ];

  // Status badge component
  const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    let bgColor: string, textColor: string, icon: JSX.Element | null = null;
    
    if (status.includes('Pending')) {
      bgColor = 'bg-yellow-900/30';
      textColor = 'text-yellow-400';
      icon = <FiClock className="mr-1" />;
    } else if (status.includes('Rejected')) {
      bgColor = 'bg-red-900/30';
      textColor = 'text-red-400';
      icon = <FiXCircle className="mr-1" />;
    } else if (status.includes('Approved') && status.includes('Waiting')) {
      bgColor = 'bg-blue-900/30';
      textColor = 'text-blue-400';
      icon = <FiAlertCircle className="mr-1" />;
    } else if (status.includes('Approved') && status.includes('Succeeded')) {
      bgColor = 'bg-green-900/30';
      textColor = 'text-green-400';
      icon = <FiCheckCircle className="mr-1" />;
    } else if (status.includes('Scheduled')) {
      bgColor = 'bg-purple-900/30';
      textColor = 'text-purple-400';
      icon = <FiCalendar className="mr-1" />;
    } else if (status.includes('Installation')) {
      bgColor = 'bg-indigo-900/30';
      textColor = 'text-indigo-400';
      icon = <FiDownload className="mr-1" />;
    } else if (status.includes('Running')) {
      bgColor = 'bg-teal-900/30';
      textColor = 'text-teal-400';
      icon = <FiPlay className="mr-1" />;
    } else if (status.includes('Ended')) {
      bgColor = 'bg-gray-900/30';
      textColor = 'text-gray-400';
      icon = <FiPause className="mr-1" />;
    } else if (status.includes('Waiting')) {
      bgColor = 'bg-amber-900/30';
      textColor = 'text-amber-400';
      icon = <FiClock className="mr-1" />;
    } else {
      bgColor = 'bg-gray-900/30';
      textColor = 'text-gray-400';
    }
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {icon} {status}
      </span>
    );
  };

  // Handle status change
  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    if (newStatus === 'Rejected') {
      setShowRejectionForm(true);
    } else {
      setShowRejectionForm(false);
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCampaignPhoto(URL.createObjectURL(file));
      setTimeout(() => {
        alert('Campaign photo has been sent to the advertiser');
      }, 1000);
    }
  };

  // Handle rejection submission
  const handleRejectionSubmit = () => {
    alert('Rejection reason submitted successfully');
    setShowRejectionForm(false);
  };

  // Calculate payment total
  const calculatePaymentTotal = () => {
    const {
      mediaRental,
      printingCost,
      materialCost,
      designCost,
      installationCost,
      complianceFee,
      convenienceFee,
      gst
    } = paymentDetails;
    
    const subtotal = mediaRental + printingCost + materialCost + designCost + installationCost + complianceFee + convenienceFee;
    const taxAmount = subtotal * (gst / 100);
    const total = subtotal + taxAmount;
    
    return {
      subtotal: subtotal.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      total: total.toFixed(2)
    };
  };

  // Handle payment details change
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  // Handle printing type change
  const handlePrintingTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = printingTypes.find(type => type.id === e.target.value);
    if (selectedType) {
      setPaymentDetails(prev => ({
        ...prev,
        printingType: selectedType.name,
        printingCost: selectedType.cost
      }));
    }
  };

  // Handle sending agreement with payment
  const handleSendAgreementWithPayment = () => {
    if (agreementStep === 'agreement') {
      if (!selectedAgreement) {
        alert('Please select an agreement type');
        return;
      }
      setAgreementStep('payment');
    } else {
      const total = calculatePaymentTotal().total;
      alert(`Agreement and payment request for $${total} sent to advertiser successfully`);
      setShowAgreementPaymentModal(false);
      setAgreementStep('agreement');
      setSelectedAgreement('');
      setStatus('Scheduled');
    }
  };

  // Handle installation status change
  const handleInstallationStatusChange = (newStatus: string) => {
    setInstallationStatus(newStatus);
    if (newStatus === 'completed') {
      setStatus('Campaign Running');
    }
  };

  // Handle campaign end
  const handleEndCampaign = () => {
    setStatus('Campaign Ended');
    alert('Campaign marked as ended. Review option enabled for advertiser.');
  };

  // Handle outside click for modals
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        showAgreementPaymentModal && 
        agreementPaymentModalRef.current && 
        !agreementPaymentModalRef.current.contains(e.target as Node)
      ) {
        setShowAgreementPaymentModal(false);
        setAgreementStep('agreement');
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [showAgreementPaymentModal]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showAgreementPaymentModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAgreementPaymentModal]);

  // Agreement & Payment Modal Component
  const AgreementPaymentModal: React.FC = () => {
    const { subtotal, taxAmount, total } = calculatePaymentTotal();
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <motion.div 
          ref={agreementPaymentModalRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-[var(--light-dark-color)] border border-[var(--light-blur-grey-color)] rounded-xl p-6 w-full max-w-4xl max-h-[75vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">
              {agreementStep === 'agreement' ? 'Select Agreement Type' : 'Payment Details'}
            </h3>
            <button 
              onClick={() => {
                setShowAgreementPaymentModal(false);
                setAgreementStep('agreement');
              }} 
              className="text-[var(--light-grey-color)] hover:text-white"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
          
          {agreementStep === 'agreement' ? (
            <>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {agreementTypes.map(agreement => (
                  <div 
                    key={agreement.id}
                    className={`p-4 rounded-lg cursor-pointer border ${
                      selectedAgreement === agreement.id 
                        ? 'border-[var(--puprle-color)] bg-[var(--puprle-color)]/20' 
                        : 'border-[var(--light-blur-grey-color)] hover:border-[var(--puprle-color)]'
                    }`}
                    onClick={() => setSelectedAgreement(agreement.id)}
                  >
                    <div className="flex items-start">
                      <div className={`h-5 w-5 rounded-full border flex items-center justify-center mr-3 mt-1 ${
                        selectedAgreement === agreement.id 
                          ? 'border-[var(--puprle-color)] bg-[var(--puprle-color)]' 
                          : 'border-[var(--light-grey-color)]'
                      }`}>
                        {selectedAgreement === agreement.id && <FiCheck className="h-3 w-3 text-white" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{agreement.name}</p>
                        <p className="text-xs text-[var(--light-grey-color)]">{agreement.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => {
                    setShowAgreementPaymentModal(false);
                    setAgreementStep('agreement');
                  }}
                  className="px-4 py-2 text-xs bg-[var(--dark-color)] text-[var(--light-grey-color)] rounded border border-[var(--light-blur-grey-color)] hover:bg-[var(--light-blur-grey-color)]/20"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSendAgreementWithPayment}
                  disabled={!selectedAgreement}
                  className="px-4 py-2 text-xs bg-[var(--puprle-color)] text-white rounded hover:bg-[var(--puprle-color)]/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next: Payment Details <FiArrowRight className="inline ml-1" />
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-[var(--light-grey-color)] mb-1">Media Rental Cost ($)</label>
                    <input
                      type="number"
                      name="mediaRental"
                      value={paymentDetails.mediaRental}
                      onChange={handlePaymentChange}
                      className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-[var(--light-grey-color)] mb-1">Printing Type</label>
                    <select
                      value={printingTypes.find(type => type.name === paymentDetails.printingType)?.id || 'vinyl'}
                      onChange={handlePrintingTypeChange}
                      className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
                    >
                      {printingTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-[var(--light-grey-color)] mb-1">Printing Cost ($)</label>
                    <input
                      type="number"
                      name="printingCost"
                      value={paymentDetails.printingCost}
                      onChange={handlePaymentChange}
                      className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-[var(--light-grey-color)] mb-1">Material Cost ($)</label>
                    <input
                      type="number"
                      name="materialCost"
                      value={paymentDetails.materialCost}
                      onChange={handlePaymentChange}
                      className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-[var(--light-grey-color)] mb-1">Design Cost ($) <span className="text-gray-500">(Optional)</span></label>
                    <input
                      type="number"
                      name="designCost"
                      value={paymentDetails.designCost}
                      onChange={handlePaymentChange}
                      className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-[var(--light-grey-color)] mb-1">Installation Cost ($)</label>
                    <input
                      type="number"
                      name="installationCost"
                      value={paymentDetails.installationCost}
                      onChange={handlePaymentChange}
                      className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-[var(--light-grey-color)] mb-1">Compliance Fee ($) <span className="text-gray-500">(For Govt/Political)</span></label>
                    <input
                      type="number"
                      name="complianceFee"
                      value={paymentDetails.complianceFee}
                      onChange={handlePaymentChange}
                      className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-[var(--light-grey-color)] mb-1">Platform Convenience Fee ($)</label>
                    <input
                      type="number"
                      name="convenienceFee"
                      value={paymentDetails.convenienceFee}
                      onChange={handlePaymentChange}
                      className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-[var(--light-grey-color)] mb-1">GST (%)</label>
                    <div className="relative">
                      <input
                        type="number"
                        name="gst"
                        value={paymentDetails.gst}
                        onChange={handlePaymentChange}
                        className="w-full px-3 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--puprle-color)] pr-8"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <FiPercent className="h-4 w-4 text-[var(--light-grey-color)]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-[var(--dark-color)] rounded-lg mb-6">
                <h4 className="text-sm font-semibold text-white mb-3">Payment Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-[var(--light-grey-color)]">Media Rental Cost</span>
                    <span className="text-xs text-white">${paymentDetails.mediaRental}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-[var(--light-grey-color)]">Printing Cost ({paymentDetails.printingType})</span>
                    <span className="text-xs text-white">${paymentDetails.printingCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-[var(--light-grey-color)]">Material Cost</span>
                    <span className="text-xs text-white">${paymentDetails.materialCost}</span>
                  </div>
                  {paymentDetails.designCost > 0 && (
                    <div className="flex justify-between">
                      <span className="text-xs text-[var(--light-grey-color)]">Design Cost</span>
                      <span className="text-xs text-white">${paymentDetails.designCost}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-xs text-[var(--light-grey-color)]">Installation Cost</span>
                    <span className="text-xs text-white">${paymentDetails.installationCost}</span>
                  </div>
                  {paymentDetails.complianceFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-xs text-[var(--light-grey-color)]">Compliance Fee</span>
                      <span className="text-xs text-white">${paymentDetails.complianceFee}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-xs text-[var(--light-grey-color)]">Platform Convenience Fee</span>
                    <span className="text-xs text-white">${paymentDetails.convenienceFee}</span>
                  </div>
                  <div className="border-t border-[var(--light-blur-grey-color)] pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-[var(--light-grey-color)]">Subtotal</span>
                      <span className="text-xs text-white">${subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-[var(--light-grey-color)]">GST ({paymentDetails.gst}%)</span>
                      <span className="text-xs text-white">${taxAmount}</span>
                    </div>
                  </div>
                  <div className="border-t border-[var(--light-blur-grey-color)] pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold text-white">Total Amount</span>
                      <span className="text-lg font-bold text-white">${total}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between space-x-3">
                <button 
                  onClick={() => setAgreementStep('agreement')}
                  className="px-4 py-2 text-xs bg-[var(--dark-color)] text-[var(--light-grey-color)] rounded border border-[var(--light-blur-grey-color)] hover:bg-[var(--light-blur-grey-color)]/20 flex items-center"
                >
                  <FiArrowLeft className="mr-1" /> Back to Agreement
                </button>
                <button 
                  onClick={handleSendAgreementWithPayment}
                  className="px-4 py-2 text-xs bg-[var(--puprle-color)] text-white rounded hover:bg-[var(--puprle-color)]/90"
                >
                  Send Agreement & Payment Request
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <button className="flex items-center text-[var(--light-grey-color)] hover:text-white mr-4">
          <FiChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Campaign Details</h1>
          <p className="text-xs text-[var(--light-grey-color)]">Campaign ID: {campaign.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Campaign Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[var(--light-dark-color)] border border-[var(--light-blur-grey-color)] rounded-xl p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <h2 className="text-lg font-semibold text-white mb-2 sm:mb-0">Campaign Status</h2>
              <StatusBadge status={status} />
            </div>
            
            {/* Status Actions */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-white mb-3">Update Status</h3>
              <div className="flex flex-wrap gap-2">
                {status !== 'Rejected' && (
                  <button 
                    onClick={() => handleStatusChange('Rejected')}
                    className="px-3 py-1 text-xs bg-red-900/30 text-red-400 rounded border border-red-800/50 hover:bg-red-800/40"
                  >
                    Reject Campaign
                  </button>
                )}
                
                {status === 'Approved (Waiting for payment)' && (
                  <button 
                    onClick={() => setShowAgreementPaymentModal(true)}
                    className="px-3 py-1 text-xs bg-blue-900/30 text-blue-400 rounded border border-blue-800/50 hover:bg-blue-800/40"
                  >
                    Send Agreement with Payment
                  </button>
                )}
                
                {status === 'Scheduled' && (
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => handleInstallationStatusChange('in_progress')}
                      className="px-3 py-1 text-xs bg-indigo-900/30 text-indigo-400 rounded border border-indigo-800/50 hover:bg-indigo-800/40"
                    >
                      Start Installation
                    </button>
                  </div>
                )}
                
                {installationStatus === 'in_progress' && (
                  <button 
                    onClick={() => handleInstallationStatusChange('completed')}
                    className="px-3 py-1 text-xs bg-teal-900/30 text-teal-400 rounded border border-teal-800/50 hover:bg-teal-800/40"
                    disabled={!campaignPhoto} 
                  >
                    Complete Installation
                  </button>
                )}
                
                {status === 'Campaign Running' && (
                  <button 
                    onClick={handleEndCampaign}
                    className="px-3 py-1 text-xs bg-gray-900/30 text-gray-400 rounded border border-gray-800/50 hover:bg-gray-800/40"
                  >
                    End Campaign
                  </button>
                )}
              </div>
            </div>
            
            {/* Rejection Reason Form */}
            {showRejectionForm && (
              <div className="mt-6 p-4 bg-[var(--dark-color)] rounded-lg border border-red-800/50">
                <h3 className="text-sm font-medium text-white mb-3">Rejection Reason</h3>
                <textarea
                  value={rejectionReason}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRejectionReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-[var(--light-dark-color)] border border-[var(--light-blur-grey-color)] rounded text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                  placeholder="Please provide a detailed reason for rejecting this campaign..."
                />
                <div className="flex justify-end mt-3 space-x-2">
                  <button 
                    onClick={() => setShowRejectionForm(false)}
                    className="px-3 py-1 text-xs bg-[var(--dark-color)] text-[var(--light-grey-color)] rounded border border-[var(--light-blur-grey-color)] hover:bg-[var(--light-blur-grey-color)]/20"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleRejectionSubmit}
                    className="px-3 py-1 text-xs bg-red-900/30 text-red-400 rounded border border-red-800/50 hover:bg-red-800/40"
                  >
                    Submit Rejection
                  </button>
                </div>
              </div>
            )}
            
            {/* Installation Status */}
            {status === 'Scheduled' || status === 'Campaign Running' || installationStatus !== 'not_started' ? (
              <div className="mt-6 p-4 bg-[var(--dark-color)] rounded-lg border border-indigo-800/50">
                <h3 className="text-sm font-medium text-white mb-3">Installation Status</h3>
                <div className="flex items-center space-x-4">
                  <div className={`h-3 w-3 rounded-full ${
                    installationStatus === 'not_started' ? 'bg-gray-500' :
                    installationStatus === 'in_progress' ? 'bg-yellow-500 animate-pulse' :
                    'bg-green-500'
                  }`}></div>
                  <span className="text-xs text-white">
                    {installationStatus === 'not_started' ? 'Not Started' :
                     installationStatus === 'in_progress' ? 'Installation in Progress' :
                     'Installation Completed'}
                  </span>
                </div>
                
                {installationStatus === 'in_progress' && (
                  <p className="text-xs text-[var(--light-grey-color)] mt-2">
                    Installation is currently underway. Mark as complete when finished.
                  </p>
                )}
              </div>
            ) : null}
            
            {/* Installation Photo Upload */}
            {installationStatus === 'completed' && !campaignPhoto && (
              <div className="mt-6 p-4 bg-[var(--dark-color)] rounded-lg border border-teal-800/50">
                <h3 className="text-sm font-medium text-white mb-3">Upload Campaign Photo</h3>
                <label className="flex flex-col items-center justify-center w-full h-32 bg-[var(--light-dark-color)] border-2 border-dashed border-[var(--light-blur-grey-color)] rounded cursor-pointer hover:border-[var(--puprle-color)] transition-colors">
                  <div className="text-center p-4">
                    <FiImage className="h-6 w-6 text-[var(--light-grey-color)] mx-auto mb-2" />
                    <span className="text-xs text-[var(--light-grey-color)]">Click to upload campaign photo</span>
                  </div>
                  <input 
                    type="file" 
                    onChange={handleFileUpload} 
                    className="hidden" 
                    accept="image/*"
                  />
                </label>
              </div>
            )}
            
            {/* Campaign Photo Preview */}
            {campaignPhoto && (
              <div className="mt-6 p-4 bg-[var(--dark-color)] rounded-lg border border-teal-800/50">
                <h3 className="text-sm font-medium text-white mb-3">Campaign Photo</h3>
                <div className="relative">
                  <img 
                    src={campaignPhoto} 
                    alt="Campaign" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    Installed
                  </div>
                </div>
                <p className="text-xs text-[var(--light-grey-color)] mt-2">Photo will be sent to the advertiser</p>
              </div>
            )}
          </motion.div>

          {/* Advertiser & Property Information */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-[var(--light-dark-color)] border border-[var(--light-blur-grey-color)] rounded-xl p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Advertiser & Property Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Advertiser Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-white flex items-center">
                  <FiUser className="mr-2" /> Advertiser Details
                </h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-[var(--light-grey-color)]">Name</span>
                    <span className="text-xs text-white">{campaign.advertiser}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-[var(--light-grey-color)]">Company</span>
                    <span className="text-xs text-white">{campaign.company}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-[var(--light-grey-color)]">Email</span>
                    <span className="text-xs text-white">{campaign.contact.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-[var(--light-grey-color)]">Phone</span>
                    <span className="text-xs text-white">{campaign.contact.phone}</span>
                  </div>
                </div>
              </div>
              
              {/* Property Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-white flex items-center">
                  <FiHome className="mr-2" /> Property Details
                </h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-[var(--light-grey-color)]">Name</span>
                    <span className="text-xs text-white">{campaign.property.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-[var(--light-grey-color)]">Code</span>
                    <span className="text-xs text-white font-mono">{campaign.property.code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-[var(--light-grey-color)]">Category</span>
                    <span className="text-xs text-white">{campaign.property.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-[var(--light-grey-color)]">Size</span>
                    <span className="text-xs text-white">{campaign.property.height} × {campaign.property.width}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-[var(--light-grey-color)]">Location</span>
                    <span className="text-xs text-white">{campaign.property.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Campaign Details */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-[var(--light-dark-color)] border border-[var(--light-blur-grey-color)] rounded-xl p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Campaign Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-xs text-[var(--light-grey-color)]">Ad Category</span>
                  <span className="text-xs text-white">{campaign.adCategory}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-xs text-[var(--light-grey-color)]">Campaign Dates</span>
                  <span className="text-xs text-white">
                    {new Date(campaign.dates.start).toLocaleDateString()} - {new Date(campaign.dates.end).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-xs text-[var(--light-grey-color)]">Amount</span>
                  <span className="text-xs text-white">{campaign.amount}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-xs text-[var(--light-grey-color)]">Political Ad</span>
                  <span className="text-xs text-white">{campaign.isPoliticalAd ? 'Yes' : 'No'}</span>
                </div>
                
                {campaign.isPoliticalAd && (
                  <div className="flex justify-between">
                    <span className="text-xs text-[var(--light-grey-color)]">Government Proof</span>
                    <a href={campaign.politicalProof} className="text-xs text-blue-400 hover:underline flex items-center">
                      <FiFileText className="mr-1" /> View Document
                    </a>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-xs text-[var(--light-grey-color)]">Government Ad</span>
                  <span className="text-xs text-white">{campaign.isGovernmentAd ? 'Yes' : 'No'}</span>
                </div>
                
                {campaign.isGovernmentAd && campaign.governmentProof && (
                  <div className="flex justify-between">
                    <span className="text-xs text-[var(--light-grey-color)]">Approval Letter</span>
                    <a href={campaign.governmentProof} className="text-xs text-blue-400 hover:underline flex items-center">
                      <FiFileText className="mr-1" /> View Document
                    </a>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-[var(--light-grey-color)] block mb-1">Ad Description</span>
                  <p className="text-xs text-white">{campaign.adDescription}</p>
                </div>
                
                <div>
                  <span className="text-xs text-[var(--light-grey-color)] block mb-1">Suggested Material</span>
                  <p className="text-xs text-white">{campaign.suggestedMaterial}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Creative Files */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-[var(--light-dark-color)] border border-[var(--light-blur-grey-color)] rounded-xl p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Creative Files</h2>
            
            <div className="space-y-3">
              {campaign.creativeFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[var(--dark-color)] rounded-lg">
                  <div className="flex items-center">
                    <FiFileText className="h-4 w-4 text-[var(--light-grey-color)] mr-2" />
                    <span className="text-xs text-white">{file.name}</span>
                  </div>
                  <a 
                    href={file.url} 
                    className="flex items-center text-xs text-blue-400 hover:text-blue-300"
                    download
                  >
                    <FiDownload className="mr-1" /> Download
                  </a>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Status History & Actions */}
        <div className="space-y-6">
          {/* Status History */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-[var(--light-dark-color)] border border-[var(--light-blur-grey-color)] rounded-xl p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Status History</h2>
            
            <div className="space-y-4">
              {campaign.statusHistory.map((history, index) => (
                <div key={index} className="flex">
                  <div className="flex flex-col items-center mr-3">
                    <div className={`w-2 h-2 rounded-full ${
                      history.status.includes('Rejected') ? 'bg-red-400' :
                      history.status.includes('Approved') ? 'bg-green-400' :
                      history.status.includes('Pending') ? 'bg-yellow-400' : 'bg-gray-400'
                    }`}></div>
                    {index < campaign.statusHistory.length - 1 && (
                      <div className="w-0.5 h-8 bg-gray-600 mt-1"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex justify-between">
                      <span className="text-xs font-medium text-white">{history.status}</span>
                      <span className="text-xs text-[var(--light-grey-color)]">{history.date}</span>
                    </div>
                    <p className="text-xs text-[var(--light-grey-color)] mt-1">By: {history.by}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="bg-[var(--light-dark-color)] border border-[var(--light-blur-grey-color)] rounded-xl p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 bg-[var(--dark-color)] hover:bg-[var(--dark-color)]/80 rounded-lg transition-colors">
                <span className="text-xs text-white">Contact Advertiser</span>
                <FiMail className="h-4 w-4 text-[var(--light-grey-color)]" />
              </button>
              
              <button className="w-full flex items-center justify-between p-3 bg-[var(--dark-color)] hover:bg-[var(--dark-color)]/80 rounded-lg transition-colors">
                <span className="text-xs text-white">Generate Invoice</span>
                <FiDollarSign className="h-4 w-4 text-[var(--light-grey-color)]" />
              </button>
              
              <button className="w-full flex items-center justify-between p-3 bg-[var(--dark-color)] hover:bg-[var(--dark-color)]/80 rounded-lg transition-colors">
                <span className="text-xs text-white">View Property Location</span>
                <FiMapPin className="h-4 w-4 text-[var(--light-grey-color)]" />
              </button>
              
              <button className="w-full flex items-center justify-between p-3 bg-[var(--dark-color)] hover:bg-[var(--dark-color)]/80 rounded-lg transition-colors">
                <span className="text-xs text-white">Edit Campaign Details</span>
                <FiEdit className="h-4 w-4 text-[var(--light-grey-color)]" />
              </button>
            </div>
          </motion.div>

          {/* Campaign Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            className="bg-[var(--light-dark-color)] border border-[var(--light-blur-grey-color)] rounded-xl p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Campaign Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-xs text-[var(--light-grey-color)]">Duration</span>
                <span className="text-xs text-white">15 days</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-xs text-[var(--light-grey-color)]">Impressions Estimate</span>
                <span className="text-xs text-white">1.5M+</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-xs text-[var(--light-grey-color)]">Daily Visibility</span>
                <span className="text-xs text-white">24/7</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-xs text-[var(--light-grey-color)]">Traffic Data</span>
                <span className="text-xs text-white">300K vehicles/day</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-xs text-[var(--light-grey-color)]">Target Audience</span>
                <span className="text-xs text-white">Urban, 18-45 age</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAgreementPaymentModal && <AgreementPaymentModal />}
      </AnimatePresence>
    </div>
  );
};

export default CampaignDetails;