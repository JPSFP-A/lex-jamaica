// Shared checklist section definitions
// Used by onboarding.html and onboarding-admin.html
// SECTION_TEMPLATES maps template key → sections array

const SECTION_TEMPLATES = {

// ─────────────────────────────────────────────
// LAW FIRM template (Grant Law Chambers)
// ─────────────────────────────────────────────
law_firm: [
  {
    id: 'business', title: '1. Business & Legal Structure', icon: 'building-2', color: 'blue', open: true,
    items: [
      { id:'trn-firm', title:'Tax Registration Number (TRN)', description:'The firm\'s TRN as issued by Tax Administration Jamaica (TAJ).', type:'text', placeholder:'e.g. 123-456-789', canUpload:false },
      { id:'gct-cert', title:'GCT Registration Certificate', description:'Upload your GCT registration certificate from TAJ (if registered).', type:'upload', canUpload:true },
      { id:'gct-status', title:'GCT Registration Status', description:'Are you currently registered for GCT? If so, which scheme?', type:'select', options:['Not yet registered','Standard rate — 15%','Flat rate scheme'], canUpload:false },
      { id:'biz-name', title:'Business / Trading Name', description:'The full name used on invoices and client correspondence.', type:'text', placeholder:'e.g. Grant Law Chambers', canUpload:false },
      { id:'year-end', title:'Financial Year End Date', description:'The last day of your accounting year (e.g. December 31, March 31).', type:'text', placeholder:'December 31', canUpload:false },
      { id:'glc-cert', title:'GLC Practising Certificate', description:'Upload your current General Legal Council practising certificate.', type:'upload', canUpload:true },
      { id:'prof-indemnity', title:'Professional Indemnity Insurance', description:'Policy number, insurer name, annual renewal date, and cover amount.', type:'textarea', placeholder:'Insurer: Guardian Life\nPolicy #: PI-123456\nRenewal: June 30\nCover: J$10,000,000', canUpload:true },
    ]
  },
  {
    id: 'bank', title: '2. Bank Accounts', icon: 'landmark', color: 'green', open: false,
    items: [
      { id:'bank-operating', title:'Operating Account Details', description:'Bank name, branch, and account number for your main business account.', type:'textarea', placeholder:'Bank: NCB Jamaica\nBranch: New Kingston\nAccount #: 123-456-789', canUpload:false },
      { id:'bank-trust', title:'Client Trust Account Details', description:'This MUST be a separate account solely for client funds. Never mix with operating funds.', type:'textarea', placeholder:'Bank: Scotiabank Jamaica\nBranch: Half Way Tree\nAccount #: 987-654-321', canUpload:false },
      { id:'bank-other', title:'Other Accounts', description:'Any additional savings, investment, or loan accounts.', type:'textarea', placeholder:'e.g. NCB savings account #…', canUpload:false },
      { id:'bank-statements', title:'Bank Statements — 12 Months (All Accounts)', description:'PDF statements for all accounts. Required for opening balance verification.', type:'upload', canUpload:true },
      { id:'bank-feed', title:'Online Banking — Feed Connection', description:'Can you connect your bank to QBO for automatic transaction imports?', type:'text', placeholder:'Yes — NCB Online Banking', canUpload:false },
      { id:'loan-details', title:'Loans / Lines of Credit', description:'Outstanding balance, interest rate, monthly payment, and lender name for any business loans.', type:'textarea', placeholder:'None currently', canUpload:true },
    ]
  },
  {
    id: 'contractors', title: '3. Contractors & Service Providers', icon: 'users', color: 'purple', open: false,
    items: [
      { id:'contractor-note', title:'Note — Contractor vs. Employee', description:'Contractor payments are treated as business expenses (Professional Fees), not payroll.', type:'info', infoHtml:'<strong>Current Status:</strong> All workers are independent contractors.<br><br><strong>Tax treatment:</strong> Contractor payments = business expense (no PAYE/NIS/NHT withholding required).<br><strong>Note:</strong> Contractors are responsible for their own tax filings.', canUpload:false },
      { id:'contractor-list', title:'Current Contractors List', description:'Name, type of service, monthly/hourly rate, and TRN if available.', type:'textarea', placeholder:'1. Jane Brown — Paralegal services — J$50,000/month\n2. ABC Couriers — Process serving — as needed', canUpload:false },
      { id:'contractor-agreements', title:'Contractor Agreements', description:'Upload any signed service agreements for your regular contractors.', type:'upload', canUpload:true },
      { id:'contractor-ytd', title:'Payments Made to Contractors (Current Year)', description:'Total paid to each contractor from start of your financial year to today.', type:'textarea', placeholder:'Jane Brown: J$150,000\nABC Couriers: J$45,000', canUpload:true },
    ]
  },
  {
    id: 'clients', title: '4. Clients & Work in Progress', icon: 'briefcase', color: 'indigo', open: false,
    items: [
      { id:'client-list', title:'Active Client List', description:'All current active clients: name, matter number, practice area, and agreed billing rate or fixed fee.', type:'upload', canUpload:true },
      { id:'client-ar', title:'Accounts Receivable — Unpaid Invoices', description:'All invoices issued but not yet paid. Include invoice number, date, client, amount, and age.', type:'upload', canUpload:true },
      { id:'client-ar-total', title:'Total Outstanding AR (J$)', description:'Grand total of all unpaid invoices as of today.', type:'number', placeholder:'0.00', canUpload:false },
      { id:'client-wip', title:'Work in Progress (Unbilled Time)', description:'Estimate of billable time logged but not yet invoiced, by matter.', type:'textarea', placeholder:'Smith conveyancing: 12 hrs @ J$20,000/hr = J$240,000\nJones litigation: 8 hrs @ J$25,000/hr = J$200,000', canUpload:true },
      { id:'client-invoices-ytd', title:'All Invoices Issued — Current Financial Year', description:'Complete invoice history for the current year. Needed for GCT return verification.', type:'upload', canUpload:true },
      { id:'client-writeoffs', title:'Bad Debts / Write-offs', description:'Any client balances written off or unlikely to be collected.', type:'textarea', placeholder:'None currently', canUpload:false },
    ]
  },
  {
    id: 'trust', title: '5. Client Trust Account Records', icon: 'shield-check', color: 'emerald', open: false,
    items: [
      { id:'trust-warning', title:'Trust Account — Compliance Note', description:'The trust bank balance must equal the sum of all client trust balances at all times.', type:'info', infoHtml:'<strong>Legal requirement:</strong> Client trust funds must be kept strictly separate from firm funds.<br><br>The trust bank balance must equal the sum of all individual client trust ledger balances at all times.<br><br>Misuse of trust funds is a disciplinary matter with the General Legal Council.', canUpload:false },
      { id:'trust-ledger', title:'Full Trust Ledger — Transaction History', description:'Complete record of all trust account transactions. Can be Excel, PDF, or system export.', type:'upload', canUpload:true },
      { id:'trust-client-balances', title:'Current Trust Balance Per Client', description:'Amount held in trust for each active client matter as of today.', type:'textarea', placeholder:'Client A: J$500,000\nClient B: J$250,000\nTOTAL: J$750,000', canUpload:true },
      { id:'trust-bank-balance', title:'Trust Bank Account Balance Today (J$)', description:'Current actual balance per online banking. Must match the total of client balances above.', type:'number', placeholder:'0.00', canUpload:false },
      { id:'trust-disbursements', title:'Disbursements Paid on Behalf of Clients', description:'Any costs paid out of trust on behalf of clients not yet billed back (e.g. filing fees, title search fees).', type:'textarea', placeholder:'Client A: J$15,000 NLA title search — 12 Jan 2025', canUpload:true },
    ]
  },
  {
    id: 'expenses', title: '6. Accounts Payable & Expenses', icon: 'receipt', color: 'orange', open: false,
    items: [
      { id:'suppliers', title:'Regular Supplier / Vendor List', description:'Upload your vendor list — spreadsheet, Word doc, or PDF. Include name, type of service, and contact details.', type:'upload', canUpload:true },
      { id:'bills-outstanding', title:'Outstanding Bills Not Yet Paid', description:'Any supplier invoices received but not yet paid. Include supplier, date, amount, and due date.', type:'upload', canUpload:true },
      { id:'bills-total', title:'Total Outstanding AP (J$)', description:'Grand total of all unpaid bills as of today.', type:'number', placeholder:'0.00', canUpload:true },
      { id:'rent-lease', title:'Office Lease Agreement', description:'Upload your current office lease. Key details: monthly rent, lease start/end date, deposit held.', type:'upload', canUpload:true },
      { id:'recurring-costs', title:'Recurring Monthly Costs', description:'List all regular monthly expenses with amounts. Type here or upload a spreadsheet.', type:'textarea', placeholder:'Office rent: J$120,000\nInternet/phone: J$15,000\nBar fees (pro-rated): J$3,000', canUpload:true },
      { id:'receipts-ytd', title:'Expense Receipts — Current Financial Year', description:'All receipts and invoices for expenses paid. Needed for GCT input credit claims.', type:'upload', canUpload:true },
    ]
  },
  {
    id: 'fixed-assets', title: '7. Fixed Assets', icon: 'monitor-smartphone', color: 'cyan', open: false,
    items: [
      { id:'fa-note', title:'About Fixed Assets', description:'Fixed assets are items with a useful life over 1 year that must be depreciated.', type:'info', infoHtml:'<strong>Depreciation rates (Jamaica straight-line):</strong><br>Computers & IT: 33.3%/yr &nbsp; Office furniture: 10–20%/yr<br>Motor vehicles: 20–25%/yr &nbsp; Leasehold improvements: over remaining lease term', canUpload:false },
      { id:'fa-computers', title:'Computers & IT Equipment', description:'List each item: description, date purchased, purchase price, accumulated depreciation to date.', type:'textarea', placeholder:'Laptop — Jan 2023 — J$280,000\nPrinter — Mar 2022 — J$95,000', canUpload:true },
      { id:'fa-furniture', title:'Office Furniture & Equipment', description:'Desks, chairs, filing cabinets, reception furniture, etc.', type:'textarea', placeholder:'Desk set — 2021 — J$180,000\nChairs x3 — 2021 — J$60,000', canUpload:true },
      { id:'fa-vehicles', title:'Motor Vehicles', description:'Any vehicles owned by the firm. Include purchase price, year, make/model.', type:'textarea', placeholder:'None / 2019 Toyota Corolla — J$2,500,000', canUpload:true },
      { id:'fa-leaseholds', title:'Leasehold Improvements', description:'Any improvements made to your rented space (partitions, AC units, fit-out).', type:'textarea', placeholder:'Office fit-out 2022 — J$450,000\nAC installation — J$180,000', canUpload:true },
      { id:'fa-register', title:'Fixed Asset Register', description:'If you maintain a fixed asset schedule in Excel or other format, upload it here.', type:'upload', canUpload:true },
    ]
  },
  {
    id: 'opening-balances', title: '8. Opening Balances & Prior Period', icon: 'file-spreadsheet', color: 'rose', open: false,
    items: [
      { id:'ob-financials', title:'Most Recent Financial Statements', description:'Your last set of signed accounts: Profit & Loss and Balance Sheet.', type:'upload', canUpload:true },
      { id:'ob-trial-balance', title:'Trial Balance as of Go-Live Date', description:'If available from your current system or accountant, the trial balance as of the go-live date.', type:'upload', canUpload:true },
      { id:'ob-go-live', title:'Proposed QBO Go-Live Date', description:'When do you want to start using QBO as your live system?', type:'date', canUpload:false },
      { id:'ob-gct-history', title:'GCT Filing History', description:'Are all GCT returns filed and paid up to date? Upload last 3 GCT return submissions.', type:'upload', canUpload:true },
      { id:'ob-gct-status', title:'GCT Compliance Status', description:'Any outstanding GCT liabilities or TAJ correspondence?', type:'select', options:['All filed and paid — fully compliant','Returns filed but some balance outstanding','Some returns not yet filed','Unsure — need to check'], canUpload:true },
      { id:'ob-tax-assess', title:'Tax Assessments / TAJ Correspondence', description:'Any notices, assessments, or payment plans from TAJ.', type:'upload', canUpload:true },
      { id:'ob-prev-accountant', title:'Previous Accountant / Bookkeeper Details', description:'Contact details for your current or previous accountant.', type:'textarea', placeholder:'Name: John Smith CPA\nFirm: JBS Accounting\nEmail: john@jbs.com\nPhone: 876-555-0100', canUpload:false },
    ]
  },
  {
    id: 'qbo-options', title: '9. QBO Setup — Legal Practice Configuration', icon: 'settings-2', color: 'slate', open: false,
    items: [
      { id:'qbo-note', title:'Full Chart of Accounts — Law Firm', description:'Complete COA including all balance sheet and P&L accounts. Accounts unlock progressively as checklist sections are completed.', type:'info', infoHtml:'<strong>ASSETS (1000s)</strong><br>1010 Cash — Operating Account (NCB)<br>1020 Cash — Client Disbursements Holding<br>1030 Client Trust Account (Scotiabank)<br>1040 Petty Cash<br>1100 Accounts Receivable — Clients<br>1110 GCT Input Tax Recoverable<br>1200 Work in Progress — Unbilled Time<br>1210 Work in Progress — Disbursements<br>1300 Prepaid Expenses<br>1400 Security Deposits Paid<br>1500 Computers &amp; IT Equipment<br>1510 Less: Accumulated Depreciation — IT<br>1520 Office Furniture &amp; Equipment<br>1530 Less: Accumulated Depreciation — Furniture<br>1540 Motor Vehicles<br>1550 Less: Accumulated Depreciation — Vehicles<br>1560 Leasehold Improvements<br>1570 Less: Accumulated Depreciation — Leasehold<br><br><strong>LIABILITIES (2000s)</strong><br>2010 Accounts Payable — Trade<br>2020 GCT Payable (Output Tax)<br>2030 GCT Net Payable / (Recoverable)<br>2040 Income Tax Payable (Estimated)<br>2050 NIS Contributions Payable<br>2060 NHT Contributions Payable<br>2070 Education Tax Payable<br>2080 Client Retainer Deposits Held<br>2090 Client Funds Held in Trust (= 1030)<br>2100 Accrued Liabilities<br>2200 Loans Payable — Current Portion<br>2300 Loans Payable — Long Term<br><br><strong>EQUITY (3000s)</strong><br>3010 Owner\'s Capital / Share Capital<br>3020 Retained Earnings — Prior Years<br>3030 Owner\'s Draw / Distributions<br>3040 Current Year Net Income (auto-calculated)<br><br><strong>INCOME (4000s)</strong><br>4010 Professional Fees — Conveyancing<br>4020 Professional Fees — Litigation<br>4030 Professional Fees — Corporate<br>4040 Professional Fees — Family<br>4050 Professional Fees — Other<br>4100 Client Disbursement Recoveries<br><br><strong>COST OF REVENUE (5000s)</strong><br>5010 Contractor / Paralegal Fees<br>5020 Court &amp; Filing Fees (Reimbursable)<br>5030 Title Search &amp; NLA Fees<br><br><strong>OPERATING EXPENSES (6000s)</strong><br>6010 Office Rent<br>6020 Utilities &amp; Internet<br>6030 Professional Indemnity Insurance<br>6040 Bar Association / GLC Fees<br>6050 Professional Development &amp; CPD<br>6060 Office Supplies &amp; Stationery<br>6070 IT &amp; Software Subscriptions<br>6080 Marketing &amp; Business Development<br>6090 Vehicle &amp; Transportation<br>6100 Professional Fees (Accountant, etc.)<br>6110 Bank Charges &amp; Interest<br>6120 Depreciation Expense', canUpload:false },
      {
        id:'qbo-tracking-method', title:'Choose Your Tracking Method', description:'Select the approach that best fits how you want to report.',
        type:'qbo-options', canUpload:false,
        options: [
          { id:'subcustomer', label:'Option A — Sub-customer Hierarchy (Recommended)', description:'Client = Customer in QBO. Each matter = Sub-customer. All invoices and disbursements linked to the matter. Run profitability by client or matter.', tags:['Best for billing','Works on all QBO plans','Invoice tracking per matter'] },
          { id:'class', label:'Option B — Class Tracking (Practice Area P&L)', description:'Every transaction tagged with a Class (Conveyancing, Litigation, Corporate). Run a P&L by Practice Area to see which service lines are most profitable.', tags:['Practice area P&L','Requires Essentials+','Management reporting'] },
          { id:'both', label:'Option C — Both Sub-customers + Classes (Full BI)', description:'Sub-customers track client/matter billing. Classes track practice area. Every transaction gets both — slice reports by client, matter, and practice area simultaneously.', tags:['Recommended','Full reporting','Attorney performance tracking'] }
        ]
      },
      { id:'qbo-plan', title:'Current QBO Plan', description:'Which QuickBooks Online plan are you on or planning to subscribe to?', type:'select', options:['Simple Start','Essentials','Plus','Advanced (includes Projects)','Not yet subscribed — help me choose'], canUpload:false },
      { id:'qbo-practice-areas', title:'Your Practice Areas', description:'List all practice areas you handle. These will become Classes in QBO.', type:'textarea', placeholder:'Conveyancing\nLitigation\nCorporate\nFamily\nCriminal\nImmigration', canUpload:false },
      { id:'qbo-attorney-tracking', title:'Track by Responsible Attorney?', description:'Do you want reports that show billing and revenue by attorney/fee earner?', type:'select', options:['Yes — set up attorney tracking now','No — not needed at this stage'], canUpload:false },
    ]
  }
],

// ─────────────────────────────────────────────
// CONSTRUCTION & SHORT-TERM RENTAL template (KMP)
// Architecture: Projects (job costing) + Classes/Locations (rental units)
// ─────────────────────────────────────────────
construction_rental: [
  {
    id: 'business', title: '1. Business & Legal Structure', icon: 'building-2', color: 'blue', open: true,
    items: [
      { id:'trn-firm', title:'Tax Registration Number (TRN)', description:'The company\'s TRN as issued by Tax Administration Jamaica (TAJ).', type:'text', placeholder:'e.g. 123-456-789', canUpload:false },
      { id:'biz-reg', title:'Certificate of Incorporation / Business Registration', description:'Upload your Certificate of Incorporation or business registration documents.', type:'upload', canUpload:true },
      { id:'gct-cert', title:'GCT Registration Certificate', description:'Upload your GCT registration certificate from TAJ.', type:'upload', canUpload:true },
      { id:'gct-status', title:'GCT Registration Status', description:'Are you currently registered for GCT?', type:'select', options:['Not yet registered','Standard rate — 15%','Flat rate scheme'], canUpload:false },
      { id:'biz-name', title:'Business / Trading Name', description:'The full legal and trading name used on contracts and invoices.', type:'text', placeholder:'e.g. KMP Construction & Rentals Ltd.', canUpload:false },
      { id:'year-end', title:'Financial Year End Date', description:'The last day of your accounting year.', type:'text', placeholder:'December 31', canUpload:false },
      { id:'contractor-license', title:'Contractor License / Permits', description:'Any contractor registration, CISOCA license, or trade permits. Upload relevant documents.', type:'upload', canUpload:true },
      { id:'biz-insurance', title:'Business Insurance Policies', description:'Construction liability insurance, property insurance, and vehicle insurance. Upload all active policies.', type:'upload', canUpload:true },
    ]
  },
  {
    id: 'bank', title: '2. Bank Accounts', icon: 'landmark', color: 'green', open: false,
    items: [
      { id:'bank-operating', title:'Operating Account Details', description:'Bank name, branch, and account number for your main business account.', type:'textarea', placeholder:'Bank: NCB Jamaica\nBranch: New Kingston\nAccount #: 123-456-789', canUpload:false },
      { id:'bank-project', title:'Project / Construction Account (if separate)', description:'If you maintain a dedicated account for construction project funds, provide details here.', type:'textarea', placeholder:'Bank: Scotiabank\nAccount #: 987-654-321\nPurpose: Construction drawdowns', canUpload:false },
      { id:'bank-rental', title:'Rental Revenue Account (if separate)', description:'Account where Airbnb/rental payouts are deposited, if different from operating account.', type:'textarea', placeholder:'Bank: NCB\nAccount #: 555-111-222\nLinked to: Airbnb payouts', canUpload:false },
      { id:'bank-statements', title:'Bank Statements — 12 Months (All Accounts)', description:'PDF statements for all accounts. Needed for opening balance verification and 6-month historical migration.', type:'upload', canUpload:true },
      { id:'bank-feed', title:'Online Banking — Feed Connection', description:'Can your bank connect to QBO for automatic transaction imports?', type:'text', placeholder:'Yes — NCB Online Banking', canUpload:false },
      { id:'loan-details', title:'Mortgages & Business Loans', description:'For each property mortgage or business loan: lender, outstanding balance, monthly payment, interest rate.', type:'textarea', placeholder:'NCB Mortgage — Unit 1: J$8,500,000 outstanding @ 8.5%\nNCB Business Loan: J$2,000,000 @ 12%', canUpload:true },
    ]
  },
  {
    id: 'construction', title: '3. Construction Projects', icon: 'hard-hat', color: 'orange', open: false,
    items: [
      { id:'proj-list', title:'Active & Recent Projects List', description:'For each project: name/location, client name, contract value (J$), start date, estimated completion, and % complete.', type:'textarea', placeholder:'Project 1: Smith Residence — J$4,500,000 — Jan 2025 — 65% complete\nProject 2: Commercial fit-out, Half Way Tree — J$12,000,000 — Mar 2025 — 20% complete', canUpload:true },
      { id:'proj-contracts', title:'Signed Project Contracts', description:'Upload all signed construction contracts for active and recently completed projects.', type:'upload', canUpload:true },
      { id:'proj-wip', title:'Work-in-Progress (Unbilled Progress Claims)', description:'Billable work completed but not yet invoiced. List per project: estimated value of work done minus amounts already billed.', type:'textarea', placeholder:'Smith Residence: 65% complete × J$4,500,000 = J$2,925,000 — billed J$2,000,000 — WIP J$925,000\nHWT Fit-out: 20% complete × J$12,000,000 = J$2,400,000 — billed J$1,000,000 — WIP J$1,400,000', canUpload:true },
      { id:'proj-ar', title:'Accounts Receivable — Construction (Unpaid Progress Claims)', description:'All progress claim invoices issued but not yet paid. Include project, invoice date, amount, and age.', type:'upload', canUpload:true },
      { id:'proj-ar-total', title:'Total Outstanding Construction AR (J$)', description:'Grand total of all unpaid construction invoices as of today.', type:'number', placeholder:'0.00', canUpload:false },
      { id:'proj-costs-ytd', title:'Materials & Subcontractor Costs — Current Year', description:'Total materials purchased and subcontractor costs paid per project YTD. Upload receipts, invoices, or summary.', type:'upload', canUpload:true },
      { id:'subcontractor-list', title:'Subcontractor List & Agreements', description:'All subcontractors used: name, trade, TRN, rate/contract amount. Upload signed agreements if available.', type:'textarea', placeholder:'ABC Electrical — Wiring — TRN: 123-456-789 — J$350,000/project\nXYZ Plumbing — TRN: 987-654-321 — J$220,000/project', canUpload:true },
    ]
  },
  {
    id: 'rentals', title: '4. Rental Properties (Airbnb / Short-Term)', icon: 'home', color: 'emerald', open: false,
    items: [
      { id:'rental-units', title:'Property / Unit Inventory', description:'For each unit: address, number of bedrooms/bathrooms, Airbnb listing URL, average nightly rate (J$), and current occupancy rate.', type:'textarea', placeholder:'Unit 1: 12 Blue Lagoon Dr, 2BR/2BA — Airbnb.com/h/... — J$15,000/night — 75% occupied\nUnit 2: 5 Palm View Rd, 3BR — Airbnb.com/h/... — J$22,000/night — 60% occupied', canUpload:true },
      { id:'airbnb-account', title:'Airbnb Host Account Details & Payout History', description:'Airbnb host email, account ID, and 12 months of payout history. Download from Airbnb → Transaction History.', type:'upload', canUpload:true },
      { id:'rental-revenue', title:'Monthly Revenue per Unit (Last 12 Months)', description:'Breakdown of gross booking revenue, cleaning fees collected, and Airbnb fees deducted per unit per month.', type:'upload', canUpload:true },
      { id:'rental-cleaning', title:'Cleaning & Housekeeping Costs', description:'Total cleaning costs per unit per month. Include cleaner name, rate per turn, and frequency.', type:'textarea', placeholder:'Unit 1: J$3,500/turnover × 18 turns/month = J$63,000/month\nUnit 2: J$4,000/turnover × 12 turns/month = J$48,000/month', canUpload:true },
      { id:'rental-maintenance', title:'Maintenance & Repair Costs (Current Year)', description:'All maintenance and repair costs per property YTD. Upload receipts or maintenance log.', type:'upload', canUpload:true },
      { id:'rental-utilities', title:'Utility Costs per Property', description:'Monthly electricity, water, and internet costs per rental unit.', type:'textarea', placeholder:'Unit 1: JPS J$18,000 | NWC J$4,500 | Internet J$3,500\nUnit 2: JPS J$22,000 | NWC J$5,000 | Internet J$3,500', canUpload:true },
      { id:'rental-insurance', title:'Property Insurance Policies', description:'Upload current insurance policy for each rental property. Note: annual premium and renewal date.', type:'upload', canUpload:true },
    ]
  },
  {
    id: 'expenses', title: '5. Accounts Payable & Expenses', icon: 'receipt', color: 'purple', open: false,
    items: [
      { id:'suppliers', title:'Supplier / Vendor List', description:'All regular suppliers: hardware stores, lumber yards, equipment rental, cleaning supply companies. Include name, contact, and type of goods/services.', type:'upload', canUpload:true },
      { id:'bills-outstanding', title:'Outstanding Bills Not Yet Paid', description:'All supplier invoices received but not yet paid. Include supplier, date, amount, and due date.', type:'upload', canUpload:true },
      { id:'bills-total', title:'Total Outstanding AP (J$)', description:'Grand total of all unpaid bills as of today.', type:'number', placeholder:'0.00', canUpload:false },
      { id:'office-lease', title:'Office / Yard Lease Agreement', description:'If you lease an office or storage yard, upload the lease agreement. Key details: monthly cost, term, deposit.', type:'upload', canUpload:true },
      { id:'recurring-costs', title:'Recurring Monthly Operating Costs', description:'Fixed monthly expenses not tied to a specific project or unit.', type:'textarea', placeholder:'Office/yard lease: J$85,000\nVehicle insurance: J$18,000\nInternet/phone: J$8,000\nSoftware (QBO, etc.): J$5,000\nAirbnb management app: J$3,500', canUpload:true },
      { id:'receipts-ytd', title:'Expense Receipts — Current Financial Year', description:'All receipts and invoices for operating expenses paid. Needed for GCT input credit claims.', type:'upload', canUpload:true },
    ]
  },
  {
    id: 'payroll', title: '6. Payroll & Labour', icon: 'users', color: 'indigo', open: false,
    items: [
      { id:'payroll-note', title:'Employee vs. Contractor Classification', description:'Jamaica requires PAYE/NIS/NHT/Education Tax deductions for employees. Subcontractors are treated as business expenses. Correct classification matters for compliance.', type:'info', infoHtml:'<strong>Employees (PAYE applies):</strong> Regular fixed hours, tools/equipment provided, work exclusively for you, no risk of loss.<br><br><strong>Subcontractors (no PAYE):</strong> Set their own hours, work for multiple clients, provide their own tools, bear financial risk.<br><br><strong>Misclassification risk:</strong> TAJ can reassess and charge back PAYE + penalties. When in doubt, classify as employee.', canUpload:false },
      { id:'employee-list', title:'Current Employee List', description:'All employees: name, role, start date, gross monthly salary, and NIS/NHT/PAYE deductions currently applied.', type:'textarea', placeholder:'John Brown — Site Foreman — Jan 2022 — J$120,000/month gross\nMary Smith — Admin — Mar 2023 — J$65,000/month gross', canUpload:true },
      { id:'contractor-list', title:'Subcontractor / Casual Labour List', description:'All subcontractors and casual workers: name, trade, TRN if available, and how they are paid (day rate, project rate, etc.).', type:'textarea', placeholder:'ABC Electrical — Day rate J$8,000\nXYZ Plumbing — Project rate J$220,000\nCleaner (Unit 1) — J$3,500/turnover', canUpload:false },
      { id:'payroll-ytd', title:'YTD Payroll & Labour Costs', description:'Total gross payroll paid to employees plus total subcontractor/casual labour paid from start of financial year.', type:'textarea', placeholder:'Employee gross payroll YTD: J$2,250,000\nSubcontractor payments YTD: J$4,800,000\nCasual labour YTD: J$960,000', canUpload:true },
      { id:'payroll-compliance', title:'PAYE / NIS / NHT Compliance', description:'Are all statutory deductions filed and remitted to TAJ and NHT on time? Upload last 3 months of remittances.', type:'upload', canUpload:true },
    ]
  },
  {
    id: 'fixed-assets', title: '7. Fixed Assets & Investment Properties', icon: 'building', color: 'cyan', open: false,
    items: [
      { id:'fa-note', title:'About Fixed Assets & Depreciation', description:'Construction equipment, vehicles, and investment properties must be properly capitalised and depreciated.', type:'info', infoHtml:'<strong>Depreciation rates (Jamaica straight-line):</strong><br>Construction equipment & tools: 20–33.3%/yr<br>Motor vehicles: 20–25%/yr<br>Computers & IT: 33.3%/yr<br>Investment properties (buildings): 2.5–4%/yr (structure only — land not depreciated)<br><br><strong>Note:</strong> Renovation costs that extend the useful life of a property are capitalised (CapEx), not expensed (OpEx).', canUpload:false },
      { id:'fa-equipment', title:'Construction Equipment & Tools', description:'List all equipment: description, date purchased, purchase price, current condition. Include large tools (generators, compressors, mixers, scaffolding).', type:'textarea', placeholder:'Bobcat Skid Steer — 2021 — J$2,800,000\nConcrete mixer — 2022 — J$380,000\nGenerator (20KVA) — 2020 — J$650,000\nScaffolding set — 2021 — J$420,000', canUpload:true },
      { id:'fa-vehicles', title:'Motor Vehicles', description:'All vehicles: year, make/model, purchase price, current market value estimate, and whether used for business/personal.', type:'textarea', placeholder:'2020 Toyota Hilux (pickup) — J$4,200,000 — 100% business\n2018 Nissan NV350 (van) — J$3,100,000 — 100% business', canUpload:true },
      { id:'fa-properties', title:'Investment Properties', description:'For each property owned: address, purchase price, purchase date, current outstanding mortgage balance, and current estimated market value.', type:'textarea', placeholder:'12 Blue Lagoon Dr — Purchased Jan 2020 — J$12,500,000 — Mortgage: J$8,500,000 outstanding — Est. value: J$18,000,000\n5 Palm View Rd — Purchased Jun 2022 — J$9,800,000 — Mortgage: J$7,200,000 — Est. value: J$14,500,000', canUpload:true },
      { id:'fa-capex', title:'Renovation / CapEx Costs per Property', description:'Total capital expenditure spent on renovating each property (costs that increase property value or extend useful life).', type:'textarea', placeholder:'12 Blue Lagoon Dr — Renovation 2021-2022: J$3,200,000\n5 Palm View Rd — Fit-out 2022-2023: J$2,800,000', canUpload:true },
      { id:'fa-register', title:'Fixed Asset Register / Depreciation Schedule', description:'If you already maintain a fixed asset schedule, upload it here.', type:'upload', canUpload:true },
    ]
  },
  {
    id: 'opening-balances', title: '8. Opening Balances & Prior Period', icon: 'file-spreadsheet', color: 'rose', open: false,
    items: [
      { id:'ob-financials', title:'Most Recent Financial Statements', description:'Your last set of signed accounts: Profit & Loss and Balance Sheet. Sets the starting point for QBO.', type:'upload', canUpload:true },
      { id:'ob-trial-balance', title:'Trial Balance as of Go-Live Date', description:'Trial balance as of the day you start using QBO, if available from your accountant.', type:'upload', canUpload:true },
      { id:'ob-go-live', title:'Proposed QBO Go-Live Date', description:'When do you want to start using QBO as your live system? The 6-month historical migration will be back-dated from this point.', type:'date', canUpload:false },
      { id:'ob-gct-history', title:'GCT Filing History — Last 6 Months', description:'GCT returns and payment confirmations for the last 6 months. Upload from your TAJ e-Tax portal.', type:'upload', canUpload:true },
      { id:'ob-gct-status', title:'GCT Compliance Status', description:'Are all GCT returns filed and payments up to date?', type:'select', options:['All filed and paid — fully compliant','Returns filed but some balance outstanding','Some returns not yet filed','Unsure — need to check'], canUpload:true },
      { id:'ob-tax-assess', title:'Tax Assessments / TAJ Correspondence', description:'Any notices, assessments, or payment arrangements from TAJ. Upload if applicable.', type:'upload', canUpload:true },
      { id:'ob-prev-accountant', title:'Previous Accountant / Bookkeeper Details', description:'Contact details for your current or previous accountant so we can request a handover of records.', type:'textarea', placeholder:'Name: Jane Doe CPA\nFirm: Doe & Associates\nEmail: jane@doeaccounting.com\nPhone: 876-555-0100', canUpload:false },
    ]
  },
  {
    id: 'qbo-options', title: '9. QBO Architecture — Job Costing & Rental Analytics', icon: 'settings-2', color: 'slate', open: false,
    items: [
      { id:'qbo-coa', title:'Full Chart of Accounts — Construction &amp; Short-Term Rental', description:'Complete COA including all balance sheet and P&L accounts for your dual-business model.', type:'info', infoHtml:'<strong>ASSETS (1000s)</strong><br>1010 Cash — Operating Account (NCB)<br>1020 Cash — Construction Project Account<br>1030 Cash — Rental Revenue Account<br>1040 Petty Cash<br>1100 Accounts Receivable — Construction (Progress Claims)<br>1110 GCT Input Tax Recoverable<br>1200 Work-in-Progress — Construction (Unbilled)<br>1300 Prepaid Expenses &amp; Deposits<br>1400 Materials &amp; Supplies Inventory<br>1500 Investment Properties — Land<br>1510 Investment Properties — Buildings<br>1520 Less: Accumulated Depreciation — Buildings<br>1530 Renovation &amp; CapEx Costs (Capitalised)<br>1600 Construction Equipment &amp; Tools<br>1610 Less: Accumulated Depreciation — Equipment<br>1700 Motor Vehicles<br>1710 Less: Accumulated Depreciation — Vehicles<br>1800 Computers &amp; IT Equipment<br>1810 Less: Accumulated Depreciation — IT<br><br><strong>LIABILITIES (2000s)</strong><br>2010 Accounts Payable — Suppliers &amp; Subcontractors<br>2020 GCT Payable (Output Tax)<br>2030 GCT Net Payable / (Recoverable)<br>2040 Income Tax Payable (Estimated)<br>2050 NIS Contributions Payable<br>2060 NHT Contributions Payable<br>2070 Education Tax Payable<br>2080 Payroll Liabilities — PAYE<br>2090 Retentions Held by Clients<br>2100 Accrued Liabilities<br>2200 Mortgage — Unit 1 (Blue Lagoon)<br>2210 Mortgage — Unit 2 (Palm View)<br>2300 Business Loan Payable<br>2400 Hire Purchase / Equipment Finance<br><br><strong>EQUITY (3000s)</strong><br>3010 Share Capital / Owner\'s Capital<br>3020 Retained Earnings — Prior Years<br>3030 Owner\'s Draw / Distributions<br>3040 Current Year Net Income (auto-calculated)<br><br><strong>INCOME (4000s)</strong><br>4010 Construction Revenue — Progress Billings<br>4020 Construction Revenue — Final Completion<br>4030 Variation / Extra Works Revenue<br>4110 STR / Airbnb Nightly Revenue<br>4120 Cleaning Fee Income<br>4130 Miscellaneous Rental Income<br><br><strong>COST OF REVENUE (5000s)</strong><br>5010 Materials &amp; Supplies — Construction<br>5020 Direct Labour — Construction<br>5030 Subcontractor Costs<br>5040 Equipment Rental — External<br>5050 Construction Permits &amp; Site Fees<br>5110 Cleaning &amp; Housekeeping — Rental<br>5120 Airbnb Host Service Fees (~3%)<br>5130 Linen, Toiletries &amp; Guest Supplies<br><br><strong>OPERATING EXPENSES (6000s)</strong><br>6010 Repairs &amp; Maintenance — Properties<br>6020 Utilities — Rental Properties (JPS / NWC)<br>6030 Property Insurance<br>6040 Construction Liability Insurance<br>6050 Vehicle &amp; Transportation<br>6060 Marketing &amp; Advertising<br>6070 Professional Fees (Accountant, Legal)<br>6080 Office &amp; Administration<br>6090 Software &amp; Subscriptions<br>6100 Depreciation — Equipment &amp; Vehicles<br>6110 Mortgage Interest Expense<br>6120 Bank Charges &amp; Fees', canUpload:false },
      { id:'qbo-arch', title:'QBO Architecture — Your Setup', description:'Your QBO will be configured with Projects for job costing and Locations for unit-level rental P&L.', type:'info', infoHtml:'<strong>Construction side → QBO Projects (Job Costing)</strong><br>Each renovation project = 1 QBO Project. Materials, labour, and subcontractor costs tracked per project. WIP calculated automatically. Budget vs. actual variance visible per project.<br><br><strong>Rental side → QBO Locations (Unit P&L)</strong><br>Each rental unit = 1 Location. Revenue, cleaning costs, utilities, and maintenance mapped per unit. Monthly Gross Margin per unit visible with one click.<br><br><strong>Classes → Business Segment</strong><br>Class 1: Construction &nbsp;|&nbsp; Class 2: Short-Term Rental<br>Gives you a P&amp;L split between your two business lines.', canUpload:false },
      { id:'qbo-plan', title:'Current QBO Plan', description:'QBO Advanced is recommended — it includes the Projects feature needed for full job costing. Essentials or Plus can use Sub-customers as a workaround.', type:'select', options:['Simple Start','Essentials','Plus','Advanced (Projects — recommended)','Not yet subscribed — help me choose'], canUpload:false },
      { id:'qbo-project-list', title:'Project List for QBO Setup', description:'List all active and planned renovation projects that need to be set up in QBO. Include project name, client, and contract value.', type:'textarea', placeholder:'Project A: Smith Residence — J$4,500,000\nProject B: HWT Commercial — J$12,000,000\nProject C: New build, Portmore — J$8,200,000', canUpload:false },
      { id:'qbo-unit-list', title:'Rental Unit List for QBO Locations', description:'List all rental units to be set up as Locations in QBO. Include unit name/address and Airbnb listing name.', type:'textarea', placeholder:'Location 1: Blue Lagoon Villa (12 Blue Lagoon Dr)\nLocation 2: Palm View Suite (5 Palm View Rd)', canUpload:false },
    ]
  }
],

// ─────────────────────────────────────────────
// GENERAL fallback template
// ─────────────────────────────────────────────
general: [
  {
    id: 'business', title: '1. Business & Legal Structure', icon: 'building-2', color: 'blue', open: true,
    items: [
      { id:'trn-firm', title:'Tax Registration Number (TRN)', description:'The company\'s TRN as issued by Tax Administration Jamaica (TAJ).', type:'text', placeholder:'e.g. 123-456-789', canUpload:false },
      { id:'gct-cert', title:'GCT Registration Certificate', description:'Upload your GCT registration certificate from TAJ (if registered).', type:'upload', canUpload:true },
      { id:'gct-status', title:'GCT Registration Status', description:'Are you currently registered for GCT? If so, which scheme?', type:'select', options:['Not yet registered','Standard rate — 15%','Flat rate scheme'], canUpload:false },
      { id:'biz-name', title:'Business / Trading Name', description:'The full name used on invoices and client correspondence.', type:'text', placeholder:'e.g. Your Company Name', canUpload:false },
      { id:'year-end', title:'Financial Year End Date', description:'The last day of your accounting year (e.g. December 31, March 31).', type:'text', placeholder:'December 31', canUpload:false },
      { id:'biz-insurance', title:'Business Insurance', description:'Key policies: type, insurer, policy number, annual renewal date, and cover amount.', type:'textarea', placeholder:'Insurer: Guardian Life\nPolicy #: 123456\nRenewal: June 30\nCover: J$10,000,000', canUpload:true },
    ]
  },
  {
    id: 'bank', title: '2. Bank Accounts', icon: 'landmark', color: 'green', open: false,
    items: [
      { id:'bank-operating', title:'Operating Account Details', description:'Bank name, branch, and account number for your main business account.', type:'textarea', placeholder:'Bank: NCB Jamaica\nBranch: New Kingston\nAccount #: 123-456-789', canUpload:false },
      { id:'bank-other', title:'Other Accounts', description:'Any additional savings, investment, or loan accounts.', type:'textarea', placeholder:'e.g. Savings account, foreign currency account', canUpload:false },
      { id:'bank-statements', title:'Bank Statements — 12 Months', description:'PDF statements for all accounts. Required for opening balance verification.', type:'upload', canUpload:true },
      { id:'bank-feed', title:'Online Banking — Feed Connection', description:'Can you connect your bank to QBO for automatic transaction imports?', type:'text', placeholder:'Yes — NCB Online Banking', canUpload:false },
      { id:'loan-details', title:'Loans / Lines of Credit', description:'Outstanding balance, interest rate, monthly payment, and lender name for any business loans.', type:'textarea', placeholder:'None currently', canUpload:true },
    ]
  },
  {
    id: 'revenue', title: '3. Revenue & Receivables', icon: 'briefcase', color: 'indigo', open: false,
    items: [
      { id:'client-list', title:'Customer / Client List', description:'All current active customers: name, type of business relationship, and any outstanding balance.', type:'upload', canUpload:true },
      { id:'client-ar', title:'Accounts Receivable — Unpaid Invoices', description:'All invoices issued but not yet paid. Include invoice number, date, client, amount, and age.', type:'upload', canUpload:true },
      { id:'client-ar-total', title:'Total Outstanding AR (J$)', description:'Grand total of all unpaid invoices as of today.', type:'number', placeholder:'0.00', canUpload:false },
      { id:'client-invoices-ytd', title:'All Invoices Issued — Current Financial Year', description:'Complete invoice history for the current year. Needed for GCT return verification.', type:'upload', canUpload:true },
    ]
  },
  {
    id: 'expenses', title: '4. Accounts Payable & Expenses', icon: 'receipt', color: 'orange', open: false,
    items: [
      { id:'suppliers', title:'Supplier / Vendor List', description:'Upload your vendor list. Include name, type of service, and contact details.', type:'upload', canUpload:true },
      { id:'bills-outstanding', title:'Outstanding Bills Not Yet Paid', description:'Any supplier invoices received but not yet paid.', type:'upload', canUpload:true },
      { id:'bills-total', title:'Total Outstanding AP (J$)', description:'Grand total of all unpaid bills as of today.', type:'number', placeholder:'0.00', canUpload:false },
      { id:'recurring-costs', title:'Recurring Monthly Costs', description:'List all regular monthly expenses with amounts.', type:'textarea', placeholder:'Rent: J$80,000\nUtilities: J$15,000\nInternet: J$8,000', canUpload:true },
      { id:'receipts-ytd', title:'Expense Receipts — Current Financial Year', description:'All receipts and invoices for expenses paid.', type:'upload', canUpload:true },
    ]
  },
  {
    id: 'fixed-assets', title: '5. Fixed Assets', icon: 'monitor-smartphone', color: 'cyan', open: false,
    items: [
      { id:'fa-computers', title:'Computers & IT Equipment', description:'List each item: description, date purchased, purchase price.', type:'textarea', placeholder:'Laptop — Jan 2023 — J$150,000\nPrinter — J$45,000', canUpload:true },
      { id:'fa-furniture', title:'Furniture & Equipment', description:'Desks, chairs, and other office/business equipment.', type:'textarea', placeholder:'Desk — J$80,000\nChairs x4 — J$60,000', canUpload:true },
      { id:'fa-vehicles', title:'Motor Vehicles', description:'Any vehicles owned by the business.', type:'textarea', placeholder:'None / 2020 Toyota Corolla — J$2,500,000', canUpload:true },
      { id:'fa-register', title:'Fixed Asset Register', description:'If you maintain a fixed asset schedule, upload it here.', type:'upload', canUpload:true },
    ]
  },
  {
    id: 'opening-balances', title: '6. Opening Balances & Prior Period', icon: 'file-spreadsheet', color: 'rose', open: false,
    items: [
      { id:'ob-financials', title:'Most Recent Financial Statements', description:'Your last set of signed accounts: Profit & Loss and Balance Sheet.', type:'upload', canUpload:true },
      { id:'ob-trial-balance', title:'Trial Balance as of Go-Live Date', description:'Trial balance as of the day you start using QBO, if available.', type:'upload', canUpload:true },
      { id:'ob-go-live', title:'Proposed QBO Go-Live Date', description:'When do you want to start using QBO as your live system?', type:'date', canUpload:false },
      { id:'ob-gct-status', title:'GCT Compliance Status', description:'Any outstanding GCT liabilities or TAJ correspondence?', type:'select', options:['All filed and paid — fully compliant','Returns filed but some balance outstanding','Some returns not yet filed','Unsure — need to check'], canUpload:true },
      { id:'ob-prev-accountant', title:'Previous Accountant / Bookkeeper Details', description:'Contact details for your current or previous accountant.', type:'textarea', placeholder:'Name: John Smith CPA\nFirm: JBS Accounting\nEmail: john@jbs.com', canUpload:false },
    ]
  },
  {
    id: 'qbo-options', title: '7. QBO Setup', icon: 'settings-2', color: 'slate', open: false,
    items: [
      { id:'qbo-plan', title:'Current QBO Plan', description:'Which QuickBooks Online plan are you on or planning to subscribe to?', type:'select', options:['Simple Start','Essentials','Plus','Advanced (includes Projects)','Not yet subscribed — help me choose'], canUpload:false },
      { id:'qbo-tracking-method', title:'How Do You Want to Track Performance?', description:'Select the reporting approach that best fits your business.',
        type:'qbo-options', canUpload:false,
        options: [
          { id:'subcustomer', label:'Option A — Customer / Job Tracking', description:'Each customer = Customer in QBO. Jobs or projects = Sub-customers. Track revenue and costs per customer or job.', tags:['Best for billing','Works on all plans'] },
          { id:'class', label:'Option B — Department / Class Tracking', description:'Every transaction tagged with a Department or Class. Run a P&L by department or business unit.', tags:['Department P&L','Requires Essentials+'] },
          { id:'both', label:'Option C — Both Customer and Department Tracking', description:'Track by customer/job AND by department simultaneously. Most powerful reporting option.', tags:['Recommended','Full BI reporting'] }
        ]
      },
      { id:'qbo-departments', title:'Your Departments / Business Lines', description:'List your main business lines or departments. These will become Classes in QBO.', type:'textarea', placeholder:'e.g. Sales\nServices\nAdministration', canUpload:false },
    ]
  }
]

,

// ─────────────────────────────────────────────
// MEDICAL SUPPLIES & REPAIRS template (KMP Medical)
// ─────────────────────────────────────────────
medical_supplies: [
  {
    id: 'business', title: '1. Business & Legal Structure', icon: 'building-2', color: 'blue', open: true,
    items: [
      { id:'trn-firm', title:'Tax Registration Number (TRN)', description:'The company\'s TRN as issued by Tax Administration Jamaica (TAJ).', type:'text', placeholder:'e.g. 123-456-789', canUpload:false },
      { id:'biz-reg', title:'Certificate of Incorporation / Business Registration', description:'Upload your Certificate of Incorporation or business registration documents.', type:'upload', canUpload:true },
      { id:'gct-cert', title:'GCT Registration Certificate', description:'Upload your GCT registration certificate from TAJ. Medical supplies may attract 0% or exempt status — confirm with TAJ.', type:'upload', canUpload:true },
      { id:'gct-status', title:'GCT Registration Status', description:'Are you currently registered for GCT? Note: certain medical supplies are zero-rated or exempt under the GCT Act.', type:'select', options:['Not yet registered','Registered — Standard 15%','Registered — Zero-rated medical supplies','Registered — Mixed (some exempt, some standard)','Unsure — need to verify'], canUpload:false },
      { id:'biz-name', title:'Business / Trading Name', description:'The full legal and trading name used on contracts and invoices.', type:'text', placeholder:'e.g. KMP Medical Supplies & Repairs Ltd.', canUpload:false },
      { id:'year-end', title:'Financial Year End Date', description:'The last day of your accounting year.', type:'text', placeholder:'December 31', canUpload:false },
      { id:'biz-permits', title:'Business Permits & Licences', description:'Any Ministry of Health, Bureau of Standards, or pharmaceutical distribution permits. Upload all active licences.', type:'upload', canUpload:true },
      { id:'biz-insurance', title:'Business Insurance Policies', description:'Product liability, general liability, and premises insurance. Upload all active policies.', type:'upload', canUpload:true },
    ]
  },
  {
    id: 'bank', title: '2. Bank Accounts', icon: 'landmark', color: 'green', open: false,
    items: [
      { id:'bank-operating', title:'Operating Account Details', description:'Bank name, branch, and account number for your main business account.', type:'textarea', placeholder:'Bank: NCB Jamaica\nBranch: New Kingston\nAccount #: 123-456-789', canUpload:false },
      { id:'bank-usd', title:'USD / Foreign Currency Account (if any)', description:'If you import and pay suppliers in USD, provide your USD account details.', type:'textarea', placeholder:'Bank: Scotiabank\nUSD Account #: 987-654-321\nPurpose: Supplier payments', canUpload:false },
      { id:'bank-statements', title:'Bank Statements — 12 Months (All Accounts)', description:'PDF statements for all accounts. Required for opening balance verification.', type:'upload', canUpload:true },
      { id:'bank-feed', title:'Online Banking — Feed Connection', description:'Can your bank connect to QBO for automatic transaction imports?', type:'text', placeholder:'Yes — NCB Online Banking', canUpload:false },
      { id:'loan-details', title:'Business Loans / Lines of Credit', description:'Outstanding balance, interest rate, monthly payment, and lender for any business financing.', type:'textarea', placeholder:'NCB Business Loan: J$3,500,000 @ 12% — J$85,000/month', canUpload:true },
    ]
  },
  {
    id: 'inventory', title: '3. Inventory — Medical Supplies & Parts', icon: 'package', color: 'orange', open: false,
    items: [
      { id:'inv-note', title:'Inventory Tracking Note', description:'QBO can track inventory quantities and costs. Essential for a supplies business.', type:'info', infoHtml:'<strong>Two inventory types to track:</strong><br><br><strong>1. Medical Supplies for Sale</strong> — Products purchased for resale to hospitals, clinics, pharmacies, and retail customers. Tracked at cost (FIFO or weighted average).<br><br><strong>2. Repair Parts & Components</strong> — Parts used in equipment repairs. Tracked separately to calculate true repair job profitability.<br><br><strong>GCT Note:</strong> Some medical supplies are zero-rated (0% GCT) while others attract standard 15%. Your QBO inventory items must be set up with the correct tax code per product.', canUpload:false },
      { id:'inv-list', title:'Current Inventory List', description:'Full product/SKU list with: item name, description, unit cost, selling price, quantity on hand, and GCT status (standard / zero-rated / exempt).', type:'upload', canUpload:true },
      { id:'inv-value', title:'Total Inventory Value at Cost (J$)', description:'Current total value of all medical supplies stock on hand at cost price.', type:'number', placeholder:'0.00', canUpload:false },
      { id:'inv-parts', title:'Repair Parts & Components Stock', description:'List of repair parts commonly stocked: item, quantity, unit cost. Can be spreadsheet or upload.', type:'upload', canUpload:true },
      { id:'inv-suppliers', title:'Main Suppliers / Importers', description:'List each key supplier: company name, country of origin, payment terms, lead time, and USD/JMD currency.', type:'textarea', placeholder:'MedTech Supplies Ltd (USA) — 30-day terms — USD\nCaribbean Medical (Jamaica) — COD — JMD\nPhoenix Equipment Corp (UK) — 45-day terms — USD', canUpload:true },
      { id:'inv-valuation', title:'Inventory Valuation Method', description:'How do you currently value your inventory?', type:'select', options:['FIFO (First In First Out) — Recommended','Weighted Average Cost','Specific Identification','Not currently tracking — starting fresh'], canUpload:false },
    ]
  },
  {
    id: 'customers', title: '4. Customers & Accounts Receivable', icon: 'briefcase', color: 'indigo', open: false,
    items: [
      { id:'cust-list', title:'Customer List', description:'All active customers: name, type (hospital/clinic/pharmacy/retail), contact details, credit terms, and credit limit if applicable.', type:'upload', canUpload:true },
      { id:'cust-ar', title:'Accounts Receivable — Unpaid Invoices', description:'All invoices issued but not yet paid. Include invoice number, date, customer, amount, and age (days outstanding).', type:'upload', canUpload:true },
      { id:'cust-ar-total', title:'Total Outstanding AR (J$)', description:'Grand total of all unpaid invoices as of today.', type:'number', placeholder:'0.00', canUpload:false },
      { id:'cust-invoices-ytd', title:'All Invoices — Current Financial Year', description:'Complete sales invoice history for the current year. Needed for GCT return verification.', type:'upload', canUpload:true },
      { id:'cust-deposits', title:'Customer Deposits / Advance Payments Held', description:'Any deposits received from customers not yet applied to invoices (e.g. equipment repair deposits).', type:'textarea', placeholder:'Kingston Public Hospital: J$150,000 deposit on order #1045\nNone', canUpload:false },
      { id:'cust-bad-debts', title:'Bad Debts / Write-offs', description:'Any customer balances unlikely to be collected. Include amount and reason.', type:'textarea', placeholder:'None currently', canUpload:false },
    ]
  },
  {
    id: 'repairs', title: '5. Equipment Repair Services', icon: 'wrench', color: 'amber', open: false,
    items: [
      { id:'repair-note', title:'Repair Services — Revenue Recognition Note', description:'Repair jobs should be tracked separately from product sales for accurate margin reporting.', type:'info', infoHtml:'<strong>Recommended QBO setup for Repairs:</strong><br><br>Each repair job = a <strong>Project</strong> (QBO Plus/Advanced) or <strong>Sub-customer</strong> (all plans).<br><br>Track per job:<br>• Parts used (COGS — Repair Parts)<br>• Technician time (Direct Labor)<br>• Invoice amount<br>• Gross margin per job<br><br><strong>Service types to set up as items:</strong><br>• Diagnostic / Assessment Fee<br>• Labour — Per Hour<br>• Labour — Flat Rate<br>• Maintenance Contract (Monthly)<br>• Emergency Call-out', canUpload:false },
      { id:'repair-types', title:'Equipment Types Serviced', description:'List all types of medical equipment you repair and maintain. These become service items in QBO.', type:'textarea', placeholder:'Oxygen concentrators\nInfusion pumps\nPatient monitors\nDefibrillators\nUltrasound machines\nDental chairs', canUpload:true },
      { id:'repair-contracts', title:'Maintenance Contract Clients', description:'Clients on ongoing monthly maintenance contracts. Include client name, equipment covered, monthly fee, and contract term.', type:'textarea', placeholder:'Medical Associates: 6 oxygen concentrators — J$45,000/month — 12 months\nUniversity Hospital: Patient monitors — J$80,000/month', canUpload:true },
      { id:'repair-technicians', title:'Repair Technicians', description:'Name, role, hourly or daily rate, employment status (employee or contractor).', type:'textarea', placeholder:'John Brown — Senior Technician — Employee — J$120,000/month\nMike Reid — Contractor — J$8,000/day', canUpload:true },
      { id:'repair-ar', title:'Outstanding Repair Service Invoices (J$)', description:'Any repair/maintenance invoices issued but not yet paid.', type:'upload', canUpload:true },
    ]
  },
  {
    id: 'payroll', title: '6. Payroll & Statutory Obligations', icon: 'users', color: 'purple', open: false,
    items: [
      { id:'payroll-note', title:'Jamaican Statutory Obligations', description:'Key payroll deductions and employer contributions required by law in Jamaica.', type:'info', infoHtml:'<strong>Employee deductions (withheld from gross pay):</strong><br>• PAYE — Progressive income tax rate (remit by 14th of following month to TAJ)<br>• NIS — 3% of gross (employee) — remit to MOL<br>• NHT — 2% of gross (employee) — remit to NHT<br>• Education Tax — 2.25% (employee)<br><br><strong>Employer contributions (your cost on top of gross pay):</strong><br>• NIS — 3% of gross<br>• NHT — 3% of gross<br>• Education Tax — 3.5%<br>• Heart Trust — 3% of gross', canUpload:false },
      { id:'payroll-employees', title:'Employee List & Pay Details', description:'Full name, TRN, NIS number, NHT number, start date, gross salary/wage, and pay frequency.', type:'upload', canUpload:true },
      { id:'payroll-ytd', title:'Payroll Records — Current Year', description:'All payroll records from start of financial year to today. Include pay slips, PAYE summaries, and NIS/NHT schedules.', type:'upload', canUpload:true },
      { id:'payroll-taj', title:'TAJ Employer Registration', description:'Your TAJ employer registration number (different from company TRN).', type:'text', placeholder:'e.g. 012-345-678 (Employer)', canUpload:true },
    ]
  },
  {
    id: 'expenses', title: '7. Accounts Payable & Expenses', icon: 'receipt', color: 'rose', open: false,
    items: [
      { id:'suppliers-ap', title:'Supplier / Vendor List', description:'Upload your vendor list — all suppliers of medical products and parts. Include name, contact, credit terms, currency.', type:'upload', canUpload:true },
      { id:'bills-outstanding', title:'Outstanding Bills Not Yet Paid', description:'All supplier invoices received but not yet paid. Include supplier, date, amount, currency, and due date.', type:'upload', canUpload:true },
      { id:'bills-total', title:'Total Outstanding AP (J$)', description:'Grand total of all unpaid bills as of today.', type:'number', placeholder:'0.00', canUpload:false },
      { id:'rent-lease', title:'Office / Warehouse Lease Agreement', description:'Upload your current lease. Key details: monthly rent, lease start/end date, deposit held.', type:'upload', canUpload:true },
      { id:'recurring-costs', title:'Recurring Monthly Operating Costs', description:'All regular monthly expenses with amounts.', type:'textarea', placeholder:'Rent/warehouse: J$120,000\nUtilities (JPS/NWC): J$35,000\nInternet & phone: J$12,000\nVehicle insurance: J$18,000\nSoftware & QBO: J$8,000', canUpload:true },
      { id:'import-duties', title:'Import Duties & Customs Costs', description:'Any recent customs entries. Duty costs on imported medical supplies must be included in inventory cost.', type:'upload', canUpload:true },
    ]
  },
  {
    id: 'fixed-assets', title: '8. Fixed Assets', icon: 'monitor-smartphone', color: 'cyan', open: false,
    items: [
      { id:'fa-note', title:'About Fixed Assets', description:'Fixed assets are items with a useful life over 1 year that must be depreciated.', type:'info', infoHtml:'<strong>Depreciation rates (Jamaica straight-line):</strong><br>Computers & IT: 33.3%/yr &nbsp; Repair tools & equipment: 20%/yr<br>Office furniture: 10–20%/yr &nbsp; Motor vehicles: 20–25%/yr', canUpload:false },
      { id:'fa-equipment', title:'Repair Equipment & Tools', description:'List each major piece of repair/diagnostic equipment: description, date purchased, purchase price.', type:'textarea', placeholder:'Digital Multimeter — Jan 2023 — J$85,000\nOscilloscope — Mar 2022 — J$220,000\nCalibration equipment — J$350,000', canUpload:true },
      { id:'fa-computers', title:'Computers & IT Equipment', description:'Laptops, tablets, POS system, printers, etc.', type:'textarea', placeholder:'Laptop — Jan 2023 — J$150,000\nPOS System — J$95,000', canUpload:true },
      { id:'fa-furniture', title:'Furniture & Fixtures', description:'Office furniture, shelving, display cabinets, workshop benches.', type:'textarea', placeholder:'Shelving units x4 — J$120,000\nOffice desk set — J$80,000', canUpload:true },
      { id:'fa-vehicles', title:'Motor Vehicles / Delivery Vehicles', description:'Any vehicles owned for delivery or service calls.', type:'textarea', placeholder:'2019 Toyota HiAce delivery van — J$3,200,000', canUpload:true },
      { id:'fa-register', title:'Fixed Asset Register', description:'If you maintain a fixed asset schedule, upload it here.', type:'upload', canUpload:true },
    ]
  },
  {
    id: 'opening-balances', title: '9. Opening Balances & Prior Period', icon: 'file-spreadsheet', color: 'emerald', open: false,
    items: [
      { id:'ob-financials', title:'Most Recent Financial Statements', description:'Your last set of signed accounts: Profit & Loss and Balance Sheet.', type:'upload', canUpload:true },
      { id:'ob-trial-balance', title:'Trial Balance as of Go-Live Date', description:'Trial balance as of the day you start using QBO.', type:'upload', canUpload:true },
      { id:'ob-go-live', title:'Proposed QBO Go-Live Date', description:'When do you want to start using QBO as your live system?', type:'date', canUpload:false },
      { id:'ob-gct-history', title:'GCT Filing History', description:'Are all GCT returns filed and paid up to date? Upload last 3 return submissions.', type:'upload', canUpload:true },
      { id:'ob-gct-status', title:'GCT Compliance Status', description:'Any outstanding GCT liabilities or TAJ correspondence?', type:'select', options:['All filed and paid — fully compliant','Returns filed but some balance outstanding','Some returns not yet filed','Unsure — need to check'], canUpload:true },
      { id:'ob-prev-accountant', title:'Previous Accountant / Bookkeeper Details', description:'Contact details for your current or previous accountant.', type:'textarea', placeholder:'Name: John Smith CPA\nFirm: JBS Accounting\nEmail: john@jbs.com', canUpload:false },
    ]
  },
  {
    id: 'qbo-options', title: '10. QBO Setup & Configuration', icon: 'settings-2', color: 'slate', open: false,
    items: [
      { id:'qbo-note', title:'Full Chart of Accounts — Medical Supplies & Repairs', description:'Complete COA including all balance sheet and P&L accounts.', type:'info', infoHtml:'<strong>ASSETS (1000s)</strong><br>1010 Cash — Operating Account<br>1020 Cash — USD/Foreign Currency Account<br>1030 Petty Cash<br>1100 Accounts Receivable — Customers<br>1110 GCT Input Tax Recoverable<br>1200 Inventory — Medical Supplies (for resale)<br>1210 Inventory — Repair Parts &amp; Components<br>1300 Prepaid Expenses<br>1400 Security Deposits Paid<br>1500 Repair Equipment &amp; Tools<br>1510 Less: Accumulated Depreciation — Equipment<br>1520 Computers &amp; IT Equipment<br>1530 Less: Accumulated Depreciation — IT<br>1540 Furniture &amp; Fixtures<br>1550 Less: Accumulated Depreciation — Furniture<br>1560 Motor Vehicles<br>1570 Less: Accumulated Depreciation — Vehicles<br><br><strong>LIABILITIES (2000s)</strong><br>2010 Accounts Payable — Trade Suppliers<br>2020 GCT Payable (Output Tax)<br>2030 GCT Net Payable / (Recoverable)<br>2040 Income Tax Payable (Estimated)<br>2050 NIS Contributions Payable<br>2060 NHT Contributions Payable<br>2070 Education Tax Payable<br>2080 PAYE Payable<br>2090 Customer Deposits / Advance Payments Held<br>2100 Accrued Liabilities<br>2200 Loans Payable — Current Portion<br>2300 Loans Payable — Long Term<br><br><strong>EQUITY (3000s)</strong><br>3010 Owner\'s Capital / Share Capital<br>3020 Retained Earnings — Prior Years<br>3030 Owner\'s Draw / Distributions<br>3040 Current Year Net Income (auto-calculated)<br><br><strong>INCOME (4000s)</strong><br>4010 Medical Supply Sales — Hospitals &amp; Health Centres<br>4020 Medical Supply Sales — Clinics &amp; Doctors<br>4030 Medical Supply Sales — Pharmacies<br>4040 Medical Supply Sales — Retail / Walk-in<br>4050 Equipment Repair Services<br>4060 Equipment Maintenance Contracts (Monthly)<br>4070 Installation &amp; Commissioning Services<br>4080 Freight &amp; Delivery Income<br><br><strong>COST OF GOODS SOLD (5000s)</strong><br>5010 Cost of Medical Supplies Sold<br>5020 Repair Parts &amp; Components Used<br>5030 Direct Labor — Repair Technicians<br>5040 Freight, Import Duties &amp; Customs Costs<br>5050 Warranty &amp; Returns<br><br><strong>OPERATING EXPENSES (6000s)</strong><br>6010 Office / Warehouse Rent<br>6020 Utilities &amp; Internet (JPS, NWC, Flow)<br>6030 Salaries &amp; Wages — Admin<br>6040 Employer Statutory Contributions (NIS/NHT/Ed Tax/Heart)<br>6050 Business Insurance (Liability, Property)<br>6060 Vehicle &amp; Delivery Expenses<br>6070 Office Supplies &amp; Stationery<br>6080 IT &amp; Software Subscriptions<br>6090 Marketing &amp; Advertising<br>6100 Professional Fees (Accountant, Legal)<br>6110 Bank Charges &amp; Interest<br>6120 Staff Training &amp; Development<br>6130 Depreciation Expense', canUpload:false },
      {
        id:'qbo-tracking-method', title:'Choose Your Tracking Method', description:'Select the reporting approach that best fits your business.',
        type:'qbo-options', canUpload:false,
        options: [
          { id:'subcustomer', label:'Option A — Customer / Job Tracking', description:'Each customer (hospital, clinic, pharmacy) = Customer in QBO. Each repair job or large order = Sub-customer / Project. Track revenue and gross margin per customer.', tags:['Best for billing','All QBO plans','Per-customer reporting'] },
          { id:'class', label:'Option B — Department Tracking (Sales vs Repairs)', description:'Tag every transaction as either "Product Sales" or "Repair Services". Run separate P&L for each business line — see which is more profitable.', tags:['Business line P&L','Requires Essentials+'] },
          { id:'both', label:'Option C — Both Customer + Department (Recommended)', description:'Track by customer AND by business line simultaneously. See which customer type (hospital vs clinic vs pharmacy) and which service (sales vs repairs) drives the most profit.', tags:['Recommended','Full reporting','Requires Plus'] }
        ]
      },
      { id:'qbo-plan', title:'Current QBO Plan', description:'Which QuickBooks Online plan are you on or planning to subscribe to? Note: Inventory tracking requires Plus or Advanced.', type:'select', options:['Simple Start (no inventory)','Essentials','Plus — Recommended (includes inventory)','Advanced (includes Projects)','Not yet subscribed — help me choose'], canUpload:false },
      { id:'qbo-departments', title:'Your Business Lines / Departments', description:'Confirm or adjust the department names. These will become Classes in QBO.', type:'textarea', placeholder:'Product Sales — Medical Supplies\nRepair Services\nMaintenance Contracts\nInstallation', canUpload:false },
    ]
  }
],

// ─────────────────────────────────────────────
// HR CONSULTANCY template (Restore One)
// ─────────────────────────────────────────────
hr_consultancy: [
  {
    id: 'business', title: '1. Business & Legal Structure', icon: 'building-2', color: 'blue', open: true,
    items: [
      { id:'trn-firm', title:'Tax Registration Number (TRN)', description:'The firm\'s TRN as issued by Tax Administration Jamaica (TAJ).', type:'text', placeholder:'e.g. 123-456-789', canUpload:false },
      { id:'biz-reg', title:'Certificate of Incorporation / Business Registration', description:'Upload your Certificate of Incorporation or sole trader registration documents.', type:'upload', canUpload:true },
      { id:'gct-cert', title:'GCT Registration Certificate', description:'Upload your GCT registration certificate from TAJ. HR consulting services attract standard 15% GCT.', type:'upload', canUpload:true },
      { id:'gct-status', title:'GCT Registration Status', description:'Are you currently registered for GCT?', type:'select', options:['Not yet registered','Standard rate — 15% (on all consulting fees)','Unsure — need to check threshold'], canUpload:false },
      { id:'biz-name', title:'Business / Trading Name', description:'Full legal and trading name used on proposals and invoices.', type:'text', placeholder:'e.g. Restore One HR Consultancy Ltd.', canUpload:false },
      { id:'year-end', title:'Financial Year End Date', description:'The last day of your accounting year.', type:'text', placeholder:'December 31', canUpload:false },
      { id:'prof-body', title:'Professional Body Memberships', description:'SHRM, HRMAJ, or other HR professional body membership details. Upload certificates.', type:'upload', canUpload:true },
      { id:'biz-insurance', title:'Professional Indemnity & Business Insurance', description:'Policy details for professional indemnity (errors & omissions) and general business insurance.', type:'upload', canUpload:true },
    ]
  },
  {
    id: 'bank', title: '2. Bank Accounts', icon: 'landmark', color: 'green', open: false,
    items: [
      { id:'bank-operating', title:'Operating Account Details', description:'Bank name, branch, and account number for your main business account.', type:'textarea', placeholder:'Bank: NCB Jamaica\nBranch: New Kingston\nAccount #: 123-456-789', canUpload:false },
      { id:'bank-statements', title:'Bank Statements — 12 Months', description:'PDF statements for all business accounts. Required for opening balance verification.', type:'upload', canUpload:true },
      { id:'bank-feed', title:'Online Banking — Feed Connection', description:'Can your bank connect to QBO for automatic transaction imports?', type:'text', placeholder:'Yes — NCB Online Banking', canUpload:false },
      { id:'loan-details', title:'Business Loans / Overdraft Facilities', description:'Outstanding balance, interest rate, monthly payment, and lender for any business financing.', type:'textarea', placeholder:'None currently / NCB overdraft: J$500,000 @ 18%', canUpload:true },
    ]
  },
  {
    id: 'clients', title: '3. Clients & Accounts Receivable', icon: 'briefcase', color: 'indigo', open: false,
    items: [
      { id:'client-note', title:'Client & Revenue Types Note', description:'HR consulting revenue typically comes from several distinct service streams — set each up separately in QBO.', type:'info', infoHtml:'<strong>Revenue streams to track separately:</strong><br><br>• <strong>Consulting Retainers</strong> — Monthly fixed fees for ongoing HR advisory services<br>• <strong>Project / Engagement Fees</strong> — One-time fees for specific projects (policy development, org design, culture audits)<br>• <strong>Recruitment Fees</strong> — Placement fees (typically 10–20% of first-year salary)<br>• <strong>Training & Workshops</strong> — Per-session or per-participant fees<br>• <strong>Payroll Management Services</strong> — Monthly fee to manage client payroll<br><br>Each stream has different margin profiles — tracking separately lets you see which is most profitable.', canUpload:false },
      { id:'client-list', title:'Active Client List', description:'All current clients: company name, contact person, service type, billing terms (monthly retainer, project, etc.), and current monthly/project value.', type:'upload', canUpload:true },
      { id:'client-ar', title:'Accounts Receivable — Unpaid Invoices', description:'All invoices issued but not yet paid. Include invoice number, date, client, service type, amount, and age.', type:'upload', canUpload:true },
      { id:'client-ar-total', title:'Total Outstanding AR (J$)', description:'Grand total of all unpaid invoices as of today.', type:'number', placeholder:'0.00', canUpload:false },
      { id:'client-retainers', title:'Monthly Retainer Agreements', description:'Upload signed retainer agreements for all clients on monthly arrangements.', type:'upload', canUpload:true },
      { id:'client-invoices-ytd', title:'All Invoices — Current Financial Year', description:'Complete invoicing history for the current year.', type:'upload', canUpload:true },
    ]
  },
  {
    id: 'services', title: '4. Service Items & Pricing', icon: 'list-checks', color: 'amber', open: false,
    items: [
      { id:'svc-note', title:'QBO Service Items Setup', description:'Each type of service you provide should be a separate "item" in QBO — this drives accurate revenue reporting.', type:'info', infoHtml:'<strong>Recommended service items to create in QBO:</strong><br><br>• HR Advisory — Hourly Rate<br>• HR Retainer — Monthly Fee<br>• Recruitment — Placement Fee<br>• Recruitment — Retained Search (upfront + success)<br>• Training / Workshop — Per Session<br>• Training / Workshop — Per Participant<br>• Payroll Management — Monthly<br>• HR Policy Development — Project Fee<br>• Organisational Design — Project Fee<br>• Employee Relations — Per Engagement<br>• Exit Interview / Offboarding — Per Employee<br>• HR Compliance Audit — Fixed Fee', canUpload:false },
      { id:'svc-list', title:'Your Current Services & Rates', description:'List all services you offer with your current pricing. This is used to set up your QBO price list.', type:'textarea', placeholder:'HR Retainer: J$85,000/month\nRecruitment (manager level): 15% of first-year salary\nHalf-day workshop: J$120,000 flat\nFull-day workshop (up to 20 pax): J$220,000\nPayroll management: J$35,000/month (up to 20 employees)', canUpload:false },
      { id:'svc-proposals', title:'Standard Proposal / Engagement Letter Templates', description:'Upload your standard proposal template and engagement letter. We\'ll ensure QBO invoices match your proposal format.', type:'upload', canUpload:true },
    ]
  },
  {
    id: 'subcontractors', title: '5. Associate Consultants & Subcontractors', icon: 'users', color: 'purple', open: false,
    items: [
      { id:'sub-note', title:'Associates vs. Employees', description:'Associate consultants are typically contracted, not employed. Understand the distinction for tax purposes.', type:'info', infoHtml:'<strong>Associate / Subcontracted Consultant:</strong><br>• Payments classified as Contractor Fees (expense, not payroll)<br>• No PAYE/NIS/NHT withholding required IF genuinely self-employed<br>• Obtain their TRN and retain signed contract<br>• Consider withholding tax obligations if applicable<br><br><strong>Employed Staff:</strong><br>• Full PAYE, NIS, NHT, Ed Tax, Heart Trust obligations<br>• Statutory contributions due by 14th of following month', canUpload:false },
      { id:'sub-list', title:'Associate Consultants List', description:'All associates/subcontractors: full name, TRN, specialisation, rate (daily/hourly/project), and engagement status.', type:'textarea', placeholder:'Mary Brown — TRN: 123-456 — Leadership & Culture — J$35,000/day\nPaul Smith — TRN: 987-654 — Compensation & Benefits — J$40,000/day\nCareer Solutions Ltd — Recruitment sub — 30% of placement fee', canUpload:true },
      { id:'sub-agreements', title:'Subcontractor Agreements', description:'Upload signed agreements for all associate consultants.', type:'upload', canUpload:true },
      { id:'sub-ytd', title:'Payments to Associates — Current Year', description:'Total paid to each associate/subcontractor from start of financial year to today.', type:'textarea', placeholder:'Mary Brown: J$350,000\nPaul Smith: J$280,000', canUpload:true },
    ]
  },
  {
    id: 'payroll', title: '6. Payroll & Statutory Obligations', icon: 'landmark', color: 'rose', open: false,
    items: [
      { id:'payroll-note', title:'Jamaican Statutory Obligations', description:'Required payroll deductions and employer contributions.', type:'info', infoHtml:'<strong>Employee deductions (withheld from gross pay — remit by 14th):</strong><br>• PAYE — Progressive income tax rate → TAJ<br>• NIS — 3% of gross → Ministry of Labour<br>• NHT — 2% of gross → National Housing Trust<br>• Education Tax — 2.25%<br><br><strong>Employer contributions (your additional cost):</strong><br>• NIS — 3% employer share<br>• NHT — 3% employer share<br>• Education Tax — 3.5% employer share<br>• Heart Trust — 3% of gross', canUpload:false },
      { id:'payroll-employees', title:'Employee List & Pay Details', description:'Full name, TRN, NIS number, NHT number, start date, gross salary, and pay frequency for each employee.', type:'upload', canUpload:true },
      { id:'payroll-ytd', title:'Payroll Records — Current Year', description:'All payroll records from start of financial year. Include pay slips and statutory payment schedules.', type:'upload', canUpload:true },
      { id:'payroll-taj', title:'TAJ Employer Registration Number', description:'Your TAJ employer registration number (different from company TRN). Required to file PAYE returns.', type:'text', placeholder:'e.g. 012-345-678 (Employer)', canUpload:true },
    ]
  },
  {
    id: 'expenses', title: '7. Accounts Payable & Expenses', icon: 'receipt', color: 'orange', open: false,
    items: [
      { id:'suppliers', title:'Supplier / Vendor List', description:'All regular vendors: office supplies, software subscriptions, training materials, venue hire. Include name, contact, and type.', type:'upload', canUpload:true },
      { id:'bills-outstanding', title:'Outstanding Bills Not Yet Paid', description:'All supplier invoices received but not yet paid.', type:'upload', canUpload:true },
      { id:'bills-total', title:'Total Outstanding AP (J$)', description:'Grand total of all unpaid bills as of today.', type:'number', placeholder:'0.00', canUpload:false },
      { id:'rent-lease', title:'Office Lease Agreement', description:'Upload your current office lease. Key details: monthly rent, lease start/end, deposit held.', type:'upload', canUpload:true },
      { id:'recurring-costs', title:'Recurring Monthly Operating Costs', description:'All regular monthly expenses with amounts.', type:'textarea', placeholder:'Office rent: J$95,000\nInternet & phone: J$12,000\nSoftware (HR tools, QBO, Microsoft 365): J$25,000\nProfessional development / SHRM: J$8,000', canUpload:true },
      { id:'receipts-ytd', title:'Expense Receipts — Current Financial Year', description:'All receipts and invoices for business expenses paid. Needed for GCT input credit claims.', type:'upload', canUpload:true },
    ]
  },
  {
    id: 'fixed-assets', title: '8. Fixed Assets', icon: 'monitor-smartphone', color: 'cyan', open: false,
    items: [
      { id:'fa-note', title:'About Fixed Assets', description:'Fixed assets are items with a useful life over 1 year that must be depreciated.', type:'info', infoHtml:'<strong>Depreciation rates (Jamaica straight-line):</strong><br>Computers & IT: 33.3%/yr &nbsp; Office furniture: 10–20%/yr &nbsp; Motor vehicles: 20–25%/yr', canUpload:false },
      { id:'fa-computers', title:'Computers & IT Equipment', description:'Laptops, tablets, projectors, video conferencing equipment, etc.', type:'textarea', placeholder:'MacBook Pro — Jan 2024 — J$280,000\nProjector — J$95,000\nWebcam/Mic setup — J$45,000', canUpload:true },
      { id:'fa-furniture', title:'Office Furniture & Equipment', description:'Desks, chairs, bookshelves, whiteboards, training room furniture.', type:'textarea', placeholder:'Training room chairs x10 — J$150,000\nOffice desk set — J$95,000', canUpload:true },
      { id:'fa-vehicles', title:'Motor Vehicles', description:'Any vehicles owned for business use.', type:'textarea', placeholder:'None / 2021 Honda Civic — J$3,500,000', canUpload:true },
      { id:'fa-register', title:'Fixed Asset Register', description:'If you maintain a fixed asset schedule, upload it here.', type:'upload', canUpload:true },
    ]
  },
  {
    id: 'opening-balances', title: '9. Opening Balances & Prior Period', icon: 'file-spreadsheet', color: 'emerald', open: false,
    items: [
      { id:'ob-financials', title:'Most Recent Financial Statements', description:'Your last set of signed accounts: Profit & Loss and Balance Sheet.', type:'upload', canUpload:true },
      { id:'ob-trial-balance', title:'Trial Balance as of Go-Live Date', description:'Trial balance as of the day you start using QBO.', type:'upload', canUpload:true },
      { id:'ob-go-live', title:'Proposed QBO Go-Live Date', description:'When do you want to start using QBO as your live system?', type:'date', canUpload:false },
      { id:'ob-gct-status', title:'GCT Compliance Status', description:'Any outstanding GCT liabilities or TAJ correspondence?', type:'select', options:['All filed and paid — fully compliant','Returns filed but some balance outstanding','Some returns not yet filed','Unsure — need to check'], canUpload:true },
      { id:'ob-prev-accountant', title:'Previous Accountant / Bookkeeper Details', description:'Contact details for your current or previous accountant.', type:'textarea', placeholder:'Name: John Smith CPA\nFirm: JBS Accounting\nEmail: john@jbs.com', canUpload:false },
    ]
  },
  {
    id: 'qbo-options', title: '10. QBO Setup & Configuration', icon: 'settings-2', color: 'slate', open: false,
    items: [
      { id:'qbo-note', title:'Full Chart of Accounts — HR Consultancy', description:'Complete COA including all balance sheet and P&L accounts.', type:'info', infoHtml:'<strong>ASSETS (1000s)</strong><br>1010 Cash — Operating Account<br>1020 Petty Cash<br>1100 Accounts Receivable — Clients<br>1110 GCT Input Tax Recoverable<br>1200 Prepaid Expenses (Insurance, Software)<br>1300 Security Deposits Paid<br>1400 Computers &amp; IT Equipment<br>1410 Less: Accumulated Depreciation — IT<br>1420 Office Furniture &amp; Equipment<br>1430 Less: Accumulated Depreciation — Furniture<br>1440 Motor Vehicles<br>1450 Less: Accumulated Depreciation — Vehicles<br><br><strong>LIABILITIES (2000s)</strong><br>2010 Accounts Payable — Trade<br>2020 GCT Payable (Output Tax)<br>2030 GCT Net Payable / (Recoverable)<br>2040 Income Tax Payable (Estimated)<br>2050 NIS Contributions Payable<br>2060 NHT Contributions Payable<br>2070 Education Tax Payable<br>2080 PAYE Payable<br>2090 Deferred Revenue — Retainer Fees Received in Advance<br>2100 Accrued Liabilities<br>2200 Loans Payable — Current Portion<br>2300 Loans Payable — Long Term<br><br><strong>EQUITY (3000s)</strong><br>3010 Owner\'s Capital / Share Capital<br>3020 Retained Earnings — Prior Years<br>3030 Owner\'s Draw / Distributions<br>3040 Current Year Net Income (auto-calculated)<br><br><strong>INCOME (4000s)</strong><br>4010 HR Consulting Fees — Project / Engagement<br>4020 HR Retainer Fees — Monthly<br>4030 Recruitment &amp; Placement Fees<br>4040 Training &amp; Workshop Fees<br>4050 HR Policy &amp; Compliance Advisory<br>4060 Payroll Management Services<br>4070 Employee Relations &amp; IR Advisory<br>4080 Other Professional Services<br><br><strong>COST OF REVENUE (5000s)</strong><br>5010 Subcontracted Consultant Fees<br>5020 Training Materials &amp; Resources<br>5030 Assessment Tools &amp; Licensing<br>5040 Venue &amp; Equipment Hire (client projects)<br><br><strong>OPERATING EXPENSES (6000s)</strong><br>6010 Office Rent<br>6020 Utilities &amp; Internet<br>6030 Staff Salaries &amp; Wages<br>6040 Employer Statutory Contributions (NIS/NHT/Ed Tax/Heart)<br>6050 Business &amp; Professional Indemnity Insurance<br>6060 Professional Development (SHRM, HRMAJ, CPD)<br>6070 Office Supplies &amp; Stationery<br>6080 IT &amp; Software Subscriptions (HR Tools, Microsoft 365)<br>6090 Marketing &amp; Business Development<br>6100 Professional Fees (Accountant, Legal)<br>6110 Bank Charges &amp; Interest<br>6120 Travel &amp; Entertainment<br>6130 Depreciation Expense', canUpload:false },
      {
        id:'qbo-tracking-method', title:'Choose Your Tracking Method', description:'Select the reporting approach that best fits your consultancy.',
        type:'qbo-options', canUpload:false,
        options: [
          { id:'subcustomer', label:'Option A — Client / Project Tracking', description:'Each client = Customer in QBO. Each engagement or project = Sub-customer. Track fees, costs, and margin per client and per engagement.', tags:['Per-client P&L','All QBO plans','Engagement profitability'] },
          { id:'class', label:'Option B — Service Line Tracking', description:'Tag every transaction as Consulting, Recruitment, Training, or Payroll Management. Run a separate P&L for each service line to see which is most profitable.', tags:['Service line P&L','Requires Essentials+'] },
          { id:'both', label:'Option C — Both Client + Service Line (Recommended)', description:'Track by client AND by service line simultaneously. See which client is most profitable AND which service line drives the best margin.', tags:['Recommended','Full BI reporting','Requires Plus'] }
        ]
      },
      { id:'qbo-plan', title:'Current QBO Plan', description:'Which QuickBooks Online plan are you on or planning to subscribe to?', type:'select', options:['Simple Start','Essentials','Plus — Recommended','Advanced (includes Projects)','Not yet subscribed — help me choose'], canUpload:false },
      { id:'qbo-service-lines', title:'Your Service Lines / Departments', description:'Confirm or adjust the service line names. These will become Classes in QBO.', type:'textarea', placeholder:'HR Consulting\nRecruitment & Placement\nTraining & Workshops\nPayroll Management Services', canUpload:false },
    ]
  }
]

}; // end SECTION_TEMPLATES

// Backwards compatibility alias
const SECTIONS = SECTION_TEMPLATES.general;

// COA accounts unlocked when each section is marked complete
// Used by the dynamic COA viewer in the implementation portal
const COA_MAPPINGS = {
  law_firm: {
    business:        ['1010','1040','2020','2030','3010','3020'],
    bank:            ['1010','1020','1030','2200','2300','6110','6120'],
    contractors:     ['5010','2010'],
    clients:         ['1100','1200','1210','4010','4020','4030','4040','4050','4100'],
    trust:           ['1030','2080','2090'],
    expenses:        ['2010','2100','6010','6020','6060','6070','6080','6090','6100'],
    'fixed-assets':  ['1500','1510','1520','1530','1540','1550','1560','1570','6120'],
    'opening-balances': ['3020','3040','2040'],
    'qbo-options':   ['4010','4020','4030','4040','4050'],
  },
  construction_rental: {
    business:        ['1010','2020','2030','3010'],
    bank:            ['1010','1020','1030','2200','2210','2300','6110'],
    construction:    ['1100','1200','4010','4020','4030','5010','5020','5030','5040','5050'],
    rentals:         ['4110','4120','4130','5110','5120','5130','6010','6020','6030'],
    expenses:        ['2010','2100','6040','6050','6060','6070','6080','6090'],
    payroll:         ['2050','2060','2070','2080','5020'],
    'fixed-assets':  ['1500','1510','1520','1530','1600','1610','1700','1710','6100'],
    'opening-balances': ['3020','3040','2040'],
    'qbo-options':   [],
  },
  medical_supplies: {
    business:        ['1010','2020','2030','3010','3020'],
    bank:            ['1010','1020','2200','2300','6110'],
    inventory:       ['1200','1210','5010','5020','5040'],
    customers:       ['1100','2090','4010','4020','4030','4040'],
    repairs:         ['4050','4060','4070','5030'],
    payroll:         ['2050','2060','2070','2080','6030','6040'],
    expenses:        ['2010','2100','6050','6060','6070','6080','6090','6100'],
    'fixed-assets':  ['1500','1510','1520','1530','1540','1550','1560','1570','6130'],
    'opening-balances': ['3020','3040','2040'],
    'qbo-options':   ['4010','4020','4030','4040','4050','4060'],
  },
  hr_consultancy: {
    business:        ['1010','2020','2030','3010','3020'],
    bank:            ['1010','2200','2300','6110'],
    clients:         ['1100','2090','4010','4020','4030','4040'],
    services:        ['4010','4020','4030','4040','4050','4060','4070'],
    subcontractors:  ['5010','5020','5030','5040'],
    payroll:         ['2050','2060','2070','2080','6030','6040'],
    expenses:        ['2010','2100','6050','6060','6070','6080','6090','6100'],
    'fixed-assets':  ['1400','1410','1420','1430','1440','1450','6130'],
    'opening-balances': ['3020','3040','2040'],
    'qbo-options':   ['4010','4020','4030','4040','4050','4060'],
  },
};

// Standard bookkeeping tasks (used when creating a new period)
const BOOKKEEPING_TASKS = [
  { task_type: 'bank_recon',     task_name: 'Bank Reconciliation — All Accounts' },
  { task_type: 'gct_return',     task_name: 'GCT Return Preparation & Filing' },
  { task_type: 'payroll',        task_name: 'Payroll Processing & Statutory Remittances' },
  { task_type: 'ap_ar',          task_name: 'AP / AR Data Entry & Aging Review' },
  { task_type: 'data_entry',     task_name: 'Transaction Coding & Data Entry' },
  { task_type: 'mgmt_accounts',  task_name: 'Management Accounts Preparation' },
  { task_type: 'reconciliation', task_name: 'Subledger Reconciliations (AR / AP / Trust)' },
  { task_type: 'tax_filing',     task_name: 'Tax Compliance Review & Filing' },
];
