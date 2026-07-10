import boxingImg from "@/assets/sport-boxing.jpg";
import crossfitImg from "@/assets/sport-crossfit.jpg";
import weightliftingImg from "@/assets/sport-weightlifting.jpg";
import yogaImg from "@/assets/sport-yoga.jpg";
import muayThaiImg from "@/assets/sport-muaythai.jpg";
import swimmingImg from "@/assets/sport-swimming.jpg";
import trainer1 from "@/assets/trainer-1.jpg";
import trainer2 from "@/assets/trainer-2.jpg";
import trainer3 from "@/assets/trainer-3.jpg";
import trainer4 from "@/assets/trainer-4.jpg";
import offerSummer from "@/assets/offer-summer.jpg";
import offerNewYear from "@/assets/offer-newyear.jpg";
import offerPt from "@/assets/offer-pt.jpg";

export const sports = [
  { id: "boxing", name: "Boxing", desc: "Footwork, defense, and explosive striking.", image: boxingImg, members: 142, level: "All levels" },
  { id: "crossfit", name: "CrossFit", desc: "High-intensity functional training for all-round capacity.", image: crossfitImg, members: 218, level: "Intermediate" },
  { id: "weightlifting", name: "Olympic Weightlifting", desc: "Snatch & clean and jerk technique with elite coaching.", image: weightliftingImg, members: 96, level: "Advanced" },
  { id: "yoga", name: "Yoga & Mobility", desc: "Recovery, mobility, and breath-led strength.", image: yogaImg, members: 174, level: "All levels" },
  { id: "muaythai", name: "Muay Thai", desc: "The art of eight limbs. Conditioning and combat.", image: muayThaiImg, members: 88, level: "All levels" },
  { id: "swimming", name: "Swimming", desc: "Technique-first sessions in our 25m lap pool.", image: swimmingImg, members: 64, level: "All levels" },
];

export const trainers = [
  { id: "viktor-drago", name: "Viktor Drago", role: "Head Strength Coach", img: trainer1, sport: "Weightlifting", years: 12, bio: "Former national weightlifting champion. Trained 4 olympians." },
  { id: "elena-soto", name: "Elena Soto", role: "Mobility & Yoga", img: trainer2, sport: "Yoga", years: 8, bio: "RYT-500 and physiotherapy background. Restorative specialist." },
  { id: "cassian-andor", name: "Cassian Andor", role: "Striking Coach", img: trainer3, sport: "Boxing / Muay Thai", years: 15, bio: "Former pro fighter. Coaches amateur to pro athletes." },
  { id: "maya-okafor", name: "Maya Okafor", role: "CrossFit Lead", img: trainer4, sport: "CrossFit", years: 9, bio: "L3 CrossFit trainer. Programming for hybrid athletes." },
];

export const plans = [
  { id: "hypertrophy-pro", title: "Hypertrophy Pro", desc: "12-week mass building program with 4 sessions per week.", trainer: "Viktor Drago", sport: "Weightlifting", price: 149, sessions: 48, level: "Advanced", schedule: ["Mon 18:00", "Wed 18:00", "Fri 18:00", "Sat 10:00"], offer: "SAVE 20%" },
  { id: "boxing-foundations", title: "Boxing Foundations", desc: "8-week beginner program. Stance, footwork, combinations.", trainer: "Cassian Andor", sport: "Boxing", price: 99, sessions: 24, level: "Beginner", schedule: ["Tue 17:00", "Thu 17:00", "Sat 12:00"], offer: null },
  { id: "metcon-elite", title: "MetCon Elite", desc: "High-intensity conditioning for hybrid athletes.", trainer: "Maya Okafor", sport: "CrossFit", price: 129, sessions: 36, level: "Intermediate", schedule: ["Mon 06:00", "Wed 06:00", "Fri 06:00"], offer: null },
  { id: "mobility-reset", title: "Mobility Reset", desc: "6-week guided mobility and breathwork program.", trainer: "Elena Soto", sport: "Yoga", price: 79, sessions: 18, level: "All levels", schedule: ["Tue 07:00", "Thu 07:00", "Sun 09:00"], offer: "SAVE 15%" },
  { id: "muay-thai-fight-camp", title: "Muay Thai Fight Camp", desc: "10-week competition prep. Sparring & conditioning.", trainer: "Cassian Andor", sport: "Muay Thai", price: 189, sessions: 40, level: "Advanced", schedule: ["Mon 19:00", "Wed 19:00", "Sat 14:00"], offer: null },
  { id: "open-water-base", title: "Open Water Base", desc: "Endurance swim block for triathletes.", trainer: "Maya Okafor", sport: "Swimming", price: 119, sessions: 24, level: "Intermediate", schedule: ["Tue 06:00", "Thu 06:00", "Sat 07:00"], offer: null },
];

export const offers = [
  { id: "summer-transformation", title: "Summer Transformation", desc: "3 months of unlimited access + 5 personal coaching sessions.", price: 299, original: 380, badge: "SAVE 20%", start: "Jun 01", end: "Aug 31", months: 3, planId: "hypertrophy-pro", image: offerSummer },
  { id: "new-year-reset", title: "New Year Reset", desc: "Kick-off the year with 2 months unlimited and a free InBody scan.", price: 199, original: 240, badge: "SAVE 17%", start: "Jan 02", end: "Feb 28", months: 2, planId: "mobility-reset", image: offerNewYear },
  { id: "pt-bundle", title: "Personal Training Bundle", desc: "10 one-on-one sessions with a top-tier coach.", price: 549, original: 650, badge: "SAVE 15%", start: "Jan 01", end: "Dec 31", months: 1, planId: "boxing-foundations", image: offerPt },
];

export const attendanceWeekly = [
  { day: "Mon", sessions: 1 },
  { day: "Tue", sessions: 1 },
  { day: "Wed", sessions: 1 },
  { day: "Thu", sessions: 0 },
  { day: "Fri", sessions: 1 },
  { day: "Sat", sessions: 1 },
  { day: "Sun", sessions: 0 },
];

export const monthlyActivity = [
  { month: "Jan", sessions: 14 },
  { month: "Feb", sessions: 18 },
  { month: "Mar", sessions: 22 },
  { month: "Apr", sessions: 19 },
  { month: "May", sessions: 24 },
  { month: "Jun", sessions: 26 },
  { month: "Jul", sessions: 22 },
  { month: "Aug", sessions: 25 },
];

export const revenueData = [
  { month: "Jan", revenue: 42000 },
  { month: "Feb", revenue: 48000 },
  { month: "Mar", revenue: 51000 },
  { month: "Apr", revenue: 56000 },
  { month: "May", revenue: 62000 },
  { month: "Jun", revenue: 71000 },
  { month: "Jul", revenue: 78000 },
  { month: "Aug", revenue: 84000 },
];

export const members = [
  { id: "M-8829", name: "Marcus Thorne", email: "m.thorne@example.com", plan: "Hypertrophy Pro", status: "Active", expires: "Oct 12, 2026", lastCheckIn: "2h ago" },
  { id: "M-4022", name: "Sara Chen", email: "s.chen@domain.fit", plan: "MetCon Elite", status: "Expiring", expires: "Jul 04, 2026", lastCheckIn: "Yesterday" },
  { id: "M-9912", name: "Brie Larson", email: "b.larson@example.com", plan: "CrossFit Advanced", status: "Active", expires: "Nov 22, 2026", lastCheckIn: "Today 09:12" },
  { id: "M-1033", name: "Tom Hardy", email: "tom.h@example.com", plan: "Boxing Foundations", status: "Expired", expires: "Mar 09, 2026", lastCheckIn: "12 days ago" },
  { id: "M-2210", name: "Sasha Volkov", email: "sasha.v@example.com", plan: "Mobility Reset", status: "Active", expires: "Aug 30, 2026", lastCheckIn: "1h ago" },
  { id: "M-7745", name: "Naomi Ortiz", email: "n.ortiz@example.com", plan: "Muay Thai Fight Camp", status: "Active", expires: "Dec 11, 2026", lastCheckIn: "Today 06:40" },
  { id: "M-3398", name: "Daniel Reeve", email: "d.reeve@example.com", plan: "Hypertrophy Pro", status: "Active", expires: "Sep 21, 2026", lastCheckIn: "3h ago" },
];

export const todaySessions = [
  { id: "s1", time: "06:00", name: "MetCon Elite", trainer: "Maya Okafor", booked: 14, capacity: 16 },
  { id: "s2", time: "07:00", name: "Mobility Reset", trainer: "Elena Soto", booked: 9, capacity: 12 },
  { id: "s3", time: "17:00", name: "Boxing Foundations", trainer: "Cassian Andor", booked: 12, capacity: 14 },
  { id: "s4", time: "18:00", name: "Hypertrophy Pro", trainer: "Viktor Drago", booked: 10, capacity: 12 },
  { id: "s5", time: "19:00", name: "Muay Thai Fight Camp", trainer: "Cassian Andor", booked: 8, capacity: 10 },
];

export const memberSubscriptions = [
  { id: "S-7711", plan: "Hypertrophy Pro", start: "Apr 01, 2026", end: "Jul 01, 2026", status: "Active", price: 149, paid: 149, daysLeft: 18 },
  { id: "S-6502", plan: "Mobility Reset", start: "Feb 12, 2026", end: "Mar 26, 2026", status: "Expired", price: 79, paid: 79, daysLeft: 0 },
  { id: "S-5310", plan: "Boxing Foundations", start: "Nov 02, 2025", end: "Jan 02, 2026", status: "Expired", price: 99, paid: 99, daysLeft: 0 },
];