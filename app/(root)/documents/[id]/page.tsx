import CollaborativeRoom from "@/components/CollaborativeRoom"
import { getDocument } from "@/lib/actions/room.actions";
import { getClerkUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Loader from "@/components/Loader";
import ErrorBoundary from "@/components/ErrorBoundary";

const Document = async ({ params: { id } }: SearchParamProps) => {
  const clerkUser = await currentUser();
  if(!clerkUser) redirect('/sign-in');

  let room;
  try {
    room = await getDocument({
      roomId: id,
      userId: clerkUser.emailAddresses[0].emailAddress,
    });
  } catch (error) {
    console.error("Error fetching document:", error);
    return <ErrorDisplay message="Error loading document. Please try again later." />;
  }

  if(!room) redirect('/');

  let users;
  try {
    const userIds = Object.keys(room.usersAccesses);
    users = await getClerkUsers({ userIds });
  } catch (error) {
    console.error("Error fetching users:", error);
    return <ErrorDisplay message="Error loading user data. Please try again later." />;
  }

  const usersData = users.map((user: User) => ({
    ...user,
    userType: room.usersAccesses[user.email]?.includes('room:write')
      ? 'editor'
      : 'viewer'
  }))

  const currentUserType = room.usersAccesses[clerkUser.emailAddresses[0].emailAddress]?.includes('room:write') ? 'editor' : 'viewer';

  return (
    <main className="flex w-full min-h-screen bg-gradient-to-br from-indigo-900 to-blue-900">
      <ErrorBoundary>
        <Suspense fallback={<Loader />}>
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <CollaborativeRoom 
              roomId={id}
              roomMetadata={room.metadata}
              users={usersData}
              currentUserType={currentUserType}
            />
          </div>
        </Suspense>
      </ErrorBoundary>
    </main>
  )
}

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg" role="alert">
      <p className="font-bold">Error</p>
      <p>{message}</p>
    </div>
  </div>
);

export default Document
