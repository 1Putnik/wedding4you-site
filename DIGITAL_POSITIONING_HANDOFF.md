# Digital self-service positioning handoff

## Scope and reuse

- Updated the existing static Hebrew and Russian site templates, shared header/footer, `white-wedding.css`, and `ru/ru.css`. No new framework, payment flow, booking integration, or third-party module was added.
- Preserved the live cabinet entry point: `https://wedding4you-cabinet.onrender.com/customer-cabinet.html`.
- Kept the existing official-process articles and their source links where they explain what the couple must do. The old `reviews.html` URLs now explain the digital path, because the quote blocks could not be substantiated and some quotes explicitly described an agency service.

## Offer and claim boundary

- One digital preparation route: **₪990 per pair**. Official Utah County fees, officiant/ceremony, apostille, translation, and other external costs are separate and paid directly to the relevant providers.
- The copy describes a private applicant draft, save/resume, local document-image preview, process guidance in Russian and Hebrew, Cupid as a guide, and technical help if a couple gets stuck.
- The couple personally checks official requirements, fills and submits the Utah application, verifies identity, signs, pays fees, coordinates witnesses and ceremony, and later handles any Israeli registry request. The site no longer says Wedding4You files, books, orders, or follows up on their behalf.
- The cabinet does **not yet** parse documents, auto-fill Utah's official form, upload documents, submit applications, book an officiant, or issue a license. Those integrations need product work before copy can promise them. The specific “automation fills documents/forms” aspiration remains a future capability, not a live-site claim.
- The existing 077 phone number remains available as a plain contact link. The site makes no AI-agent, immediate-answer, or 24/7 availability claim for that number. WhatsApp is identified as the technical-help channel.
- Do not claim “cheapest in Israel” as a verified market-wide fact. Public examples supplied for comparison were ₪1,490 at `get-married.co.il`, and ₪1,980 at `zoom-utah.co.il` and `ec-passport.co.il`, but their bundles include items excluded from this ₪990 digital route. A like-for-like, dated market survey would be needed for a superlative.

## Verification

- 33 public HTML files reviewed/updated across HE and RU. Internal-link check found **0 missing local links**.
- Headless Chrome rendered home, guide, FAQ, documents, pride, and digital-route pages at 390px in both languages. Each had `documentElement.scrollWidth === innerWidth === 390`; the home hero images loaded. Screenshot review: `he-mobile.png`, `ru-mobile.png` (untracked QA files in this worktree).
- No sales-package, agency filing/booking, loan-assistance, or unverifiable testimonial claims remain in customer-facing copy. The remaining Hebrew "חבילת המסמכים" in the apostille article describes a bundle of documents, not a service package.
- Restored topic-specific editorial content in 113 article/document paragraphs that had been replaced with repeated generic process language. The four focused 390px checks for HE/RU contact pages and one article in each language had no horizontal overflow; the local-link check was rerun after those edits.
