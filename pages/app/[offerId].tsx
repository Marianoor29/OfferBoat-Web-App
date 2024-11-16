import Head from 'next/head';

export async function getServerSideProps(context: { params: { offerId: any; }; }) {
  const { offerId } = context.params;

  // Fetch offer data from your backend API
  const response = await fetch(`https://www.offerboats.com/listing/getListingById/${offerId}`); 
  if (!response.ok) {
    return { notFound: true }; 
  }
  const offer = await response.json();

  return { props: { offer } };
}

export default function OfferPage({ offer }:any) {
  return (
    <>
      <Head>
        <title>{offer.title}</title>
        <meta property="og:title" content={offer.title} />
        <meta property="og:description" content={offer.description} />
        <meta property="og:image" content={offer.images[0]} />
        <meta property="og:url" content={`https://www.offerboat.com/app/${offer._id}`} />
        <meta property="og:type" content="website" />
      </Head>
      <div>
        <h1>{offer.title}</h1>
        <p>{offer.description}</p>
       
      </div>
    </>
  );
}
