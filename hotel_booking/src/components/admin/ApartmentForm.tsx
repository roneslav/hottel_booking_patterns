// components/admin/ApartmentForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Upload, X } from "lucide-react";

export default function ApartmentForm({ categories, apartment }: { categories: any[] | null; apartment?: any }) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<(typeof apartment.apartment_images[0] & { deleting?: boolean })[]>(
    apartment?.apartment_images || []
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setUploading(true);

  //   const formData = new FormData(e.currentTarget);
  //   const data: any = Object.fromEntries(formData);

  //   // Завантаження нових фото
  //   const uploadedUrls: string[] = [];
  //   if (images.length > 0) {
  //     const uploadForm = new FormData();
  //     images.forEach(img => uploadForm.append("files", img));

  //     const uploadRes = await fetch("/api/upload", {
  //       method: "POST",
  //       body: uploadForm,
  //     });

  //     if (!uploadRes.ok) {
  //       alert("Failed to upload images");
  //       setUploading(false);
  //       return;
  //     }

  //     const uploadData = await uploadRes.json();
  //     uploadedUrls.push(...uploadData.urls);
  //   }

  //   // Формуємо дані
  //   const payload: any = {
  //     title: data.title,
  //     description: data.description || null,
  //     city: data.city,
  //     price: Number(data.price),
  //     guests: Number(data.guests),
  //     category_id: data.category_id,
  //   };

  //   if (apartment) payload.id = apartment.id;

  //   // Якщо є нові фото — додаємо їх
  //   if (uploadedUrls.length > 0) {
  //     payload.new_images = uploadedUrls;
  //   }

  //   const res = await fetch("/api/admin/apartments", {
  //     method: apartment ? "PUT" : "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(payload),
  //   });

  //   if (res.ok) {
  //     router.push("/admin/apartments");
  //     router.refresh();
  //   } else {
  //     const err = await res.json();
  //     alert(err.error || "Error saving apartment");
  //   }
  //   setUploading(false);
  // };

  const removeNewImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imageId: string) => {
    if (!confirm("Delete this photo permanently?")) return;

    // Оптимістично видаляємо з UI
    setExistingImages(prev => prev.map(img =>
      img.id === imageId ? { ...img, deleting: true } : img
    ));

    const res = await fetch("/api/admin/apartment-images", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_id: imageId }),
    });

    if (res.ok) {
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
    } else {
      alert("Failed to delete photo");
      setExistingImages(prev => prev.filter(img => !img.deleting));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData(e.currentTarget);
    const data: any = Object.fromEntries(formData);

    // Завантажуємо нові фото
    const uploadedUrls: string[] = [];
    if (images.length > 0) {
      const uploadForm = new FormData();
      images.forEach(img => uploadForm.append("files", img));

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadForm,
      });

      if (!uploadRes.ok) {
        alert("Failed to upload images");
        setUploading(false);
        return;
      }

      const { urls } = await uploadRes.json();
      uploadedUrls.push(...urls);
    }

    const payload: any = {
      title: data.title,
      description: data.description || null,
      city: data.city,
      price: Number(data.price),
      guests: Number(data.guests),
      category_id: data.category_id,
      new_images: uploadedUrls,
    };

    if (apartment) payload.id = apartment.id;

    const res = await fetch("/api/admin/apartments", {
      method: apartment ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/admin/apartments");
      router.refresh();
    } else {
      alert("Error saving apartment");
    }
    setUploading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center">
        {apartment ? "Edit Apartment" : "Create New Apartment"}
      </h2>

      {/* Основні поля */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input name="title" placeholder="Title" defaultValue={apartment?.title} required className="p-3 border rounded-lg dark:bg-gray-700" />
        <input name="city" placeholder="City" defaultValue={apartment?.city} required className="p-3 border rounded-lg dark:bg-gray-700" />
        <input name="price" type="number" placeholder="Price per night ($)" defaultValue={apartment?.price} required className="p-3 border rounded-lg dark:bg-gray-700" />
        <input name="guests" type="number" placeholder="Max guests" defaultValue={apartment?.guests} required className="p-3 border rounded-lg dark:bg-gray-700" />
        
        <select name="category_id" defaultValue={apartment?.category_id || ""} required className="p-3 border rounded-lg dark:bg-gray-700">
          <option value="" disabled>Select category</option>
          {categories?.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <textarea
        name="description"
        placeholder="Description (optional)"
        defaultValue={apartment?.description || ""}
        rows={4}
        className="w-full p-3 border rounded-lg dark:bg-gray-700"
      />

      {/* Завантаження фото */}
      <div className="space-y-4">
        <label className="block text-lg font-medium">Photos</label>

        {/* Існуючі фото */}
        {existingImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {existingImages.map(img => (
              <div key={img.id} className="relative group">
                <img
                  src={img.image_url}
                  alt="Apartment"
                  className={`w-full h-40 object-cover rounded-lg shadow ${img.deleting ? "opacity-50" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(img.id)}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition"
                  disabled={img.deleting}
                >
                  {img.deleting ? "..." : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Нові фото */}
        <label className="block text-lg font-medium">Preview Photos</label>
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {images.map((file, i) => (
              <div key={i} className="relative group">
                <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-40 object-cover rounded-lg shadow" />
                <button
                  type="button"
                  onClick={() => removeNewImage(i)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:border-blue-500 transition">
          <div className="text-center">
            <Upload className="w-10 h-10 mx-auto text-gray-500" />
            <p className="text-sm text-gray-600 mt-2">Click to upload photos</p>
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-bold py-4 rounded-lg text-lg transition"
      >
        {uploading ? "Saving..." : apartment ? "Update Apartment" : "Create Apartment"}
      </button>
    </form>
  );
}