

export type Location = {
  title: string;
  description: string;
  properties: HouseData[]
}

export type HouseData = {
  imageUrl: string,
  beds: number,
  baths: number,
  title: string,
  price: number,
  reviewCount: number,
  rating: number,
}

const LosAngelesLoc: Location = {
  title: 'Los Angeles',
  description: "Live like the stars in these luxurious Southern California estates.",
  properties: [
    {
      imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      beds: 3,
      baths: 2,
      title: "Modern home in city center",
      price: 190000,
      reviewCount: 34,
      rating: 4,
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      beds: 4,
      baths: 1,
      title: "Quiet living outside the city",
      price: 175000,
      reviewCount: 12,
      rating: 3,
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
      beds: 5,
      baths: 4,
      title: "Renovated apartment uptown",
      price: 200000,
      reviewCount: 54,
      rating: 5,
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      beds: 3,
      baths: 2,
      title: "Family home in the suburbs",
      price: 115000,
      reviewCount: 34,
      rating: 4,
    },
  ]
}
const PhoenixLoc: Location = {
  title: 'Phoenix',
  description: "Escape the cold and enjoy great weather without breaking the bank.",
  properties: [
    {
      imageUrl: 'https://images.unsplash.com/photo-1447958272669-9c562446304f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
      beds: 3,
      baths: 2,
      title: "Modern home in city center",
      price: 190000,
      reviewCount: 34,
      rating: 4,
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1475855581690-80accde3ae2b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
      beds: 4,
      baths: 1,
      title: "Quiet living outside the city",
      price: 175000,
      reviewCount: 12,
      rating: 3,
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1472224371017-08207f84aaae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      beds: 5,
      baths: 4,
      title: "Renovated apartment uptown",
      price: 200000,
      reviewCount: 54,
      rating: 5,
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      beds: 3,
      baths: 2,
      title: "Family home in the suburbs",
      price: 115000,
      reviewCount: 34,
      rating: 4,
    },
  ]
}
const DallasLoc: Location = {
  title: 'Dallas',
  description: "Experience Texas living in these awesome ranch-style homes.",
  properties: [
    {
      imageUrl: 'https://images.unsplash.com/photo-1471231681582-352356ab45a0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
      beds: 3,
      baths: 2,
      title: "Modern home in city center",
      price: 190000,
      reviewCount: 34,
      rating: 4,
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1533779283484-8ad4940aa3a8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=80',
      beds: 4,
      baths: 1,
      title: "Quiet living outside the city",
      price: 175000,
      reviewCount: 12,
      rating: 3,
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1432303492674-642e9d0944b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      beds: 5,
      baths: 4,
      title: "Renovated apartment uptown",
      price: 200000,
      reviewCount: 54,
      rating: 5,
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      beds: 3,
      baths: 2,
      title: "Family home in the suburbs",
      price: 115000,
      reviewCount: 34,
      rating: 4,
    },
  ]
}

export async function getHousesData(): Promise<Location[]> {

  const data: Location[] = [
    LosAngelesLoc,
    PhoenixLoc,
    DallasLoc
  ]
  return data;
}

