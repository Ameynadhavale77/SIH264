// ============================================================
// AICTE Complaint Dashboard — Synthetic Mock Data
// ============================================================

// ---------- USERS ----------
export const users = [
  { id: 'U001', name: 'Dr. Rajesh Kumar', email: 'admin@aicte.gov.in', password: 'admin123', role: 'Admin', department: 'Administration', region: 'All', avatar: 'RK' },
  { id: 'U002', name: 'Ms. Priya Sharma', email: 'priya@aicte.gov.in', password: 'pass123', role: 'Bureau Head', department: 'RB', region: 'All', avatar: 'PS' },
  { id: 'U003', name: 'Mr. Anil Verma', email: 'anil@aicte.gov.in', password: 'pass123', role: 'Bureau Head', department: 'PGRC', region: 'All', avatar: 'AV' },
  { id: 'U004', name: 'Dr. Sunita Rao', email: 'sunita@aicte.gov.in', password: 'pass123', role: 'Bureau Head', department: 'Legal', region: 'All', avatar: 'SR' },
  { id: 'U005', name: 'Mr. Vikram Singh', email: 'vikram@aicte.gov.in', password: 'pass123', role: 'Officer', department: 'RB', region: 'North', avatar: 'VS' },
  { id: 'U006', name: 'Ms. Deepa Nair', email: 'deepa@aicte.gov.in', password: 'pass123', role: 'Officer', department: 'RB', region: 'South', avatar: 'DN' },
  { id: 'U007', name: 'Mr. Arjun Patel', email: 'arjun@aicte.gov.in', password: 'pass123', role: 'Officer', department: 'PGRC', region: 'West', avatar: 'AP' },
  { id: 'U008', name: 'Ms. Kavita Das', email: 'kavita@aicte.gov.in', password: 'pass123', role: 'Officer', department: 'PGRC', region: 'East', avatar: 'KD' },
  { id: 'U009', name: 'Mr. Ramesh Gupta', email: 'ramesh@aicte.gov.in', password: 'pass123', role: 'Officer', department: 'Legal', region: 'Central', avatar: 'RG' },
  { id: 'U010', name: 'Ms. Anjali Mehta', email: 'anjali@aicte.gov.in', password: 'pass123', role: 'Officer', department: 'Approval', region: 'North', avatar: 'AM' },
  { id: 'U011', name: 'Mr. Suresh Iyer', email: 'suresh@aicte.gov.in', password: 'pass123', role: 'Officer', department: 'Regional Office', region: 'South', avatar: 'SI' },
  { id: 'U012', name: 'Dr. Meena Joshi', email: 'meena@aicte.gov.in', password: 'pass123', role: 'Viewer', department: 'Administration', region: 'All', avatar: 'MJ' },
  { id: 'U013', name: 'Mr. Ravi Tiwari', email: 'ravi@aicte.gov.in', password: 'pass123', role: 'Viewer', department: 'RB', region: 'Central', avatar: 'RT' },
  { id: 'U014', name: 'Ms. Neha Kapoor', email: 'neha@aicte.gov.in', password: 'pass123', role: 'Viewer', department: 'PGRC', region: 'West', avatar: 'NK' },
  { id: 'U015', name: 'Mr. Karan Malhotra', email: 'karan@aicte.gov.in', password: 'pass123', role: 'Officer', department: 'RB', region: 'West', avatar: 'KM' },
];

// ---------- INSTITUTIONS ----------
export const institutions = [
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

// ---------- COMPLAINT CATEGORIES ----------
export const complaintCategories = [
  'Fee Related', 'Faculty Shortage', 'Infrastructure', 'Admission Irregularity',
  'Affiliation Issue', 'Exam Malpractice', 'Ragging', 'Placement Fraud',
  'Certificate Delay', 'Harassment', 'Unapproved Courses', 'Other'
];

export const departments = ['RB', 'PGRC', 'Legal', 'Approval', 'Regional Office'];
export const statuses = ['New', 'Under Review', 'Under Process', 'Transferred', 'Escalated', 'Disposed', 'Closed'];
export const priorities = ['Low', 'Medium', 'High', 'Critical'];
export const sources = ['Online Portal', 'Email', 'Letter', 'Phone', 'Walk-in'];
export const complainantTypes = ['Student', 'Faculty', 'Parent', 'Staff', 'Anonymous', 'Other'];
export const regions = ['North', 'South', 'East', 'West', 'Central'];

// ---------- GENERATE COMPLAINTS ----------
const complaintDescriptions = {
  'Fee Related': [
    'Institution is charging fees higher than the approved fee structure by AICTE.',
    'Students are being forced to pay extra charges not mentioned in the prospectus.',
    'College is refusing to refund fees despite timely cancellation of admission.',
    'Hidden charges being collected under the name of development and activity fees.',
    'Institution increased tuition fees mid-session without proper notice or approval.',
  ],
  'Faculty Shortage': [
    'The institution has severe faculty shortage in the Computer Science department. Only 3 out of 12 required faculty members are present.',
    'Most classes are being taken by visiting faculty who are not qualified as per AICTE norms.',
    'The college does not have a single PhD holder in the Mechanical Engineering department.',
    'Faculty-to-student ratio is 1:80, far exceeding the AICTE prescribed norms.',
    'Several core subjects have no permanent faculty assigned for the entire semester.',
  ],
  'Infrastructure': [
    'Laboratory equipment is outdated and non-functional. Students cannot perform practicals.',
    'The library does not have the minimum number of books and journals as required by AICTE.',
    'Hostel conditions are extremely poor with no proper sanitation facilities.',
    'Computer labs have only 20 systems for 200 students. Software licenses have expired.',
    'Classrooms are in dilapidated condition. Some rooms have no proper ventilation or lighting.',
  ],
  'Admission Irregularity': [
    'College is admitting students without valid entrance exam scores.',
    'Management quota seats are being sold at exorbitant rates beyond approved limits.',
    'Institution admitted more students than the sanctioned intake capacity.',
    'Fake certificates are being used to process admissions for certain candidates.',
    'Students are being enrolled in courses that do not have AICTE approval.',
  ],
  'Affiliation Issue': [
    'Institution is running courses without valid AICTE approval for the current academic year.',
    'The college lost its affiliation but continues to admit new students.',
    'Approval for two branches was withdrawn but classes are still being conducted.',
    'Institution is using a different name than the one registered with AICTE.',
    'College is operating at a different location than the approved address.',
  ],
  'Exam Malpractice': [
    'Institution is facilitating mass cheating during university examinations.',
    'Question papers are being leaked to selected students before exams.',
    'Internal assessment marks are being manipulated to favor certain students.',
    'College is issuing fake mark sheets to students.',
    'Exam schedule was changed without notice, affecting students who had travel plans.',
  ],
  'Ragging': [
    'Senior students are physically harassing freshers in the hostel premises.',
    'A group of senior students forced juniors to perform degrading acts.',
    'Anti-ragging committee is non-functional despite AICTE and UGC guidelines.',
    'Ragging incidents are not being reported by the institution as required.',
    'A first-year student was severely injured in a ragging incident but the college suppressed the matter.',
  ],
  'Placement Fraud': [
    'Institution is advertising false placement statistics in promotional materials.',
    'Fake offer letters are being generated to inflate placement records.',
    'Placement cell is non-functional; no companies visited campus for over a year.',
    'Students were charged placement fees but no placement support was provided.',
    'College is using old placement data from 5 years ago in current advertisements.',
  ],
  'Certificate Delay': [
    'Degree certificates have not been issued for over 2 years after course completion.',
    'Migration certificates are being deliberately withheld to extort additional fees.',
    'Provisional certificates have errors and the college is not responding to correction requests.',
    'Students are unable to apply for higher studies due to delay in receiving transcripts.',
    'College is demanding clearance of non-existent dues before issuing certificates.',
  ],
  'Harassment': [
    'A faculty member is consistently harassing female students with inappropriate remarks.',
    'Students who raise complaints are being threatened with academic consequences.',
    'Internal complaints committee has not been constituted as mandated.',
    'A staff member was assaulted by the management for demanding due salary.',
    'Students protesting fee hike were threatened with rustication.',
  ],
  'Unapproved Courses': [
    'College is offering B.Tech in AI/ML without obtaining AICTE approval.',
    'Short-term certificate courses are being offered under the name of approved programs.',
    'Institution started a new MBA specialization without proper approval process.',
    'Diploma courses are being run without recognition from the state technical board.',
    'Online degree programs are being offered without any authorization.',
  ],
  'Other': [
    'College management is not cooperating with the AICTE inspection team.',
    'Annual reports are not being submitted as per the compliance requirements.',
    'Institution website does not display mandatory information as required by AICTE.',
    'Student union elections are being suppressed by the management.',
    'College canteen is serving unhygienic food leading to health issues among students.',
  ],
};

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateComplaintNumber(dept, index) {
  const year = 2026;
  return `${dept}-${year}-${String(index).padStart(5, '0')}`;
}

function generateDeadline(filedDate) {
  const deadline = new Date(filedDate);
  deadline.setDate(deadline.getDate() + Math.floor(Math.random() * 60) + 15);
  return deadline;
}

// Generate 250 complaints
const rawComplaints = [];
for (let i = 1; i <= 250; i++) {
  const dept = randomItem(departments);
  const category = randomItem(complaintCategories);
  const institution = randomItem(institutions);
  const descs = complaintDescriptions[category] || complaintDescriptions['Other'];
  const filedDate = randomDate(new Date('2025-10-01'), new Date('2026-10-20'));
  const deadline = generateDeadline(filedDate);
  const now = new Date('2026-10-25');

  let status;
  const r = Math.random();
  if (r < 0.08) status = 'New';
  else if (r < 0.22) status = 'Under Review';
  else if (r < 0.42) status = 'Under Process';
  else if (r < 0.50) status = 'Transferred';
  else if (r < 0.56) status = 'Escalated';
  else if (r < 0.80) status = 'Disposed';
  else status = 'Closed';

  const isOverdue = (status !== 'Disposed' && status !== 'Closed') && deadline < now;

  let priority;
  if (category === 'Ragging' || category === 'Harassment') priority = 'Critical';
  else if (isOverdue) priority = 'High';
  else priority = randomItem(priorities);

  const officers = users.filter(u => u.role === 'Officer' && (u.department === dept || u.department === 'Regional Office'));
  const assignedOfficer = officers.length > 0 ? randomItem(officers) : users[4];

  rawComplaints.push({
    id: `C${String(i).padStart(4, '0')}`,
    complaintNumber: generateComplaintNumber(dept, i),
    institutionId: institution.id,
    institutionName: institution.name,
    category,
    description: randomItem(descs),
    source: randomItem(sources),
    complainantType: randomItem(complainantTypes),
    department: dept,
    assignedOfficerId: assignedOfficer.id,
    assignedOfficerName: assignedOfficer.name,
    status,
    priority,
    deadline: deadline.toISOString().split('T')[0],
    filedDate: filedDate.toISOString().split('T')[0],
    resolvedDate: (status === 'Disposed' || status === 'Closed') ? new Date(filedDate.getTime() + Math.random() * (now.getTime() - filedDate.getTime())).toISOString().split('T')[0] : null,
    isOverdue,
  });
}

// Sort by filed date descending
rawComplaints.sort((a, b) => new Date(b.filedDate) - new Date(a.filedDate));

export const complaints = rawComplaints;

// ---------- ACTION HISTORY ----------
const actionTypes = ['Status Change', 'Remark', 'Transfer', 'Escalation', 'Document Upload', 'Resolution'];
const remarkTemplates = [
  'Reviewed complaint details. Forwarding to concerned section.',
  'Contacted the institution for their response. Awaiting reply.',
  'Institution submitted their response. Under examination.',
  'Site inspection scheduled for next week.',
  'Show cause notice issued to the institution.',
  'Institution response found unsatisfactory. Escalating.',
  'Matter discussed in the bureau meeting. Further action required.',
  'Documents verified. Complaint appears valid.',
  'Institution directed to take corrective action within 30 days.',
  'Complaint resolved. Institution has complied with directions.',
  'Case transferred to Legal Cell for further examination.',
  'Reminder sent to the institution for pending compliance.',
  'Follow-up inspection completed. Issues partially resolved.',
  'Final warning issued to the institution.',
  'Case disposed after satisfactory resolution.',
];

export const actions = [];
let actionId = 1;
complaints.forEach(c => {
  const numActions = Math.floor(Math.random() * 4) + 1;
  const baseDate = new Date(c.filedDate);
  for (let j = 0; j < numActions; j++) {
    const actionDate = new Date(baseDate);
    actionDate.setDate(actionDate.getDate() + (j + 1) * Math.floor(Math.random() * 15 + 3));
    const officer = users.find(u => u.id === c.assignedOfficerId) || users[4];
    actions.push({
      id: `A${String(actionId++).padStart(5, '0')}`,
      complaintId: c.id,
      actionType: j === 0 ? 'Status Change' : randomItem(actionTypes),
      actionBy: officer.id,
      actionByName: officer.name,
      fromDepartment: j > 0 && Math.random() > 0.8 ? randomItem(departments) : null,
      toDepartment: j > 0 && Math.random() > 0.8 ? randomItem(departments) : null,
      remarks: randomItem(remarkTemplates),
      attachmentUrl: Math.random() > 0.7 ? `/docs/attachment_${actionId}.pdf` : null,
      createdAt: actionDate.toISOString(),
    });
  }
});

// ---------- OVERLAP RECORDS ----------
// Create deliberate overlaps for demo — same institution, different departments
export const overlaps = [
  {
    id: 'OV001',
    complaintAId: complaints.find(c => c.institutionId === 'INST001' && c.department === 'PGRC')?.id || 'C0001',
    complaintBId: complaints.find(c => c.institutionId === 'INST001' && c.department === 'RB')?.id || 'C0002',
    institutionId: 'INST001',
    institutionName: 'ABC Engineering College',
    matchType: 'Same Institution',
    similarityScore: 0.87,
    status: 'Flagged',
    reviewedBy: null,
    createdAt: '2026-10-20T10:30:00Z',
    reviewedAt: null,
    departmentA: 'PGRC',
    departmentB: 'RB',
    categoryA: 'Fee Related',
    categoryB: 'Fee Related',
    descriptionA: 'Institution is charging fees higher than the approved fee structure by AICTE.',
    descriptionB: 'Students are being forced to pay extra charges not mentioned in the prospectus.',
  },
  {
    id: 'OV002',
    complaintAId: 'C0010',
    complaintBId: 'C0025',
    institutionId: 'INST002',
    institutionName: 'XYZ Institute of Technology',
    matchType: 'Category Match',
    similarityScore: 0.92,
    status: 'Flagged',
    reviewedBy: null,
    createdAt: '2026-10-18T14:15:00Z',
    reviewedAt: null,
    departmentA: 'RB',
    departmentB: 'PGRC',
    categoryA: 'Faculty Shortage',
    categoryB: 'Faculty Shortage',
    descriptionA: 'The institution has severe faculty shortage in the Computer Science department. Only 3 out of 12 required faculty members are present.',
    descriptionB: 'Faculty-to-student ratio is 1:80, far exceeding the AICTE prescribed norms.',
  },
  {
    id: 'OV003',
    complaintAId: 'C0015',
    complaintBId: 'C0040',
    institutionId: 'INST003',
    institutionName: 'National College of Pharmacy',
    matchType: 'Text Similarity',
    similarityScore: 0.78,
    status: 'Under Review',
    reviewedBy: 'U002',
    createdAt: '2026-10-15T09:00:00Z',
    reviewedAt: '2026-10-22T11:30:00Z',
    departmentA: 'PGRC',
    departmentB: 'Legal',
    categoryA: 'Infrastructure',
    categoryB: 'Unapproved Courses',
    descriptionA: 'Laboratory equipment is outdated and non-functional. Students cannot perform practicals.',
    descriptionB: 'College is offering B.Pharm specialization without valid lab infrastructure as mandated.',
  },
  {
    id: 'OV004',
    complaintAId: 'C0020',
    complaintBId: 'C0055',
    institutionId: 'INST005',
    institutionName: 'Metro Polytechnic Institute',
    matchType: 'AI-Detected',
    similarityScore: 0.71,
    status: 'Confirmed Overlap',
    reviewedBy: 'U003',
    createdAt: '2026-10-10T16:45:00Z',
    reviewedAt: '2026-10-18T10:00:00Z',
    departmentA: 'RB',
    departmentB: 'PGRC',
    categoryA: 'Admission Irregularity',
    categoryB: 'Unapproved Courses',
    descriptionA: 'College is admitting students without valid entrance exam scores.',
    descriptionB: 'Students are being enrolled in courses that do not have AICTE approval.',
  },
  {
    id: 'OV005',
    complaintAId: 'C0030',
    complaintBId: 'C0060',
    institutionId: 'INST008',
    institutionName: 'Heritage Engineering University',
    matchType: 'Same Institution',
    similarityScore: 0.95,
    status: 'Flagged',
    reviewedBy: null,
    createdAt: '2026-10-22T08:00:00Z',
    reviewedAt: null,
    departmentA: 'PGRC',
    departmentB: 'RB',
    categoryA: 'Ragging',
    categoryB: 'Ragging',
    descriptionA: 'Senior students are physically harassing freshers in the hostel premises.',
    descriptionB: 'Anti-ragging committee is non-functional despite AICTE and UGC guidelines.',
  },
  {
    id: 'OV006',
    complaintAId: 'C0035',
    complaintBId: 'C0070',
    institutionId: 'INST009',
    institutionName: 'Southern Technical Institute',
    matchType: 'Category Match',
    similarityScore: 0.83,
    status: 'Flagged',
    reviewedBy: null,
    createdAt: '2026-10-21T13:20:00Z',
    reviewedAt: null,
    departmentA: 'Approval',
    departmentB: 'RB',
    categoryA: 'Affiliation Issue',
    categoryB: 'Affiliation Issue',
    descriptionA: 'Institution is running courses without valid AICTE approval for the current academic year.',
    descriptionB: 'Approval for two branches was withdrawn but classes are still being conducted.',
  },
  {
    id: 'OV007',
    complaintAId: 'C0042',
    complaintBId: 'C0078',
    institutionId: 'INST013',
    institutionName: 'Silicon Valley Tech Institute',
    matchType: 'Text Similarity',
    similarityScore: 0.69,
    status: 'Dismissed',
    reviewedBy: 'U002',
    createdAt: '2026-10-05T11:00:00Z',
    reviewedAt: '2026-10-12T15:00:00Z',
    departmentA: 'RB',
    departmentB: 'Regional Office',
    categoryA: 'Placement Fraud',
    categoryB: 'Other',
    descriptionA: 'Institution is advertising false placement statistics in promotional materials.',
    descriptionB: 'Institution website does not display mandatory information as required by AICTE.',
  },
  {
    id: 'OV008',
    complaintAId: 'C0050',
    complaintBId: 'C0085',
    institutionId: 'INST016',
    institutionName: 'Vidya Engineering College',
    matchType: 'AI-Detected',
    similarityScore: 0.88,
    status: 'Flagged',
    reviewedBy: null,
    createdAt: '2026-10-23T07:30:00Z',
    reviewedAt: null,
    departmentA: 'PGRC',
    departmentB: 'Legal',
    categoryA: 'Harassment',
    categoryB: 'Harassment',
    descriptionA: 'Students who raise complaints are being threatened with academic consequences.',
    descriptionB: 'Students protesting fee hike were threatened with rustication.',
  },
  {
    id: 'OV009',
    complaintAId: 'C0058',
    complaintBId: 'C0092',
    institutionId: 'INST004',
    institutionName: 'Premier Business School',
    matchType: 'Same Institution',
    similarityScore: 0.76,
    status: 'Under Review',
    reviewedBy: 'U004',
    createdAt: '2026-10-19T12:00:00Z',
    reviewedAt: '2026-10-24T09:45:00Z',
    departmentA: 'RB',
    departmentB: 'PGRC',
    categoryA: 'Certificate Delay',
    categoryB: 'Fee Related',
    descriptionA: 'Degree certificates have not been issued for over 2 years after course completion.',
    descriptionB: 'College is refusing to refund fees despite timely cancellation of admission.',
  },
  {
    id: 'OV010',
    complaintAId: 'C0065',
    complaintBId: 'C0100',
    institutionId: 'INST010',
    institutionName: 'Rajdhani Management College',
    matchType: 'Category Match',
    similarityScore: 0.81,
    status: 'Flagged',
    reviewedBy: null,
    createdAt: '2026-10-24T16:00:00Z',
    reviewedAt: null,
    departmentA: 'PGRC',
    departmentB: 'Approval',
    categoryA: 'Exam Malpractice',
    categoryB: 'Exam Malpractice',
    descriptionA: 'Institution is facilitating mass cheating during university examinations.',
    descriptionB: 'Question papers are being leaked to selected students before exams.',
  },
  {
    id: 'OV011',
    complaintAId: 'C0072',
    complaintBId: 'C0110',
    institutionId: 'INST021',
    institutionName: 'Pacific Engineering College',
    matchType: 'Text Similarity',
    similarityScore: 0.74,
    status: 'Flagged',
    reviewedBy: null,
    createdAt: '2026-10-25T06:00:00Z',
    reviewedAt: null,
    departmentA: 'RB',
    departmentB: 'PGRC',
    categoryA: 'Infrastructure',
    categoryB: 'Faculty Shortage',
    descriptionA: 'Computer labs have only 20 systems for 200 students. Software licenses have expired.',
    descriptionB: 'Most classes are being taken by visiting faculty who are not qualified as per AICTE norms.',
  },
  {
    id: 'OV012',
    complaintAId: 'C0080',
    complaintBId: 'C0120',
    institutionId: 'INST029',
    institutionName: 'Green Valley Engineering',
    matchType: 'AI-Detected',
    similarityScore: 0.91,
    status: 'Confirmed Overlap',
    reviewedBy: 'U003',
    createdAt: '2026-10-08T10:15:00Z',
    reviewedAt: '2026-10-14T14:30:00Z',
    departmentA: 'PGRC',
    departmentB: 'RB',
    categoryA: 'Admission Irregularity',
    categoryB: 'Admission Irregularity',
    descriptionA: 'Management quota seats are being sold at exorbitant rates beyond approved limits.',
    descriptionB: 'Institution admitted more students than the sanctioned intake capacity.',
  },
];

// ---------- NOTIFICATIONS ----------
export const notifications = [
  { id: 'N001', userId: 'U001', type: 'Overlap Alert', title: 'New Overlap Detected', message: 'Potential overlapping cases found for ABC Engineering College between PGRC and RB.', relatedComplaintId: 'C0001', isRead: false, createdAt: '2026-10-25T10:30:00Z' },
  { id: 'N002', userId: 'U001', type: 'Deadline Warning', title: 'Deadline Approaching', message: 'Complaint PGRC-2026-00012 deadline is in 2 days.', relatedComplaintId: 'C0012', isRead: false, createdAt: '2026-10-25T09:00:00Z' },
  { id: 'N003', userId: 'U001', type: 'Escalation', title: 'Case Escalated', message: 'Complaint RB-2026-00045 has been escalated by Ms. Deepa Nair.', relatedComplaintId: 'C0045', isRead: false, createdAt: '2026-10-24T16:00:00Z' },
  { id: 'N004', userId: 'U002', type: 'Overlap Alert', title: 'Coordination Required', message: 'Heritage Engineering University has related complaints in PGRC and RB. Coordination recommended.', relatedComplaintId: 'C0030', isRead: false, createdAt: '2026-10-24T14:00:00Z' },
  { id: 'N005', userId: 'U001', type: 'Overlap Alert', title: 'AI Detected Similarity', message: 'AI-assisted analysis found 88% similarity between complaints against Vidya Engineering College.', relatedComplaintId: 'C0050', isRead: true, createdAt: '2026-10-23T11:00:00Z' },
  { id: 'N006', userId: 'U003', type: 'Deadline Warning', title: 'Overdue Complaint', message: 'Complaint PGRC-2026-00032 is overdue by 5 days. Immediate action required.', relatedComplaintId: 'C0032', isRead: true, createdAt: '2026-10-23T08:00:00Z' },
  { id: 'N007', userId: 'U001', type: 'Assignment', title: 'New Complaint Assigned', message: 'New ragging complaint against Heritage Engineering University assigned to Mr. Vikram Singh.', relatedComplaintId: 'C0030', isRead: true, createdAt: '2026-10-22T10:00:00Z' },
  { id: 'N008', userId: 'U001', type: 'General', title: 'Weekly Summary', message: '47 new complaints received this week. 12 potential overlaps detected. 8 complaints overdue.', relatedComplaintId: null, isRead: true, createdAt: '2026-10-21T09:00:00Z' },
  { id: 'N009', userId: 'U005', type: 'Overlap Alert', title: 'Cross-Bureau Alert', message: 'Complaint you are handling (RB-2026-00025) may be related to PGRC complaint against the same institution.', relatedComplaintId: 'C0025', isRead: false, createdAt: '2026-10-25T07:30:00Z' },
  { id: 'N010', userId: 'U001', type: 'Deadline Warning', title: '3 Complaints Approaching Deadline', message: 'Three high-priority complaints have deadlines within the next 5 days.', relatedComplaintId: null, isRead: false, createdAt: '2026-10-25T06:00:00Z' },
];

// ---------- DASHBOARD STATS ----------
export const dashboardStats = {
  totalComplaints: complaints.length,
  newComplaints: complaints.filter(c => c.status === 'New').length,
  underReview: complaints.filter(c => c.status === 'Under Review').length,
  underProcess: complaints.filter(c => c.status === 'Under Process').length,
  transferred: complaints.filter(c => c.status === 'Transferred').length,
  escalated: complaints.filter(c => c.status === 'Escalated').length,
  disposed: complaints.filter(c => c.status === 'Disposed').length,
  closed: complaints.filter(c => c.status === 'Closed').length,
  overdue: complaints.filter(c => c.isOverdue).length,
  pendingComplaints: complaints.filter(c => !['Disposed', 'Closed'].includes(c.status)).length,
  overlapsDetected: overlaps.filter(o => o.status === 'Flagged').length,
  criticalCases: complaints.filter(c => c.priority === 'Critical').length,
};

// Monthly trend data
export const monthlyTrend = [
  { month: 'Nov 25', received: 18, resolved: 12 },
  { month: 'Dec 25', received: 22, resolved: 15 },
  { month: 'Jan 26', received: 25, resolved: 18 },
  { month: 'Feb 26', received: 20, resolved: 22 },
  { month: 'Mar 26', received: 28, resolved: 20 },
  { month: 'Apr 26', received: 32, resolved: 25 },
  { month: 'May 26', received: 19, resolved: 28 },
  { month: 'Jun 26', received: 24, resolved: 18 },
  { month: 'Jul 26', received: 30, resolved: 22 },
  { month: 'Aug 26', received: 27, resolved: 24 },
  { month: 'Sep 26', received: 22, resolved: 20 },
  { month: 'Oct 26', received: 15, resolved: 10 },
];

// Department workload
export const departmentWorkload = [
  { department: 'RB', active: complaints.filter(c => c.department === 'RB' && !['Disposed', 'Closed'].includes(c.status)).length, total: complaints.filter(c => c.department === 'RB').length },
  { department: 'PGRC', active: complaints.filter(c => c.department === 'PGRC' && !['Disposed', 'Closed'].includes(c.status)).length, total: complaints.filter(c => c.department === 'PGRC').length },
  { department: 'Legal', active: complaints.filter(c => c.department === 'Legal' && !['Disposed', 'Closed'].includes(c.status)).length, total: complaints.filter(c => c.department === 'Legal').length },
  { department: 'Approval', active: complaints.filter(c => c.department === 'Approval' && !['Disposed', 'Closed'].includes(c.status)).length, total: complaints.filter(c => c.department === 'Approval').length },
  { department: 'Regional Office', active: complaints.filter(c => c.department === 'Regional Office' && !['Disposed', 'Closed'].includes(c.status)).length, total: complaints.filter(c => c.department === 'Regional Office').length },
];

// Region distribution
export const regionDistribution = [
  { region: 'North', count: complaints.filter(c => institutions.find(i => i.id === c.institutionId)?.region === 'North').length },
  { region: 'South', count: complaints.filter(c => institutions.find(i => i.id === c.institutionId)?.region === 'South').length },
  { region: 'East', count: complaints.filter(c => institutions.find(i => i.id === c.institutionId)?.region === 'East').length },
  { region: 'West', count: complaints.filter(c => institutions.find(i => i.id === c.institutionId)?.region === 'West').length },
  { region: 'Central', count: complaints.filter(c => institutions.find(i => i.id === c.institutionId)?.region === 'Central').length },
];

// Category distribution
export const categoryDistribution = complaintCategories.map(cat => ({
  category: cat,
  count: complaints.filter(c => c.category === cat).length,
})).sort((a, b) => b.count - a.count);

// Status distribution for donut chart
export const statusDistribution = statuses.map(s => ({
  name: s,
  value: complaints.filter(c => c.status === s).length,
}));

// Helper functions
export function getComplaintById(id) {
  return complaints.find(c => c.id === id);
}

export function getInstitutionById(id) {
  return institutions.find(i => i.id === id);
}

export function getComplaintsByInstitution(institutionId) {
  return complaints.filter(c => c.institutionId === institutionId);
}

export function getActionsByComplaint(complaintId) {
  return actions.filter(a => a.complaintId === complaintId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getOverlapsByInstitution(institutionId) {
  return overlaps.filter(o => o.institutionId === institutionId);
}

export function getUserById(id) {
  return users.find(u => u.id === id);
}

export function getOverlapById(id) {
  return overlaps.find(o => o.id === id);
}
