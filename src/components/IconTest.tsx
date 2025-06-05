import React from 'react';
import { FiSave, FiRotateCw, FiEye, FiMaximize2, FiMinimize2, FiFileText, FiSettings } from 'react-icons/fi';

const IconTest = () => {
  return (
    <div>
      <h2>Test des icônes</h2>
      <div>
        <FiSave size={24} />
        <span>FiSave</span>
      </div>
      <div>
        <FiRotateCw size={24} />
        <span>FiRotateCw</span>
      </div>
      <div>
        <FiEye size={24} />
        <span>FiEye</span>
      </div>
      <div>
        <FiMaximize2 size={24} />
        <span>FiMaximize2</span>
      </div>
      <div>
        <FiMinimize2 size={24} />
        <span>FiMinimize2</span>
      </div>
      <div>
        <FiFileText size={24} />
        <span>FiFileText</span>
      </div>
      <div>
        <FiSettings size={24} />
        <span>FiSettings</span>
      </div>
    </div>
  );
};

export default IconTest;
