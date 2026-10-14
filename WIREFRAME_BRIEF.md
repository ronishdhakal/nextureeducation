# Wireframe Generation Prompt — Nexture Education (Public Site + CRM)

> **How to use this file.** Paste everything below the line into Claude (or any capable
> design model) as a single prompt. It produces a complete low‑fidelity wireframe set
> for the Nexture Education platform — every public page and every CRM screen, with
> states and flows — as the starting point for a human UI/UX designer. The data model,
> page inventory, and component behaviour are all derived from the actual Django backend
> and Next.js frontend, so the wireframes will match what the system can really do.

---

## PROMPT START

You are a senior product designer producing a **complete low‑fidelity wireframe set** for
**Nexture Education**, a study‑abroad consultancy in Bagbazar, Kathmandu, Nepal. The
wireframes will be handed to a human UI/UX designer who will take them to high fidelity,
so they must be **exhaustive in structure and content, deliberately plain in styling**.

### 1. What to deliver

Produce wireframes as a **multi‑artboard canvas** (use the `design` skill / `.dc.html`
artboards on one pan‑zoom canvas). Organise the canvas into labelled zones:

1. **Global / foundations** — sitemap, navigation model, breakpoints, shared components, shared states.
2. **Public website** — every page listed in §4, desktop + mobile, with all documented states.
3. **CRM (staff app)** — every screen listed in §5, with all documented states.
4. **Key flows** — the annotated click‑paths in §6.

For **every screen** provide:

- A **desktop frame (~1280px)** and a **mobile frame (~390px)**.
- **Annotations** (numbered callouts) for: data source, interactions, validation, permissions, edge cases.
- **All states** that apply: loading / empty / error / success / filtered‑no‑results / unauthenticated / disabled.
- Real representative content (names, copy, numbers) — never "lorem ipsum". Use the seed content in §3 where relevant.

### 2. Wireframe style rules

- Greyscale only. Boxes, rules, placeholder glyphs for images (crossed box), single weight type ramp (H1/H2/H3/body/caption/label).
- No brand colour, no final iconography — use labelled circles/squares for icons.
- Show layout grid, spacing rhythm, and responsive reflow, not visual polish.
- Every button, link, input, filter, tab, and menu item must be drawn and labelled with its exact text.
- Tables: show column headers, one representative row set, sort/filter affordances, row‑click behaviour, pagination.
- Forms: show every field, field type, label, helper text, required marker, and inline error placement.
- Keep annotations in a consistent side panel or margin per artboard.

### 3. Product & brand context

- **Who:** Nexture Education — counselling, university/course matching, application support, visa support, scholarship guidance, pre‑departure orientation, and test prep (IELTS / PTE / SAT) for Nepali students.
- **Destinations served (6):** Australia, Canada, United Kingdom, New Zealand, Malta, South Korea.
- **Voice:** honest, plain‑spoken, "studying abroad without the sales pitch". No stock‑photo gloss, no inflated claims. The wireframes should reflect a content‑first, trust‑building layout.
- **Primary public conversion goal:** get the visitor to submit the **inquiry form** ("Book a free session") — a lead.
- **CRM purpose:** staff triage and work those leads (status, temperature, call logs, follow‑ups) and manage all site content.
- **Headline stats shown on site (editable):** students placed `1,200+`, partner universities `85+`, visa success rate `92%`, destination countries `06`.
- **Locale:** English, Nepal. Phone‑first audience (many users mobile, WhatsApp common). Currency references appear inside content, not UI chrome.

### 4. PUBLIC WEBSITE — page & section inventory

**Global chrome (every public page):**

- **Top utility bar:** office address (left), tappable phone number (right).
- **Header (sticky):** logo; primary nav — `Destinations` (`/destination`), `Services` (`/services`), `Test Prep` (`/test-prep`), `Success Stories` (`/success-stories`), `About` (`/about`), `Blog` (`/blog`); primary CTA button `Book a Session` → `/contact`. Mobile: hamburger → full‑screen menu with the same links + full‑width CTA.
- **Footer:** logo + one‑line positioning statement; social links (Facebook, Instagram, LinkedIn, YouTube, TikTok — only those set); "Explore" link column (Destinations, Services, Test Prep, About, Contact); head‑office block (name, address, phone, email); copyright row.
- **Recurring "Final CTA" band** near the bottom of most pages: headline, subcopy, inquiry prompt / link to `/contact`, destination quick‑links.

**4.1 Home `/`** — sections in order:
1. **Hero** — eyebrow (e.g. "Bagbazar, Kathmandu"), headline ("Studying abroad, without the sales pitch."), subcopy, primary CTA, and an **honest "destinations" card/panel** (a compact list of the 6 countries with a one‑line teaser each — deliberately *not* a stock campus photo). Two‑column on ≥768px, stacked below.
2. **Destinations grid** — heading "Six countries. One honest shortlist." + 6 `DestinationCard`s (3‑col desktop / 2‑col tablet / 1‑col mobile).
3. **How It Works** — numbered step sequence of the engagement (counselling → shortlist → applications → visa → pre‑departure).
4. **Manifesto** — a short statement block (values / why we're different).
5. **Why Local** — trust section about being a Kathmandu‑based, walk‑in consultancy.
6. **Services & Test Prep** — combined section: services list (6 items) + test‑prep list (IELTS/PTE/SAT).
7. **Stats band** — the 4 headline stats.
8. **Testimonials** — carousel/grid of student quotes (hidden entirely if none published).
9. **FAQ** — accordion (static Q&A list).
10. **Final CTA band.**

**4.2 Destinations list `/destination`** — page header (eyebrow "Destinations", title, subcopy) + responsive grid of all published `DestinationCard`s + Final CTA. Empty state: "Destinations will appear here once they're added."
- **`DestinationCard`:** flag glyph, country name, country‑code badge, summary teaser, "popular intakes" line, link to detail.

**4.3 Destination detail `/destination/[slug]`** — the most content‑heavy public page:
- **Page header:** eyebrow "`<year>` intake guide", title "Study in `<Country>` from Nepal", subcopy = destination summary, flag glyph.
- **Two‑column body (≥1024px):** left = content; right = **sticky inquiry form** (compact variant, destination pre‑selected) with heading "Thinking about `<Country>`?" and "we'll call within one business day".
- **Left column:** intro paragraph; a "Popular intakes" pill; a **"jump to section" chip nav** (only for sections that have content); then a stack of **Q&A content sections**, each with an icon + heading, rendered only if the field is filled, in this order:
  1. Why study in `<Country>` from Nepal? (`why_study_overview`)
  2. Am I eligible…? (`eligibility_overview`)
  3. How much does it cost…? (`cost_overview`)
  4. What can I study…? (`popular_courses_overview`)
  5. When can I start? Intakes (`intake_overview`)
  6. Student visa process (`visa_overview`)
  7. What documents do I need…? (`documents_overview`)
  8. Are there scholarships…? (`scholarships_overview`)
  - Then **"Good to know about `<Country>`"** (`additional_info`) if present.
  - Then **"Partner universities in `<Country>`"** — grid of `UniversityCard`s (only if any exist).
- **Below body:** testimonials filtered to this destination (if any) → Final CTA.
- **Not‑found state** for an unknown slug.
- **`UniversityCard`:** logo glyph, university name, city, ranking note, programs summary, external website link.

**4.4 Services list `/services`** — page header + list/grid of services (icon glyph, title, short description), each linking to `/services/[slug]` + Final CTA.

**4.5 Service detail `/services/[slug]`** — page header (title, short description) + long description (rich text) + inquiry CTA. Not‑found state.

**4.6 Test Prep `/test-prep`** — page header + cards for each test (name e.g. "IELTS", description, format note, schedule note, fees note) + inquiry CTA.

**4.7 Success Stories `/success-stories`** — page header ("Students who went through this exact process.") + testimonials grid (no section heading) + Final CTA. Empty state: "We're gathering student stories…".
- **Testimonial item:** photo glyph, student name, university, destination, year, quote.

**4.8 Universities `/universities`** — page header ("Our partner network.") + 3‑col grid of `UniversityCard`s + Final CTA. Empty state.

**4.9 About `/about`** — company story, approach, team section (team member = photo glyph, name, role, short bio), branch/office info, trust points. (Design a sensible section stack; content is editorial.)

**4.10 Blog list `/blog`** — page header + list of posts (cover‑image glyph, title, excerpt, author, publish date) → `/blog/[slug]`. Empty state. Consider simple pagination.

**4.11 Blog post `/blog/[slug]`** — cover glyph, title, author + date, rich‑text body, back‑to‑blog link, inquiry CTA. Not‑found state.

**4.12 Contact `/contact`** — page header ("Let's talk about your next step.") + two columns:
- Left: contact methods — "Call or WhatsApp" (phone), "Email", and one block **per branch** (name, address, "Get directions →" if map link set).
- Right: **full inquiry form** in a card ("Book a free session", "No obligation, no sales pressure.").

**4.13 Freeform page `/pages/[slug]`** — title + rich‑text body. Used for Privacy Policy, Terms, etc. Not‑found state.

**4.14 Inquiry form — the core conversion component.** Two variants:
- **Full** (contact page, destination-less contexts): Full name*, Phone* (tel), Email (optional), "Interested in" (destination select, default "Not sure yet"), "Level" select, "Anything else we should know?" textarea, submit "Book a free session".
- **Compact** (destination detail sidebar, tighter contexts): Full name*, Phone*, "Interested in" (pre‑filled), "Level", submit. No email/message.
- **Level options:** Not sure yet, Foundation, Diploma, Bachelor's, Master's, PhD.
- **States:** idle, submitting ("Sending…", disabled), **success** (replaces form: "You're on the list." + "We'll call or email you within one business day."), error (inline message, form retained).
- **Validation:** name required & non‑empty; phone required & ≥7 digits. Include a hidden honeypot field (not visible in wireframe UI, note it in annotations).
- Every form submission creates a **Lead** in the CRM and records the `source_page` (the URL it was submitted from).

### 5. CRM / STAFF APP — screen inventory

Route namespace `/admin/*`. **Auth‑gated** except the login screen. Token/session auth via a proxy; expired session → redirect to login with a `next` param.

**5.1 Login `/admin/login`** — centered card: logo, "CRM sign in" / "Staff access only.", Username* field (autofocus), Password* field, error message slot, "Sign in" button ("Signing in…" while loading). On success → `/admin/dashboard` (or `next`).

**5.2 App shell (every protected screen):**
- **Left sidebar (sticky, 256px; mobile = off‑canvas with hamburger + overlay):** logo; grouped nav:
  - **Overview** → Dashboard (`/admin/dashboard`)
  - **Pipeline** → Leads (`/admin/leads`)
  - **Content** → Destinations, Universities, Services, Test Prep, Testimonials, Blog, Pages
  - **Organization** → Branches, Site Settings
  - Active item highlighted.
- **Sidebar footer:** account chip ("Nexture Education / Staff account") with online dot + **log‑out** control.
- **Main area:** page header component (title, subtitle, optional right‑aligned action button) + content, generous padding.

**5.3 Dashboard `/admin/dashboard`:**
- Row of **4 lead‑status stat cards**: New, Contacted, Qualified, Closed (icon glyph + count + label). Placeholder "—" while loading.
- **"Recent leads"** panel — last 5 leads (name, phone, status tag) + "View all →".
- **"Quick links"** panel — "`N` destinations published", "Add a new destination", "Edit site settings".
- Error state: inline message above the grid.

**5.4 Leads `/admin/leads`** — the primary CRM workspace:
- Header with **"Export CSV"** action (exports the currently filtered rows).
- **3 metric cards:** Total leads, Hot leads, **Follow‑ups due** (this last card is a *toggle* — click to filter list to overdue/today only; shows active state).
- **Filter bar:** free‑text search (name / phone / email); Status select (All + New/Contacted/Qualified/Closed); Temperature select (All + Hot/Warm/Cold); Destination select (All + destinations present in data); "Received from" date; "Received to" date; "Clear filters" link (only when a filter is active). Show "`X` of `Y` leads" count.
- **Two‑pane layout (≥1024px):** left = leads **table**, right = **detail panel** (sticky). Mobile: table only; selecting a lead opens the detail as a full screen / drawer.
- **Table columns:** Name (avatar initials + name + phone), Destination, Temp. (colour dot + label), Status (pill), Next follow‑up (relative datetime; overdue = warning treatment + icon), Received (date). Row click selects the lead (active row marker). Loading, empty ("No leads match this filter."), and error states.
- **Detail panel (when a lead is selected):**
  - Header: avatar, name, created timestamp.
  - Quick actions: **Call** (`tel:`), **Email** (`mailto:`, or disabled "No email").
  - Definition list: Phone, Email, Destination ("Not sure yet" fallback), Level, Source page, Next follow‑up (if set).
  - **Message** block (the visitor's free‑text, if any).
  - **Status** select + **Temperature** select — inline, save on change (optimistic).
  - **Call log panel:**
    - Form: Outcome select (Connected / No answer / Left voicemail / Wrong number / Follow‑up scheduled), "Next follow‑up (optional)" datetime, "What was discussed…" textarea, **"Log call"** button ("Saving…").
    - History list below: each entry = outcome tag, timestamp, notes, "by `<staff username>`", "Follow up `<datetime>`" if set, hover **delete**.
    - Empty state "No calls logged yet.", loading state.
  - Empty‑panel state (no lead selected): "Select a lead from the list to see their details and call history."

**5.5 Content resources — generic list + form pattern.** These resources share one list UI and one form UI: **Universities, Services, Test Prep, Testimonials, Blog, Pages, Branches**. Design the generic pattern once, then show each resource's specific columns/fields.

- **Generic list screen** (`/admin/<resource>`): page header (plural label + one‑line description) + **"New `<singular>`"** action; search box (filters visible columns) + "`N` total" / "`X` of `Y`"; **table** with the resource's list columns + right‑aligned **Edit** (pencil) and **Delete** (trash, with "Delete `<name>`? This can't be undone." confirm) per row. States: loading, empty ("Nothing here yet." + "Add the first `<singular>`"), no‑search‑results.
- **Generic form screen** (`/admin/<resource>/new` and `/admin/<resource>/[id]`): stacked fields by type — text, textarea (with max‑length counter where set), **rich‑text editor** (toolbar: headings, bold/italic, lists, link, image upload, PDF attach — 10 MB limit), date, number, boolean (checkbox), select, **destination‑select** (dropdown of destinations). Submit = "Create `<singular>`" / "Save changes" + "Cancel". Inline error slot. Most content types have a **`Published` toggle** and an **`Order` number** (lower = first); most also have **SEO title** + **SEO description** fields ("leave blank to use the page title").

  Per‑resource fields:
  - **Universities** — Name*, Country* (destination‑select), City, Ranking note ("e.g. Top 50 QS ranked"), Programs summary (textarea), Website, Order, Active partner (bool), Published (bool). List columns: Name, City, Partner, Published.
  - **Services** — Title*, Slug (auto), Icon (select: Compass/Target/File/Stamp/Award/Plane), Short description* (textarea, max 200), Long description (rich text), Order, Published, + SEO. List: Title, Order, Published.
  - **Test Prep** — Name*, Slug (auto), Description (textarea), Format, Schedule, Fees, Order, Published, + SEO. List: Name, Order, Published.
  - **Testimonials** — Student name*, Destination (destination‑select), University, Quote* (textarea), Year (number), Order, Featured (bool), Published (bool). List: Student, Featured, Published. Note: a "photo" upload exists on the model — include an image field in the form.
  - **Blog** — Title*, Slug (auto), Excerpt (textarea, max 280, "shown on the blog list"), Body* (rich text), Author, Publish date (date), Published, + SEO, + cover‑image upload. List: Title, Author, Published.
  - **Pages** — Title*, Slug (auto), Body* (rich text), Published, + SEO. List: Title, Slug, Published.
  - **Branches** — Name*, Address* (textarea), Phone, Email, Map link, Order, Head office (bool), Active (bool). List: Name, Head office, Active.

**5.6 Destinations `/admin/destinations` (custom, richer form).**
- **List:** same table pattern — columns Name, Country code, Featured, Published + Edit/Delete + "New destination".
- **Form** (`/new`, `/[id]`) — three sections:
  1. **Basics:** Name*, Country code ("short badge, e.g. AUS"), Slug (auto), Summary* (textarea, max 280, "teaser on cards"), Popular intakes ("e.g. February, July"), Order, and a Featured / Published checkbox row. Include flag‑image and hero‑image upload fields.
  2. **Content sections** (each a rich‑text editor, each renders as its own section on the public page): Why study here, Eligibility, Cost of living & tuition, Intakes, Popular courses, Visa process, Documents required, Scholarships & financial aid, Additional information.
  3. **SEO:** SEO title, SEO description ("leave blank to fall back to defaults").
  - Submit "Create destination" / "Save changes" + Cancel; inline error.

**5.7 Site Settings `/admin/settings` (singleton form).** Sections:
- **Contact & social** (2‑col): Phone, Email, WhatsApp number, Address, Facebook URL, Instagram URL, LinkedIn URL, YouTube URL, TikTok URL. Plus a **logo** upload.
- **Homepage hero:** Eyebrow, Headline, Subcopy (textarea).
- **Stats band:** Students placed, Partner universities, Visa success rate, Destination countries.
- "Save settings" button ("Saving…"), "Saved." confirmation, error slot. Loading state for initial fetch.

### 6. Key flows to storyboard (annotated frame sequences)

1. **Visitor → lead (destination path):** Home → Destinations grid → Destination detail → reads Q&A sections → fills **compact** inquiry form in sticky sidebar → success state. Note the pre‑selected destination and `source_page` capture.
2. **Visitor → lead (contact path):** Any page → header "Book a Session" → Contact page → **full** inquiry form → success. Show validation errors on an intermediate frame (empty name, short phone).
3. **Staff triage:** Login → Dashboard (sees "3 New") → Leads → filter Status = New → select a lead → **Call** → **Log call** (outcome "No answer", set follow‑up tomorrow 10:00) → set Temperature = Hot → Status = Contacted. Next day: Leads → "Follow‑ups due" card toggled → work the list.
4. **Content publish:** Login → Destinations → New destination → fill Basics + a few content sections → Create → returns to list → toggle a testimonial to Published → appears on public Success Stories.
5. **Session expiry:** Staff on Leads, session expires → action fails → redirect to `/admin/login?next=/admin/leads` → re‑login → back to Leads.

### 7. Data model reference (fields the UI exposes)

**Lead:** name, phone, email, preferred_destination (FK), preferred_level (foundation|diploma|bachelor|master|phd|undecided), message, source_page, status (new|contacted|qualified|closed), temperature (hot|warm|cold), created_at, updated_at, next_follow_up (derived from latest call log), destination_name (derived).
**CallLog:** lead (FK), outcome (connected|no_answer|voicemail|wrong_number|follow_up_scheduled), notes, follow_up_at, created_by (staff), created_at.
**Destination:** name, slug, country_code, flag_image, hero_image, summary, popular_intakes, is_featured, is_published, order, + rich‑text: cost_overview, intake_overview, visa_overview, eligibility_overview, why_study_overview, popular_courses_overview, documents_overview, scholarships_overview, additional_info, + meta_title, meta_description.
**University:** name, country (FK→Destination), logo, city, ranking_note, programs_summary, external_link, is_partner, is_published, order.
**Program:** level (foundation|diploma|bachelor|master|phd), field_of_study, destinations (M2M), is_published. *(Not currently surfaced in UI — note as a possible future filter/section on destination pages.)*
**Service:** title, slug, icon, short_description, long_description, is_published, order, + SEO.
**TestPrep:** name, slug, description, format_note, schedule_note, fees_note, is_published, order, + SEO.
**Testimonial:** student_name, photo, destination (FK), university, quote, year, is_featured, is_published, order.
**BlogPost:** title, slug, cover_image, excerpt, body, author, published_at, is_published, + SEO.
**Page:** title, slug, body, is_published, + SEO.
**Branch:** name, address, phone, email, map_link, is_head_office, is_active, order.
**TeamMember:** name, role, photo, bio, is_active, order. *(Surface on the About page.)*
**SiteSettings (singleton):** logo, phone, email, address, whatsapp_number, facebook/instagram/linkedin/youtube/tiktok URLs, hero_eyebrow, hero_headline, hero_subcopy, stat_students_placed, stat_partner_universities, stat_visa_success_rate, stat_countries.

### 8. Cross‑cutting requirements for the wireframes

- **Responsive:** show desktop + mobile for every screen; call out the reflow point for two‑column layouts (public detail pages and the CRM leads pane both collapse ~1024px; CRM sidebar goes off‑canvas ~768px; hero splits at 768px).
- **States catalogue:** for every list/table — loading, empty, error, filtered‑empty. For every form — pristine, invalid (inline errors), submitting, saved/success, save‑error.
- **Empty‑content behaviour:** public sections that depend on data (testimonials, universities, partner list, blog) must show either a graceful empty message or be omitted — draw both the populated and empty version.
- **Permissions:** mark which screens require auth; show the unauthenticated redirect.
- **Accessibility notes:** focus order, form labels, tap target sizing, the honeypot field, "skip to content" — note in annotations even if not drawn.
- **Content‑driven ordering:** wherever `order` exists, note that staff control sequence.
- **Don't invent features** beyond this brief. Where the model implies something not yet in the UI (Programs, TeamMember, hero_image, logo, photos), place it as a clearly‑labelled "proposed" element for the designer to decide on.

### 9. Output order

1. Sitemap + navigation diagram (public + CRM).
2. Shared components sheet (header, footer, utility bar, DestinationCard, UniversityCard, Testimonial item, inquiry form ×2 variants, CRM app shell, page‑header, generic table, generic form field types, stat card, status/temperature pills).
3. Public pages 4.1 → 4.14 (desktop then mobile each).
4. CRM screens 5.1 → 5.7.
5. Flows 6.1 → 6.5.
6. A one‑page index listing every artboard with its state coverage.

## PROMPT END
