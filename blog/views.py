from django.db.models import Q
from django.core.paginator import Paginator
from django.shortcuts import render, get_object_or_404
from .models import BlogPost, Category
from .forms import NewsletterSignupForm
from core.models import NewsletterSubscriber
from django.core.mail import send_mail
from taggit.models import Tag



def blog_list(request):
    posts = BlogPost.objects.filter(published=True).order_by("-created_at")
    categories = Category.objects.all()
    current_category = request.GET.get("category")
    query = request.GET.get("q")

    title = "Our Blog - Avenue One Agency"
    description = "Read our latest posts on digital marketing, SEO, and more to stay ahead in the industry."
    search_message = None
    success = False

    if current_category:
        posts = posts.filter(category__slug=current_category)

    if query:
        posts = posts.filter(
            Q(title__icontains=query) |
            Q(content__icontains=query) |
            Q(meta_description__icontains=query)
        )
        count = posts.count()
        title = f"Search results for „{query}“ – Avenue One Agency"
        description = f"{count} result(s) for „{query}“ on our blog."
        search_message = f"{count} result(s) for „{query}“" if count else f"No results for „{query}“."

    paginator = Paginator(posts, 5)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    # 📨 Newsletter Signup Form Handling
    if request.method == "POST":
        form = NewsletterSignupForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data["email"]

            # Avoid duplicate entries
            if not NewsletterSubscriber.objects.filter(email=email).exists():
                NewsletterSubscriber.objects.create(email=email)


                # Send success email
                send_mail(
                    subject="🎉 Successfully subscribed to the newsletter",
                    message="Thank you for subscribing to our newsletter! You'll receive the latest updates and insights from our blog.",
                    from_email="avenueoneagency@gmail.com",
                    recipient_list=[email],
                    fail_silently=True,
                )

            success = True
            form = NewsletterSignupForm()  # Reset form
    else:
        form = NewsletterSignupForm()

    return render(request, "blog/blog_list.html", {
        "page_obj": page_obj,
        "categories": categories,
        "current_category": current_category,
        "query": query,
        "search_message": search_message,
        "custom_title": title,
        "custom_description": description,
        "form": form,
        "success": success,
    })
     


def blog_detail(request, slug):
    post = get_object_or_404(BlogPost, slug=slug, published=True)

    # Fetch related posts by same category, exclude current post
    related_posts = BlogPost.objects.filter(
        published=True,
        category=post.category
    ).exclude(id=post.id).order_by('-created_at')[:3]

    # Fallback: if less than 3, get recent posts
    if related_posts.count() < 3:
        fallback_posts = BlogPost.objects.filter(published=True).exclude(id=post.id).order_by('-created_at')[:3]
        related_posts = fallback_posts

    return render(request, "blog/blog_detail.html", {
        "post": post,
        "related_posts": related_posts,
    })


def blog_by_tag(request, tag_slug):
    tag = get_object_or_404(Tag, slug=tag_slug)
    posts = BlogPost.objects.filter(tags__in=[tag], published=True).order_by("-created_at")
    
    title = f"Posts tagged with „{tag.name}“ – Avenue One Agency"
    description = f"All blog posts tagged with „{tag.name}“."

    paginator = Paginator(posts, 5)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    return render(request, "blog/blog_list.html", {
        "page_obj": page_obj,
        "custom_title": title,
        "custom_description": description,
        "query": None,
        "current_category": None,
        "categories": Category.objects.all(),
        "search_message": f"{posts.count()} post(s) tagged with „{tag.name}“",
    })