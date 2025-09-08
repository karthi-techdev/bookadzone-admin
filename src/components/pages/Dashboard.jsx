import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiGlobe, FiCalendar, FiCheckCircle, FiXCircle, FiClock, FiMapPin, FiDollarSign, FiPieChart, FiTrendingUp, FiUser, FiHome, FiBell, FiMessageSquare, FiFile, FiAlertCircle } from 'react-icons/fi';
import Chart from 'react-apexcharts';

const Dashboard = () => {
  const [profileCompletion, setProfileCompletion] = useState(75);
  const [kycStatus, setKycStatus] = useState('Approved');
  
  // Campaign Overview Chart Data
  const campaignOptions = {
    chart: {
      type: 'pie',
      height: 300,
      fontFamily: 'Lexend Variable, sans-serif',
    },
    labels: ['Active', 'Scheduled', 'Completed', 'Paused'],
    colors: ['#4F46E5', '#10B981', '#6366F1', '#F59E0B'],
    legend: {
      position: 'bottom',
      fontSize: '12px',
      labels: {
        colors: ['#98A9B8', '#98A9B8', '#98A9B8', '#98A9B8'],
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '10px',
      },
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };
  
  const campaignSeries = [12, 8, 15, 3];
  
  // Revenue Trends Chart Data
  const revenueOptions = {
    chart: {
      height: 300,
      type: 'line',
      fontFamily: 'Lexend Variable, sans-serif',
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    colors: ['#6366F1'],
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: {
        style: {
          fontSize: '10px',
          colors: '#98A9B8',
        },
      },
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return "$" + val + "k";
        },
        style: {
          fontSize: '10px',
          colors: '#98A9B8',
        },
      },
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 4,
    },
  };
  
  const revenueSeries = [{
    name: 'Revenue',
    data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 110, 120, 150]
  }];
  
  // Slot Occupancy Chart Data
  const slotOptions = {
    chart: {
      type: 'donut',
      height: 300,
      fontFamily: 'Lexend Variable, sans-serif',
    },
    labels: ['Booked', 'Available'],
    colors: ['#7F6AF7', '#7f6af766'],
    legend: {
      position: 'bottom',
      fontSize: '12px',
      labels: {
        colors: ['#98A9B8', '#98A9B8'],
      },
      fontFamily: 'Lexend Variable, sans-serif',
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '10px',
      },
      dropShadow: {
        enabled: false,
      }
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Slots',
              fontSize: '13px',
              fontWeight: '600',
              color: '#98A9B8',
            },
            value: {
              show: true,
              fontSize: '16px',
              fontWeight: '600',
              color: 'white',
            }
          }
        }
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };
  
  const slotSeries = [65, 35];
  
  // Mock data for lists and tables
  const advertisers = [
    { id: 1, name: 'John Smith', position: 'Marketing Head', company: 'Nike Inc.', category: 'Sports', location: 'New York', searching: true },
    { id: 2, name: 'Emma Johnson', position: 'Brand Manager', company: 'Coca Cola', category: 'Beverages', location: 'Atlanta', searching: true },
    { id: 3, name: 'Michael Lee', position: 'Media Buyer', company: 'Toyota', category: 'Automotive', location: 'Los Angeles', searching: false },
  ];
  
  const upcomingCampaigns = [
    { id: 1, advertiser: 'Nike Inc.', startDate: '2023-06-15', location: 'Times Square, NY', status: 'Scheduled' },
    { id: 2, advertiser: 'Apple Inc.', startDate: '2023-06-20', location: '5th Avenue, NY', status: 'Scheduled' },
    { id: 3, advertiser: 'Samsung Electronics', startDate: '2023-06-25', location: 'Downtown, LA', status: 'Scheduled' },
  ];
  
  const transactions = [
    { id: 1, advertiser: 'Nike Inc.', amount: '$2,500', date: '2023-05-15', status: 'Paid' },
    { id: 2, advertiser: 'Coca Cola', amount: '$1,800', date: '2023-05-18', status: 'Pending' },
    { id: 3, advertiser: 'Toyota', amount: '$3,200', date: '2023-05-20', status: 'Paid' },
    { id: 4, advertiser: 'Apple Inc.', amount: '$4,100', date: '2023-05-22', status: 'Paid' },
  ];
  
  const notifications = [
    { id: 1, type: 'booking', title: 'New Booking Request', description: 'Nike wants to book Times Square slot', time: '2 hours ago' },
    { id: 2, type: 'payment', title: 'Payment Received', description: 'Payment of $2,500 received from Nike', time: '5 hours ago' },
    { id: 3, type: 'campaign', title: 'Campaign Ended', description: 'Coca Cola campaign ended successfully', time: '1 day ago' },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-[var(--light-grey-color)]">Welcome to the dashboard</p>
      </div>
      
      {/* Main Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Row 1: Profile Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="col-span-12 bg-[var(--light-dark-color)] border border-[var(--light-blur-grey-color)] rounded-xl shadow-sm p-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Agency Profile</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-medium mt-2 md:mt-0 ${
              kycStatus === 'Approved' ? 'bg-green-900/30 text-green-400' : 
              kycStatus === 'Pending' ? 'bg-yellow-900/30 text-yellow-400' : 
              'bg-red-900/30 text-red-400'
            }`}>
              KYC: {kycStatus}
            </span>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-[var(--light-grey-color)]">Profile Completion</span>
              <span className="text-xs font-medium text-[var(--puprle-color)]">{profileCompletion}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-[var(--puprle-color)] h-2 rounded-full transition-all duration-300" 
                style={{ width: `${profileCompletion}%` }}
              ></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center text-xs text-[var(--light-grey-color)]">
                <FiHome className="mr-2" />
                <span>Agency Name: Creative Ads Inc.</span>
              </div>
              <div className="flex items-center text-xs text-[var(--light-grey-color)]">
                <FiGlobe className="mr-2" />
                <span>Website: www.creativeads.com</span>
              </div>
              <div className="flex items-center text-xs text-[var(--light-grey-color)]">
                <FiDollarSign className="mr-2" />
                <span>GSTIN: 2AABCU9603R1Z2</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-xs text-[var(--light-grey-color)]">
                <FiCalendar className="mr-2" />
                <span>Joined: Jan 15, 2020</span>
              </div>
              <div className="flex items-center text-xs text-[var(--light-grey-color)]">
                <FiPhone className="mr-2" />
                <span>Phone: +1 (555) 123-4567</span>
              </div>
              <div className="flex items-center text-xs text-[var(--light-grey-color)]">
                <FiMail className="mr-2" />
                <span>Email: contact@creativeads.com</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-[var(--light-blur-grey-color)]">
            <p className="text-xs text-[var(--light-grey-color)]">
              "We create impactful advertising solutions that drive results."
            </p>
            <p className="text-xs text-[var(--light-grey-color)] mt-2">
              123 Advertising Ave, New York, NY 10001, United States
            </p>
          </div>
        </motion.div>

        {/* Row 2: Charts */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Campaign Overview */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-[var(--light-dark-color)] border border-[var(--light-blur-grey-color)] rounded-xl shadow-sm p-4"
          >
            <h3 className="text-xs font-semibold text-[var(--light-grey-color)] mb-4 flex items-center">
              <FiPieChart className="mr-2" /> Campaign Overview
            </h3>
            <Chart 
              options={campaignOptions} 
              series={campaignSeries} 
              type="pie" 
              height={300} 
            />
          </motion.div>
          
          {/* Revenue Trends */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-[var(--light-dark-color)] border border-[var(--light-blur-grey-color)] rounded-xl shadow-sm p-4"
          >
            <h3 className="text-xs font-semibold text-[var(--light-grey-color)] mb-4 flex items-center">
              <FiTrendingUp className="mr-2" /> Revenue Trends
            </h3>
            <Chart 
              options={revenueOptions} 
              series={revenueSeries} 
              type="line" 
              height={300} 
            />
          </motion.div>
        </div>

        {/* Row 3: Advertisers and Slot Occupancy */}
        <div className="col-span-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Advertisers List */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="lg:col-span-2 bg-[var(--light-dark-color)] border border-[var(--light-blur-grey-color)] rounded-xl shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Advertisers You May Reach Out</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-[var(--light-grey-color)] uppercase tracking-wider border-b border-[var(--light-blur-grey-color)]">
                    <th className="px-4 py-3">Advertiser</th>
                    <th className="px-4 py-3">Company</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--light-blur-grey-color)]">
                  {advertisers.map(advertiser => (
                    <tr key={advertiser.id} className="hover:bg-[var(--dark-color)]/50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-indigo-900/30 rounded-full flex items-center justify-center">
                            <FiUser className="h-5 w-5 text-indigo-400" />
                          </div>
                          <div className="ml-4">
                            <div className="text-xs font-medium text-white">{advertiser.name}</div>
                            <div className="text-xs text-[var(--light-grey-color)]">{advertiser.position}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-white">{advertiser.company}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-white">{advertiser.category}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-white">{advertiser.location}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          advertiser.searching ? 'bg-green-900/30 text-green-400' : 'bg-gray-700 text-gray-400'
                        }`}>
                          {advertiser.searching ? 'Searching' : 'Not Searching'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-xs">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="text-[var(--light-grey-color)] hover:text-white p-1 rounded-md hover:bg-[var(--dark-color)]">
                            <FiPhone className="h-4 w-4" />
                          </button>
                          <button className="text-[var(--light-grey-color)] hover:text-white p-1 rounded-md hover:bg-[var(--dark-color)]">
                            <FiMail className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
          
          {/* Slot Occupancy */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-[var(--light-dark-color)] border border-[var(--light-blur-grey-color)] rounded-xl shadow-sm p-4"
          >
            <h3 className="text-xs font-semibold text-[var(--light-grey-color)] mb-4">Slot Occupancy Rate</h3>
            <Chart 
              options={slotOptions} 
              series={slotSeries} 
              type="donut" 
              height={300} 
            />
          </motion.div>
        </div>

        {/* Row 4: Notifications, Upcoming Campaigns, and Transactions */}
        <div className="col-span-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notifications */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="bg-[var(--light-dark-color)] border border-[var(--light-blur-grey-color)] rounded-xl shadow-sm p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">Notifications</h2>
              <span className="bg-[var(--puprle-color)] text-white text-xs px-2 py-1 rounded-full">3 New</span>
            </div>
            
            <div className="space-y-4">
              {notifications.map(notification => (
                <div key={notification.id} className="flex items-start p-3 bg-[var(--dark-color)] rounded-lg">
                  <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                    notification.type === 'booking' ? 'bg-blue-900/30' : 
                    notification.type === 'payment' ? 'bg-green-900/30' : 
                    'bg-purple-900/30'
                  }`}>
                    {notification.type === 'booking' ? <FiFile className="h-5 w-5 text-blue-400" /> : 
                     notification.type === 'payment' ? <FiDollarSign className="h-5 w-5 text-green-400" /> : 
                     <FiAlertCircle className="h-5 w-5 text-purple-400" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-white">{notification.title}</p>
                    <p className="text-xs text-[var(--light-grey-color)]">{notification.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="mt-4 text-xs text-[var(--puprle-color)] hover:text-[var(--puprle-color)]/90 font-medium">
              View All Notifications
            </button>
          </motion.div>
          
          {/* Upcoming Campaigns */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            className="bg-[var(--light-dark-color)] border border-[var(--light-blur-grey-color)] rounded-xl shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Upcoming Campaigns</h2>
            
            <div className="space-y-4">
              {upcomingCampaigns.map(campaign => (
                <div key={campaign.id} className="flex items-center justify-between p-3 bg-[var(--dark-color)] rounded-lg">
                  <div>
                    <p className="text-xs font-medium text-white">{campaign.advertiser}</p>
                    <div className="flex items-center text-xs text-[var(--light-grey-color)] mt-1">
                      <FiCalendar className="mr-1" />
                      <span>{campaign.startDate}</span>
                      <FiMapPin className="ml-3 mr-1" />
                      <span>{campaign.location}</span>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-blue-900/30 text-blue-400 rounded-full">
                    {campaign.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Recent Transactions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
            className="bg-[var(--light-dark-color)] border border-[var(--light-blur-grey-color)] rounded-xl shadow-sm p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Recent Transactions</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-[var(--light-grey-color)] uppercase tracking-wider border-b border-[var(--light-blur-grey-color)]">
                    <th className="px-4 py-3">Advertiser</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--light-blur-grey-color)]">
                  {transactions.map(transaction => (
                    <tr key={transaction.id} className="hover:bg-[var(--dark-color)]/50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-xs font-medium text-white">{transaction.advertiser}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-white">{transaction.amount}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-[var(--light-grey-color)]">{transaction.date}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.status === 'Paid' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'
                        }`}>
                          {transaction.status === 'Paid' ? (
                            <FiCheckCircle className="mr-1" />
                          ) : (
                            <FiClock className="mr-1" />
                          )}
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Row 5: Map Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="col-span-12 bg-[var(--light-dark-color)] border border-[var(--light-blur-grey-color)] rounded-xl shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Slot Distribution Map</h2>
          
          <div className="bg-[var(--dark-color)] rounded-lg h-64 flex items-center justify-center">
            <div className="text-center">
              <FiMapPin className="h-12 w-12 text-[var(--light-grey-color)] mx-auto" />
              <p className="mt-2 text-xs text-[var(--light-grey-color)]">Map visualization will be implemented here</p>
              <p className="text-xs text-gray-500">(Development in progress)</p>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-xs text-[var(--light-grey-color)]">Booked</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-xs text-[var(--light-grey-color)]">Available</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;