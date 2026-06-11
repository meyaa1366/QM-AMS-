// AP/AR Submodule Static Specs, Dictionaries & Initial Datasets
// Customized for QM-ABC Accounting System (ERCA & IFRS compliant)

export interface SupplierRecord {
  company: string;
  code: string;
  name: string;
  shortName: string;
  type: string;
  group: string;
  tin: string;
  vatNumber: string;
  vatStatus: string;
  whtStatus: string;
  currency: string;
  paymentTerm: string;
  payableAccount: string;
  advanceAccount: string;
  bankName: string;
  bankBranch: string;
  bankAccount: string;
  beneficiaryName: string;
  matchingType: string;
  paymentHold: string;
  paymentHoldReason: string;
  activeStatus: string;
  approvalStatus: string;
  balance: number;
  city: string;
  phone: string;
  email: string;
}

export interface CustomerRecord {
  company: string;
  code: string;
  name: string;
  shortName: string;
  type: string;
  group: string;
  tin: string;
  vatNumber: string;
  vatStatus: string;
  whtStatus: string;
  currency: string;
  paymentTerm: string;
  receivableAccount: string;
  advanceAccount: string;
  creditLimit: number;
  creditRisk: string;
  creditHold: string;
  creditHoldReason: string;
  activeStatus: string;
  approvalStatus: string;
  balance: number;
  city: string;
  phone: string;
  email: string;
}

// 20+ Realistic Ethiopian Suppliers
export const INITIAL_SUPPLIERS: SupplierRecord[] = [
  { company: 'QM-ABC', code: 'SUPP-001', name: 'Nile Petroleum PLC', shortName: 'Nile Pet', type: 'Goods Supplier', group: 'Local Supplier', tin: '0012457890', vatNumber: 'VAT-4578-EE', vatStatus: 'VAT Registered', whtStatus: 'Withholding Applicable', currency: 'ETB', paymentTerm: 'Net 30 Days', payableAccount: '2110 (Trade Payables)', advanceAccount: '2120 (Supplier Advances)', bankName: 'Awash Bank', bankBranch: 'Bole', bankAccount: '10123567894', beneficiaryName: 'Nile Petroleum PLC', matchingType: 'Three-Way Matching', paymentHold: 'No Hold', paymentHoldReason: '', activeStatus: 'Active', approvalStatus: 'Approved', balance: 3450000, city: 'Addis Ababa', phone: '+251116612233', email: 'info@nilepetroleum.com' },
  { company: 'QM-ABC', code: 'SUPP-002', name: 'Ethiopian Electric Power (EEP)', shortName: 'EEP', type: 'Utility Supplier', group: 'Utility Supplier', tin: '0003445582', vatNumber: 'VAT-1234-UP', vatStatus: 'VAT Registered', whtStatus: 'Withholding Exempt', currency: 'ETB', paymentTerm: 'Immediate', payableAccount: '2110 (Trade Payables)', advanceAccount: '2120 (Supplier Advances)', bankName: 'Commercial Bank of Ethiopia (CBE)', bankBranch: 'Gg-5', bankAccount: '100012345678', beneficiaryName: 'Ethiopian Electric Power', matchingType: 'No Matching Required', paymentHold: 'No Hold', paymentHoldReason: '', activeStatus: 'Active', approvalStatus: 'Approved', balance: 125000, city: 'Addis Ababa', phone: '+251111553311', email: 'billing@eep.gov.et' },
  { company: 'QM-ABC', code: 'SUPP-003', name: 'Ethio Telecom HQ', shortName: 'EthioTel', type: 'Utility Supplier', group: 'Utility Supplier', tin: '0004561234', vatNumber: 'VAT-9012-UT', vatStatus: 'VAT Registered', whtStatus: 'Withholding Exempt', currency: 'ETB', paymentTerm: 'Immediate', payableAccount: '2110 (Trade Payables)', advanceAccount: '2120 (Supplier Advances)', bankName: 'Commercial Bank of Ethiopia (CBE)', bankBranch: 'Sarbet', bankAccount: '100088992233', beneficiaryName: 'Ethio Telecom', matchingType: 'No Matching Required', paymentHold: 'No Hold', paymentHoldReason: '', activeStatus: 'Active', approvalStatus: 'Approved', balance: 450000, city: 'Addis Ababa', phone: '+251911202020', email: 'corporate.billing@ethiotelecom.et' },
  { company: 'QM-ABC', code: 'SUPP-004', name: 'National Oil Ethiopia (NOC)', shortName: 'NOC', type: 'Goods Supplier', group: 'Local Supplier', tin: '0002135467', vatNumber: 'VAT-3421-EE', vatStatus: 'VAT Registered', whtStatus: 'Withholding Applicable', currency: 'ETB', paymentTerm: 'Net 15 Days', payableAccount: '2110 (Trade Payables)', advanceAccount: '2120 (Supplier Advances)', bankName: 'Dashen Bank', bankBranch: 'Stadium', bankAccount: '50124578964', beneficiaryName: 'National Oil Ethiopia LLC', matchingType: 'Three-Way Matching', paymentHold: 'No Hold', paymentHoldReason: '', activeStatus: 'Active', approvalStatus: 'Approved', balance: 1850000, city: 'Addis Ababa', phone: '+251115510022', email: 'sales@noc.com.et' },
  { company: 'QM-ABC', code: 'SUPP-005', name: 'Yetebaberut Petroleum (YBP)', shortName: 'YBP', type: 'Goods Supplier', group: 'Local Supplier', tin: '0021458902', vatNumber: 'VAT-5544-Y', vatStatus: 'VAT Registered', whtStatus: 'Withholding Applicable', currency: 'ETB', paymentTerm: 'Net 30 Days', payableAccount: '2110 (Trade Payables)', advanceAccount: '2120 (Supplier Advances)', bankName: 'Bank of Abyssinia', bankBranch: 'Megenagna', bankAccount: '2234125647', beneficiaryName: 'Yetebaberut Petroleum Share Co.', matchingType: 'Three-Way Matching', paymentHold: 'No Hold', paymentHoldReason: '', activeStatus: 'Active', approvalStatus: 'Approved', balance: 890000, city: 'Addis Ababa', phone: '+251116631122', email: 'finance@ybp.com.et' },
  { company: 'QM-ABC', code: 'SUPP-006', name: 'Guna Trading House PLC', shortName: 'Guna', type: 'Goods Supplier', group: 'Goods Supplier', tin: '0001004512', vatNumber: 'VAT-6622-G', vatStatus: 'VAT Registered', whtStatus: 'Withholding Applicable', currency: 'ETB', paymentTerm: 'Net 45 Days', payableAccount: '2110 (Trade Payables)', advanceAccount: '2120 (Supplier Advances)', bankName: 'Wegagen Bank', bankBranch: 'Head Office', bankAccount: '3321554678', beneficiaryName: 'Guna Trading House', matchingType: 'Two-Way Matching', paymentHold: 'No Hold', paymentHoldReason: '', activeStatus: 'Active', approvalStatus: 'Approved', balance: 1204000, city: 'Mekelle', phone: '+251344400123', email: 'import@gunatrading.com' },
  { company: 'QM-ABC', code: 'SUPP-007', name: 'Amhara Building Construction Corp', shortName: 'ABCC', type: 'Contractor', group: 'Fixed Asset Supplier', tin: '0015487596', vatNumber: 'VAT-8844-A', vatStatus: 'VAT Registered', whtStatus: 'Withholding Applicable', currency: 'ETB', paymentTerm: 'Net 60 Days', payableAccount: '2110 (Trade Payables)', advanceAccount: '2120 (Supplier Advances)', bankName: 'Commercial Bank of Ethiopia (CBE)', bankBranch: 'Bahir Dar Main', bankAccount: '100067854611', beneficiaryName: 'Amhara Building Construction Corp', matchingType: 'Three-Way Matching', paymentHold: 'No Hold', paymentHoldReason: '', activeStatus: 'Active', approvalStatus: 'Approved', balance: 4500000, city: 'Bahir Dar', phone: '+251582201122', email: 'info@abcc.com' },
  { company: 'QM-ABC', code: 'SUPP-008', name: 'Oromia Water Works Construction', shortName: 'OWWCE', type: 'Contractor', group: 'Fixed Asset Supplier', tin: '0024567822', vatNumber: 'VAT-1211-O', vatStatus: 'VAT Registered', whtStatus: 'Withholding Applicable', currency: 'ETB', paymentTerm: 'Net 30 Days', payableAccount: '2110 (Trade Payables)', advanceAccount: '2120 (Supplier Advances)', bankName: 'Cooperative Bank of Oromia', bankBranch: 'Finfinnee', bankAccount: '100030040050', beneficiaryName: 'Oromia Water Works Enterprise', matchingType: 'Three-Way Matching', paymentHold: 'No Hold', paymentHoldReason: '', activeStatus: 'Active', approvalStatus: 'Approved', balance: 290000, city: 'Addis Ababa', phone: '+251115570809', email: 'owwce@oromia.gov.et' },
  { company: 'QM-ABC', code: 'SUPP-009', name: 'Habesha Breweries Share Co.', shortName: 'Habesha', type: 'Goods Supplier', group: 'Goods Supplier', tin: '0032541178', vatNumber: 'VAT-8080-H', vatStatus: 'VAT Registered', whtStatus: 'Withholding Applicable', currency: 'ETB', paymentTerm: 'Net 15 Days', payableAccount: '2110 (Trade Payables)', advanceAccount: '2120 (Supplier Advances)', bankName: 'Commercial Bank of Ethiopia (CBE)', bankBranch: 'Debre Birhan', bankAccount: '100054321654', beneficiaryName: 'Habesha Breweries S.C.', matchingType: 'Two-Way Matching', paymentHold: 'No Hold', paymentHoldReason: '', activeStatus: 'Active', approvalStatus: 'Approved', balance: 0, city: 'Debre Birhan', phone: '+251116675402', email: 'procurement@habeshabreweries.com' },
  { company: 'QM-ABC', code: 'SUPP-010', name: 'Horizon Plantations PLC', shortName: 'Horizon', type: 'Goods Supplier', group: 'Goods Supplier', tin: '0041154562', vatNumber: 'VAT-9034-P', vatStatus: 'VAT Registered', whtStatus: 'Withholding Applicable', currency: 'ETB', paymentTerm: 'Net 30 Days', payableAccount: '2110 (Trade Payables)', advanceAccount: '2120 (Supplier Advances)', bankName: 'Bank of Abyssinia', bankBranch: 'Kazanchis', bankAccount: '1122334455', beneficiaryName: 'Horizon Plantations PLC', matchingType: 'Three-Way Matching', paymentHold: 'No Hold', paymentHoldReason: '', activeStatus: 'Active', approvalStatus: 'Approved', balance: 135000, city: 'Addis Ababa', phone: '+251115543322', email: 'finance@horizonplantations.com' },
  { company: 'QM-ABC', code: 'SUPP-011', name: 'Muger Cement Enterprise', shortName: 'Muger', type: 'Goods Supplier', group: 'Local Supplier', tin: '0000102546', vatNumber: 'VAT-2345-C', vatStatus: 'VAT Registered', whtStatus: 'Withholding Exempt', currency: 'ETB', paymentTerm: 'Immediate', payableAccount: '2110 (Trade Payables)', advanceAccount: '2120 (Supplier Advances)', bankName: 'Commercial Bank of Ethiopia (CBE)', bankBranch: 'Muger', bankAccount: '100011223344', beneficiaryName: 'Muger Cement Enterprise', matchingType: 'Three-Way Matching', paymentHold: 'No Hold', paymentHoldReason: '', activeStatus: 'Active', approvalStatus: 'Approved', balance: 670000, city: 'Muger', phone: '+251112360010', email: 'support@mugercement.com.et' },
  { company: 'QM-ABC', code: 'SUPP-012', name: 'Derba Midroc Cement PLC', shortName: 'Derba', type: 'Goods Supplier', group: 'Local Supplier', tin: '0021548722', vatNumber: 'VAT-9876-DM', vatStatus: 'VAT Registered', whtStatus: 'Withholding Applicable', currency: 'ETB', paymentTerm: 'Net 15 Days', payableAccount: '2110 (Trade Payables)', advanceAccount: '2120 (Supplier Advances)', bankName: 'Dashen Bank', bankBranch: 'Derba', bankAccount: '51104578112', beneficiaryName: 'Derba Midroc Cement PLC', matchingType: 'Three-Way Matching', paymentHold: 'No Hold', paymentHoldReason: '', activeStatus: 'Active', approvalStatus: 'Approved', balance: 0, city: 'Derba', phone: '+251115549889', email: 'info@derbacement.com' },
  { company: 'QM-ABC', code: 'SUPP-013', name: 'Messebo Cement Enterprise', shortName: 'Messebo', type: 'Goods Supplier', group: 'Local Supplier', tin: '0003456722', vatNumber: 'VAT-4455-M', vatStatus: 'VAT Registered', whtStatus: 'Withholding Applicable', currency: 'ETB', paymentTerm: 'Net 30 Days', payableAccount: '2110 (Trade Payables)', advanceAccount: '2120 (Supplier Advances)', bankName: 'Wegagen Bank', bankBranch: 'Mekelle Main', bankAccount: '3341258966', beneficiaryName: 'Messebo Cement Share Co.', matchingType: 'Three-Way Matching', paymentHold: 'No Hold', paymentHoldReason: '', activeStatus: 'Active', approvalStatus: 'Approved', balance: 80000, city: 'Mekelle', phone: '+251344405800', email: 'finance@messebo.com' },
  { company: 'QM-ABC', code: 'SUPP-014', name: 'Kaliti Metal Products Share Co.', shortName: 'Kaliti Metal', type: 'Goods Supplier', group: 'Local Supplier', tin: '0001054366', vatNumber: 'VAT-1122-KM', vatStatus: 'VAT Registered', whtStatus: 'Withholding Applicable', currency: 'ETB', paymentTerm: 'Net 30 Days', payableAccount: '2110 (Trade Payables)', advanceAccount: '2120 (Supplier Advances)', bankName: 'Commercial Bank of Ethiopia (CBE)', bankBranch: 'Kaliti', bankAccount: '100067453412', beneficiaryName: 'Kaliti Metal Products S.C.', matchingType: 'Three-Way Matching', paymentHold: 'Hold Payment', paymentHoldReason: 'TIN verification pending renewal', activeStatus: 'Active', approvalStatus: 'Approved', balance: 420000, city: 'Addis Ababa', phone: '+251114340110', email: 'info@kalitimetal.com' },
  { company: 'QM-ABC', code: 'SUPP-015', name: 'Akaki Garment Share Co.', shortName: 'Akaki Garment', type: 'Goods Supplier', group: 'Goods Supplier', tin: '0054231178', vatNumber: 'VAT-7070-AG', vatStatus: 'VAT Registered', whtStatus: 'Withholding Applicable', currency: 'ETB', paymentTerm: 'Net 45 Days', payableAccount: '2110 (Trade Payables)', advanceAccount: '2120 (Supplier Advances)', bankName: 'Commercial Bank of Ethiopia (CBE)', bankBranch: 'Akaki', bankAccount: '100098453421', beneficiaryName: 'Akaki Garment Share Co.', matchingType: 'Two-Way Matching', paymentHold: 'No Hold', paymentHoldReason: '', activeStatus: 'Active', approvalStatus: 'Approved', balance: 130000, city: 'Addis Ababa', phone: '+251114340445', email: 'akakigarment@ethionet.et' },
  { company: 'QM-ABC', code: 'SUPP-016', name: 'Teklehaimanot General Hospital', shortName: 'TGH', type: 'Service Supplier', group: 'Service Supplier', tin: '0012543698', vatNumber: 'VAT-4411-T', vatStatus: 'VAT Exempt', whtStatus: 'Withholding Applicable', currency: 'ETB', paymentTerm: 'Net 15 Days', payableAccount: '2110 (Trade Payables)', advanceAccount: '2120 (Supplier Advances)', bankName: 'Awash Bank', bankBranch: 'Teklehaimanot', bankAccount: '10123547895', beneficiaryName: 'Teklehaimanot Hospital PLC', matchingType: 'No Matching Required', paymentHold: 'No Hold', paymentHoldReason: '', activeStatus: 'Active', approvalStatus: 'Approved', balance: 95000, city: 'Addis Ababa', phone: '+251111562211', email: 'billing@tghospital.com' },
  { company: 'QM-ABC', code: 'SUPP-017', name: 'Shalit Trading PLC', shortName: 'Shalit', type: 'Goods Supplier', group: 'Goods Supplier', tin: '0062453698', vatNumber: 'VAT-8877-S', vatStatus: 'VAT Registered', whtStatus: 'Withholding Applicable', currency: 'USD', paymentTerm: 'Advance Payment', payableAccount: '2110 (Trade Payables)', advanceAccount: '2120 (Supplier Advances)', bankName: 'Commercial Bank of Ethiopia (CBE)', bankBranch: 'International', bankAccount: '1000987654321', beneficiaryName: 'Shalit Trading PLC', matchingType: 'Three-Way Matching', paymentHold: 'No Hold', paymentHoldReason: '', activeStatus: 'Active', approvalStatus: 'Approved', balance: 0, city: 'Addis Ababa', phone: '+251116639900', email: 'import@shalit.com' },
  { company: 'QM-ABC', code: 'SUPP-018', name: 'Global Tech Consulting Group', shortName: 'GlobalTech', type: 'Consultant', group: 'Service Supplier', tin: '0021458933', vatNumber: 'VAT-2311-GT', vatStatus: 'VAT Registered', whtStatus: 'Withholding Applicable', currency: 'ETB', paymentTerm: 'Net 30 Days', payableAccount: '2110 (Trade Payables)', advanceAccount: '2120 (Supplier Advances)', bankName: 'Bank of Abyssinia', bankBranch: 'Bole Medhanealem', bankAccount: '22345511', beneficiaryName: 'Global Tech Consulting Group', matchingType: 'No Matching Required', paymentHold: 'No Hold', paymentHoldReason: '', activeStatus: 'Active', approvalStatus: 'Approved', balance: 180000, city: 'Addis Ababa', phone: '+251116674400', email: 'consulting@globaltech.com' },
  { company: 'QM-ABC', code: 'SUPP-019', name: 'Ethiopian Airlines Group PLC', shortName: 'EAL', type: 'Service Supplier', group: 'Utility Supplier', tin: '0000100254', vatNumber: 'VAT-9000-EA', vatStatus: 'VAT Registered', whtStatus: 'Withholding Exempt', currency: 'ETB', paymentTerm: 'Net 15 Days', payableAccount: '2110 (Trade Payables)', advanceAccount: '2120 (Supplier Advances)', bankName: 'Commercial Bank of Ethiopia (CBE)', bankBranch: 'EAL Branch', bankAccount: '100022334455', beneficiaryName: 'Ethiopian Airlines Group', matchingType: 'No Matching Required', paymentHold: 'No Hold', paymentHoldReason: '', activeStatus: 'Active', approvalStatus: 'Approved', balance: 1450000, city: 'Addis Ababa', phone: '+251116179900', email: 'corporate_sales@ethiopianairlines.com' },
  { company: 'QM-ABC', code: 'SUPP-020', name: 'BGI Ethiopia Share Company', shortName: 'BGI', type: 'Goods Supplier', group: 'Goods Supplier', tin: '0000109923', vatNumber: 'VAT-5544-B', vatStatus: 'VAT Registered', whtStatus: 'Withholding Applicable', currency: 'ETB', paymentTerm: 'Net 30 Days', payableAccount: '2110 (Trade Payables)', advanceAccount: '2120 (Supplier Advances)', bankName: 'Awash Bank', bankBranch: 'Mexico', bankAccount: '10122244551', beneficiaryName: 'BGI Ethiopia Share Co.', matchingType: 'Two-Way Matching', paymentHold: 'No Hold', paymentHoldReason: '', activeStatus: 'Active', approvalStatus: 'Approved', balance: 0, city: 'Addis Ababa', phone: '+251115518022', email: 'distributors@bgiethiopia.com' },
  { company: 'QM-ABC', code: 'SUPP-021', name: 'Mayer Crane and Rigging PLC', shortName: 'Mayer', type: 'Contractor', group: 'Service Supplier', tin: '0041257896', vatNumber: 'VAT-8844-M', vatStatus: 'VAT Registered', whtStatus: 'Withholding Applicable', currency: 'ETB', paymentTerm: 'Net 30 Days', payableAccount: '2110 (Trade Payables)', advanceAccount: '2120 (Supplier Advances)', bankName: 'Dashen Bank', bankBranch: 'Kaliti', bankAccount: '5012589004', beneficiaryName: 'Mayer Crane & Rigging', matchingType: 'Two-Way Matching', paymentHold: 'No Hold', paymentHoldReason: '', activeStatus: 'Active', approvalStatus: 'Approved', balance: 500000, city: 'Addis Ababa', phone: '+251114349911', email: 'ops@mayerheavylift.com' }
];

// 20+ Realistic Ethiopian Customers
export const INITIAL_CUSTOMERS: CustomerRecord[] = [
  { company: 'QM-ABC', code: 'CUST-001', name: 'Qelem Education PLC', shortName: 'Qelem Ed', type: 'Company', group: 'Corporate Customer', tin: '0041234567', vatNumber: 'VAT-1234-QE', vatStatus: 'VAT Registered', whtStatus: 'Withholding Applicable', currency: 'ETB', paymentTerm: 'Net 30 Days', receivableAccount: '1120 (Trade Receivables)', advanceAccount: '1130 (Customer Advances)', creditLimit: 2500000, creditRisk: 'Low', creditHold: 'No Hold', creditHoldReason: '', activeStatus: 'Active', approvalStatus: 'Approved', balance: 1450000, city: 'Addis Ababa', phone: '+251116123456', email: 'finance@qelemedu.com' },
  { company: 'QM-ABC', code: 'CUST-002', name: 'Midroc Investment Group', shortName: 'Midroc', type: 'Company', group: 'Corporate Customer', tin: '0000105432', vatNumber: 'VAT-9087-MI', vatStatus: 'VAT Registered', whtStatus: 'Withholding Applicable', currency: 'ETB', paymentTerm: 'Net 45 Days', receivableAccount: '1120 (Trade Receivables)', advanceAccount: '1130 (Customer Advances)', creditLimit: 12000000, creditRisk: 'Low', creditHold: 'No Hold', creditHoldReason: '', activeStatus: 'Active', approvalStatus: 'Approved', balance: 5400000, city: 'Addis Ababa', phone: '+251115514422', email: 'info@midrocgroup.et' },
  { company: 'QM-ABC', code: 'CUST-003', name: 'Sunshine Construction PLC', shortName: 'Sunshine', type: 'Company', group: 'Corporate Customer', tin: '0012457801', vatNumber: 'VAT-7856-SC', vatStatus: 'VAT Registered', whtStatus: 'Withholding Applicable', currency: 'ETB', paymentTerm: 'Net 30 Days', receivableAccount: '1120 (Trade Receivables)', advanceAccount: '1130 (Customer Advances)', creditLimit: 5000000, creditRisk: 'Medium', creditHold: 'No Hold', creditHoldReason: '', activeStatus: 'Active', approvalStatus: 'Approved', balance: 2850000, city: 'Addis Ababa', phone: '+251116613300', email: 'billing@sunshinecon.com' },
  { company: 'QM-ABC', code: 'CUST-004', name: 'GAD Construction PLC', shortName: 'GADCon', type: 'Company', group: 'Local Customer', tin: '0021543689', vatNumber: 'VAT-5522-GC', vatStatus: 'VAT Registered', whtStatus: 'Withholding Applicable', currency: 'ETB', paymentTerm: 'Net 30 Days', receivableAccount: '1120 (Trade Receivables)', advanceAccount: '1130 (Customer Advances)', creditLimit: 3000000, creditRisk: 'Medium', creditHold: 'No Hold', creditHoldReason: '', activeStatus: 'Active', approvalStatus: 'Approved', balance: 1100000, city: 'Adama', phone: '+251221113322', email: 'gadcon@gmail.com' },
  { company: 'QM-ABC', code: 'CUST-005', name: 'Tekleberhan Hambissa & Sons', shortName: 'TekHamb', type: 'Company', group: 'Local Customer', tin: '0032541162', vatNumber: 'VAT-4455-TH', vatStatus: 'VAT Registered', whtStatus: 'Withholding Applicable', currency: 'ETB', paymentTerm: 'Net 15 Days', receivableAccount: '1120 (Trade Receivables)', advanceAccount: '1130 (Customer Advances)', creditLimit: 1500000, creditRisk: 'High', creditHold: 'Warning Only', creditHoldReason: 'Repeated late payments on past-due invoices', activeStatus: 'Active', approvalStatus: 'Approved', balance: 1350000, city: 'Adama', phone: '+251221156644', email: 'thambissa@hambissa.com' },
  { company: 'QM-ABC', code: 'CUST-006', name: 'Zamra Construction PLC', shortName: 'Zamra', type: 'Company', group: 'Corporate Customer', tin: '0021546733', vatNumber: 'VAT-8844-ZC', vatStatus: 'VAT Registered', whtStatus: 'Withholding Applicable', currency: 'ETB', paymentTerm: 'Net 45 Days', receivableAccount: '1120 (Trade Receivables)', advanceAccount: '1130 (Customer Advances)', creditLimit: 4000000, creditRisk: 'Medium', creditHold: 'No Hold', creditHoldReason: '', activeStatus: 'Active', approvalStatus: 'Approved', balance: 120000, city: 'Addis Ababa', phone: '+251114402631', email: ' zamraconst@ethionet.et' },
  { company: 'QM-ABC', code: 'CUST-007', name: 'Berhanena Selam Printing Enterprise', shortName: 'BSPE', type: 'Government', group: 'Government Customer', tin: '0000201145', vatNumber: 'VAT-1010-BS', vatStatus: 'VAT Registered', whtStatus: 'Withholding Exempt', currency: 'ETB', paymentTerm: 'Immediate', receivableAccount: '1120 (Trade Receivables)', advanceAccount: '1130 (Customer Advances)', creditLimit: 8000000, creditRisk: 'Low', creditHold: 'No Hold', creditHoldReason: '', activeStatus: 'Active', approvalStatus: 'Approved', balance: 640000, city: 'Addis Ababa', phone: '+251111553155', email: 'bspe@telecom.net.et' },
  { company: 'QM-ABC', code: 'CUST-008', name: 'Addis Ababa University', shortName: 'AAU', type: 'Government', group: 'Government Customer', tin: '0000100456', vatNumber: 'VAT-9993-AA', vatStatus: 'VAT Exempt', whtStatus: 'Withholding Exempt', currency: 'ETB', paymentTerm: 'Net 30 Days', receivableAccount: '1120 (Trade Receivables)', advanceAccount: '1130 (Customer Advances)', creditLimit: 10000000, creditRisk: 'Low', creditHold: 'No Hold', creditHoldReason: '', activeStatus: 'Active', approvalStatus: 'Approved', balance: 3500000, city: 'Addis Ababa', phone: '+251111239700', email: 'finance@aau.edu.et' },
  { company: 'QM-ABC', code: 'CUST-009', name: 'Ethiopian Shipping & Logistics', shortName: 'ESLSE', type: 'Government', group: 'Government Customer', tin: '0000215433', vatNumber: 'VAT-3421-SL', vatStatus: 'VAT Registered', whtStatus: 'Withholding Exempt', currency: 'ETB', paymentTerm: 'Immediate', receivableAccount: '1120 (Trade Receivables)', advanceAccount: '1130 (Customer Advances)', creditLimit: 15000000, creditRisk: 'Low', creditHold: 'No Hold', creditHoldReason: '', activeStatus: 'Active', approvalStatus: 'Approved', balance: 1200000, city: 'Addis Ababa', phone: '+251115518200', email: 'finance@eslse.et' },
  { company: 'QM-ABC', code: 'CUST-010', name: 'Sugar Corporation of Ethiopia', shortName: 'SugarCorp', type: 'Government', group: 'Government Customer', tin: '0000325411', vatNumber: 'VAT-4040-SC', vatStatus: 'VAT Registered', whtStatus: 'Withholding Exempt', currency: 'ETB', paymentTerm: 'Net 30 Days', receivableAccount: '1120 (Trade Receivables)', advanceAccount: '1130 (Customer Advances)', creditLimit: 6000000, creditRisk: 'Medium', creditHold: 'No Hold', creditHoldReason: '', activeStatus: 'Active', approvalStatus: 'Approved', balance: 340000, city: 'Addis Ababa', phone: '+251115510002', email: 'sugarcorp@ethiopia.gov.et' },
  { company: 'QM-ABC', code: 'CUST-011', name: 'Metal and Engineering Corp (METEC)', shortName: 'METEC', type: 'Government', group: 'Government Customer', tin: '0000302546', vatNumber: 'VAT-5544-ME', vatStatus: 'VAT Registered', whtStatus: 'Withholding Exempt', currency: 'ETB', paymentTerm: 'Net 45 Days', receivableAccount: '1120 (Trade Receivables)', advanceAccount: '1130 (Customer Advances)', creditLimit: 20000000, creditRisk: 'Critical', creditHold: 'Full Credit Block', creditHoldReason: 'Ongoing legal and restructuring hold. Long outstanding debit aging.', activeStatus: 'Active', approvalStatus: 'Approved', balance: 2450000, city: 'Addis Ababa', phone: '+251116450000', email: 'contact@metec.gov.et' },
  { company: 'QM-ABC', code: 'CUST-012', name: 'Addis Pharmacy PLC', shortName: 'AddisPharma', type: 'Company', group: 'Local Customer', tin: '0015481177', vatNumber: 'VAT-9034-AP', vatStatus: 'VAT Exempt', whtStatus: 'Withholding Applicable', currency: 'ETB', paymentTerm: 'Net 15 Days', receivableAccount: '1120 (Trade Receivables)', advanceAccount: '1130 (Customer Advances)', creditLimit: 800000, creditRisk: 'High', creditHold: 'Hold New Invoice', creditHoldReason: 'Unsettled older invoices beyond 90 days', activeStatus: 'Active', approvalStatus: 'Approved', balance: 950000, city: 'Addis Ababa', phone: '+251111568211', email: 'info@addispharmacy.com' },
  { company: 'QM-ABC', code: 'CUST-013', name: 'Hilina Enriched Foods', shortName: 'Hilina Foods', type: 'Company', group: 'Corporate Customer', tin: '0032546682', vatNumber: 'VAT-1122-HE', vatStatus: 'VAT Registered', whtStatus: 'Withholding Applicable', currency: 'ETB', paymentTerm: 'Net 30 Days', receivableAccount: '1120 (Trade Receivables)', advanceAccount: '1130 (Customer Advances)', creditLimit: 4500000, creditRisk: 'Low', creditHold: 'No Hold', creditHoldReason: '', activeStatus: 'Active', approvalStatus: 'Approved', balance: 800000, city: 'Addis Ababa', phone: '+251114392233', email: 'finance@hilinaenrichedfoods.com' },
  { company: 'QM-ABC', code: 'CUST-014', name: 'Faffa Food Share Company', shortName: 'Faffa', type: 'Company', group: 'Corporate Customer', tin: '0000102311', vatNumber: 'VAT-4455-FF', vatStatus: 'VAT Registered', whtStatus: 'Withholding Applicable', currency: 'ETB', paymentTerm: 'Net 30 Days', receivableAccount: '1120 (Trade Receivables)', advanceAccount: '1130 (Customer Advances)', creditLimit: 3500050, creditRisk: 'Medium', creditHold: 'No Hold', creditHoldReason: '', activeStatus: 'Active', approvalStatus: 'Approved', balance: 250000, city: 'Addis Ababa', phone: '+251114390150', email: 'sales@faffafoods.com' },
  { company: 'QM-ABC', code: 'CUST-015', name: 'Shoa Supermarket Share Co.', shortName: 'Shoa', type: 'Company', group: 'Retail Customer', tin: '0012543369', vatNumber: 'VAT-7080-SH', vatStatus: 'VAT Registered', whtStatus: 'Withholding Applicable', currency: 'ETB', paymentTerm: 'Net 15 Days', receivableAccount: '1120 (Trade Receivables)', advanceAccount: '1130 (Customer Advances)', creditLimit: 1200000, creditRisk: 'Medium', creditHold: 'No Hold', creditHoldReason: '', activeStatus: 'Active', approvalStatus: 'Approved', balance: 410000, city: 'Addis Ababa', phone: '+251115523311', email: 'billing@shoasupermarket.com' },
  { company: 'QM-ABC', code: 'CUST-016', name: 'Friendship City Center', shortName: 'Friendship', type: 'Company', group: 'Corporate Customer', tin: '0021458925', vatNumber: 'VAT-9090-FC', vatStatus: 'VAT Registered', whtStatus: 'Withholding Applicable', currency: 'ETB', paymentTerm: 'Net 30 Days', receivableAccount: '1120 (Trade Receivables)', advanceAccount: '1130 (Customer Advances)', creditLimit: 2000000, creditRisk: 'Medium', creditHold: 'No Hold', creditHoldReason: '', activeStatus: 'Active', approvalStatus: 'Approved', balance: 150000, city: 'Addis Ababa', phone: '+251116628422', email: 'leasing@friendshiptele.et' },
  { company: 'QM-ABC', code: 'CUST-017', name: 'Century Mall AA Share Co.', shortName: 'Century', type: 'Company', group: 'Corporate Customer', tin: '0031548812', vatNumber: 'VAT-8844-CM', vatStatus: 'VAT Registered', whtStatus: 'Withholding Applicable', currency: 'ETB', paymentTerm: 'Net 30 Days', receivableAccount: '1120 (Trade Receivables)', advanceAccount: '1130 (Customer Advances)', creditLimit: 2500000, creditRisk: 'Medium', creditHold: 'No Hold', creditHoldReason: '', activeStatus: 'Active', approvalStatus: 'Approved', balance: 0, city: 'Addis Ababa', phone: '+251116671040', email: 'accounts@centuryethiopia.com' },
  { company: 'QM-ABC', code: 'CUST-018', name: 'Ethiopian Insurance Corporation', shortName: 'EIC', type: 'Company', group: 'Corporate Customer', tin: '0000100344', vatNumber: 'VAT-3400-EI', vatStatus: 'VAT Registered', whtStatus: 'Withholding Exempt', currency: 'ETB', paymentTerm: 'Net 45 Days', receivableAccount: '1120 (Trade Receivables)', advanceAccount: '1130 (Customer Advances)', creditLimit: 8000000, creditRisk: 'Low', creditHold: 'No Hold', creditHoldReason: '', activeStatus: 'Active', approvalStatus: 'Approved', balance: 135000, city: 'Addis Ababa', phone: '+251115512400', email: 'eic.finance@eic.com.et' },
  { company: 'QM-ABC', code: 'CUST-019', name: 'Awash Wine Share Company', shortName: 'AwashWine', type: 'Company', group: 'Corporate Customer', tin: '0000102588', vatNumber: 'VAT-6677-AW', vatStatus: 'VAT Registered', whtStatus: 'Withholding Applicable', currency: 'ETB', paymentTerm: 'Net 30 Days', receivableAccount: '1120 (Trade Receivables)', advanceAccount: '1130 (Customer Advances)', creditLimit: 4000000, creditRisk: 'Low', creditHold: 'No Hold', creditHoldReason: '', activeStatus: 'Active', approvalStatus: 'Approved', balance: 420000, city: 'Addis Ababa', phone: '+251112753300', email: 'billing@awashwine.com' },
  { company: 'QM-ABC', code: 'CUST-020', name: 'Gullele Garment Share Co.', shortName: 'Gullele', type: 'Company', group: 'Local Customer', tin: '0041258921', vatNumber: 'VAT-1212-GG', vatStatus: 'VAT Registered', whtStatus: 'Withholding Applicable', currency: 'ETB', paymentTerm: 'Net 30 Days', receivableAccount: '1120 (Trade Receivables)', advanceAccount: '1130 (Customer Advances)', creditLimit: 2000000, creditRisk: 'High', creditHold: 'No Hold', creditHoldReason: '', activeStatus: 'Active', approvalStatus: 'Approved', balance: 1540000, city: 'Addis Ababa', phone: '+251111560020', email: 'gullelegarment@ethionet.et' },
  { company: 'QM-ABC', code: 'CUST-021', name: 'Abay Logistics PLC', shortName: 'AbayLog', type: 'Company', group: 'Corporate Customer', tin: '0041548235', vatNumber: 'VAT-4488-AL', vatStatus: 'VAT Registered', whtStatus: 'Withholding Applicable', currency: 'ETB', paymentTerm: 'Net 30 Days', receivableAccount: '1120 (Trade Receivables)', advanceAccount: '1130 (Customer Advances)', creditLimit: 3000000, creditRisk: 'Medium', creditHold: 'No Hold', creditHoldReason: '', activeStatus: 'Active', approvalStatus: 'Approved', balance: 200000, city: 'Bahir Dar', phone: '+251582260405', email: 'billing@abaylogistics.com' }
];

export interface FieldSpec {
  page: string;
  section: string;
  name: string;
  key: string;
  type: string;
  ctrlType: string;
  req: boolean;
  editable: boolean;
  defVal: string;
  validation: string;
  expVal: string;
}

export const FIELD_SPECS: FieldSpec[] = [
  { page: 'Supplier Form', section: 'Identity', name: 'Company / Legal Entity', key: 'company', type: 'String', ctrlType: 'Dropdown / Select', req: true, editable: true, defVal: 'QM-ABC', validation: 'Must match valid operating ledger company entity.', expVal: 'QM-ABC' },
  { page: 'Supplier Form', section: 'Identity', name: 'Branch', key: 'branch', type: 'String', ctrlType: 'Dropdown / Select', req: true, editable: true, defVal: 'AA-01', validation: 'Must select registered branch code.', expVal: 'AA-01 (Addis Ababa Branch)' },
  { page: 'Supplier Form', section: 'Identity', name: 'Supplier Code', key: 'code', type: 'String', ctrlType: 'Text Input', req: true, editable: false, defVal: 'SUPP-Auto', validation: 'Unique code auto-generated based on group prefix.', expVal: 'SUPP-022' },
  { page: 'Supplier Form', section: 'Identity', name: 'Supplier Name', key: 'name', type: 'String', ctrlType: 'Text Input', req: true, editable: true, defVal: '', validation: 'Capitalized, up to 150 characters, no special characters.', expVal: 'Ambassador Garment PLC' },
  { page: 'Supplier Form', section: 'Identity', name: 'Taxpayer TIN', key: 'tin', type: 'String', ctrlType: 'Text Input', req: true, editable: true, defVal: '', validation: 'Strictly 10 numeric digits. Must be unique in database.', expVal: '0041258900' },
  { page: 'Supplier Form', section: 'Address', name: 'Email Address', key: 'email', type: 'String', ctrlType: 'Text Input', req: true, editable: true, defVal: '', validation: 'Valid email syntax matching /@.+\\../', expVal: 'finance@supplier.com' },
  { page: 'Supplier Form', section: 'Accounting', name: 'Payable Control Account', key: 'payableAccount', type: 'String', ctrlType: 'Dropdown / Select', req: true, editable: true, defVal: '2110 (Trade Payables)', validation: 'Must map to valid active control Account in COA.', expVal: '2110 (Trade Payables)' },
  { page: 'Supplier Form', section: 'Compliance', name: 'VAT Registration Number', key: 'vatNumber', type: 'String', ctrlType: 'Text Input', req: false, editable: true, defVal: '', validation: 'Required if VAT Registered state toggled. Alphanumeric.', expVal: 'VAT-9087-SC' },
  
  { page: 'Customer Form', section: 'Identity', name: 'Customer Code', key: 'code', type: 'String', ctrlType: 'Text Input', req: true, editable: false, defVal: 'CUST-Auto', validation: 'Unique code auto-generated based on group prefix.', expVal: 'CUST-022' },
  { page: 'Customer Form', section: 'Identity', name: 'Customer Name', key: 'name', type: 'String', ctrlType: 'Text Input', req: true, editable: true, defVal: '', validation: 'Up to 150 characters. Capitalized corporate label.', expVal: 'TotalEnergies Ethiopia' },
  { page: 'Customer Form', section: 'Credit Control', name: 'Credit Limit Amount', key: 'creditLimit', type: 'Number', ctrlType: 'Numeric Input', req: true, editable: true, defVal: '0.00', validation: 'Must be positive or zero. Limits total exposure.', expVal: '5000000.00' },
  { page: 'Customer Form', section: 'Compliance', name: 'Ethiopian Tax Category', key: 'taxCategory', type: 'String', ctrlType: 'Dropdown / Select', req: true, editable: true, defVal: 'Category A', validation: 'Category A, Category B, or Category C based on ERCA.', expVal: 'Category A' }
];

export const ENUM_MASTER = [
  { group: 'Supplier Type', visual: 'GOODS_SUPPLIER', name: 'Goods Supplier', desc: 'Provides inventory or raw materials.', def: 'Yes' },
  { group: 'Supplier Type', visual: 'SERVICE_SUPPLIER', name: 'Service Supplier', desc: 'Renders utilities, operations, or non-goods services.', def: 'No' },
  { group: 'Supplier Type', visual: 'CONTRACTOR', name: 'Contractor', desc: 'Long-term building, construction, or installation tasks.', def: 'No' },
  { group: 'Supplier Type', visual: 'CONSULTANT', name: 'Consultant', desc: 'Business expert advice, audit, legal, or IT architecture.', def: 'No' },
  { group: 'Supplier Group', visual: 'LOCAL_SUPPLIER', name: 'Local Supplier', desc: 'Domestic supplier operating in Ethiopia.', def: 'Yes' },
  { group: 'Supplier Group', visual: 'FOREIGN_SUPPLIER', name: 'Foreign Supplier', desc: 'Import vendor requiring letter of credit and forex mapping.', def: 'No' },
  { group: 'Customer Type', visual: 'COMPANY', name: 'Company', desc: 'Corporate legal entity or private limited company PLC.', def: 'Yes' },
  { group: 'Customer Type', visual: 'INDIVIDUAL', name: 'Individual', desc: 'Retail buyer or private citizen.', def: 'No' },
  { group: 'VAT Status', visual: 'VAT_REGISTERED', name: 'VAT Registered', desc: 'Supplier charges 15% VAT, issues official invoice.', def: 'Yes' },
  { group: 'VAT Status', visual: 'VAT_EXEMPT', name: 'VAT Exempt', desc: 'Transactions are exempt under local tax law guidelines.', def: 'No' },
  { group: 'Withholding Status', visual: 'WHT_APPLICABLE', name: 'WHT Applicable', desc: 'Withhold 2% on goods or 3% on services above threshold.', def: 'Yes' },
  { group: 'Withholding Status', visual: 'WHT_EXEMPT', name: 'Withholding Exempt', desc: 'Approved exempt entity by ERCA.', def: 'No' },
  { group: 'Payment Term', visual: 'NET_30', name: 'Net 30 Days', desc: 'Settle invoice balance within 30 days of book date.', def: 'Yes' },
  { group: 'Payment Term', visual: 'IMMEDIATE', name: 'Immediate', desc: 'Due instantly upon invoice submission.', def: 'No' },
  { group: 'Credit Risk Level', visual: 'LOW', name: 'Low', desc: 'Prime status. Settle on time, no overdue balances.', def: 'Yes' },
  { group: 'Credit Risk Level', visual: 'HIGH', name: 'High', desc: 'Often delayed payments. Requires tight review.', def: 'No' },
  { group: 'Credit Hold Status', visual: 'NO_HOLD', name: 'No Hold', desc: 'No transaction restrictions active.', def: 'Yes' },
  { group: 'Credit Hold Status', visual: 'FULL_CREDIT_BLOCK', name: 'Full Credit Block', desc: 'Block sales orders, billing, and deliveries completely.', def: 'No' }
];

export const LOOKUP_MASTER = [
  { name: 'Company / Legal Entity', src: 'companies', purpose: 'Select operating legal framework', keyField: 'code', dispField: 'displayName', req: 'Yes' },
  { name: 'Branch', src: 'branches', purpose: 'Filter operational sites', keyField: 'code', dispField: 'displayName', req: 'Yes' },
  { name: 'Operating Currency', src: 'currencies', purpose: 'Default billing Currency', keyField: 'code', dispField: 'displayName', req: 'Yes' },
  { name: 'Default Tax Code', src: 'tax_codes', purpose: 'Default VAT/WHT calculations', keyField: 'code', dispField: 'displayName', req: 'Yes' },
  { name: 'Preferred Bank', src: 'banks', purpose: 'Supplier payment destination or Customer receipt', keyField: 'code', dispField: 'displayName', req: 'Yes' },
  { name: 'Control GL Account', src: 'gl_accounts', purpose: 'Subledger summary mapping connection to General Ledger', keyField: 'code', dispField: 'displayName', req: 'Yes' }
];

export const LOOKUP_DATA = [
  { group: 'Company', code: 'QMT', name: 'QM-ABC Head Office', desc: 'Primary corporate entity' },
  { group: 'Branch', code: 'AA-01', name: 'Addis Ababa Branch', desc: 'Bole area headquarters' },
  { group: 'Branch', code: 'AD-01', name: 'Adama Branch', desc: 'Adama logistics site' },
  { group: 'Branch', code: 'BD-01', name: 'Bahir Dar Branch', desc: 'Amhara regional hub' },
  { group: 'Branch', code: 'DR-01', name: 'Dire Dawa Branch', desc: 'Eastern free zone terminal' },
  { group: 'Currency', code: 'ETB', name: 'ETB - Ethiopian Birr', desc: 'Local legal currency' },
  { group: 'Currency', code: 'USD', name: 'USD - United States Dollar', desc: 'Foreign conversion rate base' },
  { group: 'Tax Code', code: 'VAT-15', name: 'Standard VAT 15%', desc: '15% on non-exempt transactions' },
  { group: 'Tax Code', code: 'WHT-2', name: 'Withholding 2% (Goods)', desc: '2% withheld for payments above 10,000 ETB' },
  { group: 'Tax Code', code: 'WHT-3', name: 'Withholding 3% (Services)', desc: '3% withheld for payments above 500 ETB' },
  { group: 'Bank', code: 'CBE', name: 'Commercial Bank of Ethiopia (CBE)', desc: 'Largest state-owned bank' },
  { group: 'Bank', code: 'AWASH', name: 'Awash Bank S.C.', desc: 'Leading private commercial bank' },
  { group: 'Bank', code: 'DASHEN', name: 'Dashen Bank S.C.', desc: 'High integration API capability' },
  { group: 'GL Account', code: '1120', name: '1120 (Trade Receivables)', desc: 'Default AR Control' },
  { group: 'GL Account', code: '2110', name: '2110 (Trade Payables)', desc: 'Default AP Control' }
];

export const BACKEND_RULES = [
  { id: 'BR-01', name: 'Supplier Code Uniqueness', desc: 'The system must block creating a supplier with a duplicate supplier code within the company.', trigger: 'Save Supplier', condition: 'Count of matching codes > 0', behavior: 'Hard Block saving transaction. Error popup.' },
  { id: 'BR-02', name: 'Ethiopian TIN Digit Length', desc: 'TIN must be exactly 10 numerical digits to validate tax filings with ERCA.', trigger: 'Save Supplier/Customer', condition: 'Length != 10 or contains letters', behavior: 'Block and return validation error.' },
  { id: 'BR-03', name: 'Required Tax Code for Taxable Entity', desc: 'If vendor or customer is marked VAT Applicable, a default VAT Tax code is strictly mandatory.', trigger: 'Toggle VAT Registered', condition: 'VAT Registered is checked and VAT Code is empty', behavior: 'Require field input.' },
  { id: 'BR-04', name: 'Duplicate Invoice Block', desc: 'Block posting any supplier invoice with a duplicate booking invoice number from the same supplier.', trigger: 'Post Supplier Invoice', condition: 'Invoice No matches logged record for SUPP-ID', behavior: 'Hard block. Prevent incorrect duplicate payments.' },
  { id: 'BR-05', name: 'Credit Limit Enforcer', desc: 'Block issuing new sales invoices to high-risk customers if balance exceeds credit limit by over 10%, unless financial manager overrides.', trigger: 'Save Customer Invoice', condition: 'Outstanding AR Balance > Credit Limit and Override != true', behavior: 'Warn or hard block depending on setup.' },
  { id: 'BR-06', name: 'Payment Hold Evaluator', desc: 'Filter out any supplier who has Payment Hold active from system payment run proposal calculations.', trigger: 'Run Payment Proposal', condition: 'Payment Hold Status != No Hold', behavior: 'Exclude from checklist ledger automatic generation.' }
];

export const VALIDATION_MESSAGES = [
  { code: 'ERR-AP-101', text: 'Supplier Code already exists. Please assign a unique code.', meaning: 'Unique restraint violation', suggest: 'Perform lookup or use auto-numbering generator.' },
  { code: 'ERR-AP-105', text: 'Invalid Ethiopian TIN. Must be exactly 10 numeric digits.', meaning: 'ERCA layout schema mismatch', suggest: 'Verify compliance on vendor business license document.' },
  { code: 'ERR-AP-110', text: 'VAT Registration Number is required for VAT Registered suppliers.', meaning: 'Vat mapping rule missing', suggest: 'Input valid certificate No.' },
  { code: 'ERR-AP-201', text: 'Supplier is currently on PAYMENT HOLD. Settle hold reason first.', meaning: 'Active lock status', suggest: 'Instruct finance supervisor to unlock hold status.' },
  { code: 'ERR-AR-302', text: 'Transaction exceeds credit limit. Manager override approval is required.', meaning: 'AR Credit exposure failure', suggest: 'Submit request override or receive client advance cash.' },
  { code: 'ERR-AR-405', text: 'Duplicate Receipt Reference detected for this bank account ledger.', meaning: 'Double cash entry block', suggest: 'Check bank advice stub voucher.' }
];

export const AP_REPORTS = [
  { code: 'REP-AP-01', name: 'Supplier Master Directory', purpose: 'Full list of vendors, taxes, banks and balances', user: 'Procurement / Finance', format: 'PDF, CSV, XLS' },
  { code: 'REP-AP-02', name: 'Accounts Payable Aging Summary', purpose: 'Analyze liabilities in buckets (Current, 1-30, 31-60, 61-90, 90+ days)', user: 'Treasurer / CFO', format: 'PDF, XLS' },
  { code: 'REP-AP-03', name: 'Supplier Subsidiary Statement', purpose: 'Shows chronologically all debit invoices and credit payments per supplier', user: 'AP Clerk / Vendor Audit', format: 'PDF, CSV' },
  { code: 'REP-AP-04', name: 'Withholding Tax Deductions Report', purpose: 'Summarizes 2% or 3% withheld payments to file with Tax Authority', user: 'Tax Specialist / External Auditor', format: 'Gov Format (XLS)' }
];

export const AR_REPORTS = [
  { code: 'REP-AR-01', name: 'Customer Credit Exposure Master', purpose: 'Lists credit limits, outstanding balances and available headroom', user: 'Credit Risk Manager', format: 'XLS, PDF' },
  { code: 'REP-AR-02', name: 'Accounts Receivable Aging Analysis', purpose: 'Buckets outstanding claims to pinpoint overdue customers and collection priorities', user: 'Collection Officer / Accountant', format: 'PDF, XLS, CSV' },
  { code: 'REP-AR-03', name: 'Customer Account Statement', purpose: 'Official chronological statement of sales invoices, receipts, and allocations', user: 'Customer Service / Sales', format: 'PDF (Email Enabled)' },
  { code: 'REP-AR-04', name: 'Ethiopian VAT Output Register', purpose: 'Detailed audit book showing 15% VAT collected on sales to backup monthly filings', user: 'Tax Supervisor / Auditors', format: 'Gov Format (XLS)' }
];

export const TAX_MAPPINGS = [
  { code: 'TX-ETH-01', type: 'VAT Supplier', rule: 'Collect 15% VAT on taxable goods if supplier is VAT Registered. Require valid VAT Cert.', account: '1150 (VAT Receivable)' },
  { code: 'TX-ETH-02', type: 'Withholding Payable (WHT)', rule: 'Deduct 2% from payments to local suppliers for goods if total payment exceeds 10,000 ETB.', account: '2150 (Withholding Tax Payable)' },
  { code: 'TX-ETH-03', type: 'Withholding Service Deductible', rule: 'Deduct 3% on professional services above 500 ETB for registered local consultancies.', account: '2150 (Withholding Tax Payable)' },
  { code: 'TX-ETH-04', type: 'WHT Exempt Status', rule: 'Zero withholding if supplier provides valid ERCA WHT Exemption letter.', account: 'No Deduction' }
];

export const USER_STORIES = [
  { id: 'US-AP-001', epic: 'Vendor Onboarding', role: 'AP Accountant', goal: 'Register a new supplier with full bank, TIN compliance and AP account', benefit: 'ensure trade payments are correctly posted and are compliant with Ethiopian tax laws.' },
  { id: 'US-AP-002', epic: 'Payment Gatekeeping', role: 'Treasury Officer', goal: 'Block payments to any supplier whose TIN has expired or has a Payment Hold active', benefit: 'avoid compliance penalties from ERCA and control company liquidity.' },
  { id: 'US-AR-001', epic: 'AR Collection Management', role: 'Credit Controller', goal: 'Automatically warning sales clerks if an invoice will push a high-risk customer over their credit limit', benefit: 'minimize bad-debt exposure.' },
  { id: 'US-CO-001', epic: 'Month-End Reconciliation', role: 'Finance General Manager', goal: 'Prepare an interactive aging analysis report and reconcile subsidiary ledgers to the GL control accounts', benefit: 'validate final trials with zero discrepancy.' }
];

export const DEVELOPER_ITEMS = [
  { area: 'DB Schema', name: 'Provision "suppliers" and "customers" tables into PostgreSQL via drizzle migrations', prio: 'P0', completed: true },
  { area: 'Backend Validation API', name: 'Build strict server-side validation middleware for 10-digit TIN and unique constraints', prio: 'P0', completed: false },
  { area: 'Gating Rules Engine', name: 'Develop business logic checking credit holds before allowing sales invoice processing', prio: 'P1', completed: false },
  { area: 'Front-End UI Registers', name: 'Implement React tables with responsive search, filters and modal form triggers', prio: 'P0', completed: false },
  { area: 'Excel Workbook Export', name: 'Add client-side CSV downloads for import template mock schemas', prio: 'P2', completed: false },
  { area: 'Audit Log Hook', name: 'Attach audit trail logger helper triggering entries upon modifying bank accounts or credit limits', prio: 'P1', completed: false }
];
