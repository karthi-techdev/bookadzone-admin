import React from 'react';
import { FiArrowLeft, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

interface FormHeaderProps {
  type?: string;
  addButtonLink?: string;
  managementName: string;
}

const FormHeader: React.FC<FormHeaderProps> = ({ type, addButtonLink, managementName }) => {
  const noBackArrowPages = [
    'Profile',
  'BAZLogo & Favicon',
    'Email Configuration',
    'Change Password',
    'Meta Details',
    'Founder Details',
    'Company Details',
  ];
  const hideBackArrow = noBackArrowPages.includes(managementName);

  return (
    <div className="mb-6">
      <div className="flex items-center space-x-2 mb-2">
        {!hideBackArrow && addButtonLink && (
          <Link
            to={addButtonLink}
            className="flex items-center text-[var(--light-grey-color)] hover:text-white transition-colors"
          >
            <FiArrowLeft className="h-5 w-5 mr-2" />
          </Link>
        )}
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          {type} {managementName}
        </h1>
      </div>
      {/* Unified Breadcrumbs */}
      <nav className="text-xs mt-1" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-1">
          <li className="flex items-center">
            <Link to="/" className="text-[var(--light-grey-color)] hover:text-white font-medium">Home</Link>
          </li>
          <li className="flex items-center">
            <FiChevronRight className="mx-1 text-[var(--light-grey-color)] text-sm" />
          </li>
          <li className="flex items-center">
            <Link to={`/${managementName.toLowerCase()}`} className={!type ? "text-white font-semibold cursor-default pointer-events-none" : "text-[var(--light-grey-color)] hover:text-white font-medium"}>
              {managementName}
            </Link>
          </li>
          {type && (
            <>
              <li className="flex items-center">
                <FiChevronRight className="mx-1 text-[var(--light-grey-color)] text-sm" />
              </li>
              <li className="flex items-center text-white font-semibold cursor-default pointer-events-none">{type}</li>
            </>
          )}
        </ol>
      </nav>
    </div>
  );
};

export default FormHeader;