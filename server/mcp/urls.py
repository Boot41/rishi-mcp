from django.urls import path
from .views import GetPRsView, ReviewPRView, ChatView

urlpatterns = [
    path('get-prs/', GetPRsView.as_view(), name='get_prs'),
    path('review-pr/', ReviewPRView.as_view(), name='review_pr'),
    path('chat/', ChatView.as_view(), name='chat'),
]
