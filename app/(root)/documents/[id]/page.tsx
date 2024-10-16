import CollaborativeRoom from "@/components/CollaborativeRoom"
import { getDocument } from "@/lib/actions/room.actions";
import { getClerkUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";

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
    return <div>Error loading document. Please try again later.</div>;
  }

  if(!room) redirect('/');

  let users;
  try {
    const userIds = Object.keys(room.usersAccesses);
    users = await getClerkUsers({ userIds });
  } catch (error) {
    console.error("Error fetching users:", error);
    return <div>Error loading user data. Please try again later.</div>;
  }

  const usersData = users.map((user: User) => ({
    ...user,
    userType: room.usersAccesses[user.email]?.includes('room:write')
      ? 'editor'
      : 'viewer'
  }))

  const currentUserType = room.usersAccesses[clerkUser.emailAddresses[0].emailAddress]?.includes('room:write') ? 'editor' : 'viewer';

  return (
    <main className="flex w-full flex-col items-center">
      <CollaborativeRoom 
        roomId={id}
        roomMetadata={room.metadata}
        users={usersData}
        currentUserType={currentUserType}
      />
    </main>
  )
}

export default Document