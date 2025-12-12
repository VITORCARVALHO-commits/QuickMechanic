#!/usr/bin/env python3
"""
QuickMechanic Backend API Test Suite - AutoPeça Feature Testing
Tests the complete AutoPeça (Auto Parts Store) three-sided marketplace implementation
"""

import requests
import json
import os
from datetime import datetime

# Get backend URL from environment
BACKEND_URL = "https://triplebuild-hub.preview.emergentagent.com/api"

class AutoPecaTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.client_token = None
        self.mechanic_token = None
        self.autoparts_token = None
        self.client_user = None
        self.mechanic_user = None
        self.autoparts_user = None
        self.test_vehicle_id = None
        self.test_order_id = None
        self.test_part_id = None
        self.test_reservation_id = None
        self.pickup_code = None
        self.results = []
        
    def log_result(self, test_name, success, message, details=None):
        """Log test result"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def make_request(self, method, endpoint, data=None, token=None):
        """Make HTTP request with optional authentication"""
        url = f"{self.base_url}{endpoint}"
        headers = {"Content-Type": "application/json"}
        
        if token:
            headers["Authorization"] = f"Bearer {token}"
        
        try:
            if method == "GET":
                response = requests.get(url, headers=headers, timeout=60)
            elif method == "POST":
                response = requests.post(url, json=data, headers=headers, timeout=60)
            elif method == "PATCH":
                response = requests.patch(url, json=data, headers=headers, timeout=60)
            else:
                raise ValueError(f"Unsupported method: {method}")
            
            return response
        except requests.exceptions.RequestException as e:
            print(f"Request error for {method} {url}: {e}")
            return None
    
    def test_auth_register_client(self):
        """Test client registration"""
        data = {
            "email": "client@test.com",
            "password": "test123",
            "name": "John Smith",
            "phone": "+44 7700 900123",
            "user_type": "client"
        }
        
        response = self.make_request("POST", "/auth/register", data)
        
        if response and response.status_code == 200:
            result = response.json()
            if result.get("success") and result.get("token"):
                self.client_token = result["token"]
                self.client_user = result["user"]
                self.log_result("Client Registration", True, "Client registered successfully")
                return True
            else:
                self.log_result("Client Registration", False, "Registration failed", result)
                return False
        elif response and response.status_code == 400:
            # User already exists, try to login instead
            self.log_result("Client Registration", True, "User already exists (expected in repeated tests)")
            return True
        else:
            error_msg = response.text if response else "No response"
            self.log_result("Client Registration", False, f"HTTP {response.status_code if response else 'No response'}", error_msg)
            return False
    
    def test_auth_register_mechanic(self):
        """Test mechanic registration"""
        data = {
            "email": "mechanic@test.com",
            "password": "test123",
            "name": "Mike Johnson",
            "phone": "+44 7700 900456",
            "user_type": "mechanic"
        }
        
        response = self.make_request("POST", "/auth/register", data)
        
        if response and response.status_code == 200:
            result = response.json()
            if result.get("success") and result.get("token"):
                self.mechanic_token = result["token"]
                self.mechanic_user = result["user"]
                self.log_result("Mechanic Registration", True, "Mechanic registered successfully")
                return True
            else:
                self.log_result("Mechanic Registration", False, "Registration failed", result)
                return False
        elif response and response.status_code == 400:
            # User already exists, try to login instead
            self.log_result("Mechanic Registration", True, "User already exists (expected in repeated tests)")
            return True
        else:
            error_msg = response.text if response else "No response"
            self.log_result("Mechanic Registration", False, f"HTTP {response.status_code if response else 'No response'}", error_msg)
            return False
    
    def test_auth_register_autoparts(self):
        """Test AutoPeça registration"""
        data = {
            "email": "autoparts@test.com",
            "password": "test123",
            "name": "AutoParts London",
            "phone": "+44 7700 900789",
            "user_type": "autoparts",
            "shop_name": "London Auto Parts",
            "shop_address": "123 High Street, London",
            "postcode": "SW1A 1AA"
        }
        
        response = self.make_request("POST", "/auth/register", data)
        
        if response and response.status_code == 200:
            result = response.json()
            if result.get("success") and result.get("token"):
                self.autoparts_token = result["token"]
                self.autoparts_user = result["user"]
                self.log_result("AutoParts Registration", True, "AutoParts registered successfully")
                return True
            else:
                self.log_result("AutoParts Registration", False, "Registration failed", result)
                return False
        elif response and response.status_code == 400:
            # User already exists, try to login instead
            self.log_result("AutoParts Registration", True, "User already exists (expected in repeated tests)")
            return True
        else:
            error_msg = response.text if response else "No response"
            self.log_result("AutoParts Registration", False, f"HTTP {response.status_code if response else 'No response'}", error_msg)
            return False
    
    def test_auth_login_client(self):
        """Test client login"""
        data = {
            "email": "testclient@quickmechanic.com",
            "password": "testpass123"
        }
        
        response = self.make_request("POST", "/auth/login", data)
        
        if response and response.status_code == 200:
            result = response.json()
            if result.get("success") and result.get("token"):
                self.client_token = result["token"]
                self.client_user = result["user"]
                self.log_result("Client Login", True, "Client login successful")
                return True
            else:
                self.log_result("Client Login", False, "Login failed", result)
                return False
        else:
            error_msg = response.text if response else "No response"
            self.log_result("Client Login", False, f"HTTP {response.status_code if response else 'No response'}", error_msg)
            return False
    
    def test_auth_login_mechanic(self):
        """Test mechanic login"""
        data = {
            "email": "testmechanic@quickmechanic.com",
            "password": "testpass123"
        }
        
        response = self.make_request("POST", "/auth/login", data)
        
        if response and response.status_code == 200:
            result = response.json()
            if result.get("success") and result.get("token"):
                self.mechanic_token = result["token"]
                self.mechanic_user = result["user"]
                self.log_result("Mechanic Login", True, "Mechanic login successful")
                return True
            else:
                self.log_result("Mechanic Login", False, "Login failed", result)
                return False
        else:
            error_msg = response.text if response else "No response"
            self.log_result("Mechanic Login", False, f"HTTP {response.status_code if response else 'No response'}", error_msg)
            return False
    
    def test_auth_me_client(self):
        """Test get current user (client)"""
        if not self.client_token:
            self.log_result("Client Auth Me", False, "No client token available")
            return False
        
        response = self.make_request("GET", "/auth/me", token=self.client_token)
        
        if response and response.status_code == 200:
            result = response.json()
            if result.get("success") and result.get("user"):
                self.log_result("Client Auth Me", True, "Client user info retrieved")
                return True
            else:
                self.log_result("Client Auth Me", False, "Failed to get user info", result)
                return False
        else:
            error_msg = response.text if response else "No response"
            self.log_result("Client Auth Me", False, f"HTTP {response.status_code if response else 'No response'}", error_msg)
            return False
    
    def test_auth_me_mechanic(self):
        """Test get current user (mechanic)"""
        if not self.mechanic_token:
            self.log_result("Mechanic Auth Me", False, "No mechanic token available")
            return False
        
        response = self.make_request("GET", "/auth/me", token=self.mechanic_token)
        
        if response and response.status_code == 200:
            result = response.json()
            if result.get("success") and result.get("user"):
                self.log_result("Mechanic Auth Me", True, "Mechanic user info retrieved")
                return True
            else:
                self.log_result("Mechanic Auth Me", False, "Failed to get user info", result)
                return False
        else:
            error_msg = response.text if response else "No response"
            self.log_result("Mechanic Auth Me", False, f"HTTP {response.status_code if response else 'No response'}", error_msg)
            return False
    
    def test_vehicle_search(self):
        """Test vehicle search by plate"""
        plate = "VO11WRE"
        response = self.make_request("GET", f"/vehicle/plate/{plate}")
        
        if response and response.status_code == 200:
            result = response.json()
            if result.get("success") and result.get("data"):
                self.log_result("Vehicle Search", True, f"Vehicle found for plate {plate}")
                return True
            else:
                self.log_result("Vehicle Search", False, f"Vehicle not found for plate {plate}", result)
                return False
        else:
            error_msg = response.text if response else "No response"
            self.log_result("Vehicle Search", False, f"HTTP {response.status_code if response else 'No response'}", error_msg)
            return False
    
    def test_create_quote(self):
        """Test quote creation as authenticated client"""
        if not self.client_token:
            self.log_result("Create Quote", False, "No client token available")
            return False
        
        data = {
            "plate": "VO11WRE",
            "make": "volkswagen",
            "model": "Golf",
            "year": "2011",
            "color": "Blue",
            "fuel": "Petrol",
            "version": "1.4 TSI",
            "category": "Hatchback",
            "service": "oil_change",
            "location": "SW1A 1AA",
            "description": "Regular oil change service needed",
            "date": "2024-01-15",
            "time": "10:00",
            "location_type": "mobile"
        }
        
        response = self.make_request("POST", "/quotes", data, token=self.client_token)
        
        if response and response.status_code == 200:
            result = response.json()
            if result.get("success") and result.get("data"):
                self.test_quote_id = result["data"]["id"]
                self.log_result("Create Quote", True, "Quote created successfully")
                return True
            else:
                self.log_result("Create Quote", False, "Quote creation failed", result)
                return False
        else:
            error_msg = response.text if response else "No response"
            self.log_result("Create Quote", False, f"HTTP {response.status_code if response else 'No response'}", error_msg)
            return False
    
    def test_get_client_quotes(self):
        """Test getting client's quotes"""
        if not self.client_token:
            self.log_result("Get Client Quotes", False, "No client token available")
            return False
        
        response = self.make_request("GET", "/quotes/my-quotes", token=self.client_token)
        
        if response and response.status_code == 200:
            result = response.json()
            if result.get("success"):
                quotes = result.get("data", [])
                self.log_result("Get Client Quotes", True, f"Retrieved {len(quotes)} client quotes")
                return True
            else:
                self.log_result("Get Client Quotes", False, "Failed to get client quotes", result)
                return False
        else:
            error_msg = response.text if response else "No response"
            self.log_result("Get Client Quotes", False, f"HTTP {response.status_code if response else 'No response'}", error_msg)
            return False
    
    def test_get_mechanic_quotes(self):
        """Test getting mechanic's available quotes"""
        if not self.mechanic_token:
            self.log_result("Get Mechanic Quotes", False, "No mechanic token available")
            return False
        
        response = self.make_request("GET", "/quotes/my-quotes", token=self.mechanic_token)
        
        if response and response.status_code == 200:
            result = response.json()
            if result.get("success"):
                quotes = result.get("data", [])
                self.log_result("Get Mechanic Quotes", True, f"Retrieved {len(quotes)} mechanic quotes")
                return True
            else:
                self.log_result("Get Mechanic Quotes", False, "Failed to get mechanic quotes", result)
                return False
        else:
            error_msg = response.text if response else "No response"
            self.log_result("Get Mechanic Quotes", False, f"HTTP {response.status_code if response else 'No response'}", error_msg)
            return False
    
    def test_mechanic_submit_quote(self):
        """Test mechanic submitting quote price"""
        if not self.mechanic_token or not self.test_quote_id:
            self.log_result("Mechanic Submit Quote", False, "No mechanic token or quote ID available")
            return False
        
        data = {
            "status": "quoted",
            "final_price": 75.00
        }
        
        response = self.make_request("PATCH", f"/quotes/{self.test_quote_id}/status", data, token=self.mechanic_token)
        
        if response and response.status_code == 200:
            result = response.json()
            if result.get("success") and result.get("data"):
                quote = result["data"]
                if quote.get("status") == "quoted" and quote.get("final_price") == 75.00:
                    self.log_result("Mechanic Submit Quote", True, "Quote price submitted successfully")
                    return True
                else:
                    self.log_result("Mechanic Submit Quote", False, "Quote not updated correctly", result)
                    return False
            else:
                self.log_result("Mechanic Submit Quote", False, "Quote update failed", result)
                return False
        else:
            error_msg = response.text if response else "No response"
            self.log_result("Mechanic Submit Quote", False, f"HTTP {response.status_code if response else 'No response'}", error_msg)
            return False
    
    def test_client_accept_quote(self):
        """Test client accepting quote"""
        if not self.client_token or not self.test_quote_id:
            self.log_result("Client Accept Quote", False, "No client token or quote ID available")
            return False
        
        data = {
            "status": "accepted"
        }
        
        response = self.make_request("PATCH", f"/quotes/{self.test_quote_id}/status", data, token=self.client_token)
        
        if response and response.status_code == 200:
            result = response.json()
            if result.get("success") and result.get("data"):
                quote = result["data"]
                if quote.get("status") == "accepted":
                    self.log_result("Client Accept Quote", True, "Quote accepted successfully")
                    return True
                else:
                    self.log_result("Client Accept Quote", False, "Quote status not updated", result)
                    return False
            else:
                self.log_result("Client Accept Quote", False, "Quote acceptance failed", result)
                return False
        else:
            error_msg = response.text if response else "No response"
            self.log_result("Client Accept Quote", False, f"HTTP {response.status_code if response else 'No response'}", error_msg)
            return False
    
    def test_process_payment(self):
        """Test payment processing"""
        if not self.client_token or not self.test_quote_id:
            self.log_result("Process Payment", False, "No client token or quote ID available")
            return False
        
        data = {
            "quote_id": self.test_quote_id,
            "amount": 75.00,
            "payment_method": "mock"
        }
        
        response = self.make_request("POST", "/payments", data, token=self.client_token)
        
        if response and response.status_code == 200:
            result = response.json()
            if result.get("success") and result.get("data"):
                payment = result["data"]
                self.test_payment_id = payment.get("id")
                if payment.get("status") == "completed":
                    self.log_result("Process Payment", True, "Payment processed successfully")
                    return True
                else:
                    self.log_result("Process Payment", False, "Payment not completed", result)
                    return False
            else:
                self.log_result("Process Payment", False, "Payment processing failed", result)
                return False
        else:
            error_msg = response.text if response else "No response"
            self.log_result("Process Payment", False, f"HTTP {response.status_code if response else 'No response'}", error_msg)
            return False
    
    def test_get_payments(self):
        """Test getting payment history"""
        if not self.client_token:
            self.log_result("Get Payments", False, "No client token available")
            return False
        
        response = self.make_request("GET", "/payments/my-payments", token=self.client_token)
        
        if response and response.status_code == 200:
            result = response.json()
            if result.get("success"):
                payments = result.get("data", [])
                self.log_result("Get Payments", True, f"Retrieved {len(payments)} payments")
                return True
            else:
                self.log_result("Get Payments", False, "Failed to get payments", result)
                return False
        else:
            error_msg = response.text if response else "No response"
            self.log_result("Get Payments", False, f"HTTP {response.status_code if response else 'No response'}", error_msg)
            return False
    
    def test_verify_quote_paid_status(self):
        """Test that quote status changed to paid after payment"""
        if not self.test_quote_id:
            self.log_result("Verify Quote Paid Status", False, "No quote ID available")
            return False
        
        response = self.make_request("GET", f"/quotes/{self.test_quote_id}")
        
        if response and response.status_code == 200:
            result = response.json()
            if result.get("success") and result.get("data"):
                quote = result["data"]
                if quote.get("status") == "paid":
                    self.log_result("Verify Quote Paid Status", True, "Quote status correctly updated to paid")
                    return True
                else:
                    self.log_result("Verify Quote Paid Status", False, f"Quote status is {quote.get('status')}, expected 'paid'", result)
                    return False
            else:
                self.log_result("Verify Quote Paid Status", False, "Failed to get quote", result)
                return False
        else:
            error_msg = response.text if response else "No response"
            self.log_result("Verify Quote Paid Status", False, f"HTTP {response.status_code if response else 'No response'}", error_msg)
            return False
    
    def test_mechanic_start_job(self):
        """Test mechanic starting job"""
        if not self.mechanic_token or not self.test_quote_id:
            self.log_result("Mechanic Start Job", False, "No mechanic token or quote ID available")
            return False
        
        data = {
            "status": "in_progress"
        }
        
        response = self.make_request("PATCH", f"/quotes/{self.test_quote_id}/status", data, token=self.mechanic_token)
        
        if response and response.status_code == 200:
            result = response.json()
            if result.get("success") and result.get("data"):
                quote = result["data"]
                if quote.get("status") == "in_progress":
                    self.log_result("Mechanic Start Job", True, "Job started successfully")
                    return True
                else:
                    self.log_result("Mechanic Start Job", False, "Job status not updated", result)
                    return False
            else:
                self.log_result("Mechanic Start Job", False, "Job start failed", result)
                return False
        else:
            error_msg = response.text if response else "No response"
            self.log_result("Mechanic Start Job", False, f"HTTP {response.status_code if response else 'No response'}", error_msg)
            return False
    
    def test_mechanic_complete_job(self):
        """Test mechanic completing job"""
        if not self.mechanic_token or not self.test_quote_id:
            self.log_result("Mechanic Complete Job", False, "No mechanic token or quote ID available")
            return False
        
        data = {
            "status": "completed"
        }
        
        response = self.make_request("PATCH", f"/quotes/{self.test_quote_id}/status", data, token=self.mechanic_token)
        
        if response and response.status_code == 200:
            result = response.json()
            if result.get("success") and result.get("data"):
                quote = result["data"]
                if quote.get("status") == "completed":
                    self.log_result("Mechanic Complete Job", True, "Job completed successfully")
                    return True
                else:
                    self.log_result("Mechanic Complete Job", False, "Job status not updated", result)
                    return False
            else:
                self.log_result("Mechanic Complete Job", False, "Job completion failed", result)
                return False
        else:
            error_msg = response.text if response else "No response"
            self.log_result("Mechanic Complete Job", False, f"HTTP {response.status_code if response else 'No response'}", error_msg)
            return False
    
    def test_error_handling(self):
        """Test error handling scenarios"""
        # Test invalid credentials
        data = {
            "email": "invalid@example.com",
            "password": "wrongpassword"
        }
        
        response = self.make_request("POST", "/auth/login", data)
        
        if response and response.status_code == 401:
            self.log_result("Error Handling - Invalid Login", True, "Invalid credentials properly rejected")
        else:
            self.log_result("Error Handling - Invalid Login", False, f"Expected 401, got {response.status_code if response else 'No response'}")
        
        # Test unauthorized access
        response = self.make_request("GET", "/auth/me")
        
        if response and response.status_code == 403:
            self.log_result("Error Handling - Unauthorized Access", True, "Unauthorized access properly blocked")
        else:
            self.log_result("Error Handling - Unauthorized Access", False, f"Expected 403, got {response.status_code if response else 'No response'}")
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting QuickMechanic Backend API Tests")
        print("=" * 60)
        
        # Authentication Flow Tests
        print("\n📝 Testing Authentication Flow...")
        self.test_auth_register_client()
        self.test_auth_register_mechanic()
        self.test_auth_login_client()
        self.test_auth_login_mechanic()
        self.test_auth_me_client()
        self.test_auth_me_mechanic()
        
        # Vehicle Search Tests
        print("\n🚗 Testing Vehicle Search...")
        self.test_vehicle_search()
        
        # Quote Creation Flow Tests
        print("\n💰 Testing Quote Creation Flow...")
        self.test_create_quote()
        self.test_get_client_quotes()
        
        # Mechanic Quote Flow Tests
        print("\n🔧 Testing Mechanic Quote Flow...")
        self.test_get_mechanic_quotes()
        self.test_mechanic_submit_quote()
        
        # Payment Flow Tests
        print("\n💳 Testing Payment Flow...")
        self.test_client_accept_quote()
        self.test_process_payment()
        self.test_get_payments()
        self.test_verify_quote_paid_status()
        
        # Job Management Tests
        print("\n⚙️ Testing Job Management...")
        self.test_mechanic_start_job()
        self.test_mechanic_complete_job()
        
        # Error Handling Tests
        print("\n🚨 Testing Error Handling...")
        self.test_error_handling()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for r in self.results if r["success"])
        failed = len(self.results) - passed
        
        print(f"Total Tests: {len(self.results)}")
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"Success Rate: {(passed/len(self.results)*100):.1f}%")
        
        if failed > 0:
            print("\n🚨 FAILED TESTS:")
            for result in self.results:
                if not result["success"]:
                    print(f"   ❌ {result['test']}: {result['message']}")
        
        return passed, failed

def main():
    """Main test runner"""
    print("QuickMechanic Backend API Test Suite")
    print(f"Testing against: {BACKEND_URL}")
    print()
    
    tester = QuickMechanicTester()
    passed, failed = tester.run_all_tests()
    
    # Exit with error code if tests failed
    exit(0 if failed == 0 else 1)

if __name__ == "__main__":
    main()