import {Card} from "./ui/card";
export default function OfferCard({ offer }: { offer: any }) {
  return (
    <Card className="mb-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <div className="font-bold text-green-800 text-lg">Offer: ₹{offer.price}</div>
          <div className="text-green-700">Industry: {offer.industry_name}</div>
          <div className="text-green-700">Status: {offer.status}</div>
        </div>
        <div className="mt-4 md:mt-0">
          {/* Accept/Reject buttons for farmers, or status for industries */}
        </div>
      </div>
    </Card>
  );
}
