import React, {  useState } from 'react';
import { motion } from 'framer-motion';
import type { JSX } from 'react';

import { 
  FiSearch, 
  FiFilter, 
  FiEye, 
  FiChevronDown,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiAlertCircle,
  FiDownload,
  FiEdit,
  FiDollarSign,
  FiCalendar,
  FiTrendingUp,
  FiPause,
  FiPlay
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

// Define the Campaign interface
interface Campaign {
  id: string;
  advertiser: string;
  company: string;
  property: string;
  propertyCode: string;
  designStatus: string;
  startDate: string;
  endDate: string;
  status: string;
  amount: string;
}

const CampaignList: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sample campaign data
  const campaigns: Campaign[] = [
    {
      id: 'CMP-001',
      advertiser: 'John Smith',
      company: 'Nike Inc.',
      property: 'Times Square Billboard',
      propertyCode: 'BAZ3464',
      designStatus: 'Uploaded',
      startDate: '2023-06-15',
      endDate: '2023-06-30',
      status: 'Approved (Payment Succeeded)',
      amount: '$2,500'
    },
    {
      id: 'CMP-002',
      advertiser: 'Emma Johnson',
      company: 'Coca Cola',
      property: 'Downtown Hoarding',
      propertyCode: 'BAZ2891',
      designStatus: 'Requested for Design',
      startDate: '2023-07-01',
      endDate: '2023-07-15',
      status: 'Waiting for Advertiser Actions',
      amount: '$1,800'
    },
    {
      id: 'CMP-003',
      advertiser: 'Michael Lee',
      company: 'Toyota',
      property: 'Highway Unipole',
      propertyCode: 'BAZ5123',
      designStatus: 'Uploaded',
      startDate: '2023-06-20',
      endDate: '2023-07-05',
      status: 'Campaign Running',
      amount: '$3,200'
    },
    {
      id: 'CMP-004',
      advertiser: 'Sarah Williams',
      company: 'Apple Inc.',
      property: 'Airport Digital Billboard',
      propertyCode: 'BAZ6742',
      designStatus: 'Uploaded',
      startDate: '2023-07-10',
      endDate: '2023-07-25',
      status: 'Scheduled',
      amount: '$4,100'
    },
    {
      id: 'CMP-005',
      advertiser: 'David Brown',
      company: 'Samsung Electronics',
      property: 'Shopping Mall Banner',
      propertyCode: 'BAZ8934',
      designStatus: 'Requested for Design',
      startDate: '2023-08-01',
      endDate: '2023-08-15',
      status: 'Pending',
      amount: '$2,100'
    },
    {
      id: 'CMP-006',
      advertiser: 'Lisa Anderson',
      company: 'McDonald\'s',
      property: 'City Center Billboard',
      propertyCode: 'BAZ1256',
      designStatus: 'Uploaded',
      startDate: '2023-06-25',
      endDate: '2023-07-10',
      status: 'Campaign Ended',
      amount: '$2,800'
    },
    {
      id: 'CMP-007',
      advertiser: 'Robert Garcia',
      company: 'Amazon',
      property: 'Highway Unipole',
      propertyCode: 'BAZ7321',
      designStatus: 'Uploaded',
      startDate: '2023-07-05',
      endDate: '2023-07-20',
      status: 'Installation on Process',
      amount: '$3,500'
    },
    {
      id: 'CMP-008',
      advertiser: 'Jennifer Martinez',
      company: 'Netflix',
      property: 'Downtown Digital Board',
      propertyCode: 'BAZ9567',
      designStatus: 'Requested for Design',
      startDate: '2023-08-05',
      endDate: '2023-08-20',
      status: 'Rejected',
      amount: '$2,900'
    }
  ];

  // Filter campaigns based on filters and search
  const filteredCampaigns: Campaign[] = campaigns.filter(campaign => {
    const matchesStatus = filterStatus === 'all' || campaign.status.includes(filterStatus);
    const matchesSearch = campaign.advertiser.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          campaign.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          campaign.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          campaign.propertyCode.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

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
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {icon} {status}
      </span>
    );
  };

  // Design status badge component
  const DesignStatusBadge: React.FC<{ status: string }> = ({ status }) => {
    let bgColor: string, textColor: string;
    
    if (status === 'Uploaded') {
      bgColor = 'bg-green-900/30';
      textColor = 'text-green-400';
    } else {
      bgColor = 'bg-yellow-900/30';
      textColor = 'text-yellow-400';
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Campaign List</h1>
        <p className="text-xs text-[var(--light-grey-color)]">All booked advertising campaigns</p>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-[var(--light-dark-color)] border border-[var(--light-blur-grey-color)] rounded-xl shadow-sm p-6"
      >
        {/* Header with filters and search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            {/* Search input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-4 w-4 text-[var(--light-grey-color)]" />
              </div>
              <input
                type="text"
                placeholder="Search campaigns..."
                className="pl-10 pr-4 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-[var(--puprle-color)] focus:border-transparent"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Status filter */}
            <div className="relative">
              <select
                className="appearance-none bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded-lg pl-3 pr-10 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[var(--puprle-color)] focus:border-transparent"
                value={filterStatus}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
                <option value="Approved">Approved</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Installation">Installation</option>
                <option value="Running">Running</option>
                <option value="Ended">Ended</option>
                <option value="Waiting">Waiting</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--light-grey-color)]">
                <FiChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>
          
          {/* Export button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center px-4 py-2 bg-[var(--puprle-color)] hover:bg-[var(--puprle-color)]/90 text-white rounded-lg text-xs font-medium transition-colors"
          >
            <FiDownload className="mr-2" /> Export CSV
          </motion.button>
        </div>
        
        {/* Campaigns Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-[var(--light-grey-color)] uppercase tracking-wider border-b border-[var(--light-blur-grey-color)]">
                <th className="px-4 py-3">Advertiser</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Property</th>
                <th className="px-4 py-3">Property Code</th>
                <th className="px-4 py-3">Design</th>
                <th className="px-4 py-3">Date Slot</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--light-blur-grey-color)]">
              {filteredCampaigns.length > 0 ? (
                filteredCampaigns.map(campaign => (
                  <tr key={campaign.id} className="hover:bg-[var(--dark-color)]/50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-indigo-900/30 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-indigo-400">
                            {campaign.advertiser.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-xs font-medium text-white">{campaign.advertiser}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-[var(--light-grey-color)]">{campaign.company}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-white">{campaign.property}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-[var(--light-grey-color)] font-mono">{campaign.propertyCode}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <DesignStatusBadge status={campaign.designStatus} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-xs text-[var(--light-grey-color)]">
                        <div>{new Date(campaign.startDate).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500">to {new Date(campaign.endDate).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-[var(--light-grey-color)]">{campaign.amount}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={campaign.status} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-xs">
                      <div className="flex items-center justify-end space-x-2">
                        <Link to="/bookings/campaigns-list/campaign-details" className="text-[var(--light-grey-color)] hover:text-white p-1 rounded-md hover:bg-[var(--dark-color)]">
                          <FiEye className="h-4 w-4" />
                        </Link>
                        {campaign.designStatus === 'Requested for Design' && (
                          <button className="text-[var(--light-grey-color)] hover:text-blue-400 p-1 rounded-md hover:bg-[var(--dark-color)]">
                            <FiEdit className="h-4 w-4" />
                          </button>
                        )}
                        {campaign.status.includes('Approved (Waiting') && (
                          <button className="text-[var(--light-grey-color)] hover:text-green-400 p-1 rounded-md hover:bg-[var(--dark-color)]">
                            <FiDollarSign className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-xs text-[var(--light-grey-color)]">
                    No campaigns found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 px-4">
          <div className="text-xs text-[var(--light-grey-color)]">
            Showing {filteredCampaigns.length} of {campaigns.length} campaigns
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-xs bg-[var(--dark-color)] text-[var(--light-grey-color)] rounded-md border border-[var(--light-blur-grey-color)] hover:bg-[var(--light-blur-grey-color)]/20">
              Previous
            </button>
            <button className="px-3 py-1 text-xs bg-[var(--puprle-color)] text-white rounded-md">
              1
            </button>
            <button className="px-3 py-1 text-xs bg-[var(--dark-color)] text-[var(--light-grey-color)] rounded-md border border-[var(--light-blur-grey-color)] hover:bg-[var(--light-blur-grey-color)]/20">
              Next
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CampaignList;