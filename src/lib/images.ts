const UNSPLASH_CDN = "https://images.unsplash.com";

function photo(id: string, width: number) {
  return `${UNSPLASH_CDN}/${id}?auto=format&fit=crop&w=${width}&q=75`;
}

export const IMAGES = {
  hero: photo("photo-1555066931-4365d14bab8c", 1800),
  learnByDoing: photo("photo-1531482615713-2afd69097998", 1000),
  whyChoose: photo("photo-1758073519996-6d3c63b4922c", 1600),
  ctaTeam: photo("photo-1573167507387-6b4b98cb7c13", 1000),
  coursesBanner: photo("photo-1607799279861-4dd421887fb3", 1800),
  about: photo("photo-1758611972589-0012481178f9", 1800),
  aboutCoding: photo("photo-1607799279861-4dd421887fb3", 800),
  aboutRobotics: photo("photo-1531746790731-6c087fecd65a", 800),
  aboutCoaching: photo("photo-1573497491208-6b1acb260507", 800),
  coaching: photo("photo-1573497491208-6b1acb260507", 1200),
  enterprise: photo("photo-1542744173-8e7e53415bb0", 1800),
  enterpriseTeam: photo("photo-1573167507387-6b4b98cb7c13", 1000),
  jobs: photo("photo-1521791136064-7986c2920216", 1800),
  contact: photo("photo-1553775282-20af80779df7", 1000),
  auth: photo("photo-1644088379091-d574269d422f", 1400),
} as const;

export const COURSE_IMAGES = {
  coding: photo("photo-1607799279861-4dd421887fb3", 800),
  literacy: photo("photo-1519389950473-47ba0277781c", 800),
  career: photo("photo-1573496130407-57329f01f769", 800),
  iot: photo("photo-1603732551658-5fabbafa84eb", 800),
  robotics: photo("photo-1485827404703-89b55fcc595e", 800),
} as const;

const CATEGORY_FALLBACKS: Record<string, string> = {
  "Coding & Programming": COURSE_IMAGES.coding,
  "Digital Literacy": COURSE_IMAGES.literacy,
  "Career Coaching": COURSE_IMAGES.career,
  "Robotics & IoT": COURSE_IMAGES.robotics,
};

/** The course's own thumbnail, else a photo for its category, else null. */
export function courseImage(course: { thumbnailUrl: string | null; category: string }) {
  return course.thumbnailUrl || CATEGORY_FALLBACKS[course.category] || null;
}
