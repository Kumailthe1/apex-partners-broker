<?php
/**
 * Unified API Endpoint for STARTRADER
 */

error_reporting(E_ALL);
ini_set('display_errors', 0); // Disable to prevent breaking JSON response
ini_set('log_errors', 1);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

require_once('autoloader.inc.php');
$contr = new Controller();

$input = json_decode(file_get_contents('php://input'), true);
$action = isset($_GET['action']) ? $_GET['action'] : (isset($input['action']) ? $input['action'] : null);

if (!$action) {
    echo json_encode(['success' => false, 'error' => 'No action specified']);
    exit;
}

switch ($action) {
    case 'register':
        handleRegister($input, $contr);
        break;
    case 'login':
        handleLogin($input, $contr);
        break;
    case 'get_user_data':
        handleGetUserData($input, $contr);
        break;
    case 'deposit':
        handleDeposit($input, $contr);
        break;
    case 'withdraw':
        handleWithdraw($input, $contr);
        break;
    case 'admin_get_users':
        handleAdminGetUsers($contr);
        break;
    case 'admin_update_balance':
        handleAdminUpdateBalance($input, $contr);
        break;
    case 'admin_delete_user':
        handleAdminDeleteUser($input, $contr);
        break;
    case 'get_transactions':
        handleGetTransactions($input, $contr);
        break;
    case 'admin_get_transactions':
        handleAdminGetTransactions($contr);
        break;
    case 'admin_update_transaction_status':
        handleAdminUpdateTransactionStatus($input, $contr);
        break;
    default:
        echo json_encode(['success' => false, 'error' => 'Invalid action']);
        break;
}

function handleRegister($data, $contr)
{
    if (!isset($data['email']) || !isset($data['password']) || !isset($data['full_name'])) {
        echo json_encode(['success' => false, 'error' => 'Missing required fields']);
        return;
    }

    $password = password_hash($data['password'], PASSWORD_DEFAULT);
    $userData = [
        'full_name' => $data['full_name'],
        'email' => $data['email'],
        'password' => $password,
        'balance' => 0.00,
        'role' => 'user'
    ];

    try {
        $userId = $contr->addRecord('users', $userData);
        if ($userId) {
            echo json_encode(['success' => true, 'message' => 'User registered successfully', 'user_id' => $userId]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Registration failed. Email might already exist.']);
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}

function handleLogin($data, $contr)
{
    if (!isset($data['email']) || !isset($data['password'])) {
        echo json_encode(['success' => false, 'error' => 'Missing email or password']);
        return;
    }

    // Fetch user by email using the public getRecords method
    $user = $contr->getRecords('users', ['email' => $data['email']]);

    if ($user && password_verify($data['password'], $user[0]['password'])) {
        unset($user[0]['password']);
        echo json_encode(['success' => true, 'user' => $user[0]]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Invalid email or password']);
    }
}

function handleGetUserData($data, $contr)
{
    if (!isset($data['user_id'])) {
        echo json_encode(['success' => false, 'error' => 'User ID required']);
        return;
    }

    $user = $contr->getRecords('users', ['id' => $data['user_id']]);
    if ($user) {
        unset($user[0]['password']);
        echo json_encode(['success' => true, 'user' => $user[0]]);
    } else {
        echo json_encode(['success' => false, 'error' => 'User not found']);
    }
}

function handleDeposit($data, $contr)
{
    if (!isset($data['user_id']) || !isset($data['amount'])) {
        echo json_encode(['success' => false, 'error' => 'User ID and amount required']);
        return;
    }

    $userId = $data['user_id'];
    $amount = $data['amount'];

    $transactionData = [
        'user_id' => $userId,
        'type' => 'deposit',
        'amount' => $amount,
        'status' => 'pending',
        'reference' => 'DEP' . time() . rand(100, 999)
    ];

    $txId = $contr->addRecord('transactions', $transactionData);
    if ($txId) {
        echo json_encode(['success' => true, 'message' => 'Deposit request submitted', 'transaction_id' => $txId]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to submit deposit request']);
    }
}

function handleWithdraw($data, $contr)
{
    if (!isset($data['user_id']) || !isset($data['amount'])) {
        echo json_encode(['success' => false, 'error' => 'User ID and amount required']);
        return;
    }

    $userId = $data['user_id'];
    $amount = $data['amount'];

    // Check balance
    $user = $contr->getRecords('users', ['id' => $userId]);
    if (!$user || $user[0]['balance'] < $amount) {
        echo json_encode(['success' => false, 'error' => 'Insufficient balance']);
        return;
    }

    $transactionData = [
        'user_id' => $userId,
        'type' => 'withdrawal',
        'amount' => $amount,
        'status' => 'pending',
        'reference' => 'WITH' . time() . rand(100, 999)
    ];

    $txId = $contr->addRecord('transactions', $transactionData);
    if ($txId) {
        // We might want to deduct balance immediately or wait for approval. 
        // For brokers, it's usually deducted and put in pending.
        $newBalance = $user[0]['balance'] - $amount;
        $contr->modifyRecord('users', ['balance' => $newBalance], ['id' => $userId]);
        echo json_encode(['success' => true, 'message' => 'Withdrawal request submitted', 'transaction_id' => $txId]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to submit withdrawal request']);
    }
}

function handleAdminGetUsers($contr)
{
    // In a real app, you'd check admin token here
    $users = $contr->getRecords('users', [], 'created_at', 'DESC');
    if ($users) {
        foreach ($users as &$user)
            unset($user['password']);
        echo json_encode(['success' => true, 'users' => $users]);
    } else {
        echo json_encode(['success' => false, 'error' => 'No users found']);
    }
}

function handleAdminUpdateBalance($data, $contr)
{
    if (!isset($data['user_id']) || !isset($data['balance'])) {
        echo json_encode(['success' => false, 'error' => 'User ID and balance required']);
        return;
    }

    $userId = $data['user_id'];
    $balance = $data['balance'];

    $success = $contr->modifyRecord('users', ['balance' => $balance], ['id' => $userId]);
    if ($success) {
        echo json_encode(['success' => true, 'message' => 'Balance updated successfully']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to update balance']);
    }
}

function handleAdminDeleteUser($data, $contr)
{
    if (!isset($data['user_id'])) {
        echo json_encode(['success' => false, 'error' => 'User ID required']);
        return;
    }

    $userId = $data['user_id'];
    $success = $contr->removeRecord('users', ['id' => $userId]);
    if ($success) {
        echo json_encode(['success' => true, 'message' => 'User deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to delete user']);
    }
}

function handleGetTransactions($data, $contr)
{
    if (!isset($data['user_id'])) {
        echo json_encode(['success' => false, 'error' => 'User ID required']);
        return;
    }

    $transactions = $contr->getRecords('transactions', ['user_id' => $data['user_id']], 'created_at', 'DESC');
    echo json_encode(['success' => true, 'transactions' => $transactions ?: []]);
}

function handleAdminGetTransactions($contr)
{
    $transactions = $contr->getRecords('transactions', [], 'created_at', 'DESC');
    echo json_encode(['success' => true, 'transactions' => $transactions ?: []]);
}

function handleAdminUpdateTransactionStatus($data, $contr)
{
    if (!isset($data['transaction_id']) || !isset($data['status'])) {
        echo json_encode(['success' => false, 'error' => 'Transaction ID and status required']);
        return;
    }

    $txId = $data['transaction_id'];
    $status = $data['status'];

    $success = $contr->modifyRecord('transactions', ['status' => $status], ['id' => $txId]);
    if ($success) {
        echo json_encode(['success' => true, 'message' => 'Transaction status updated successfully']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to update transaction status']);
    }
}
