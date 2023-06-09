import { getToken } from 'next-auth/jwt';
import { getSession } from 'next-auth/react';

import UserProfile from '../components/profile/user-profile';

function ProfilePage() {
  return <UserProfile />;
}

export async function getServerSideProps(context: any) {
  const session = await getSession({ req: context.req })
  
  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default ProfilePage;
