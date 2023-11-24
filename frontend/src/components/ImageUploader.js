
import React, { useState } from 'react';

const ImageUploader = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);

    // You can also perform other operations with the selected image, e.g., upload to a server.
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      {selectedImage && <img src={'/Users/Marli_1/Bootcamp/logo.png'} alt="Uploaded" />}
    </div>
  );
};

export default ImageUploader;
