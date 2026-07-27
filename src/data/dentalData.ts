import { 
  Service, 
  Doctor, 
  FaqItem, 
  Appointment, 
  WhyChooseUsFeature, 
  Testimonial, 
  StatItem, 
  BlogPost 
} from '../types';

export const CLINIC_STATS: StatItem[] = [
  {
    id: 'happy-patients',
    value: 10000,
    suffix: '+',
    label: 'Happy Patients',
    sublabel: 'Treated with care',
    icon: 'Users'
  },
  {
    id: 'years-experience',
    value: 20,
    suffix: '+',
    label: 'Years Experience',
    sublabel: 'Excellence in dentistry',
    icon: 'Award'
  },
  {
    id: 'expert-dentists',
    value: 15,
    suffix: '+',
    label: 'Expert Dentists',
    sublabel: 'Specialized clinicians',
    icon: 'Stethoscope'
  },
  {
    id: 'treatments',
    value: 25000,
    suffix: '+',
    label: 'Successful Treatments',
    sublabel: 'High satisfaction rate',
    icon: 'CheckCircle2'
  },
  {
    id: 'google-rating',
    value: 4.9,
    suffix: ' / 5.0',
    label: 'Google Rating',
    sublabel: 'Based on 1,200+ reviews',
    icon: 'Star'
  }
];

export const CLINIC_SERVICES: Service[] = [
  {
    id: 'whitening',
    name: 'Laser Teeth Whitening',
    category: 'Cosmetic Dentistry',
    description: 'Advanced in-office laser whitening treatment that brightens teeth up to 8 shades in a single 60-minute session with zero enamel sensitivity.',
    price: '$299',
    duration: '60 mins',
    icon: 'Sparkles',
    popular: true,
    beforeAfterImage: {
      before: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80',
      after: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80'
    }
  },
  {
    id: 'invisalign',
    name: 'Invisalign® Clear Aligners',
    category: 'Orthodontics',
    description: 'Custom 3D-scanned invisible aligners designed to straighten your smile comfortably without metal brackets or wires.',
    price: '$3,499 - $4,999',
    duration: '6-18 months',
    icon: 'Smile',
    popular: true,
    beforeAfterImage: {
      before: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=600&q=80',
      after: 'https://images.unsplash.com/photo-1571772996211-2f02c9727629?auto=format&fit=crop&w=600&q=80'
    }
  },
  {
    id: 'implants',
    name: '3D Precision Dental Implants',
    category: 'Restorative Dentistry',
    description: 'Permanent titanium implant post topped with a custom porcelain crown that looks, feels, and functions like a natural tooth.',
    price: '$1,899 / tooth',
    duration: '90 mins per stage',
    icon: 'ShieldCheck',
    popular: false,
    beforeAfterImage: {
      before: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=600&q=80',
      after: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80'
    }
  },
  {
    id: 'veneers',
    name: 'Porcelain Veneers',
    category: 'Cosmetic Dentistry',
    description: 'Ultra-thin handcrafted ceramic shells permanently bonded to the front of teeth to correct discoloration, gaps, or chips.',
    price: '$850 / tooth',
    duration: '2 appointments',
    icon: 'Gem',
    popular: true
  },
  {
    id: 'root-canal',
    name: 'Painless Root Canal Therapy',
    category: 'Endodontics',
    description: 'Gentle, painless laser-assisted therapy to remove infected nerve tissue, relieve pain immediately, and save your natural tooth.',
    price: '$650 - $950',
    duration: '75 mins',
    icon: 'Activity',
    popular: false
  },
  {
    id: 'cleaning',
    name: 'Preventive Teeth Cleaning',
    category: 'General Dentistry',
    description: 'Comprehensive dental exam, ultrasonic calculus removal, polishing, and topical fluoride varnish for optimal oral health.',
    price: '$149',
    duration: '45 mins',
    icon: 'CheckCircle2',
    popular: false
  },
  {
    id: 'emergency',
    name: '24/7 Emergency Dental Care',
    category: 'Emergency Care',
    description: 'Immediate same-day relief for severe toothaches, broken teeth, lost crowns, or acute dental trauma.',
    price: '$150 consultation',
    duration: 'Immediate',
    icon: 'Zap',
    popular: false
  }
];

export const WHY_CHOOSE_US_FEATURES: WhyChooseUsFeature[] = [
  {
    id: 'tech',
    title: 'Advanced Dental Technology',
    description: 'Equipped with 3D CBCT digital scanners, painless laser therapy, and CAD/CAM same-day crown milling.',
    icon: 'Cpu',
    badge: '3D Imaging'
  },
  {
    id: 'doctors',
    title: 'Experienced Specialists',
    description: 'Ivy League educated dentists with over 20+ years of combined clinical mastery and gentle patient care.',
    icon: 'UserCheck',
    badge: 'Top 1%'
  },
  {
    id: 'pain-free',
    title: 'Pain-Free Treatment Protocol',
    description: 'Painless computer-assisted anesthesia and comforting amenities ensure a relaxed, anxiety-free visit.',
    icon: 'HeartPulse',
    badge: 'Zero Pain'
  },
  {
    id: 'affordable',
    title: 'Affordable Transparent Pricing',
    description: 'Clear upfront quotes with 0% APR monthly financing plans via CareCredit and direct insurance handling.',
    icon: 'BadgeDollarSign',
    badge: '0% Financing'
  },
  {
    id: 'flexible',
    title: 'Flexible Evening & Weekend Slots',
    description: 'Open early mornings, late evenings, and Saturdays to accommodate your busy family and work schedules.',
    icon: 'Calendar',
    badge: 'Open Sat'
  },
  {
    id: 'personalized',
    title: 'Personalized Patient Care',
    description: 'Bespoke treatment plans tailored specifically to your facial symmetry, aesthetic goals, and oral health.',
    icon: 'Sparkles',
    badge: 'Custom Care'
  }
];

export const CLINIC_DOCTORS: Doctor[] = [
  {
    id: 'dr-jenkins',
    name: 'Dr. Sarah Jenkins, DDS',
    title: 'Lead Cosmetic & Restorative Specialist',
    specialty: 'Cosmetic Dentistry, Veneers & Laser Whitening',
    experience: '14+ Years Experience',
    education: 'UCSF School of Dentistry (Magna Cum Laude)',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
    availableDays: ['Mon', 'Tue', 'Thu', 'Fri'],
    rating: 4.95,
    languages: ['English', 'Spanish'],
    socials: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'dr.jenkins@smilesyncdental.com'
    }
  },
  {
    id: 'dr-vance',
    name: 'Dr. Marcus Vance, DMD',
    title: 'Orthodontic & Invisalign Specialist',
    specialty: 'Invisalign®, Airway Orthodontics & Jaw Alignment',
    experience: '11+ Years Experience',
    education: 'Harvard School of Dental Medicine',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    availableDays: ['Mon', 'Wed', 'Fri', 'Sat'],
    rating: 4.98,
    languages: ['English', 'French'],
    socials: {
      linkedin: 'https://linkedin.com',
      email: 'dr.vance@smilesyncdental.com'
    }
  },
  {
    id: 'dr-rostova',
    name: 'Dr. Elena Rostova, DDS',
    title: 'Pediatric & Preventive Dental Specialist',
    specialty: 'Pediatric Dentistry, Fluoride & Sealants',
    experience: '9+ Years Experience',
    education: 'UCLA School of Dentistry',
    image: 'https://images.unsplash.com/photo-1594824813566-78a9c47e834a?auto=format&fit=crop&w=600&q=80',
    availableDays: ['Tue', 'Wed', 'Thu', 'Sat'],
    rating: 4.92,
    languages: ['English', 'Russian'],
    socials: {
      linkedin: 'https://linkedin.com',
      email: 'dr.rostova@smilesyncdental.com'
    }
  }
];

export const CLINIC_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Jessica Thorne',
    role: 'Creative Director',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    rating: 5,
    review: 'Dr. Jenkins and the SmileSync team completely transformed my confidence with porcelain veneers! The process was completely painless and the staff treated me like family from day one.',
    serviceReceived: 'Porcelain Veneers',
    date: '2 weeks ago'
  },
  {
    id: 'test-2',
    name: 'Michael Reynolds',
    role: 'Tech Founder',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    rating: 5,
    review: 'I completed my Invisalign treatment in just 8 months with Dr. Vance. The 3D scan preview was spot on, and the office atmosphere feels more like a modern spa than a dental clinic!',
    serviceReceived: 'Invisalign® Clear Aligners',
    date: '1 month ago'
  },
  {
    id: 'test-3',
    name: 'Sophia Patel',
    role: 'Architect',
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    rating: 5,
    review: 'The Laser Whitening session took only one hour and my teeth look shades brighter with zero sensitivity. Their online scheduling is so slick and easy.',
    serviceReceived: 'Laser Teeth Whitening',
    date: '3 weeks ago'
  },
  {
    id: 'test-4',
    name: 'Robert Vance',
    role: 'Financial Analyst',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    rating: 5,
    review: 'Had an emergency root canal over the weekend. They got me in within two hours and removed all pain instantly. Truly the gold standard in dental care.',
    serviceReceived: 'Emergency Dental Care',
    date: '1 week ago'
  }
];

export const CLINIC_BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    title: '5 Essential Tips for Maintaining Whiter Teeth After Laser Treatment',
    summary: 'Discover how to protect your enamel and maintain a luminous, stain-free smile for up to 24 months with simple daily diet and hygiene habits.',
    category: 'Oral Health & Aesthetics',
    date: 'July 24, 2026',
    readTime: '4 min read',
    author: 'Dr. Sarah Jenkins, DDS',
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'blog-2',
    title: 'Understanding 3D Guided Dental Implants: Procedure & Recovery',
    summary: 'Everything you need to know about permanent titanium implants, computer-guided placement accuracy, and what to expect during healing.',
    category: 'Restorative Dentistry',
    date: 'July 18, 2026',
    readTime: '6 min read',
    author: 'Dr. Marcus Vance, DMD',
    image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'blog-3',
    title: 'Invisalign vs. Traditional Metal Braces: Which is Right for You?',
    summary: 'A detailed comparison of clear removable aligners versus traditional wire braces regarding comfort, aesthetic appearance, treatment speed, and cost.',
    category: 'Orthodontic Care',
    date: 'July 10, 2026',
    readTime: '5 min read',
    author: 'Dr. Elena Rostova, DDS',
    image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=600&q=80'
  }
];

export const CLINIC_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Services & Pricing',
    question: 'How much does laser teeth whitening cost and how long does it last?',
    answer: 'Our Laser Teeth Whitening package costs $299. It includes a 60-minute in-office laser treatment plus custom takeaway touch-up trays. Results last between 12 to 24 months with normal dental hygiene.'
  },
  {
    id: 'faq-2',
    category: 'Appointments',
    question: 'How do I book an appointment and reschedule if needed?',
    answer: 'You can book directly using our instant online appointment form or call our desk at +1 (555) 321-4321. Rescheduling is free up to 24 hours prior to your scheduled slot.'
  },
  {
    id: 'faq-3',
    category: 'Insurance & Financing',
    question: 'Which dental insurance plans do you accept?',
    answer: 'SmileSync accepts Delta Dental, Cigna, MetLife, Aetna, Guardian, Humana, and United Healthcare. We also offer 0% APR interest-free flexible payment plans via CareCredit.'
  },
  {
    id: 'faq-4',
    category: 'Emergency Care',
    question: 'Do you offer same-day emergency appointments for severe pain?',
    answer: 'Yes! We reserve dedicated daily emergency slots. If you are experiencing severe toothache, bleeding, or a broken tooth, select Emergency Care in the booking form for immediate priority triage.'
  },
  {
    id: 'faq-5',
    category: 'Comfort & Safety',
    question: 'Are treatments pain-free for patients with dental anxiety?',
    answer: 'Absolutely. We utilize computer-assisted local anesthesia (Wand STA), gentle laser technology, noise-canceling headphones, and relaxing nitrous oxide option for completely stress-free visits.'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 101,
    patient_name: 'Sarah Miller',
    email: 'sarah.m@example.com',
    phone: '+1 (555) 839-2011',
    service: 'Laser Teeth Whitening',
    doctor: 'Dr. Sarah Jenkins, DDS',
    appointment_date: '2026-07-29',
    time_slot: '10:00 AM',
    notes: 'First time whitening patient. Interested in touch-up trays.',
    status: 'Confirmed',
    email_sent: true,
    created_at: '2026-07-27 09:15:00'
  },
  {
    id: 102,
    patient_name: 'David Chen',
    email: 'david.c@example.com',
    phone: '+1 (555) 492-1049',
    service: 'Invisalign® Clear Aligners',
    doctor: 'Dr. Marcus Vance, DMD',
    appointment_date: '2026-07-30',
    time_slot: '02:30 PM',
    notes: 'Free 3D Scan consultation for lower arch alignment',
    status: 'Awaiting Confirmation',
    email_sent: false,
    created_at: '2026-07-27 11:30:00'
  },
  {
    id: 103,
    patient_name: 'Emma Watson',
    email: 'emma.w@example.com',
    phone: '+1 (555) 912-8832',
    service: '3D Precision Dental Implants',
    doctor: 'Dr. Sarah Jenkins, DDS',
    appointment_date: '2026-08-01',
    time_slot: '11:15 AM',
    notes: 'Single molar implant consultation',
    status: 'Pending',
    email_sent: false,
    created_at: '2026-07-27 12:45:00'
  }
];
