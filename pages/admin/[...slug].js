// Catch all route to redirect to dashboard if admin page does not exist
const AdminPage = () => null;

export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/admin/dashboard',
      permanent: false,
    },
  };
}

export default AdminPage;
