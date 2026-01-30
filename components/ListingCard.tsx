import Card from "./ui/card";
export default function ListingCard({ listing }: { listing: any }) {
  return (
    <Card className="mb-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <div className="font-bold text-green-800 text-lg">{listing.crop_type} ({listing.waste_type})</div>
          <div className="text-green-700">Quantity: {listing.quantity} kg</div>
          <div className="text-green-700">Available: {listing.availability_date}</div>
          <div className="text-green-700">Location: {listing.location}</div>
        </div>
        <div className="mt-4 md:mt-0">
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">{listing.status}</span>
        </div>
      </div>
    </Card>
  );
}
