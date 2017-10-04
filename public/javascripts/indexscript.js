/**

 * Copyright (c) 2007-2015 Ariel Flesler - aflesler<a>gmail<d>com | http://flesler.blogspot.com

 * Licensed under MIT

 * @author Ariel Flesler

 * @version 2.1.0

 */

;(function(l){'use strict';l(['jquery'],function($){var k=$.scrollTo=function(a,b,c){return $(window).scrollTo(a,b,c)};k.defaults={axis:'xy',duration:0,limit:true};function isWin(a){return!a.nodeName||$.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!==-1}$.fn.scrollTo=function(f,g,h){if(typeof g==='object'){h=g;g=0}if(typeof h==='function'){h={onAfter:h}}if(f==='max'){f=9e9}h=$.extend({},k.defaults,h);g=g||h.duration;var j=h.queue&&h.axis.length>1;if(j){g/=2}h.offset=both(h.offset);h.over=both(h.over);return this.each(function(){if(f===null)return;var d=isWin(this),elem=d?this.contentWindow||window:this,$elem=$(elem),targ=f,attr={},toff;switch(typeof targ){case'number':case'string':if(/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(targ)){targ=both(targ);break}targ=d?$(targ):$(targ,elem);if(!targ.length)return;case'object':if(targ.is||targ.style){toff=(targ=$(targ)).offset()}}var e=$.isFunction(h.offset)&&h.offset(elem,targ)||h.offset;$.each(h.axis.split(''),function(i,a){var b=a==='x'?'Left':'Top',pos=b.toLowerCase(),key='scroll'+b,prev=$elem[key](),max=k.max(elem,a);if(toff){attr[key]=toff[pos]+(d?0:prev-$elem.offset()[pos]);if(h.margin){attr[key]-=parseInt(targ.css('margin'+b),10)||0;attr[key]-=parseInt(targ.css('border'+b+'Width'),10)||0}attr[key]+=e[pos]||0;if(h.over[pos]){attr[key]+=targ[a==='x'?'width':'height']()*h.over[pos]}}else{var c=targ[pos];attr[key]=c.slice&&c.slice(-1)==='%'?parseFloat(c)/100*max:c}if(h.limit&&/^\d+$/.test(attr[key])){attr[key]=attr[key]<=0?0:Math.min(attr[key],max)}if(!i&&h.axis.length>1){if(prev===attr[key]){attr={}}else if(j){animate(h.onAfterFirst);attr={}}}});animate(h.onAfter);function animate(a){var b=$.extend({},h,{queue:true,duration:g,complete:a&&function(){a.call(elem,targ,h)}});$elem.animate(attr,b)}})};k.max=function(a,b){var c=b==='x'?'Width':'Height',scroll='scroll'+c;if(!isWin(a))return a[scroll]-$(a)[c.toLowerCase()]();var d='client'+c,doc=a.ownerDocument||a.document,html=doc.documentElement,body=doc.body;return Math.max(html[scroll],body[scroll])-Math.min(html[d],body[d])};function both(a){return $.isFunction(a)||$.isPlainObject(a)?a:{top:a,left:a}}$.Tween.propHooks.scrollLeft=$.Tween.propHooks.scrollTop={get:function(t){return $(t.elem)[t.prop]()},set:function(t){var a=this.get(t);if(t.options.interrupt&&t._last&&t._last!==a){return $(t.elem).stop()}var b=Math.round(t.now);if(a!==b){$(t.elem)[t.prop](b);t._last=this.get(t)}}};return k})}(typeof define==='function'&&define.amd?define:function(a,b){'use strict';if(typeof module!=='undefined'&&module.exports){module.exports=b(require('jquery'))}else{b(jQuery)}}));

/**

 * Copyright (c) 2007-2016 Ariel Flesler - aflesler<a>gmail<d>com | http://flesler.blogspot.com

 * Licensed under MIT

 * @author Ariel Flesler

 * @version 1.4.0

 */

;(function(a){if(typeof define==='function'&&define.amd){define(['jquery'],a)}else{a(jQuery)}}(function($){var g=location.href.replace(/#.*/,'');var h=$.localScroll=function(a){$('body').localScroll(a)};h.defaults={duration:1000,axis:'y',event:'click',stop:true,target:window};$.fn.localScroll=function(a){a=$.extend({},h.defaults,a);if(a.hash&&location.hash){if(a.target)window.scrollTo(0,0);scroll(0,location,a)}return a.lazy?this.on(a.event,'a,area',function(e){if(filter.call(this)){scroll(e,this,a)}}):this.find('a,area').filter(filter).bind(a.event,function(e){scroll(e,this,a)}).end().end();function filter(){return!!this.href&&!!this.hash&&this.href.replace(this.hash,'')===g&&(!a.filter||$(this).is(a.filter))}};h.hash=function(){};function scroll(e,a,b){var c=a.hash.slice(1),elem=document.getElementById(c)||document.getElementsByName(c)[0];if(!elem)return;if(e)e.preventDefault();var d=$(b.target);if(b.lock&&d.is(':animated')||b.onBefore&&b.onBefore(e,elem,d)===false)return;if(b.stop){d.stop(true)}if(b.hash){var f=elem.id===c?'id':'name',$a=$('<a> </a>').attr(f,c).css({position:'absolute',top:$(window).scrollTop(),left:$(window).scrollLeft()});elem[f]='';$('body').prepend($a);location.hash=a.hash;$a.remove();elem[f]=c}d.scrollTo(elem,b).trigger('notify.serialScroll',[elem])}return h}));

// Javascript for index page

//--------------------------------------------------------------------------
// GPL statement:
// This file is part of RDB.
//
// RDB is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// RDB is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with the RDB code.  If not, see <http://www.gnu.org/licenses/>.
//--------------------------------------------------------------------------

"use strict";

// Testimonials management
// TESTIMONIALS HERE
var TESTIMONIALS = [

    ["I can see the database being tremendously useful for research hopefuls.","James (Student)"],

    ["I like it! Been looking for something like this.","Brent (Student)"],

    ["The website seems very friendly and easy to use.","Student"],

    ["Great to have this all in one place!","Student"],

    ["Great program, well designed, aesthetically pleasing.","Student"],

    ["[A] great place to start one's search for a faculty research advisor.","Prof. Carl Hashimoto"],

    ["This is a great resource for both students and faculty. I especially appreciate the ability to do key word searches.","Prof. Steven M. Girvin"],

    ["...the most comprehensive, searchable directory of faculty research listings available to the Yale community to date.","Yale Daily News"]

];

// Handle testimonials block
var testimonialNum = TESTIMONIALS.length;
var thisone = Math.floor(Math.random() * testimonialNum); // Randomly chooses first one to show
// Initial load
$('#testimonials-item footer>p').text('"' + TESTIMONIALS[thisone][0] + '"');
$('#testimonials-item footer>cite').text("- " + TESTIMONIALS[thisone][1]);
// Testimonial changing function
function changeTestimonial() {
    thisone = (thisone + 1 ) % testimonialNum; // Advance to next testimonial, with looping
    $('#testimonials-item footer>p, #testimonials-item footer>cite').fadeOut(500,function() {
        $('#testimonials-item footer>p').text('"' + TESTIMONIALS[thisone][0] + '"').fadeIn(500);
        $('#testimonials-item footer>cite').text("- " + TESTIMONIALS[thisone][1]).fadeIn(500);
    });
}

// All main scripts
$(document).ready(function() {
    // Learn more button
    $('#learnmore').localScroll({duration:800});

    // Scroll to top button
    $('#back-top').hide();
    $(window).scroll(function() {
        if(($(this).scrollTop() > 900) && ((window.innerHeight + window.scrollY) < document.body.scrollHeight)){
            $('#back-top').fadeIn(300);
        }
        else{
            $('#back-top').fadeOut(300);
        }
    });
    $('#back-top').click(function() {
        $('body,html').animate({scrollTop:0}, 400);
    });

    // Testimonials
    setInterval(changeTestimonial, 3000);
});
