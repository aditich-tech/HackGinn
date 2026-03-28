/**
 * aiService.js
 * Simulates an AI backend for generating hackathon ideas with Premium content.
 */

const baseIdeas = [
  {
    id: 1,
    title: "EcoTrack AI",
    description: "An AI-powered mobile app that uses computer vision to identify recyclable materials and rewards users with crypto-tokens for proper disposal.",
    techStack: ["React Native", "TensorFlow Lite", "Solidity", "Node.js"],
    uniqueness: "Combines CV with Blockchain incentives to solve waste management.",
    explanation: "EcoTrack uses your phone's camera to scan trash. It tells you exactly where it goes (Recycle, Compost, Landfill) and verifies the action via geo-tagging, minting 'EcoUnits' on the blockchain.",
    features: ["Object Detection", "Tokenomics", "Community Leaderboard", "Vendor Coupons"],
    architecture: "Mobile App -> Firebase (Storage) -> ML Model -> Polygon Network",
    uiIdea: "Clean, green-themed interface with a 'Scan' button as the center of gravity.",
    // Premium Content
    workflow: [
      "Set up React Native with Camera permissions.",
      "Integrate TensorFlow Lite with a pre-trained garbage classification model.",
      "Implement a basic smart contract on Polygon for 'EcoUnit' minting.",
      "Sync geo-location data with the minting process for verification."
    ],
    pitch: {
      problem: "People are discouraged from recycling due to lack of immediate incentive and confusion over sorting.",
      solution: "Gamified recycling with real crypto value and AI-assisted sorting.",
      usp: "First dual-incentive system (Social + Financial) powered by mobile-first computer vision.",
      demo: "Live scan of a plastic bottle showing immediate 'Sorting Identified' and 'Wallet Updated' UI flow."
    },
    market: "Targeting urban millennials and Gen Z who are eco-conscious but tech-driven. Taps into the ESG (Environmental, Social, and Governance) market.",
    futureScope: "Partnerships with municipal waste management for direct reward redemption."
  },
  {
    id: 2,
    title: "MedSync Bridge",
    description: "A secure, decentralized platform for sharing patient medical history between different hospitals using zero-knowledge proofs.",
    techStack: ["Next.js", "Ethereum ZK-Rollups", "InterPlanetary File System (IPFS)", "Python"],
    uniqueness: "Ensures 100% privacy while allowing emergency access via smart contracts.",
    explanation: "Hospitals often use fragmented systems. MedSync allows patients to carry their own data in a 'Digital Health Passport' that can be decrypted by authorized medical personnel only in verified locations.",
    features: ["ZK-Proof Auth", "Immutable Logs", "Emergency Override Hub", "Doctor Verification Service"],
    architecture: "Frontend (Next.js) -> Smart Contracts (Solidity) -> Encryption Layer -> IPFS",
    uiIdea: "Minimalist, trusted blue aesthetic with biometric login simulation.",
    // Premium Content
    workflow: [
      "Develop ZK-Proof generation using Circom.",
      "Set up an IPFS node to store encrypted medical records.",
      "Write Solidity contracts for permissioning and emergency override logic.",
      "Build a Next.js dashboard for doctors and patients."
    ],
    pitch: {
      problem: "Fragmented EHR (Electronic Health Records) leading to delayed treatment and data breaches.",
      solution: "Patient-owned, globally accessible data hub with cryptographically guaranteed privacy.",
      usp: "Uses ZK-Rollups to keep costs low and security absolute.",
      demo: "Seamless data transfer between two simulated hospital portals without central database access."
    },
    market: "HealthTech sector. Hospitals, private clinics, and individual patients seeking data sovereignty.",
    futureScope: "Integration with wearable devices for real-time health data sync."
  },
  {
    id: 3,
    title: "VibeCoder AI",
    description: "A pair-programming assistant that matches your coding rhythm with lo-fi beats and suggests code snippets based on the 'vibe' of your project.",
    techStack: ["VS Code Extension", "GPT-4 API", "Web Audio API", "Spotify SDK"],
    uniqueness: "Focuses on 'flow state' rather than just efficiency.",
    explanation: "VibeCoder listens to your keystrokes and matches the background music BPM. It suggests snippets that fit the complexity of your current work, providing 'calm' vs 'intense' modes.",
    features: ["Pulse-matching music", "Context-aware snippets", "Zen Mode UI", "Pomodoro integration"],
    architecture: "Extension -> WebSocket -> AI Server -> Music API",
    uiIdea: "Neon purple gradients, animated wave patterns, and a floating music controller.",
    // Premium Content
    workflow: [
      "Create a VS Code extension with a dedicated SidePanel.",
      "Implement keystroke monitoring (debounce-heavy) to calculate typing BPM.",
      "Integrate Spotify Web Playback SDK for music control.",
      "Connect to an LLM endpoint for 'vibe-calibrated' code suggestions."
    ],
    pitch: {
      problem: "Developer burnout and distraction from switching between IDE and music players.",
      solution: "An immersive coding environment that automates focus and soundtracking.",
      usp: "AI that understands the 'mood' of your code (e.g. debugging vs architectural planning) and tunes the environment.",
      demo: "Type complex code -> BPM increases + dark mode deepens. Type comments -> Lofi kicks in."
    },
    market: "Indie developers, software engineers at large firms, and students.",
    futureScope: "Collaborative 'VibeRooms' where squads can sync their coding rhythms and music."
  },
  {
    id: 4,
    title: "AgroSense Drone",
    description: "An autonomous drone system for small-scale farmers that detects crop diseases and soil moisture levels using hyper-spectral imaging.",
    techStack: ["Python", "DJI SDK", "PyTorch", "AWS IoT Core"],
    uniqueness: "Affordable precision agriculture for farmers with limited resources.",
    explanation: "AgroSense flies over fields and creates a real-time 'Health Map' of crops. It identifies early signs of pests or drought, allowing farmers to take targeted action rather than blanket treatments.",
    features: ["Autonomous Flight", "Disease Classification", "Moisture Mapping", "Offline Dashboard"],
    architecture: "Drone -> Onboard AI -> Gateway -> Cloud Analytics",
    uiIdea: "Earth-toned dashboard with heatmaps and actionable alerts.",
    // Premium Content
    workflow: [
      "Develop flight controller logic using DJI SDK.",
      "Train a CNN for plant disease detection on agricultural datasets.",
      "Implement real-time image processing on the drone's edge computer.",
      "Set up AWS IoT for data telemetry and historical analysis."
    ],
    pitch: {
      problem: "Crop loss due to undetected diseases and inefficient watering in small farms.",
      solution: "Eyes-in-the-sky intelligence that makes every drop of water and pesticide count.",
      usp: "Edge-AI processing means no constant internet connection required in remote fields.",
      demo: "Drone identifies a 'Rust Disease' patch and marks it on the iPad map in real-time."
    },
    market: "Modern farmers, agricultural cooperatives, and non-profits focused on food security.",
    futureScope: "Swarm technology for larger fields and automated pest spraying."
  }
];

export const generateIdeas = (inputs) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let results = [...baseIdeas];
      
      // Basic modulation based on skill
      if (inputs.skillLevel === 'Beginner') {
        results = results.map(idea => ({
          ...idea,
          title: "Simplified " + idea.title,
          description: "An entry-level approach to " + idea.title + ". " + idea.description
        }));
      } else if (inputs.skillLevel === 'Vibe Coder') {
        results = results.map(idea => ({
          ...idea,
          title: idea.title + " (Vibe Edition)",
          description: "A more experimental and aesthetic-focused " + idea.title + "."
        }));
      }

      // If modification text exists (Refinement)
      if (inputs.additionalNotes) {
        results = results.map(idea => ({
            ...idea,
            title: `${idea.title} [Refined]`,
            description: `${idea.description} (Taking into account: ${inputs.additionalNotes})`,
            uniqueness: `Enhanced: ${idea.uniqueness}. Reflects user's specialized focus.`
        }));
      }

      const shuffled = results.sort(() => 0.5 - Math.random());
      resolve(shuffled.slice(0, 4));
    }, 3000);
  });
};

export const generateSimilar = (idea) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const similar = baseIdeas
        .filter(i => i.id !== idea.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 4)
        .map(i => ({
          ...i,
          title: `Alt: ${i.title}`,
          description: `Inspired by the success factors of ${idea.title}. ${i.description}`
        }));
      resolve(similar);
    }, 2500);
  });
};
