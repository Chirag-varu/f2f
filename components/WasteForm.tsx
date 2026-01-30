"use client";
import { useState } from "react";
import Input from "./ui/Input";
import {Button} from "./ui/button";
export default function WasteForm() {
  const [form, setForm] = useState({
    crop_type: "",
    waste_type: "",
    quantity: "",
    availability_date: "",
    location: ""
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call API to submit waste listing
    alert("Listing submitted! (API integration needed)");
  };
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Upload Waste Listing</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Crop Type</label>
          <Input name="crop_type" value={form.crop_type} onChange={handleChange} required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Waste Type</label>
          <Input name="waste_type" value={form.waste_type} onChange={handleChange} required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Quantity (kg)</label>
          <Input name="quantity" type="number" value={form.quantity} onChange={handleChange} required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Availability Date</label>
          <Input name="availability_date" type="date" value={form.availability_date} onChange={handleChange} required />
        </div>
        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">Location (GPS or Address)</label>
          <Input name="location" value={form.location} onChange={handleChange} required />
        </div>
      </div>
      <Button type="submit" className="mt-4">Submit Listing</Button>
    </form>
  );
}
