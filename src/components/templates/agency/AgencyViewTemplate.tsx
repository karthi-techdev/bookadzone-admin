import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAgencyStore } from '../../stores/AgencyStore';
import BAZLoader from '../../atoms/BAZ-Loader';
import ImportedURL from '../../common/urls';
import { getStatesOfCountry } from '../../utils/helper';
import { FaBlenderPhone } from "react-icons/fa";
import { FiMail, FiPhone, FiUser, FiBriefcase, FiExternalLink, FiEdit3, FiArrowLeft, FiGlobe, FiMapPin } from 'react-icons/fi';

interface ContactItemProps {
  icon: React.ReactNode;
  label: string;
  value?: React.ReactNode;
  className: string;
}

const ContactItem: React.FC<ContactItemProps> = ({ icon, label, value, className }) => {
  return (
    <div className="flex items-center gap-3 group">
      <div className="w-10 h-10 flex items-center justify-center bg-[#ffffff0d] rounded-md">
        {icon}
      </div>
      <div>
  <p className="text-[10px] sm:text-xs text-gray-500">
    {label}
  </p>

  <p className="text-[10px] sm:text-sm font-medium text-white">
    {value ?? '—'}
  </p>
</div>
    </div>
  );
};

const AgencyViewTemplate: React.FC = () => {
  const { id } = useParams();
  const { fetchAgencyById } = useAgencyStore();
  const [agency, setAgency] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const states = useMemo(() => getStatesOfCountry('IN'), []);

  useEffect(() => {
    const loadAgency = async () => {
      if (id) {
        try {
          const data = await fetchAgencyById(id);
          setAgency(data);
        } catch (error) {
          console.error('Error fetching agency:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadAgency();
  }, [id, fetchAgencyById]);

  if (loading) return <BAZLoader />;
  if (!agency) return <div className="p-6 text-center text-red-500">Agency not found</div>;

  return (
    <div className="min-h-screen bg-[var(--main-bg-color)] flex flex-col items-center py-6 px-3">
      <div className="w-full space-y-8">

        <section className="bg-[#1b1536e8] rounded-xl shadow-md p-6 md:p-8">
  <h3 className="text-lg font-semibold text-[var(--puprle-color)] mb-3">
    Personal Information
  </h3>
  <div className="mb-5 bg-[#ffffff29] h-[1px] w-full"></div>

  <div className="flex flex-col lg:flex-row justify-between gap-10">


    <div className="profile-img flex flex-col lg:items-start w-full lg:w-1/3">

      <div className="relative w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 mx-auto mb-4">
        <img
          src={`${ImportedURL.FILEURL}${agency.agencyLogo}`}
          alt={agency.agencyName}
          className="w-full h-full object-contain rounded-xl border-4 border-[var(--puprle-color)]"
        />
      </div>

      <h1 className="text-2xl font-bold text-white mb-4 text-center lg:text-left">
        {agency.agencyName}
      </h1>

      <div className="flex gap-3 mt-4">
        <Link
          to={`/agency/edit/${id}`}
          className="flex items-center gap-2 px-3 py-2 bg-[var(--puprle-color)] text-white rounded-md w-fit"
        >
          <FiEdit3 className="text-lg" /> Edit
        </Link>

        <Link
          to="/agency"
          className="flex items-center gap-2 px-3 py-2 bg-gray-300 text-gray-800 rounded-md w-fit"
        >
          <FiArrowLeft className="text-lg" /> Back
        </Link>
      </div>

    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 w-full lg:w-2/3">

      <ContactItem
        icon={<FiMail className="text-2xl text-[#7b67f0]" />}
        label="Email Address"
        value={agency.yourEmail}
        className=""
        
        
      />

      <ContactItem
        icon={<FiPhone className="text-2xl text-[#7b67f0]" />}
        label="Phone Number"
        value={agency.yourPhone}
        className=""
      />

      <ContactItem
        icon={<FiMail className="text-2xl text-[#7b67f0]" />}
        label="Company Email"
        value={agency.companyEmail}
        className=""
      />

      <ContactItem
        icon={<FaBlenderPhone className="text-2xl text-[#7b67f0]" />}
        label="Company Phone"
        value={agency.companyPhone}
        className=""
      />

    </div>


    <div className="flex flex-col items-center lg:items-start w-full lg:w-[220px]">

      <img
        src={`${ImportedURL.FILEURL}${agency.photo}`}
        alt={agency.name}
        className="w-24 h-24 rounded-full object-cover border-4 border-[var(--puprle-color)] mb-3"
      />

      <h2 className="text-xl font-semibold text-white">{agency.name}</h2>
      <p className="text-gray-500 text-sm">{agency.position || "Admin"}</p>
      <p className="text-gray-500 text-sm">{agency.agencyLocation || "India"}</p>

    </div>

  </div>
</section>


        <section className="bg-[#1b1536e8] rounded-xl shadow-md p-6 md:p-8">
          <h3 className="text-lg font-semibold text-[var(--puprle-color)] mb-4">Address</h3>
              <div className="mb-5 bg-[#ffffff29] h-[1px] w-[100%] mr-[8px]"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center gap-2 group">
              <div>
                <p className=" text-gray-500 text-[14px] ">Country</p>
                <p className=" font-medium text-white ">India</p>
              </div>
            </div>

            <div className="flex items-center gap-2 group">
              <div>
                <p className=" text-gray-500 text-[14px]">State</p>
                <p className=" font-medium text-white ">
                  {states.find(s => s.value === agency.state)?.label || agency.state}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 group">
              <div>
                <p className=" text-gray-500 text-[14px]">City</p>
                <p className=" font-medium text-white ">{agency.city}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 group">
              <div>
                <p className=" text-gray-500 text-[14px]">Pincode</p>
                <p className=" font-medium text-white ">{agency.pincode}</p>
              </div>
            </div>

            <div className="md:col-span-3 flex items-center gap-2 group">
              <div>
                <p className=" text-gray-500 text-[14px]">Full Address</p>
                <p className=" font-medium text-white ">{agency.agencyAddress}</p>
              </div>
            </div>
          </div>
        </section>



        <section className="bg-[#1b1536e8] rounded-xl shadow-md p-6 md:p-8">
          <h3 className="text-lg font-semibold text-[var(--puprle-color)] mb-4">Company Details</h3>
          <div className=" mb-5 bg-[#ffffff29] h-[1px] w-[100%] mr-[8px]"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800 mb-8">
            <div>
              <p className="text-sm text-gray-500">GST / Registration Number</p>
              <p className="font-medium text-white">{agency.companyRegistrationNumberGST}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Website</p>
              <a
                href={agency.website}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[var(--puprle-color)] hover:underline"
              >
                {agency.website}
              </a>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-[var(--puprle-color)] mb-4">Important Documents</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border border-[rgba(255,255,255,0.16)] rounded-lg p-4 flex items-center gap-4 group hover:bg-[var(--puprle-color)] transition-all duration-300">
              <FiUser className="text-2xl text-[#7b67f0] group-hover:text-white transition-colors duration-300" />
              <div>
                <p className="text-sm text-white group-hover:text-white">ID Proof</p>
                <a
                  href={`${ImportedURL.FILEURL}${agency.uploadIdProof}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium flex items-center gap-1 text-white"
                >
                  View Document <FiExternalLink />
                </a>
              </div>
            </div>

            <div className="border border border-[rgba(255,255,255,0.16)] rounded-lg p-4 flex items-center gap-4 group hover:bg-[var(--puprle-color)] transition-all duration-300">
              <FiBriefcase className="text-2xl text-[#7b67f0] group-hover:text-white transition-colors duration-300" />
              <div>
                <p className="text-sm text-white group-hover:text-white">Business Proof</p>
                <a
                  href={`${ImportedURL.FILEURL}${agency.uploadBusinessProof}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium flex items-center gap-1 text-white"
                >
                  View Document <FiExternalLink />
                </a>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default AgencyViewTemplate;






