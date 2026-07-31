// app/room/[roomId]/page.tsx

import RoomContent from "@/components/room/RoomContent.client";

interface PageProps {
  params: Promise<{ roomId: string }>; 
}

export default async function RoomPage({ params }: PageProps) {
    const { roomId } = await params;
  return <RoomContent roomId={roomId} />;
}