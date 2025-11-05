import requests
import json
import unittest

class TestTranslateAPI(unittest.TestCase):
    BASE_URL = "http://127.0.0.1:5000/api/v1/translate"

    def test_translate_success(self):
        """测试翻译接口成功场景"""
        body = {
            "text": "Machine learning is a subset of artificial intelligence.",
            "output_format": "json",
            "include_vocabulary": True
        }
        response = requests.post(url=self.BASE_URL, json=body)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["success"])
        self.assertIn("translation", data)
        self.assertIn("vocabulary", data)

    def test_translate_empty_text(self):
        """测试文本为空时的错误场景"""
        body = {
            "text": "",
            "output_format": "json",
            "include_vocabulary": True
        }
        response = requests.post(url=self.BASE_URL, json=body)
        self.assertEqual(response.status_code, 400)
        data = response.json()
        self.assertFalse(data["success"])
        self.assertIn("error", data)

    def test_translate_missing_text(self):
        """测试缺少text字段时的错误场景"""
        body = {
            "output_format": "json",
            "include_vocabulary": True
        }
        response = requests.post(url=self.BASE_URL, json=body)
        self.assertEqual(response.status_code, 400)
        data = response.json()
        self.assertFalse(data["success"])
        self.assertIn("error", data)

    def test_translate_word_output(self):
        """测试输出格式为Word文档的场景"""
        body = {
            "text": "Machine learning is a subset of artificial intelligence.",
            "output_format": "word",
            "include_vocabulary": True
        }
        response = requests.post(url=self.BASE_URL, json=body)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["success"])
        self.assertIn("word_document_url", data)

if __name__ == "__main__":
    unittest.main()