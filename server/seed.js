import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ---------- 1. SEED USERS ----------
const rawUsers = [
  { id: 'U001', name: 'Dr. Rajesh Kumar', email: 'admin@aicte.gov.in', password: 'admin123', role: 'ADMIN', department: 'Administration', region: 'All', avatar: 'RK' },
  { id: 'U002', name: 'Ms. Priya Sharma', email: 'priya@aicte.gov.in', password: 'pass123', role: 'BUREAU_HEAD', department: 'RB', region: 'All', avatar: 'PS' },
  { id: 'U003', name: 'Mr. Anil Verma', email: 'anil@aicte.gov.in', password: 'pass123', role: 'BUREAU_HEAD', department: 'PGRC', region: 'All', avatar: 'AV' },
  { id: 'U004', name: 'Dr. Sunita Rao', email: 'sunita@aicte.gov.in', password: 'pass123', role: 'BUREAU_HEAD', department: 'Legal', region: 'All', avatar: 'SR' },
  { id: 'U005', name: 'Mr. Vikram Singh', email: 'vikram@aicte.gov.in', password: 'pass123', role: 'OFFICER', department: 'RB', region: 'North', avatar: 'VS' },
  { id: 'U006', name: 'Ms. Deepa Nair', email: 'deepa@aicte.gov.in', password: 'pass123', role: 'OFFICER', department: 'RB', region: 'South', avatar: 'DN' },
  { id: 'U007', name: 'Mr. Arjun Patel', email: 'arjun@aicte.gov.in', password: 'pass123', role: 'OFFICER', department: 'PGRC', region: 'West', avatar: 'AP' },
  { id: 'U008', name: 'Ms. Kavita Das', email: 'kavita@aicte.gov.in', password: 'pass123', role: 'OFFICER', department: 'PGRC', region: 'East', avatar: 'KD' },
  { id: 'U009', name: 'Mr. Ramesh Gupta', email: 'ramesh@aicte.gov.in', password: 'pass123', role: 'OFFICER', department: 'Legal', region: 'Central', avatar: 'RG' },
  { id: 'U010', name: 'Ms. Anjali Mehta', email: 'anjali@aicte.gov.in', password: 'pass123', role: 'OFFICER', department: 'Approval', region: 'North', avatar: 'AM' },
  { id: 'U011', name: 'Mr. Suresh Iyer', email: 'suresh@aicte.gov.in', password: 'pass123', role: 'OFFICER', department: 'Regional Office', region: 'South', avatar: 'SI' },
  { id: 'U012', name: 'Dr. Meena Joshi', email: 'meena@aicte.gov.in', password: 'pass123', role: 'VIEWER', department: 'Administration', region: 'All', avatar: 'MJ' },
  { id: 'U013', name: 'Mr. Ravi Tiwari', email: 'ravi@aicte.gov.in', password: 'pass123', role: 'VIEWER', department: 'RB', region: 'Central', avatar: 'RT' },
  { id: 'U014', name: 'Ms. Neha Kapoor', email: 'neha@aicte.gov.in', password: 'pass123', role: 'VIEWER', department: 'PGRC', region: 'West', avatar: 'NK' },
  { id: 'U015', name: 'Mr. Karan Malhotra', email: 'karan@aicte.gov.in', password: 'pass123', role: 'OFFICER', department: 'RB', region: 'West', avatar: 'KM' },
];

// ---------- 2. SEED INSTITUTIONS ----------
const rawInstitutions = [
  { id: 'INST001', aicteId: 'AICTE-1-4527891234', name: 'ABC Engineering College', city: 'Mumbai', state: 'Maharashtra', region: 'West', type: 'Engineering', status: 'Active' },
  { id: 'INST002', aicteId: 'AICTE-1-4527891235', name: 'XYZ Institute of Technology', city: 'Delhi', state: 'Delhi', region: 'North', type: 'Engineering', status: 'Active' },
  { id: 'INST003', aicteId: 'AICTE-1-4527891236', name: 'National College of Pharmacy', city: 'Bangalore', state: 'Karnataka', region: 'South', type: 'Pharmacy', status: 'Active' },
  { id: 'INST004', aicteId: 'AICTE-1-4527891237', name: 'Premier Business School', city: 'Chennai', state: 'Tamil Nadu', region: 'South', type: 'MBA', status: 'Active' },
  { id: 'INST005', aicteId: 'AICTE-1-4527891238', name: 'Metro Polytechnic Institute', city: 'Kolkata', state: 'West Bengal', region: 'East', type: 'Engineering', status: 'Active' },
  { id: 'INST006', aicteId: 'AICTE-1-4527891239', name: 'Central Institute of Architecture', city: 'Bhopal', state: 'Madhya Pradesh', region: 'Central', type: 'Architecture', status: 'Active' },
  { id: 'INST007', aicteId: 'AICTE-1-4527891240', name: 'Global MCA Academy', city: 'Pune', state: 'Maharashtra', region: 'West', type: 'MCA', status: 'Active' },
  { id: 'INST008', aicteId: 'AICTE-1-4527891241', name: 'Heritage Engineering University', city: 'Jaipur', state: 'Rajasthan', region: 'North', type: 'Engineering', status: 'Active' },
  { id: 'INST009', aicteId: 'AICTE-1-4527891242', name: 'Southern Technical Institute', city: 'Hyderabad', state: 'Telangana', region: 'South', type: 'Engineering', status: 'Active' },
  { id: 'INST010', aicteId: 'AICTE-1-4527891243', name: 'Rajdhani Management College', city: 'Lucknow', state: 'Uttar Pradesh', region: 'North', type: 'MBA', status: 'Active' },
  { id: 'INST011', aicteId: 'AICTE-1-4527891244', name: 'Eastern School of Engineering', city: 'Guwahati', state: 'Assam', region: 'East', type: 'Engineering', status: 'Active' },
  { id: 'INST012', aicteId: 'AICTE-1-4527891245', name: 'Coastal Pharmacy College', city: 'Kochi', state: 'Kerala', region: 'South', type: 'Pharmacy', status: 'Active' },
  { id: 'INST013', aicteId: 'AICTE-1-4527891246', name: 'Silicon Valley Tech Institute', city: 'Ahmedabad', state: 'Gujarat', region: 'West', type: 'Engineering', status: 'Active' },
  { id: 'INST014', aicteId: 'AICTE-1-4527891247', name: 'Northern Architecture Academy', city: 'Chandigarh', state: 'Chandigarh', region: 'North', type: 'Architecture', status: 'Active' },
  { id: 'INST015', aicteId: 'AICTE-1-4527891248', name: 'Deccan Institute of Management', city: 'Nagpur', state: 'Maharashtra', region: 'West', type: 'MBA', status: 'Active' },
  { id: 'INST016', aicteId: 'AICTE-1-4527891249', name: 'Vidya Engineering College', city: 'Indore', state: 'Madhya Pradesh', region: 'Central', type: 'Engineering', status: 'Suspended' },
  { id: 'INST017', aicteId: 'AICTE-1-4527891250', name: 'Sunrise Polytechnic', city: 'Patna', state: 'Bihar', region: 'East', type: 'Engineering', status: 'Active' },
  { id: 'INST018', aicteId: 'AICTE-1-4527891251', name: 'Capital IT Institute', city: 'Noida', state: 'Uttar Pradesh', region: 'North', type: 'MCA', status: 'Active' },
  { id: 'INST019', aicteId: 'AICTE-1-4527891252', name: 'Royal College of Engineering', city: 'Jodhpur', state: 'Rajasthan', region: 'North', type: 'Engineering', status: 'Active' },
  { id: 'INST020', aicteId: 'AICTE-1-4527891253', name: 'Lakeview Business School', city: 'Udaipur', state: 'Rajasthan', region: 'North', type: 'MBA', status: 'Active' },
  { id: 'INST021', aicteId: 'AICTE-1-4527891254', name: 'Pacific Engineering College', city: 'Vizag', state: 'Andhra Pradesh', region: 'South', type: 'Engineering', status: 'Active' },
  { id: 'INST022', aicteId: 'AICTE-1-4527891255', name: 'Western Pharmacy Institute', city: 'Surat', state: 'Gujarat', region: 'West', type: 'Pharmacy', status: 'Active' },
  { id: 'INST023', aicteId: 'AICTE-1-4527891256', name: 'Mountain View Tech Academy', city: 'Dehradun', state: 'Uttarakhand', region: 'North', type: 'Engineering', status: 'Active' },
  { id: 'INST024', aicteId: 'AICTE-1-4527891257', name: 'Golden Triangle MCA College', city: 'Agra', state: 'Uttar Pradesh', region: 'North', type: 'MCA', status: 'Active' },
  { id: 'INST025', aicteId: 'AICTE-1-4527891258', name: 'Steel City Engineering Institute', city: 'Jamshedpur', state: 'Jharkhand', region: 'East', type: 'Engineering', status: 'Active' },
  { id: 'INST026', aicteId: 'AICTE-1-4527891259', name: 'Pearl Academy of Management', city: 'Mysore', state: 'Karnataka', region: 'South', type: 'MBA', status: 'Active' },
  { id: 'INST027', aicteId: 'AICTE-1-4527891260', name: 'Central Plains Polytechnic', city: 'Raipur', state: 'Chhattisgarh', region: 'Central', type: 'Engineering', status: 'Active' },
  { id: 'INST028', aicteId: 'AICTE-1-4527891261', name: 'Gateway Architecture School', city: 'Goa', state: 'Goa', region: 'West', type: 'Architecture', status: 'Active' },
  { id: 'INST029', aicteId: 'AICTE-1-4527891262', name: 'Green Valley Engineering', city: 'Coimbatore', state: 'Tamil Nadu', region: 'South', type: 'Engineering', status: 'Active' },
  { id: 'INST030', aicteId: 'AICTE-1-4527891263', name: 'Diamond Harbour Tech College', city: 'Bhubaneswar', state: 'Odisha', region: 'East', type: 'Engineering', status: 'Active' },
  { id: 'INST031', aicteId: 'AICTE-1-4527891264', name: 'Sapphire Pharmacy Academy', city: 'Nashik', state: 'Maharashtra', region: 'West', type: 'Pharmacy', status: 'Active' },
  { id: 'INST032', aicteId: 'AICTE-1-4527891265', name: 'Himalayan Institute of Tech', city: 'Shimla', state: 'Himachal Pradesh', region: 'North', type: 'Engineering', status: 'Active' },
  { id: 'INST033', aicteId: 'AICTE-1-4527891266', name: 'Narmada Business Institute', city: 'Jabalpur', state: 'Madhya Pradesh', region: 'Central', type: 'MBA', status: 'Active' },
  { id: 'INST034', aicteId: 'AICTE-1-4527891267', name: 'Brahmaputra Engineering College', city: 'Dibrugarh', state: 'Assam', region: 'East', type: 'Engineering', status: 'Active' },
  { id: 'INST035', aicteId: 'AICTE-1-4527891268', name: 'Mandovi Tech Institute', city: 'Panaji', state: 'Goa', region: 'West', type: 'MCA', status: 'Active' },
  { id: 'INST036', aicteId: 'AICTE-1-4527891269', name: 'Tiger Hill Polytechnic', city: 'Darjeeling', state: 'West Bengal', region: 'East', type: 'Engineering', status: 'Suspended' },
  { id: 'INST037', aicteId: 'AICTE-1-4527891270', name: 'Mystic Valley Pharmacy', city: 'Thiruvananthapuram', state: 'Kerala', region: 'South', type: 'Pharmacy', status: 'Active' },
  { id: 'INST038', aicteId: 'AICTE-1-4527891271', name: 'Sun Temple Architecture School', city: 'Konark', state: 'Odisha', region: 'East', type: 'Architecture', status: 'Active' },
  { id: 'INST039', aicteId: 'AICTE-1-4527891272', name: 'Capital Region Engineering', city: 'Faridabad', state: 'Haryana', region: 'North', type: 'Engineering', status: 'Active' },
  { id: 'INST040', aicteId: 'AICTE-1-4527891273', name: 'Konkan Management Academy', city: 'Ratnagiri', state: 'Maharashtra', region: 'West', type: 'MBA', status: 'Active' },
  { id: 'INST041', aicteId: 'AICTE-1-4527891274', name: 'Deccan Plateau Tech Institute', city: 'Pune', state: 'Maharashtra', region: 'West', type: 'Engineering', status: 'Active' },
  { id: 'INST042', aicteId: 'AICTE-1-4527891275', name: 'Kaveri Engineering College', city: 'Trichy', state: 'Tamil Nadu', region: 'South', type: 'Engineering', status: 'Active' },
  { id: 'INST043', aicteId: 'AICTE-1-4527891276', name: 'Northern Plains MBA College', city: 'Kanpur', state: 'Uttar Pradesh', region: 'North', type: 'MBA', status: 'Active' },
  { id: 'INST044', aicteId: 'AICTE-1-4527891277', name: 'Vindhya Pharmacy Institute', city: 'Varanasi', state: 'Uttar Pradesh', region: 'North', type: 'Pharmacy', status: 'Active' },
  { id: 'INST045', aicteId: 'AICTE-1-4527891278', name: 'Thar Desert Polytechnic', city: 'Bikaner', state: 'Rajasthan', region: 'North', type: 'Engineering', status: 'Active' },
  { id: 'INST046', aicteId: 'AICTE-1-4527891279', name: 'Bay of Bengal IT Academy', city: 'Puducherry', state: 'Puducherry', region: 'South', type: 'MCA', status: 'Active' },
  { id: 'INST047', aicteId: 'AICTE-1-4527891280', name: 'Jheel Architecture College', city: 'Ranchi', state: 'Jharkhand', region: 'East', type: 'Architecture', status: 'Active' },
  { id: 'INST048', aicteId: 'AICTE-1-4527891281', name: 'Mahanadi Engineering School', city: 'Sambalpur', state: 'Odisha', region: 'East', type: 'Engineering', status: 'Active' },
  { id: 'INST049', aicteId: 'AICTE-1-4527891282', name: 'Chambal Business School', city: 'Kota', state: 'Rajasthan', region: 'North', type: 'MBA', status: 'Active' },
  { id: 'INST050', aicteId: 'AICTE-1-4527891283', name: 'River City Tech College', city: 'Allahabad', state: 'Uttar Pradesh', region: 'North', type: 'Engineering', status: 'Active' },
];

const complaintCategories = [
  'Fee Related', 'Faculty Shortage', 'Infrastructure', 'Admission Irregularity',
  'Affiliation Issue', 'Exam Malpractice', 'Ragging', 'Placement Fraud',
  'Certificate Delay', 'Harassment', 'Unapproved Courses', 'Other'
];

const departments = ['RB', 'PGRC', 'Legal', 'Approval', 'Regional Office'];
const statuses = ['NEW', 'UNDER_REVIEW', 'UNDER_PROCESS', 'TRANSFERRED', 'ESCALATED', 'DISPOSED', 'CLOSED'];
const priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
const sources = ['Online Portal', 'Email', 'Letter', 'Walk-in', 'CPGRAMS'];
const complainantTypes = ['Student', 'Faculty', 'Parent', 'Staff', 'Anonymous'];

const complaintDescriptions = {
  'Fee Related': [
    'Institution is demanding capitation fee of Rs 2,50,000 in cash without issuing receipt.',
    'Students are being forced to pay unauthorized laboratory development fee of Rs 45,000.',
    'College refuses to refund admission fee despite student cancellation within AICTE cutoff window.',
    'Management withheld original documents and certificates demanding full 4-year tuition advance.',
    'Excessive hostel mess charges being levied without provision of basic hygienic facilities.'
  ],
  'Faculty Shortage': [
    'Computer Science department has only 3 qualified faculty members against sanctioned 18 as per cadre ratio.',
    'Classes are being taken by unqualified ad-hoc staff without M.Tech or Ph.D degrees as mandated by AICTE.',
    'Faculty to student ratio is 1:85, critically violating prescribed AICTE norms of 1:20.',
    'Faculty salaries unpaid for 7 consecutive months leading to mass resignation and academic disruption.',
    'Principal and senior professors listed on website do not exist or are ghost faculty on inspection rolls.'
  ],
  'Infrastructure': [
    'Mechanical and civil engineering laboratories lack essential testing machines and safety equipment.',
    'Computer laboratory systems are non-functional with expired software licenses and no internet access.',
    'College operates from a leased commercial building without mandatory 5-acre campus ownership deed.',
    'Severe fire safety violation: No fire extinguishers, blocked emergency staircases in 6-story hostel.',
    'Library has less than 20% of mandated titles and zero subscribed IEEE/ACM digital journals.'
  ],
  'Ragging': [
    'First year students subjected to severe physical ragging and humiliation in senior hostel block C.',
    'Anti-ragging committee non-functional; warden refused to lodge FIR despite written complaint by victim.',
    'Junior students threatened with academic debarment by seniors after reporting ragging incident.',
    'Late night harassment in college bus and hostel corridors; CCTV cameras deliberately switched off.',
    'Physical assault on first-year student requiring hospitalization; college management attempting cover-up.'
  ],
  'Unapproved Courses': [
    'College admitting students to B.Tech AI & Data Science without AICTE Approval Bureau sanction.',
    'Offering unauthorized 2-year executive diploma claiming AICTE equivalence in brochures.',
    'Unapproved increase of student intake from 60 to 180 seats without infrastructure verification.',
    'Conducting unapproved evening shift classes in violation of affiliation terms and guidelines.',
    'Franchising technical courses to unaccredited third-party private coaching centers.'
  ],
  'Harassment': [
    'Female students facing persistent gender-based harassment by faculty member; Internal Complaints Committee inactive.',
    'Management retaliated against whistleblower faculty member by unlawful termination of service.',
    'Student who filed RTI query was suspended and barred from appearing in semester examinations.',
    'Staff members forced to perform domestic labor at trustee residences under threat of dismissal.',
    'Arbitrary fines and mental harassment inflicted on students participating in peaceful grievances.'
  ],
  'Admission Irregularity': [
    'Management quota seats auctioned to ineligible candidates scoring below minimum cutoff marks.',
    'Direct admission granted to NRI candidates without submission of equivalence certification.',
    'Reservation roster for SC/ST/OBC candidates ignored during second round of seat allocation.',
    'Admission fee accepted in cash without entering applicant details in central state counseling portal.',
    'Seats reported as vacant to state counseling authority to covertly fill via backdoor management quota.'
  ]
};

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function seedDatabase() {
  console.log('🌱 Starting AICTE Database Seeding...');

  // Clear existing records cleanly
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.coordinationAction.deleteMany();
  await prisma.coordinationRecord.deleteMany();
  await prisma.overlap.deleteMany();
  await prisma.action.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.institution.deleteMany();
  await prisma.user.deleteMany();
  await prisma.benchmarkCase.deleteMany();

  // 1. Seed Users
  const passwordHash = await bcrypt.hash('admin123', 10);
  const createdUsers = [];
  for (const u of rawUsers) {
    const user = await prisma.user.create({
      data: {
        id: u.id,
        name: u.name,
        email: u.email,
        passwordHash,
        role: u.role,
        department: u.department,
        region: u.region,
        avatar: u.avatar
      }
    });
    createdUsers.push(user);
  }
  console.log(`✅ Seeded ${createdUsers.length} Users with bcrypt credentials`);

  // 2. Seed Institutions
  const createdInstitutions = [];
  for (const inst of rawInstitutions) {
    const institution = await prisma.institution.create({
      data: {
        id: inst.id,
        aicteId: inst.aicteId,
        name: inst.name,
        city: inst.city,
        state: inst.state,
        region: inst.region,
        type: inst.type,
        status: inst.status,
        contactEmail: `registrar@${inst.name.toLowerCase().replace(/[^a-z]/g, '')}.edu.in`,
        contactPhone: `+91 11 ${Math.floor(10000000 + Math.random() * 90000000)}`
      }
    });
    createdInstitutions.push(institution);
  }
  console.log(`✅ Seeded ${createdInstitutions.length} Accredited Institutions with verified AICTE IDs`);

  // 3. Seed Complaints (Pre-planned cross-bureau overlap pairs + general complaints)
  const complaintsData = [];

  // Pair 1: ABC Engineering College (Fee Extortion) - PGRC vs RB
  complaintsData.push({
    id: 'C0001',
    complaintNumber: 'PGRC-2026-00001',
    institutionId: 'INST001',
    category: 'Fee Related',
    description: 'Institution is demanding unauthorized capitation fee of Rs 2,50,000 in cash during admission counseling without giving fee receipt.',
    source: 'Online Portal',
    complainantType: 'Student',
    department: 'PGRC',
    assignedOfficerId: 'U007',
    status: 'UNDER_PROCESS',
    priority: 'HIGH',
    deadline: new Date('2026-11-15'),
    filedDate: new Date('2026-10-10'),
    isOverdue: false
  });

  complaintsData.push({
    id: 'C0002',
    complaintNumber: 'RB-2026-00002',
    institutionId: 'INST001',
    category: 'Fee Related',
    description: 'College administration charging unapproved development fees of Rs 2,50,000 from first-year students and refusing to issue official receipts.',
    source: 'Letter',
    complainantType: 'Parent',
    department: 'RB',
    assignedOfficerId: 'U005',
    status: 'UNDER_REVIEW',
    priority: 'HIGH',
    deadline: new Date('2026-11-12'),
    filedDate: new Date('2026-10-12'),
    isOverdue: false
  });

  // Pair 2: XYZ Institute of Technology (Faculty Shortage) - RB vs PGRC
  complaintsData.push({
    id: 'C0010',
    complaintNumber: 'RB-2026-00010',
    institutionId: 'INST002',
    category: 'Faculty Shortage',
    description: 'Computer Science department has severe faculty shortage. Only 3 regular faculty members against mandatory 18 as per AICTE cadre ratio.',
    source: 'Email',
    complainantType: 'Faculty',
    department: 'RB',
    assignedOfficerId: 'U005',
    status: 'UNDER_PROCESS',
    priority: 'HIGH',
    deadline: new Date('2026-11-10'),
    filedDate: new Date('2026-10-08'),
    isOverdue: false
  });

  complaintsData.push({
    id: 'C0025',
    complaintNumber: 'PGRC-2026-00025',
    institutionId: 'INST002',
    category: 'Faculty Shortage',
    description: 'Severe deficit of qualified teaching professors in CSE department. Faculty to student ratio is 1:80 violating AICTE guidelines.',
    source: 'Online Portal',
    complainantType: 'Student',
    department: 'PGRC',
    assignedOfficerId: 'U007',
    status: 'NEW',
    priority: 'HIGH',
    deadline: new Date('2026-11-18'),
    filedDate: new Date('2026-10-14'),
    isOverdue: false
  });

  // Pair 3: Heritage Engineering University (Ragging in Hostel) - PGRC vs RB
  complaintsData.push({
    id: 'C0030',
    complaintNumber: 'PGRC-2026-00030',
    institutionId: 'INST008',
    category: 'Ragging',
    description: 'Senior students physically assaulting first year students in hostel block C. Management suppressing student complaints.',
    source: 'Online Portal',
    complainantType: 'Student',
    department: 'PGRC',
    assignedOfficerId: 'U008',
    status: 'ESCALATED',
    priority: 'CRITICAL',
    deadline: new Date('2026-10-24'), // Overdue
    filedDate: new Date('2026-10-02'),
    isOverdue: true
  });

  complaintsData.push({
    id: 'C0060',
    complaintNumber: 'RB-2026-00060',
    institutionId: 'INST008',
    category: 'Ragging',
    description: 'Hostel ragging incident reported where anti-ragging squad is non-functional and warden failed to file mandated police report.',
    source: 'CPGRAMS',
    complainantType: 'Parent',
    department: 'RB',
    assignedOfficerId: 'U005',
    status: 'UNDER_PROCESS',
    priority: 'CRITICAL',
    deadline: new Date('2026-10-25'), // Overdue
    filedDate: new Date('2026-10-05'),
    isOverdue: true
  });

  // Pair 4: National College of Pharmacy (Infrastructure & Unapproved Syllabus) - PGRC vs Legal
  complaintsData.push({
    id: 'C0015',
    complaintNumber: 'PGRC-2026-00015',
    institutionId: 'INST003',
    category: 'Infrastructure',
    description: 'Laboratory equipment in pharmacology department is outdated and non-functional. Students cannot conduct practical examinations.',
    source: 'Online Portal',
    complainantType: 'Student',
    department: 'PGRC',
    assignedOfficerId: 'U007',
    status: 'UNDER_REVIEW',
    priority: 'MEDIUM',
    deadline: new Date('2026-11-20'),
    filedDate: new Date('2026-10-15'),
    isOverdue: false
  });

  complaintsData.push({
    id: 'C0040',
    complaintNumber: 'LEGAL-2026-00040',
    institutionId: 'INST003',
    category: 'Unapproved Courses',
    description: 'College offering B.Pharm specialized clinical courses without mandatory laboratory infrastructure mandated by AICTE and PCI.',
    source: 'Letter',
    complainantType: 'Faculty',
    department: 'Legal',
    assignedOfficerId: 'U009',
    status: 'UNDER_PROCESS',
    priority: 'HIGH',
    deadline: new Date('2026-11-14'),
    filedDate: new Date('2026-10-11'),
    isOverdue: false
  });

  // Generate 200 additional realistic complaints across institutions
  let complaintIdx = 100;
  for (let i = 1; i <= 210; i++) {
    const inst = randomItem(createdInstitutions);
    const cat = randomItem(complaintCategories);
    const dept = randomItem(departments);
    const descs = complaintDescriptions[cat] || [
      `Grievance regarding non-compliance with AICTE guidelines in ${cat.toLowerCase()} at ${inst.name}.`
    ];
    const filedDaysAgo = Math.floor(Math.random() * 60) + 1;
    const filedDate = new Date(Date.now() - filedDaysAgo * 86400000);
    const deadlineDays = Math.floor(Math.random() * 45) + 15;
    const deadline = new Date(filedDate.getTime() + deadlineDays * 86400000);
    const isOverdue = deadline < new Date();

    let status = randomItem(statuses);
    if (isOverdue && status !== 'DISPOSED' && status !== 'CLOSED') {
      status = Math.random() > 0.5 ? 'ESCALATED' : 'UNDER_PROCESS';
    }

    const officer = randomItem(createdUsers.filter(u => u.role === 'OFFICER')) || createdUsers[4];

    complaintsData.push({
      id: `C${String(complaintIdx).padStart(4, '0')}`,
      complaintNumber: `${dept}-2026-${String(complaintIdx).padStart(5, '0')}`,
      institutionId: inst.id,
      category: cat,
      description: randomItem(descs),
      source: randomItem(sources),
      complainantType: randomItem(complainantTypes),
      department: dept,
      assignedOfficerId: officer.id,
      status,
      priority: cat === 'Ragging' || cat === 'Harassment' ? 'CRITICAL' : (isOverdue ? 'HIGH' : randomItem(priorities)),
      deadline,
      filedDate,
      resolvedDate: status === 'DISPOSED' || status === 'CLOSED' ? new Date() : null,
      isOverdue: (status !== 'DISPOSED' && status !== 'CLOSED') && isOverdue
    });
    complaintIdx++;
  }

  // Insert all complaints
  for (const c of complaintsData) {
    await prisma.complaint.create({ data: c });
  }
  console.log(`✅ Seeded ${complaintsData.length} Complaints across AICTE bureaus`);

  // 4. Seed Action History for complaints
  const actionTemplates = [
    { type: 'STATUS_CHANGE', remark: 'Complaint registered on central portal and assigned to scrutiny officer.' },
    { type: 'REMARK', remark: 'Initial document scrutiny completed. Verification query forwarded to institution.' },
    { type: 'TRANSFER', remark: 'Case transferred from Regional Office to Regulation Bureau for high-level inquiry.' },
    { type: 'ESCALATION', remark: 'SLA deadline approaching with no compliance from college. Case escalated to Bureau Head.' },
    { type: 'DOCUMENT_UPLOAD', remark: 'Institution submitted written explanation along with auditor compliance report.' },
    { type: 'RESOLUTION', remark: 'College complied with AICTE directives. Penalty deposited and matter disposed.' }
  ];

  let actionCount = 0;
  for (const c of complaintsData.slice(0, 50)) {
    const numActions = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < numActions; j++) {
      const act = actionTemplates[j % actionTemplates.length];
      await prisma.action.create({
        data: {
          complaintId: c.id,
          actionType: act.type,
          actionBy: c.assignedOfficerId,
          actionByName: 'Authorized Scrutiny Officer',
          fromDepartment: j > 0 ? c.department : null,
          toDepartment: act.type === 'TRANSFER' ? 'RB' : null,
          remarks: act.remark,
          createdAt: new Date(c.filedDate.getTime() + (j + 1) * 86400000 * 3)
        }
      });
      actionCount++;
    }
  }
  console.log(`✅ Seeded ${actionCount} Action history events and audit records`);

  // 5. Seed Pre-verified Overlaps with Explainability Signals
  const overlapsSeed = [
    {
      id: 'OV001',
      complaintAId: 'C0001',
      complaintBId: 'C0002',
      institutionId: 'INST001',
      matchType: 'SAME_INSTITUTION',
      similarityScore: 0.91,
      semanticScore: 0.88,
      categoryScore: 1.0,
      timelineDeltaDays: 2,
      departmentA: 'PGRC',
      departmentB: 'RB',
      status: 'CONFIRMED',
      matchedSignals: JSON.stringify([
        'Exact Permanent AICTE ID match (AICTE-1-4527891234)',
        'Identical grievance category: Fee Related',
        'High semantic similarity: Both complaints report unapproved capitation/development fee of Rs 2,50,000 without receipt',
        'Filing dates 2 days apart (PGRC Oct 10 vs RB Oct 12)',
        'Parallel inquiry active in Regulation Bureau and PGRC'
      ]),
      differences: JSON.stringify([
        'Complainant identity: Student (PGRC) vs Parent (RB)',
        'Channel: Online Portal vs Physical Letter'
      ]),
      reviewedBy: 'U001',
      reviewedAt: new Date('2026-10-22T10:00:00Z')
    },
    {
      id: 'OV002',
      complaintAId: 'C0010',
      complaintBId: 'C0025',
      institutionId: 'INST002',
      matchType: 'CATEGORY_MATCH',
      similarityScore: 0.89,
      semanticScore: 0.86,
      categoryScore: 1.0,
      timelineDeltaDays: 6,
      departmentA: 'RB',
      departmentB: 'PGRC',
      status: 'FLAGGED',
      matchedSignals: JSON.stringify([
        'Exact Permanent AICTE ID match (AICTE-1-4527891235)',
        'Identical grievance category: Faculty Shortage',
        'High semantic overlap: Severe deficit of faculty in Computer Science department with ratio 1:80',
        'Cross-bureau collision: Regulation Bureau (RB) and PGRC both conducting independent scrutiny'
      ]),
      differences: JSON.stringify([
        'Complainant: Faculty member in RB vs Student in PGRC',
        'RB file demands inspection; PGRC file demands syllabus coverage'
      ]),
      reviewedBy: null,
      reviewedAt: null
    },
    {
      id: 'OV003',
      complaintAId: 'C0030',
      complaintBId: 'C0060',
      institutionId: 'INST008',
      matchType: 'SAME_INSTITUTION',
      similarityScore: 0.94,
      semanticScore: 0.92,
      categoryScore: 1.0,
      timelineDeltaDays: 3,
      departmentA: 'PGRC',
      departmentB: 'RB',
      status: 'FLAGGED',
      matchedSignals: JSON.stringify([
        'Exact Permanent AICTE ID match (AICTE-1-4527891241)',
        'Critical Category: Ragging in hostel premises',
        'High semantic score: Senior students physical harassment; non-functional anti-ragging squad',
        'Both complaints currently OVERDUE with zero coordinated resolution'
      ]),
      differences: JSON.stringify([
        'PGRC received online via student; RB received via CPGRAMS central grievance portal'
      ]),
      reviewedBy: null,
      reviewedAt: null
    },
    {
      id: 'OV004',
      complaintAId: 'C0015',
      complaintBId: 'C0040',
      institutionId: 'INST003',
      matchType: 'SEMANTIC_SIMILARITY',
      similarityScore: 0.79,
      semanticScore: 0.77,
      categoryScore: 0.70,
      timelineDeltaDays: 4,
      departmentA: 'PGRC',
      departmentB: 'Legal',
      status: 'UNDER_REVIEW',
      matchedSignals: JSON.stringify([
        'Exact Permanent AICTE ID match (AICTE-1-4527891236)',
        'Related categories: Infrastructure deficiency linked to Unapproved Course offerings',
        'Both cases reference pharmacology laboratories lacking mandatory equipment'
      ]),
      differences: JSON.stringify([
        'PGRC focuses on practical exam hardship; Legal Cell focuses on unauthorized specialization sanction'
      ]),
      reviewedBy: 'U004',
      reviewedAt: new Date('2026-10-24T14:30:00Z')
    }
  ];

  for (const ov of overlapsSeed) {
    const createdOverlap = await prisma.overlap.create({ data: ov });

    // Seed shared coordination record for confirmed/flagged overlaps
    if (ov.status === 'CONFIRMED' || ov.id === 'OV001') {
      const coord = await prisma.coordinationRecord.create({
        data: {
          overlapId: createdOverlap.id,
          leadBureau: 'RB',
          participatingBureaus: JSON.stringify(['RB', 'PGRC']),
          assignedOfficers: JSON.stringify(['Mr. Vikram Singh (RB)', 'Mr. Arjun Patel (PGRC)']),
          status: 'JOINT_INQUIRY',
          jointDirective: 'Order Joint Inspection Committee consisting of 1 official from Regulation Bureau and 1 from PGRC. College directed to submit audited fee receipts within 14 days.',
          nextActions: JSON.stringify([
            'Conduct surprise site inspection on Nov 05, 2026',
            'Verify cashier cash-register ledger and student bank statements',
            'Issue show-cause notice under AICTE Regulations Section 10'
          ]),
          deadline: new Date('2026-11-15')
        }
      });

      await prisma.coordinationAction.create({
        data: {
          coordinationRecordId: coord.id,
          actionType: 'JOINT_INSPECTION_SCHEDULED',
          officerId: 'U001',
          officerName: 'Dr. Rajesh Kumar',
          bureau: 'Administration',
          notes: 'Joint inspection committee approved by Member Secretary AICTE. Inspection date fixed for Nov 05, 2026.'
        }
      });
    }
  }
  console.log(`✅ Seeded ${overlapsSeed.length} Overlap records with explainability signals and Coordination Records`);

  // 6. Seed Notifications
  const notificationsSeed = [
    {
      userId: 'U001',
      type: 'OVERLAP_ALERT',
      title: 'High-Priority Overlap Flagged (91%)',
      message: 'Parallel inquiries detected for ABC Engineering College across Regulation Bureau and PGRC.',
      relatedComplaintId: 'C0001',
      relatedOverlapId: 'OV001',
      isRead: false,
      deliveryStatus: 'DELIVERED'
    },
    {
      userId: 'U005',
      type: 'OVERLAP_ALERT',
      title: 'Inter-Bureau Case Collision: XYZ Institute of Tech',
      message: 'PGRC has registered a parallel faculty shortage complaint for Case #RB-2026-00010.',
      relatedComplaintId: 'C0010',
      relatedOverlapId: 'OV002',
      isRead: false,
      deliveryStatus: 'DELIVERED'
    },
    {
      userId: 'U008',
      type: 'DEADLINE_WARNING',
      title: 'SLA Overdue Escalation: Case #PGRC-2026-00030',
      message: 'Critical Ragging grievance against Heritage Engineering University has breached citizen charter deadline.',
      relatedComplaintId: 'C0030',
      relatedOverlapId: 'OV003',
      isRead: false,
      deliveryStatus: 'DELIVERED'
    }
  ];

  for (const n of notificationsSeed) {
    await prisma.notification.create({ data: n });
  }
  console.log(`✅ Seeded ${notificationsSeed.length} Multilingual Notification templates`);

  // 7. Seed Labeled Test Examples for Overlap Engine Benchmark Evaluation
  const benchmarkCases = [
    {
      pairKey: 'BENCH_01',
      institutionName: 'ABC Engineering College',
      departmentA: 'PGRC',
      departmentB: 'RB',
      categoryA: 'Fee Related',
      categoryB: 'Fee Related',
      descriptionA: 'College demanding capitation fee of Rs 2,50,000 in cash during admission.',
      descriptionB: 'Unapproved development fee of Rs 2,50,000 charged without issuing receipt.',
      groundTruthLabel: true,
      explanation: 'True Overlap: Same institution, same grievance domain, identical cash fee extortion.'
    },
    {
      pairKey: 'BENCH_02',
      institutionName: 'ABC Engineering College',
      departmentA: 'PGRC',
      departmentB: 'RB',
      categoryA: 'Fee Related',
      categoryB: 'Other',
      descriptionA: 'College demanding capitation fee of Rs 2,50,000 in cash during admission.',
      descriptionB: 'Canteen food quality is poor and drinking water cooler filter is broken.',
      groundTruthLabel: false,
      explanation: 'Common Institution Only: Same college, but completely independent grievances. Must NOT be merged.'
    },
    {
      pairKey: 'BENCH_03',
      institutionName: 'XYZ Institute of Technology',
      departmentA: 'RB',
      departmentB: 'PGRC',
      categoryA: 'Faculty Shortage',
      categoryB: 'Faculty Shortage',
      descriptionA: 'Computer Science department has only 3 faculty members against required 18.',
      descriptionB: 'Faculty-to-student ratio is 1:80 in CSE; no classes conducted for advanced algorithms.',
      groundTruthLabel: true,
      explanation: 'True Overlap: Same department, exact same faculty deficiency issue.'
    },
    {
      pairKey: 'BENCH_04',
      institutionName: 'XYZ Institute of Technology',
      departmentA: 'RB',
      departmentB: 'PGRC',
      categoryA: 'Faculty Shortage',
      categoryB: 'Exam Malpractice',
      descriptionA: 'Computer Science department has only 3 faculty members against required 18.',
      descriptionB: 'Mass cheating in end-semester exams facilitated by invigilators.',
      groundTruthLabel: false,
      explanation: 'Common Institution Only: Different issues, different departments, no joint investigation.'
    },
    {
      pairKey: 'BENCH_05',
      institutionName: 'Heritage Engineering University',
      departmentA: 'PGRC',
      departmentB: 'RB',
      categoryA: 'Ragging',
      categoryB: 'Ragging',
      descriptionA: 'First year students physically assaulted by senior hostel students; anti-ragging squad inactive.',
      descriptionB: 'Severe physical harassment in hostel block C; warden refused to lodge police complaint.',
      groundTruthLabel: true,
      explanation: 'True Overlap: Critical safety incident in same hostel with identical institutional negligence.'
    },
    {
      pairKey: 'BENCH_06',
      institutionName: 'National College of Pharmacy',
      departmentA: 'PGRC',
      departmentB: 'Legal',
      categoryA: 'Infrastructure',
      categoryB: 'Unapproved Courses',
      descriptionA: 'Pharmacology laboratory instruments are defunct and uncalibrated.',
      descriptionB: 'Offering clinical diploma without mandatory laboratory facilities approved by AICTE.',
      groundTruthLabel: true,
      explanation: 'True Cross-Domain Overlap: Lack of lab equipment directly causes illegality of course approval.'
    },
    {
      pairKey: 'BENCH_07',
      institutionName: 'Premier Business School',
      departmentA: 'Approval',
      departmentB: 'Regional Office',
      categoryA: 'Affiliation Issue',
      categoryB: 'Placement Fraud',
      descriptionA: 'Institute running MBA batch beyond sanctioned intake capacity.',
      descriptionB: 'Brochure claims 100% placement with average package of 18 LPA which is completely fraudulent.',
      groundTruthLabel: false,
      explanation: 'Common Institution: Separate compliance violations requiring independent bureau notices.'
    },
    {
      pairKey: 'BENCH_08',
      institutionName: 'Green Valley Engineering',
      departmentA: 'PGRC',
      departmentB: 'RB',
      categoryA: 'Admission Irregularity',
      categoryB: 'Admission Irregularity',
      descriptionA: 'Management quota seats sold to unqualified candidates below state cutoff.',
      descriptionB: 'Excess admissions granted through backdoor management quota without state counseling merit.',
      groundTruthLabel: true,
      explanation: 'True Overlap: Parallel investigation into corrupt admission racket for same academic year.'
    }
  ];

  for (const b of benchmarkCases) {
    await prisma.benchmarkCase.create({ data: b });
  }
  console.log(`✅ Seeded ${benchmarkCases.length} Ground-Truth Labeled Test Benchmark Cases`);

  // 8. Initial Audit Log
  await prisma.auditLog.create({
    data: {
      userId: 'U001',
      userName: 'Dr. Rajesh Kumar (Admin)',
      action: 'SYSTEM_INITIALIZATION',
      entityType: 'SYSTEM',
      entityId: 'AICTE_SIH_2026',
      ipAddress: '127.0.0.1',
      details: JSON.stringify({ message: 'AICTE Complaint Redressal & Overlap Detection Platform Initialized.' })
    }
  });

  console.log('✨ All AICTE database tables successfully populated!');
}

seedDatabase()
  .catch(e => {
    console.error('❌ Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
