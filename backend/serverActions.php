<?php
/**
 * Alpha10 Dollar Fund Registration - Single Submission Endpoint
 * 
 * This endpoint handles both form data submission and file uploads in a single request
 * 
 * Domain: https://alpha10-world.com.ng/
 * Path: dollar-funds/upload.php
 * Uploads: dollar-funds/uploads/
 * 
 * Accepts: multipart/form-data (for file uploads)
 */

// Suppress warnings that could break JSON output
error_reporting(E_ALL & ~E_WARNING & ~E_NOTICE);
ini_set('display_errors', 0);

// Start output buffering
ob_start();

// Set CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    ob_clean();
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Only POST method allowed'], JSON_UNESCAPED_UNICODE);
    ob_end_flush();
    exit;
}

// Get current directory (compatible with older PHP versions)
$currentDir = dirname(__FILE__);

// Include autoloader (same directory as upload.php)
require_once($currentDir . '/autoloader.inc.php');

// Classes
$contr = new Controller();

// Configuration
$baseUrl = 'https://alpha10-world.com.ng/dollar-funds/';
$uploadBasePath = $currentDir . '/uploads/';

// Create all upload directories
$uploadDirs = [
    'passport-photos',
    'id-documents',
    'proof-of-address',
    'sponsor-ids',
    'work-permits',
    'proof-of-payment',
    'indemnity-letters',
    'signatures/account-holder',
    'signatures/joint-account',
    'signatures/signatory-a',
    'signatures/signatory-b'
];

foreach ($uploadDirs as $dir) {
    $fullPath = $uploadBasePath . $dir . '/';
    if (!file_exists($fullPath)) {
        mkdir($fullPath, 0777, true);
    }
}

// Get form data from $_POST (multipart/form-data)
$input = $_POST;

// Validate required fields based on account type
$accountType = isset($input['account_type']) ? $input['account_type'] : 'personal';

// Base required fields for all account types
$requiredFields = [
    'investment_type',
    'account_type',
    'number_of_units',
    'total_subscription_amount',
    'mode_of_payment',
    'declaration_age_18',
    'declaration_minimum_period',
    'declaration_losses',
    'declaration_information',
    'declaration_e_statement',
    'declaration_past_performance',
    'declaration_ndpr',
    'declaration_aml',
    'is_pep'
];

// Add personal/joint specific required fields
if ($accountType === 'personal' || $accountType === 'joint') {
    $requiredFields = array_merge($requiredFields, [
        'title',
        'surname',
        'first_name',
        'date_of_birth',
        'gender',
        'marital_status',
        'nationality',
        'state_of_origin',
        'local_govt_area',
        'mobile_number_1',
        'email_address',
        'mothers_maiden_name',
        'residential_address',
        'next_of_kin_name',
        'next_of_kin_relationship',
        'next_of_kin_mobile',
        'next_of_kin_address',
        'bank_name',
        'account_name',
        'account_number',
        'bvn'
    ]);
}

// For corporate accounts, only require basic fields (no personal fields required)
// Corporate-specific fields are optional - admin can edit later

$missingFields = [];
foreach ($requiredFields as $field) {
    if (!isset($input[$field]) || $input[$field] === '' || $input[$field] === null) {
        $missingFields[] = $field;
    }
}

if (!empty($missingFields)) {
    ob_clean();
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => 'Missing required fields',
        'missing_fields' => $missingFields
    ], JSON_UNESCAPED_UNICODE);
    ob_end_flush();
    exit;
}

// File upload configuration
$allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
$maxFileSize = 10 * 1024 * 1024; // 10MB

// Helper function to validate and upload file
function uploadFile($fileKey, $targetDir, $allowedTypes, $maxSize, $contr) {
    if (empty($_FILES[$fileKey]) || $_FILES[$fileKey]['error'] !== UPLOAD_ERR_OK) {
        return ['success' => false, 'error' => 'No file uploaded or upload error'];
    }
    
    $file = $_FILES[$fileKey];
    
    // Check file type
    if (!in_array($file['type'], $allowedTypes)) {
        return ['success' => false, 'error' => 'Invalid file type. Allowed: PDF, JPG, JPEG, PNG'];
    }
    
    // Check file size
    if ($file['size'] > $maxSize) {
        return ['success' => false, 'error' => 'File too large. Maximum size: 10MB'];
    }
    
    // Upload file
    $_FILES['temp_upload'] = $file;
    $uploadedFile = $contr->uploadFile('temp_upload', $targetDir);
    unset($_FILES['temp_upload']);
    
    if ($uploadedFile) {
        $filename = basename($uploadedFile);
        $folderName = basename(rtrim($targetDir, '/'));
        $relativePath = 'uploads/' . $folderName . '/' . $filename;
        $fullUrl = 'https://alpha10-world.com.ng/dollar-funds/' . $relativePath;
        
        return [
            'success' => true,
            'path' => $relativePath,
            'url' => $fullUrl,
            'filename' => $filename
        ];
    }
    
    return ['success' => false, 'error' => 'Failed to upload file'];
}

// Helper function to convert boolean string to int
function boolToInt($value) {
    if ($value === 'true' || $value === true || $value === '1' || $value === 1) {
        return 1;
    }
    return 0;
}

// Handle file uploads
$uploadedFiles = [];
$fileFields = [
    'passport_photo' => 'passport-photos',
    'id_document' => 'id-documents',
    'proof_of_address' => 'proof-of-address',
    'sponsor_id' => 'sponsor-ids',
    'work_permit' => 'work-permits',
    'proof_of_payment' => 'proof-of-payment',
    'indemnity_letter' => 'indemnity-letters',
    'account_holder_signature' => 'signatures/account-holder',
    'joint_account_signature' => 'signatures/joint-account',
    'signatory_a_signature' => 'signatures/signatory-a',
    'signatory_b_signature' => 'signatures/signatory-b'
];

foreach ($fileFields as $fileKey => $dirName) {
    if (!empty($_FILES[$fileKey]) && $_FILES[$fileKey]['error'] === UPLOAD_ERR_OK) {
        $targetDir = $uploadBasePath . $dirName . '/';
        $result = uploadFile($fileKey, $targetDir, $allowedTypes, $maxFileSize, $contr);
        if ($result['success']) {
            $uploadedFiles[$fileKey] = $result;
    } else {
            // Log error but don't fail the entire submission for optional files
            error_log("File upload failed for {$fileKey}: " . $result['error']);
        }
    }
}

// Prepare data for database insertion
// For corporate accounts, provide default values for required personal fields that don't apply
$isCorporate = ($input['account_type'] ?? '') === 'corporate';

$applicationData = [
    // Investment & Account Type
    'investment_type' => $input['investment_type'] ?? null,
    'account_type' => $input['account_type'],
    
    // Personal Information - Use defaults for corporate accounts
    'title' => $isCorporate ? 'N/A' : ($input['title'] ?? ''),
    'surname' => $isCorporate ? 'N/A' : ($input['surname'] ?? ''),
    'first_name' => $isCorporate ? 'N/A' : ($input['first_name'] ?? ''),
    'other_name' => !empty($input['other_name']) ? $input['other_name'] : null,
    'date_of_birth' => $isCorporate ? '1900-01-01' : ($input['date_of_birth'] ?? '1900-01-01'),
    'gender' => $isCorporate ? 'male' : ($input['gender'] ?? 'male'),
    'marital_status' => $isCorporate ? 'single' : ($input['marital_status'] ?? 'single'),
    'nationality' => $isCorporate ? 'N/A' : ($input['nationality'] ?? ''),
    'state_of_origin' => $isCorporate ? 'N/A' : ($input['state_of_origin'] ?? ''),
    'local_govt_area' => $isCorporate ? 'N/A' : ($input['local_govt_area'] ?? ''),
    'mobile_number_1' => $isCorporate ? '00000000000' : ($input['mobile_number_1'] ?? '00000000000'),
    'mobile_number_2' => !empty($input['mobile_number_2']) ? $input['mobile_number_2'] : null,
    'email_address' => $isCorporate ? ($input['official_email'] ?? 'noreply@corporate.com') : ($input['email_address'] ?? ''),
    'mothers_maiden_name' => $isCorporate ? 'N/A' : ($input['mothers_maiden_name'] ?? ''),
    'residential_address' => $isCorporate ? ($input['business_address'] ?? 'N/A') : ($input['residential_address'] ?? ''),
    
    // Means of Identification
    'means_of_identification' => !empty($input['means_of_identification']) ? $input['means_of_identification'] : null,
    'id_issuance_date' => !empty($input['id_issuance_date']) ? $input['id_issuance_date'] : null,
    'id_expiry_date' => !empty($input['id_expiry_date']) ? $input['id_expiry_date'] : null,
    'id_number' => !empty($input['id_number']) ? $input['id_number'] : null,
    'tin' => !empty($input['tin']) ? $input['tin'] : null,
    
    // Annual Income & Source
    'annual_income_range' => !empty($input['annual_income_range']) ? $input['annual_income_range'] : null,
    'source_of_income' => !empty($input['source_of_income']) ? $input['source_of_income'] : null,
    'place_of_work' => !empty($input['place_of_work']) ? $input['place_of_work'] : null,
    'occupation' => !empty($input['occupation']) ? $input['occupation'] : null,
    'job_title' => !empty($input['job_title']) ? $input['job_title'] : null,
    'work_address' => !empty($input['work_address']) ? $input['work_address'] : null,
    
    // Next of Kin - Use defaults for corporate accounts
    'next_of_kin_name' => $isCorporate ? 'N/A' : ($input['next_of_kin_name'] ?? ''),
    'next_of_kin_relationship' => $isCorporate ? 'N/A' : ($input['next_of_kin_relationship'] ?? ''),
    'next_of_kin_mobile' => $isCorporate ? '00000000000' : ($input['next_of_kin_mobile'] ?? '00000000000'),
    'next_of_kin_email' => !empty($input['next_of_kin_email']) ? $input['next_of_kin_email'] : null,
    'next_of_kin_address' => $isCorporate ? 'N/A' : ($input['next_of_kin_address'] ?? ''),
    
    // Joint Applicant (Optional)
    'joint_applicant_surname' => !empty($input['joint_applicant_surname']) ? $input['joint_applicant_surname'] : null,
    'joint_applicant_first_name' => !empty($input['joint_applicant_first_name']) ? $input['joint_applicant_first_name'] : null,
    'joint_applicant_other_name' => !empty($input['joint_applicant_other_name']) ? $input['joint_applicant_other_name'] : null,
    'joint_applicant_date_of_birth' => !empty($input['joint_applicant_date_of_birth']) ? $input['joint_applicant_date_of_birth'] : null,
    'joint_applicant_gender' => !empty($input['joint_applicant_gender']) ? $input['joint_applicant_gender'] : null,
    'joint_applicant_marital_status' => !empty($input['joint_applicant_marital_status']) ? $input['joint_applicant_marital_status'] : null,
    'joint_applicant_nationality' => !empty($input['joint_applicant_nationality']) ? $input['joint_applicant_nationality'] : null,
    'joint_applicant_state_of_origin' => !empty($input['joint_applicant_state_of_origin']) ? $input['joint_applicant_state_of_origin'] : null,
    'joint_applicant_lga' => !empty($input['joint_applicant_lga']) ? $input['joint_applicant_lga'] : null,
    'joint_applicant_mobile_1' => !empty($input['joint_applicant_mobile_1']) ? $input['joint_applicant_mobile_1'] : null,
    'joint_applicant_mobile_2' => !empty($input['joint_applicant_mobile_2']) ? $input['joint_applicant_mobile_2'] : null,
    'joint_applicant_email' => !empty($input['joint_applicant_email']) ? $input['joint_applicant_email'] : null,
    'joint_applicant_mothers_maiden_name' => !empty($input['joint_applicant_mothers_maiden_name']) ? $input['joint_applicant_mothers_maiden_name'] : null,
    'joint_applicant_relationship' => !empty($input['joint_applicant_relationship']) ? $input['joint_applicant_relationship'] : null,
    
    // Banking Information (Personal/Joint)
    'bank_name' => !empty($input['bank_name']) ? $input['bank_name'] : null,
    'account_name' => !empty($input['account_name']) ? $input['account_name'] : null,
    'account_number' => !empty($input['account_number']) ? $input['account_number'] : null,
    'bvn' => !empty($input['bvn']) ? $input['bvn'] : null,
    
    // Corporate Banking Information
    'primary_bank_name' => !empty($input['primary_bank_name']) ? $input['primary_bank_name'] : null,
    'primary_account_name' => !empty($input['primary_account_name']) ? $input['primary_account_name'] : null,
    'primary_account_number' => !empty($input['primary_account_number']) ? $input['primary_account_number'] : null,
    'secondary_bank_name' => !empty($input['secondary_bank_name']) ? $input['secondary_bank_name'] : null,
    'secondary_account_name' => !empty($input['secondary_account_name']) ? $input['secondary_account_name'] : null,
    'secondary_account_number' => !empty($input['secondary_account_number']) ? $input['secondary_account_number'] : null,
    'account_mandate' => !empty($input['account_mandate']) ? $input['account_mandate'] : null,
    'signatory_a_name' => !empty($input['signatory_a_name']) ? $input['signatory_a_name'] : null,
    'signatory_b_name' => !empty($input['signatory_b_name']) ? $input['signatory_b_name'] : null,
    'signatory_a_class' => !empty($input['signatory_a_class']) ? $input['signatory_a_class'] : null,
    'signatory_b_class' => !empty($input['signatory_b_class']) ? $input['signatory_b_class'] : null,
    
    // Fund Subscription Details
    'fund_name' => !empty($input['fund_name']) ? $input['fund_name'] : null,
    'unit_price' => !empty($input['unit_price']) ? $input['unit_price'] : null,
    'number_of_units' => $input['number_of_units'],
    'total_subscription_amount' => $input['total_subscription_amount'],
    'minimum_initial_investment' => !empty($input['minimum_initial_investment']) ? $input['minimum_initial_investment'] : null,
    'minimum_subsequent_investment' => !empty($input['minimum_subsequent_investment']) ? $input['minimum_subsequent_investment'] : null,
    'dividend_rollover_instruction' => !empty($input['dividend_rollover_instruction']) ? $input['dividend_rollover_instruction'] : null,
    'mode_of_payment' => $input['mode_of_payment'],
    'transaction_reference' => !empty($input['transaction_reference']) ? $input['transaction_reference'] : null,
    'payment_date' => !empty($input['payment_date']) ? $input['payment_date'] : null,
    
    // Client Declarations
    'declaration_age_18' => boolToInt($input['declaration_age_18']),
    'declaration_minimum_period' => boolToInt($input['declaration_minimum_period']),
    'declaration_losses' => boolToInt($input['declaration_losses']),
    'declaration_information' => boolToInt($input['declaration_information']),
    'declaration_e_statement' => boolToInt($input['declaration_e_statement']),
    'declaration_past_performance' => boolToInt($input['declaration_past_performance']),
    'declaration_ndpr' => boolToInt($input['declaration_ndpr']),
    'declaration_aml' => boolToInt($input['declaration_aml']),
    
    // PEP Declaration
    'is_pep' => $input['is_pep'],
    
    // Indemnity
    'designated_email' => !empty($input['designated_email']) ? $input['designated_email'] : null,
    'designated_phone' => !empty($input['designated_phone']) ? $input['designated_phone'] : null,
    
    // KYC Checklist
    'kyc_form_completed' => boolToInt($input['kyc_form_completed'] ?? 'false'),
    'kyc_passport_photo' => boolToInt($input['kyc_passport_photo'] ?? 'false'),
    'kyc_means_of_id' => boolToInt($input['kyc_means_of_id'] ?? 'false'),
    'kyc_proof_of_address' => boolToInt($input['kyc_proof_of_address'] ?? 'false'),
    'kyc_sponsor_id' => boolToInt($input['kyc_sponsor_id'] ?? 'false'),
    'kyc_work_permit' => boolToInt($input['kyc_work_permit'] ?? 'false'),
    
    // Corporate Information (Optional)
    'company_name' => !empty($input['company_name']) ? $input['company_name'] : null,
    'registration_number' => !empty($input['registration_number']) ? $input['registration_number'] : null,
    'company_category' => !empty($input['company_category']) ? $input['company_category'] : null,
    'date_of_incorporation' => !empty($input['date_of_incorporation']) ? $input['date_of_incorporation'] : null,
    'country_of_incorporation' => !empty($input['country_of_incorporation']) ? $input['country_of_incorporation'] : null,
    'nature_of_business' => !empty($input['nature_of_business']) ? $input['nature_of_business'] : null,
    'sector_industry' => !empty($input['sector_industry']) ? $input['sector_industry'] : null,
    'company_tin' => !empty($input['company_tin']) ? $input['company_tin'] : null,
    'business_address' => !empty($input['business_address']) ? $input['business_address'] : null,
    'mailing_address' => !empty($input['mailing_address']) ? $input['mailing_address'] : null,
    'official_email' => !empty($input['official_email']) ? $input['official_email'] : null,
    'website' => !empty($input['website']) ? $input['website'] : null,
    'company_phone_1' => !empty($input['company_phone_1']) ? $input['company_phone_1'] : null,
    'company_phone_2' => !empty($input['company_phone_2']) ? $input['company_phone_2'] : null,
    'scuml_registration_number' => !empty($input['scuml_registration_number']) ? $input['scuml_registration_number'] : null,
    'regulator_license_number' => !empty($input['regulator_license_number']) ? $input['regulator_license_number'] : null,
    
    // Document Uploads
    'passport_photo_url' => isset($uploadedFiles['passport_photo']) ? $uploadedFiles['passport_photo']['path'] : null,
    'id_document_url' => isset($uploadedFiles['id_document']) ? $uploadedFiles['id_document']['path'] : null,
    'proof_of_address_url' => isset($uploadedFiles['proof_of_address']) ? $uploadedFiles['proof_of_address']['path'] : null,
    'sponsor_id_url' => isset($uploadedFiles['sponsor_id']) ? $uploadedFiles['sponsor_id']['path'] : null,
    'work_permit_url' => isset($uploadedFiles['work_permit']) ? $uploadedFiles['work_permit']['path'] : null,
    'proof_of_payment_url' => isset($uploadedFiles['proof_of_payment']) ? $uploadedFiles['proof_of_payment']['path'] : null,
    'indemnity_letter_url' => isset($uploadedFiles['indemnity_letter']) ? $uploadedFiles['indemnity_letter']['path'] : null,
    'account_holder_signature_url' => isset($uploadedFiles['account_holder_signature']) ? $uploadedFiles['account_holder_signature']['path'] : null,
    'joint_account_signature_url' => isset($uploadedFiles['joint_account_signature']) ? $uploadedFiles['joint_account_signature']['path'] : null,
    'signatory_a_signature_url' => isset($uploadedFiles['signatory_a_signature']) ? $uploadedFiles['signatory_a_signature']['path'] : null,
    'signatory_b_signature_url' => isset($uploadedFiles['signatory_b_signature']) ? $uploadedFiles['signatory_b_signature']['path'] : null,
    
    'status' => 'pending'
];

// Insert into database
try {
    $applicationId = $contr->addRecord('fund_applications', $applicationData);
    
    if ($applicationId) {
        // Insert directors into separate table (for corporate accounts)
        if ($input['account_type'] === 'corporate') {
            // Director 1 (always required for corporate)
            if (!empty($input['director1_full_name'])) {
                $director1Data = [
                    'application_id' => $applicationId,
                    'director_number' => 1,
                    'full_name' => $input['director1_full_name'],
                    'designation' => $input['director1_designation'] ?? null,
                    'bvn' => $input['director1_bvn'] ?? null,
                    'tin' => $input['director1_tin'] ?? null,
                    'date_of_birth' => !empty($input['director1_date_of_birth']) ? $input['director1_date_of_birth'] : null,
                    'gender' => $input['director1_gender'] ?? null,
                    'nationality' => $input['director1_nationality'] ?? null,
                    'state_of_origin' => $input['director1_state_of_origin'] ?? null,
                    'lga' => $input['director1_lga'] ?? null,
                    'mobile' => $input['director1_mobile'] ?? null,
                    'email' => $input['director1_email'] ?? null,
                    'means_of_id' => $input['director1_means_of_id'] ?? null,
                    'id_number' => $input['director1_id_number'] ?? null,
                    'id_issue_date' => !empty($input['director1_id_issue_date']) ? $input['director1_id_issue_date'] : null,
                    'id_expiry_date' => !empty($input['director1_id_expiry_date']) ? $input['director1_id_expiry_date'] : null,
                    'residential_address' => $input['director1_residential_address'] ?? null,
                    'office_address' => $input['director1_office_address'] ?? null,
                    'is_pep' => $input['director1_is_pep'] ?? null,
                ];
                $contr->addRecord('directors', $director1Data);
            }
            
            // Director 2 (optional)
            if (!empty($input['director2_full_name'])) {
                $director2Data = [
                    'application_id' => $applicationId,
                    'director_number' => 2,
                    'full_name' => $input['director2_full_name'],
                    'designation' => $input['director2_designation'] ?? null,
                    'bvn' => $input['director2_bvn'] ?? null,
                    'tin' => $input['director2_tin'] ?? null,
                    'date_of_birth' => !empty($input['director2_date_of_birth']) ? $input['director2_date_of_birth'] : null,
                    'gender' => $input['director2_gender'] ?? null,
                    'nationality' => $input['director2_nationality'] ?? null,
                    'state_of_origin' => $input['director2_state_of_origin'] ?? null,
                    'lga' => $input['director2_lga'] ?? null,
                    'mobile' => $input['director2_mobile'] ?? null,
                    'email' => $input['director2_email'] ?? null,
                    'means_of_id' => $input['director2_means_of_id'] ?? null,
                    'id_number' => $input['director2_id_number'] ?? null,
                    'id_issue_date' => !empty($input['director2_id_issue_date']) ? $input['director2_id_issue_date'] : null,
                    'id_expiry_date' => !empty($input['director2_id_expiry_date']) ? $input['director2_id_expiry_date'] : null,
                    'residential_address' => $input['director2_residential_address'] ?? null,
                    'office_address' => $input['director2_office_address'] ?? null,
                    'is_pep' => $input['director2_is_pep'] ?? null,
                ];
                $contr->addRecord('directors', $director2Data);
            }
            
            // Additional Directors (3, 4, etc.)
            $additionalDirectorsCount = isset($input['additional_directors_count']) ? (int)$input['additional_directors_count'] : 0;
            $directorNumbers = [];
            if (!empty($input['additional_directors_numbers'])) {
                $directorNumbers = array_map('intval', explode(',', $input['additional_directors_numbers']));
            } else {
                // Fallback: assume sequential directors starting from 3
                for ($i = 0; $i < $additionalDirectorsCount; $i++) {
                    $directorNumbers[] = $i + 3;
                }
            }
            
            foreach ($directorNumbers as $directorNumber) {
                $directorKey = 'director' . $directorNumber;
                
                if (!empty($input[$directorKey . '_full_name'])) {
                    $directorData = [
                        'application_id' => $applicationId,
                        'director_number' => $directorNumber,
                        'full_name' => $input[$directorKey . '_full_name'],
                        'designation' => $input[$directorKey . '_designation'] ?? null,
                        'bvn' => $input[$directorKey . '_bvn'] ?? null,
                        'tin' => $input[$directorKey . '_tin'] ?? null,
                        'date_of_birth' => !empty($input[$directorKey . '_date_of_birth']) ? $input[$directorKey . '_date_of_birth'] : null,
                        'gender' => $input[$directorKey . '_gender'] ?? null,
                        'nationality' => $input[$directorKey . '_nationality'] ?? null,
                        'state_of_origin' => $input[$directorKey . '_state_of_origin'] ?? null,
                        'lga' => $input[$directorKey . '_lga'] ?? null,
                        'mobile' => $input[$directorKey . '_mobile'] ?? null,
                        'email' => $input[$directorKey . '_email'] ?? null,
                        'means_of_id' => $input[$directorKey . '_means_of_id'] ?? null,
                        'id_number' => $input[$directorKey . '_id_number'] ?? null,
                        'id_issue_date' => !empty($input[$directorKey . '_id_issue_date']) ? $input[$directorKey . '_id_issue_date'] : null,
                        'id_expiry_date' => !empty($input[$directorKey . '_id_expiry_date']) ? $input[$directorKey . '_id_expiry_date'] : null,
                        'residential_address' => $input[$directorKey . '_residential_address'] ?? null,
                        'office_address' => $input[$directorKey . '_office_address'] ?? null,
                        'is_pep' => $input[$directorKey . '_is_pep'] ?? null,
                    ];
                    $contr->addRecord('directors', $directorData);
                }
            }
        }
        
        ob_clean();
        header('Content-Type: application/json; charset=utf-8');
        http_response_code(200);
        
        // Build file response
        $fileResponse = [];
        foreach ($uploadedFiles as $key => $file) {
            $fileResponse[$key] = [
                'url' => $file['url'],
                'path' => $file['path']
            ];
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Application submitted successfully',
            'application_id' => $applicationId,
            'files' => $fileResponse
        ], JSON_UNESCAPED_UNICODE);
        ob_end_flush();
        exit;
    } else {
        throw new Exception('Failed to save application to database');
    }
} catch (Exception $e) {
    error_log('Application submission error: ' . $e->getMessage());
    error_log('Stack trace: ' . $e->getTraceAsString());
    
    // Clean up uploaded files if database insert failed
    foreach ($uploadedFiles as $file) {
        $fullPath = $uploadBasePath . str_replace('uploads/', '', $file['path']);
        if (file_exists($fullPath)) {
            @unlink($fullPath);
        }
    }
    
    ob_clean();
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to submit application. Please try again.',
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
    ob_end_flush();
    exit;
}
?>
