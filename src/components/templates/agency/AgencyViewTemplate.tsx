import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAgencyStore } from '../../stores/AgencyStore';
import BAZLoader from '../../atoms/BAZ-Loader';
import ImportedURL from '../../common/urls';
import { FiMail, FiPhone, FiMapPin, FiGlobe, FiFileText, FiUser, FiBriefcase, FiEdit3, FiArrowLeft, FiExternalLink } from 'react-icons/fi';
import { MdLocationOn } from 'react-icons/md';
import { getStatesOfCountry } from '../../utils/helper';

const AgencyViewTemplate: React.FC = () => {
  const { id } = useParams();
  const { fetchAgencyById } = useAgencyStore();
  const [agency, setAgency] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stateFullName, setStateFullName] = useState("");

  // Get the list of states for India to find the full name
  const states = useMemo(() => getStatesOfCountry('IN'), []);

  useEffect(() => {
    const loadAgency = async () => {
      if (id) {
        try {
          const data = await fetchAgencyById(id);
          setAgency(data);
          
          // Find the full state name from the state code
          if (data?.state) {
            const stateObj = states.find(s => s.value === data.state);
            setStateFullName(stateObj?.label || data.state);
          }
        } catch (error) {
          console.error('Error fetching agency:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadAgency();
  }, [id, fetchAgencyById, states]);

  if (loading) return <BAZLoader />;
  if (!agency) return <div className="p-6 text-center text-red-500">Agency not found</div>;

  return (
    <div className="flex flex-col lg:flex-row h-full bg-[var(--dark-color)]">
      {/* Left Sidebar */}
      <aside className="w-full lg:w-1/4 lg:min-w-[300px] h-full p-6 border-b lg:border-b-0 lg:border-r border-[var(--light-blur-grey-color)]">
        {/* Agency Logo and Header */}
        <header className="text-center mb-8">
          <div className="relative w-40 h-40 lg:w-48 lg:h-48 mx-auto mb-4">
            <img
              src={`${ImportedURL.FILEURL}${agency.agencyLogo}`}
              alt={`${agency.agencyName} Logo`}
              className="w-full h-full object-contain rounded-xl border-4 border-[var(--puprle-color)] p-2 bg-white shadow-lg"
            />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">{agency.agencyName}</h1>
          <nav className="flex justify-center gap-4">
            <Link
              to={`/agency/edit/${id}`}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--puprle-color)] text-white rounded-md hover:bg-opacity-90 transition-all duration-300"
            >
              <FiEdit3 className="text-lg" /> Edit
            </Link>
            <Link
              to="/agency"
              className="flex items-center gap-2 px-4 py-2 bg-[var(--light-blur-grey-color)] text-white rounded-md hover:bg-opacity-90 transition-all duration-300"
            >
              <FiArrowLeft className="text-lg" /> Back
            </Link>
          </nav>
        </header>

        {/* Contact Person Card */}
        <section className="bg-[var(--black-color)] p-6 rounded-xl mb-6 shadow-lg">
          <div className="relative w-28 h-28 lg:w-32 lg:h-32 mx-auto mb-4">
            <img
              src={`${ImportedURL.FILEURL}${agency.photo}`}
              alt={`${agency.name} - Contact Person`}
              className="w-full h-full object-cover rounded-full border-4 border-[var(--puprle-color)] shadow-md"
            />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-2">{agency.name}</h3>
            <p className="text-[var(--light-grey-color)] text-sm">{agency.position}</p>
          </div>
        </section>

        {/* Quick Links Card */}
        <section className="bg-[var(--black-color)] p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <nav className="space-y-4">
            <a 
              href={`mailto:${agency.companyEmail}`}
              className="flex items-center gap-3 text-[var(--light-grey-color)] hover:text-white transition-colors duration-300"
            >
              <FiMail className="text-[var(--puprle-color)] text-xl" />
              <span>Send Email</span>
            </a>
            <a 
              href={`tel:${agency.companyPhone}`}
              className="flex items-center gap-3 text-[var(--light-grey-color)] hover:text-white transition-colors duration-300"
            >
              <FiPhone className="text-[var(--puprle-color)] text-xl" />
              <span>Call Now</span>
            </a>
            <a 
              href={agency.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-[var(--light-grey-color)] hover:text-white transition-colors duration-300"
            >
              <FiGlobe className="text-[var(--puprle-color)] text-xl" />
              <span>Visit Website</span>
            </a>
          </nav>
        </section>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Contact Information */}
            <section className="bg-[var(--black-color)] p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold mb-6 text-white border-b border-[var(--light-blur-grey-color)] pb-3">
                Contact Information
              </h2>
              <div className="space-y-6">
                {/* Personal Contact */}
                <div className="bg-[var(--dark-color)] p-4 rounded-lg">
                  <h3 className="text-[var(--puprle-color)] font-medium mb-4">Personal Contact</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <FiMail className="text-[var(--puprle-color)] text-xl flex-shrink-0" />
                      <div>
                        <p className="text-[var(--light-grey-color)] text-sm">Email</p>
                        <p className="text-white">{agency.yourEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FiPhone className="text-[var(--puprle-color)] text-xl flex-shrink-0" />
                      <div>
                        <p className="text-[var(--light-grey-color)] text-sm">Phone</p>
                        <p className="text-white">{agency.yourPhone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company Contact */}
                <div className="bg-[var(--dark-color)] p-4 rounded-lg">
                  <h3 className="text-[var(--puprle-color)] font-medium mb-4">Company Contact</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <FiMail className="text-[var(--puprle-color)] text-xl flex-shrink-0" />
                      <div>
                        <p className="text-[var(--light-grey-color)] text-sm">Email</p>
                        <p className="text-white">{agency.companyEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FiPhone className="text-[var(--puprle-color)] text-xl flex-shrink-0" />
                      <div>
                        <p className="text-[var(--light-grey-color)] text-sm">Phone</p>
                        <p className="text-white">{agency.companyPhone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Location Details */}
            <section className="bg-[var(--black-color)] p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold mb-6 text-white border-b border-[var(--light-blur-grey-color)] pb-3">
                Location Details
              </h2>
              <div className="space-y-6">
                <div className="bg-[var(--dark-color)] p-4 rounded-lg">
                  <div className="flex items-start gap-4">
                    <FiMapPin className="text-[var(--puprle-color)] text-2xl flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-[var(--light-grey-color)] text-sm">Agency Address</p>
                      <p className="text-white">{agency.agencyAddress}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--dark-color)] p-4 rounded-lg">
                  <div className="flex items-center gap-4">
                    <MdLocationOn className="text-[var(--puprle-color)] text-2xl flex-shrink-0" />
                    <div>
                      <p className="text-[var(--light-grey-color)] text-sm">Location</p>
                      <p className="text-white">{agency.agencyLocation}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[var(--dark-color)] p-4 rounded-lg">
                    <p className="text-[var(--light-grey-color)] text-sm">Country</p>
                    <p className="text-white font-medium">India</p>
                  </div>
                  <div className="bg-[var(--dark-color)] p-4 rounded-lg">
                    <p className="text-[var(--light-grey-color)] text-sm">State</p>
                    <p className="text-white font-medium">
                      {states.find(s => s.value === agency.state)?.label || agency.state}
                    </p>
                  </div>
                  <div className="bg-[var(--dark-color)] p-4 rounded-lg">
                    <p className="text-[var(--light-grey-color)] text-sm">City</p>
                    <p className="text-white font-medium">{agency.city}</p>
                  </div>
                  <div className="bg-[var(--dark-color)] p-4 rounded-lg">
                    <p className="text-[var(--light-grey-color)] text-sm">Pincode</p>
                    <p className="text-white font-medium">{agency.pincode}</p>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Company Information */}
            <section className="bg-[var(--black-color)] p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold mb-6 text-white border-b border-[var(--light-blur-grey-color)] pb-3">
                Company Details
              </h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <FiFileText className="text-[var(--puprle-color)] text-2xl flex-shrink-0" />
                  <div>
                    <p className="text-[var(--light-grey-color)] text-sm">GST/Registration Number</p>
                    <p className="text-white font-medium">{agency.companyRegistrationNumberGST}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <FiGlobe className="text-[var(--puprle-color)] text-2xl flex-shrink-0" />
                  <div>
                    <p className="text-[var(--light-grey-color)] text-sm">Website</p>
                    <a 
                      href={agency.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[var(--puprle-color)] hover:underline"
                    >
                      {agency.website}
                    </a>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Documents Section */}
            <section className="bg-[var(--black-color)] p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold mb-6 text-white border-b border-[var(--light-blur-grey-color)] pb-3">
                Important Documents
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[var(--dark-color)] p-4 rounded-lg group hover:bg-[var(--puprle-color)] transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <FiUser className="text-[var(--puprle-color)] text-2xl group-hover:text-white transition-colors duration-300" />
                    <div>
                      <p className="text-[var(--light-grey-color)] text-sm">ID Proof</p>
                      <a 
                        href={`${ImportedURL.FILEURL}${agency.uploadIdProof}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:underline flex items-center gap-2"
                      >
                        View Document
                        <FiExternalLink className="text-lg" />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="bg-[var(--dark-color)] p-4 rounded-lg group hover:bg-[var(--puprle-color)] transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <FiBriefcase className="text-[var(--puprle-color)] text-2xl group-hover:text-white transition-colors duration-300" />
                    <div>
                      <p className="text-[var(--light-grey-color)] text-sm">Business Proof</p>
                      <a 
                        href={`${ImportedURL.FILEURL}${agency.uploadBusinessProof}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:underline flex items-center gap-2"
                      >
                        View Document
                        <FiExternalLink className="text-lg" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>

  );
};

export default AgencyViewTemplate;