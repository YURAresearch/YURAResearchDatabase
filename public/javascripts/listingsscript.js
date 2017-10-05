// Javascript for listings page

// --------------------------------------------------------------------------
// GPL statement:
// This file is part of RDB.

// RDB is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// RDB is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with the RDB code.  If not, see <http://www.gnu.org/licenses/>.
// --------------------------------------------------------------------------
//

"use strict";

// Be nice :)
console.log("Welcome to RDB! If you are interested in how RDB works, or would like to use our framework for inspiration, feel free to reach out to us at yura@yale.edu.")

// Events setup functions for various js work after entries have loaded; called after list.js call to add
// (Re)check pages state and adjust prev/next buttons; Update highlighting
function checkPrevNext() {
    // Take care of hiding prev or next buttons, depending on pages and current page
    if ($('.active').length === 0) {
        // Check empty
        $('#next').css('visibility', 'hidden');
        $('#prev').css('visibility', 'hidden');
    }
    else {
        // Check next
        if ($('.active').next().length === 0) {
            $('#next').css('visibility', 'hidden');
        }
        else {
            $('#next').css('visibility', 'visible');
        }
        // Check prev
        if ($('.active').prev().length === 0) {
            $('#prev').css('visibility', 'hidden');
        }
        else {
            $('#prev').css('visibility', 'visible');
        }
    }
}

// Pagination events, back to top, and reset filters, etc.
function postEntryWork() {
    // Checking page buttons and add events
    checkPrevNext();
    $('#prev').click(function() {
        checkPrevNext();
    });
    $('#next').click(function() {
        checkPrevNext();
    });
    // Reset filters
    $('#reset-button-id').click(function() {
        checkPrevNext();
    });

    // Scroll to top button
    $('#back-top').hide();
    $(window).scroll(function() {
        if ($(this).scrollTop() > 300) {
            $('#back-top').fadeIn(300);
        }
        else {
            $('#back-top').fadeOut(300);
        }
    });
    $('#back-top').click(function() {
        $('body,html').animate({scrollTop:0}, 400);
    });
}

$(document).ready(function() {
        postEntryWork();
        console.log("RDB Listings ready!")
});
