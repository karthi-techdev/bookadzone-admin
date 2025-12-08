// components/templates/NotifiedUserViewTemplate.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { NotifiedUserStore } from '../../stores/notifyUserStore';
import BAZLoader from '../../atoms/BAZ-Loader';
import ImportedURL from '../../common/urls';
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiGlobe,
  FiUser,
  FiBriefcase,
  FiArrowLeft,
  FiExternalLink,
  FiCalendar,
  FiMap,
} from 'react-icons/fi';
import { MdLocationOn, MdBusiness } from 'react-icons/md';

const NotifiedUserViewTemplate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchUserById } = NotifiedUserStore();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!id) return;
      try {
        const data = await fetchUserById(id);
        setUser(data);
      } catch (err) {
        console.error('Failed to load user:', err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [id, fetchUserById]);

  if (loading) return <BAZLoader />;
  if (!user) return <div className="p-6 text-center text-red-500">User not found</div>;

  const loc = user.location;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* ==== LEFT SIDEBAR - PROFILE & QUICK ACTIONS ==== */}
      <aside className="w-full lg:w-1/4 lg:min-w-[320px] p-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl h-full">
          {/* Profile Header */}
          <header className="text-center mb-8">
            <div className="relative w-32 h-32 lg:w-40 lg:h-40 mx-auto mb-6">
              {user.photo ? (
                <img
                  src={`${ImportedURL.FILEURL}${user.photo}`}
                  alt={`${user.fullName} Photo`}
                  className="w-full h-full object-cover rounded-full border-4 border-white/30 shadow-2xl relative z-10"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full border-4 border-white/30 flex items-center justify-center backdrop-blur-sm relative z-10">
                  <FiUser className="text-4xl lg:text-5xl text-white/80" />
                </div>
              )}
              <div className="absolute -inset-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-20"></div>
            </div>

            <h1 className="text-xl lg:text-2xl font-bold text-white mb-3">
              {user.fullName}
            </h1>
            <p className="text-white/80 text-sm mb-3 font-medium bg-white/20 rounded-full px-3 py-1 inline-block border border-white/30">
              {user.profileType}
            </p>

            {user.position && (
              <p className="text-white/70 text-xs lg:text-sm mb-6 bg-white/10 rounded-lg px-3 py-2 border border-white/20">
                {user.position}
              </p>
            )}

            <nav className="flex justify-center">
              <Link
                to="/notifyuser"
                className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-300 border border-white/30 hover:border-white/50 hover:scale-105 text-sm"
              >
                <FiArrowLeft className="text-base" /> 
                <span className="font-semibold">Back to List</span>
              </Link>
            </nav>
          </header>

          {/* Quick Actions */}
          <section className="mt-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-3">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
              Quick Actions
            </h3>
            <nav className="space-y-3">
              <a 
                href={`mailto:${user.email}`} 
                className="flex items-center gap-3 p-3 text-white/90 hover:text-white bg-white/15 rounded-xl hover:bg-white/25 transition-all duration-300 border border-white/20 hover:border-purple-400/50 hover:scale-102"
              >
                <div className="p-2 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-lg backdrop-blur-sm">
                  <FiMail className="text-purple-200 text-lg" />
                </div>
                <span className="font-medium text-sm">Send Email</span>
              </a>

              {loc.phone && (
                <a 
                  href={`tel:${loc.phone}`} 
                  className="flex items-center gap-3 p-3 text-white/90 hover:text-white bg-white/15 rounded-xl hover:bg-white/25 transition-all duration-300 border border-white/20 hover:border-blue-400/50 hover:scale-102"
                >
                  <div className="p-2 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-lg backdrop-blur-sm">
                    <FiPhone className="text-blue-200 text-lg" />
                  </div>
                  <span className="font-medium text-sm">Call Now</span>
                </a>
              )}
            </nav>
          </section>
        </div>
      </aside>

      {/* ==== MAIN CONTENT - USER DETAILS ==== */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            {/* LEFT COLUMN */}
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20 shadow-xl">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/20">
                  <div className="p-2 bg-gradient-to-r from-purple-500/40 to-pink-500/40 rounded-xl">
                    <FiMail className="text-white text-lg" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Contact Information</h2>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-purple-400/30 transition-all duration-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <FiMail className="text-purple-300 text-base" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white/60 text-xs font-medium mb-1">EMAIL ADDRESS</p>
                        <p className="text-white font-semibold text-sm break-all">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  {loc.phone && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-blue-400/30 transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <FiPhone className="text-blue-300 text-base" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white/60 text-xs font-medium mb-1">PHONE NUMBER</p>
                          <p className="text-white font-semibold text-sm">{loc.phone}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Company Information */}
              {user.companyName && (
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20 shadow-xl">
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/20">
                    <div className="p-2 bg-gradient-to-r from-orange-500/40 to-amber-500/40 rounded-xl">
                      <MdBusiness className="text-white text-lg" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Company Information</h2>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-orange-400/30 transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500/20 rounded-lg">
                          <FiBriefcase className="text-orange-300 text-base" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white/60 text-xs font-medium mb-1">COMPANY NAME</p>
                          <p className="text-white font-semibold text-sm">{user.companyName}</p>
                        </div>
                      </div>
                    </div>
                    
                    {user.position && (
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-amber-400/30 transition-all duration-200">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-amber-500/20 rounded-lg">
                            <FiBriefcase className="text-amber-300 text-base" />
                          </div>
                          <div className="flex-1">
                            <p className="text-white/60 text-xs font-medium mb-1">POSITION</p>
                            <p className="text-white font-semibold text-sm">{user.position}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              {/* Location Details */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20 shadow-xl">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/20">
                  <div className="p-2 bg-gradient-to-r from-emerald-500/40 to-teal-500/40 rounded-xl">
                    <MdLocationOn className="text-white text-lg" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Location Details</h2>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <p className="text-white/60 text-xs font-medium mb-1">CITY</p>
                      <p className="text-white font-semibold text-sm">{loc.city}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <p className="text-white/60 text-xs font-medium mb-1">STATE / REGION</p>
                      <p className="text-white font-semibold text-sm">{loc.region}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <p className="text-white/60 text-xs font-medium mb-1">COUNTRY</p>
                      <p className="text-white font-semibold text-sm">{loc.country}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <p className="text-white/60 text-xs font-medium mb-1">ISP</p>
                      <p className="text-white font-semibold text-sm">{loc.isp}</p>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <p className="text-white/60 text-xs font-medium mb-1">COORDINATES</p>
                    <p className="text-white font-semibold text-sm">
                      {loc.lat.toFixed(4)}, {loc.lon.toFixed(4)}
                    </p>
                  </div>

                  <a
                    href={`https://www.google.com/maps?q=${loc.lat},${loc.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold text-sm hover:scale-105 w-full"
                  >
                    <FiExternalLink className="text-base" /> 
                    Open in Google Maps
                  </a>
                </div>
              </div>

              {/* Account Information */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20 shadow-xl">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/20">
                  <div className="p-2 bg-gradient-to-r from-cyan-500/40 to-blue-500/40 rounded-xl">
                    <FiCalendar className="text-white text-lg" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Account Information</h2>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <p className="text-white/60 text-xs font-medium mb-1">SIGNUP DATE</p>
                    <p className="text-white font-semibold text-sm">
                      {new Date(user.signupDate).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${user.status === 'active' ? 'bg-green-400' : 'bg-red-400'} shadow-lg`} />
                      <div className="flex-1">
                        <p className="text-white/60 text-xs font-medium mb-1">ACCOUNT STATUS</p>
                        <p className="text-white font-semibold text-sm capitalize">{user.status || 'unknown'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default NotifiedUserViewTemplate;