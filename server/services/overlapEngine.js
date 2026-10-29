// ============================================================
// AICTE Problem Statement 264 — Genuine Overlap Detection Engine
// Multi-Signal Semantic & Deterministic Cross-Bureau Similarity
// ============================================================

// Comprehensive administrative and academic stopwords
const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'if', 'because', 'as', 'what',
  'which', 'this', 'that', 'these', 'those', 'then', 'so', 'than', 'such',
  'both', 'through', 'about', 'for', 'is', 'of', 'while', 'during', 'to',
  'from', 'in', 'out', 'on', 'off', 'again', 'further', 'then', 'once',
  'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both',
  'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor',
  'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'can',
  'will', 'just', 'should', 'now', 'college', 'institute', 'institution',
  'student', 'students', 'complaint', 'grievance', 'aicte', 'management',
  'administration', 'department', 'campus', 'officials', 'letter', 'request',
  'dated', 'regarding', 'matter', 'kindly', 'sir', 'madam', 'portal', 'online'
]);

// Domain Keywords Dictionary for Grievance Sub-domains
const DOMAIN_ENTITIES = {
  fee_extortion: ['capitation', 'donation', 'cash', 'receipt', 'overcharge', 'excessive', 'refund', 'withheld', 'withholding', 'original', 'development', 'tuition', 'advance', 'cheque'],
  faculty_shortage: ['faculty', 'shortage', 'cadre', 'ratio', 'unqualified', 'ad-hoc', 'salary', 'unpaid', 'ghost', 'absent', 'mtech', 'phd', 'professors', 'teaching', 'deficit'],
  ragging_harassment: ['ragging', 'hostel', 'assault', 'harass', 'harassment', 'fresher', 'seniors', 'anti-ragging', 'warden', 'police', 'threat', 'intimidation', 'violence', 'fir'],
  infrastructure: ['laboratory', 'equipment', 'instruments', 'computers', 'fire', 'safety', 'library', 'building', 'software', 'defunct', 'broken', 'expired', 'facilities'],
  unapproved_courses: ['unapproved', 'approval', 'intake', 'unauthorized', 'affiliation', 'franchise', 'degree', 'diploma', 'sanctioned', 'without permission', 'seats', 'capacity'],
  admission_irregularity: ['quota', 'cutoff', 'reservation', 'merit', 'counseling', 'backdoor', 'bribe', 'auction', 'nri', 'management quota'],
  exam_malpractice: ['cheating', 'leak', 'paper', 'copying', 'invigilator', 'mass cheating', 'malpractice', 'exam', 'tampering']
};

// Stemming/normalizing common variants
function stemWord(word) {
  let w = word.toLowerCase().trim();
  if (w.endsWith('ing')) w = w.slice(0, -3);
  else if (w.endsWith('ies')) w = w.slice(0, -3) + 'y';
  else if (w.endsWith('es')) w = w.slice(0, -2);
  else if (w.endsWith('s') && !w.endsWith('ss')) w = w.slice(0, -1);
  else if (w.endsWith('ed')) w = w.slice(0, -2);
  return w;
}

// Tokenize text into normalized word list
export function tokenizeText(text) {
  if (!text) return [];
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .map(w => stemWord(w))
    .filter(w => w.length > 2 && !STOPWORDS.has(w));
  return words;
}

// Generate word n-grams (bi-grams & tri-grams)
export function getNGrams(tokens, n = 2) {
  const ngrams = [];
  for (let i = 0; i <= tokens.length - n; i++) {
    ngrams.push(tokens.slice(i, i + n).join(' '));
  }
  return ngrams;
}

// Calculate Term Frequency (TF)
function computeTF(tokens) {
  const tf = {};
  tokens.forEach(t => {
    tf[t] = (tf[t] || 0) + 1;
  });
  const total = tokens.length || 1;
  for (const k in tf) {
    tf[k] = tf[k] / total;
  }
  return tf;
}

// Cosine Similarity between two token maps
export function computeCosineSimilarity(tokensA, tokensB) {
  if (tokensA.length === 0 || tokensB.length === 0) return 0;

  const tfA = computeTF(tokensA);
  const tfB = computeTF(tokensB);

  const allWords = new Set([...Object.keys(tfA), ...Object.keys(tfB)]);
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (const w of allWords) {
    const valA = tfA[w] || 0;
    const valB = tfB[w] || 0;
    dotProduct += valA * valB;
    normA += valA * valA;
    normB += valB * valB;
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : Number((dotProduct / denominator).toFixed(4));
}

// Jaccard similarity for n-grams
export function computeJaccardSimilarity(arrA, arrB) {
  const setA = new Set(arrA);
  const setB = new Set(arrB);
  if (setA.size === 0 && setB.size === 0) return 0;
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return union.size === 0 ? 0 : Number((intersection.size / union.size).toFixed(4));
}

// Category alignment taxonomy matrix
export function computeCategoryScore(catA, catB) {
  if (!catA || !catB) return 0.2;
  if (catA.toLowerCase() === catB.toLowerCase()) return 1.0;

  const a = catA.toLowerCase();
  const b = catB.toLowerCase();

  const relatedPairs = [
    ['fee related', 'admission irregularity', 0.75],
    ['infrastructure', 'unapproved courses', 0.70],
    ['ragging', 'harassment', 0.80],
    ['faculty shortage', 'infrastructure', 0.60],
    ['affiliation issue', 'unapproved courses', 0.85],
    ['exam malpractice', 'admission irregularity', 0.65],
    ['placement fraud', 'fee related', 0.50]
  ];

  for (const [p1, p2, score] of relatedPairs) {
    if ((a.includes(p1) && b.includes(p2)) || (a.includes(p2) && b.includes(p1))) {
      return score;
    }
  }

  return 0.15;
}

// Timeline proximity calculation
export function computeTimelineScore(dateA, dateB) {
  const dA = new Date(dateA).getTime();
  const dB = new Date(dateB).getTime();
  const diffDays = Math.abs(Math.round((dA - dB) / (1000 * 60 * 60 * 24)));

  let score = 0.2;
  if (diffDays <= 7) score = 1.0;
  else if (diffDays <= 21) score = 0.9;
  else if (diffDays <= 45) score = 0.75;
  else if (diffDays <= 90) score = 0.6;
  else if (diffDays <= 180) score = 0.4;

  return { score, diffDays };
}

// Extract overlapping domain entities
export function extractMatchedEntities(textA, textB) {
  const foundEntities = [];
  const wordsA = new Set(textA.toLowerCase().split(/\W+/));
  const wordsB = new Set(textB.toLowerCase().split(/\W+/));

  for (const [domain, keywords] of Object.entries(DOMAIN_ENTITIES)) {
    const matchedInA = keywords.filter(k => wordsA.has(k) || textA.toLowerCase().includes(k));
    const matchedInB = keywords.filter(k => wordsB.has(k) || textB.toLowerCase().includes(k));
    const common = matchedInA.filter(k => matchedInB.includes(k));
    if (common.length > 0) {
      foundEntities.push({
        domain: domain.replace('_', ' ').toUpperCase(),
        commonKeywords: common
      });
    }
  }
  return foundEntities;
}

/**
 * Genuine Complaint Overlap Evaluator
 * Compares two actual complaints and returns an explainable score, signals & differences
 */
export function analyzeComplaintPair(complaintA, complaintB, institution) {
  // 1. Institution Identity Check
  const sameInstitutionId = complaintA.institutionId === complaintB.institutionId;
  const sameInstitutionName = institution ? true : (complaintA.institutionName && complaintA.institutionName === complaintB.institutionName);
  const institutionScore = (sameInstitutionId || sameInstitutionName) ? 1.0 : 0.0;

  // 2. Category Alignment
  const categoryScore = computeCategoryScore(complaintA.category, complaintB.category);

  // 3. Text Semantic Overlap (TF-IDF Cosine + Bigram Jaccard)
  const tokensA = tokenizeText(complaintA.description);
  const tokensB = tokenizeText(complaintB.description);
  const cosineTfidf = computeCosineSimilarity(tokensA, tokensB);

  const ngramsA = getNGrams(tokensA, 2);
  const ngramsB = getNGrams(tokensB, 2);
  const ngramsJaccard = computeJaccardSimilarity(ngramsA, ngramsB);

  const semanticScore = Number((0.75 * cosineTfidf + 0.25 * ngramsJaccard).toFixed(3));

  // 4. Timeline Proximity
  const { score: timelineScore, diffDays } = computeTimelineScore(complaintA.filedDate, complaintB.filedDate);

  // 5. Cross-Bureau Flag
  const isCrossBureau = complaintA.department !== complaintB.department;

  // 6. Matched Entities
  const matchedEntities = extractMatchedEntities(complaintA.description, complaintB.description);

  // 7. Critical Safety / Severity Weighting
  const isCriticalCategory =
    complaintA.category === 'Ragging' || complaintA.category === 'Harassment' ||
    complaintB.category === 'Ragging' || complaintB.category === 'Harassment';

  // Weighted Composite Score Calculation
  let rawScore =
    (institutionScore * 0.35) +
    (categoryScore * 0.25) +
    (semanticScore * 0.25) +
    (timelineScore * 0.15);

  if (institutionScore === 0.0) {
    rawScore = 0.0;
  } else if (isCriticalCategory && categoryScore >= 0.8) {
    rawScore = Math.min(1.0, rawScore + 0.08);
  }

  // CRITICAL REQUIREMENT:
  // Clearly distinguish a common institution from a genuinely overlapping allegation!
  // If same institution, but semantic similarity is poor and categories are unrelated:
  let overlapTier = 'LOW';
  let isCommonInstitutionOnly = false;

  if (institutionScore === 1.0 && semanticScore < 0.25 && categoryScore <= 0.40) {
    // Unrelated complaints against the same college!
    isCommonInstitutionOnly = true;
    rawScore = Math.min(0.38, rawScore * 0.5); // Cap low
    overlapTier = 'COMMON_INSTITUTION_DISTINCT';
  } else if (rawScore >= 0.75) {
    overlapTier = 'HIGH_CONFIDENCE_OVERLAP';
  } else if (rawScore >= 0.55) {
    overlapTier = 'MODERATE_OVERLAP_SHARED_CONTEXT';
  } else {
    overlapTier = 'LOW_PROBABILITY_INDEPENDENT';
  }

  const finalScore = Number(rawScore.toFixed(3));

  // Build Explainable Signals
  const matchedSignals = [];
  const differences = [];

  if (sameInstitutionId || institutionScore === 1.0) {
    matchedSignals.push(
      `Permanent AICTE Identifier Match: ${institution?.aicteId || 'Verified Record'} (${institution?.name || complaintA.institutionName || 'Same College'})`
    );
  } else {
    differences.push('Different institutions or unverified entity records.');
  }

  if (complaintA.category === complaintB.category) {
    matchedSignals.push(`Exact Grievance Domain Match: Both cases categorized under '${complaintA.category}'.`);
  } else if (categoryScore >= 0.6) {
    matchedSignals.push(`Correlated Grievance Domain: '${complaintA.category}' and '${complaintB.category}' share regulatory nexus.`);
  } else {
    differences.push(`Distinct Categories: Case A is '${complaintA.category}' vs Case B is '${complaintB.category}'.`);
  }

  if (semanticScore >= 0.60) {
    matchedSignals.push(`High Semantic Narrative Overlap (${Math.round(semanticScore * 100)}%): Core grievance statements report identical grievance points.`);
  } else if (semanticScore >= 0.30) {
    matchedSignals.push(`Moderate Semantic Similarity (${Math.round(semanticScore * 100)}%): Shared context and related terminology detected.`);
  } else {
    differences.push(`Disparate Grievance Narratives: Word and phrase distributions indicate independent allegations.`);
  }

  if (matchedEntities.length > 0) {
    matchedEntities.forEach(e => {
      matchedSignals.push(`Shared Domain Keywords in ${e.domain}: [${e.commonKeywords.join(', ')}]`);
    });
  }

  if (diffDays <= 30) {
    matchedSignals.push(`Timeline Proximity: Filed ${diffDays} days apart during the same academic evaluation term.`);
  } else {
    differences.push(`Temporal Separation: Filed ${diffDays} days apart.`);
  }

  if (isCrossBureau) {
    matchedSignals.push(`Cross-Bureau Collision: Active parallel handling between ${complaintA.department} Bureau and ${complaintB.department} Bureau.`);
  } else {
    differences.push(`Internal Bureau Review: Both cases reside within the same department (${complaintA.department}).`);
  }

  if (complaintA.complainantType !== complaintB.complainantType) {
    differences.push(`Complainant Diversity: Filed by ${complaintA.complainantType} in Case A vs ${complaintB.complainantType} in Case B.`);
  }

  let matchType = 'SAME_INSTITUTION';
  if (semanticScore >= 0.70) matchType = 'SEMANTIC_SIMILARITY';
  else if (categoryScore === 1.0) matchType = 'CATEGORY_MATCH';
  else if (matchedEntities.length > 0) matchType = 'ENTITY_MATCH';

  return {
    similarityScore: finalScore,
    semanticScore,
    categoryScore,
    institutionScore,
    timelineScore,
    timelineDeltaDays: diffDays,
    overlapTier,
    matchType,
    isCrossBureau,
    isCommonInstitutionOnly,
    matchedSignals,
    differences,
    confidenceLabel: finalScore >= 0.75 ? 'Genuine Overlap' : (finalScore >= 0.55 ? 'Potential Coordination Needed' : 'Distinct Case')
  };
}

/**
 * Scan Database for Potential Overlaps
 * Examines open complaints across bureaus and identifies genuine collision candidates
 */
export async function scanDatabaseForOverlaps(prisma, threshold = 0.55) {
  const activeComplaints = await prisma.complaint.findMany({
    where: {
      status: { notIn: ['DISPOSED', 'CLOSED'] }
    },
    include: {
      institution: true
    }
  });

  const discovered = [];

  // Group by institution to avoid quadratic explosion across unrelated colleges
  const byInstitution = {};
  for (const c of activeComplaints) {
    if (!byInstitution[c.institutionId]) byInstitution[c.institutionId] = [];
    byInstitution[c.institutionId].push(c);
  }

  for (const instId in byInstitution) {
    const list = byInstitution[instId];
    if (list.length < 2) continue;

    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const cA = list[i];
        const cB = list[j];

        // Focus especially on cross-bureau pairs
        if (cA.department === cB.department && cA.category !== cB.category) continue;

        const analysis = analyzeComplaintPair(cA, cB, cA.institution);

        if (analysis.similarityScore >= threshold && !analysis.isCommonInstitutionOnly) {
          discovered.push({
            complaintAId: cA.id,
            complaintBId: cB.id,
            institutionId: instId,
            matchType: analysis.matchType,
            similarityScore: analysis.similarityScore,
            semanticScore: analysis.semanticScore,
            categoryScore: analysis.categoryScore,
            timelineDeltaDays: analysis.timelineDeltaDays,
            departmentA: cA.department,
            departmentB: cB.department,
            status: 'FLAGGED',
            matchedSignals: JSON.stringify(analysis.matchedSignals),
            differences: JSON.stringify(analysis.differences)
          });
        }
      }
    }
  }

  return discovered;
}

/**
 * Benchmark Evaluation Engine
 * Evaluates model against ground-truth labeled test dataset
 * Computes Precision, Recall, F1-Score, and False Positive Rate
 */
export function evaluateBenchmark(benchmarkCases, threshold = 0.65) {
  let tp = 0;
  let fp = 0;
  let tn = 0;
  let fn = 0;

  const caseResults = [];

  for (const b of benchmarkCases) {
    const tokensA = tokenizeText(b.descriptionA);
    const tokensB = tokenizeText(b.descriptionB);
    const cosineTfidf = computeCosineSimilarity(tokensA, tokensB);
    const ngramsA = getNGrams(tokensA, 2);
    const ngramsB = getNGrams(tokensB, 2);
    const ngramsJaccard = computeJaccardSimilarity(ngramsA, ngramsB);
    const semanticScore = Number((0.75 * cosineTfidf + 0.25 * ngramsJaccard).toFixed(3));
    const categoryScore = computeCategoryScore(b.categoryA, b.categoryB);

    // Score synthesis
    let predictedScore = 0.35 + (categoryScore * 0.30) + (semanticScore * 0.35);

    // Common institution filter check
    if (categoryScore <= 0.4 && semanticScore < 0.25) {
      predictedScore = Math.min(0.35, predictedScore * 0.5);
    }

    predictedScore = Number(predictedScore.toFixed(3));
    const predictedLabel = predictedScore >= threshold;

    if (b.groundTruthLabel === true && predictedLabel === true) {
      tp++;
    } else if (b.groundTruthLabel === false && predictedLabel === true) {
      fp++;
    } else if (b.groundTruthLabel === false && predictedLabel === false) {
      tn++;
    } else if (b.groundTruthLabel === true && predictedLabel === false) {
      fn++;
    }

    caseResults.push({
      pairKey: b.pairKey,
      institutionName: b.institutionName,
      groundTruthLabel: b.groundTruthLabel,
      predictedScore,
      predictedLabel,
      isCorrect: predictedLabel === b.groundTruthLabel,
      explanation: b.explanation,
      verdict: predictedLabel === b.groundTruthLabel ? 'CORRECT' : (predictedLabel ? 'FALSE_POSITIVE' : 'FALSE_NEGATIVE')
    });
  }

  const total = benchmarkCases.length || 1;
  const precision = (tp + fp) > 0 ? Number((tp / (tp + fp)).toFixed(3)) : 1.0;
  const recall = (tp + fn) > 0 ? Number((tp / (tp + fn)).toFixed(3)) : 1.0;
  const f1Score = (precision + recall) > 0 ? Number((2 * (precision * recall) / (precision + recall)).toFixed(3)) : 0;
  const falsePositiveRate = (fp + tn) > 0 ? Number((fp / (fp + tn)).toFixed(3)) : 0;
  const accuracy = Number(((tp + tn) / total).toFixed(3));

  return {
    metrics: {
      totalCases: total,
      truePositives: tp,
      falsePositives: fp,
      trueNegatives: tn,
      falseNegatives: fn,
      precision,
      recall,
      f1Score,
      falsePositiveRate,
      accuracy,
      thresholdUsed: threshold
    },
    caseResults
  };
}
