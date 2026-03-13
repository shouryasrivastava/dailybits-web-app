"""
URL configuration for project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from api.views.auth_views import signup, login, get_profile, update_profile, list_users, delete_user
from api.views.problem_views import list_problems, get_single_problem, submit_problem, add_problem, delete_problem,update_problem, publish_problem
from api.views.tag_views import list_tags, list_tag_problems
from api.views.submission_views import list_submissions
# from api.views.chat_views import nl2sql # type: ignore
from api.views.admin_views import (
    admin_user_stats, admin_problem_stats,
    admin_dashboard_stats, admin_list_problems, admin_get_problem,
    admin_add_problem, admin_update_problem, admin_delete_problem,
    admin_toggle_user_admin, admin_list_algorithms,
)
from api.views.solution_views import get_solution, add_solution, update_solution
from api.views.todo_views import get_todo_list_view


urlpatterns = [
    # Authentication
    path("auth/signup/", signup),
    path("auth/login/", login),

    # User Profile
    path("profile/<int:account_number>/", get_profile),
    path("profile/<int:account_number>/update/", update_profile),

    # User
    path("users/", list_users),
    path("users/<int:account_number>/", delete_user),
   
    # Problem
    path("problems/<int:pid>/update/", update_problem),
    path("problems/<int:pid>/publish/", publish_problem),
    path("problems/<int:pid>/delete/", delete_problem),
    path("problems/<int:pid>/submit/", submit_problem),
    path("problems/add/", add_problem),
    path("problems/<int:pid>/", get_single_problem),
    path("problems/", list_problems),

    # Todo
    path("todo/", get_todo_list_view),

    # Solution
    path("solutions/<int:pId>/", get_solution),
    path("solutions/add/", add_solution),
    path("solutions/update/<int:pid>/", update_solution),

    # Submission 
    path("submissions/<int:account_number>/", list_submissions),

    # Admin (legacy analytics)
    path("admin/user-stats/", admin_user_stats),
    path("admin/problem-stats/", admin_problem_stats),

    # Admin (new — dashboard, problem CRUD, user management, algorithms)
    path("admin/dashboard-stats/", admin_dashboard_stats),
    path("admin/problems/", admin_list_problems),
    path("admin/problems/add/", admin_add_problem),
    path("admin/problems/<int:pid>/", admin_get_problem),
    path("admin/problems/<int:pid>/update/", admin_update_problem),
    path("admin/problems/<int:pid>/delete/", admin_delete_problem),
    path("admin/users/<int:account_number>/toggle-admin/", admin_toggle_user_admin),
    path("admin/algorithms/", admin_list_algorithms),

    # path("nl2sql/", nl2sql),
]
