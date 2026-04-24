// Realistic candidate data generator

const FIRST_NAMES = [
  'Arjun','Priya','Rohit','Sneha','Karthik','Divya','Ankit','Meera','Vikram','Pooja',
  'Siddharth','Lakshmi','Rahul','Aishwarya','Nikhil','Kavitha','Rajan','Swati','Pranav','Nisha',
  'Arun','Sona','Harish','Deepa','Suresh','Preethi','Manoj','Yamini','Varun','Shreya',
  'Balaji','Mitha','Dinesh','Revathi','Gopal','Sangeetha','Ajay','Ramya','Murali','Krithi',
  'Naveen','Bhavana','Sanjay','Vaishnavi','Vijay','Charanya','Ganesh','Lavanya','Ravi','Keerthana',
  'Ashwin','Pavithra','Kiran','Sowmya','Dhanush','Archana','Surya','Nandhini','Praveen','Monisha',
  'Sarath','Abinaya','Mithun','Saranya','Prashanth','Dhivya','Vishal','Nithya','Aadhi','Kavya',
  'Bharath','Madhumitha','Vignesh','Shalini','Karthikeyan','Priyadarshini','Selvam','Thilaga',
  'Ramesh','Padmavathi','Sivakumar','Geetha','Muthu','Selvi','Balamurugan','Radha','Senthil','Usha',
]

const LAST_NAMES = [
  'Kumar','Sharma','Patel','Singh','Nair','Reddy','Pillai','Iyer','Gupta','Mehta',
  'Rao','Menon','Joshi','Verma','Bhat','Naidu','Krishnan','Agarwal','Shah','Malhotra',
  'Subramaniam','Venkatesh','Raghavan','Sundaram','Murugan','Annamalai','Chandrasekaran',
  'Balakrishnan','Venkatesan','Natarajan','Rajan','Swaminathan','Rajendran','Palaniappan',
]

const COLLEGES = [
  'IIT Bombay','IIT Delhi','IIT Madras','IIT Kharagpur','IIT Roorkee','IIT Guwahati','IIT Kanpur',
  'NIT Trichy','NIT Surathkal','NIT Warangal','NIT Calicut','NIT Rourkela',
  'BITS Pilani','BITS Hyderabad','BITS Goa',
  'VIT Vellore','VIT Chennai','IIIT Hyderabad','IIIT Bangalore','IIIT Delhi',
  'Anna University','DTU Delhi','NSUT Delhi','PSG Tech Coimbatore',
  'Manipal MIT','SRM Chennai','Jadavpur University','COEP Pune','RVCE Bangalore',
  'PES University','Amrita Coimbatore','SSN College of Engineering','CEG Anna University',
]

const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a
const pick = (arr) => arr[rnd(0, arr.length - 1)]

// Generates a score with realistic distribution
// Mode: 'strong' (skewed high), 'weak' (skewed low), 'mixed' (normal)
const genScore = (mode = 'mixed') => {
  const r = Math.random()
  if (mode === 'strong') {
    return r < 0.5 ? rnd(75, 100) : r < 0.8 ? rnd(55, 74) : rnd(20, 54)
  }
  if (mode === 'weak') {
    return r < 0.5 ? rnd(20, 49) : r < 0.8 ? rnd(50, 64) : rnd(65, 100)
  }
  // Mixed: roughly bell-shaped
  return r < 0.12 ? rnd(80, 100) : r < 0.38 ? rnd(65, 79) : r < 0.68 ? rnd(50, 64) : rnd(10, 49)
}

// Correlated score generator — candidates tend to be consistently good or bad
const genCandidateScores = () => {
  const archetype = Math.random()
  if (archetype < 0.15) {
    // Star candidate
    return {
      assignment_score: rnd(82, 100),
      video_score: rnd(75, 98),
      ats_score: rnd(78, 100),
      github_score: rnd(70, 95),
      communication_score: rnd(72, 100),
    }
  } else if (archetype < 0.35) {
    // Strong candidate
    return {
      assignment_score: rnd(68, 88),
      video_score: rnd(65, 85),
      ats_score: rnd(65, 90),
      github_score: rnd(60, 82),
      communication_score: rnd(60, 85),
    }
  } else if (archetype < 0.60) {
    // Average candidate
    return {
      assignment_score: rnd(50, 70),
      video_score: rnd(48, 68),
      ats_score: rnd(50, 72),
      github_score: rnd(40, 65),
      communication_score: rnd(45, 70),
    }
  } else if (archetype < 0.82) {
    // Weak candidate
    return {
      assignment_score: rnd(25, 54),
      video_score: rnd(20, 52),
      ats_score: rnd(22, 55),
      github_score: rnd(15, 48),
      communication_score: rnd(20, 50),
    }
  } else {
    // Mixed — good at one thing, weak at others
    const strong = pick(['assignment_score','video_score','ats_score','github_score','communication_score'])
    const base = {
      assignment_score: rnd(30, 60),
      video_score: rnd(28, 58),
      ats_score: rnd(30, 62),
      github_score: rnd(20, 55),
      communication_score: rnd(28, 58),
    }
    base[strong] = rnd(72, 96)
    return base
  }
}

let _idCounter = 1

export const generateCandidates = (count = 100) => {
  return Array.from({ length: count }, () => {
    const scores = genCandidateScores()
    return {
      id: _idCounter++,
      name: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
      college: pick(COLLEGES),
      ...scores,
      reviewed: Math.random() < 0.18,
      shortlisted: false,
      // Evaluation data
      asgnRatings: {
        ui_quality: 0,
        component_structure: 0,
        state_handling: 0,
        edge_case_handling: 0,
        responsiveness: 0,
        accessibility: 0,
      },
      vidRatings: {
        clarity: 0,
        confidence: 0,
        architecture_explanation: 0,
        tradeoff_reasoning: 0,
        communication: 0,
      },
      timestamps: [],
      notes: '',
    }
  })
}

export const ASGN_RATING_LABELS = {
  ui_quality: 'UI Quality',
  component_structure: 'Component Structure',
  state_handling: 'State Handling',
  edge_case_handling: 'Edge Case Handling',
  responsiveness: 'Responsiveness',
  accessibility: 'Accessibility',
}

export const VID_RATING_LABELS = {
  clarity: 'Clarity',
  confidence: 'Confidence',
  architecture_explanation: 'Architecture Explanation',
  tradeoff_reasoning: 'Tradeoff Reasoning',
  communication: 'Communication',
}
