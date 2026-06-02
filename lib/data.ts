export const PROVINCES: Record<string, string[]> = {
  Western: ['Colombo', 'Gampaha', 'Kalutara'],
  Central: ['Kandy', 'Matale', 'Nuwara Eliya'],
  Southern: ['Galle', 'Matara', 'Hambantota'],
  Northern: ['Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu'],
  Eastern: ['Trincomalee', 'Batticaloa', 'Ampara'],
  'North Western': ['Kurunegala', 'Puttalam'],
  'North Central': ['Anuradhapura', 'Polonnaruwa'],
  Uva: ['Badulla', 'Monaragala'],
  Sabaragamuwa: ['Ratnapura', 'Kegalle'],
}

export const VEHICLE_TYPES = [
  'Car',
  'SUV',
  'Van',
  'Mini Bus',
  'Bus',
  'Lorry / Truck',
  'Motorbike',
  'Tuk Tuk',
  'Wedding Car',
]

export const ALL_DISTRICTS = Object.values(PROVINCES).flat()

export const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1600&q=80',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=80',
  'https://images.unsplash.com/photo-1493238792000-8113da705763?w=1600&q=80',
  'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1600&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80',
]

// Default fallback images shown on vehicle cards when no photo is uploaded
export const DEFAULT_VEHICLE_IMAGES = [
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=800&auto=format&fit=crop&q=80',
]

export const STATS = [
  { value: '2.4k+', label: 'Vehicles' },
  { value: '180+', label: 'Partners' },
  { value: '25+', label: 'Districts' },
  { value: '4.8★', label: 'Rating' },
]
