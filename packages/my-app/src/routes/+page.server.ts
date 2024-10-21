import tt0099487 from '$lib/server.data/tt0099487.json';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const data1 = tt0099487; // JSON.parse( fs.readFileSync('C:/code/andrewcrobertson/subtext.data/__data__/data/tt0099487.json', 'utf-8'))
  // const data = siteData.map(({ id }) => ({ id }))
  return { data: { title: data1.title } };
};
