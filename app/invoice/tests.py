from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

User = get_user_model()


class InvoiceAPITestCase(APITestCase):
    def setUp(self):
        user = User.object.create_user(name="Ad", email="admin@admin.com", password="sjs")
        self.client.force_authenticate(user)

    def test_valid_payload(self):
        payload = {
            "id": 5,
            "invoice_items": [],
            "name": "James",
            "uuid": "69cae11f-d5f1-450d-87bf-29e0ec00f472",
            "issue_date": "2023-03-01",
            "due_date": "2023-03-22",
            "description": "Some text",
            "status": "pending",
            "extra_info": "",
            "client": None,
            "user": 3,
        }
