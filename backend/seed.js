const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb+srv://suryaprakash882578:suryaprakash@cluster0.4wkox.mongodb.net/talentPicker?retryWrites=true&w=majority&appName=Cluster0';

// Schemas
const UserSchema = new mongoose.Schema({ name: String, email: String, password: String, role: String, companyName: String, isApproved: Boolean, resume: String }, { timestamps: true });
const JobSchema = new mongoose.Schema({ title: String, description: String, location: String, salary: String, type: String, companyId: mongoose.Schema.Types.ObjectId, applicantsCount: { type: Number, default: 0 } }, { timestamps: true });
const ApplicationSchema = new mongoose.Schema({ candidateId: mongoose.Schema.Types.ObjectId, jobId: mongoose.Schema.Types.ObjectId, status: String }, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Job = mongoose.model('Job', JobSchema);
const Application = mongoose.model('Application', ApplicationSchema);

const JOB_TYPES = ['full-time', 'part-time', 'remote', 'internship'];

const COMPANIES = [
  { name: 'TechCorp Solutions', domain: 'techcorp' },
  { name: 'InnovateSoft', domain: 'innovatesoft' },
  { name: 'DataVision Inc', domain: 'datavision' },
  { name: 'CloudNine Systems', domain: 'cloudnine' },
  { name: 'NextGen Labs', domain: 'nextgenlabs' },
  { name: 'Pixel Studio', domain: 'pixelstudio' },
  { name: 'FinTech Pro', domain: 'fintechpro' },
  { name: 'HealthTech AI', domain: 'healthtechai' },
  { name: 'GreenCode Ltd', domain: 'greencode' },
  { name: 'SwiftBuild Co', domain: 'swiftbuild' },
  { name: 'Quantum Dynamics', domain: 'quantumdyn' },
  { name: 'Nexus Digital', domain: 'nexusdigital' },
  { name: 'Bright Minds Tech', domain: 'brightminds' },
  { name: 'Alpha Ventures', domain: 'alphaventures' },
  { name: 'CyberShield Inc', domain: 'cybershield' },
  { name: 'EduTech Global', domain: 'edutechglobal' },
  { name: 'RoboWorks', domain: 'roboworks' },
  { name: 'SkyNet Analytics', domain: 'skynetanalytics' },
  { name: 'PrimeSoft', domain: 'primesoft' },
  { name: 'MobileMind', domain: 'mobilemind' },
  { name: 'DevMatrix', domain: 'devmatrix' },
  { name: 'CodeBridge', domain: 'codebridge' },
  { name: 'SmartLogic AI', domain: 'smartlogicai' },
  { name: 'VisionaryApps', domain: 'visionaryapps' },
  { name: 'TurboStack', domain: 'turbostack' },
];

const JOB_TITLES = [
  'Senior React Developer', 'Node.js Backend Engineer', 'Full Stack Developer',
  'UI/UX Designer', 'DevOps Engineer', 'Data Scientist', 'Machine Learning Engineer',
  'Product Manager', 'Mobile App Developer', 'Cloud Architect',
  'Cybersecurity Analyst', 'QA Engineer', 'Python Developer', 'Java Developer',
  'Angular Developer', 'Vue.js Developer', 'Database Administrator',
  'System Administrator', 'Technical Lead', 'Software Architect',
  'Frontend Developer', 'Backend Developer', 'API Developer',
  'Blockchain Developer', 'AI Engineer', 'Data Analyst',
  'Business Analyst', 'Scrum Master', 'Site Reliability Engineer',
  'Embedded Systems Engineer', 'iOS Developer', 'Android Developer',
  'React Native Developer', 'Flutter Developer', 'TypeScript Developer',
  'Go Developer', 'Rust Developer', 'PHP Developer',
  'Ruby on Rails Developer', 'Network Engineer', 'IT Support Specialist',
  'Digital Marketing Analyst', 'SEO Specialist', 'Content Strategist',
  'Graphic Designer', 'Video Editor', 'Web Designer',
  'E-commerce Developer', 'WordPress Developer', 'Magento Developer'
];

const LOCATIONS = [
  'New York, NY', 'San Francisco, CA', 'Austin, TX', 'Seattle, WA',
  'Boston, MA', 'Chicago, IL', 'Los Angeles, CA', 'Denver, CO',
  'Atlanta, GA', 'Miami, FL', 'Remote', 'Toronto, Canada',
  'London, UK', 'Berlin, Germany', 'Bangalore, India'
];

const SALARIES = [
  '$40k - $60k', '$60k - $80k', '$80k - $100k', '$100k - $120k',
  '$120k - $150k', '$150k - $180k', '$180k - $220k', '₹6L - ₹10L',
  '₹10L - ₹15L', '₹15L - ₹25L', '₹25L - ₹40L', '£45k - £65k'
];

const CANDIDATE_NAMES = [
  'Aarav Sharma','Priya Patel','Rohit Kumar','Sneha Reddy','Vikram Singh',
  'Anita Desai','Suresh Nair','Kavya Menon','Rahul Joshi','Pooja Iyer',
  'Arjun Mehta','Deepa Krishnan','Nitin Agarwal','Swati Gupta','Kiran Rao',
  'Amit Tiwari','Neha Saxena','Rajesh Verma','Sunita Yadav','Manish Shah',
  'Divya Pillai','Sanjay Mishra','Lakshmi Nair','Arun Pandey','Riya Kapoor',
  'Varun Bhat','Meena Subramaniam','Gautam Malhotra','Isha Choudhary','Prakash Jain',
  'Tanvi Kulkarni','Sandeep Garg','Preeti Singh','Alok Srivastava','Shruti Bhatt',
  'Vivek Dubey','Pallavi Hegde','Sunil Nambiar','Rekha Murthy','Ashok Patil',
  'Chitra Venkat','Naveen Reddy','Anjali Chopra','Piyush Trivedi','Seema Kaur',
  'Dinesh Rao','Usha Pillai','Manoj Kumar','Falguni Patel','Harish Nair',
  'John Smith','Emily Johnson','Michael Brown','Sarah Davis','James Wilson',
  'Jessica Martinez','David Anderson','Ashley Taylor','Christopher Thomas','Amanda Jackson',
  'Matthew White','Stephanie Harris','Joshua Martin','Megan Thompson','Ryan Garcia',
  'Lauren Robinson','Nicholas Clark','Brittany Lewis','Andrew Lee','Samantha Walker',
  'Daniel Hall','Kayla Allen','Tyler Young','Heather Hernandez','Brandon King',
  'Amber Wright','Justin Scott','Courtney Green','Jonathan Adams','Cassandra Baker',
  'Austin Nelson','Tiffany Carter','Patrick Mitchell','Rebecca Perez','Justin Roberts',
  'Melissa Turner','Eric Phillips','Lauren Campbell','Kevin Parker','Sara Evans',
  'Brian Edwards','Angela Collins','Scott Stewart','Natalie Sanchez','Timothy Morris',
  'Stephanie Rogers','Jeffrey Reed','Danielle Cook','Frank Morgan','Brittany Bell',
  'Gregory Bailey','Ashley Cooper','Raymond Richardson','Lauren Cox','Stephen Howard'
];

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  // Clean existing seed data (keep admin)
  await User.deleteMany({ role: { $in: ['company', 'candidate'] } });
  await Job.deleteMany({});
  await Application.deleteMany({});
  console.log('🗑️  Cleared old seed data');

  const hashedPassword = await bcrypt.hash('Password@123', 12);

  // Create 25 companies
  const companyDocs = [];
  for (let i = 0; i < 25; i++) {
    const c = COMPANIES[i];
    companyDocs.push({
      name: `HR ${c.name}`,
      email: `hr@${c.domain}.com`,
      password: hashedPassword,
      role: 'company',
      companyName: c.name,
      isApproved: true,
    });
  }
  const companies = await User.insertMany(companyDocs);
  console.log(`✅ Created ${companies.length} companies`);

  // Create 50 jobs (2 per company)
  const jobDocs = [];
  for (let i = 0; i < 50; i++) {
    const company = companies[i % 25];
    const title = JOB_TITLES[i % JOB_TITLES.length];
    jobDocs.push({
      title,
      description: `We are looking for a talented ${title} to join our team at ${company.companyName}.\n\nResponsibilities:\n• Design and develop high-quality software solutions\n• Collaborate with cross-functional teams\n• Participate in code reviews and technical discussions\n• Write clean, maintainable, and well-documented code\n• Troubleshoot and debug issues as they arise\n\nRequirements:\n• 2+ years of relevant experience\n• Strong problem-solving skills\n• Excellent communication skills\n• Experience with modern development tools\n• Bachelor's degree in Computer Science or related field`,
      location: rand(LOCATIONS),
      salary: rand(SALARIES),
      type: rand(JOB_TYPES),
      companyId: company._id,
      applicantsCount: 0,
    });
  }
  const jobs = await Job.insertMany(jobDocs);
  console.log(`✅ Created ${jobs.length} jobs`);

  // Create 100 candidates
  const candidateDocs = [];
  for (let i = 0; i < 100; i++) {
    candidateDocs.push({
      name: CANDIDATE_NAMES[i],
      email: `candidate${i + 1}@talentpicker.com`,
      password: hashedPassword,
      role: 'candidate',
      isApproved: true,
      resume: null,
    });
  }
  const candidates = await User.insertMany(candidateDocs);
  console.log(`✅ Created ${candidates.length} candidates`);

  // Each candidate applies to 3-7 random jobs (no duplicates)
  const applicationDocs = [];
  const appliedSet = new Set();

  for (const candidate of candidates) {
    const numApply = randInt(3, 7);
    const shuffledJobs = [...jobs].sort(() => Math.random() - 0.5).slice(0, numApply);

    for (const job of shuffledJobs) {
      const key = `${candidate._id}-${job._id}`;
      if (!appliedSet.has(key)) {
        appliedSet.add(key);
        const statuses = ['applied', 'shortlisted', 'rejected'];
        const weights = [0.6, 0.25, 0.15];
        const rand01 = Math.random();
        let status = 'applied';
        if (rand01 > weights[0] + weights[1]) status = 'rejected';
        else if (rand01 > weights[0]) status = 'shortlisted';

        applicationDocs.push({
          candidateId: candidate._id,
          jobId: job._id,
          status,
        });
      }
    }
  }

  await Application.insertMany(applicationDocs);
  console.log(`✅ Created ${applicationDocs.length} applications`);

  // Update applicantsCount on each job
  for (const job of jobs) {
    const count = applicationDocs.filter(a => a.jobId.toString() === job._id.toString()).length;
    await Job.findByIdAndUpdate(job._id, { applicantsCount: count });
  }
  console.log('✅ Updated applicant counts on all jobs');

  console.log('\n🎉 SEED COMPLETE!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📦 Companies : 25`);
  console.log(`💼 Jobs      : 50`);
  console.log(`👤 Candidates: 100`);
  console.log(`📋 Applications: ${applicationDocs.length}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n🔑 Login credentials for all seeded users:');
  console.log('Password: Password@123');
  console.log('\nSample company logins:');
  console.log('  hr@techcorp.com / Password@123');
  console.log('  hr@innovatesoft.com / Password@123');
  console.log('\nSample candidate logins:');
  console.log('  candidate1@talentpicker.com / Password@123');
  console.log('  candidate50@talentpicker.com / Password@123');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});