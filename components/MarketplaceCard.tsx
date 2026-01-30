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
    image_url?: string;
}

interface MarketplaceCardProps {
    listing: Listing;
    onBook?: () => void;
}


export default function MarketplaceCard({ listing, onBook }: MarketplaceCardProps) {
    const isAvailable = listing.status === "Available";
    return (
        <Card className="group mb-6 flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">

            {/* Image */}
            {listing.image_url && (
                <div className="relative h-44 overflow-hidden">
                    <img
                        src={listing.image_url}
                        alt={listing.crop_type}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* subtle overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

                    {/* Status */}
                    <span
                        className={`absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide
              ${isAvailable
                                ? "bg-emerald-600 text-white"
                                : "bg-slate-400 text-white"
                            }`}
                    >
                        {listing.status}
                    </span>
                </div>
            )}

            {/* Content */}
            <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                    {/* Title */}
                    <div className="mb-3 flex items-start justify-between gap-2">
                        <h3 className="flex flex-wrap items-center gap-2 text-lg font-extrabold text-slate-800">
                            {listing.crop_type}
                            <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-bold uppercase text-emerald-700">
                                Material
                            </span>
                        </h3>
                    </div>

                    {/* Type */}
                    <p className="mb-3 text-sm font-medium text-slate-500">
                        Waste Type:{" "}
                        <span className="font-semibold text-slate-700">
                            {listing.waste_type}
                        </span>
                    </p>

                    {/* Meta info */}
                    <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                        <div>
                            <p className="text-xs uppercase tracking-wide text-slate-400">
                                Quantity
                            </p>
                            <p className="font-bold text-slate-800">
                                {listing.quantity} kg
                            </p>
                        </div>

                        <div>
                            <p className="text-xs uppercase tracking-wide text-slate-400">
                                Available
                            </p>
                            <p className="font-bold text-slate-800">
                                {listing.availability_date}
                            </p>
                        </div>

                        <div className="col-span-2">
                            <p className="text-xs uppercase tracking-wide text-slate-400">
                                Location
                            </p>
                            <p className="truncate font-bold text-slate-800">
                                {listing.location}
                            </p>
                        </div>
                    </div>

                    {/* Price */}
                    {listing.price && (
                        <div className="mt-4 text-xl font-extrabold text-emerald-700">
                            ₹{listing.price}
                            <span className="ml-1 text-sm font-semibold text-slate-500">
                                / lot
                            </span>
                        </div>
                    )}
                </div>

                {/* Action */}
                <div className="mt-5 flex justify-end">
                    <button
                        className={`rounded-xl px-6 py-2.5 text-sm font-bold shadow-md transition-all active:scale-95
              ${isAvailable ? 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
                        onClick={isAvailable && typeof onBook === 'function' ? onBook : undefined}
                        disabled={!isAvailable}
                    >
                        {isAvailable ? 'Request Offer' : 'Booked'}
                    </button>
                </div>
            </div>
        </Card>
    );
}
