import { motion } from "framer-motion";
import { FiUpload, FiCheckCircle, FiAlertCircle, FiClock, FiMail, FiPhone, FiMapPin, FiGlobe, FiLink, FiDollarSign, FiCalendar, FiSearch, FiMessageSquare, FiBell, FiBarChart2, FiUser, FiPieChart, FiFileText } from "react-icons/fi";
import Chart from "react-apexcharts";
import { useState } from "react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Chart data with dark theme
  const campaignData = {
    series: [35, 15, 25, 10],
    options: {
      chart: {
        type: 'donut',
        background: 'transparent',
        foreColor: 'var(--light-grey-color)'
      },
      labels: ['Active', 'Scheduled', 'Completed', 'Paused'],
      colors: ['var(--puprle-color)', '#F59E0B', '#10B981', '#EF4444'],
      legend: {
        labels: {
          colors: 'var(--light-grey-color)'
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
    },
  };

  const revenueData = {
    series: [{
      name: 'Revenue',
      data: [30000, 40000, 35000, 50000, 49000, 60000, 70000, 75000, 80000, 85000, 90000, 95000]
    }],
    options: {
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        },
        background: 'transparent',
        foreColor: 'var(--light-grey-color)'
      },
      colors: ['var(--puprle-color)'],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      grid: {
        borderColor: 'var(--white-glass-color)'
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        labels: {
          style: {
            colors: 'var(--light-grey-color)'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: 'var(--light-grey-color)'
          },
          formatter: function (val) {
            return "$" + val.toLocaleString()
          }
        }
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "$" + val.toLocaleString()
          }
        }
      }
    },
  };

  const slotData = {
    series: [75, 25],
    options: {
      chart: {
        type: 'donut',
        background: 'transparent',
        foreColor: 'var(--light-grey-color)'
      },
      labels: ['Booked', 'Available'],
      colors: ['var(--puprle-color)', 'var(--white-glass-color)'],
      legend: {
        labels: {
          colors: 'var(--light-grey-color)'
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
    },
  };

  // Sample data
  const advertisers = [
    { name: "John Smith", position: "Marketing Head", company: "Nike", category: "Sports", location: "New York", active: true },
    { name: "Sarah Johnson", position: "Brand Manager", company: "Coca-Cola", category: "Beverages", location: "Atlanta", active: true },
    { name: "Michael Chen", position: "Digital Director", company: "Samsung", category: "Electronics", location: "Seoul", active: false },
    { name: "Emma Wilson", position: "Media Buyer", company: "L'Oréal", category: "Beauty", location: "Paris", active: true },
  ];

  const campaigns = [
    { id: 1, advertiser: "Nike", startDate: "2023-06-15", endDate: "2023-07-15", location: "Times Square, NY", budget: "$15,000", status: "Scheduled" },
    { id: 2, advertiser: "Coca-Cola", startDate: "2023-06-20", endDate: "2023-07-20", location: "Main Street, ATL", budget: "$12,000", status: "Scheduled" },
    { id: 3, advertiser: "Samsung", startDate: "2023-07-01", endDate: "2023-08-01", location: "Gangnam, Seoul", budget: "$18,000", status: "Scheduled" },
  ];

  const allCampaigns = [
    ...campaigns,
    { id: 4, advertiser: "Adidas", startDate: "2023-05-01", endDate: "2023-06-01", location: "Los Angeles, CA", budget: "$14,000", status: "Completed" },
    { id: 5, advertiser: "Apple", startDate: "2023-05-10", endDate: "2023-06-10", location: "San Francisco, CA", budget: "$20,000", status: "Completed" },
    { id: 6, advertiser: "Amazon", startDate: "2023-06-05", endDate: "2023-07-05", location: "Seattle, WA", budget: "$16,000", status: "Active" },
    { id: 7, advertiser: "Microsoft", startDate: "2023-07-10", endDate: "2023-08-10", location: "Redmond, WA", budget: "$17,000", status: "Pending" },
  ];

  const transactions = [
    { id: 1, advertiser: "Nike", amount: 15000, date: "2023-05-15", status: "Paid", method: "Bank Transfer" },
    { id: 2, advertiser: "Coca-Cola", amount: 12000, date: "2023-05-10", status: "Paid", method: "Credit Card" },
    { id: 3, advertiser: "Samsung", amount: 18000, date: "2023-05-05", status: "Pending", method: "Bank Transfer" },
    { id: 4, advertiser: "L'Oréal", amount: 9000, date: "2023-04-28", status: "Paid", method: "PayPal" },
    { id: 5, advertiser: "Adidas", amount: 14000, date: "2023-04-20", status: "Paid", method: "Credit Card" },
    { id: 6, advertiser: "Apple", amount: 20000, date: "2023-04-15", status: "Paid", method: "Bank Transfer" },
  ];

  const reports = [
    { id: 1, title: "Monthly Revenue Report", date: "June 2023", type: "Revenue", status: "Generated" },
    { id: 2, title: "Campaign Performance Q2", date: "July 2023", type: "Performance", status: "Pending" },
    { id: 3, title: "Advertiser Engagement", date: "May 2023", type: "Engagement", status: "Generated" },
    { id: 4, title: "Slot Utilization", date: "June 2023", type: "Utilization", status: "Generated" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-4 md:p-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--white-color)]">Dashboard</h1>
          <p className="text-[var(--light-grey-color)]">Welcome back, Agency Name</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--light-grey-color)]" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-10 pr-4 py-2 bg-[var(--light-dark-color)] border border-[var(--white-glass-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--puprle-color)] focus:border-transparent text-[var(--white-color)] placeholder-[var(--light-grey-color)]"
            />
          </div>
          <button className="p-2 bg-[var(--light-dark-color)] rounded-lg border border-[var(--white-glass-color)] hover:bg-[var(--light-dark-color)] relative">
            <FiMessageSquare className="text-[var(--light-grey-color)]" />
            <span className="absolute -top-1 -right-1 bg-[var(--puprle-color)] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
          </button>
          <button className="p-2 bg-[var(--light-dark-color)] rounded-lg border border-[var(--white-glass-color)] hover:bg-[var(--light-dark-color)] relative">
            <FiBell className="text-[var(--light-grey-color)]" />
            <span className="absolute -top-1 -right-1 bg-[var(--puprle-color)] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">5</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--white-glass-color)] mb-6">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 font-medium text-sm ${activeTab === "overview" ? "text-[var(--puprle-color)] border-b-2 border-[var(--puprle-color)]" : "text-[var(--light-grey-color)] hover:text-[var(--white-color)]"}`}
        >
          <FiBarChart2 className="inline mr-2" /> Overview
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 font-medium text-sm ${activeTab === "profile" ? "text-[var(--puprle-color)] border-b-2 border-[var(--puprle-color)]" : "text-[var(--light-grey-color)] hover:text-[var(--white-color)]"}`}
        >
          <FiUser className="inline mr-2" /> Agency Profile
        </button>
        <button
          onClick={() => setActiveTab("campaigns")}
          className={`px-4 py-2 font-medium text-sm ${activeTab === "campaigns" ? "text-[var(--puprle-color)] border-b-2 border-[var(--puprle-color)]" : "text-[var(--light-grey-color)] hover:text-[var(--white-color)]"}`}
        >
          <FiPieChart className="inline mr-2" /> Campaigns
        </button>
        <button
          onClick={() => setActiveTab("reports")}
          className={`px-4 py-2 font-medium text-sm ${activeTab === "reports" ? "text-[var(--puprle-color)] border-b-2 border-[var(--puprle-color)]" : "text-[var(--light-grey-color)] hover:text-[var(--white-color)]"}`}
        >
          <FiFileText className="inline mr-2" /> Reports
        </button>
      </div>

      {/* Profile Section */}
      {activeTab === "profile" && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-[var(--light-dark-color)] backdrop-blur-lg rounded-xl border border-[var(--white-glass-color)] p-6 mb-6"
        >
          <h2 className="text-xl font-semibold text-[var(--white-color)] mb-6">Agency Profile</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="flex flex-col items-center">
                <div className="h-32 w-32 rounded-full bg-[var(--light-purple-color)] mb-4 flex items-center justify-center overflow-hidden">
                  <span className="text-4xl text-[var(--puprle-color)]">AL</span>
                </div>
                <h3 className="text-xl font-semibold text-[var(--white-color)]">Agency Logo</h3>
                <button className="mt-2 flex items-center text-sm text-[var(--puprle-color)] hover:text-[var(--white-color)]">
                  <FiUpload className="mr-1" /> Upload Logo
                </button>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium text-[var(--white-color)] mb-2">Profile Completion</h4>
                <div className="w-full bg-[var(--white-glass-color)] rounded-full h-2.5">
                  <div className="bg-[var(--puprle-color)] h-2.5 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <p className="text-sm text-[var(--light-grey-color)] mt-1">75% complete</p>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium text-[var(--white-color)] mb-2">KYC Status</h4>
                <div className="flex items-center">
                  <FiCheckCircle className="text-green-500 mr-2" />
                  <span className="text-sm font-medium text-[var(--white-color)]">Verified</span>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium text-[var(--white-color)] mb-2">Documents</h4>
                <button className="w-full flex items-center justify-between py-2 px-3 border border-[var(--white-glass-color)] rounded-lg mb-2 hover:bg-[var(--light-dark-color)] text-[var(--white-color)]">
                  <span className="text-sm">Business License</span>
                  <FiUpload className="text-[var(--light-grey-color)]" />
                </button>
                <button className="w-full flex items-center justify-between py-2 px-3 border border-[var(--white-glass-color)] rounded-lg mb-2 hover:bg-[var(--light-dark-color)] text-[var(--white-color)]">
                  <span className="text-sm">Identity Proof</span>
                  <FiUpload className="text-[var(--light-grey-color)]" />
                </button>
                <button className="w-full flex items-center justify-between py-2 px-3 border border-[var(--white-glass-color)] rounded-lg hover:bg-[var(--light-dark-color)] text-[var(--white-color)]">
                  <span className="text-sm">Agreement</span>
                  <FiUpload className="text-[var(--light-grey-color)]" />
                </button>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[.78rem] font-medium text-[var(--light-grey-color)] mb-1">Agency Name</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 bg-[var(--light-dark-color)] border border-[var(--white-glass-color)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--puprle-color)] focus:border-transparent text-[var(--white-color)]" 
                    value="AdvertisePro" 
                  />
                </div>
                <div>
                  <label className="block text-[.78rem] font-medium text-[var(--light-grey-color)] mb-1">Slogan/Tagline</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 bg-[var(--light-dark-color)] border border-[var(--white-glass-color)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--puprle-color)] focus:border-transparent text-[var(--white-color)]" 
                    value="Your Vision, Our Media" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[.78rem] font-medium text-[var(--light-grey-color)] mb-1">About / Description</label>
                  <textarea 
                    rows={3} 
                    className="w-full px-3 py-2 bg-[var(--light-dark-color)] border border-[var(--white-glass-color)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--puprle-color)] focus:border-transparent text-[var(--white-color)]"
                  >
                    We specialize in outdoor advertising with prime locations across major cities. Our team delivers creative solutions to maximize your brand visibility.
                  </textarea>
                </div>
                <div>
                  <label className="block text-[.78rem] font-medium text-[var(--light-grey-color)] mb-1">GSTIN Number</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 bg-[var(--light-dark-color)] border border-[var(--white-glass-color)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--puprle-color)] focus:border-transparent text-[var(--white-color)]" 
                    value="22ABCDE1234F1Z5" 
                  />
                </div>
                <div>
                  <label className="block text-[.78rem] font-medium text-[var(--light-grey-color)] mb-1">Date Joined</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 bg-[var(--light-dark-color)] border border-[var(--white-glass-color)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--puprle-color)] focus:border-transparent text-[var(--light-grey-color)]" 
                    value="January 15, 2020" 
                    disabled 
                  />
                </div>
                <div>
                  <label className="block text-[.78rem] font-medium text-[var(--light-grey-color)] mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    className="w-full px-3 py-2 bg-[var(--light-dark-color)] border border-[var(--white-glass-color)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--puprle-color)] focus:border-transparent text-[var(--white-color)]" 
                    value="+1 (555) 123-4567" 
                  />
                </div>
                <div>
                  <label className="block text-[.78rem] font-medium text-[var(--light-grey-color)] mb-1">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-3 py-2 bg-[var(--light-dark-color)] border border-[var(--white-glass-color)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--puprle-color)] focus:border-transparent text-[var(--white-color)]" 
                    value="contact@advertisepro.com" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[.78rem] font-medium text-[var(--light-grey-color)] mb-1">Physical Address</label>
                  <textarea 
                    rows={2} 
                    className="w-full px-3 py-2 bg-[var(--light-dark-color)] border border-[var(--white-glass-color)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--puprle-color)] focus:border-transparent text-[var(--white-color)]"
                  >
                    123 Advertising Ave, Suite 400, New York, NY 10001
                  </textarea>
                </div>
                <div>
                  <label className="block text-[.78rem] font-medium text-[var(--light-grey-color)] mb-1">Website URL</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-[var(--white-glass-color)] bg-[var(--light-dark-color)] text-[var(--light-grey-color)] text-sm">
                      <FiGlobe className="mr-1" /> https://
                    </span>
                    <input 
                      type="text" 
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-[var(--white-glass-color)] bg-[var(--light-dark-color)] focus:outline-none focus:ring-2 focus:ring-[var(--puprle-color)] focus:border-transparent text-[var(--white-color)]" 
                      value="advertisepro.com" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--light-grey-color)] mb-1">Social Links</label>
                  <div className="flex space-x-2">
                    <button className="p-2 bg-[var(--light-dark-color)] rounded-lg hover:bg-[var(--light-purple-color)] border border-[var(--white-glass-color)]">
                      <FiLink className="text-[var(--light-grey-color)] hover:text-[var(--puprle-color)]" />
                    </button>
                    <button className="p-2 bg-[var(--light-dark-color)] rounded-lg hover:bg-[var(--light-purple-color)] border border-[var(--white-glass-color)]">
                      <FiLink className="text-[var(--light-grey-color)] hover:text-[var(--puprle-color)]" />
                    </button>
                    <button className="p-2 bg-[var(--light-dark-color)] rounded-lg hover:bg-[var(--light-purple-color)] border border-[var(--white-glass-color)]">
                      <FiLink className="text-[var(--light-grey-color)] hover:text-[var(--puprle-color)]" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--puprle-color)] hover:bg-[var(--light-purple-color)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--puprle-color)]">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Overview Section */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-[var(--light-dark-color)] backdrop-blur-lg p-6 rounded-xl border border-[var(--white-glass-color)] border-l-4 border-[var(--puprle-color)]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--light-grey-color)]">Total Revenue</p>
                  <p className="text-2xl font-semibold text-[var(--white-color)] mt-1">$248,500</p>
                </div>
                <div className="p-3 rounded-full bg-[var(--light-purple-color)] text-[var(--puprle-color)]">
                  <FiDollarSign size={20} />
                </div>
              </div>
              <p className="text-sm text-green-400 mt-2">+12.5% from last month</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-[var(--light-dark-color)] backdrop-blur-lg p-6 rounded-xl border border-[var(--white-glass-color)] border-l-4 border-blue-400"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--light-grey-color)]">Active Campaigns</p>
                  <p className="text-2xl font-semibold text-[var(--white-color)] mt-1">35</p>
                </div>
                <div className="p-3 rounded-full bg-blue-900/30 text-blue-400">
                  <FiCheckCircle size={20} />
                </div>
              </div>
              <p className="text-sm text-green-400 mt-2">+5 from last week</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-[var(--light-dark-color)] backdrop-blur-lg p-6 rounded-xl border border-[var(--white-glass-color)] border-l-4 border-yellow-400"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--light-grey-color)]">Pending Requests</p>
                  <p className="text-2xl font-semibold text-[var(--white-color)] mt-1">12</p>
                </div>
                <div className="p-3 rounded-full bg-yellow-900/30 text-yellow-400">
                  <FiClock size={20} />
                </div>
              </div>
              <p className="text-sm text-red-400 mt-2">+2 from yesterday</p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-[var(--light-dark-color)] backdrop-blur-lg p-6 rounded-xl border border-[var(--white-glass-color)] border-l-4 border-green-400"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--light-grey-color)]">Slot Occupancy</p>
                  <p className="text-2xl font-semibold text-[var(--white-color)] mt-1">75%</p>
                </div>
                <div className="p-3 rounded-full bg-green-900/30 text-green-400">
                  <FiMapPin size={20} />
                </div>
              </div>
              <p className="text-sm text-green-400 mt-2">+8% from last month</p>
            </motion.div>
          </div>
          
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[var(--light-dark-color)] backdrop-blur-lg p-6 rounded-xl border border-[var(--white-glass-color)]"
            >
              <h3 className="text-lg font-semibold text-[var(--white-color)] mb-4">Campaign Overview</h3>
              <Chart 
                options={campaignData.options} 
                series={campaignData.series} 
                type="donut" 
                height={300}
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[var(--light-dark-color)] backdrop-blur-lg p-6 rounded-xl border border-[var(--white-glass-color)] lg:col-span-2"
            >
              <h3 className="text-lg font-semibold text-[var(--white-color)] mb-4">Revenue Trends</h3>
              <Chart 
                options={revenueData.options} 
                series={revenueData.series} 
                type="line" 
                height={300}
              />
            </motion.div>
          </div>
          
          {/* Advertisers and Campaigns Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[var(--light-dark-color)] backdrop-blur-lg p-6 rounded-xl border border-[var(--white-glass-color)]"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[var(--white-color)]">Advertisers May Reach Out</h3>
                <button className="text-sm text-[var(--puprle-color)] hover:text-[var(--white-color)]">View All</button>
              </div>
              <div className="space-y-4">
                {advertisers.map((advertiser, index) => (
                  <div key={index} className="flex items-start p-3 hover:bg-[var(--light-dark-color)] rounded-lg transition-colors border border-[var(--white-glass-color)]">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[var(--light-purple-color)] flex items-center justify-center text-[var(--puprle-color)] font-medium mr-3">
                      {advertiser.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--white-color)] truncate">{advertiser.name}</p>
                      <p className="text-xs text-[var(--light-grey-color)] truncate">{advertiser.position} • {advertiser.company}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-900/30 text-blue-400">{advertiser.category}</span>
                        <span className="px-2 py-1 text-xs rounded-full bg-[var(--white-glass-color)] text-[var(--light-grey-color)] flex items-center">
                          <FiMapPin className="mr-1" size={12} /> {advertiser.location}
                        </span>
                        {advertiser.active && (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-900/30 text-green-400">Actively Searching</span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-[var(--light-grey-color)] hover:text-[var(--puprle-color)] hover:bg-[var(--light-purple-color)] rounded-full">
                        <FiPhone size={16} />
                      </button>
                      <button className="p-2 text-[var(--light-grey-color)] hover:text-[var(--puprle-color)] hover:bg-[var(--light-purple-color)] rounded-full">
                        <FiMail size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[var(--light-dark-color)] backdrop-blur-lg p-6 rounded-xl border border-[var(--white-glass-color)]"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[var(--white-color)]">Upcoming Campaigns</h3>
                <button className="text-sm text-[var(--puprle-color)] hover:text-[var(--white-color)]">View All</button>
              </div>
              <div className="space-y-4">
                {campaigns.map((campaign, index) => (
                  <div key={index} className="p-4 border border-[var(--white-glass-color)] rounded-lg hover:border-[var(--puprle-color)] transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-[var(--white-color)]">{campaign.advertiser}</p>
                        <p className="text-[.78rem] text-[var(--light-grey-color)] mt-1 flex items-center">
                          <FiCalendar className="mr-1" size={14} /> Starts {campaign.startDate}
                        </p>
                        <p className="text-[.78rem] text-[var(--light-grey-color)] mt-1 flex items-center">
                          <FiMapPin className="mr-1" size={14} /> {campaign.location}
                        </p>
                      </div>
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-900/30 text-yellow-400">
                        {campaign.status}
                      </span>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <button className="text-sm text-[var(--puprle-color)] hover:text-[var(--white-color)]">View Details</button>
                      <div className="flex space-x-2">
                        <button className="p-1 text-[var(--light-grey-color)] hover:text-[var(--puprle-color)] hover:bg-[var(--light-purple-color)] rounded-full">
                          <FiPhone size={14} />
                        </button>
                        <button className="p-1 text-[var(--light-grey-color)] hover:text-[var(--puprle-color)] hover:bg-[var(--light-purple-color)] rounded-full">
                          <FiMail size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Transactions and Slot Map Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-[var(--light-dark-color)] backdrop-blur-lg p-6 rounded-xl border border-[var(--white-glass-color)]"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[var(--white-color)]">Recent Transactions</h3>
                <button className="text-sm text-[var(--puprle-color)] hover:text-[var(--white-color)]">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[var(--white-glass-color)]">
                  <thead className="bg-[var(--light-dark-color)]">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--light-grey-color)] uppercase tracking-wider">Advertiser</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--light-grey-color)] uppercase tracking-wider">Amount</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--light-grey-color)] uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--light-grey-color)] uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-[var(--light-dark-color)] divide-y divide-[var(--white-glass-color)]">
                    {transactions.slice(0, 4).map((transaction, index) => (
                      <tr key={index} className="hover:bg-[var(--light-dark-color)]">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--white-color)]">{transaction.advertiser}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--light-grey-color)]">${transaction.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--light-grey-color)]">{transaction.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            transaction.status === 'Paid' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'
                          }`}>
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-[var(--light-dark-color)] backdrop-blur-lg p-6 rounded-xl border border-[var(--white-glass-color)]"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[var(--white-color)]">Slot Distribution Map</h3>
                <div className="flex space-x-2">
                  <button className="text-sm flex items-center text-[var(--light-grey-color)] hover:text-[var(--white-color)]">
                    <span className="w-2 h-2 rounded-full bg-green-400 mr-1"></span> Booked
                  </button>
                  <button className="text-sm flex items-center text-[var(--light-grey-color)] hover:text-[var(--white-color)]">
                    <span className="w-2 h-2 rounded-full bg-blue-400 mr-1"></span> Available
                  </button>
                </div>
              </div>
              <div className="bg-[var(--light-dark-color)] rounded-lg overflow-hidden h-64 flex items-center justify-center border border-[var(--white-glass-color)]">
                <div className="text-center p-4">
                  <FiMapPin size={48} className="mx-auto text-[var(--light-grey-color)] mb-3" />
                  <p className="text-[var(--light-grey-color)]">Map visualization will be implemented here</p>
                  <p className="text-sm text-[var(--light-blur-grey-color)] mt-1">Showing slot distribution with markers</p>
                </div>
              </div>
              <div className="mt-4">
                <Chart 
                  options={slotData.options} 
                  series={slotData.series} 
                  type="donut" 
                  height={150}
                />
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Campaigns Section */}
      {activeTab === "campaigns" && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Campaign Filters */}
          <div className="bg-[var(--light-dark-color)] backdrop-blur-lg p-6 rounded-xl border border-[var(--white-glass-color)]">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-[.78rem] font-medium text-[var(--light-grey-color)] mb-1">Status</label>
                <select className="w-full px-3 py-2 bg-[var(--light-dark-color)] border border-[var(--white-glass-color)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--puprle-color)] focus:border-transparent text-[var(--white-color)]">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Scheduled</option>
                  <option>Completed</option>
                  <option>Paused</option>
                </select>
              </div>
              <div>
                <label className="block text-[.78rem] font-medium text-[var(--light-grey-color)] mb-1">Date Range</label>
                <select className="w-full px-3 py-2 bg-[var(--light-dark-color)] border border-[var(--white-glass-color)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--puprle-color)] focus:border-transparent text-[var(--white-color)]">
                  <option>All Time</option>
                  <option>This Month</option>
                  <option>Last Month</option>
                  <option>Custom Range</option>
                </select>
              </div>
              <div>
                <label className="block text-[.78rem] font-medium text-[var(--light-grey-color)] mb-1">Advertiser</label>
                <select className="w-full px-3 py-2 bg-[var(--light-dark-color)] border border-[var(--white-glass-color)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--puprle-color)] focus:border-transparent text-[var(--white-color)]">
                  <option>All Advertisers</option>
                  <option>Nike</option>
                  <option>Coca-Cola</option>
                  <option>Samsung</option>
                  <option>L'Oréal</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="w-full px-4 py-2 bg-[var(--puprle-color)] hover:bg-[var(--light-purple-color)] text-white rounded-md">
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Campaign Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-[var(--light-dark-color)] backdrop-blur-lg p-6 rounded-xl border border-[var(--white-glass-color)] border-l-4 border-[var(--puprle-color)]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--light-grey-color)]">Total Campaigns</p>
                  <p className="text-2xl font-semibold text-[var(--white-color)] mt-1">42</p>
                </div>
                <div className="p-3 rounded-full bg-[var(--light-purple-color)] text-[var(--puprle-color)]">
                  <FiPieChart size={20} />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-[var(--light-dark-color)] backdrop-blur-lg p-6 rounded-xl border border-[var(--white-glass-color)] border-l-4 border-green-400"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--light-grey-color)]">Active</p>
                  <p className="text-2xl font-semibold text-[var(--white-color)] mt-1">12</p>
                </div>
                <div className="p-3 rounded-full bg-green-900/30 text-green-400">
                  <FiCheckCircle size={20} />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-[var(--light-dark-color)] backdrop-blur-lg p-6 rounded-xl border border-[var(--white-glass-color)] border-l-4 border-yellow-400"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--light-grey-color)]">Scheduled</p>
                  <p className="text-2xl font-semibold text-[var(--white-color)] mt-1">8</p>
                </div>
                <div className="p-3 rounded-full bg-yellow-900/30 text-yellow-400">
                  <FiClock size={20} />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-[var(--light-dark-color)] backdrop-blur-lg p-6 rounded-xl border border-[var(--white-glass-color)] border-l-4 border-blue-400"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--light-grey-color)]">Completed</p>
                  <p className="text-2xl font-semibold text-[var(--white-color)] mt-1">22</p>
                </div>
                <div className="p-3 rounded-full bg-blue-900/30 text-blue-400">
                  <FiCheckCircle size={20} />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Campaigns Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[var(--light-dark-color)] backdrop-blur-lg p-6 rounded-xl border border-[var(--white-glass-color)]"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-[var(--white-color)]">All Campaigns</h3>
              <button className="px-4 py-2 bg-[var(--puprle-color)] hover:bg-[var(--light-purple-color)] text-white rounded-md text-sm">
                + New Campaign
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[var(--white-glass-color)]">
                <thead className="bg-[var(--light-dark-color)]">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--light-grey-color)] uppercase tracking-wider">Advertiser</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--light-grey-color)] uppercase tracking-wider">Dates</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--light-grey-color)] uppercase tracking-wider">Location</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--light-grey-color)] uppercase tracking-wider">Budget</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--light-grey-color)] uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[var(--light-grey-color)] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-[var(--light-dark-color)] divide-y divide-[var(--white-glass-color)]">
                  {allCampaigns.map((campaign, index) => (
                    <tr key={index} className="hover:bg-[var(--light-dark-color)]">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[var(--light-purple-color)] flex items-center justify-center text-[var(--puprle-color)] font-medium mr-3">
                            {campaign.advertiser.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-[var(--white-color)]">{campaign.advertiser}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[var(--light-grey-color)]">{campaign.startDate} to {campaign.endDate}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[var(--light-grey-color)]">{campaign.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[var(--light-grey-color)]">{campaign.budget}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          campaign.status === 'Active' ? 'bg-green-900/30 text-green-400' :
                          campaign.status === 'Scheduled' ? 'bg-yellow-900/30 text-yellow-400' :
                          campaign.status === 'Completed' ? 'bg-blue-900/30 text-blue-400' : 'bg-gray-900/30 text-gray-400'
                        }`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--light-grey-color)]">
                        <button className="text-[var(--puprle-color)] hover:text-[var(--white-color)] mr-3">View</button>
                        <button className="text-[var(--puprle-color)] hover:text-[var(--white-color)]">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-[var(--light-grey-color)]">
                Showing <span className="font-medium">1</span> to <span className="font-medium">7</span> of <span className="font-medium">42</span> campaigns
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-[var(--white-glass-color)] rounded-md text-sm text-[var(--light-grey-color)] hover:bg-[var(--light-dark-color)]">
                  Previous
                </button>
                <button className="px-3 py-1 border border-[var(--white-glass-color)] rounded-md text-sm text-[var(--light-grey-color)] hover:bg-[var(--light-dark-color)]">
                  Next
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Reports Section */}
      {activeTab === "reports" && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Report Filters */}
          <div className="bg-[var(--light-dark-color)] backdrop-blur-lg p-6 rounded-xl border border-[var(--white-glass-color)]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[.78rem] font-medium text-[var(--light-grey-color)] mb-1">Report Type</label>
                <select className="w-full px-3 py-2 bg-[var(--light-dark-color)] border border-[var(--white-glass-color)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--puprle-color)] focus:border-transparent text-[var(--white-color)]">
                  <option>All Types</option>
                  <option>Revenue</option>
                  <option>Performance</option>
                  <option>Engagement</option>
                  <option>Utilization</option>
                </select>
              </div>
              <div>
                <label className="block text-[.78rem] font-medium text-[var(--light-grey-color)] mb-1">Date Range</label>
                <select className="w-full px-3 py-2 bg-[var(--light-dark-color)] border border-[var(--white-glass-color)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--puprle-color)] focus:border-transparent text-[var(--white-color)]">
                  <option>Last 30 Days</option>
                  <option>Last Quarter</option>
                  <option>Last Year</option>
                  <option>Custom Range</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="w-full px-4 py-2 bg-[var(--puprle-color)] hover:bg-[var(--light-purple-color)] text-white rounded-md">
                  Generate Report
                </button>
              </div>
            </div>
          </div>

          {/* Report Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-[var(--light-dark-color)] backdrop-blur-lg p-6 rounded-xl border border-[var(--white-glass-color)] border-l-4 border-[var(--puprle-color)]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--light-grey-color)]">Total Reports</p>
                  <p className="text-2xl font-semibold text-[var(--white-color)] mt-1">24</p>
                </div>
                <div className="p-3 rounded-full bg-[var(--light-purple-color)] text-[var(--puprle-color)]">
                  <FiFileText size={20} />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-[var(--light-dark-color)] backdrop-blur-lg p-6 rounded-xl border border-[var(--white-glass-color)] border-l-4 border-green-400"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--light-grey-color)]">Generated</p>
                  <p className="text-2xl font-semibold text-[var(--white-color)] mt-1">18</p>
                </div>
                <div className="p-3 rounded-full bg-green-900/30 text-green-400">
                  <FiCheckCircle size={20} />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-[var(--light-dark-color)] backdrop-blur-lg p-6 rounded-xl border border-[var(--white-glass-color)] border-l-4 border-yellow-400"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--light-grey-color)]">Pending</p>
                  <p className="text-2xl font-semibold text-[var(--white-color)] mt-1">4</p>
                </div>
                <div className="p-3 rounded-full bg-yellow-900/30 text-yellow-400">
                  <FiClock size={20} />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-[var(--light-dark-color)] backdrop-blur-lg p-6 rounded-xl border border-[var(--white-glass-color)] border-l-4 border-blue-400"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--light-grey-color)]">This Month</p>
                  <p className="text-2xl font-semibold text-[var(--white-color)] mt-1">3</p>
                </div>
                <div className="p-3 rounded-full bg-blue-900/30 text-blue-400">
                  <FiCalendar size={20} />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Reports List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[var(--light-dark-color)] backdrop-blur-lg p-6 rounded-xl border border-[var(--white-glass-color)]"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-[var(--white-color)]">Recent Reports</h3>
              <button className="px-4 py-2 bg-[var(--puprle-color)] hover:bg-[var(--light-purple-color)] text-white rounded-md text-sm">
                + New Report
              </button>
            </div>
            
            <div className="space-y-4">
              {reports.map((report, index) => (
                <div key={index} className="p-4 border border-[var(--white-glass-color)] rounded-lg hover:border-[var(--puprle-color)] transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-[var(--white-color)]">{report.title}</p>
                      <p className="text-[.78rem] text-[var(--light-grey-color)] mt-1 flex items-center">
                        <FiFileText className="mr-1" size={14} /> {report.type} • {report.date}
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      report.status === 'Generated' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <button className="text-sm text-[var(--puprle-color)] hover:text-[var(--white-color)]">View Details</button>
                    <div className="flex space-x-2">
                      <button className="text-sm text-[var(--puprle-color)] hover:text-[var(--white-color)]">Download</button>
                      <button className="text-sm text-[var(--puprle-color)] hover:text-[var(--white-color)]">Share</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-[var(--light-grey-color)]">
                Showing <span className="font-medium">1</span> to <span className="font-medium">4</span> of <span className="font-medium">24</span> reports
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-[var(--white-glass-color)] rounded-md text-sm text-[var(--light-grey-color)] hover:bg-[var(--light-dark-color)]">
                  Previous
                </button>
                <button className="px-3 py-1 border border-[var(--white-glass-color)] rounded-md text-sm text-[var(--light-grey-color)] hover:bg-[var(--light-dark-color)]">
                  Next
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dashboard;