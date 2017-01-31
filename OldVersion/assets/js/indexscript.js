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
