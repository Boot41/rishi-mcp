from django.shortcuts import render
from django.http import JsonResponse
from django.views import View
import requests

class GetPRsView(View):
    def get(self, request):
        repo_url = request.GET.get('repo_url')
        if not repo_url:
            return JsonResponse({"error": "Repository URL is required"}, status=400)

        # Extract owner and repo name from the URL (e.g., "https://github.com/user/repo")
        try:
            parts = repo_url.rstrip('/').split('/')
            owner, repo = parts[-2], parts[-1]
        except ValueError:
            return JsonResponse({"error": "Invalid repository URL"}, status=400)

        # GitHub API endpoint to fetch pull requests
        api_url = f"{GITHUB_API_BASE}/repos/{owner}/{repo}/pulls"

        try:
            response = requests.get(api_url, headers={"Accept": "application/vnd.github.v3+json"})
            response.raise_for_status()
            prs = response.json()
        except requests.exceptions.RequestException as e:
            return JsonResponse({"error": f"GitHub API request failed: {str(e)}"}, status=500)

        # Extract relevant PR details
        pull_requests = [
            {
                "id": pr["id"],
                "title": pr["title"],
                "author": pr["user"]["login"],
                "html_url": pr["html_url"]
            }
            for pr in prs
        ]
        
        return JsonResponse({"pull_requests": pull_requests})

class ReviewPRView(View):
    def post(self, request):
        # Simulate MCP call for PR review (replace later)
        return JsonResponse({"message": "PR review initiated"})

class ChatView(View):
    def post(self, request):
        # Simulate chat with MCP agent (replace later)
        return JsonResponse({"response": "AI-generated response"})
