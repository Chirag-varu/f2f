import Card from "./ui/card";
export default function Notification({ notification }: { notification: any }) {
  return (
    <Card className="mb-2">
      <div className="flex items-center">
        <span className="mr-2">🔔</span>
        <span>{notification.message}</span>
      </div>
    </Card>
  );
}
