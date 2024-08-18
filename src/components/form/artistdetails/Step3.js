import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import './ArtistDetailsForm.scss'; // Ensure this path is correct

const Step3 = ({ formData, handleChange }) => {
  const [categories, setCategories] = useState({});

  useEffect(() => {
    axios.post('http://localhost:8080/api/common/categories', formData.preferredGigs)
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, [formData.preferredGigs]);

  const handleCategoryChange = (category, selectedOptions) => {
    const updatedCategoryList = selectedOptions.map(option => option.value);
    const updatedCategories = formData.categories;
    updatedCategories[category] = updatedCategoryList;
    
    // Update formData with the new category values
    handleChange(`categories`, updatedCategories);
  };

  return (
    <div className="form-container">
      <h2>Step 3: Categories</h2>
      <div className="form">
        {Object.keys(categories).map(category => (
          <div className="form-group" key={category}>
            <label>{category}</label>
            <Select
              isMulti
              className="select-control"
              options={categories[category].map(option => ({ value: option, label: option }))}
              name={category}
              value={formData.categories[category] ? formData.categories[category].map(option => ({ value: option, label: option })) : []}
              onChange={(selectedOptions) => handleCategoryChange(category, selectedOptions)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Step3;
