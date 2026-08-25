from django.core.management.base import BaseCommand

from core.models import Branch, SiteSettings
from destinations.models import Destination
from services.models import Service, TestPrep

DESTINATIONS = [
    dict(
        name="Australia",
        country_code="AUS",
        summary="Big cities, bigger job market — one of the most popular post-study work routes for Nepali students.",
        cost_overview="Tuition typically runs AUD 20,000–45,000 a year depending on the course and city; budget AUD 1,400–2,500 a month for living costs in Sydney or Melbourne, less in regional areas.",
        intake_overview="Two main intakes: February and July, with some universities also offering a smaller November intake.",
        visa_overview="Student visa (subclass 500). You'll need a Confirmation of Enrolment, proof of funds (GTE), OSHC health cover, and to meet the Genuine Student requirement.",
        popular_intakes="February, July",
        is_featured=True,
        order=1,
    ),
    dict(
        name="Canada",
        country_code="CAN",
        summary="Strong permanent-residency pathway and a genuinely multicultural campus experience.",
        cost_overview="Tuition ranges CAD 15,000–35,000 a year; living costs are usually CAD 10,000–15,000 a year outside Toronto and Vancouver.",
        intake_overview="Main intake in September, with smaller January and May intakes at many colleges.",
        visa_overview="Study permit application, usually alongside a Provincial Attestation Letter (PAL), proof of funds via GIC, and a clean medical/biometrics check.",
        popular_intakes="September, January",
        is_featured=True,
        order=2,
    ),
    dict(
        name="USA",
        country_code="USA",
        summary="The widest range of universities and specializations, from community colleges to Ivy League research programs.",
        cost_overview="Tuition varies enormously — CAD-equivalent USD 15,000 at a state college to USD 55,000+ at a private university; living costs depend heavily on the state.",
        intake_overview="Fall (August/September) is the primary intake; Spring (January) is a smaller second option at many schools.",
        visa_overview="F-1 student visa, which starts with your I-20 from the university, the SEVIS fee, and a consular interview — timeline and documentation matter here more than anywhere else.",
        popular_intakes="August, January",
        order=3,
    ),
    dict(
        name="United Kingdom",
        country_code="UK",
        summary="One-year master's degrees mean a faster, often cheaper route to a postgraduate qualification.",
        cost_overview="Tuition is typically GBP 13,000–25,000 a year; living costs run GBP 1,000–1,400 a month, higher in London.",
        intake_overview="September/October is the main intake, with a growing January intake at many universities.",
        visa_overview="Student visa (previously Tier 4), requiring a CAS from your university, proof of funds held for 28 days, and a TB test for most Nepali applicants.",
        popular_intakes="September, January",
        is_featured=True,
        order=4,
    ),
    dict(
        name="New Zealand",
        country_code="NZ",
        summary="Smaller class sizes, a straightforward visa process, and a calmer pace than the bigger study destinations.",
        cost_overview="Tuition is generally NZD 22,000–35,000 a year; budget NZD 1,250–1,600 a month for living costs.",
        intake_overview="Main intakes in February and July, with some polytechnics offering rolling intakes.",
        visa_overview="Student visa via Immigration New Zealand, needing an Offer of Place, proof of funds, and (for longer courses) a medical exam.",
        popular_intakes="February, July",
        order=5,
    ),
    dict(
        name="Denmark",
        country_code="DEN",
        summary="Tuition-free or low-cost public universities for EU-aligned programs, with English-taught degrees increasingly common.",
        cost_overview="Public university tuition for non-EU students is typically EUR 6,000–16,000 a year; living costs run EUR 800–1,200 a month.",
        intake_overview="Single main intake in September (application deadlines usually fall in March).",
        visa_overview="Residence permit for study, applied for through the Danish Immigration Service, with proof of admission and financial means as the core requirements.",
        popular_intakes="September",
        order=6,
    ),
    dict(
        name="South Korea",
        country_code="KOR",
        summary="A fast-growing choice for Nepali students, with strong scholarship support and a rapidly internationalizing job market.",
        cost_overview="Tuition is typically KRW 3–8 million a semester at public universities; living costs run KRW 700,000–1,000,000 a month outside Seoul.",
        intake_overview="Two intakes: March (spring) and September (fall).",
        visa_overview="D-2 student visa, requiring a Certificate of Admission, proof of funds, and — for many programs — a TOPIK or English proficiency score.",
        popular_intakes="March, September",
        order=7,
    ),
]

SERVICES = [
    dict(
        title="Counseling",
        icon="compass",
        short_description="An honest first conversation about where you can actually get in, and where you'd actually be happy.",
        long_description="We start by understanding your academic record, budget, and what you want out of the next few years — not just where you want to go. You'll leave the first session with a shortlist that's realistic, not a wish list.",
        order=1,
    ),
    dict(
        title="University & Course Matching",
        icon="target",
        short_description="Matching your grades, budget and goals against real offers — not just brand-name universities.",
        long_description="We cross-check entry requirements, scholarship eligibility, and course content across our partner network so the shortlist you get is one you can actually act on.",
        order=2,
    ),
    dict(
        title="Application Support",
        icon="file-text",
        short_description="SOPs, LORs, transcripts, and every form — reviewed line by line before anything gets submitted.",
        long_description="We help you build a Statement of Purpose that sounds like you, gather the right supporting documents, and keep every application on a deadline tracker so nothing slips.",
        order=3,
    ),
    dict(
        title="Visa Support",
        icon="stamp",
        short_description="The paperwork stage where most applications actually fail — this is where we slow down and get it right.",
        long_description="From financial documentation to mock interviews, we prepare your visa file against the specific requirements of your destination country's immigration authority.",
        order=4,
    ),
    dict(
        title="Scholarship Guidance",
        icon="award",
        short_description="Real scholarship and financial-aid options matched to your profile, not a generic list.",
        long_description="We track university-specific, government, and third-party scholarships relevant to Nepali students and help you build a competitive application for the ones you actually qualify for.",
        order=5,
    ),
    dict(
        title="Pre-Departure Orientation",
        icon="plane",
        short_description="What to pack, what to expect, and who to call — before you're the one figuring it out alone.",
        long_description="A practical session covering accommodation, banking, healthcare registration, part-time work rules, and the everyday things that don't show up in a university handbook.",
        order=6,
    ),
]

TEST_PREPS = [
    dict(
        name="IELTS",
        description="Academic and General Training preparation focused on the band score your target university actually needs.",
        format_note="Paper-based or computer-delivered — Listening, Reading, Writing, Speaking.",
        schedule_note="Batches run on weekday evenings and weekend mornings.",
        fees_note="Contact us for current batch fees.",
        order=1,
    ),
    dict(
        name="PTE",
        description="Computer-based test prep with a strong focus on the scoring algorithm and time management under exam conditions.",
        format_note="Fully computer-delivered — Speaking & Writing, Reading, Listening.",
        schedule_note="Rolling batches with flexible scheduling.",
        fees_note="Contact us for current batch fees.",
        order=2,
    ),
    dict(
        name="SAT",
        description="Preparation for undergraduate applicants targeting US universities that require or recommend the SAT.",
        format_note="Digital SAT — Reading & Writing, Math.",
        schedule_note="Batches run ahead of major test dates.",
        fees_note="Contact us for current batch fees.",
        order=3,
    ),
]


class Command(BaseCommand):
    help = "Seed the database with destinations, services, test prep, site settings and the head office branch."

    def handle(self, *args, **options):
        for data in DESTINATIONS:
            obj, created = Destination.objects.update_or_create(
                name=data["name"], defaults=data
            )
            self.stdout.write(f"{'Created' if created else 'Updated'} destination: {obj.name}")

        for data in SERVICES:
            obj, created = Service.objects.update_or_create(
                title=data["title"], defaults=data
            )
            self.stdout.write(f"{'Created' if created else 'Updated'} service: {obj.title}")

        for data in TEST_PREPS:
            obj, created = TestPrep.objects.update_or_create(
                name=data["name"], defaults=data
            )
            self.stdout.write(f"{'Created' if created else 'Updated'} test prep: {obj.name}")

        settings_obj = SiteSettings.load()
        settings_obj.phone = settings_obj.phone or "+977 98-0000-0000"
        settings_obj.email = settings_obj.email or "hello@nexture.edu.np"
        settings_obj.address = settings_obj.address or "Bagbazar, Kathmandu, Nepal"
        settings_obj.hero_eyebrow = settings_obj.hero_eyebrow or "NEXTURE EDUCATION"
        settings_obj.hero_headline = (
            settings_obj.hero_headline or "Studying abroad, without the sales pitch."
        )
        settings_obj.hero_subcopy = settings_obj.hero_subcopy or (
            "We help Nepali students get into the right university in Australia, Canada, "
            "the USA, the UK, New Zealand, Denmark and South Korea — and get the visa to go with it."
        )
        settings_obj.stat_students_placed = settings_obj.stat_students_placed or "1,200+"
        settings_obj.stat_partner_universities = settings_obj.stat_partner_universities or "85+"
        settings_obj.stat_visa_success_rate = settings_obj.stat_visa_success_rate or "92%"
        settings_obj.stat_countries = settings_obj.stat_countries or "07"
        settings_obj.save()
        self.stdout.write("Updated site settings")

        Branch.objects.update_or_create(
            name="Head Office",
            defaults=dict(
                address="Bagbazar, Kathmandu, Nepal",
                phone="+977 98-0000-0000",
                email="hello@nexture.edu.np",
                is_head_office=True,
                is_active=True,
                order=0,
            ),
        )
        self.stdout.write("Updated head office branch")

        self.stdout.write(self.style.SUCCESS("Seed complete."))
