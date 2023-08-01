/* layout.tsx is by default a server component
   and cannot be set to to a client component
*/

import './globals.css'

import Navbar from './components/navbar/Navbar'
import { Nunito } from 'next/font/google'
import ClientOnly from './components/ClientOnly'
import LoginModal from './components/modals/LoginModal'
import RegisterModal from './components/modals/RegisterModal'
import RentModal from './components/modals/RentModal'
import SearchModal from './components/modals/SearchModal'

import ToasterProvider from './providers/ToasterProvider'
import getCurrentUser from './actions/getCurrentUser'

const nunito = Nunito({subsets: ['latin']})

export const metadata = {
  title: 'Airbnb Clone',
  description: 'Airbnb Clone Project',
}

/* if we are using await our function must always be
   an async function 
*/
export default async function RootLayout({
  // this children is a props
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser();
  /* we are going to pass this current user 
     into the navbar component
  */
  return (
    <html lang="en">
      <body className={nunito.className}>
        <ClientOnly>
          <ToasterProvider />
          <SearchModal />
          <RentModal />
          <LoginModal />
          <RegisterModal />
          <Navbar 
            currentUser={currentUser} // this is called a typescript error
          />
        </ClientOnly>
        <div className='pb-20 pt-28'>
          {children}
        </div>
      </body>
    </html>
  )
}

