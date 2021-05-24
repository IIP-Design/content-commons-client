// Catch all route to redirect to dashboard if package id is not present
const PackagePage = () => null;

export async function getServerSideProps() {
  return {
    redirect: {
      destination: '/admin/dashboard',
      permanent: false,
    },
  };
}

export default PackagePage;
