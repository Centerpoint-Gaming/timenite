---
title: Blog Posts
layout: page
---


<div class="container pt-1">
  <ul class="paragraph">
    {% for post in site.posts%}
    <li class="timenite-black is-size-5">
      {{ post.date | date: "%d %B %Y"}} - <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    &nbsp;
    {% endfor %}
  </ul>
</div>

