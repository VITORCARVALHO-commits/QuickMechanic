#!/usr/bin/env python3
"""
QuickMechanic Backend API Test Suite - E2E Complete Testing
Tests the complete QuickMechanic three-sided marketplace (Cliente, Mecânico, Admin)
"""

import requests
import json
import os
from datetime import datetime

# Get backend URL from environment
BACKEND_URL = "https://fixconnect-12.preview.emergentagent.com/api"

class QuickMechanicTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.client_token = None
        self.mechanic_token = None
        self.admin_token = None
        self.client_user = None
        self.mechanic_user = None
        self.admin_user = None
        self.test_vehicle_id = None
        self.test_order_id = None
        self.test_quote_id = None
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
                if data:
                    response = requests.post(url, json=data, headers=headers, timeout=60)
                else:
                    response = requests.post(url, headers=headers, timeout=60)
            elif method == "PATCH":
                response = requests.patch(url, json=data, headers=headers, timeout=60)
            else:
                raise ValueError(f"Unsupported method: {method}")
            
            return response
        except requests.exceptions.RequestException as e:
            print(f"Request error for {method} {url}: {e}")
            return None
    
    def test_client_login(self):
        """Test client authentication - P0 Critical"""
        data = {
            "email": "client@test.com",
            "password": "test123"
        }
        
        response = self.make_request("POST", "/auth/login", data)
        
        if response and response.status_code == 200:
            result = response.json()
            if result.get("success") and result.get("token"):
                self.client_token = result["token"]
                self.client_user = result["user"]
                self.log_result("Client Login", True, "Client authenticated successfully")
                return True
            else:
                self.log_result("Client Login", False, "Login failed", result)
                return False
        else:
            error_msg = response.text if response else "No response"
            self.log_result("Client Login", False, f"HTTP {response.status_code if response else 'No response'}", error_msg)
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
            "email": "client@test.com",
            "password": "test123"
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
            "email": "mechanic@test.com",
            "password": "test123"
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
    
    def test_auth_login_autoparts(self):
        """Test AutoParts login"""
        data = {
            "email": "autoparts@test.com",
            "password": "test123"
        }
        
        response = self.make_request("POST", "/auth/login", data)
        
        if response and response.status_code == 200:
            result = response.json()
            if result.get("success") and result.get("token"):
                self.autoparts_token = result["token"]
                self.autoparts_user = result["user"]
                self.log_result("AutoParts Login", True, "AutoParts login successful")
                return True
            else:
                self.log_result("AutoParts Login", False, "Login failed", result)
                return False
        else:
            error_msg = response.text if response else "No response"
            self.log_result("AutoParts Login", False, f"HTTP {response.status_code if response else 'No response'}", error_msg)
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
    
    def test_create_vehicle(self):
        """Test vehicle creation for client"""
        if not self.client_token:
            self.log_result("Create Vehicle", False, "No client token available")
            return False
        
        data = {
            "plate": "VO11WRE",
            "make": "Volkswagen",
            "model": "Golf",
            "year": "2011",
            "color": "Blue",
            "fuel": "Petrol"
        }
        
        response = self.make_request("POST", "/vehicles", data, token=self.client_token)
        
        if response and response.status_code == 200:
            result = response.json()
            if result.get("success") and result.get("data"):
                self.test_vehicle_id = result["data"]["id"]
                self.log_result("Create Vehicle", True, "Vehicle created successfully")
                return True
            else:
                self.log_result("Create Vehicle", False, "Vehicle creation failed", result)
                return False
        else:
            error_msg = response.text if response else "No response"
            self.log_result("Create Vehicle", False, f"HTTP {response.status_code if response else 'No response'}", error_msg)
            return False
    
    def test_add_parts_to_catalog(self):
        """Test AutoParts adding parts to catalog"""
        if not self.autoparts_token:
            self.log_result("Add Parts to Catalog", False, "No autoparts token available")
            return False
        
        parts = [
            {
                "name": "Brake Pads - Front Set",
                "description": "High quality ceramic brake pads for front wheels",
                "price": 45.99,
                "stock": 10,
                "car_make": "Volkswagen",
                "car_model": "Golf",
                "service_type": "brakes",
                "part_number": "BP-VW-GOLF-001"
            },
            {
                "name": "Oil Filter",
                "description": "Premium oil filter for engine maintenance",
                "price": 12.50,
                "stock": 25,
                "car_make": "Volkswagen",
                "car_model": "Golf",
                "service_type": "oil_change",
                "part_number": "OF-VW-GOLF-001"
            },
            {
                "name": "Air Filter",
                "description": "High-flow air filter for better engine performance",
                "price": 18.75,
                "stock": 15,
                "car_make": "Volkswagen",
                "car_model": "Golf",
                "service_type": "maintenance",
                "part_number": "AF-VW-GOLF-001"
            }
        ]
        
        success_count = 0
        for part_data in parts:
            response = self.make_request("POST", "/autoparts/parts", part_data, token=self.autoparts_token)
            
            if response and response.status_code == 200:
                result = response.json()
                if result.get("success") and result.get("data"):
                    if not self.test_part_id:  # Store first part ID for later tests
                        self.test_part_id = result["data"]["id"]
                    success_count += 1
        
        if success_count == len(parts):
            self.log_result("Add Parts to Catalog", True, f"Successfully added {success_count} parts to catalog")
            return True
        else:
            self.log_result("Add Parts to Catalog", False, f"Only added {success_count}/{len(parts)} parts")
            return False
    
    def test_create_order_needing_parts(self):
        """Test client creating order with has_parts=false (needs parts)"""
        if not self.client_token or not self.test_vehicle_id:
            self.log_result("Create Order Needing Parts", False, "No client token or vehicle ID available")
            return False
        
        data = {
            "vehicle_id": self.test_vehicle_id,
            "service": "oil_change",
            "location": "SW1A 1AA, London",
            "description": "Need oil change service with parts",
            "date": "2024-01-15",
            "time": "10:00",
            "location_type": "mobile",
            "has_parts": False  # Client needs parts
        }
        
        response = self.make_request("POST", "/orders", data, token=self.client_token)
        
        if response and response.status_code == 200:
            result = response.json()
            if result.get("success") and result.get("data"):
                order = result["data"]
                self.test_order_id = order["id"]
                if order.get("status") == "AGUARDANDO_MECANICO" and order.get("has_parts") == False:
                    self.log_result("Create Order Needing Parts", True, "Order created with correct status")
                    return True
                else:
                    self.log_result("Create Order Needing Parts", False, f"Order status: {order.get('status')}, has_parts: {order.get('has_parts')}")
                    return False
            else:
                self.log_result("Create Order Needing Parts", False, "Order creation failed", result)
                return False
        else:
            error_msg = response.text if response else "No response"
            self.log_result("Create Order Needing Parts", False, f"HTTP {response.status_code if response else 'No response'}", error_msg)
            return False
    
    def test_mechanic_accept_order(self):
        """Test mechanic accepting order with labor price"""
        if not self.mechanic_token or not self.test_order_id:
            self.log_result("Mechanic Accept Order", False, "No mechanic token or order ID available")
            return False
        
        data = {
            "labor_price": 65.00
        }
        
        response = self.make_request("POST", f"/orders/{self.test_order_id}/accept", data, token=self.mechanic_token)
        
        if response and response.status_code == 200:
            result = response.json()
            if result.get("success"):
                self.log_result("Mechanic Accept Order", True, "Order accepted with labor price")
                return True
            else:
                self.log_result("Mechanic Accept Order", False, "Order acceptance failed", result)
                return False
        else:
            error_msg = response.text if response else "No response"
            self.log_result("Mechanic Accept Order", False, f"HTTP {response.status_code if response else 'No response'}", error_msg)
            return False
    
    def test_search_parts(self):
        """Test mechanic searching for compatible parts"""
        if not self.mechanic_token:
            self.log_result("Search Parts", False, "No mechanic token available")
            return False
        
        # Search for oil change parts for Volkswagen Golf
        params = "?car_make=Volkswagen&car_model=Golf&service_type=oil_change"
        response = self.make_request("GET", f"/parts/search{params}")
        
        if response and response.status_code == 200:
            result = response.json()
            if result.get("success") and result.get("data"):
                parts = result["data"]
                if len(parts) > 0:
                    # Update test_part_id with a part from search results
                    self.test_part_id = parts[0]["id"]
                    self.log_result("Search Parts", True, f"Found {len(parts)} compatible parts")
                    return True
                else:
                    self.log_result("Search Parts", False, "No parts found for search criteria")
                    return False
            else:
                self.log_result("Search Parts", False, "Parts search failed", result)
                return False
        else:
            error_msg = response.text if response else "No response"
            self.log_result("Search Parts", False, f"HTTP {response.status_code if response else 'No response'}", error_msg)
            return False
    
    def test_mechanic_prereserve_part(self):
        """Test mechanic pre-reserving a part"""
        if not self.mechanic_token or not self.test_order_id or not self.test_part_id:
            self.log_result("Mechanic Pre-reserve Part", False, "Missing required tokens/IDs")
            return False
        
        # Send as query parameters
        params = f"?order_id={self.test_order_id}&part_id={self.test_part_id}"
        
        response = self.make_request("POST", f"/parts/prereserve{params}", token=self.mechanic_token)
        
        if response and response.status_code == 200:
            result = response.json()
            if result.get("success") and result.get("data"):
                reservation_data = result["data"]
                self.test_reservation_id = reservation_data.get("reservation_id")
                if reservation_data.get("status") == "PENDENTE_CONFIRMACAO":
                    self.log_result("Mechanic Pre-reserve Part", True, "Part pre-reserved successfully")
                    return True
                else:
                    self.log_result("Mechanic Pre-reserve Part", False, f"Unexpected status: {reservation_data.get('status')}")
                    return False
            else:
                self.log_result("Mechanic Pre-reserve Part", False, "Pre-reservation failed", result)
                return False
        else:
            error_msg = response.text if response else "No response"
            self.log_result("Mechanic Pre-reserve Part", False, f"HTTP {response.status_code if response else 'No response'}", error_msg)
            return False
    
    def test_autoparts_view_reservations(self):
        """Test AutoParts viewing pending reservations"""
        if not self.autoparts_token:
            self.log_result("AutoParts View Reservations", False, "No autoparts token available")
            return False
        
        response = self.make_request("GET", "/autoparts/reservations", token=self.autoparts_token)
        
        if response and response.status_code == 200:
            result = response.json()
            if result.get("success"):
                reservations = result.get("data", [])
                pending_reservations = [r for r in reservations if r.get("status") == "PENDENTE_CONFIRMACAO"]
                if len(pending_reservations) > 0:
                    self.log_result("AutoParts View Reservations", True, f"Found {len(pending_reservations)} pending reservations")
                    return True
                else:
                    self.log_result("AutoParts View Reservations", True, f"Found {len(reservations)} total reservations (none pending)")
                    return True
            else:
                self.log_result("AutoParts View Reservations", False, "Failed to get reservations", result)
                return False
        else:
            error_msg = response.text if response else "No response"
            self.log_result("AutoParts View Reservations", False, f"HTTP {response.status_code if response else 'No response'}", error_msg)
            return False
    
    def test_autoparts_confirm_reservation(self):
        """Test AutoParts confirming reservation and generating pickup code"""
        if not self.autoparts_token or not self.test_reservation_id:
            self.log_result("AutoParts Confirm Reservation", False, "No autoparts token or reservation ID available")
            return False
        
        data = {
            "confirm": True
        }
        
        response = self.make_request("POST", f"/autoparts/confirm-reservation/{self.test_reservation_id}", data, token=self.autoparts_token)
        
        if response and response.status_code == 200:
            result = response.json()
            if result.get("success") and result.get("data"):
                pickup_data = result["data"]
                self.pickup_code = pickup_data.get("pickup_code")
                if self.pickup_code and self.pickup_code.startswith("QM-"):
                    self.log_result("AutoParts Confirm Reservation", True, f"Reservation confirmed, pickup code: {self.pickup_code}")
                    return True
                else:
                    self.log_result("AutoParts Confirm Reservation", False, "No pickup code generated")
                    return False
            else:
                self.log_result("AutoParts Confirm Reservation", False, "Reservation confirmation failed", result)
                return False
        else:
            error_msg = response.text if response else "No response"
            self.log_result("AutoParts Confirm Reservation", False, f"HTTP {response.status_code if response else 'No response'}", error_msg)
            return False
    
    def test_autoparts_confirm_pickup(self):
        """Test AutoParts confirming part pickup using pickup code"""
        if not self.autoparts_token or not self.pickup_code:
            self.log_result("AutoParts Confirm Pickup", False, "No autoparts token or pickup code available")
            return False
        
        # Send pickup_code as query parameter
        params = f"?pickup_code={self.pickup_code}"
        
        response = self.make_request("POST", f"/autoparts/confirm-pickup{params}", token=self.autoparts_token)
        
        if response and response.status_code == 200:
            result = response.json()
            if result.get("success"):
                self.log_result("AutoParts Confirm Pickup", True, "Part pickup confirmed successfully")
                return True
            else:
                self.log_result("AutoParts Confirm Pickup", False, "Pickup confirmation failed", result)
                return False
        else:
            error_msg = response.text if response else "No response"
            self.log_result("AutoParts Confirm Pickup", False, f"HTTP {response.status_code if response else 'No response'}", error_msg)
            return False
    
    def test_mechanic_start_service(self):
        """Test mechanic starting service"""
        if not self.mechanic_token or not self.test_order_id:
            self.log_result("Mechanic Start Service", False, "No mechanic token or order ID available")
            return False
        
        response = self.make_request("POST", f"/orders/{self.test_order_id}/start-service", token=self.mechanic_token)
        
        if response and response.status_code == 200:
            result = response.json()
            if result.get("success"):
                self.log_result("Mechanic Start Service", True, "Service started successfully")
                return True
            else:
                self.log_result("Mechanic Start Service", False, "Service start failed", result)
                return False
        else:
            error_msg = response.text if response else "No response"
            self.log_result("Mechanic Start Service", False, f"HTTP {response.status_code if response else 'No response'}", error_msg)
            return False
    
    def test_mechanic_complete_service(self):
        """Test mechanic completing service"""
        if not self.mechanic_token or not self.test_order_id:
            self.log_result("Mechanic Complete Service", False, "No mechanic token or order ID available")
            return False
        
        response = self.make_request("POST", f"/orders/{self.test_order_id}/complete-service", token=self.mechanic_token)
        
        if response and response.status_code == 200:
            result = response.json()
            if result.get("success"):
                self.log_result("Mechanic Complete Service", True, "Service completed successfully")
                return True
            else:
                self.log_result("Mechanic Complete Service", False, "Service completion failed", result)
                return False
        else:
            error_msg = response.text if response else "No response"
            self.log_result("Mechanic Complete Service", False, f"HTTP {response.status_code if response else 'No response'}", error_msg)
            return False
    
    def test_verify_order_status_transitions(self):
        """Test that order went through correct status transitions"""
        if not self.test_order_id:
            self.log_result("Verify Order Status Transitions", False, "No order ID available")
            return False
        
        # Get current order to check final status
        response = self.make_request("GET", f"/quotes/my-quotes", token=self.client_token)
        
        if response and response.status_code == 200:
            result = response.json()
            if result.get("success"):
                orders = result.get("data", [])
                test_order = None
                for order in orders:
                    if order.get("id") == self.test_order_id:
                        test_order = order
                        break
                
                if test_order:
                    status = test_order.get("status")
                    if status == "SERVICO_FINALIZADO":
                        self.log_result("Verify Order Status Transitions", True, f"Order completed with final status: {status}")
                        return True
                    else:
                        self.log_result("Verify Order Status Transitions", False, f"Order status is {status}, expected SERVICO_FINALIZADO")
                        return False
                else:
                    self.log_result("Verify Order Status Transitions", False, "Test order not found in client orders")
                    return False
            else:
                self.log_result("Verify Order Status Transitions", False, "Failed to get orders", result)
                return False
        else:
            error_msg = response.text if response else "No response"
            self.log_result("Verify Order Status Transitions", False, f"HTTP {response.status_code if response else 'No response'}", error_msg)
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
        """Run all AutoPeça feature tests in sequence"""
        print("🚀 Starting AutoPeça Feature Backend API Tests")
        print("=" * 70)
        
        # Authentication Flow Tests
        print("\n📝 Testing Authentication Flow...")
        self.test_auth_register_client()
        self.test_auth_register_mechanic()
        self.test_auth_register_autoparts()
        self.test_auth_login_client()
        self.test_auth_login_mechanic()
        self.test_auth_login_autoparts()
        self.test_auth_me_client()
        self.test_auth_me_mechanic()
        
        # Vehicle Setup
        print("\n🚗 Testing Vehicle Setup...")
        self.test_vehicle_search()
        self.test_create_vehicle()
        
        # AutoPeça Catalog Setup
        print("\n🏪 Testing AutoPeça Catalog...")
        self.test_add_parts_to_catalog()
        
        # Order Creation Flow (Client needs parts)
        print("\n📋 Testing Order Creation Flow...")
        self.test_create_order_needing_parts()
        
        # Mechanic Flow
        print("\n🔧 Testing Mechanic Flow...")
        self.test_mechanic_accept_order()
        self.test_search_parts()
        self.test_mechanic_prereserve_part()
        
        # AutoPeça Flow
        print("\n🏪 Testing AutoPeça Flow...")
        self.test_autoparts_view_reservations()
        self.test_autoparts_confirm_reservation()
        self.test_autoparts_confirm_pickup()
        
        # Service Completion Flow
        print("\n⚙️ Testing Service Completion...")
        self.test_mechanic_start_service()
        self.test_mechanic_complete_service()
        
        # Verification Tests
        print("\n✅ Testing Status Verification...")
        self.test_verify_order_status_transitions()
        
        # Error Handling Tests
        print("\n🚨 Testing Error Handling...")
        self.test_error_handling()
        
        # Summary
        print("\n" + "=" * 70)
        print("📊 AUTOPECA FEATURE TEST SUMMARY")
        print("=" * 70)
        
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
        
        print("\n🎯 KEY FEATURES TESTED:")
        print("   • AutoPeça user registration and authentication")
        print("   • Parts catalog management")
        print("   • Order creation with has_parts=false")
        print("   • Mechanic order acceptance and part search")
        print("   • Part pre-reservation workflow")
        print("   • AutoPeça reservation confirmation")
        print("   • Pickup code generation and validation")
        print("   • Complete service workflow")
        print("   • Status transitions verification")
        
        return passed, failed

def main():
    """Main test runner"""
    print("AutoPeça Feature Backend API Test Suite")
    print(f"Testing against: {BACKEND_URL}")
    print()
    
    tester = AutoPecaTester()
    passed, failed = tester.run_all_tests()
    
    # Exit with error code if tests failed
    exit(0 if failed == 0 else 1)

if __name__ == "__main__":
    main()