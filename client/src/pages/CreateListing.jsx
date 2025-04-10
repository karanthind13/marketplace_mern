import { useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(formData);
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');
      setLoading(true);
      setError(false);
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
<main className="p-8 max-w-7xl mx-auto bg-gradient-to-r from-teal-300 via-blue-200 to-indigo-100 rounded-lg shadow-2xl">
  <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-10 tracking-wide">
    Create a Listing
  </h1>

  <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-10 bg-white p-8 rounded-lg shadow-lg border-2 border-gray-300">
    {/* Left Column */}
    <div className="space-y-6">
      {/* Name Input */}
      <div>
        <input
          type="text"
          placeholder="Name"
          className="w-full p-5 text-lg font-medium rounded-lg shadow-lg bg-gray-50 border-2 border-gray-300 focus:outline-none focus:ring-4 focus:ring-teal-500 focus:border-teal-500"
          id="name"
          maxLength="62"
          minLength="10"
          required
          onChange={handleChange}
          value={formData.name}
        />
      </div>

      {/* Description Input */}
      <div>
        <textarea
          placeholder="Description"
          className="w-full p-5 text-lg font-medium rounded-lg shadow-lg bg-gray-50 border-2 border-gray-300 focus:outline-none focus:ring-4 focus:ring-teal-500 focus:border-teal-500"
          id="description"
          required
          onChange={handleChange}
          value={formData.description}
        />
      </div>

      {/* Address Input */}
      <div>
        <input
          type="text"
          placeholder="Address"
          className="w-full p-5 text-lg font-medium rounded-lg shadow-lg bg-gray-50 border-2 border-gray-300 focus:outline-none focus:ring-4 focus:ring-teal-500 focus:border-teal-500"
          id="address"
          required
          onChange={handleChange}
          value={formData.address}
        />
      </div>

      {/* Type of Listing */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="sale"
            className="w-5 h-5 accent-teal-500"
            onChange={handleChange}
            checked={formData.type === "sale"}
          />
          <span className="text-lg font-medium">Sell</span>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="rent"
            className="w-5 h-5 accent-teal-500"
            onChange={handleChange}
            checked={formData.type === "rent"}
          />
          <span className="text-lg font-medium">Rent</span>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="parking"
            className="w-5 h-5 accent-teal-500"
            onChange={handleChange}
            checked={formData.parking}
          />
          <span className="text-lg font-medium">Parking spot</span>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="furnished"
            className="w-5 h-5 accent-teal-500"
            onChange={handleChange}
            checked={formData.furnished}
          />
          <span className="text-lg font-medium">Furnished</span>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="offer"
            className="w-5 h-5 accent-teal-500"
            onChange={handleChange}
            checked={formData.offer}
          />
          <span className="text-lg font-medium">Offer</span>
        </div>
      </div>

      {/* Bedrooms, Bathrooms, Price */}
      <div className="grid grid-cols-2 gap-8">
        {/* Bedrooms */}
        <div className="flex items-center space-x-2">
          <input
            type="number"
            id="bedrooms"
            min="1"
            max="10"
            required
            className="w-24 p-4 text-lg font-medium rounded-lg shadow-md bg-gray-50 border-2 border-gray-300 focus:outline-none focus:ring-4 focus:ring-teal-500 focus:border-teal-500"
            onChange={handleChange}
            value={formData.bedrooms}
          />
          <span className="text-lg">Beds</span>
        </div>

        {/* Bathrooms */}
        <div className="flex items-center space-x-2">
          <input
            type="number"
            id="bathrooms"
            min="1"
            max="10"
            required
            className="w-24 p-4 text-lg font-medium rounded-lg shadow-md bg-gray-50 border-2 border-gray-300 focus:outline-none focus:ring-4 focus:ring-teal-500 focus:border-teal-500"
            onChange={handleChange}
            value={formData.bathrooms}
          />
          <span className="text-lg">Baths</span>
        </div>

        {/* Regular Price */}
        <div className="flex items-center space-x-2">
          <input
            type="number"
            id="regularPrice"
            min="50"
            max="10000000"
            required
            className="w-24 p-4 text-lg font-medium rounded-lg shadow-md bg-gray-50 border-2 border-gray-300 focus:outline-none focus:ring-4 focus:ring-teal-500 focus:border-teal-500"
            onChange={handleChange}
            value={formData.regularPrice}
          />
          <div className="flex flex-col items-center">
            <p className="text-lg">Regular price</p>
            {formData.type === "rent" && <span className="text-xs">($ / month)</span>}
          </div>
        </div>

        {/* Discount Price (if offer selected) */}
        {formData.offer && (
          <div className="flex items-center space-x-2">
            <input
              type="number"
              id="discountPrice"
              min="0"
              max="10000000"
              required
              className="w-24 p-4 text-lg font-medium rounded-lg shadow-md bg-gray-50 border-2 border-gray-300 focus:outline-none focus:ring-4 focus:ring-teal-500 focus:border-teal-500"
              onChange={handleChange}
              value={formData.discountPrice}
            />
            <div className="flex flex-col items-center">
              <p className="text-lg">Discounted price</p>
              {formData.type === "rent" && <span className="text-xs">($ / month)</span>}
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Right Column (Image Upload) */}
    <div className="space-y-6">
      <p className="text-xl font-semibold text-gray-800">Images</p>
      <p className="text-gray-600 text-sm">
        The first image will be the cover (max 6)
      </p>

      {/* File Input and Upload Button */}
      <div className="flex gap-6">
        <input
          onChange={(e) => setFiles(e.target.files)}
          className="p-4 border-2 border-gray-300 rounded-lg w-full"
          type="file"
          id="images"
          accept="image/*"
          multiple
        />
        <button
          type="button"
          disabled={uploading}
          onClick={handleImageSubmit}
          className="p-4 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition duration-300 disabled:opacity-60"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {/* Image Upload Error */}
      <p className="text-red-600 text-sm">{imageUploadError && imageUploadError}</p>

      {/* Uploaded Images */}
      {formData.imageUrls.length > 0 &&
        formData.imageUrls.map((url, index) => (
          <div key={url} className="flex justify-between p-4 border-2 border-gray-200 rounded-lg items-center mt-4">
            <img src={url} alt="listing image" className="w-24 h-24 object-cover rounded-lg" />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="p-2 text-red-600 bg-white border border-red-600 rounded-lg hover:bg-red-100 transition duration-200"
            >
              Delete
            </button>
          </div>
        ))}

      {/* Submit Button */}
      <button
        disabled={loading || uploading}
        className="p-5 bg-teal-600 text-white rounded-lg text-lg uppercase hover:bg-teal-700 transition duration-300 disabled:opacity-60"
      >
        {loading ? "Creating..." : "Create Listing"}
      </button>

      {/* Error Message */}
      {error && <p className="text-red-700 text-sm">{error}</p>}
    </div>
  </form>
</main>

  );
}