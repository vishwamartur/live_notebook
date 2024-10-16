import AddDocumentBtn from '@/components/AddDocumentBtn';
import { DeleteModal } from '@/components/DeleteModal';
import Header from '@/components/Header'
import Notifications from '@/components/Notifications';
import { Button } from '@/components/ui/button'
import { getDocuments } from '@/lib/actions/room.actions';
import { dateConverter } from '@/lib/utils';
import { SignedIn, UserButton } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const Home = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    console.warn("No user found, redirecting to sign-in...");
    redirect('/sign-in');
    return;
  }

  const roomDocuments = await getDocuments(clerkUser.emailAddresses[0].emailAddress);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 to-blue-900 text-white">
      <Header className="sticky left-0 top-0 z-10 bg-opacity-90 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Notifications />
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </Header>

      <div className="container mx-auto px-4 py-12">
        {roomDocuments.data.length > 0 ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold tracking-tight">Your Documents</h1>
              <AddDocumentBtn 
                userId={clerkUser.id}
                email={clerkUser.emailAddresses[0].emailAddress}
              />
            </div>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {roomDocuments.data.map(({ id, metadata, createdAt }: any) => (
                <li key={id} className="group relative overflow-hidden rounded-xl bg-white bg-opacity-10 transition-all hover:bg-opacity-20">
                  <Link href={`/documents/${id}`} className="block p-6">
                    <div className="flex items-center gap-4">
                      <div className="rounded-md bg-indigo-600 p-3">
                        <Image 
                          src="/assets/icons/doc.svg"
                          alt="file"
                          width={24}
                          height={24}
                        />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold line-clamp-1">{metadata.title}</h2>
                        <p className="text-sm text-indigo-200">Created {dateConverter(createdAt)}</p>
                      </div>
                    </div>
                  </Link>
                  <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <DeleteModal roomId={id} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <Image 
              src="/assets/icons/doc.svg"
              alt="Document"
              width={80}
              height={80}
              className="opacity-50"
            />
            <h2 className="text-3xl font-bold">No documents yet</h2>
            <p className="text-xl text-indigo-200">Create your first document to get started</p>
            <AddDocumentBtn 
              userId={clerkUser.id}
              email={clerkUser.emailAddresses[0].emailAddress}
            />
          </div>
        )}
      </div>
    </main>
  )
}

export default Home