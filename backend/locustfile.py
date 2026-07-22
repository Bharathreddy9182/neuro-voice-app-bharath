"""
Locustfile for NeuroVoiceCompanion API Baseline / Load Testing
Run with Locust CLI:
    locust -f locustfile.py --headless -u 100 -r 10 --run-time 1m --host http://127.0.0.1:5000
"""

from locust import HttpUser, task, between

class APIUser(HttpUser):
    wait_time = between(0.1, 0.5)

    @task(3)
    def check_health(self):
        """Simulate health check / homepage endpoint call."""
        self.client.get("/")

    @task(2)
    def fetch_dashboard(self):
        """Simulate active user fetching dashboard metrics."""
        self.client.get("/dashboard/1")

    @task(1)
    def user_login(self):
        """Simulate authentication login request."""
        self.client.post("/login", json={
            "phone": "1234567890",
            "password": "Password123"
        })
