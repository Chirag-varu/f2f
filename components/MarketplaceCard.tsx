
import { Card } from "./ui/card";

interface Listing {
  id: string;
  crop_type: string;
  waste_type: string;
  quantity: string;
  availability_date: string;
  location: string;
  status: string;
  price?: string | null;
}

interface MarketplaceCardProps {
  listing: Listing;
}

export default function MarketplaceCard({ listing }: MarketplaceCardProps) {
  return (
    <Card className="mb-4 p-6 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <div className="font-bold text-lg text-green-800 mb-1">
          {listing.crop_type} <span className="text-gray-500">({listing.waste_type})</span>
        </div>
        <div className="text-green-700 mb-1">Quantity: {listing.quantity} kg</div>
        <div className="text-green-700 mb-1">Available: {listing.availability_date}</div>
        <div className="text-green-700">Location: {listing.location}</div>
        {listing.price && (
          <div className="text-green-900 font-bold mt-2">Price: ₹{listing.price}</div>
        )}
      </div>
      <div className="mt-4 md:mt-0 flex flex-col items-end">
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm mb-2">{listing.status}</span>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-700 transition">Request Offer</button>
      </div>
    </Card>
  );
}
