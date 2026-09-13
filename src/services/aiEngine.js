/**
 * UrbanPulse AI Engine Service
 * Provides client-side AI simulations for:
 * 1. Text NLP Complaint Categorization & Urgency Scoring
 * 2. Smart Duplicate Complaint Clustering
 * 3. Vision AI Before/After Maintenance Repair Verification
 * 4. AI Notice Drafting & Multilingual Translation
 */

// Category dictionary & urgency rules
const CATEGORY_KEYWORDS = {
  Plumbing: ['water', 'leak', 'pipe', 'tap', 'flush', 'drain', 'overflow', 'sink', 'sewage', 'tank'],
  Electrical: ['spark', 'power', 'light', 'short circuit', 'wire', 'fuse', 'socket', 'electricity', 'blackout', 'switch'],
  Elevator: ['lift', 'elevator', 'trapped', 'stuck', 'door', 'floor', 'button', 'noisy lift'],
  Security: ['stranger', 'gate', 'guard', 'theft', 'camera', 'cctv', 'parking', 'lock', 'trespass'],
  Civil: ['wall', 'crack', 'seepage', 'tile', 'plaster', 'roof', 'door handle', 'staircase']
};

const CRITICAL_KEYWORDS = ['trapped', 'fire', 'spark', 'sewage overflow', 'blackout', 'lift stuck', 'short circuit', 'gushing water'];
const HIGH_KEYWORDS = ['leak', 'no power', 'gate broken', 'cctv down', 'no water', 'security'];

export const analyzeComplaintNLP = (title, description) => {
  const fullText = `${title} ${description}`.toLowerCase();
  
  // 1. Detect Category
  let detectedCategory = 'General Maintenance';
  let maxMatches = 0;

  Object.entries(CATEGORY_KEYWORDS).forEach(([category, keywords]) => {
    const matches = keywords.filter(word => fullText.includes(word)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      detectedCategory = category;
    }
  });

  // 2. Predict Priority & SLA
  let priority = 'Low';
  let slaHours = 48;
  let urgencyReason = 'Routine maintenance request.';

  if (CRITICAL_KEYWORDS.some(k => fullText.includes(k))) {
    priority = 'Critical';
    slaHours = 2;
    urgencyReason = 'Safety hazard or essential service outage detected. High priority dispatch.';
  } else if (HIGH_KEYWORDS.some(k => fullText.includes(k))) {
    priority = 'High';
    slaHours = 12;
    urgencyReason = 'Significant issue affecting daily living. 12-hour SLA assigned.';
  } else if (maxMatches > 0) {
    priority = 'Medium';
    slaHours = 24;
    urgencyReason = 'Standard resolution window assigned based on category analysis.';
  }

  // 3. Auto Tagging
  const tags = [detectedCategory, `${priority} Priority`];
  if (fullText.includes('block a') || fullText.includes('tower 1')) tags.push('Tower A');
  if (fullText.includes('urgent') || fullText.includes('emergency')) tags.push('Flagged Urgent');

  return {
    category: detectedCategory,
    priority,
    slaHours,
    urgencyReason,
    confidenceScore: Math.min(85 + maxMatches * 4, 99),
    tags
  };
};

export const checkDuplicateComplaints = (newTitle, newDesc, existingComplaints = []) => {
  const newText = `${newTitle} ${newDesc}`.toLowerCase();
  const wordsNew = new Set(newText.split(/\s+/).filter(w => w.length > 3));

  const duplicates = [];

  existingComplaints.forEach(item => {
    if (item.status === 'Resolved') return;
    const itemText = `${item.title} ${item.description}`.toLowerCase();
    const wordsItem = itemText.split(/\s+/).filter(w => w.length > 3);

    let matchCount = 0;
    wordsItem.forEach(w => {
      if (wordsNew.has(w)) matchCount++;
    });

    const similarity = wordsItem.length ? Math.round((matchCount / wordsItem.length) * 100) : 0;
    
    if (similarity > 35) {
      duplicates.push({
        id: item.id,
        title: item.title,
        status: item.status,
        similarity,
        resident: item.residentName,
        flat: item.flatNumber
      });
    }
  });

  return duplicates.sort((a, b) => b.similarity - a.similarity);
};

export const runVisionAIVerification = (beforeImage, afterImage, category) => {
  // Simulates deep learning visual feature comparison between before & after photos
  return new Promise((resolve) => {
    setTimeout(() => {
      // Calculate realistic simulated score
      const matchScore = Math.floor(Math.random() * 15) + 84; // 84% - 98%
      const isVerified = matchScore >= 80;

      let keyDetections = [];
      if (category === 'Plumbing') {
        keyDetections = ['Pipe joint sealed', 'No active water drip', 'Clean surrounding area'];
      } else if (category === 'Electrical') {
        keyDetections = ['Wiring insulated', 'Switch box cover attached', 'Indicator light operational'];
      } else if (category === 'Elevator') {
        keyDetections = ['Sensor re-aligned', 'Control panel operational', 'Safety latch engaged'];
      } else {
        keyDetections = ['Surface repaired', 'Debris cleared', 'Visual defect resolved'];
      }

      resolve({
        verificationScore: matchScore,
        status: isVerified ? 'Verified Approved' : 'Verification Flagged',
        isVerified,
        confidence: '96.4%',
        detections: keyDetections,
        analysisSummary: isVerified 
          ? `Vision AI matched structural features. Defect identified in 'Before' image is no longer present in 'After' photo with ${matchScore}% visual resolution confidence.`
          : `Vision AI detected potential incompleteness. Recommended manual review by Committee Admin.`
      });
    }, 1500);
  });
};

export const generateAINotice = (promptText) => {
  const p = promptText.toLowerCase();
  
  let noticeTitle = "Society Announcement";
  let noticeContent = promptText;

  if (p.includes('water') || p.includes('shutdown') || p.includes('supply')) {
    noticeTitle = "Notice: Scheduled Water Supply Maintenance";
    noticeContent = `Dear Residents,\n\nPlease be informed that scheduled maintenance of the primary overhead water tanks will take place on ${new Date(Date.now() + 86400000).toLocaleDateString()}. Water supply will be temporarily paused between 10:00 AM and 02:00 PM.\n\nKindly store adequate water for morning usage. We apologize for the inconvenience and appreciate your cooperation.\n\nRegards,\nManagement Committee`;
  } else if (p.includes('lift') || p.includes('elevator')) {
    noticeTitle = "Notice: Elevator Inspection & Service";
    noticeContent = `Dear Residents,\n\nAnnual safety inspection for Tower A & B elevators is scheduled for tomorrow. Lift #2 will remain non-operational from 11:00 AM to 03:00 PM. Lift #1 will be available.\n\nThank you for your patience.\n\nManagement Committee`;
  } else if (p.includes('meeting') || p.includes('agm') || p.includes('society meeting')) {
    noticeTitle = "Notice: General Body Society Meeting";
    noticeContent = `Dear Residents,\n\nYou are cordially invited to the upcoming General Body Meeting scheduled for Sunday at 05:00 PM in the Society Clubhouse. Key agenda items: Annual Budget Review, Security Upgrade, and Solar Panel installation.\n\nYour presence is highly valuable.\n\nManagement Committee`;
  } else {
    noticeTitle = `Notice regarding: ${promptText.slice(0, 30)}...`;
    noticeContent = `Dear Residents,\n\n${promptText}\n\nFor any queries, please reach out to the society office during operational hours.\n\nWarm regards,\nManagement Committee`;
  }

  // Generate translations
  const hindiContent = `प्रिय निवासियों,\n\n${noticeContent.split('\n\n')[1] || noticeContent}\n\nधन्यवाद,\nप्रबंध समिति`;
  const marathiContent = `सस्नेह नमस्कार रहिवासी,\n\n${noticeContent.split('\n\n')[1] || noticeContent}\n\nआपला नम्र,\nव्यवस्थापन समिती`;

  return {
    title: noticeTitle,
    content: noticeContent,
    translations: {
      en: noticeContent,
      hi: hindiContent,
      mr: marathiContent
    }
  };
};
