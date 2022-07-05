---
title: Blog Posts
layout: page
---


<div class="container pt-1">
  <div class="row">
    <div class="text-center">
      <ul class="paragraph" style="list-style-position:inside">
        {% for post in site.posts%}
          <li  class= "timenite-black">
          <span>{{ post.date | date: "%d %B %Y"}}</span> - <a href="{{ post.url }}">{{ post.title }}</a>
            {% endfor %}
          </li>
