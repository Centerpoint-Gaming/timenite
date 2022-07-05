---
layout: countdown
title: Countdown For Daily Item Shop
---



  <section class="item-shop hero container countdown-section is-fullheight">
    <div class="columns countdown-hours container is-vcentered">
      <div id="clock" class="column is-flex is-justify-content-center timenite-blue pt-4">
        <li class="has-text-centered"><span class="hours">00</span><p class="hours_text is-size-5 has-text-centered">Hours</p></li>
        <li class="pb-3 pr-3 pl-3 ">:</li>
        <li  class="has-text-centered"><span class="minutes">00</span><p class="minutes_text is-size-5 has-text-centered">Minutes</p></li>
        <li class="pb-3 pr-3 pl-3">:</li>
        <li  class="has-text-centered" ><span class="seconds">00</span><p class="seconds_text is-size-5 has-text-centered">Seconds</p></li>
      </div>
    </div>

    <div class="container columns">
      <div class="column is-hidden-mobile"></div>
      <div class="column"></div>
      <div class="has-text-left has-text-centered-mobile column">
        <p class="pt-1 is-size-4 paragraph timenite-blue">until</p>
        <h2 class="is-size-2 chapter-name  timenite-blue">Item Shop</h2>
        <p class="pt-1 is-size-3">resets again</p>
      </div>      
      <div class="column is-hidden-mobile"></div>

    </div>
  </section>


<section class="is-halfheight hero container">
  <div class="container p-4">
    <div class="support-section">
      <strong class="paragraph timenite-black is-size-5">
        When does the Daily Item Shop reset?
      </strong>

      <p class="paragraph timenite-black is-size-5 pt-2">
        Fortnite's Daily Item Shop currently resets every day at {{ site.data.setup.itemShopUpdateTime }} UTC. This is also what this countdown loops to. 
      </p>



    </div>
  </div>
</section>





