import Link from "next/link"
import ClientOnly from "./components/ClientOnly";
import Container from "./components/Container";
import EmptyState from "./components/EmptyState";
import getListings, { IListingsParams } from "./actions/getListings";
import ListingCard from "./components/listings/ListingCard";
import getCurrentUser from "./actions/getCurrentUser";

interface HomeProps {
  searchParams: IListingsParams
}

/* since home is a server component we can call 
   the database directly, we don't need to create
   an API for that.
*/
//searchParams is always an object.
const Home = async ({ searchParams }: HomeProps) => {
  /* for us to use await it must be an asynchronous 
     function.
  */
  const listings = await getListings(searchParams);
  const currentUser = await getCurrentUser();

  if (listings.length === 0) {
    return (
      /* we use client only so it does not mess with
         hydration errors.
      */
      <ClientOnly>
        <EmptyState showReset />
      </ClientOnly>
    )
  }

  return (
    <ClientOnly>
      <Container>
        <div className="
          pt-24
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
          2xl:grid-cols-6
          gap-8
        ">
          {listings.map((listing) => {
            return (
              <ListingCard
              /* the listing card is going to accept 
                 different kind of props alongside this
                 data.
              */
                currentUser={currentUser}
                key={listing.id}
                data={listing}
              />
            )
          })}
        </div>
      </Container>
    </ClientOnly>
  )
}

export default Home;

/* Now let's create an individual page for each of
   this listings.
*/
















































































































































