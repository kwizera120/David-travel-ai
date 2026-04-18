# React Frontend Migration TODO

## Current Status: Starting migration from vanilla JS to Vite + React (logic/styling preserved)

## [x] 0. Planning & Analysis ✅
- [x] Analyzed index.html structure
- [x] Analyzed app.js logic (all APIs, speech, state)
- [x] User approved plan

## [ ] 1. Project Setup
- [ ] Create `frontend-react/` Vite + React 18 project
- [ ] Copy `frontend/static/styles.css` → `frontend-react/src/`
- [ ] Setup vite.config.js with backend proxy
- [ ] `npm install`

## [ ] 2. React Components (Preserve exact HTML/classes)
- [ ] `App.jsx` - Main layout + state management
- [ ] `FarePredictor.jsx` - Predict form + distance lookup
- [ ] `TripPlanner.jsx` - Interests + trip form
- [ ] `Chatbot.jsx` - Chat + speech recognition
- [ ] `Translator.jsx` - Translation + speech
- [ ] `Recommendations.jsx` - Dynamic rendering

## [ ] 3. Logic Migration (1:1 from app.js)
- [ ] All 6 API endpoints (/predict, /recommend-trip, /chat, /translate, /detect, /get-route-distance)
- [ ] SpeechRecognition hooks for chat/translator
- [ ] debouncedFetchDistance (useCallback + useEffect)
- [ ] selectedInterests (useState Set)
- [ ] Widget toggle state (mutually exclusive)
- [ ] renderRecommendations categorization logic

## [ ] 4. Backend Updates
- [ ] Modify `backend/main.py` to serve `/frontend-react/dist`
- [ ] Update routes to prioritize React SPA

## [ ] 5. Testing & Production
- [ ] `cd frontend-react && npm run dev` - dev server test
- [ ] Full E2E feature testing
- [ ] `npm run build`
- [ ] Backend restart + production test
- [ ] Optional: Archive old frontend/

**Goal:** Zero logic/styling changes, same user experience
