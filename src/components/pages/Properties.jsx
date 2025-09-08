import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiSearch, 
  FiPlus, 
  FiFilter, 
  FiEye, 
  FiEdit, 
  FiTrash2,
  FiChevronDown,
  FiCheckCircle,
  FiXCircle,
  FiClock
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Properties = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample properties data
  const properties = [
    {
      id: 'PRP-001',
      name: 'Times Square Billboard',
      category: 'Billboard',
      location: 'Times Square, NY',
      status: 'Verified',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'PRP-002',
      name: 'Downtown Hoarding',
      category: 'Hoarding',
      location: 'Downtown, LA',
      status: 'Pending',
      image: 'https://images.unsplash.com/photo-1503387762353-8c6637f89308?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'PRP-003',
      name: 'Highway Unipole',
      category: 'Unipole',
      location: 'I-95, NJ',
      status: 'Rejected',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'PRP-004',
      name: 'Airport Digital Billboard',
      category: 'Digital Billboard',
      location: 'JFK Airport, NY',
      status: 'Verified',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'PRP-005',
      name: 'Shopping Mall Banner',
      category: 'Banner',
      location: 'Westfield Mall, CA',
      status: 'Pending',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
    }
  ];

  // Filter properties based on filters and search
  const filteredProperties = properties.filter(property => {
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || property.category === filterCategory;
    const matchesSearch = property.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          property.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesCategory && matchesSearch;
  });

  // Status badge component
  const StatusBadge = ({ status }) => {
    let bgColor, textColor, icon;
    
    switch(status) {
      case 'Verified':
        bgColor = 'bg-green-900/30';
        textColor = 'text-green-400';
        icon = <FiCheckCircle className="mr-1" />;
        break;
      case 'Pending':
        bgColor = 'bg-yellow-900/30';
        textColor = 'text-yellow-400';
        icon = <FiClock className="mr-1" />;
        break;
      case 'Rejected':
        bgColor = 'bg-red-900/30';
        textColor = 'text-red-400';
        icon = <FiXCircle className="mr-1" />;
        break;
      default:
        bgColor = 'bg-gray-900/30';
        textColor = 'text-gray-400';
    }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {icon} {status}
      </span>
    );
  };

  return (
    <section className="properties-section">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Properties</h1>
        <p className="text-sm text-[var(--light-grey-color)]">Welcome to the Properties listing</p>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-[var(--light-dark-color)] border border-[var(--light-blur-grey-color)] rounded-xl shadow-sm p-6"
      >
        {/* Header with filters and actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            {/* Search input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-4 w-4 text-[var(--light-grey-color)]" />
              </div>
              <input
                type="text"
                placeholder="Search properties..."
                className="pl-10 pr-4 py-2 bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--puprle-color)] focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Status filter */}
            <div className="relative">
              <select
                className="appearance-none bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded-lg pl-3 pr-10 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--puprle-color)] focus:border-transparent"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Verified">Verified</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--light-grey-color)]">
                <FiChevronDown className="h-4 w-4" />
              </div>
            </div>
            
            {/* Category filter */}
            <div className="relative">
              <select
                className="appearance-none bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded-lg pl-3 pr-10 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[var(--puprle-color)] focus:border-transparent"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="Billboard">Billboard</option>
                <option value="Hoarding">Hoarding</option>
                <option value="Unipole">Unipole</option>
                <option value="Digital Billboard">Digital Billboard</option>
                <option value="Banner">Banner</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--light-grey-color)]">
                <FiChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>
          
          {/* Add Property Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link to='/listings/properties/add-property' className="flex items-center px-4 py-2 bg-[var(--puprle-color)] hover:bg-[var(--puprle-color)]/90 text-white rounded-lg text-sm font-medium transition-colors"> 
             <FiPlus className="mr-2" /> Add Property
            </Link>
          </motion.div>
        </div>
        
        {/* Properties Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-[var(--light-grey-color)] uppercase tracking-wider border-b border-[var(--light-blur-grey-color)]">
                <th className="px-4 py-3">Property</th>
                <th className="px-4 py-3">Property ID</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--light-blur-grey-color)]">
              {filteredProperties.length > 0 ? (
                filteredProperties.map(property => (
                  <tr key={property.id} className="hover:bg-[var(--dark-color)]/50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden">
                          <img className="h-10 w-10 object-cover" src={property.image} alt={property.name} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{property.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[var(--light-grey-color)]">{property.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[var(--light-grey-color)]">{property.category}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-[var(--light-grey-color)]">{property.location}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={property.status} />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-[var(--light-grey-color)] hover:text-white p-1 rounded-md hover:bg-[var(--dark-color)]">
                          <FiEye className="h-4 w-4" />
                        </button>
                        <button className="text-[var(--light-grey-color)] hover:text-blue-400 p-1 rounded-md hover:bg-[var(--dark-color)]">
                          <FiEdit className="h-4 w-4" />
                        </button>
                        <button className="text-[var(--light-grey-color)] hover:text-red-400 p-1 rounded-md hover:bg-[var(--dark-color)]">
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-sm text-[var(--light-grey-color)]">
                    No properties found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination (optional) */}
        <div className="flex items-center justify-between mt-6 px-4">
          <div className="text-xs text-[var(--light-grey-color)]">
            Showing {filteredProperties.length} of {properties.length} properties
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
    </section>
  );
};

export default Properties;