// Shared checklist definition — used by onboarding.html and onboarding-admin.html
const SECTIONS = [
  {
    id: 'business', title: '1. Business & Legal Structure', icon: 'building-2', color: 'blue', open: true,
    items: [
      { id:'trn-firm', title:'Tax Registration Number (TRN)', description:'The firm\'s TRN as issued by Tax Administration Jamaica (TAJ).', type:'text', placeholder:'e.g. 123-456-789', canUpload:false },
      { id:'gct-cert', title:'GCT Registration Certificate', description:'Upload your GCT registration certificate from TAJ (if registered).', type:'upload', canUpload:true },
      { id:'gct-status', title:'GCT Registration Status', description:'Are you currently registered for GCT? If so, which scheme?', type:'select', options:['Not yet registered','Standard rate — 15%','Flat rate scheme'], canUpload:false },
      { id:'biz-name', title:'Business / Trading Name', description:'The full name used on invoices and client correspondence.', type:'text', placeholder:'e.g. Smith & Associates', canUpload:false },
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
      { id:'client-list', title:'Active Client List', description:'All current active clients: name, matter/account number, and agreed billing rate or fixed fee.', type:'upload', canUpload:true },
      { id:'client-ar', title:'Accounts Receivable — Unpaid Invoices', description:'All invoices issued but not yet paid. Include invoice number, date, client, amount, and age.', type:'upload', canUpload:true },
      { id:'client-ar-total', title:'Total Outstanding AR (J$)', description:'Grand total of all unpaid invoices as of today.', type:'number', placeholder:'0.00', canUpload:false },
      { id:'client-wip', title:'Work in Progress (Unbilled)', description:'Estimate of billable time or work logged but not yet invoiced.', type:'textarea', placeholder:'Matter 1: 12 hrs @ J$20,000/hr = J$240,000\nMatter 2: 8 hrs @ J$25,000/hr = J$200,000', canUpload:true },
      { id:'client-invoices-ytd', title:'All Invoices Issued — Current Financial Year', description:'Complete invoice history for the current year. Needed for GCT return verification.', type:'upload', canUpload:true },
      { id:'client-writeoffs', title:'Bad Debts / Write-offs', description:'Any client balances written off or unlikely to be collected.', type:'textarea', placeholder:'None currently', canUpload:false },
    ]
  },
  {
    id: 'trust', title: '5. Client Trust Account Records', icon: 'shield-check', color: 'emerald', open: false,
    items: [
      { id:'trust-warning', title:'Trust Account — Compliance Note', description:'The trust bank balance must equal the sum of all client trust balances. Any difference must be explained before QBO setup.', type:'info', infoHtml:'<strong>Legal requirement:</strong> Client trust funds must be kept strictly separate from firm funds.<br><br>The trust bank balance must equal the sum of all individual client trust ledger balances at all times.', canUpload:false },
      { id:'trust-ledger', title:'Full Trust Ledger — Transaction History', description:'Complete record of all trust account transactions. Can be Excel, PDF, or system export.', type:'upload', canUpload:true },
      { id:'trust-client-balances', title:'Current Trust Balance Per Client', description:'Amount held in trust for each active client/matter as of today.', type:'textarea', placeholder:'Client A: J$500,000\nClient B: J$250,000\nTOTAL: J$750,000', canUpload:true },
      { id:'trust-bank-balance', title:'Trust Bank Account Balance Today (J$)', description:'Current actual balance per online banking. Must match the total of client balances above.', type:'number', placeholder:'0.00', canUpload:false },
      { id:'trust-disbursements', title:'Disbursements Paid on Behalf of Clients', description:'Any costs paid out of trust on behalf of clients not yet billed back.', type:'textarea', placeholder:'Client A: J$15,000 filing fee — 12 Jan 2025', canUpload:true },
    ]
  },
  {
    id: 'expenses', title: '6. Accounts Payable & Expenses', icon: 'receipt', color: 'orange', open: false,
    items: [
      { id:'suppliers', title:'Regular Supplier / Vendor List', description:'Upload your vendor list — spreadsheet, Word doc, or PDF. Include name, type of service, and contact details.', type:'upload', canUpload:true },
      { id:'bills-outstanding', title:'Outstanding Bills Not Yet Paid', description:'Any supplier invoices received but not yet paid. Include supplier, date, amount, and due date.', type:'upload', canUpload:true },
      { id:'bills-total', title:'Total Outstanding AP (J$)', description:'Grand total of all unpaid bills as of today.', type:'number', placeholder:'0.00', canUpload:true },
      { id:'rent-lease', title:'Office / Premises Lease Agreement', description:'Upload your current lease. Key details: monthly rent, lease start/end date, deposit held.', type:'upload', canUpload:true },
      { id:'recurring-costs', title:'Recurring Monthly Costs', description:'List of all regular monthly expenses with amounts. Type here or upload a spreadsheet.', type:'textarea', placeholder:'Office rent: J$120,000\nInternet/phone: J$15,000\nUtilities: J$20,000', canUpload:true },
      { id:'receipts-ytd', title:'Expense Receipts — Current Financial Year', description:'All receipts and invoices for expenses paid. Upload as ZIP or folder.', type:'upload', canUpload:true },
    ]
  },
  {
    id: 'fixed-assets', title: '7. Fixed Assets', icon: 'monitor-smartphone', color: 'cyan', open: false,
    items: [
      { id:'fa-note', title:'About Fixed Assets', description:'Fixed assets are items with a useful life over 1 year that must be depreciated.', type:'info', infoHtml:'<strong>Common depreciation rates (straight-line):</strong><br>Computers & IT: 33.3% per year<br>Office furniture: 10–20% per year<br>Motor vehicles: 20–25% per year<br>Leasehold improvements: Over remaining lease term', canUpload:false },
      { id:'fa-computers', title:'Computers & IT Equipment', description:'List each item: description, date purchased, purchase price, accumulated depreciation to date.', type:'textarea', placeholder:'Laptop — Jan 2023 — J$280,000\nPrinter — Mar 2022 — J$95,000', canUpload:true },
      { id:'fa-furniture', title:'Office Furniture & Equipment', description:'Desks, chairs, filing cabinets, reception furniture, etc.', type:'textarea', placeholder:'Desk set — 2021 — J$180,000\nChairs x3 — 2021 — J$60,000', canUpload:true },
      { id:'fa-vehicles', title:'Motor Vehicles', description:'Any vehicles owned by the business. Include purchase price, year, make/model.', type:'textarea', placeholder:'None / 2019 Toyota Corolla — J$2,500,000', canUpload:true },
      { id:'fa-leaseholds', title:'Leasehold Improvements', description:'Any improvements made to your rented space (partitions, AC units, fit-out).', type:'textarea', placeholder:'Office fit-out 2022 — J$450,000\nAC installation — J$180,000', canUpload:true },
      { id:'fa-register', title:'Fixed Asset Register', description:'If you maintain a fixed asset schedule in Excel or other format, upload it here.', type:'upload', canUpload:true },
    ]
  },
  {
    id: 'opening-balances', title: '8. Opening Balances & Prior Period', icon: 'file-spreadsheet', color: 'rose', open: false,
    items: [
      { id:'ob-financials', title:'Most Recent Financial Statements', description:'Your last set of signed accounts: Profit & Loss and Balance Sheet.', type:'upload', canUpload:true },
      { id:'ob-trial-balance', title:'Trial Balance as of Go-Live Date', description:'If available from your current system or accountant, the trial balance as of the day you start using QBO.', type:'upload', canUpload:true },
      { id:'ob-go-live', title:'Proposed QBO Go-Live Date', description:'When do you want to start using QBO as your live system?', type:'date', canUpload:false },
      { id:'ob-gct-history', title:'GCT Filing History', description:'Are all GCT returns filed and paid up to date? Upload last 3 GCT return submissions.', type:'upload', canUpload:true },
      { id:'ob-gct-status', title:'GCT Compliance Status', description:'Any outstanding GCT liabilities or TAJ correspondence?', type:'select', options:['All filed and paid — fully compliant','Returns filed but some balance outstanding','Some returns not yet filed','Unsure — need to check'], canUpload:true },
      { id:'ob-tax-assess', title:'Tax Assessments / TAJ Correspondence', description:'Any notices, assessments, or payment plans from TAJ.', type:'upload', canUpload:true },
      { id:'ob-prev-accountant', title:'Previous Accountant / Bookkeeper Details', description:'Contact details for your current or previous accountant so we can request a handover of records.', type:'textarea', placeholder:'Name: John Smith CPA\nFirm: JBS Accounting\nEmail: john@jbs.com\nPhone: 876-555-0100', canUpload:false },
    ]
  },
  {
    id: 'qbo-options', title: '9. QBO Setup — Tracking Options', icon: 'settings-2', color: 'slate', open: false,
    items: [
      { id:'qbo-note', title:'Tracking Options Overview', description:'QuickBooks Online has different plans with different tracking features.', type:'info', infoHtml:'The standard QBO plans (Simple Start, Essentials, Plus) offer <strong>Sub-customers</strong> and <strong>Class tracking</strong> as the main tools for department/matter-level reporting. Projects is only available on QBO Advanced.', canUpload:false },
      {
        id:'qbo-tracking-method', title:'Choose Your Tracking Method', description:'Select the approach that best fits how you want to report.',
        type:'qbo-options', canUpload:false,
        options: [
          { id:'subcustomer', label:'Option A — Sub-customer Hierarchy', description:'Client = Customer in QBO. Each matter/job = Sub-customer. All invoices and payments linked to the job.', tags:['Best for billing','Works on all QBO plans','Invoice tracking per job'] },
          { id:'class', label:'Option B — Class Tracking', description:'Every transaction tagged with a Class (e.g. Department, Location, Service Line). Run a P&L by Class.', tags:['Department P&L','Requires QBO Essentials+','Good for management reporting'] },
          { id:'both', label:'Option C — Both Sub-customers + Classes', description:'Sub-customers track client/job billing. Classes track department or service line. Full multi-dimensional reporting.', tags:['Recommended','Full reporting','Most powerful'] }
        ]
      },
      { id:'qbo-plan', title:'Current QBO Plan', description:'Which QuickBooks Online plan are you on or planning to subscribe to?', type:'select', options:['Simple Start','Essentials','Plus','Advanced (includes Projects)','Not yet subscribed — help me choose'], canUpload:false },
      { id:'qbo-practice-areas', title:'Your Departments / Service Lines', description:'List all departments or service lines. These will become Classes or categories in QBO.', type:'textarea', placeholder:'e.g. Department A\nDepartment B\nDepartment C', canUpload:false },
      { id:'qbo-attorney-tracking', title:'Track by Responsible Person / Department Head?', description:'Do you want reports that show billing and revenue by person or department head?', type:'select', options:['Yes — set up tracking now','No — not needed at this stage'], canUpload:false },
    ]
  }
];
