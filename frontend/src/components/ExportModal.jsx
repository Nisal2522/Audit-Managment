import React, { useState } from 'react';
import { Download } from 'lucide-react';

const ExportModal = ({ isOpen, onClose, onExport, documentTypes, title }) => {
  const [exportType, setExportType] = useState('excel');
  const [selectedDocument, setSelectedDocument] = useState('');

  if (!isOpen) return null;

  const handleExport = () => {
    onExport(exportType, selectedDocument);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
        
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Export Type</label>
          <select
            value={exportType}
            onChange={(e) => setExportType(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="excel">Excel</option>
            <option value="pdf">PDF</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Select Document</label>
          <select
            value={selectedDocument}
            onChange={(e) => setSelectedDocument(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a document</option>
            {documentTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={!selectedDocument}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Download size={18} />
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal; 