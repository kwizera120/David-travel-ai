const predictForm = document.querySelector("#predict-form");
const fromDistrictInput = document.querySelector("#from-district");
const toDistrictInput = document.querySelector("#to-district");
const distanceKmInput = document.querySelector("#distance-km");
const predictBtn = predictForm ? predictForm.querySelector('button[type="submit"]') : null;

const predictionResult = document.querySelector("#prediction-result");
const predictionNote = document.querySelector("#prediction-note");
const predictStatus = document.querySelector("#predict-status");

const tripPlanForm = document.querySelector("#trip-plan-form");
const tripStatus = document.querySelector("#trip-status");
const interestButtons = document.querySelectorAll(".interest-btn");
const selectedInterests = new Set();

// Voice Recognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const chatForm = document.querySelector("#chat-form");
const chatWindow = document.querySelector("#chat-window");
const chatbotPanel = document.querySelector("#chatbot-panel");
const chatbotToggle = document.querySelector("#chatbot-toggle");
const chatbotClose = document.querySelector("#chatbot-close");
const chatMicBtn = document.querySelector("#chat-mic-btn");
let isChatRecording = false;

// Voice Recognition for Chatbot
if (SpeechRecognition && chatMicBtn) {
  const chatRecognition = new SpeechRecognition();
  chatRecognition.continuous = false;
  chatRecognition.interimResults = false;
  chatRecognition.lang = 'en-US';

  chatRecognition.onstart = () => {
    isChatRecording = true;
    chatMicBtn.classList.add("recording");
    if (chatForm) chatForm.elements.message.placeholder = "Listening...";
  };

  chatRecognition.onend = () => {
    isChatRecording = false;
    chatMicBtn.classList.remove("recording");
    if (chatForm) chatForm.elements.message.placeholder = "Type a message...";
  };

  chatRecognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    if (chatForm) {
      chatForm.elements.message.value = transcript;
      chatForm.dispatchEvent(new Event("submit"));
    }
  };

  chatMicBtn.addEventListener("click", () => {
    if (isChatRecording) {
      chatRecognition.stop();
    } else {
      chatRecognition.start();
    }
  });
}

const chatHistory = [
  {
    role: "assistant",
    content: "Hello! Ask about routes, prices, or how to use the fare estimator.",
  },
];

const translatorPanel = document.querySelector("#translator-panel");
const translatorToggle = document.querySelector("#translator-toggle");
const translatorClose = document.querySelector("#translator-close");
const translateForm = document.querySelector("#translate-form");
const targetLangSelect = document.querySelector("#target-lang");
const sourceText = document.querySelector("#source-text");
const translatedTextContainer = document.querySelector("#translated-text");
const detectedLanguageEl = document.querySelector("#detected-language");
const micBtn = document.querySelector("#mic-btn");
let isTranslating = false;
let isRecording = false;

// Voice Recognition logic for Translator
let recognition;

if (SpeechRecognition && micBtn) {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onstart = () => {
    isRecording = true;
    micBtn.classList.add("recording");
    if (sourceText) sourceText.placeholder = "Listening...";
  };

  recognition.onend = () => {
    isRecording = false;
    micBtn.classList.remove("recording");
    if (sourceText) sourceText.placeholder = "Type or speak to translate...";
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    if (sourceText) sourceText.value = transcript;
    performHostedTranslation(transcript, targetLangSelect.value);
  };

  recognition.onerror = () => {
    isRecording = false;
    micBtn.classList.remove("recording");
    if (sourceText) sourceText.placeholder = "Speech recognition error. Try typing.";
  };

  micBtn.addEventListener("click", () => {
    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
    }
  });
}

// New Trip Planner elements
const recommendationsContainer = document.querySelector("#recommendations-container");
const emptyResultsState = document.querySelector("#empty-results-state");

function setStatus(element, text) {
  if (element) {
    element.textContent = text;
  }
}

function appendMessage(role, text) {
  if (!chatWindow) return;
  const article = document.createElement("article");
  article.className = `message ${role}`;

  const roleLine = document.createElement("p");
  roleLine.className = "message-role";
  roleLine.textContent = role === "user" ? "You" : "Rwanda Travel AI";

  const body = document.createElement("p");
  body.textContent = text;

  article.append(roleLine, body);
  chatWindow.appendChild(article);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function renderRecommendations(result) {
  if (!recommendationsContainer || !emptyResultsState) return;

  if (!result || !result.recommendations) {
    emptyResultsState.style.display = "flex";
    recommendationsContainer.style.display = "none";
    return;
  }

  emptyResultsState.style.display = "none";
  recommendationsContainer.style.display = "flex";
  recommendationsContainer.innerHTML = "";

  const { budget_usd, duration_days, travelers, recommendations } = result;
  const dailyBudget = budget_usd && duration_days && travelers 
    ? Math.round(budget_usd / (duration_days * travelers)) 
    : 0;

  // 1. Header Card
  const headerCard = document.createElement("div");
  headerCard.className = "plan-header-card";
  headerCard.innerHTML = `
    <h2>✓ Your Personalized Plan</h2>
    <p class="plan-summary">Based on $${budget_usd} for ${duration_days} days with ${travelers} traveler(s)</p>
    <div class="daily-budget">
      <span>Daily budget per person</span>
      <strong>$${dailyBudget}</strong>
    </div>
  `;
  recommendationsContainer.appendChild(headerCard);

  // Group recommendations into categories
  const categories = {
    "Recommended Accommodation": "🏨",
    "Suggested Activities": "🎯",
    "Food & Dining": "🍴",
    "Transportation": "🚗"
  };

  const groupedRecs = {
    "Recommended Accommodation": [],
    "Suggested Activities": [],
    "Food & Dining": [],
    "Transportation": []
  };

  recommendations.forEach(rec => {
    const l = rec.toLowerCase();
    if (l.includes("hotel") || l.includes("guesthouse") || l.includes("backpackers") || l.includes("lodging")) {
      groupedRecs["Recommended Accommodation"].push(rec);
    } else if (l.includes("restaurant") || l.includes("food") || l.includes("meal") || l.includes("market")) {
      groupedRecs["Food & Dining"].push(rec);
    } else if (l.includes("transport") || l.includes("bus") || l.includes("taxi") || l.includes("route")) {
      groupedRecs["Transportation"].push(rec);
    } else {
      groupedRecs["Suggested Activities"].push(rec);
    }
  });

  Object.entries(categories).forEach(([name, icon]) => {
    const recs = groupedRecs[name];
    if (recs.length === 0) return;

    const card = document.createElement("div");
    card.className = "rec-card";
    
    let itemsHtml = recs.map(text => `
      <li class="rec-item">
        <span class="rec-item-check">✓</span>
        <span>${text}</span>
      </li>
    `).join("");

    card.innerHTML = `
      <div class="rec-card-head">
        <span>${icon}</span>
        <h4>${name}</h4>
      </div>
      <ul class="rec-list">
        ${itemsHtml}
      </ul>
    `;
    recommendationsContainer.appendChild(card);
  });

  const saveBtn = document.createElement("button");
  saveBtn.className = "primary-btn save-itinerary-btn";
  saveBtn.innerHTML = "Save to My Itinerary →";
  recommendationsContainer.appendChild(saveBtn);
}

// Auto-fetch distance logic
async function fetchRouteDistance() {
  if (!fromDistrictInput || !toDistrictInput || !distanceKmInput) return;
  const fromCity = fromDistrictInput.value.trim();
  const toCity = toDistrictInput.value.trim();

  if (!fromCity || !toCity) return;

  // Show loading feedback
  distanceKmInput.value = "Searching...";
  distanceKmInput.classList.add("loading-pulse");
  if (predictBtn) predictBtn.disabled = true;

  try {
    const response = await fetch("/get-route-distance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from_city: fromCity, to_city: toCity }),
    });

    const result = await response.json();

    if (result.success) {
      distanceKmInput.value = result.distance_km;
      distanceKmInput.placeholder = "";
      if (predictBtn) predictBtn.disabled = false;
      if (predictionNote) predictionNote.textContent = `Route found: ${result.distance_km} km. Ready to predict.`;
    } else {
      distanceKmInput.value = "";
      distanceKmInput.placeholder = result.error || "Route not found";
      if (predictionNote) predictionNote.textContent = result.error || "Distance not available for this route.";
      if (predictBtn) predictBtn.disabled = true;
    }
  } catch (error) {
    distanceKmInput.value = "";
    distanceKmInput.placeholder = "Lookup error";
    if (predictionNote) predictionNote.textContent = "Error searching for route distance.";
    if (predictBtn) predictBtn.disabled = true;
  } finally {
    distanceKmInput.classList.remove("loading-pulse");
  }
}

let debounceTimer;
function debouncedFetchDistance() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(fetchRouteDistance, 500); 
}

if (fromDistrictInput) fromDistrictInput.addEventListener("input", debouncedFetchDistance);
if (toDistrictInput) toDistrictInput.addEventListener("input", debouncedFetchDistance);
if (fromDistrictInput) fromDistrictInput.addEventListener("blur", fetchRouteDistance); 
if (toDistrictInput) toDistrictInput.addEventListener("blur", fetchRouteDistance);

// Event Listeners
interestButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.dataset.interest;
    if (selectedInterests.has(value)) {
      selectedInterests.delete(value);
      button.classList.remove("selected");
    } else {
      selectedInterests.add(value);
      button.classList.add("selected");
    }
  });
});

if (predictForm) {
  predictForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus(predictStatus, "Calculating");

    const formData = new FormData(predictForm);
    const payload = Object.fromEntries(formData.entries());
    payload.distance_km = Number(payload.distance_km);

    try {
      const response = await fetch("/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Prediction request failed");

      const result = await response.json();
      if (predictionResult) predictionResult.textContent = `RWF ${Number(result.predicted_price).toLocaleString()}`;
      if (predictionNote) predictionNote.textContent = `Estimated fare for ${payload.from_city} to ${payload.to_city} by ${payload.transport_type}.`;
      setStatus(predictStatus, "Complete");
    } catch (error) {
      if (predictionResult) predictionResult.textContent = "Unavailable";
      if (predictionNote) predictionNote.textContent = "Error reaching prediction service.";
      setStatus(predictStatus, "Error");
    }
  });
}

if (tripPlanForm) {
  tripPlanForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const predictData = predictForm ? Object.fromEntries(new FormData(predictForm).entries()) : {};
    const tripData = Object.fromEntries(new FormData(tripPlanForm).entries());

    const payload = {
      from_city: predictData.from_city,
      to_city: predictData.to_city,
      distance_km: Number(predictData.distance_km || 0),
      transport_type: predictData.transport_type,
      demand: predictData.demand,
      budget_usd: tripData.budget_usd ? Number(tripData.budget_usd) : null,
      duration_days: tripData.duration_days ? Number(tripData.duration_days) : null,
      travelers: tripData.travelers ? Number(tripData.travelers) : null,
      interests: Array.from(selectedInterests),
    };

    if (!payload.from_city || !payload.to_city || !payload.distance_km) {
      alert("Please fill in the Fare Estimator (at the top) first to provide your travel route.");
      return;
    }

    if (emptyResultsState) {
      emptyResultsState.innerHTML = `
        <div class="empty-icon">⏳</div>
        <h3>Building Your Plan...</h3>
        <p>Gathering the best recommendations for your trip.</p>
      `;
    }

    try {
      const response = await fetch("/recommend-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Recommendation request failed");

      const result = await response.json();
      renderRecommendations(result);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      renderRecommendations(null);
      if (emptyResultsState) {
        emptyResultsState.innerHTML = `
          <div class="empty-icon">❌</div>
          <h3>Failed to generate plan</h3>
          <p>Service unavailable. Please try again later.</p>
        `;
      }
    }
  });
}

if (chatForm) {
  chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = chatForm.elements.message;
    const message = input.value.trim();
    if (!message) return;

    appendMessage("user", message);
    chatHistory.push({ role: "user", content: message });
    input.value = "";

    try {
      const response = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          history: chatHistory.slice(0, -1),
        }),
      });

      if (!response.ok) throw new Error("Chat request failed");

      const result = await response.json();
      appendMessage("ai", result.response);
      chatHistory.push({ role: "assistant", content: result.response });
    } catch (error) {
      appendMessage("ai", "The assistant is temporarily unavailable.");
    }
  });
}

// Floating Widget Toggles
if (chatbotToggle && chatbotPanel && translatorPanel) {
  chatbotToggle.addEventListener("click", () => {
    chatbotPanel.classList.add("active");
    translatorPanel.classList.remove("active"); 
    // Hide both toggles when chatbot is open
    chatbotToggle.classList.add("hidden");
    translatorToggle.classList.add("hidden");
  });
}

if (chatbotClose && chatbotPanel) {
  chatbotClose.addEventListener("click", () => {
    chatbotPanel.classList.remove("active");
    // Re-show both toggles when chatbot is closed
    chatbotToggle.classList.remove("hidden");
    translatorToggle.classList.remove("hidden");
  });
}

if (translatorToggle && translatorPanel && chatbotPanel) {
  translatorToggle.addEventListener("click", () => {
    translatorPanel.classList.add("active");
    chatbotPanel.classList.remove("active"); 
    // Hide both toggles when translator is open
    chatbotToggle.classList.add("hidden");
    translatorToggle.classList.add("hidden");
  });
}

if (translatorClose && translatorPanel) {
  translatorClose.addEventListener("click", () => {
    translatorPanel.classList.remove("active");
    // Re-show both toggles when translator is closed
    chatbotToggle.classList.remove("hidden");
    translatorToggle.classList.remove("hidden");
  });
}

if (translateForm) {
  translateForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const text = sourceText.value.trim();
    if (!text) return;
    await performHostedTranslation(text, targetLangSelect.value);
  });
}

if (targetLangSelect) {
  targetLangSelect.addEventListener("change", async () => {
    const text = sourceText.value.trim();
    if (!text || isTranslating) return;
    await performHostedTranslation(text, targetLangSelect.value);
  });
}

async function performHostedTranslation(text, targetLang) {
  if (!translatedTextContainer || !detectedLanguageEl) return;
  
  translatedTextContainer.textContent = "Translating...";
  translatedTextContainer.classList.add("placeholder-text");
  detectedLanguageEl.textContent = "Detected language: checking...";
  isTranslating = true;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const detectResponse = await fetch("/detect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text }),
      signal: controller.signal,
    });

    if (detectResponse.ok) {
      const detectResult = await detectResponse.json();
      if (Array.isArray(detectResult) && detectResult.length > 0 && detectResult[0].language) {
        const langMap = {
          en: "English", fr: "French", rw: "Kinyarwanda", sw: "Swahili",
          es: "Spanish", de: "German", it: "Italian", pt: "Portuguese",
          ar: "Arabic", ru: "Russian", zh: "Chinese", ja: "Japanese",
        };
        const langCode = detectResult[0].language;
        const langName = langMap[langCode] || langCode;
        detectedLanguageEl.textContent = `Detected language: ${langName}`;
      } else {
        detectedLanguageEl.textContent = "Detected language: unknown";
      }
    }

    const translateResponse = await fetch("/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: text,
        source_lang: "auto",
        target_lang: targetLang,
      }),
      signal: controller.signal,
    });

    if (!translateResponse.ok) throw new Error("Translation request failed");

    const translateResult = await translateResponse.json();
    if (translateResult.success && translateResult.translatedText) {
      translatedTextContainer.textContent = translateResult.translatedText;
      translatedTextContainer.classList.remove("placeholder-text");
    } else {
      throw new Error(translateResult.error || "Translation failed");
    }
  } catch (error) {
    translatedTextContainer.textContent = "Translation service unavailable.";
    translatedTextContainer.classList.add("placeholder-text");
    detectedLanguageEl.textContent = "Detected language: unavailable";
  } finally {
    clearTimeout(timeout);
    isTranslating = false;
  }
}
