import React from 'react';
import { Clock, MapPin, Phone, Mail, HelpCircle, ShoppingBag } from 'lucide-react';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

const InfoPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Practical Information</h1>
      
      {/* Hero Section */}
      <div className="bg-blue-50 rounded-lg p-8 mb-12">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            Welcome to the School Uniform Shop
          </h2>
          <p className="text-lg text-blue-800 mb-6">
            We provide high-quality uniforms for students at affordable prices, with both new and secondhand options available.
          </p>
          <Link to="/shop">
            <Button variant="primary" className="flex items-center">
              <ShoppingBag size={18} className="mr-2" />
              Visit Our Shop
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Opening Hours */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 rounded-full mr-4">
                <Clock size={24} className="text-blue-900" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Opening Hours</h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Monday - Friday</span>
                <span>8:30 AM - 4:30 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Saturday</span>
                <span>9:00 AM - 12:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Sunday</span>
                <span>Closed</span>
              </div>
              <div className="pt-4 text-sm text-gray-600">
                <p>The shop will be closed during school holidays. Please check the school calendar for specific dates.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 rounded-full mr-4">
                <Phone size={24} className="text-blue-900" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Contact Us</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <Phone size={18} className="text-blue-800 mr-3 mt-1" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-gray-600">+33 123 456 789</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail size={18} className="text-blue-800 mr-3 mt-1" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-600">contact@schoolwear.com</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin size={18} className="text-blue-800 mr-3 mt-1" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-gray-600">123 School Street, 75001 Paris, France</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="mb-12">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-blue-100 rounded-full mr-4">
            <HelpCircle size={24} className="text-blue-900" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="divide-y divide-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">How can I donate used uniforms?</h3>
              <p className="text-gray-600">
                You can bring clean, gently used uniforms to the shop during opening hours. We accept items in good condition with no visible damage.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept cash, credit/debit cards, and online payments through our website.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Can I exchange items if they don't fit?</h3>
              <p className="text-gray-600">
                Yes, unused items can be exchanged within 14 days of purchase with proof of purchase. Items must be in their original condition with tags attached.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Do you offer delivery?</h3>
              <p className="text-gray-600">
                No, all items must be collected from the school shop during opening hours.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">How does the secondhand uniform system work?</h3>
              <p className="text-gray-600">
                Parents can donate outgrown uniforms in good condition. These are then resold at a reduced price, with proceeds going to the school fund or parent association.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Map */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Find Us</h2>
          <p className="text-gray-600">Our uniform shop is located within the main school building, near the main entrance.</p>
        </div>
        <div className="h-96 bg-gray-200 w-full">
          {/* Map would go here - for now a placeholder */}
          <div className="h-full w-full flex items-center justify-center bg-blue-50">
            <div className="text-center">
              <MapPin size={48} className="mx-auto mb-4 text-blue-900" />
              <p className="text-gray-600">Map placeholder</p>
              <p className="font-medium text-gray-800 mt-2">123 School Street, 75001 Paris, France</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;